import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  ServerIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CloudArrowDownIcon,
  DocumentTextIcon,
  CogIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/components/ui';
import { UserManagementPanel } from '../components/UserManagementPanel';
import { ContentModerationPanel } from '../components/ContentModerationPanel';
import { SystemMonitoringPanel } from '../components/SystemMonitoringPanel';
import { BackupManagementPanel } from '../components/BackupManagementPanel';
import { SecurityAlertsPanel } from '../components/SecurityAlertsPanel';
import { enhancedAdminService, type SystemStats, type SecurityAlert } from '../services/enhanced-admin.service';
import toast from 'react-hot-toast';

export const EnhancedAdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'system' | 'security' | 'backups'>('overview');
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [systemStats, alerts] = await Promise.all([
        enhancedAdminService.getSystemStats(),
        enhancedAdminService.getSecurityAlerts()
      ]);
      setStats(systemStats);
      setSecurityAlerts(alerts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getHealthIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
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

  const getSeverityBadge = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    const variants = {
      low: 'info',
      medium: 'warning',
      high: 'danger',
      critical: 'danger'
    } as const;

    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      critical: 'Critique'
    };

    return (
      <Badge variant={variants[severity]}>
        {labels[severity]}
      </Badge>
    );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panneau d'administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenue, {user?.displayName || user?.email}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setActiveTab('backups')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <CloudArrowDownIcon className="w-4 h-4" />
            <span>Sauvegarde</span>
          </Button>
          <Button
            onClick={() => setActiveTab('security')}
            className="flex items-center space-x-2"
          >
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Sécurité</span>
          </Button>
        </div>
      </div>

      {/* Security Alerts Banner */}
      {securityAlerts.filter(alert => !alert.resolved && alert.severity === 'critical').length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Alertes de sécurité critiques
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {securityAlerts.filter(alert => !alert.resolved && alert.severity === 'critical').length} alerte(s) critique(s) nécessite(nt) votre attention immédiate.
              </p>
            </div>
            <Button
              onClick={() => setActiveTab('security')}
              size="sm"
              className="ml-auto"
            >
              Voir les alertes
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
            { id: 'users', label: 'Utilisateurs', icon: UsersIcon },
            { id: 'content', label: 'Modération', icon: DocumentCheckIcon },
            { id: 'system', label: 'Système', icon: ServerIcon },
            { id: 'security', label: 'Sécurité', icon: ShieldCheckIcon },
            { id: 'backups', label: 'Sauvegardes', icon: CloudArrowDownIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Utilisateurs totaux
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <UsersIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600">
                      {stats.activeUsers} en ligne
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Contenu en attente
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.pendingContent}
                      </p>
                    </div>
                    <DocumentCheckIcon className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Nécessite une révision
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Sessions totales
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalSessions}
                      </p>
                    </div>
                    <ChartBarIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600">
                      {stats.averageSessionDuration} min moyenne
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Nouveaux aujourd'hui
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.newUsersToday}
                      </p>
                    </div>
                    <BellIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-purple-600">
                      Nouveaux utilisateurs
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>État du système</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getHealthIcon(stats.systemHealth.database)}
                        <span>Base de données</span>
                      </div>
                      {getHealthBadge(stats.systemHealth.database)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getHealthIcon(stats.systemHealth.sync)}
                        <span>Synchronisation</span>
                      </div>
                      {getHealthBadge(stats.systemHealth.sync)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getHealthIcon(stats.systemHealth.storage)}
                        <span>Stockage</span>
                      </div>
                      {getHealthBadge(stats.systemHealth.storage)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getHealthIcon(stats.systemHealth.performance)}
                        <span>Performance</span>
                      </div>
                      {getHealthBadge(stats.systemHealth.performance)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des ressources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Base de données</span>
                        <span>{stats.resourceUsage.databaseSize} MB</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(stats.resourceUsage.databaseSize / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stockage</span>
                        <span>{stats.resourceUsage.storageUsed} / {stats.resourceUsage.storageLimit} MB</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(stats.resourceUsage.storageUsed / stats.resourceUsage.storageLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.resourceUsage.syncQueueSize}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">File de sync</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.resourceUsage.errorCount}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Erreurs</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Security Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {activity.type === 'user_registered' && <UsersIcon className="w-5 h-5 text-blue-600" />}
                          {activity.type === 'content_created' && <DocumentTextIcon className="w-5 h-5 text-green-600" />}
                          {activity.type === 'content_approved' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                          {activity.type === 'content_rejected' && <XCircleIcon className="w-5 h-5 text-red-600" />}
                          {activity.type === 'system_error' && <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Alertes de sécurité</span>
                    <Badge variant="warning">
                      {securityAlerts.filter(alert => !alert.resolved).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <ExclamationTriangleIcon className={`w-5 h-5 ${
                            alert.severity === 'critical' ? 'text-red-600' :
                            alert.severity === 'high' ? 'text-red-500' :
                            alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {alert.title}
                            </p>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {alert.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatTimeAgo(alert.timestamp)}
                          </p>
                        </div>
                        {!alert.resolved && (
                          <div className="flex-shrink-0">
                            <ClockIcon className="w-4 h-4 text-yellow-500" />
                          </div>
                        )}
                      </div>
                    ))}
                    {securityAlerts.length > 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('security')}
                        className="w-full"
                      >
                        Voir toutes les alertes ({securityAlerts.length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagementPanel />
        )}

        {activeTab === 'content' && (
          <ContentModerationPanel />
        )}

        {activeTab === 'system' && (
          <SystemMonitoringPanel />
        )}

        {activeTab === 'security' && (
          <SecurityAlertsPanel />
        )}

        {activeTab === 'backups' && (
          <BackupManagementPanel />
        )}
      </motion.div>
    </div>
  );
};
