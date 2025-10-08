import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  BellIcon,
  BellSlashIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/ui';
import { fcmService } from '../services/fcm.service';
import type { NotificationPreferences } from '../types/notification.types';
import toast from 'react-hot-toast';

interface NotificationSettingsProps {
  onClose: () => void;
  onSave: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onClose,
  onSave
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    loadPreferences();
    setPermissionStatus(fcmService.getPermissionStatus());
  }, []);

  const loadPreferences = () => {
    try {
      let prefs = fcmService.getPreferences();
      
      if (!prefs) {
        // Create default preferences
        const user = { id: 'current_user' }; // This should come from auth service
        prefs = fcmService.getDefaultPreferences(user.id);
      }
      
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    try {
      setLoading(true);
      await fcmService.updatePreferences(preferences);
      onSave();
      toast.success('Préférences sauvegardées');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    try {
      setLoading(true);
      const token = await fcmService.requestPermission();
      
      if (token) {
        setPermissionStatus('granted');
        toast.success('Notifications activées !');
        
        // Update preferences to enable notifications
        if (preferences) {
          setPreferences({
            ...preferences,
            enabled: true,
            channels: {
              ...preferences.channels,
              push: true
            }
          });
        }
      } else {
        toast.error('Permission refusée');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast.error('Erreur lors de l\'activation');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = (category: keyof NotificationPreferences['categories'], enabled: boolean) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      categories: {
        ...preferences.categories,
        [category]: enabled
      }
    });
  };

  const updateChannel = (channel: keyof NotificationPreferences['channels'], enabled: boolean) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      channels: {
        ...preferences.channels,
        [channel]: enabled
      }
    });
  };

  const updateQuietHours = (field: string, value: any) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      quietHours: {
        ...preferences.quietHours,
        [field]: value
      }
    });
  };

  const categoryLabels = {
    achievement: 'Succès et récompenses',
    lesson: 'Nouvelles leçons',
    quiz: 'Quiz et évaluations',
    reminder: 'Rappels d\'étude',
    social: 'Activité sociale',
    system: 'Mises à jour système',
    marketing: 'Promotions et offres',
    announcement: 'Annonces importantes',
    progress: 'Progression d\'apprentissage',
    goal: 'Objectifs et défis'
  };

  const categoryDescriptions = {
    achievement: 'Notifications quand vous débloquez des succès',
    lesson: 'Alertes pour les nouvelles leçons disponibles',
    quiz: 'Rappels pour les quiz en attente',
    reminder: 'Rappels quotidiens pour maintenir votre série',
    social: 'Interactions avec d\'autres apprenants',
    system: 'Mises à jour de l\'application',
    marketing: 'Offres spéciales et promotions',
    announcement: 'Annonces importantes de l\'équipe',
    progress: 'Résumés de vos progrès',
    goal: 'Rappels d\'objectifs et nouveaux défis'
  };

  if (!preferences) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Paramètres de notification
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
            {/* Permission Status */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {permissionStatus === 'granted' ? (
                    <BellIcon className="w-6 h-6 text-green-600" />
                  ) : (
                    <BellSlashIcon className="w-6 h-6 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Statut des notifications
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {permissionStatus === 'granted' 
                        ? 'Notifications activées' 
                        : permissionStatus === 'denied'
                        ? 'Notifications bloquées'
                        : 'Notifications non configurées'
                      }
                    </p>
                  </div>
                </div>
                {permissionStatus !== 'granted' && (
                  <Button
                    onClick={handleRequestPermission}
                    disabled={loading}
                    size="sm"
                  >
                    Activer
                  </Button>
                )}
              </div>
            </div>

            {/* Master Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Notifications générales
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Activer ou désactiver toutes les notifications
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.enabled}
                onChange={(e) => 
                  setPreferences({ ...preferences, enabled: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {preferences.enabled && (
              <>
                {/* Categories */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Types de notifications
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(preferences.categories).map(([category, enabled]) => (
                      <div key={category} className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {categoryLabels[category as keyof typeof categoryLabels]}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {categoryDescriptions[category as keyof typeof categoryDescriptions]}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => 
                            updateCategory(category as keyof NotificationPreferences['categories'], e.target.checked)
                          }
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Canaux de notification
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <DevicePhoneMobileIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Notifications push
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Notifications instantanées sur votre appareil
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.channels.push}
                        onChange={(e) => updateChannel('push', e.target.checked)}
                        disabled={permissionStatus !== 'granted'}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ComputerDesktopIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Notifications dans l'app
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Notifications visibles dans l'application
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.channels.inApp}
                        onChange={(e) => updateChannel('inApp', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Notifications par email
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Résumés hebdomadaires par email
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.channels.email}
                        onChange={(e) => updateChannel('email', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Quiet Hours */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Heures de silence
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Activer les heures de silence
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Pas de notifications pendant certaines heures
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.quietHours.enabled}
                        onChange={(e) => updateQuietHours('enabled', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>

                    {preferences.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4 ml-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Début
                          </label>
                          <input
                            type="time"
                            value={preferences.quietHours.start}
                            onChange={(e) => updateQuietHours('start', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fin
                          </label>
                          <input
                            type="time"
                            value={preferences.quietHours.end}
                            onChange={(e) => updateQuietHours('end', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Notification */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Tester les notifications
                      </h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Envoyez-vous une notification de test
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fcmService.sendTestNotification()}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30"
                    >
                      Envoyer test
                    </Button>
                  </div>
                </div>
              </>
            )}
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
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
