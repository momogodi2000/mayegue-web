import { databaseService } from './database.service';
import { syncService, SyncResult, SyncStatus } from './sync.service';

export interface OfflineCapabilities {
  storage: boolean;
  sync: boolean;
  notifications: boolean;
}

export interface OfflineSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  maxStorageSize: number; // MB
  enableNotifications: boolean;
  cacheStrategy: 'aggressive' | 'conservative' | 'minimal';
}

export class OfflineService {
  private initialized = false;
  private settings: OfflineSettings = {
    autoSync: true,
    syncInterval: 15, // 15 minutes
    maxStorageSize: 100, // 100 MB
    enableNotifications: true,
    cacheStrategy: 'conservative'
  };

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize IndexedDB
      await databaseService.initialize();
      
      // Load user settings
      await this.loadSettings();
      
      // Start sync service if enabled
      if (this.settings.autoSync) {
        await this.startAutoSync();
      }

      this.initialized = true;
      console.log('Offline service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize offline service:', error);
      throw error;
    }
  }

  private async loadSettings(): Promise<void> {
    try {
      const savedSettings = await databaseService.getSetting('offline_settings') as OfflineSettings;
      if (savedSettings) {
        this.settings = { ...this.settings, ...savedSettings };
      }
    } catch (error) {
      console.warn('Failed to load offline settings, using defaults:', error);
    }
  }

  async updateSettings(newSettings: Partial<OfflineSettings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    await databaseService.saveSetting('offline_settings', this.settings);
    
    // Restart auto sync if interval changed
    if (newSettings.autoSync !== undefined || newSettings.syncInterval !== undefined) {
      await this.startAutoSync();
    }
  }

  getSettings(): OfflineSettings {
    return { ...this.settings };
  }

  private async startAutoSync(): Promise<void> {
    if (!this.settings.autoSync) return;

    // Set up periodic sync
    setInterval(async () => {
      if (navigator.onLine) {
        try {
          await syncService.performFullSync();
        } catch (error) {
          console.error('Auto sync failed:', error);
        }
      }
    }, this.settings.syncInterval * 60 * 1000);
  }

  // Check if offline capabilities are available
  getCapabilities(): OfflineCapabilities {
    return {
      storage: 'indexedDB' in window,
      sync: 'serviceWorker' in navigator,
      notifications: 'Notification' in window && 'serviceWorker' in navigator
    };
  }

  // Data management methods
  async cacheEssentialData(): Promise<{ success: boolean; cached: number; errors: string[] }> {
    if (!this.initialized) {
      throw new Error('Offline service not initialized');
    }

    const errors: string[] = [];
    let cached = 0;

    try {
      // Cache based on strategy
      switch (this.settings.cacheStrategy) {
        case 'aggressive':
          cached += await this.cacheAllLessons();
          cached += await this.cacheAllDictionary();
          break;
        
        case 'conservative':
          cached += await this.cacheRecentLessons();
          cached += await this.cacheFrequentlyUsedWords();
          break;
        
        case 'minimal':
          cached += await this.cacheCurrentUserProgress();
          break;
      }

      return { success: errors.length === 0, cached, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown caching error');
      return { success: false, cached, errors };
    }
  }

  private async cacheAllLessons(): Promise<number> {
    try {
      const result = await syncService.syncLessons();
      return result.synced;
    } catch (error) {
      console.error('Failed to cache all lessons:', error);
      return 0;
    }
  }

  private async cacheAllDictionary(): Promise<number> {
    try {
      const result = await syncService.syncDictionary();
      return result.synced;
    } catch (error) {
      console.error('Failed to cache all dictionary:', error);
      return 0;
    }
  }

  private async cacheRecentLessons(): Promise<number> {
    // Cache lessons accessed in last 30 days
    try {
      const allLessons = await databaseService.getAll('lessons');
      const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const recentLessons = allLessons.filter(lesson => lesson.lastAccessed > cutoffTime);
      
      // If no recent lessons, cache some basic ones
      if (recentLessons.length === 0) {
        const result = await syncService.syncLessons();
        return Math.min(result.synced, 10); // Limit to 10 lessons
      }
      
      return recentLessons.length;
    } catch (error) {
      console.error('Failed to cache recent lessons:', error);
      return 0;
    }
  }

  private async cacheFrequentlyUsedWords(): Promise<number> {
    // Cache most frequently accessed words
    try {
      const allWords = await databaseService.getAll('dictionary');
      const sortedWords = allWords.sort((a, b) => b.lastAccessed - a.lastAccessed);
      const topWords = sortedWords.slice(0, 500); // Cache top 500 words
      
      return topWords.length;
    } catch (error) {
      console.error('Failed to cache frequently used words:', error);
      return 0;
    }
  }

  private async cacheCurrentUserProgress(): Promise<number> {
    try {
      const result = await syncService.syncUserData();
      return result.synced;
    } catch (error) {
      console.error('Failed to cache user progress:', error);
      return 0;
    }
  }

  // Storage management
  async getStorageInfo(): Promise<{
    used: number; // MB
    available: number; // MB
    breakdown: Record<string, number>; // MB per store
  }> {
    const storageBreakdown = await databaseService.getStorageSize();
    const totalBytes = Object.values(storageBreakdown).reduce((sum, size) => sum + size, 0);
    const usedMB = totalBytes / (1024 * 1024);

    // Estimate available space (this is approximate)
    const estimatedAvailableMB = this.settings.maxStorageSize - usedMB;

    const breakdownMB: Record<string, number> = {};
    for (const [store, bytes] of Object.entries(storageBreakdown)) {
      breakdownMB[store] = bytes / (1024 * 1024);
    }

    return {
      used: usedMB,
      available: Math.max(0, estimatedAvailableMB),
      breakdown: breakdownMB
    };
  }

  async cleanupStorage(): Promise<{ freed: number; errors: string[] }> {
    const errors: string[] = [];
    let freed = 0;

    try {
      const storageInfo = await this.getStorageInfo();
      
      if (storageInfo.used > this.settings.maxStorageSize * 0.8) { // 80% threshold
        // Clean up old data
        const cutoffTime = Date.now() - (90 * 24 * 60 * 60 * 1000); // 90 days
        
        // Remove old lessons that haven't been accessed
        const lessons = await databaseService.getAll('lessons');
        const oldLessons = lessons.filter(lesson => 
          lesson.lastAccessed < cutoffTime && !lesson.completed
        );
        
        for (const lesson of oldLessons) {
          await databaseService.delete('lessons', lesson.id);
          freed += 1;
        }

        // Remove old dictionary entries
        const dictionary = await databaseService.getAll('dictionary');
        const oldWords = dictionary.filter(word => word.lastAccessed < cutoffTime);
        
        // Keep the most frequently used words
        const sortedOldWords = oldWords.sort((a, b) => a.lastAccessed - b.lastAccessed);
        const wordsToRemove = sortedOldWords.slice(0, Math.floor(oldWords.length * 0.3));
        
        for (const word of wordsToRemove) {
          await databaseService.delete('dictionary', word.id);
          freed += 1;
        }
      }

      return { freed, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Cleanup failed');
      return { freed, errors };
    }
  }

  // Sync management
  async performSync(): Promise<SyncResult> {
    if (!this.initialized) {
      throw new Error('Offline service not initialized');
    }

    return syncService.performFullSync();
  }

  async getSyncStatus(): Promise<SyncStatus> {
    return syncService.getSyncStatus();
  }

  onSyncStatusChange(callback: (status: SyncStatus) => void): () => void {
    const unsubscribe = syncService.onOnlineStatusChange(async () => {
      const status = await this.getSyncStatus();
      callback(status);
    });

    return unsubscribe;
  }

  // Data export/import for backup
  async exportUserData(): Promise<string> {
    if (!this.initialized) {
      throw new Error('Offline service not initialized');
    }

    return databaseService.exportData();
  }

  async importUserData(jsonData: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Offline service not initialized');
    }

    return databaseService.importData(jsonData);
  }

  // Reset all offline data
  async resetOfflineData(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Offline service not initialized');
    }

    await databaseService.clearAllData();
    
    // Reset settings to defaults
    this.settings = {
      autoSync: true,
      syncInterval: 15,
      maxStorageSize: 100,
      enableNotifications: true,
      cacheStrategy: 'conservative'
    };
    
    await databaseService.saveSetting('offline_settings', this.settings);
  }

  // Prefetch content for offline use
  async prefetchForLanguage(language: string): Promise<{ success: boolean; cached: number }> {
    try {
      const lessons = await databaseService.getLessonsByLanguage(language);
      const words = await databaseService.searchDictionary('', language);
      
      return {
        success: true,
        cached: lessons.length + words.length
      };
    } catch (error) {
      console.error('Failed to prefetch for language:', error);
      return { success: false, cached: 0 };
    }
  }

  // Check if content is available offline
  async isContentAvailableOffline(contentId: string, type: 'lesson' | 'word'): Promise<boolean> {
    try {
      if (type === 'lesson') {
        const lesson = await databaseService.get('lessons', contentId);
        return lesson !== undefined;
      } else {
        const word = await databaseService.get('dictionary', contentId);
        return word !== undefined;
      }
    } catch (error) {
      console.error('Failed to check offline availability:', error);
      return false;
    }
  }

  // Get offline statistics
  async getOfflineStats(): Promise<{
    totalLessons: number;
    totalWords: number;
    userProgress: number;
    storageUsed: number; // MB
    lastSync: Date | null;
  }> {
    try {
      const [lessons, words, progress, storageInfo, syncStats] = await Promise.all([
        databaseService.getAll('lessons'),
        databaseService.getAll('dictionary'),
        databaseService.getAll('userProgress'),
        this.getStorageInfo(),
        syncService.getSyncStatistics()
      ]);

      return {
        totalLessons: lessons.length,
        totalWords: words.length,
        userProgress: progress.length,
        storageUsed: storageInfo.used,
        lastSync: syncStats.lastSyncTime ? new Date(syncStats.lastSyncTime) : null
      };
    } catch (error) {
      console.error('Failed to get offline stats:', error);
      return {
        totalLessons: 0,
        totalWords: 0,
        userProgress: 0,
        storageUsed: 0,
        lastSync: null
      };
    }
  }
}

// Export singleton instance
export const offlineService = new OfflineService();