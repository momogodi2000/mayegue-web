import React from 'react';
import { motion } from 'framer-motion';
import {
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ArrowPathIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, Button, Progress, Badge } from '@/shared/components/ui';
import type { QuizResult } from '../types/quiz.types';

interface QuizResultsProps {
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
  onViewStats: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  onRetry,
  onHome,
  onViewStats
}) => {
  const { quiz, attempt, correctAnswers, totalQuestions, percentage, passed, timeSpent, breakdown } = result;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGradeEmoji = (score: number) => {
    if (score >= 95) return '🏆';
    if (score >= 85) return '🥇';
    if (score >= 75) return '🥈';
    if (score >= 65) return '🥉';
    return '📚';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">
          {getGradeEmoji(percentage)}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {passed ? 'Félicitations !' : 'Continuez vos efforts !'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Vous avez {passed ? 'réussi' : 'échoué'} le quiz "{quiz.title}"
        </p>
      </motion.div>

      {/* Score Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrophyIcon className="w-6 h-6 mr-2" />
              Résultats du Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score */}
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                  {Math.round(percentage)}%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Score final</p>
                <div className="mt-2">
                  <Progress value={percentage} className="h-2" />
                </div>
              </div>

              {/* Correct Answers */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {correctAnswers}/{totalQuestions}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bonnes réponses</p>
                <div className="flex justify-center mt-2">
                  {passed ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Réussi
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      Échoué
                    </Badge>
                  )}
                </div>
              </div>

              {/* Time */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatTime(timeSpent)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Temps total</p>
                <div className="flex justify-center items-center mt-2 text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {quiz.timeLimit ? `Limite: ${quiz.timeLimit} min` : 'Pas de limite'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown */}
      {breakdown.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartBarIcon className="w-6 h-6 mr-2" />
                Détail par Catégorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {breakdown.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {category.correct}/{category.total} ({Math.round(category.percentage)}%)
                      </span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <StarIcon className="w-6 h-6 mr-2" />
              Analyse de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Points forts</h4>
                <ul className="space-y-2 text-sm">
                  {breakdown
                    .filter(cat => cat.percentage >= 80)
                    .map((cat, index) => (
                      <li key={index} className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Excellent en {cat.category} ({Math.round(cat.percentage)}%)
                      </li>
                    ))}
                  {timeSpent < (quiz.timeLimit || 30) * 60 * 0.8 && (
                    <li className="flex items-center text-green-600 dark:text-green-400">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Bonne gestion du temps
                    </li>
                  )}
                  {percentage >= 90 && (
                    <li className="flex items-center text-green-600 dark:text-green-400">
                      <TrophyIcon className="w-4 h-4 mr-2" />
                      Performance exceptionnelle
                    </li>
                  )}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">À améliorer</h4>
                <ul className="space-y-2 text-sm">
                  {breakdown
                    .filter(cat => cat.percentage < 70)
                    .map((cat, index) => (
                      <li key={index} className="flex items-center text-orange-600 dark:text-orange-400">
                        <XCircleIcon className="w-4 h-4 mr-2" />
                        Réviser {cat.category} ({Math.round(cat.percentage)}%)
                      </li>
                    ))}
                  {!passed && (
                    <li className="flex items-center text-orange-600 dark:text-orange-400">
                      <ArrowPathIcon className="w-4 h-4 mr-2" />
                      Score minimum requis: {quiz.passingScore}%
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={onRetry}
          variant="primary"
          size="lg"
          disabled={quiz.maxAttempts ? attempt.userId.length >= quiz.maxAttempts : false}
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Refaire le Quiz
        </Button>

        <Button
          onClick={onViewStats}
          variant="outline"
          size="lg"
        >
          <ChartBarIcon className="w-5 h-5 mr-2" />
          Voir mes Statistiques
        </Button>

        <Button
          onClick={onHome}
          variant="outline"
          size="lg"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Retour aux Quiz
        </Button>
      </motion.div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-6">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {passed 
              ? "Excellent travail ! Continuez sur cette lancée." 
              : "Ne vous découragez pas ! Chaque tentative vous rapproche du succès."
            }
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {passed
              ? "Explorez d'autres quiz pour continuer à apprendre."
              : "Révisez les points à améliorer et réessayez."
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
};
