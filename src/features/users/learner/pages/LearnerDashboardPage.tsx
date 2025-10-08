import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  GlobeAltIcon,
  PlayIcon,
  CheckCircleIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon,
  BoltIcon,
  TagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, Button, Progress, Badge } from '@/shared/components/ui';
import { useAuthStore } from '@/features/auth/store/authStore';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { sqliteService } from '@/core/services/offline/sqlite.service';
import { ProgressDashboard, useProgressStore } from '@/features/progress';
import toast from 'react-hot-toast';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
  gradient: string;
}

interface DashboardStats {
  lessonsCompleted: number;
  totalLessons: number;
  wordsLearned: number;
  currentStreak: number;
  xpEarned: number;
  level: number;
  achievements: number;
  timeSpent: number;
}

interface RecentActivity {
  id: string;
  type: 'lesson' | 'quiz' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  xp?: number;
  score?: number;
}

interface Recommendation {
  id: string;
  type: 'lesson' | 'quiz' | 'review';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  language: string;
}

export default function LearnerDashboardPage() {
  const { user } = useAuthStore();
  const { 
    userProgress, 
    weeklyProgress, 
    insights,
    loading: progressLoading,
    loadUserProgress,
    loadWeeklyProgress,
    loadInsights,
    startStudySession,
    addXP
  } = useProgressStore();

  const [stats, setStats] = useState<DashboardStats>({
    lessonsCompleted: 0,
    totalLessons: 0,
    wordsLearned: 0,
    currentStreak: 0,
    xpEarned: 0,
    level: 1,
    achievements: 0,
    timeSpent: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'continue-learning',
      title: 'Continuer l\'apprentissage',
      description: 'Reprendre là où vous vous êtes arrêté',
      icon: PlayIcon,
      route: '/lessons',
      color: 'text-blue-600',
      gradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    {
      id: 'take-quiz',
      title: 'Passer un quiz',
      description: 'Testez vos connaissances',
      icon: SparklesIcon,
      route: '/quiz',
      color: 'text-green-600',
      gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      id: 'explore-dictionary',
      title: 'Explorer le dictionnaire',
      description: 'Découvrir de nouveaux mots',
      icon: BookOpenIcon,
      route: '/dictionary',
      color: 'text-purple-600',
      gradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    },
    {
      id: 'ai-assistant',
      title: 'Assistant IA',
      description: 'Obtenez de l\'aide personnalisée',
      icon: BoltIcon,
      route: '/ai-assistant',
      color: 'text-orange-600',
      gradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Load progress data
        await Promise.all([
          loadUserProgress(user.id),
          loadWeeklyProgress(user.id),
          loadInsights(user.id)
        ]);

        // Load user progress and statistics
        const progress = await hybridAuthService.getUserProgress();
        const achievements = await hybridAuthService.getUserAchievements();
        
        // Calculate stats from progress data
        const completedLessons = progress?.filter((p: any) => p.status === 'completed' && p.content_type === 'lesson').length || 0;
        const totalLessons = await sqliteService.query<{ count: number }>('SELECT COUNT(*) as count FROM lessons');
        const totalLessonCount = totalLessons[0]?.count || 0;

        // Update stats with progress data
        setStats({
          lessonsCompleted: completedLessons,
          totalLessons: totalLessonCount,
          wordsLearned: user.stats?.wordsLearned || 0,
          currentStreak: userProgress?.streak.current || 0,
          xpEarned: userProgress?.xp || user.stats?.xp || 0,
          level: userProgress?.level || user.stats?.level || 1,
          achievements: userProgress?.achievements.length || achievements?.length || 0,
          timeSpent: userProgress?.stats.totalStudyTime || user.stats?.totalTimeMinutes || 0,
        });

        // Load recent activities
        setRecentActivities([
          {
            id: '1',
            type: 'lesson',
            title: 'Salutations en Ewondo',
            description: 'Leçon terminée avec succès',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            xp: 15,
          },
          {
            id: '2',
            type: 'achievement',
            title: 'Premier pas',
            description: 'Première leçon terminée',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          },
          {
            id: '3',
            type: 'quiz',
            title: 'Quiz Vocabulaire Duala',
            description: 'Score: 85%',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            score: 85,
            xp: 20,
          },
        ]);

        // Load personalized recommendations
        setRecommendations([
          {
            id: '1',
            type: 'lesson',
            title: 'Les nombres en Ewondo',
            description: 'Apprenez à compter de 1 à 100',
            difficulty: 'beginner',
            estimatedTime: 15,
            language: 'Ewondo',
          },
          {
            id: '2',
            type: 'review',
            title: 'Révision: Salutations',
            description: 'Renforcez vos connaissances',
            difficulty: 'beginner',
            estimatedTime: 10,
            language: 'Ewondo',
          },
          {
            id: '3',
            type: 'quiz',
            title: 'Test de niveau Duala',
            description: 'Évaluez vos compétences',
            difficulty: 'intermediate',
            estimatedTime: 20,
            language: 'Duala',
          },
        ]);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, loadUserProgress, loadWeeklyProgress, loadInsights]);

  const handleStartStudySession = async (category: string) => {
    if (!user) return;
    
    try {
      await startStudySession(user.id, category);
      toast.success('Session d\'étude démarrée !');
    } catch (error) {
      console.error('Error starting study session:', error);
      toast.error('Erreur lors du démarrage de la session');
    }
  };

  const handleDailyBonus = async () => {
    if (!user) return;
    
    try {
      await addXP(user.id, 50, 'daily_bonus');
      toast.success('🎉 Bonus quotidien récupéré ! +50 XP');
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
      toast.error('Erreur lors de la récupération du bonus');
    }
  };

  const progressPercentage = stats.totalLessons > 0 ? (stats.lessonsCompleted / stats.totalLessons) * 100 : 0;

  if (loading || progressLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (showProgressDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => setShowProgressDashboard(false)}
              className="flex items-center space-x-2"
            >
              <ArrowRightIcon className="w-4 h-4 rotate-180" />
              <span>Retour au tableau de bord</span>
            </Button>
          </div>
          <ProgressDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Bonjour, {user?.displayName || 'Apprenant'} ! 👋
                </h1>
                <p className="text-white/90 mb-4">
                  Continuez votre apprentissage des langues camerounaises
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FireIcon className="h-5 w-5" />
                    <span>{stats.currentStreak} jours de suite</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrophyIcon className="h-5 w-5" />
                    <span>Niveau {stats.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="h-5 w-5" />
                    <span>{stats.xpEarned} XP</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="text-right">
                  <div className="text-4xl font-bold">{Math.round(progressPercentage)}%</div>
                  <div className="text-white/80">Progression globale</div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowProgressDashboard(true)}
                    className="mt-3"
                  >
                    <ChartBarIcon className="w-4 h-4 mr-2" />
                    Voir les détails
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <Link
                to={action.route}
                onClick={() => {
                  if (action.id === 'continue-learning') {
                    handleStartStudySession('general');
                  }
                }}
                className={`block p-6 rounded-xl bg-gradient-to-br ${action.gradient} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center"
          >
            <BookOpenIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.lessonsCompleted}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Leçons terminées</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center"
          >
            <GlobeAltIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.wordsLearned}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mots appris</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center"
          >
            <ClockIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(stats.timeSpent / 60)}h
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Temps d'étude</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center"
          >
            <TrophyIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.achievements}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Succès débloqués</div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Progression d'apprentissage
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProgressDashboard(true)}
                >
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  Détails
                </Button>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Leçons terminées</span>
                  <span>{stats.lessonsCompleted}/{stats.totalLessons}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Weekly Progress Summary */}
              {weeklyProgress && (
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {weeklyProgress.studyTime}m
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Cette semaine</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {weeklyProgress.xpEarned}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">XP gagnés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {weeklyProgress.daysActive}/7
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Jours actifs</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/lessons"
                  onClick={() => handleStartStudySession('lessons')}
                  className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <PlayIcon className="h-6 w-6 text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Continuer</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Prochaine leçon</div>
                  </div>
                </Link>
                <Link
                  to="/dictionary"
                  className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors"
                >
                  <BookOpenIcon className="h-6 w-6 text-secondary-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Dictionnaire</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Explorer</div>
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Recommandations pour vous
              </h2>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        rec.type === 'lesson' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        rec.type === 'quiz' ? 'bg-green-100 dark:bg-green-900/20' :
                        'bg-purple-100 dark:bg-purple-900/20'
                      }`}>
                        {rec.type === 'lesson' && <AcademicCapIcon className="h-5 w-5 text-blue-600" />}
                        {rec.type === 'quiz' && <SparklesIcon className="h-5 w-5 text-green-600" />}
                        {rec.type === 'review' && <ChartBarIcon className="h-5 w-5 text-purple-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{rec.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            rec.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            rec.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {rec.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">{rec.estimatedTime} min</span>
                          <span className="text-xs text-gray-500">{rec.language}</span>
                        </div>
                      </div>
                    </div>
                    <PlayIcon className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Insights */}
            {insights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Recommandations IA
                </h3>
                <div className="space-y-3">
                  {insights.slice(0, 2).map((insight) => (
                    <div key={insight.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        {insight.title}
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        {insight.message}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Activités récentes
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'lesson' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      activity.type === 'quiz' ? 'bg-green-100 dark:bg-green-900/20' :
                      'bg-yellow-100 dark:bg-yellow-900/20'
                    }`}>
                      {activity.type === 'lesson' && <BookOpenIcon className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'quiz' && <SparklesIcon className="h-4 w-4 text-green-600" />}
                      {activity.type === 'achievement' && <TrophyIcon className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.timestamp.toLocaleDateString('fr-FR')}
                        </span>
                        {activity.xp && (
                          <span className="text-xs text-primary-600">+{activity.xp} XP</span>
                        )}
                        {activity.score && (
                          <span className="text-xs text-green-600">{activity.score}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Daily Bonus */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-2">Bonus quotidien</h3>
              <p className="text-white/90 text-sm mb-4">
                Récupérez votre bonus quotidien de 50 XP !
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDailyBonus}
                className="w-full"
              >
                <BoltIcon className="w-4 h-4 mr-2" />
                Récupérer (+50 XP)
              </Button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Liens rapides
              </h3>
              <div className="space-y-3">
                <Link
                  to="/community"
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Communauté</span>
                </Link>
                <Link
                  to="/gamification"
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <TrophyIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Succès</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <TagIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Objectifs</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
