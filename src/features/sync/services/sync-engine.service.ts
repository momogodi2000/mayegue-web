import { sqliteService } from '@/core/services/offline/sqlite.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { fcmService } from '@/features/notifications/services/fcm.service';
import type {
  SyncOperation,
  SyncState,
  SyncConfiguration,
  SyncConflict,
  SyncBatch,
  SyncStats,
  SyncEvent,
  NetworkStatus,
  SyncMetadata,
  OfflineQueue
} from '../types/sync.types';
// Simple event emitter for browser compatibility
class SimpleEventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args));
    }
  }

  removeAllListeners() {
    this.events = {};
  }
}

export class SyncEngineService extends SimpleEventEmitter {
  private syncState: SyncState;
  private syncConfig: SyncConfiguration;
  private offlineQueue: OfflineQueue;
  private syncInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private networkStatus: NetworkStatus;

  constructor() {
    super();
    
    this.syncState = {
      isOnline: navigator.onLine,
      isSyncing: false,
      lastSyncTime: null,
      pendingOperations: 0,
      failedOperations: 0,
      syncProgress: 0,
      errors: [],
      conflicts: []
    };

    this.syncConfig = this.getDefaultConfiguration();
    this.offlineQueue = {
      id: 'main_queue',
      operations: [],
      maxSize: 1000,
      currentSize: 0
    };

    this.networkStatus = {
      isOnline: navigator.onLine,
      connectionType: 'unknown',
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      saveData: false
    };

    this.initialize();
  }

  /**
   * Initialize the sync engine
   */
  private async initialize() {
    try {
      // Load configuration from storage
      await this.loadConfiguration();
      
      // Load offline queue
      await this.loadOfflineQueue();
      
      // Set up network monitoring
      this.setupNetworkMonitoring();
      
      // Set up auto-sync if enabled
      if (this.syncConfig.autoSync) {
        this.startAutoSync();
      }

      this.isInitialized = true;
      this.emit('initialized');
      
      console.log('🔄 Sync Engine initialized');
    } catch (error) {
      console.error('Error initializing sync engine:', error);
      this.emit('error', error);
    }
  }

  /**
   * Queue a sync operation
   */
  async queueOperation(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'status' | 'retryCount' | 'userId'>): Promise<string> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const syncOperation: SyncOperation = {
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        status: 'pending',
        retryCount: 0,
        ...operation,
        userId: user.id
      };

      // Add to offline queue
      this.offlineQueue.operations.push(syncOperation);
      this.offlineQueue.currentSize++;
      
      // Update sync state
      this.syncState.pendingOperations++;
      
      // Save queue to storage
      await this.saveOfflineQueue();
      
      // Emit event
      this.emitSyncEvent({
        type: 'operation_completed',
        operationId: syncOperation.id,
        data: { operation: syncOperation }
      });

      // Try immediate sync if online
      if (this.syncState.isOnline && !this.syncState.isSyncing) {
        this.triggerSync();
      }

      return syncOperation.id;
    } catch (error) {
      console.error('Error queueing sync operation:', error);
      throw error;
    }
  }

  /**
   * Start synchronization
   */
  async startSync(): Promise<void> {
    if (this.syncState.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    if (!this.syncState.isOnline) {
      console.log('Cannot sync while offline');
      return;
    }

    try {
      this.syncState.isSyncing = true;
      this.syncState.syncProgress = 0;
      this.syncState.currentOperation = undefined;
      
      this.emitSyncEvent({ type: 'sync_started' });

      // Get pending operations
      const pendingOps = this.offlineQueue.operations.filter(op => 
        op.status === 'pending' || op.status === 'failed'
      );

      if (pendingOps.length === 0) {
        console.log('No pending operations to sync');
        this.completSync();
        return;
      }

      // Create sync batches
      const batches = this.createSyncBatches(pendingOps);
      
      // Process batches sequentially
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        await this.processSyncBatch(batch);
        
        // Update progress
        this.syncState.syncProgress = ((i + 1) / batches.length) * 100;
      }

      this.completSync();
    } catch (error) {
      console.error('Sync failed:', error);
      this.failSync(error as Error);
    }
  }

  /**
   * Process a sync batch
   */
  private async processSyncBatch(batch: SyncBatch): Promise<void> {
    try {
      batch.status = 'processing';
      batch.startedAt = new Date();

      for (const operation of batch.operations) {
        try {
          this.syncState.currentOperation = operation;
          operation.status = 'syncing';

          await this.processSyncOperation(operation);
          
          operation.status = 'completed';
          this.syncState.pendingOperations--;
          
          // Update batch progress
          const completedOps = batch.operations.filter(op => op.status === 'completed').length;
          batch.progress = (completedOps / batch.operations.length) * 100;
          
        } catch (error) {
          console.error(`Error processing operation ${operation.id}:`, error);
          operation.status = 'failed';
          operation.retryCount++;
          operation.lastError = (error as Error).message;
          
          this.syncState.failedOperations++;
          batch.errors.push({
            id: `error_${Date.now()}`,
            operationId: operation.id,
            error: (error as Error).message,
            timestamp: new Date(),
            retryable: operation.retryCount < this.syncConfig.maxRetries
          });
        }
      }

      batch.status = 'completed';
      batch.completedAt = new Date();
    } catch (error) {
      batch.status = 'failed';
      throw error;
    }
  }

  /**
   * Process individual sync operation
   */
  private async processSyncOperation(operation: SyncOperation): Promise<void> {
    switch (operation.entity) {
      case 'user_progress':
        await this.syncUserProgress(operation);
        break;
      case 'achievements':
        await this.syncAchievements(operation);
        break;
      case 'notifications':
        await this.syncNotifications(operation);
        break;
      case 'study_sessions':
        await this.syncStudySessions(operation);
        break;
      case 'quiz_results':
        await this.syncQuizResults(operation);
        break;
      case 'analytics_events':
        await this.syncAnalyticsEvents(operation);
        break;
      default:
        throw new Error(`Unsupported entity type: ${operation.entity}`);
    }
  }

  /**
   * Sync user progress data
   */
  private async syncUserProgress(operation: SyncOperation): Promise<void> {
    // For now, just log the operation - in production this would sync with Firebase
    console.log('Syncing user progress:', operation);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In a real implementation, this would:
    // 1. Upload local changes to Firebase
    // 2. Download remote changes from Firebase
    // 3. Resolve conflicts if any
    // 4. Update local SQLite database
  }

  /**
   * Sync achievements data
   */
  private async syncAchievements(operation: SyncOperation): Promise<void> {
    console.log('Syncing achievements:', operation);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Sync notifications data
   */
  private async syncNotifications(operation: SyncOperation): Promise<void> {
    console.log('Syncing notifications:', operation);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Sync study sessions data
   */
  private async syncStudySessions(operation: SyncOperation): Promise<void> {
    console.log('Syncing study sessions:', operation);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Sync quiz results data
   */
  private async syncQuizResults(operation: SyncOperation): Promise<void> {
    console.log('Syncing quiz results:', operation);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Sync analytics events data
   */
  private async syncAnalyticsEvents(operation: SyncOperation): Promise<void> {
    console.log('Syncing analytics events:', operation);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Create sync batches from operations
   */
  private createSyncBatches(operations: SyncOperation[]): SyncBatch[] {
    const batches: SyncBatch[] = [];
    const batchSize = this.syncConfig.batchSize;

    // Sort operations by priority and timestamp
    const sortedOps = operations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp.getTime() - b.timestamp.getTime();
    });

    // Create batches
    for (let i = 0; i < sortedOps.length; i += batchSize) {
      const batchOps = sortedOps.slice(i, i + batchSize);
      batches.push({
        id: `batch_${Date.now()}_${i}`,
        operations: batchOps,
        status: 'pending',
        progress: 0,
        errors: []
      });
    }

    return batches;
  }

  /**
   * Complete sync process
   */
  private completSync(): void {
    this.syncState.isSyncing = false;
    this.syncState.lastSyncTime = new Date();
    this.syncState.syncProgress = 100;
    this.syncState.currentOperation = undefined;

    // Remove completed operations from queue
    this.offlineQueue.operations = this.offlineQueue.operations.filter(
      op => op.status !== 'completed'
    );
    this.offlineQueue.currentSize = this.offlineQueue.operations.length;

    // Save updated queue
    this.saveOfflineQueue();

    this.emitSyncEvent({ type: 'sync_completed' });
    console.log('✅ Sync completed successfully');
  }

  /**
   * Handle sync failure
   */
  private failSync(error: Error): void {
    this.syncState.isSyncing = false;
    this.syncState.currentOperation = undefined;
    
    this.syncState.errors.push({
      id: `error_${Date.now()}`,
      operationId: 'sync_process',
      error: error.message,
      timestamp: new Date(),
      retryable: true
    });

    this.emitSyncEvent({ 
      type: 'sync_failed', 
      error: error.message 
    });
    
    console.error('❌ Sync failed:', error);
  }

  /**
   * Trigger sync (debounced)
   */
  private triggerSync = this.debounce(() => {
    this.startSync();
  }, 1000);

  /**
   * Set up network monitoring
   */
  private setupNetworkMonitoring(): void {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.syncState.isOnline = true;
      this.networkStatus.isOnline = true;
      this.emitSyncEvent({ type: 'connection_changed', data: { online: true } });
      
      // Trigger sync when coming back online
      if (this.offlineQueue.operations.length > 0) {
        this.triggerSync();
      }
    });

    window.addEventListener('offline', () => {
      this.syncState.isOnline = false;
      this.networkStatus.isOnline = false;
      this.emitSyncEvent({ type: 'connection_changed', data: { online: false } });
    });

    // Monitor network quality if supported
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkInfo = () => {
        this.networkStatus.effectiveType = connection.effectiveType || 'unknown';
        this.networkStatus.downlink = connection.downlink || 0;
        this.networkStatus.rtt = connection.rtt || 0;
        this.networkStatus.saveData = connection.saveData || false;
      };

      connection.addEventListener('change', updateNetworkInfo);
      updateNetworkInfo();
    }
  }

  /**
   * Start auto-sync interval
   */
  private startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.syncState.isOnline && !this.syncState.isSyncing && this.offlineQueue.operations.length > 0) {
        this.startSync();
      }
    }, this.syncConfig.syncInterval);
  }

  /**
   * Stop auto-sync interval
   */
  private stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Load configuration from storage
   */
  private async loadConfiguration(): Promise<void> {
    try {
      const stored = localStorage.getItem('sync_configuration');
      if (stored) {
        this.syncConfig = { ...this.syncConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading sync configuration:', error);
    }
  }

  /**
   * Save configuration to storage
   */
  private async saveConfiguration(): Promise<void> {
    try {
      localStorage.setItem('sync_configuration', JSON.stringify(this.syncConfig));
    } catch (error) {
      console.error('Error saving sync configuration:', error);
    }
  }

  /**
   * Load offline queue from storage
   */
  private async loadOfflineQueue(): Promise<void> {
    try {
      const stored = localStorage.getItem('offline_sync_queue');
      if (stored) {
        const queueData = JSON.parse(stored);
        this.offlineQueue.operations = queueData.operations.map((op: any) => ({
          ...op,
          timestamp: new Date(op.timestamp)
        }));
        this.offlineQueue.currentSize = this.offlineQueue.operations.length;
        this.syncState.pendingOperations = this.offlineQueue.operations.filter(
          op => op.status === 'pending'
        ).length;
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  /**
   * Save offline queue to storage
   */
  private async saveOfflineQueue(): Promise<void> {
    try {
      localStorage.setItem('offline_sync_queue', JSON.stringify({
        operations: this.offlineQueue.operations,
        currentSize: this.offlineQueue.currentSize
      }));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  /**
   * Get default configuration
   */
  private getDefaultConfiguration(): SyncConfiguration {
    return {
      enabled: true,
      autoSync: true,
      syncInterval: 30000, // 30 seconds
      maxRetries: 3,
      retryDelay: 5000, // 5 seconds
      batchSize: 10,
      conflictResolution: {
        defaultStrategy: 'local_wins',
        autoResolveTypes: ['concurrent_update']
      },
      entities: {
        user_progress: {
          enabled: true,
          priority: 'high',
          syncDirection: 'bidirectional',
          conflictResolution: 'merge'
        },
        achievements: {
          enabled: true,
          priority: 'normal',
          syncDirection: 'bidirectional'
        },
        notifications: {
          enabled: true,
          priority: 'normal',
          syncDirection: 'download_only'
        },
        user_preferences: {
          enabled: true,
          priority: 'normal',
          syncDirection: 'bidirectional'
        },
        study_sessions: {
          enabled: true,
          priority: 'high',
          syncDirection: 'upload_only'
        },
        quiz_results: {
          enabled: true,
          priority: 'high',
          syncDirection: 'upload_only'
        },
        lesson_progress: {
          enabled: true,
          priority: 'high',
          syncDirection: 'bidirectional'
        },
        user_content: {
          enabled: true,
          priority: 'normal',
          syncDirection: 'bidirectional'
        },
        analytics_events: {
          enabled: true,
          priority: 'low',
          syncDirection: 'upload_only'
        }
      }
    };
  }

  /**
   * Emit sync event
   */
  private emitSyncEvent(event: Omit<SyncEvent, 'timestamp'>): void {
    const syncEvent: SyncEvent = {
      ...event,
      timestamp: new Date()
    };
    
    this.emit('sync_event', syncEvent);
  }

  /**
   * Debounce utility
   */
  private debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Public API methods

  /**
   * Get current sync state
   */
  getSyncState(): SyncState {
    return { ...this.syncState };
  }

  /**
   * Get sync configuration
   */
  getConfiguration(): SyncConfiguration {
    return { ...this.syncConfig };
  }

  /**
   * Update sync configuration
   */
  async updateConfiguration(config: Partial<SyncConfiguration>): Promise<void> {
    this.syncConfig = { ...this.syncConfig, ...config };
    await this.saveConfiguration();
    
    // Restart auto-sync if interval changed
    if (config.autoSync !== undefined || config.syncInterval !== undefined) {
      this.stopAutoSync();
      if (this.syncConfig.autoSync) {
        this.startAutoSync();
      }
    }
  }

  /**
   * Force sync now
   */
  async forcSync(): Promise<void> {
    if (!this.syncState.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    await this.startSync();
  }

  /**
   * Clear sync queue
   */
  async clearQueue(): Promise<void> {
    this.offlineQueue.operations = [];
    this.offlineQueue.currentSize = 0;
    this.syncState.pendingOperations = 0;
    await this.saveOfflineQueue();
  }

  /**
   * Get sync statistics
   */
  getSyncStats(): SyncStats {
    const operations = this.offlineQueue.operations;
    
    return {
      totalOperations: operations.length,
      completedOperations: operations.filter(op => op.status === 'completed').length,
      failedOperations: operations.filter(op => op.status === 'failed').length,
      conflictedOperations: operations.filter(op => op.status === 'conflict').length,
      averageSyncTime: 0, // Would calculate from historical data
      lastSyncDuration: 0, // Would track actual sync duration
      dataTransferred: {
        uploaded: 0, // Would track actual bytes
        downloaded: 0
      },
      entityStats: {
        user_progress: { operations: 0, conflicts: 0, lastSync: null },
        achievements: { operations: 0, conflicts: 0, lastSync: null },
        notifications: { operations: 0, conflicts: 0, lastSync: null },
        user_preferences: { operations: 0, conflicts: 0, lastSync: null },
        study_sessions: { operations: 0, conflicts: 0, lastSync: null },
        quiz_results: { operations: 0, conflicts: 0, lastSync: null },
        lesson_progress: { operations: 0, conflicts: 0, lastSync: null },
        user_content: { operations: 0, conflicts: 0, lastSync: null },
        analytics_events: { operations: 0, conflicts: 0, lastSync: null }
      }
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopAutoSync();
    this.removeAllListeners();
  }
}

export const syncEngineService = new SyncEngineService();
