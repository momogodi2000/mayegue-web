import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  CloudIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/components/ui';
import { enhancedAdminService, type SystemStats } from '../services/enhanced-admin.service';
import toast from 'react-hot-toast';

interface SystemMonitoringPanelProps {
  className?: string;
}

export const SystemMonitoringPanel: React.FC<SystemMonitoringPanelProps> = ({
  className = ''
}) => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadSystemStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSystemStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemStats = async () => {
    try {
      if (!loading) setRefreshing(true);
      const systemStats = await enhancedAdminService.getSystemStats();
      setStats(systemStats);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading system stats:', error);
      toast.error('Erreur lors du chargement des statistiques système');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadSystemStats();
  };

  const getHealthIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    }
  };

  const getHealthColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
    }
  };

  const getHealthBadge = (status: 'healthy' | 'warning' | 'error') => {
    const variants = {
      healthy: 'success',
      warning: 'warning',
      error: 'danger'
    } as const;

    const labels = {
      healthy: 'Sain',
      warning: 'Attention',
      error: 'Erreur'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1) + '%';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `il y a ${diffInSeconds} sec`;
    } else if (diffInSeconds < 3600) {
      return `il y a ${Math.floor(diffInSeconds / 60)} min`;
    } else {
      return `il y a ${Math.floor(diffInSeconds / 3600)} h`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <ServerIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Impossible de charger les statistiques
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Une erreur s'est produite lors du chargement des données système.
        </p>
        <Button onClick={handleRefresh}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Surveillance système
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Surveillez la santé et les performances du système
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Dernière mise à jour: {formatTimeAgo(lastRefresh)}
          </span>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <CircleStackIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Base de données
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getHealthIcon(stats.systemHealth.database)}
                    <span className={`text-sm font-semibold ${getHealthColor(stats.systemHealth.database)}`}>
                      {stats.systemHealth.database === 'healthy' ? 'Saine' : 
                       stats.systemHealth.database === 'warning' ? 'Attention' : 'Erreur'}
                    </span>
                  </div>
                </div>
              </div>
              {getHealthBadge(stats.systemHealth.database)}
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Taille: {stats.resourceUsage.databaseSize} MB
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <ArrowPathIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Synchronisation
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getHealthIcon(stats.systemHealth.sync)}
                    <span className={`text-sm font-semibold ${getHealthColor(stats.systemHealth.sync)}`}>
                      {stats.systemHealth.sync === 'healthy' ? 'Active' : 
                       stats.systemHealth.sync === 'warning' ? 'Ralentie' : 'Arrêtée'}
                    </span>
                  </div>
                </div>
              </div>
              {getHealthBadge(stats.systemHealth.sync)}
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                File d'attente: {stats.resourceUsage.syncQueueSize} éléments
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <CloudIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Stockage
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getHealthIcon(stats.systemHealth.storage)}
                    <span className={`text-sm font-semibold ${getHealthColor(stats.systemHealth.storage)}`}>
                      {formatPercentage(stats.resourceUsage.storageUsed, stats.resourceUsage.storageLimit)}
                    </span>
                  </div>
                </div>
              </div>
              {getHealthBadge(stats.systemHealth.storage)}
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.resourceUsage.storageUsed} / {stats.resourceUsage.storageLimit} MB
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <CpuChipIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Performance
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getHealthIcon(stats.systemHealth.performance)}
                    <span className={`text-sm font-semibold ${getHealthColor(stats.systemHealth.performance)}`}>
                      {stats.systemHealth.performance === 'healthy' ? 'Optimale' : 
                       stats.systemHealth.performance === 'warning' ? 'Dégradée' : 'Critique'}
                    </span>
                  </div>
                </div>
              </div>
              {getHealthBadge(stats.systemHealth.performance)}
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Erreurs: {stats.resourceUsage.errorCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5" />
              <span>Utilisation des ressources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Database Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Base de données
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.resourceUsage.databaseSize} MB
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stats.resourceUsage.databaseSize / 100) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-blue-600 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Storage Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Stockage cloud
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.resourceUsage.storageUsed} / {stats.resourceUsage.storageLimit} MB
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.resourceUsage.storageUsed / stats.resourceUsage.storageLimit) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-2 rounded-full ${
                      (stats.resourceUsage.storageUsed / stats.resourceUsage.storageLimit) > 0.8
                        ? 'bg-red-600'
                        : (stats.resourceUsage.storageUsed / stats.resourceUsage.storageLimit) > 0.6
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                  />
                </div>
              </div>

              {/* Sync Queue */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    File de synchronisation
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.resourceUsage.syncQueueSize} éléments
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stats.resourceUsage.syncQueueSize / 50) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-2 rounded-full ${
                      stats.resourceUsage.syncQueueSize > 30
                        ? 'bg-red-600'
                        : stats.resourceUsage.syncQueueSize > 15
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                  />
                </div>
              </div>

              {/* Error Count */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className={`w-4 h-4 ${
                      stats.resourceUsage.errorCount > 0 ? 'text-red-600' : 'text-green-600'
                    }`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Erreurs système
                    </span>
                  </div>
                  <Badge variant={stats.resourceUsage.errorCount > 0 ? 'danger' : 'success'}>
                    {stats.resourceUsage.errorCount}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5" />
              <span>Activité récente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {activity.type === 'user_registered' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    {activity.type === 'content_created' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {activity.type === 'content_approved' && (
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    )}
                    {activity.type === 'content_rejected' && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                    {activity.type === 'system_error' && (
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ServerIcon className="w-5 h-5" />
            <span>Métriques de performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalSessions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Sessions totales
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Durée moyenne: {stats.averageSessionDuration} min
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.activeUsers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Utilisateurs actifs
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sur {stats.totalUsers} total
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.totalContent}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Contenu total
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.pendingContent} en attente
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};