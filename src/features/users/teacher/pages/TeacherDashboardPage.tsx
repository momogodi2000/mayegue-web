import React from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button
} from '@/shared/components/ui';

interface StatsCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const teacherStats: StatsCard[] = [
  {
    title: 'Mes étudiants',
    value: '127',
    change: '+5%',
    changeType: 'increase',
    icon: UsersIcon,
    color: 'blue'
  },
  {
    title: 'Leçons créées',
    value: '24',
    change: '+3',
    changeType: 'increase',
    icon: BookOpenIcon,
    color: 'green'
  },
  {
    title: 'Devoirs en cours',
    value: '8',
    change: '+2',
    changeType: 'increase',
    icon: ClipboardDocumentListIcon,
    color: 'purple'
  },
  {
    title: 'Messages non lus',
    value: '12',
    change: '-3',
    changeType: 'decrease',
    icon: ChatBubbleLeftRightIcon,
    color: 'orange'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'assignment_submitted',
    message: 'Marie Dubois a rendu son devoir "Conjugaison Ewondo"',
    time: 'Il y a 10 minutes',
    icon: ClipboardDocumentListIcon,
    color: 'blue'
  },
  {
    id: 2,
    type: 'lesson_completed',
    message: '15 étudiants ont terminé la leçon "Salutations"',
    time: 'Il y a 25 minutes',
    icon: AcademicCapIcon,
    color: 'green'
  },
  {
    id: 3,
    type: 'message_received',
    message: 'Nouveau message de Jean Kamga',
    time: 'Il y a 45 minutes',
    icon: ChatBubbleLeftRightIcon,
    color: 'purple'
  },
  {
    id: 4,
    type: 'achievement',
    message: 'Votre classe a atteint 90% de réussite!',
    time: 'Il y a 2 heures',
    icon: TrophyIcon,
    color: 'yellow'
  }
];

const upcomingClasses = [
  {
    id: 1,
    title: 'Ewondo Niveau 1',
    time: '14:00 - 15:30',
    students: 25,
    room: 'Salle virtuelle A'
  },
  {
    id: 2,
    title: 'Douala Intermédiaire',
    time: '16:00 - 17:30',
    students: 18,
    room: 'Salle virtuelle B'
  },
  {
    id: 3,
    title: 'Culture Bamiléké',
    time: '18:00 - 19:00',
    students: 12,
    room: 'Salle virtuelle C'
  }
];

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord enseignant</h1>
          <p className="text-gray-600">Gérez vos classes et suivez les progrès de vos étudiants</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="w-4 h-4" />
          <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStats.map((stat, index) => (
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
                      <span className="text-sm text-gray-500 ml-1">cette semaine</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-emerald-100`}>
                    <stat.icon className={`w-6 h-6 text-emerald-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AcademicCapIcon className="w-5 h-5" />
                  <span>Cours à venir</span>
                </div>
                <Button variant="outline" size="sm">Voir tout</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((class_) => (
                  <div key={class_.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{class_.title}</p>
                      <p className="text-sm text-gray-500">{class_.time} • {class_.room}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {class_.students} étudiants
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
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
                    <div className={`p-2 rounded-full bg-emerald-100`}>
                      <activity.icon className={`w-4 h-4 text-emerald-600`} />
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
      </div>

      {/* Quick Actions & Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpenIcon className="w-5 h-5" />
                <span>Actions rapides</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-emerald-600 hover:bg-emerald-700">
                  <AcademicCapIcon className="w-6 h-6" />
                  <span className="text-sm">Nouvelle leçon</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <ClipboardDocumentListIcon className="w-6 h-6" />
                  <span className="text-sm">Créer devoir</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <PresentationChartLineIcon className="w-6 h-6" />
                  <span className="text-sm">Voir progrès</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                  <span className="text-sm">Messages</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Class Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PresentationChartLineIcon className="w-5 h-5" />
                <span>Performance des classes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Ewondo Niveau 1</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">85%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Douala Intermédiaire</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">92%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Culture Bamiléké</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">78%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
