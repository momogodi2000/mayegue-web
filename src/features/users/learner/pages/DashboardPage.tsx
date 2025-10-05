/**
 * Learner Dashboard - Enhanced with animations, stats, and rich content
 * @version 1.1.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  SparklesIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  GlobeAltIcon,
  CpuChipIcon,
  UsersIcon,
  HeartIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { AnimatedSection, FloatingCard, CountUp } from '@/shared/components/ui/AnimatedComponents';
import { Button } from '@/shared/components/ui';
import toast from 'react-hot-toast';

interface LearningStats {
  lessonsCompleted: number;
  wordsLearned: number;
  currentStreak: number;
  totalXP: number;
  level: number;
  nextLevelXP: number;
}

interface RecentLesson {
  id: string;
  title: string;
  language: string;
  progress: number;
  difficulty: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
}

export default function LearnerDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<LearningStats>({
    lessonsCompleted: 0,
    wordsLearned: 0,
    currentStreak: 0,
    totalXP: 0,
    level: 1,
    nextLevelXP: 100
  });

  const [recentLessons, setRecentLessons] = useState<RecentLesson[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsLevelTest, setNeedsLevelTest] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Check if user needs to take level test
      const hasCompletedLevelTest = user?.stats?.level && user.stats.level > 1;
      const hasAnyProgress = user?.stats?.lessonsCompleted && user.stats.lessonsCompleted > 0;
      
      if (!hasCompletedLevelTest && !hasAnyProgress) {
        setNeedsLevelTest(true);
        setLoading(false);
        return;
      }

      // Load user stats from Firestore or use defaults
      if (user?.stats) {
        setStats({
          lessonsCompleted: user.stats.lessonsCompleted || 0,
          wordsLearned: user.stats.wordsLearned || 0,
          currentStreak: user.stats.currentStreak || 0,
          totalXP: user.stats.xp || 0,
          level: user.stats.level || 1,
          nextLevelXP: (user.stats.level || 1) * 100
        });
      } else {
        // Set default stats for new users
        setStats({
          lessonsCompleted: 0,
          wordsLearned: 0,
          currentStreak: 0,
          totalXP: 0,
          level: 1,
          nextLevelXP: 100
        });
      }

      // Mock recent lessons (replace with real data)
      setRecentLessons([
        { id: '1', title: 'Salutations de base', language: 'Ewondo', progress: 75, difficulty: 'Débutant' },
        { id: '2', title: 'Les nombres', language: 'Douala', progress: 45, difficulty: 'Débutant' },
        { id: '3', title: 'Famille et relations', language: 'Bamiléké', progress: 30, difficulty: 'Intermédiaire' }
      ]);

      // Mock achievements (replace with real data)
      setAchievements([
        { id: '1', title: 'Premier Pas', description: 'Complétez votre première leçon', icon: '🎯', unlockedAt: new Date() },
        { id: '2', title: 'Linguiste Débutant', description: 'Apprenez 50 mots', icon: '📚', progress: 60 },
        { id: '3', title: 'Séquence de 7 jours', description: 'Maintenez une séquence de 7 jours', icon: '🔥', progress: 40 },
        { id: '4', title: 'Explorateur Culturel', description: 'Visitez 5 sites historiques', icon: '🏛️', progress: 20 }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (stats.totalXP / stats.nextLevelXP) * 100;

  const quickActions = [
    { title: 'Nouvelle Leçon', icon: PlayIcon, link: '/lessons', color: 'bg-blue-500', description: 'Commencez une nouvelle leçon' },
    { title: 'Dictionnaire', icon: BookOpenIcon, link: '/dictionary', color: 'bg-green-500', description: 'Recherchez des mots' },
    { title: 'Assistant IA', icon: CpuChipIcon, link: '/ai-features', color: 'bg-purple-500', description: 'Pratiquez avec l\'IA' },
    { title: 'Atlas Linguistique', icon: GlobeAltIcon, link: '/atlas', color: 'bg-orange-500', description: 'Explorez les langues' },
    { title: 'AR/VR', icon: SparklesIcon, link: '/ar-vr', color: 'bg-pink-500', description: 'Expériences immersives' },
    { title: 'Communauté', icon: UsersIcon, link: '/community', color: 'bg-indigo-500', description: 'Rejoignez la communauté' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show level test prompt for new users
  if (needsLevelTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Helmet>
          <title>Test de Niveau Requis - Ma'a yegue</title>
        </Helmet>

        <div className="container-custom py-12">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-8">
                <ExclamationTriangleIcon className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Bienvenue dans Ma'a yegue ! 🎉
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Avant de commencer votre apprentissage, nous devons évaluer votre niveau actuel 
                pour vous proposer des leçons adaptées à vos compétences.
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Pourquoi passer un test de niveau ?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start space-x-3">
                    <AcademicCapIcon className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Apprentissage Personnalisé
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Recevez des leçons adaptées à votre niveau réel
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <TrophyIcon className="w-6 h-6 text-yellow-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Progression Optimale
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Évitez les leçons trop faciles ou trop difficiles
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <SparklesIcon className="w-6 h-6 text-purple-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        IA Adaptative
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Notre IA s'adapte à votre style d'apprentissage
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/level-test')}
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  <AcademicCapIcon className="w-5 h-5 mr-2" />
                  Passer le Test de Niveau
                </Button>
                
                <Button
                  onClick={() => setNeedsLevelTest(false)}
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  Passer pour l'instant
                </Button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                ⏱️ Le test prend environ 15-20 minutes et s'adapte à vos réponses
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>Tableau de bord - Ma'a yegue</title>
      </Helmet>

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-8">
        <div className="container-custom">
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Bonjour, {user?.displayName || 'Apprenant'}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Continuez votre voyage d'apprentissage des langues camerounaises
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>

      <div className="container-custom py-8 space-y-8">
        {/* Stats Overview */}
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <AcademicCapIcon className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  <CountUp end={stats.lessonsCompleted} duration={2} />
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Leçons complétées</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <BookOpenIcon className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  <CountUp end={stats.wordsLearned} duration={2} />
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mots appris</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <FireIcon className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  <CountUp end={stats.currentStreak} duration={2} />
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Jours consécutifs</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <TrophyIcon className="w-8 h-8 text-yellow-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  <CountUp end={stats.totalXP} duration={2} />
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Points XP</p>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Level Progress */}
        <AnimatedSection>
          <FloatingCard className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">Niveau {stats.level}</h3>
                <p className="text-purple-100">
                  {stats.totalXP} / {stats.nextLevelXP} XP
                </p>
              </div>
              <StarIcon className="w-16 h-16 text-yellow-300" />
            </div>
            <div className="w-full bg-purple-300 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-white h-4 rounded-full"
              />
            </div>
          </FloatingCard>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link to={action.link} className="block">
                  <div className={`${action.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
                    <action.icon className="w-8 h-8 mb-3 mx-auto" />
                    <h3 className="font-semibold text-center mb-1">{action.title}</h3>
                    <p className="text-xs text-center opacity-90">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Recent Lessons & Achievements */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Lessons */}
          <AnimatedSection>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Continuer l'apprentissage
                </h2>
                <Link to="/lessons" className="text-primary-600 hover:text-primary-700 flex items-center">
                  Voir tout <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{lesson.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                        {lesson.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {lesson.language}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lesson.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="bg-primary-600 h-2 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {lesson.progress}% complété
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Achievements */}
          <AnimatedSection>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Accomplissements
                </h2>
                <Link to="/rpg-gamification" className="text-primary-600 hover:text-primary-700 flex items-center">
                  Voir tout <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 ${
                      achievement.unlockedAt
                        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        {achievement.progress !== undefined && (
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${achievement.progress}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className="bg-yellow-500 h-1.5 rounded-full"
                            />
                          </div>
                        )}
                        {achievement.unlockedAt && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center">
                            <TrophyIcon className="w-3 h-3 mr-1" />
                            Débloqué !
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Daily Goal */}
        <AnimatedSection>
          <FloatingCard className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Objectif quotidien</h3>
                <p className="text-green-100">
                  Vous avez pratiqué 15 minutes aujourd'hui. Continuez!
                </p>
              </div>
              <div className="text-center">
                <ClockIcon className="w-16 h-16 mx-auto mb-2" />
                <p className="text-2xl font-bold">15/30</p>
                <p className="text-sm text-green-100">minutes</p>
              </div>
            </div>
            <div className="w-full bg-green-300 rounded-full h-3 mt-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-white h-3 rounded-full"
              />
            </div>
          </FloatingCard>
        </AnimatedSection>

        {/* Motivational Quote */}
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <HeartIcon className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              "La langue est la feuille de route d'une culture. Elle vous dit d'où viennent ses gens et où ils vont."
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">— Proverbe Africain</p>
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  );
}
