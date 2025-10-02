import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Badge,
  Spinner 
} from '@/shared/components/ui';

const AdminDashboard: React.FC = () => {
  const { 
    metrics, 
    loading, 
    error, 
    fetchMetrics, 
    fetchUsers, 
    fetchContent, 
    fetchReports,
    clearError 
  } = useAdminStore();

  const [refreshing, setRefreshing] = useState(false);

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
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble de la plateforme Ma’a yegue
          </p>
        </div>
        
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
            <CardTitle>🔧 Santé du Système</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temps de chargement moyen</span>
                  <Badge variant={metrics.performance.averageLoadTime < 2 ? "success" : "warning"}>
                    {metrics.performance.averageLoadTime}s
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taux d'erreur</span>
                  <Badge variant={metrics.performance.errorRate < 0.05 ? "success" : "danger"}>
                    {(metrics.performance.errorRate * 100).toFixed(2)}%
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Disponibilité</span>
                  <Badge variant={metrics.performance.uptime > 99 ? "success" : "warning"}>
                    {metrics.performance.uptime}%
                  </Badge>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${metrics.performance.uptime}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl">👤</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Nouveaux utilisateurs</p>
                  <p className="text-sm text-gray-600">
                    {metrics?.newUsersToday || 0} utilisateurs aujourd'hui
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="text-2xl">💬</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Discussions actives</p>
                  <p className="text-sm text-gray-600">
                    {metrics?.totalDiscussions || 0} discussions au total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl">🏆</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Défis communautaires</p>
                  <p className="text-sm text-gray-600">
                    {metrics?.totalChallenges || 0} défis en cours
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl">📚</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Leçons complétées</p>
                  <p className="text-sm text-gray-600">
                    {metrics?.completedLessons || 0} leçons terminées
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