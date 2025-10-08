import React from 'react';
import { motion } from 'framer-motion';
import {
  TagIcon,
  ClockIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  SparklesIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Progress, Badge } from '@/shared/components/ui';
import type { LearningGoal } from '../types/progress.types';

interface GoalCardProps {
  goal: LearningGoal;
  onComplete?: (goalId: string) => void;
  onEdit?: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onComplete, onEdit }) => {
  const getGoalIcon = (unit: string) => {
    switch (unit) {
      case 'minutes':
        return ClockIcon;
      case 'lessons':
        return AcademicCapIcon;
      case 'quizzes':
        return QuestionMarkCircleIcon;
      case 'words':
        return BookOpenIcon;
      case 'points':
        return SparklesIcon;
      default:
        return TagIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'weekly':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'monthly':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'custom':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getProgressPercentage = () => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const formatDeadline = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Expiré', color: 'text-red-600 dark:text-red-400' };
    } else if (diffDays === 0) {
      return { text: 'Aujourd\'hui', color: 'text-orange-600 dark:text-orange-400' };
    } else if (diffDays === 1) {
      return { text: 'Demain', color: 'text-yellow-600 dark:text-yellow-400' };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} jours`, color: 'text-yellow-600 dark:text-yellow-400' };
    } else {
      return { 
        text: deadline.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short' 
        }), 
        color: 'text-gray-600 dark:text-gray-400' 
      };
    }
  };

  const getUnitLabel = (unit: string, count: number) => {
    switch (unit) {
      case 'minutes':
        return count > 1 ? 'minutes' : 'minute';
      case 'lessons':
        return count > 1 ? 'leçons' : 'leçon';
      case 'quizzes':
        return count > 1 ? 'quiz' : 'quiz';
      case 'words':
        return count > 1 ? 'mots' : 'mot';
      case 'points':
        return count > 1 ? 'points' : 'point';
      default:
        return unit;
    }
  };

  const IconComponent = getGoalIcon(goal.unit);
  const deadline = formatDeadline(goal.deadline);
  const progressPercentage = getProgressPercentage();
  const isCompleted = goal.isCompleted || progressPercentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-4 rounded-lg border transition-all duration-200 ${
        isCompleted
          ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800'
          : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md'
      }`}
    >
      {/* Goal Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isCompleted 
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {isCompleted ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <IconComponent className="w-5 h-5" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${
              isCompleted 
                ? 'text-green-900 dark:text-green-100' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {goal.title}
            </h3>
            <p className={`text-sm ${
              isCompleted 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {goal.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge className={getTypeColor(goal.type)}>
            {goal.type === 'daily' ? 'Quotidien' :
             goal.type === 'weekly' ? 'Hebdomadaire' :
             goal.type === 'monthly' ? 'Mensuel' : 'Personnalisé'}
          </Badge>
          {isCompleted && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              ✓ Terminé
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progrès
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {goal.current} / {goal.target} {getUnitLabel(goal.unit, goal.target)}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(progressPercentage)}% complété
            </span>
            {!isCompleted && (
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {goal.target - goal.current} restants
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {/* Deadline */}
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span className={`text-sm ${deadline.color}`}>
                {deadline.text}
              </span>
            </div>

            {/* Reward */}
            {goal.reward.xp > 0 && (
              <div className="flex items-center space-x-1">
                <SparklesIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                  +{goal.reward.xp} XP
                </span>
              </div>
            )}

            {goal.reward.badge && (
              <div className="flex items-center space-x-1">
                <TagIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  Badge
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {!isCompleted && progressPercentage >= 100 && onComplete && (
              <button
                onClick={() => onComplete(goal.id)}
                className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                Marquer terminé
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(goal.id)}
                className="text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Animation */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2"
        >
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
