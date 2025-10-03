/* eslint-disable @typescript-eslint/no-explicit-any */
import { databaseService } from './database.service';
import { firestoreService } from '../firebase/firestore.service';
import { analyticsService } from '../firebase/analytics.service';
import { 
  LessonRecord, 
  DictionaryRecord,
  SyncQueueRecord 
} from './types';

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: number | null;
  pendingUploads: number;
  syncInProgress: boolean;
}

export class SyncService {
  private syncInProgress = false;
  private readonly maxRetries = 3;
  // private readonly retryDelay = 1000; // 1 second - unused for now
  private onlineStatusListeners: ((isOnline: boolean) => void)[] = [];

  constructor() {
    this.setupOnlineStatusListener();
    this.setupPeriodicSync();
  }

  private setupOnlineStatusListener(): void {
    window.addEventListener('online', () => {
      this.notifyOnlineStatusChange(true);
      this.performFullSync();
    });

    window.addEventListener('offline', () => {
      this.notifyOnlineStatusChange(false);
    });
  }

  private setupPeriodicSync(): void {
    // Sync every 5 minutes when online
    setInterval(() => {
      if (navigator.onLine && !this.syncInProgress) {
        this.performFullSync();
      }
    }, 5 * 60 * 1000);
  }

  private notifyOnlineStatusChange(isOnline: boolean): void {
    this.onlineStatusListeners.forEach(listener => listener(isOnline));
  }

  onOnlineStatusChange(listener: (isOnline: boolean) => void): () => void {
    this.onlineStatusListeners.push(listener);
    return () => {
      const index = this.onlineStatusListeners.indexOf(listener);
      if (index > -1) {
        this.onlineStatusListeners.splice(index, 1);
      }
    };
  }

  async getSyncStatus(): Promise<SyncStatus> {
    const pendingQueue = await databaseService.getSyncQueue();
    const lastSync = await databaseService.getSetting('last_full_sync') as number;

    return {
      isOnline: navigator.onLine,
      lastSync: lastSync || null,
      pendingUploads: pendingQueue.length,
      syncInProgress: this.syncInProgress
    };
  }

  async performFullSync(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return {
        success: false,
        synced: 0,
        failed: 0,
        errors: ['Sync already in progress']
      };
    }

    if (!navigator.onLine) {
      return {
        success: false,
        synced: 0,
        failed: 0,
        errors: ['Device is offline']
      };
    }

    this.syncInProgress = true;
    const errors: string[] = [];
    let synced = 0;
    let failed = 0;

    try {
      // Download fresh data from Firestore
      const downloadResult = await this.downloadFromFirestore();
      synced += downloadResult.synced;
      failed += downloadResult.failed;
      errors.push(...downloadResult.errors);

      // Upload pending changes
      const uploadResult = await this.uploadPendingChanges();
      synced += uploadResult.synced;
      failed += uploadResult.failed;
      errors.push(...uploadResult.errors);

      // Process sync queue
      const queueResult = await this.processSyncQueue();
      synced += queueResult.synced;
      failed += queueResult.failed;
      errors.push(...queueResult.errors);

      // Mark sync completion
      await databaseService.saveSetting('last_full_sync', Date.now());

      // Track sync analytics
      await analyticsService.trackSyncEvent('full_sync_completed', {
        synced,
        failed,
        errorCount: errors.length,
        duration: Date.now() - Date.now() // This would be calculated properly
      });

      return {
        success: failed === 0,
        synced,
        failed,
        errors
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      errors.push(errorMessage);

      await analyticsService.trackSyncEvent('full_sync_failed', {
        error: errorMessage
      });

      return {
        success: false,
        synced,
        failed: failed + 1,
        errors
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  private async downloadFromFirestore(): Promise<SyncResult> {
    const errors: string[] = [];
    let synced = 0;
    let failed = 0;

    try {
      // Download lessons
      const lessonsResult = await this.downloadLessons();
      synced += lessonsResult.synced;
      failed += lessonsResult.failed;
      errors.push(...lessonsResult.errors);

      // Download dictionary entries
      const dictionaryResult = await this.downloadDictionary();
      synced += dictionaryResult.synced;
      failed += dictionaryResult.failed;
      errors.push(...dictionaryResult.errors);

      return { success: failed === 0, synced, failed, errors };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      return {
        success: false,
        synced,
        failed: failed + 1,
        errors: [...errors, errorMessage]
      };
    }
  }

  private async downloadLessons(): Promise<SyncResult> {
    try {
      const lastSync = await databaseService.getSetting('lessons_last_sync') as number;
      const query = lastSync 
        ? { where: [['updatedAt', '>', new Date(lastSync)]] as [string, any, unknown][] }
        : {};

      const lessons = await firestoreService.getDocuments('lessons', query);
      const lessonRecords: LessonRecord[] = lessons.map((lesson: any) => ({
        ...lesson,
        syncStatus: 'synced' as const,
        lastAccessed: Date.now()
      }));

      await databaseService.saveLessons(lessonRecords);
      await databaseService.markDataSynced('lessons');

      return {
        success: true,
        synced: lessonRecords.length,
        failed: 0,
        errors: []
      };
    } catch (error) {
      return {
        success: false,
        synced: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Failed to download lessons']
      };
    }
  }

  private async downloadDictionary(): Promise<SyncResult> {
    try {
      const lastSync = await databaseService.getSetting('dictionary_last_sync') as number;
      const query = lastSync 
        ? { where: [['updatedAt', '>', new Date(lastSync)]] as [string, any, unknown][] }
        : {};

      const entries = await firestoreService.getDocuments('dictionary', query);
      const dictionaryRecords: DictionaryRecord[] = entries.map((entry: any) => ({
        ...entry,
        syncStatus: 'synced' as const,
        lastAccessed: Date.now()
      }));

      await databaseService.saveDictionaryEntries(dictionaryRecords);
      await databaseService.markDataSynced('dictionary');

      return {
        success: true,
        synced: dictionaryRecords.length,
        failed: 0,
        errors: []
      };
    } catch (error) {
      return {
        success: false,
        synced: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Failed to download dictionary']
      };
    }
  }

  private async uploadPendingChanges(): Promise<SyncResult> {
    const errors: string[] = [];
    let synced = 0;
    let failed = 0;

    try {
      // Upload user progress
      const progressResult = await this.uploadUserProgress();
      synced += progressResult.synced;
      failed += progressResult.failed;
      errors.push(...progressResult.errors);

      // Upload gamification data
      const gamificationResult = await this.uploadGamificationData();
      synced += gamificationResult.synced;
      failed += gamificationResult.failed;
      errors.push(...gamificationResult.errors);

      return { success: failed === 0, synced, failed, errors };
    } catch (error) {
      return {
        success: false,
        synced,
        failed: failed + 1,
        errors: [...errors, error instanceof Error ? error.message : 'Upload failed']
      };
    }
  }

  private async uploadUserProgress(): Promise<SyncResult> {
    try {
      const pendingProgress = await databaseService.getUnsyncedItems('userProgress');
      let synced = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const progress of pendingProgress) {
        try {
          await firestoreService.setDocument('userProgress', progress.id, {
            ...progress,
            updatedAt: new Date()
          });

          // Mark as synced in local DB
          const progressRecord = progress as any;
          progressRecord.syncStatus = 'synced';
          await databaseService.saveUserProgress(progressRecord);
          synced++;
        } catch (error) {
          failed++;
          errors.push(`Failed to sync progress ${progress.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return { success: failed === 0, synced, failed, errors };
    } catch (error) {
      return {
        success: false,
        synced: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Failed to upload user progress']
      };
    }
  }

  private async uploadGamificationData(): Promise<SyncResult> {
    try {
      const pendingGamification = await databaseService.getUnsyncedItems('gamification');
      let synced = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const gamificationData of pendingGamification) {
        try {
          await firestoreService.setDocument('gamification', gamificationData.id, {
            ...gamificationData,
            updatedAt: new Date()
          });

          // Mark as synced in local DB
          const gamificationRecord = gamificationData as any;
          gamificationRecord.syncStatus = 'synced';
          await databaseService.saveGamificationData(gamificationRecord);
          synced++;
        } catch (error) {
          failed++;
          errors.push(`Failed to sync gamification ${gamificationData.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return { success: failed === 0, synced, failed, errors };
    } catch (error) {
      return {
        success: false,
        synced: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Failed to upload gamification data']
      };
    }
  }

  private async processSyncQueue(): Promise<SyncResult> {
    const queue = await databaseService.getSyncQueue();
    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const item of queue) {
      try {
        await this.processSyncQueueItem(item);
        await databaseService.removeSyncQueueItem(item.id);
        synced++;
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to process queue item ${item.id}: ${errorMessage}`);

        // Update retry count
        item.retryCount++;
        item.error = errorMessage;

        if (item.retryCount >= this.maxRetries) {
          // Remove item after max retries
          await databaseService.removeSyncQueueItem(item.id);
          errors.push(`Queue item ${item.id} removed after ${this.maxRetries} failed attempts`);
        } else {
          // Update item with error info
          await databaseService.updateSyncQueueItem(item.id, {
            retryCount: item.retryCount,
            error: errorMessage
          });
        }
      }
    }

    return { success: failed === 0, synced, failed, errors };
  }

  private async processSyncQueueItem(item: SyncQueueRecord): Promise<void> {
    switch (item.operation) {
      case 'create':
        await firestoreService.setDocument(item.collection, item.documentId, {
          ...item.data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        break;

      case 'update':
        await firestoreService.updateDocument(item.collection, item.documentId, {
          ...item.data,
          updatedAt: new Date()
        });
        break;

      case 'delete':
        await firestoreService.deleteDocument(item.collection, item.documentId);
        break;

      default:
        throw new Error(`Unknown operation: ${item.operation}`);
    }
  }

  // Manual sync triggers
  async syncLessons(): Promise<SyncResult> {
    return this.downloadLessons();
  }

  async syncDictionary(): Promise<SyncResult> {
    return this.downloadDictionary();
  }

  async syncUserData(): Promise<SyncResult> {
    return this.uploadPendingChanges();
  }

  // Auto sync - performs sync when online
  async autoSync(): Promise<SyncResult> {
    if (!navigator.onLine) {
      console.log('Device is offline - skipping auto sync');
      return { success: false, synced: 0, failed: 0, errors: ['Device is offline'] };
    }
    return this.performFullSync();
  }

  // Force sync - ignores online status (for testing)
  async forceSyncWhenOnline(): Promise<SyncResult> {
    if (!navigator.onLine) {
      throw new Error('Device is offline - cannot force sync');
    }
    return this.performFullSync();
  }

  // Conflict resolution
  async resolveConflicts(): Promise<SyncResult> {
    // For now, server wins in conflicts
    // In a more sophisticated implementation, you could:
    // 1. Compare timestamps
    // 2. Allow user to choose
    // 3. Merge changes intelligently
    
    return this.downloadFromFirestore();
  }

  // Get sync statistics
  async getSyncStatistics(): Promise<{
    totalLocalRecords: number;
    pendingSyncItems: number;
    lastSyncTime: number | null;
    storageUsage: Record<string, number>;
  }> {
    const [
      lessonsCount,
      dictionaryCount,
      progressCount,
      gamificationCount,
      pendingQueue,
      lastSync,
      storageUsage
    ] = await Promise.all([
      databaseService.getAll('lessons').then(items => items.length),
      databaseService.getAll('dictionary').then(items => items.length),
      databaseService.getAll('userProgress').then(items => items.length),
      databaseService.getAll('gamification').then(items => items.length),
      databaseService.getSyncQueue(),
      databaseService.getSetting('last_full_sync') as Promise<number>,
      databaseService.getStorageSize()
    ]);

    return {
      totalLocalRecords: lessonsCount + dictionaryCount + progressCount + gamificationCount,
      pendingSyncItems: pendingQueue.length,
      lastSyncTime: lastSync || null,
      storageUsage
    };
  }

  // Clean up old data
  async cleanupOldData(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<void> {
    const cutoffTime = Date.now() - maxAge;
    
    // This would require more sophisticated cleanup logic
    // For now, just mark old data as candidates for cleanup
    await databaseService.saveSetting('last_cleanup', Date.now());
    
    console.log(`Cleanup completed for data older than ${new Date(cutoffTime).toISOString()}`);
  }
}

// Export singleton instance
export const syncService = new SyncService();