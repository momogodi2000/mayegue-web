export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: SyncEntity;
  entityId: string;
  data: any;
  userId: string;
  timestamp: Date;
  status: SyncStatus;
  retryCount: number;
  lastError?: string;
  priority: SyncPriority;
  dependencies?: string[]; // IDs of operations that must complete first
}

export type SyncEntity = 
  | 'user_progress'
  | 'achievements'
  | 'notifications'
  | 'user_preferences'
  | 'study_sessions'
  | 'quiz_results'
  | 'lesson_progress'
  | 'user_content'
  | 'analytics_events';

export type SyncStatus = 
  | 'pending'
  | 'syncing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'conflict';

export type SyncPriority = 'low' | 'normal' | 'high' | 'critical';

export interface SyncConflict {
  id: string;
  operationId: string;
  entity: SyncEntity;
  entityId: string;
  localData: any;
  remoteData: any;
  conflictType: ConflictType;
  timestamp: Date;
  resolved: boolean;
  resolution?: ConflictResolution;
}

export type ConflictType = 
  | 'concurrent_update'
  | 'delete_update'
  | 'version_mismatch'
  | 'schema_change';

export interface ConflictResolution {
  strategy: 'local_wins' | 'remote_wins' | 'merge' | 'manual';
  resolvedData: any;
  resolvedBy: string;
  resolvedAt: Date;
}

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingOperations: number;
  failedOperations: number;
  syncProgress: number; // 0-100
  currentOperation?: SyncOperation;
  errors: SyncError[];
  conflicts: SyncConflict[];
}

export interface SyncError {
  id: string;
  operationId: string;
  error: string;
  timestamp: Date;
  retryable: boolean;
  retryAfter?: Date;
}

export interface SyncConfiguration {
  enabled: boolean;
  autoSync: boolean;
  syncInterval: number; // milliseconds
  maxRetries: number;
  retryDelay: number; // milliseconds
  batchSize: number;
  conflictResolution: {
    defaultStrategy: 'local_wins' | 'remote_wins' | 'prompt_user';
    autoResolveTypes: ConflictType[];
  };
  entities: {
    [K in SyncEntity]: {
      enabled: boolean;
      priority: SyncPriority;
      syncDirection: 'bidirectional' | 'upload_only' | 'download_only';
      conflictResolution?: 'local_wins' | 'remote_wins' | 'merge';
    };
  };
}

export interface SyncMetadata {
  entityId: string;
  entity: SyncEntity;
  version: number;
  lastModified: Date;
  lastSynced?: Date;
  checksum: string;
  syncStatus: 'synced' | 'modified' | 'new' | 'deleted';
}

export interface SyncBatch {
  id: string;
  operations: SyncOperation[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  progress: number;
  errors: SyncError[];
}

export interface SyncStats {
  totalOperations: number;
  completedOperations: number;
  failedOperations: number;
  conflictedOperations: number;
  averageSyncTime: number;
  lastSyncDuration: number;
  dataTransferred: {
    uploaded: number; // bytes
    downloaded: number; // bytes
  };
  entityStats: {
    [K in SyncEntity]: {
      operations: number;
      conflicts: number;
      lastSync: Date | null;
    };
  };
}

export interface OfflineQueue {
  id: string;
  operations: SyncOperation[];
  maxSize: number;
  currentSize: number;
  oldestOperation?: Date;
  newestOperation?: Date;
}

export interface SyncEvent {
  type: 'sync_started' | 'sync_completed' | 'sync_failed' | 'conflict_detected' | 'operation_completed' | 'connection_changed';
  timestamp: Date;
  data?: any;
  operationId?: string;
  error?: string;
}

export interface NetworkStatus {
  isOnline: boolean;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  downlink: number;
  rtt: number;
  saveData: boolean;
}
