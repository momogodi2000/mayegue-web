import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowPathIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  WifiIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';
import { Button, Progress } from '@/shared/components/ui';
import { useSyncStore } from '../store/syncStore';
import { SyncSettings } from './SyncSettings';

interface SyncStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ 
  className = '',
  showDetails = false 
}) => {
  const {
    syncState,
    syncStats,
    showSyncStatus,
    showSyncSettings,
    initializeSync,
    startSync,
    pauseSync,
    resumeSync,
    setShowSyncStatus,
    setShowSyncSettings,
    refreshStats
  } = useSyncStore();

  useEffect(() => {
    initializeSync();
  }, [initializeSync]);

  useEffect(() => {
    // Refresh stats periodically
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, [refreshStats]);

  const getSyncStatusIcon = () => {
    if (!syncState.isOnline) {
      return <SignalSlashIcon className="w-5 h-5 text-gray-400" />;
    }
    
    if (syncState.isSyncing) {
      return <ArrowPathIcon className="w-5 h-5 text-blue-600 animate-spin" />;
    }
    
    if (syncState.failedOperations > 0) {
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    }
    
    if (syncState.pendingOperations > 0) {
      return <CloudIcon className="w-5 h-5 text-yellow-600" />;
    }
    
    return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
  };

  const getSyncStatusText = () => {
    if (!syncState.isOnline) {
      return 'Hors ligne';
    }
    
    if (syncState.isSyncing) {
      return `Synchronisation... ${Math.round(syncState.syncProgress)}%`;
    }
    
    if (syncState.failedOperations > 0) {
      return `${syncState.failedOperations} erreur${syncState.failedOperations > 1 ? 's' : ''}`;
    }
    
    if (syncState.pendingOperations > 0) {
      return `${syncState.pendingOperations} en attente`;
    }
    
    if (syncState.lastSyncTime) {
      const timeDiff = Date.now() - syncState.lastSyncTime.getTime();
      const minutes = Math.floor(timeDiff / (1000 * 60));
      if (minutes < 1) {
        return 'Synchronisé';
      } else if (minutes < 60) {
        return `Synchronisé il y a ${minutes}m`;
      } else {
        const hours = Math.floor(minutes / 60);
        return `Synchronisé il y a ${hours}h`;
      }
    }
    
    return 'Prêt';
  };

  const getSyncStatusColor = () => {
    if (!syncState.isOnline) return 'text-gray-600 dark:text-gray-400';
    if (syncState.isSyncing) return 'text-blue-600 dark:text-blue-400';
    if (syncState.failedOperations > 0) return 'text-red-600 dark:text-red-400';
    if (syncState.pendingOperations > 0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const handleSyncAction = async () => {
    if (!syncState.isOnline) return;
    
    if (syncState.isSyncing) {
      await pauseSync();
    } else {
      await startSync();
    }
  };

  if (showSyncSettings) {
    return (
      <SyncSettings
        onClose={() => setShowSyncSettings(false)}
        onSave={() => {
          setShowSyncSettings(false);
          refreshStats();
        }}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Sync Status Button */}
      <button
        onClick={() => setShowSyncStatus(!showSyncStatus)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={getSyncStatusText()}
      >
        {getSyncStatusIcon()}
        {showDetails && (
          <span className={`text-sm font-medium ${getSyncStatusColor()}`}>
            {getSyncStatusText()}
          </span>
        )}
      </button>

      {/* Sync Status Panel */}
      <AnimatePresence>
        {showSyncStatus && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowSyncStatus(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    État de synchronisation
                  </h3>
                  <button
                    onClick={() => setShowSyncSettings(true)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Connection Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {syncState.isOnline ? (
                      <WifiIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <SignalSlashIcon className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Connexion
                    </span>
                  </div>
                  <span className={`text-sm ${syncState.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {syncState.isOnline ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>

                {/* Sync Progress */}
                {syncState.isSyncing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Progression
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(syncState.syncProgress)}%
                      </span>
                    </div>
                    <Progress value={syncState.syncProgress} className="h-2" />
                    {syncState.currentOperation && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {syncState.currentOperation.entity}: {syncState.currentOperation.type}
                      </p>
                    )}
                  </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {syncStats.totalOperations}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {syncStats.completedOperations}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Terminées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {syncState.pendingOperations}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">En attente</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {syncState.failedOperations}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Échouées</div>
                  </div>
                </div>

                {/* Last Sync */}
                {syncState.lastSyncTime && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dernière synchronisation
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {syncState.lastSyncTime.toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}

                {/* Errors */}
                {syncState.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-600">
                      Erreurs récentes
                    </h4>
                    <div className="max-h-20 overflow-y-auto space-y-1">
                      {syncState.errors.slice(-3).map((error) => (
                        <div key={error.id} className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                          {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conflicts */}
                {syncState.conflicts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-orange-600">
                      Conflits à résoudre
                    </h4>
                    <div className="text-sm text-orange-600">
                      {syncState.conflicts.length} conflit{syncState.conflicts.length > 1 ? 's' : ''} nécessite{syncState.conflicts.length > 1 ? 'nt' : ''} votre attention
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleSyncAction}
                    disabled={!syncState.isOnline}
                    size="sm"
                    className="flex-1"
                  >
                    {syncState.isSyncing ? (
                      <>
                        <XCircleIcon className="w-4 h-4 mr-2" />
                        Arrêter
                      </>
                    ) : (
                      <>
                        <ArrowPathIcon className="w-4 h-4 mr-2" />
                        Synchroniser
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => setShowSyncSettings(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
