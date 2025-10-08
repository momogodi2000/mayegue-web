import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/components/ui';
import { ContentManagementPanel } from '../components/ContentManagementPanel';
import { enhancedTeacherService, type TeacherStats, type StudentProgress } from '../services/enhanced-teacher.service';
import toast from 'react-hot-toast';

export const EnhancedTeacherDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'students' | 'analytics'>('overview');
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [teacherStats, students] = await Promise.all([
        enhancedTeacherService.getTeacherStats(),
        enhancedTeacherService.getStudentProgress()
      ]);
      setStats(teacherStats);
      setStudentProgress(students);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      case 'pending_review':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content_approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'content_created':
        return <BookOpenIcon className="w-5 h-5 text-blue-600" />;
      case 'student_progress':
        return <AcademicCapIcon className="w-5 h-5 text-purple-600" />;
      case 'quiz_completed':
        return <TrophyIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
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
            Tableau de bord enseignant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenue, {user?.displayName || user?.email}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setActiveTab('content')}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Nouveau contenu</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
            { id: 'content', label: 'Contenu', icon: BookOpenIcon },
            { id: 'students', label: 'Étudiants', icon: UserGroupIcon },
            { id: 'analytics', label: 'Analytiques', icon: ChartBarIcon }
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Contenu total
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalContent}
                      </p>
                    </div>
                    <BookOpenIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600">
                      {stats.approvedContent} approuvé{stats.approvedContent > 1 ? 's' : ''}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Étudiants actifs
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.activeStudents}
                      </p>
                    </div>
                    <UserGroupIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      sur {stats.totalStudents} total
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Leçons terminées
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalLessonsCompleted}
                      </p>
                    </div>
                    <AcademicCapIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-purple-600">
                      Cette semaine
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Note moyenne
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.averageRating.toFixed(1)}/5
                      </p>
                    </div>
                    <TrophyIcon className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-yellow-600">
                      Excellent travail !
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>État du contenu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        <span>Approuvé</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{stats.approvedContent}</span>
                        <Badge variant="success" size="sm">
                          {Math.round((stats.approvedContent / stats.totalContent) * 100)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-5 h-5 text-yellow-600" />
                        <span>En attente</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{stats.pendingContent}</span>
                        <Badge variant="warning" size="sm">
                          {Math.round((stats.pendingContent / stats.totalContent) * 100)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <XCircleIcon className="w-5 h-5 text-red-600" />
                        <span>Rejeté</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{stats.rejectedContent}</span>
                        <Badge variant="danger" size="sm">
                          {Math.round((stats.rejectedContent / stats.totalContent) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        {getActivityIcon(activity.type)}
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
            </div>

            {/* Content by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Contenu par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(stats.contentByCategory).map(([category, count]) => (
                    <div key={category} className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {count}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {category}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'content' && (
          <ContentManagementPanel />
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Progression des étudiants
              </h2>
              <Button variant="outline">
                Exporter les données
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {studentProgress.map((student) => (
                <Card key={student.studentId}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {student.studentName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.studentEmail}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          Niveau {student.level}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {student.totalXP} XP
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {student.completedLessons}/{student.totalLessons}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Leçons
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {student.completedQuizzes}/{student.totalQuizzes}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Quiz
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {student.averageScore}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Score moyen
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatTimeAgo(student.lastActivity)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Dernière activité
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Points forts
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {student.strengths.map((strength, index) => (
                            <Badge key={index} variant="success" size="sm">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          À améliorer
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {student.weaknesses.map((weakness, index) => (
                            <Badge key={index} variant="warning" size="sm">
                              {weakness}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {student.recommendedContent.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Contenu recommandé
                        </h4>
                        <div className="space-y-1">
                          {student.recommendedContent.map((content, index) => (
                            <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                              {content}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytiques détaillées
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
              <ChartBarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Analytiques avancées
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Les graphiques et analyses détaillées seront disponibles prochainement.
              </p>
              <Button variant="outline">
                Demander l'accès anticipé
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
