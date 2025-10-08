import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  CalendarIcon,
  ServerIcon
} from '@heroicons/react/24/outline';
import { Button, Badge } from '@/shared/components/ui';
import { enhancedAdminService, type BackupInfo } from '../services/enhanced-admin.service';
import toast from 'react-hot-toast';

interface BackupManagementPanelProps {
  className?: string;
}

export const BackupManagementPanel: React.FC<BackupManagementPanelProps> = ({
  className = ''
}) => {
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedBackupType, setSelectedBackupType] = useState<'full' | 'incremental' | 'users' | 'content'>('full');

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      setLoading(true);
      const allBackups = enhancedAdminService.getBackups();
      setBackups(allBackups);
    } catch (error) {
      console.error('Error loading backups:', error);
      toast.error('Erreur lors du chargement des sauvegardes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      const newBackup = await enhancedAdminService.createBackup(selectedBackupType);
      setBackups(prev => [newBackup, ...prev]);
      toast.success('Sauvegarde créée avec succès');
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Erreur lors de la création de la sauvegarde');
    } finally {
      setCreating(false);
    }
  };

  const handleDownloadBackup = (backup: BackupInfo) => {
    if (backup.downloadUrl) {
      const link = document.createElement('a');
      link.href = backup.downloadUrl;
      link.download = `mayegue-backup-${backup.type}-${backup.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Téléchargement de la sauvegarde démarré');
    } else {
      toast.error('URL de téléchargement non disponible');
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
      return;
    }

    try {
      await enhancedAdminService.deleteBackup(backupId);
      setBackups(prev => prev.filter(backup => backup.id !== backupId));
    } catch (error) {
      console.error('Error deleting backup:', error);
    }
  };

  const getBackupTypeLabel = (type: string) => {
    const labels = {
      full: 'Complète',
      incremental: 'Incrémentale',
      users: 'Utilisateurs',
      content: 'Contenu'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getBackupTypeBadge = (type: string) => {
    const variants = {
      full: 'primary',
      incremental: 'info',
      users: 'warning',
      content: 'success'
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'secondary'}>
        {getBackupTypeLabel(type)}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'creating':
        return <ClockIcon className="w-5 h-5 text-yellow-600 animate-pulse" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'success',
      creating: 'warning',
      failed: 'danger'
    } as const;

    const labels = {
      completed: 'Terminée',
      creating: 'En cours',
      failed: 'Échouée'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (backup: BackupInfo) => {
    return backup.expiresAt && backup.expiresAt < new Date();
  };

  const getDaysUntilExpiry = (backup: BackupInfo) => {
    if (!backup.expiresAt) return null;
    const now = new Date();
    const diffTime = backup.expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
            Gestion des sauvegardes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Créez et gérez les sauvegardes de votre système
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="info">
            {backups.length} sauvegarde{backups.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Create Backup Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Créer une nouvelle sauvegarde
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sélectionnez le type de sauvegarde à créer
            </p>
          </div>
          <ServerIcon className="w-8 h-8 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { type: 'full', label: 'Complète', description: 'Toutes les données' },
            { type: 'incremental', label: 'Incrémentale', description: 'Modifications récentes' },
            { type: 'users', label: 'Utilisateurs', description: 'Données utilisateurs uniquement' },
            { type: 'content', label: 'Contenu', description: 'Leçons et quiz uniquement' }
          ].map((option) => (
            <button
              key={option.type}
              onClick={() => setSelectedBackupType(option.type as any)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedBackupType === option.type
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={handleCreateBackup}
          disabled={creating}
          className="flex items-center space-x-2"
        >
          <CloudArrowUpIcon className={`w-4 h-4 ${creating ? 'animate-pulse' : ''}`} />
          <span>{creating ? 'Création en cours...' : 'Créer la sauvegarde'}</span>
        </Button>
      </div>

      {/* Backup Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total des sauvegardes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {backups.length}
              </p>
            </div>
            <CloudArrowDownIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Sauvegardes récentes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {backups.filter(b => Date.now() - b.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000).length}
              </p>
            </div>
            <CalendarIcon className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Derniers 7 jours
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Taille totale
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatFileSize(backups.reduce((sum, backup) => sum + backup.size, 0))}
              </p>
            </div>
            <Cog6ToothIcon className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Expirant bientôt
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {backups.filter(b => {
                  const days = getDaysUntilExpiry(b);
                  return days !== null && days <= 3 && days > 0;
                }).length}
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Dans les 3 prochains jours
          </p>
        </div>
      </div>

      {/* Backups List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Historique des sauvegardes
          </h3>
        </div>

        {backups.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {backups.map((backup) => (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    isExpired(backup) ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(backup.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            Sauvegarde {backup.id.split('_')[1]}
                          </h4>
                          {getBackupTypeBadge(backup.type)}
                          {getStatusBadge(backup.status)}
                          {isExpired(backup) && (
                            <Badge variant="danger">Expirée</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Créée le:</span>
                            <p className="text-gray-900 dark:text-white">
                              {formatDate(backup.createdAt)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Taille:</span>
                            <p className="text-gray-900 dark:text-white">
                              {formatFileSize(backup.size)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Utilisateurs:</span>
                            <p className="text-gray-900 dark:text-white">
                              {backup.metadata.userCount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Contenu:</span>
                            <p className="text-gray-900 dark:text-white">
                              {backup.metadata.contentCount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {backup.expiresAt && (
                          <div className="mt-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {isExpired(backup) ? (
                                <span className="text-red-600">
                                  Expirée le {formatDate(backup.expiresAt)}
                                </span>
                              ) : (
                                <span>
                                  Expire le {formatDate(backup.expiresAt)}
                                  {(() => {
                                    const days = getDaysUntilExpiry(backup);
                                    if (days !== null && days <= 3) {
                                      return ` (dans ${days} jour${days > 1 ? 's' : ''})`;
                                    }
                                    return '';
                                  })()}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {backup.status === 'completed' && backup.downloadUrl && (
                        <Button
                          onClick={() => handleDownloadBackup(backup)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4" />
                          <span>Télécharger</span>
                        </Button>
                      )}
                      <button
                        onClick={() => handleDeleteBackup(backup.id)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💾</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucune sauvegarde
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Créez votre première sauvegarde pour sécuriser vos données.
            </p>
            <Button
              onClick={handleCreateBackup}
              disabled={creating}
              className="flex items-center space-x-2"
            >
              <CloudArrowUpIcon className="w-4 h-4" />
              <span>Créer une sauvegarde</span>
            </Button>
          </div>
        )}
      </div>

      {/* Backup Schedule Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CalendarIcon className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Planification automatique
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Les sauvegardes automatiques sont configurées pour s'exécuter quotidiennement à 2h00 du matin.
              Les sauvegardes complètes sont créées chaque dimanche, et les sauvegardes incrémentales les autres jours.
            </p>
            <div className="flex items-center space-x-4 text-xs text-blue-600 dark:text-blue-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Sauvegardes conservées pendant 30 jours</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Nettoyage automatique des anciennes sauvegardes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
