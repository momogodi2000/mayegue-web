import React from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  TrophyIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge
} from '@/shared/components/ui';

interface StatsCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const statsCards: StatsCard[] = [
  {
    title: 'Utilisateurs totaux',
    value: '2,847',
    change: '+12%',
    changeType: 'increase',
    icon: UsersIcon,
    color: 'blue'
  },
  {
    title: 'Leçons actives',
    value: '156',
    change: '+8%',
    changeType: 'increase',
    icon: AcademicCapIcon,
    color: 'green'
  },
  {
    title: 'Sessions aujourd\'hui',
    value: '1,234',
    change: '+23%',
    changeType: 'increase',
    icon: ChartBarIcon,
    color: 'purple'
  },
  {
    title: 'Rapports en attente',
    value: '12',
    change: '-5%',
    changeType: 'decrease',
    icon: DocumentTextIcon,
    color: 'orange'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'user_registration',
    message: 'Nouvel utilisateur inscrit: Marie Dubois',
    time: 'Il y a 5 minutes',
    icon: UsersIcon,
    color: 'blue'
  },
  {
    id: 2,
    type: 'lesson_completed',
    message: 'Leçon "Salutations en Ewondo" terminée par 15 étudiants',
    time: 'Il y a 12 minutes',
    icon: AcademicCapIcon,
    color: 'green'
  },
  {
    id: 3,
    type: 'system_alert',
    message: 'Maintenance programmée dans 2 heures',
    time: 'Il y a 30 minutes',
    icon: ExclamationTriangleIcon,
    color: 'red'
  },
  {
    id: 4,
    type: 'achievement',
    message: 'Jean Kamga a obtenu le badge "Maître des langues"',
    time: 'Il y a 1 heure',
    icon: TrophyIcon,
    color: 'yellow'
  }
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble de la plateforme Ma'a yegue</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="w-4 h-4" />
          <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' :
                        stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChartBarIcon className="w-5 h-5" />
                <span>Activités récentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-${activity.color}-100`}>
                      <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GlobeAltIcon className="w-5 h-5" />
                <span>Actions rapides</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UsersIcon className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Gérer utilisateurs</p>
                  <p className="text-xs text-gray-500">Ajouter, modifier, supprimer</p>
                </button>
                
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <AcademicCapIcon className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Nouveau contenu</p>
                  <p className="text-xs text-gray-500">Leçons, exercices</p>
                </button>
                
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <DocumentTextIcon className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Rapports</p>
                  <p className="text-xs text-gray-500">Générer, consulter</p>
                </button>
                
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChartBarIcon className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Analyses</p>
                  <p className="text-xs text-gray-500">Statistiques détaillées</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span>État du système</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Base de données</span>
                <Badge className="bg-green-100 text-green-800">✓ OK</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">API Firebase</span>
                <Badge className="bg-green-100 text-green-800">✓ OK</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Stockage</span>
                <Badge className="bg-yellow-100 text-yellow-800">⚠ 85% utilisé</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
