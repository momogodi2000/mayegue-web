import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { syncEngineService } from '../services/sync-engine.service';
import type { 
  SyncState, 
  SyncConfiguration, 
  SyncStats,
  SyncEvent,
  SyncOperation
} from '../types/sync.types';
import toast from 'react-hot-toast';

interface SyncStoreState {
  // Sync state
  syncState: SyncState;
  syncConfig: SyncConfiguration;
  syncStats: SyncStats;
  
  // UI state
  showSyncStatus: boolean;
  showSyncSettings: boolean;
  
  // Actions
  initializeSync: () => Promise<void>;
  startSync: () => Promise<void>;
  pauseSync: () => Promise<void>;
  resumeSync: () => Promise<void>;
  clearQueue: () => Promise<void>;
  
  // Configuration
  updateConfiguration: (config: Partial<SyncConfiguration>) => Promise<void>;
  
  // Queue operations
  queueUserProgress: (data: any) => Promise<void>;
  queueAchievement: (data: any) => Promise<void>;
  queueStudySession: (data: any) => Promise<void>;
  queueQuizResult: (data: any) => Promise<void>;
  queueAnalyticsEvent: (data: any) => Promise<void>;
  
  // UI actions
  setShowSyncStatus: (show: boolean) => void;
  setShowSyncSettings: (show: boolean) => void;
  
  // Utility
  refreshStats: () => void;
  handleSyncEvent: (event: SyncEvent) => void;
}

export const useSyncStore = create<SyncStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        syncState: {
          isOnline: navigator.onLine,
          isSyncing: false,
          lastSyncTime: null,
          pendingOperations: 0,
          failedOperations: 0,
          syncProgress: 0,
          errors: [],
          conflicts: []
        },
        syncConfig: {
          enabled: true,
          autoSync: true,
          syncInterval: 30000,
          maxRetries: 3,
          retryDelay: 5000,
          batchSize: 10,
          conflictResolution: {
            defaultStrategy: 'local_wins',
            autoResolveTypes: ['concurrent_update']
          },
          entities: {
            user_progress: { enabled: true, priority: 'high', syncDirection: 'bidirectional' },
            achievements: { enabled: true, priority: 'normal', syncDirection: 'bidirectional' },
            notifications: { enabled: true, priority: 'normal', syncDirection: 'download_only' },
            user_preferences: { enabled: true, priority: 'normal', syncDirection: 'bidirectional' },
            study_sessions: { enabled: true, priority: 'high', syncDirection: 'upload_only' },
            quiz_results: { enabled: true, priority: 'high', syncDirection: 'upload_only' },
            lesson_progress: { enabled: true, priority: 'high', syncDirection: 'bidirectional' },
            user_content: { enabled: true, priority: 'normal', syncDirection: 'bidirectional' },
            analytics_events: { enabled: true, priority: 'low', syncDirection: 'upload_only' }
          }
        },
        syncStats: {
          totalOperations: 0,
          completedOperations: 0,
          failedOperations: 0,
          conflictedOperations: 0,
          averageSyncTime: 0,
          lastSyncDuration: 0,
          dataTransferred: { uploaded: 0, downloaded: 0 },
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
        },
        showSyncStatus: false,
        showSyncSettings: false,

        // Initialize sync engine
        initializeSync: async () => {
          try {
            // Set up event listeners
            syncEngineService.on('sync_event', (event: SyncEvent) => {
              get().handleSyncEvent(event);
            });

            // Load initial state
            const syncState = syncEngineService.getSyncState();
            const syncConfig = syncEngineService.getConfiguration();
            const syncStats = syncEngineService.getSyncStats();

            set({ syncState, syncConfig, syncStats });
            
            console.log('🔄 Sync store initialized');
          } catch (error) {
            console.error('Error initializing sync:', error);
            toast.error('Erreur lors de l\'initialisation de la synchronisation');
          }
        },

        // Start sync
        startSync: async () => {
          try {
            await syncEngineService.forcSync();
            toast.success('Synchronisation démarrée');
          } catch (error) {
            console.error('Error starting sync:', error);
            toast.error('Erreur lors du démarrage de la synchronisation');
          }
        },

        // Pause sync
        pauseSync: async () => {
          try {
            await syncEngineService.updateConfiguration({ autoSync: false });
            get().refreshStats();
            toast.success('Synchronisation automatique désactivée');
          } catch (error) {
            console.error('Error pausing sync:', error);
            toast.error('Erreur lors de la pause de la synchronisation');
          }
        },

        // Resume sync
        resumeSync: async () => {
          try {
            await syncEngineService.updateConfiguration({ autoSync: true });
            get().refreshStats();
            toast.success('Synchronisation automatique activée');
          } catch (error) {
            console.error('Error resuming sync:', error);
            toast.error('Erreur lors de la reprise de la synchronisation');
          }
        },

        // Clear sync queue
        clearQueue: async () => {
          try {
            await syncEngineService.clearQueue();
            get().refreshStats();
            toast.success('File de synchronisation vidée');
          } catch (error) {
            console.error('Error clearing queue:', error);
            toast.error('Erreur lors du vidage de la file');
          }
        },

        // Update configuration
        updateConfiguration: async (config: Partial<SyncConfiguration>) => {
          try {
            await syncEngineService.updateConfiguration(config);
            const updatedConfig = syncEngineService.getConfiguration();
            set({ syncConfig: updatedConfig });
            toast.success('Configuration mise à jour');
          } catch (error) {
            console.error('Error updating configuration:', error);
            toast.error('Erreur lors de la mise à jour de la configuration');
          }
        },

        // Queue user progress
        queueUserProgress: async (data: any) => {
          try {
            await syncEngineService.queueOperation({
              type: 'update',
              entity: 'user_progress',
              entityId: data.userId || 'current_user',
              data,
              priority: 'high'
            });
            get().refreshStats();
          } catch (error) {
            console.error('Error queueing user progress:', error);
          }
        },

        // Queue achievement
        queueAchievement: async (data: any) => {
          try {
            await syncEngineService.queueOperation({
              type: 'create',
              entity: 'achievements',
              entityId: data.id,
              data,
              priority: 'normal'
            });
            get().refreshStats();
          } catch (error) {
            console.error('Error queueing achievement:', error);
          }
        },

        // Queue study session
        queueStudySession: async (data: any) => {
          try {
            await syncEngineService.queueOperation({
              type: 'create',
              entity: 'study_sessions',
              entityId: data.id,
              data,
              priority: 'high'
            });
            get().refreshStats();
          } catch (error) {
            console.error('Error queueing study session:', error);
          }
        },

        // Queue quiz result
        queueQuizResult: async (data: any) => {
          try {
            await syncEngineService.queueOperation({
              type: 'create',
              entity: 'quiz_results',
              entityId: data.id,
              data,
              priority: 'high'
            });
            get().refreshStats();
          } catch (error) {
            console.error('Error queueing quiz result:', error);
          }
        },

        // Queue analytics event
        queueAnalyticsEvent: async (data: any) => {
          try {
            await syncEngineService.queueOperation({
              type: 'create',
              entity: 'analytics_events',
              entityId: data.id,
              data,
              priority: 'low'
            });
            get().refreshStats();
          } catch (error) {
            console.error('Error queueing analytics event:', error);
          }
        },

        // Set show sync status
        setShowSyncStatus: (show: boolean) => {
          set({ showSyncStatus: show });
        },

        // Set show sync settings
        setShowSyncSettings: (show: boolean) => {
          set({ showSyncSettings: show });
        },

        // Refresh statistics
        refreshStats: () => {
          const syncState = syncEngineService.getSyncState();
          const syncConfig = syncEngineService.getConfiguration();
          const syncStats = syncEngineService.getSyncStats();
          set({ syncState, syncConfig, syncStats });
        },

        // Handle sync events
        handleSyncEvent: (event: SyncEvent) => {
          const { syncState } = get();
          
          switch (event.type) {
            case 'sync_started':
              set({
                syncState: {
                  ...syncState,
                  isSyncing: true,
                  syncProgress: 0
                }
              });
              break;

            case 'sync_completed':
              set({
                syncState: {
                  ...syncState,
                  isSyncing: false,
                  lastSyncTime: event.timestamp,
                  syncProgress: 100
                }
              });
              get().refreshStats();
              break;

            case 'sync_failed':
              set({
                syncState: {
                  ...syncState,
                  isSyncing: false,
                  errors: [
                    ...syncState.errors,
                    {
                      id: `error_${Date.now()}`,
                      operationId: event.operationId || 'unknown',
                      error: event.error || 'Unknown error',
                      timestamp: event.timestamp,
                      retryable: true
                    }
                  ]
                }
              });
              toast.error('Erreur de synchronisation');
              break;

            case 'connection_changed':
              set({
                syncState: {
                  ...syncState,
                  isOnline: event.data?.online || false
                }
              });
              
              if (event.data?.online) {
                toast.success('Connexion rétablie - Synchronisation en cours');
              } else {
                toast.error('Connexion perdue - Mode hors ligne activé');
              }
              break;

            case 'operation_completed':
              get().refreshStats();
              break;

            case 'conflict_detected':
              set({
                syncState: {
                  ...syncState,
                  conflicts: [
                    ...syncState.conflicts,
                    event.data
                  ]
                }
              });
              toast.error('Conflit de synchronisation détecté');
              break;
          }
        }
      }),
      {
        name: 'sync-store',
        partialize: (state) => ({
          // Only persist configuration
          syncConfig: state.syncConfig,
          showSyncStatus: state.showSyncStatus
        })
      }
    ),
    {
      name: 'sync-store'
    }
  )
);
