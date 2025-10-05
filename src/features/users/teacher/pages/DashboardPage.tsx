import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  Progress,
  useToastActions
} from '@/shared/components/ui';
import { 
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import LessonCreationModal from '../components/LessonCreationModal';
import StudentProgressTracker from '../components/StudentProgressTracker';

interface DashboardStats {
  totalLessons: number;
  activeStudents: number;
  completedLessons: number;
  averageRating: number;
  totalHours: number;
  monthlyProgress: number;
}

export default function TeacherDashboardPage() {
  const { success: showSuccess, error: showError } = useToastActions();
  const [stats, setStats] = useState<DashboardStats>({
    totalLessons: 0,
    activeStudents: 0,
    completedLessons: 0,
    averageRating: 0,
    totalHours: 0,
    monthlyProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'students'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalLessons: 12,
        activeStudents: 68,
        completedLessons: 156,
        averageRating: 4.7,
        totalHours: 89,
        monthlyProgress: 85
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonCreated = (lesson: any) => {
    console.log('Lesson created:', lesson);
    setStats(prev => ({
      ...prev,
      totalLessons: prev.totalLessons + 1
    }));
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
    { id: 'students', label: 'Étudiants', icon: UserGroupIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tableau de bord Enseignant
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez vos leçons et suivez la progression de vos étudiants
            </p>
          </div>
          <Button onClick={() => setShowLessonModal(true)} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Nouvelle Leçon
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Mes Leçons
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalLessons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Étudiants Actifs
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.activeStudents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <TrophyIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Note Moyenne
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.averageRating}/5
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Heures Total
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalHours}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5" />
              Progression du Mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Objectif mensuel
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {stats.monthlyProgress}%
              </span>
            </div>
            <Progress value={stats.monthlyProgress} className="h-3" />
            <p className="text-xs text-gray-500 mt-2">
              {stats.completedLessons} leçons complétées ce mois
            </p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Leçons Récentes</span>
                  <Link to="/teacher/lessons" className="text-sm text-primary-600 hover:text-primary-700">
                    Voir tout
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Salutations en Dualaba', students: 45, rating: 4.8 },
                    { title: 'Grammaire Ewondo', students: 32, rating: 4.6 },
                    { title: 'Culture Bassa', students: 28, rating: 4.9 }
                  ].map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.students} étudiants</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{lesson.rating}/5</Badge>
                        <Button size="sm" variant="ghost">
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowLessonModal(true)}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Créer une nouvelle leçon
                  </Button>
                  <Link to="/teacher/lessons" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpenIcon className="w-4 h-4 mr-2" />
                      Gérer mes leçons
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => setActiveTab('students')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    Voir les étudiants
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'students' && (
          <StudentProgressTracker />
        )}

        {/* Lesson Creation Modal */}
        <LessonCreationModal
          isOpen={showLessonModal}
          onClose={() => setShowLessonModal(false)}
          onLessonCreated={handleLessonCreated}
        />
      </div>
    </div>
  );
}

