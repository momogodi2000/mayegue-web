import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  AcademicCapIcon, 
  StarIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/shared/components/ui';
import type { Quiz } from '../types/quiz.types';

interface QuizCardProps {
  quiz: Quiz;
  userAttempts?: number;
  bestScore?: number;
  onStart: (quizId: string) => void;
  disabled?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  userAttempts = 0,
  bestScore,
  onStart,
  disabled = false
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const isCompleted = bestScore !== undefined && bestScore >= quiz.passingScore;
  const maxAttemptsReached = quiz.maxAttempts && userAttempts >= quiz.maxAttempts;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {quiz.title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {quiz.description}
              </p>
            </div>
            {isCompleted && (
              <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quiz Metadata */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(quiz.difficulty)}>
              {quiz.difficulty}
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
              {quiz.language}
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
              {quiz.category}
            </Badge>
          </div>

          {/* Quiz Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <AcademicCapIcon className="w-4 h-4 mr-2" />
              <span>{quiz.questions.length} questions</span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>{quiz.timeLimit} min</span>
              </div>
            )}
          </div>

          {/* User Progress */}
          {userAttempts > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tentatives:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {userAttempts}{quiz.maxAttempts ? `/${quiz.maxAttempts}` : ''}
                </span>
              </div>
              {bestScore !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Meilleur score:</span>
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className={`font-medium ${bestScore >= quiz.passingScore ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                      {Math.round(bestScore)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={() => onStart(quiz.id)}
              disabled={disabled || Boolean(maxAttemptsReached)}
              className="w-full"
              variant={isCompleted ? "outline" : "primary"}
            >
              <PlayIcon className="w-4 h-4 mr-2" />
              {maxAttemptsReached 
                ? 'Limite atteinte'
                : isCompleted 
                  ? 'Refaire le quiz'
                  : userAttempts > 0 
                    ? 'Continuer'
                    : 'Commencer'
              }
            </Button>
          </div>

          {/* Passing Score Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Score de réussite: {quiz.passingScore}%
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
