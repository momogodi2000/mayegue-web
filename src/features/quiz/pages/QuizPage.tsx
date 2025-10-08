import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Input, 
  Button,
  Badge
} from '@/shared/components/ui';
import { LoadingScreen } from '@/shared/components/ui/LoadingScreen';
import { QuizCard } from '../components/QuizCard';
import { QuizPlayer } from '../components/QuizPlayer';
import { QuizResults } from '../components/QuizResults';
import { quizService } from '../services/quiz.service';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { Quiz, QuizSession, QuizResult, QuizStats } from '../types/quiz.types';
import toast from 'react-hot-toast';

type ViewMode = 'list' | 'playing' | 'results' | 'stats';

export default function QuizPage() {
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [userStats, setUserStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  // Load quizzes on component mount
  useEffect(() => {
    loadQuizzes();
    if (user) {
      loadUserStats();
    }
  }, [user]);

  // Filter quizzes based on search and filters
  useEffect(() => {
    let filtered = quizzes;

    if (searchQuery) {
      filtered = filtered.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLanguage) {
      filtered = filtered.filter(quiz => quiz.language === selectedLanguage);
    }

    if (selectedCategory) {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty);
    }

    setFilteredQuizzes(filtered);
  }, [quizzes, searchQuery, selectedLanguage, selectedCategory, selectedDifficulty]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const availableQuizzes = await quizService.getAvailableQuizzes();
      setQuizzes(availableQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast.error('Erreur lors du chargement des quiz');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const stats = await quizService.getUserQuizStats(user.id);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    try {
      const quiz = await quizService.getQuizById(quizId);
      if (!quiz) {
        toast.error('Quiz introuvable');
        return;
      }

      const session = await quizService.startQuizAttempt(quizId);
      setCurrentQuiz(quiz);
      setCurrentSession(session);
      setViewMode('playing');
    } catch (error: any) {
      console.error('Error starting quiz:', error);
      if (error.message === '2FA_SETUP_REQUIRED') {
        toast.error('Vous devez configurer l\'authentification à deux facteurs');
      } else if (error.message === 'Maximum attempts exceeded') {
        toast.error('Nombre maximum de tentatives atteint pour ce quiz');
      } else {
        toast.error('Erreur lors du démarrage du quiz');
      }
    }
  };

  const handleQuizComplete = async (sessionId: string) => {
    try {
      const result = await quizService.completeQuizAttempt(sessionId);
      setQuizResult(result);
      setViewMode('results');
      
      // Reload stats
      if (user) {
        await loadUserStats();
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
      toast.error('Erreur lors de la finalisation du quiz');
    }
  };

  const handleRetryQuiz = () => {
    if (currentQuiz) {
      handleStartQuiz(currentQuiz.id);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setCurrentQuiz(null);
    setCurrentSession(null);
    setQuizResult(null);
  };

  const handleViewStats = () => {
    setViewMode('stats');
  };

  // Get unique values for filters
  const languages = [...new Set(quizzes.map(quiz => quiz.language))];
  const categories = [...new Set(quizzes.map(quiz => quiz.category))];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Quiz d'Apprentissage
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Testez vos connaissances avec nos quiz interactifs et suivez vos progrès
              </p>
            </div>

            {/* User Stats Overview */}
            {userStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <AcademicCapIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.completedQuizzes}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Quiz terminés
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <TrophyIcon className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(userStats.averageScore)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Score moyen
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <ClockIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.streakDays}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Jours consécutifs
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Button
                      variant="outline"
                      onClick={handleViewStats}
                      className="w-full"
                    >
                      Voir Détails
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Recherche et Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Rechercher un quiz..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Toutes les langues</option>
                    {languages.map(language => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Toutes les difficultés</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty === 'beginner' ? 'Débutant' : 
                         difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map(quiz => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onStart={handleStartQuiz}
                />
              ))}
            </div>

            {filteredQuizzes.length === 0 && (
              <div className="text-center py-12">
                <AcademicCapIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Aucun quiz trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </motion.div>
        )}

        {viewMode === 'playing' && currentQuiz && currentSession && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <QuizPlayer
              quiz={currentQuiz}
              session={currentSession}
              onComplete={handleQuizComplete}
              onExit={handleBackToList}
            />
          </motion.div>
        )}

        {viewMode === 'results' && quizResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <QuizResults
              result={quizResult}
              onRetry={handleRetryQuiz}
              onHome={handleBackToList}
              onViewStats={handleViewStats}
            />
          </motion.div>
        )}

        {viewMode === 'stats' && userStats && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Mes Statistiques
              </h1>
              <Button variant="outline" onClick={handleBackToList}>
                Retour aux Quiz
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {Math.round(userStats.bestScore)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Meilleur Score
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <AcademicCapIcon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {userStats.totalQuizzes}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Quiz Différents
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <ClockIcon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {Math.floor(userStats.totalTimeSpent / 60)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Minutes Totales
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    🔥 {userStats.streakDays}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Série Actuelle
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance par Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(userStats.categoryStats).map(([category, stats]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {category}
                        </span>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {stats.completed} quiz terminés
                          </span>
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                            {Math.round(stats.averageScore)}% moyen
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
