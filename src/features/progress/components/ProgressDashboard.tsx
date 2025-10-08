import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  StarIcon,
  CalendarIcon,
  BoltIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Badge,
  Button
} from '@/shared/components/ui';
import { useAuthStore } from '@/features/auth/store/authStore';
import { progressService } from '../services/progress.service';
import type { UserProgress, WeeklyProgress, LearningInsight } from '../types/progress.types';
import { ProgressChart } from './ProgressChart';
import { AchievementCard } from './AchievementCard';
import { GoalCard } from './GoalCard';
import { InsightCard } from './InsightCard';
import toast from 'react-hot-toast';

export const ProgressDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [progressData, weeklyData, insightsData] = await Promise.all([
        progressService.getUserProgress(user.id),
        progressService.getWeeklyProgress(user.id),
        progressService.getLearningInsights(user.id)
      ]);

      setProgress(progressData);
      setWeeklyProgress(weeklyData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading progress data:', error);
      toast.error('Erreur lors du chargement des données de progression');
    } finally {
      setLoading(false);
    }
  };

  const handleAddXP = async (amount: number, source: string) => {
    if (!user) return;

    try {
      const result = await progressService.addXP(user.id, amount, source);
      if (result.leveledUp) {
        toast.success(`🎉 Niveau ${result.newLevel} atteint !`);
      }
      await loadProgressData();
    } catch (error) {
      console.error('Error adding XP:', error);
      toast.error('Erreur lors de l\'ajout d\'XP');
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '✨';
    if (streak >= 3) return '💫';
    return '🌟';
  };

  const getLevelProgress = (xp: number, xpToNext: number): number => {
    const totalXpForLevel = xp + xpToNext;
    return totalXpForLevel > 0 ? (xp / totalXpForLevel) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Aucune donnée de progression
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Commencez à apprendre pour voir vos progrès ici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tableau de Bord
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Suivez vos progrès et atteignez vos objectifs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedTimeframe === 'week' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('week')}
          >
            Semaine
          </Button>
          <Button
            variant={selectedTimeframe === 'month' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('month')}
          >
            Mois
          </Button>
          <Button
            variant={selectedTimeframe === 'year' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('year')}
          >
            Année
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Level & XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <AcademicCapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Niveau</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.level}</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {progress.xp} XP
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progrès vers niveau {progress.level + 1}</span>
                  <span className="font-medium">{progress.xpToNextLevel} XP restants</span>
                </div>
                <Progress value={getLevelProgress(progress.xp, progress.xpToNextLevel)} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FireIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Série</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.streak.current}</p>
                  </div>
                </div>
                <div className="text-2xl">{getStreakEmoji(progress.streak.current)}</div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Record: {progress.streak.longest} jours
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Study Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temps d'étude</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatTime(progress.stats.totalStudyTime)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Cette semaine: {weeklyProgress ? formatTime(weeklyProgress.studyTime) : '0m'}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrophyIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Succès</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.achievements.length}</p>
                  </div>
                </div>
                <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Badges: {progress.badges.length}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Progress */}
      {weeklyProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Progrès de la Semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Temps d'étude
                      </span>
                      <span className="text-sm font-bold">
                        {formatTime(weeklyProgress.studyTime)} / {formatTime(weeklyProgress.goals.studyTime.target)}
                      </span>
                    </div>
                    <Progress 
                      value={(weeklyProgress.studyTime / weeklyProgress.goals.studyTime.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Leçons
                      </span>
                      <span className="text-sm font-bold">
                        {weeklyProgress.lessonsCompleted} / {weeklyProgress.goals.lessons.target}
                      </span>
                    </div>
                    <Progress 
                      value={(weeklyProgress.lessonsCompleted / weeklyProgress.goals.lessons.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Quiz
                      </span>
                      <span className="text-sm font-bold">
                        {weeklyProgress.quizzesCompleted} / {weeklyProgress.goals.quizzes.target}
                      </span>
                    </div>
                    <Progress 
                      value={(weeklyProgress.quizzesCompleted / weeklyProgress.goals.quizzes.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {weeklyProgress.xpEarned}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">XP gagnés</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {Math.round(weeklyProgress.averageScore)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Score moyen</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {weeklyProgress.daysActive}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Jours actifs</div>
                  </div>
                  
                  <Button
                    onClick={() => handleAddXP(50, 'weekly_bonus')}
                    className="w-full"
                    variant="outline"
                  >
                    <BoltIcon className="w-4 h-4 mr-2" />
                    Bonus quotidien (+50 XP)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Évolution des Performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart 
              userId={user?.id || ''} 
              timeframe={selectedTimeframe}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TagIcon className="w-5 h-5 mr-2" />
                Objectifs Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.goals.length > 0 ? (
                  progress.goals.slice(0, 3).map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <TagIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucun objectif défini
                    </p>
                    <Button className="mt-4" variant="outline">
                      Créer un objectif
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <StarIcon className="w-5 h-5 mr-2" />
                Succès Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.achievements.length > 0 ? (
                  progress.achievements.slice(0, 3).map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <TrophyIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucun succès débloqué
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Continuez à apprendre pour débloquer des succès !
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Learning Insights */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BoltIcon className="w-5 h-5 mr-2" />
                Recommandations Personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
