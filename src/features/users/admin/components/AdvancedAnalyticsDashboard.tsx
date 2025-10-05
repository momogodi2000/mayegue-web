import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/shared/components/ui';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAdminStore } from '../store/adminStore';

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ChartType = 'line' | 'bar' | 'area';

interface AnalyticsData {
  userGrowth: Array<{ date: string; users: number; active: number }>;
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    avgSessionDuration: number;
    avgDailyLessons: number;
  };
  contentMetrics: {
    totalLessons: number;
    totalPosts: number;
    totalComments: number;
    avgCompletionRate: number;
  };
  revenueMetrics: {
    mrr: number;
    arr: number;
    arpu: number;
    churnRate: number;
  };
  languageDistribution: Array<{ language: string; users: number; percentage: number }>;
  topPerformers: Array<{ name: string; xp: number; lessonsCompleted: number }>;
  geographicData: Array<{ region: string; users: number; percentage: number }>;
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const { metrics } = useAdminStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [loading, setLoading] = useState(false);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    userGrowth: [],
    engagementMetrics: {
      dailyActiveUsers: 0,
      weeklyActiveUsers: 0,
      monthlyActiveUsers: 0,
      avgSessionDuration: 0,
      avgDailyLessons: 0
    },
    contentMetrics: {
      totalLessons: 0,
      totalPosts: 0,
      totalComments: 0,
      avgCompletionRate: 0
    },
    revenueMetrics: {
      mrr: 0,
      arr: 0,
      arpu: 0,
      churnRate: 0
    },
    languageDistribution: [],
    topPerformers: [],
    geographicData: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);

    // Simulate API call - In production, replace with actual analytics service
    setTimeout(() => {
      const mockData: AnalyticsData = {
        userGrowth: generateUserGrowthData(timeRange),
        engagementMetrics: {
          dailyActiveUsers: 1247,
          weeklyActiveUsers: 3892,
          monthlyActiveUsers: 8456,
          avgSessionDuration: 28.5,
          avgDailyLessons: 3.2
        },
        contentMetrics: {
          totalLessons: 458,
          totalPosts: 2341,
          totalComments: 8923,
          avgCompletionRate: 68.4
        },
        revenueMetrics: {
          mrr: 12450,
          arr: 149400,
          arpu: 14.5,
          churnRate: 2.3
        },
        languageDistribution: [
          { language: 'Dualaba', users: 3245, percentage: 38.4 },
          { language: 'Ewondo', users: 2156, percentage: 25.5 },
          { language: 'Bassa', users: 1432, percentage: 16.9 },
          { language: 'Bamoun', users: 987, percentage: 11.7 },
          { language: 'Fulfulde', users: 636, percentage: 7.5 }
        ],
        topPerformers: [
          { name: 'Marie K.', xp: 12450, lessonsCompleted: 156 },
          { name: 'Jean-Paul D.', xp: 11230, lessonsCompleted: 142 },
          { name: 'Aminata S.', xp: 10890, lessonsCompleted: 138 },
          { name: 'Ibrahim F.', xp: 9870, lessonsCompleted: 125 },
          { name: 'Sophie N.', xp: 9234, lessonsCompleted: 118 }
        ],
        geographicData: [
          { region: 'Cameroun', users: 5234, percentage: 61.9 },
          { region: 'France', users: 1456, percentage: 17.2 },
          { region: 'USA', users: 892, percentage: 10.5 },
          { region: 'Canada', users: 543, percentage: 6.4 },
          { region: 'Autres', users: 331, percentage: 3.9 }
        ]
      };

      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  };

  const generateUserGrowthData = (range: TimeRange) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : range === '1y' ? 365 : 30;
    const data = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(8000 + Math.random() * 1000 + (days - i) * 15),
        active: Math.floor(1000 + Math.random() * 500 + (days - i) * 5)
      });
    }

    return data;
  };

  const exportData = (format: 'csv' | 'json' | 'pdf') => {
    console.log(`Exporting analytics data as ${format}...`);
    // In production, implement actual export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analyses Avancées
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vue détaillée des performances de la plateforme
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <SelectRoot value={timeRange} onValueChange={(value: string) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="1y">Cette année</SelectItem>
              <SelectItem value="all">Tout le temps</SelectItem>
            </SelectContent>
          </SelectRoot>

          <SelectRoot value={chartType} onValueChange={(value: string) => setChartType(value as ChartType)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Ligne</SelectItem>
              <SelectItem value="bar">Barres</SelectItem>
              <SelectItem value="area">Aires</SelectItem>
            </SelectContent>
          </SelectRoot>

          <div className="flex gap-2">
            <Button onClick={() => exportData('csv')} variant="outline" size="sm">
              CSV
            </Button>
            <Button onClick={() => exportData('json')} variant="outline" size="sm">
              JSON
            </Button>
            <Button onClick={() => exportData('pdf')} variant="outline" size="sm">
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="DAU / MAU Ratio"
          value={`${((analyticsData.engagementMetrics.dailyActiveUsers / analyticsData.engagementMetrics.monthlyActiveUsers) * 100).toFixed(1)}%`}
          icon={<UserGroupIcon className="w-6 h-6" />}
          trend="+2.3%"
          trendUp={true}
          color="blue"
        />

        <MetricCard
          title="Durée Moyenne Session"
          value={`${analyticsData.engagementMetrics.avgSessionDuration} min`}
          icon={<ClockIcon className="w-6 h-6" />}
          trend="+4.5%"
          trendUp={true}
          color="green"
        />

        <MetricCard
          title="Taux de Complétion"
          value={`${analyticsData.contentMetrics.avgCompletionRate}%`}
          icon={<AcademicCapIcon className="w-6 h-6" />}
          trend="+1.8%"
          trendUp={true}
          color="purple"
        />

        <MetricCard
          title="MRR"
          value={`${analyticsData.revenueMetrics.mrr.toLocaleString()} €`}
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          trend="+8.2%"
          trendUp={true}
          color="yellow"
        />
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-5 h-5" />
            Croissance des Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Graphique de croissance ({chartType}) - {analyticsData.userGrowth.length} points de données
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Intégration Chart.js ou Recharts à implémenter
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement & Content Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Métriques d'Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Utilisateurs Actifs Quotidiens</span>
                <span className="font-bold text-xl">{analyticsData.engagementMetrics.dailyActiveUsers.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Utilisateurs Actifs Hebdomadaires</span>
                <span className="font-bold text-xl">{analyticsData.engagementMetrics.weeklyActiveUsers.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Utilisateurs Actifs Mensuels</span>
                <span className="font-bold text-xl">{analyticsData.engagementMetrics.monthlyActiveUsers.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Leçons Quotidiennes Moyennes</span>
                <span className="font-bold text-xl">{analyticsData.engagementMetrics.avgDailyLessons}</span>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Taux de Rétention: <span className="font-bold">82.4%</span>
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  +3.2% par rapport au mois précédent
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5" />
              Métriques de Contenu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Leçons Totales</span>
                <span className="font-bold text-xl">{analyticsData.contentMetrics.totalLessons}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Posts Communautaires</span>
                <span className="font-bold text-xl">{analyticsData.contentMetrics.totalPosts.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Commentaires</span>
                <span className="font-bold text-xl">{analyticsData.contentMetrics.totalComments.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Taux de Complétion</span>
                <span className="font-bold text-xl">{analyticsData.contentMetrics.avgCompletionRate}%</span>
              </div>

              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                  Contenu Créé Cette Semaine: <span className="font-bold">23 leçons</span>
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  +15% par rapport à la semaine précédente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Distribution & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeAltIcon className="w-5 h-5" />
              Distribution des Langues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.languageDistribution.map((lang) => (
                <div key={lang.language} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-sm text-gray-600">{lang.users.toLocaleString()} ({lang.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏆 Meilleurs Apprenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topPerformers.map((performer, index) => (
                <div
                  key={performer.name}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {performer.lessonsCompleted} leçons complétées
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {performer.xp.toLocaleString()} XP
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5" />
            Métriques Financières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">MRR</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                {analyticsData.revenueMetrics.mrr.toLocaleString()} €
              </p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">+8.2% ce mois</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ARR</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                {analyticsData.revenueMetrics.arr.toLocaleString()} €
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">Annuel</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ARPU</p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                {analyticsData.revenueMetrics.arpu.toFixed(2)} €
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">Par utilisateur</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Taux de Désabonnement</p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-400">
                {analyticsData.revenueMetrics.churnRate}%
              </p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-1">-0.3% ce mois</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌍 Distribution Géographique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.geographicData.map((region) => (
              <div key={region.region} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{region.region}</span>
                  <span className="text-sm text-gray-600">{region.users.toLocaleString()} ({region.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, trendUp, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <p className={`text-sm mt-2 font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trendUp ? '↗' : '↘'} {trend}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalyticsDashboard;
