import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { Button, Badge } from '@/shared/components/ui';
import { enhancedAdminService, type SecurityAlert } from '../services/enhanced-admin.service';
import toast from 'react-hot-toast';

interface SecurityAlertsPanelProps {
  className?: string;
}

export const SecurityAlertsPanel: React.FC<SecurityAlertsPanelProps> = ({
  className = ''
}) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadSecurityAlerts();
  }, []);

  const loadSecurityAlerts = async () => {
    try {
      setLoading(true);
      const securityAlerts = await enhancedAdminService.getSecurityAlerts();
      setAlerts(securityAlerts);
    } catch (error) {
      console.error('Error loading security alerts:', error);
      toast.error('Erreur lors du chargement des alertes de sécurité');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAlert = (alert: SecurityAlert) => {
    setSelectedAlert(alert);
    setShowDetailModal(true);
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      // Mock resolution - in real app, this would call the service
      const updatedAlerts = alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, resolved: true, resolvedAt: new Date(), resolvedBy: 'current_admin' }
          : alert
      );
      setAlerts(updatedAlerts);
      toast.success('Alerte résolue avec succès');
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Erreur lors de la résolution de l\'alerte');
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ShieldExclamationIcon className="w-5 h-5 text-red-600" />;
      case 'high':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'danger',
      high: 'danger',
      medium: 'warning',
      low: 'info'
    } as const;

    const labels = {
      critical: 'Critique',
      high: 'Élevé',
      medium: 'Moyen',
      low: 'Faible'
    };

    return (
      <Badge variant={variants[severity as keyof typeof variants] || 'secondary'}>
        {labels[severity as keyof typeof labels] || severity}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suspicious_login':
        return <UserIcon className="w-5 h-5 text-orange-600" />;
      case 'multiple_failed_attempts':
        return <LockClosedIcon className="w-5 h-5 text-red-600" />;
      case 'unusual_activity':
        return <ComputerDesktopIcon className="w-5 h-5 text-yellow-600" />;
      case 'data_breach_attempt':
        return <ShieldExclamationIcon className="w-5 h-5 text-red-700" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      suspicious_login: 'Connexion suspecte',
      multiple_failed_attempts: 'Tentatives multiples échouées',
      unusual_activity: 'Activité inhabituelle',
      data_breach_attempt: 'Tentative de violation de données'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      return `il y a ${Math.floor(diffInMinutes / 60)} h`;
    } else {
      return `il y a ${Math.floor(diffInMinutes / 1440)} j`;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterStatus === 'resolved' && !alert.resolved) return false;
    if (filterStatus === 'unresolved' && alert.resolved) return false;
    return true;
  });

  const unresolvedCritical = alerts.filter(alert => !alert.resolved && alert.severity === 'critical').length;
  const unresolvedHigh = alerts.filter(alert => !alert.resolved && alert.severity === 'high').length;
  const totalUnresolved = alerts.filter(alert => !alert.resolved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Alertes de sécurité
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Surveillez et gérez les incidents de sécurité
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {unresolvedCritical > 0 && (
            <Badge variant="danger">
              {unresolvedCritical} critique{unresolvedCritical > 1 ? 's' : ''}
            </Badge>
          )}
          {unresolvedHigh > 0 && (
            <Badge variant="warning">
              {unresolvedHigh} élevé{unresolvedHigh > 1 ? 's' : ''}
            </Badge>
          )}
          <Badge variant="info">
            {totalUnresolved} non résolue{totalUnresolved > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {unresolvedCritical > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ShieldExclamationIcon className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Alertes critiques non résolues
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {unresolvedCritical} alerte{unresolvedCritical > 1 ? 's' : ''} critique{unresolvedCritical > 1 ? 's' : ''} nécessite{unresolvedCritical > 1 ? 'nt' : ''} une attention immédiate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gravité
            </label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les gravités</option>
              <option value="critical">Critique</option>
              <option value="high">Élevé</option>
              <option value="medium">Moyen</option>
              <option value="low">Faible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="unresolved">Non résolues</option>
              <option value="resolved">Résolues</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={loadSecurityAlerts}
              variant="outline"
              className="w-full"
            >
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 ${
                alert.severity === 'critical' ? 'border-l-red-600' :
                alert.severity === 'high' ? 'border-l-red-500' :
                alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
              } border-r border-t border-b border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow ${
                alert.resolved ? 'opacity-75' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {alert.title}
                        </h3>
                        {getSeverityBadge(alert.severity)}
                        {alert.resolved && (
                          <Badge variant="success">
                            Résolue
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {alert.description}
                      </p>
                      
                      {/* Alert Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Type:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {getTypeLabel(alert.type)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Horodatage:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {formatTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                        {alert.ipAddress && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">IP:</span>
                            <span className="ml-2 text-gray-900 dark:text-white font-mono">
                              {alert.ipAddress}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Resolution Info */}
                      {alert.resolved && alert.resolvedBy && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700 dark:text-green-300">
                              Résolue par {alert.resolvedBy} {alert.resolvedAt && `le ${alert.resolvedAt.toLocaleDateString('fr-FR')}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions Taken */}
                      {alert.actions && alert.actions.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Actions prises:
                          </h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {alert.actions.map((action, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewAlert(alert)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title="Voir les détails"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    {!alert.resolved && (
                      <Button
                        onClick={() => handleResolveAlert(alert.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Résoudre
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛡️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {filterStatus === 'resolved' ? 'Aucune alerte résolue' : 
             filterStatus === 'unresolved' ? 'Aucune alerte non résolue' : 
             'Aucune alerte de sécurité'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filterSeverity !== 'all' || filterStatus !== 'all'
              ? 'Aucune alerte ne correspond à vos critères de filtrage.'
              : 'Aucune alerte de sécurité détectée. Le système fonctionne normalement.'}
          </p>
        </div>
      )}

      {/* Alert Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedAlert && (
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
                <div className="flex items-center space-x-3">
                  {getSeverityIcon(selectedAlert.severity)}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedAlert.title}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      {getSeverityBadge(selectedAlert.severity)}
                      {selectedAlert.resolved && (
                        <Badge variant="success">Résolue</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedAlert.description}
                    </p>
                  </div>

                  {/* Technical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Détails techniques
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Type:</span>
                          <span className="text-gray-900 dark:text-white">
                            {getTypeLabel(selectedAlert.type)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Gravité:</span>
                          {getSeverityBadge(selectedAlert.severity)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Horodatage:</span>
                          <span className="text-gray-900 dark:text-white">
                            {selectedAlert.timestamp.toLocaleString('fr-FR')}
                          </span>
                        </div>
                        {selectedAlert.ipAddress && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Adresse IP:</span>
                            <span className="text-gray-900 dark:text-white font-mono">
                              {selectedAlert.ipAddress}
                            </span>
                          </div>
                        )}
                        {selectedAlert.userId && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Utilisateur:</span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedAlert.userId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedAlert.resolved && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Résolution
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Résolue par:</span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedAlert.resolvedBy}
                            </span>
                          </div>
                          {selectedAlert.resolvedAt && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Résolue le:</span>
                              <span className="text-gray-900 dark:text-white">
                                {selectedAlert.resolvedAt.toLocaleString('fr-FR')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {selectedAlert.actions && selectedAlert.actions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Actions prises
                      </h3>
                      <ul className="space-y-2">
                        {selectedAlert.actions.map((action, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {action}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* User Agent */}
                  {selectedAlert.userAgent && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Agent utilisateur
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        {selectedAlert.userAgent}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  Fermer
                </Button>
                {!selectedAlert.resolved && (
                  <Button
                    onClick={() => {
                      handleResolveAlert(selectedAlert.id);
                      setShowDetailModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Marquer comme résolue
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
