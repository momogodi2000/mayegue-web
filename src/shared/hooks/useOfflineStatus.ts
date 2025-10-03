/**
 * Hook for managing offline status and functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { databaseService } from '@/core/services/offline/database.service';

interface OfflineStatus {
  isOnline: boolean;
  isOffline: boolean;
  lastOnline: Date | null;
  syncQueue: any[];
  storageSize: Record<string, number>;
  canSync: boolean;
}

export function useOfflineStatus() {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
    lastOnline: null,
    syncQueue: [],
    storageSize: {},
    canSync: false
  });

  const updateStatus = useCallback(async () => {
    const isOnline = navigator.onLine;
    const syncQueue = await databaseService.getSyncQueue();
    const storageSize = await databaseService.getStorageSize();
    
    setStatus(prev => ({
      ...prev,
      isOnline,
      isOffline: !isOnline,
      lastOnline: isOnline ? new Date() : prev.lastOnline,
      syncQueue,
      storageSize,
      canSync: isOnline && syncQueue.length > 0
    }));
  }, []);

  const syncData = useCallback(async () => {
    if (!status.canSync) return;
    
    try {
      // This would integrate with your sync service
      console.log('Syncing offline data...', status.syncQueue);
      // await syncService.syncOfflineData();
      await updateStatus();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }, [status.canSync, status.syncQueue, updateStatus]);

  const clearOfflineData = useCallback(async () => {
    try {
      await databaseService.clearAllData();
      await updateStatus();
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }, [updateStatus]);

  const exportOfflineData = useCallback(async () => {
    try {
      return await databaseService.exportData();
    } catch (error) {
      console.error('Failed to export offline data:', error);
      return null;
    }
  }, []);

  const importOfflineData = useCallback(async (json: string) => {
    try {
      await databaseService.importData(json);
      await updateStatus();
    } catch (error) {
      console.error('Failed to import offline data:', error);
    }
  }, [updateStatus]);

  useEffect(() => {
    // Initial status update
    updateStatus();

    // Listen for online/offline events
    const handleOnline = () => updateStatus();
    const handleOffline = () => updateStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic status updates
    const interval = setInterval(updateStatus, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [updateStatus]);

  return {
    ...status,
    syncData,
    clearOfflineData,
    exportOfflineData,
    importOfflineData,
    updateStatus
  };
}
