import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Badge,
  Spinner,
  Modal,
  Input,
  Select,
  useToastActions
} from '@/shared/components/ui';
import { 
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ServerIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import BulkOperationsPanel from './BulkOperationsPanel';
import { SystemMonitoringPanel } from './SystemMonitoringPanel';

const AdminDashboard: React.FC = () => {
  const { success: showSuccess, error: showError } = useToastActions();
  const { 
    metrics, 
    users,
    content,
    reports,
    loading, 
    error, 
    fetchMetrics, 
    fetchUsers, 
    fetchContent, 
    fetchReports,
    clearError,
    updateUserStatus,
    approveContent,
    rejectContent
  } = useAdminStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [systemHealth, setSystemHealth] = useState({
    database: 'healthy',
    storage: 'healthy',
    api: 'healthy',
    cache: 'healthy'
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'analytics' | 'bulk' | 'monitoring'>('overview');

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await Promise.all([
          fetchMetrics(),
          fetchUsers(),
          fetchContent(),
          fetchReports()
        ]);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      }
    };

    initializeDashboard();
  }, [fetchMetrics, fetchUsers, fetchContent, fetchReports]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchMetrics(),
        fetchUsers(),
        fetchContent(),
        fetchReports()
      ]);
      showSuccess('Données actualisées avec succès');
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      showError('Erreur lors de l\'actualisation');
    } finally {
      setRefreshing(false);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) return;

    try {
      switch (bulkAction) {
        case 'approve_content':
          await Promise.all(selectedItems.map(id => approveContent(id)));
          showSuccess(`${selectedItems.length} contenus approuvés`);
          break;
        case 'reject_content':
          await Promise.all(selectedItems.map(id => rejectContent(id, 'Bulk rejection')));
          showSuccess(`${selectedItems.length} contenus rejetés`);
          break;
        case 'suspend_users':
          await Promise.all(selectedItems.map(id => updateUserStatus(id, 'suspended')));
          showSuccess(`${selectedItems.length} utilisateurs suspendus`);
          break;
        default:
          showError('Action non reconnue');
      }
      
      setSelectedItems([]);
      setBulkAction('');
      setShowBulkActions(false);
    } catch (error) {
      showError('Erreur lors de l\'exécution des actions en lot');
    }
  };

  const checkSystemHealth = async () => {
    // Simulate system health check
    const health = {
      database: Math.random() > 0.1 ? 'healthy' : 'warning',
      storage: Math.random() > 0.05 ? 'healthy' : 'error',
      api: Math.random() > 0.08 ? 'healthy' : 'warning',
      cache: Math.random() > 0.03 ? 'healthy' : 'error'
    };
    setSystemHealth(health);
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement du tableau de bord...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={clearError}>Réessayer</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de Bord Administrateur</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Vue d'ensemble de la plateforme Ma'a yegue
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={checkSystemHealth}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ServerIcon className="w-4 h-4" />
            Vérifier Santé
          </Button>
          
          <Button 
            onClick={() => setShowBulkActions(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CogIcon className="w-4 h-4" />
            Actions en Lot
          </Button>
          
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Actualisation...
              </>
            ) : (
              <>
                🔄 Actualiser
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Utilisateurs Totaux"
            value={metrics.totalUsers.toLocaleString()}
            icon="👥"
            color="bg-blue-500"
            trend="+12%"
            trendPositive={true}
          />
          
          <MetricCard
            title="Utilisateurs Actifs"
            value={metrics.activeUsers.toLocaleString()}
            icon="🟢"
            color="bg-green-500"
            trend="+8%"
            trendPositive={true}
          />
          
          <MetricCard
            title="Revenus Mensuels"
            value={`${metrics.revenue.thisMonth.toLocaleString()} €`}
            icon="💰"
            color="bg-yellow-500"
            trend="+15%"
            trendPositive={true}
          />
          
          <MetricCard
            title="Taux de Performance"
            value={`${metrics.performance.uptime}%`}
            icon="⚡"
            color="bg-purple-500"
            trend="+0.1%"
            trendPositive={true}
          />
        </div>
      )}

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="w-5 h-5" />
              Santé du Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* System Components */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium">Base de données</span>
                  <Badge variant={systemHealth.database === 'healthy' ? 'success' : systemHealth.database === 'warning' ? 'warning' : 'danger'}>
                    {systemHealth.database === 'healthy' ? '✅ Sain' : systemHealth.database === 'warning' ? '⚠️ Attention' : '❌ Erreur'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium">Stockage</span>
                  <Badge variant={systemHealth.storage === 'healthy' ? 'success' : systemHealth.storage === 'warning' ? 'warning' : 'danger'}>
                    {systemHealth.storage === 'healthy' ? '✅ Sain' : systemHealth.storage === 'warning' ? '⚠️ Attention' : '❌ Erreur'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium">API</span>
                  <Badge variant={systemHealth.api === 'healthy' ? 'success' : systemHealth.api === 'warning' ? 'warning' : 'danger'}>
                    {systemHealth.api === 'healthy' ? '✅ Sain' : systemHealth.api === 'warning' ? '⚠️ Attention' : '❌ Erreur'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium">Cache</span>
                  <Badge variant={systemHealth.cache === 'healthy' ? 'success' : systemHealth.cache === 'warning' ? 'warning' : 'danger'}>
                    {systemHealth.cache === 'healthy' ? '✅ Sain' : systemHealth.cache === 'warning' ? '⚠️ Attention' : '❌ Erreur'}
                  </Badge>
                </div>
              </div>

              {/* Performance Metrics */}
              {metrics && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Temps de chargement moyen</span>
                    <Badge variant={metrics.performance.averageLoadTime < 2 ? "success" : "warning"}>
                      {metrics.performance.averageLoadTime}s
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Taux d'erreur</span>
                    <Badge variant={metrics.performance.errorRate < 0.05 ? "success" : "danger"}>
                      {(metrics.performance.errorRate * 100).toFixed(2)}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Disponibilité</span>
                    <Badge variant={metrics.performance.uptime > 99 ? "success" : "warning"}>
                      {metrics.performance.uptime}%
                    </Badge>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${metrics.performance.uptime}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Nouveaux utilisateurs</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {metrics?.newUsersToday || 0} utilisateurs aujourd'hui
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl">💬</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Discussions actives</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {metrics?.totalDiscussions || 0} discussions au total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl">🏆</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Défis communautaires</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {metrics?.totalChallenges || 0} défis en cours
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl">📚</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Leçons complétées</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {metrics?.completedLessons || 0} leçons terminées
                  </p>
                </div>
              </div>

              {/* Pending Moderation */}
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">En attente de modération</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {content.filter(c => c.status === 'pending').length} contenus
                  </p>
                </div>
              </div>

              {/* Reports */}
              <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl">🚨</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Signalements</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reports.filter(r => r.status === 'pending').length} signalements en attente
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon="👥"
              title="Gérer les Utilisateurs"
              description="Voir et modérer les comptes utilisateurs"
              href="/admin/users"
            />
            
            <QuickActionButton
              icon="📝"
              title="Modérer le Contenu"
              description="Réviser le contenu signalé"
              href="/admin/content"
            />
            
            <QuickActionButton
              icon="🚨"
              title="Signalements"
              description="Traiter les signalements"
              href="/admin/reports"
            />
            
            <QuickActionButton
              icon="📊"
              title="Analyses"
              description="Voir les statistiques détaillées"
              href="/admin/analytics"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Actions Administratives Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-gray-50">
              <div className="text-lg">✅</div>
              <div className="flex-1">
                <p className="font-medium">Contenu approuvé</p>
                <p className="text-sm text-gray-600">Discussion "Prononciation Ewondo" approuvée • il y a 2h</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border-l-4 border-red-500 bg-gray-50">
              <div className="text-lg">🚫</div>
              <div className="flex-1">
                <p className="font-medium">Utilisateur suspendu</p>
                <p className="text-sm text-gray-600">Compte user123 suspendu pour violation des règles • il y a 4h</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-gray-50">
              <div className="text-lg">🎯</div>
              <div className="flex-1">
                <p className="font-medium">Défi créé</p>
                <p className="text-sm text-gray-600">Nouveau défi "Traduction Bamileke" lancé • il y a 6h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Modal */}
      <Modal
        open={showBulkActions}
        onClose={() => {
          setShowBulkActions(false);
          setSelectedItems([]);
          setBulkAction('');
        }}
        title="Actions en Lot"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sélectionner les éléments
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {/* Users */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Utilisateurs</h4>
                {users.slice(0, 5).map(user => (
                  <label key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(prev => [...prev, user.id]);
                        } else {
                          setSelectedItems(prev => prev.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{user.displayName} ({user.email})</span>
                  </label>
                ))}
              </div>

              {/* Content */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contenu</h4>
                {content.slice(0, 5).map(item => (
                  <label key={item.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(prev => [...prev, item.id]);
                        } else {
                          setSelectedItems(prev => prev.filter(id => id !== item.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{item.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Action à effectuer
            </label>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Sélectionner une action</option>
              <option value="approve_content">Approuver le contenu</option>
              <option value="reject_content">Rejeter le contenu</option>
              <option value="suspend_users">Suspendre les utilisateurs</option>
              <option value="activate_users">Activer les utilisateurs</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkActions(false);
                setSelectedItems([]);
                setBulkAction('');
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedItems.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Exécuter ({selectedItems.length} éléments)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend?: string;
  trendPositive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  trendPositive
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trendPositive ? '↗️' : '↘️'} {trend} ce mois
            </p>
          )}
        </div>
        <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-2xl text-white`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface QuickActionButtonProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  title,
  description,
  href: _href
}) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer group">
    <CardContent className="p-4 text-center">
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

export default AdminDashboard;