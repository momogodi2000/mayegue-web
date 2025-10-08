import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  ArrowPathIcon,
  CloudIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/ui';
import { useSyncStore } from '../store/syncStore';
import type { SyncConfiguration } from '../types/sync.types';
import toast from 'react-hot-toast';

interface SyncSettingsProps {
  onClose: () => void;
  onSave: () => void;
}

export const SyncSettings: React.FC<SyncSettingsProps> = ({
  onClose,
  onSave
}) => {
  const {
    syncConfig,
    syncState,
    updateConfiguration,
    clearQueue,
    pauseSync,
    resumeSync
  } = useSyncStore();

  const [localConfig, setLocalConfig] = useState<SyncConfiguration>(syncConfig);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalConfig(syncConfig);
  }, [syncConfig]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateConfiguration(localConfig);
      onSave();
      toast.success('Configuration sauvegardée');
    } catch (error) {
      console.error('Error saving sync configuration:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleClearQueue = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider la file de synchronisation ?')) {
      return;
    }

    try {
      setLoading(true);
      await clearQueue();
      toast.success('File de synchronisation vidée');
    } catch (error) {
      console.error('Error clearing queue:', error);
      toast.error('Erreur lors du vidage de la file');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoSync = async () => {
    try {
      if (localConfig.autoSync) {
        await pauseSync();
      } else {
        await resumeSync();
      }
      setLocalConfig({ ...localConfig, autoSync: !localConfig.autoSync });
    } catch (error) {
      console.error('Error toggling auto sync:', error);
      toast.error('Erreur lors du changement de configuration');
    }
  };

  const updateEntityConfig = (entity: keyof SyncConfiguration['entities'], field: string, value: any) => {
    setLocalConfig({
      ...localConfig,
      entities: {
        ...localConfig.entities,
        [entity]: {
          ...localConfig.entities[entity],
          [field]: value
        }
      }
    });
  };

  const entityLabels = {
    user_progress: 'Progression utilisateur',
    achievements: 'Succès et récompenses',
    notifications: 'Notifications',
    user_preferences: 'Préférences utilisateur',
    study_sessions: 'Sessions d\'étude',
    quiz_results: 'Résultats de quiz',
    lesson_progress: 'Progression des leçons',
    user_content: 'Contenu utilisateur',
    analytics_events: 'Événements analytiques'
  };

  const priorityLabels = {
    low: 'Faible',
    normal: 'Normale',
    high: 'Élevée',
    critical: 'Critique'
  };

  const directionLabels = {
    bidirectional: 'Bidirectionnelle',
    upload_only: 'Envoi uniquement',
    download_only: 'Réception uniquement'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Paramètres de synchronisation
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* General Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Paramètres généraux
              </h3>
              
              <div className="space-y-4">
                {/* Enable Sync */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Synchronisation activée
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Activer ou désactiver la synchronisation
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localConfig.enabled}
                    onChange={(e) => setLocalConfig({ ...localConfig, enabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                {/* Auto Sync */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Synchronisation automatique
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Synchroniser automatiquement en arrière-plan
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localConfig.autoSync}
                    onChange={handleToggleAutoSync}
                    disabled={!localConfig.enabled}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                {/* Sync Interval */}
                {localConfig.autoSync && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Intervalle de synchronisation (secondes)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="3600"
                      value={localConfig.syncInterval / 1000}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        syncInterval: parseInt(e.target.value) * 1000
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {/* Batch Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Taille des lots
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={localConfig.batchSize}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      batchSize: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Max Retries */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre maximum de tentatives
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={localConfig.maxRetries}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      maxRetries: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Entity Configuration */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Configuration par type de données
              </h3>
              
              <div className="space-y-4">
                {Object.entries(localConfig.entities).map(([entity, config]) => (
                  <div key={entity} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {entityLabels[entity as keyof typeof entityLabels]}
                      </h4>
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => updateEntityConfig(
                          entity as keyof SyncConfiguration['entities'],
                          'enabled',
                          e.target.checked
                        )}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    
                    {config.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Priority */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Priorité
                          </label>
                          <select
                            value={config.priority}
                            onChange={(e) => updateEntityConfig(
                              entity as keyof SyncConfiguration['entities'],
                              'priority',
                              e.target.value
                            )}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            {Object.entries(priorityLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Sync Direction */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Direction
                          </label>
                          <select
                            value={config.syncDirection}
                            onChange={(e) => updateEntityConfig(
                              entity as keyof SyncConfiguration['entities'],
                              'syncDirection',
                              e.target.value
                            )}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            {Object.entries(directionLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Conflict Resolution */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Résolution des conflits
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stratégie par défaut
                </label>
                <select
                  value={localConfig.conflictResolution.defaultStrategy}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    conflictResolution: {
                      ...localConfig.conflictResolution,
                      defaultStrategy: e.target.value as any
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="local_wins">Local gagne</option>
                  <option value="remote_wins">Distant gagne</option>
                  <option value="prompt_user">Demander à l'utilisateur</option>
                </select>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                Zone dangereuse
              </h3>
              
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-100">
                        Vider la file de synchronisation
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Supprime toutes les opérations en attente. Cette action est irréversible.
                      </p>
                    </div>
                    <Button
                      onClick={handleClearQueue}
                      disabled={loading || syncState.pendingOperations === 0}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/30"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Vider ({syncState.pendingOperations})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              'Sauvegarder'
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
