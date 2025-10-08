import React from 'react';
import { motion } from 'framer-motion';
import {
  LightBulbIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Badge, Button } from '@/shared/components/ui';
import type { LearningInsight } from '../types/progress.types';

interface InsightCardProps {
  insight: LearningInsight;
  onAction?: (insight: LearningInsight) => void;
  onDismiss?: (insightId: string) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ 
  insight, 
  onAction, 
  onDismiss 
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return TrophyIcon;
      case 'improvement':
        return ArrowTrendingUpIcon;
      case 'recommendation':
        return LightBulbIcon;
      case 'milestone':
        return TrophyIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') {
      switch (type) {
        case 'warning':
          return {
            bg: 'bg-red-50 dark:bg-red-900/10',
            border: 'border-red-200 dark:border-red-800',
            icon: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
            text: 'text-red-900 dark:text-red-100'
          };
        case 'achievement':
        case 'milestone':
          return {
            bg: 'bg-yellow-50 dark:bg-yellow-900/10',
            border: 'border-yellow-200 dark:border-yellow-800',
            icon: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
            text: 'text-yellow-900 dark:text-yellow-100'
          };
        default:
          return {
            bg: 'bg-blue-50 dark:bg-blue-900/10',
            border: 'border-blue-200 dark:border-blue-800',
            icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            text: 'text-blue-900 dark:text-blue-100'
          };
      }
    } else if (priority === 'medium') {
      return {
        bg: 'bg-purple-50 dark:bg-purple-900/10',
        border: 'border-purple-200 dark:border-purple-800',
        icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        text: 'text-purple-900 dark:text-purple-100'
      };
    } else {
      return {
        bg: 'bg-gray-50 dark:bg-gray-800',
        border: 'border-gray-200 dark:border-gray-700',
        icon: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
        text: 'text-gray-900 dark:text-white'
      };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Priorité élevée';
      case 'medium':
        return 'Priorité moyenne';
      case 'low':
        return 'Priorité faible';
      default:
        return 'Priorité normale';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const IconComponent = getInsightIcon(insight.type);
  const colors = getInsightColor(insight.type, insight.priority);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${colors.bg} ${colors.border}`}
    >
      {/* Priority Badge */}
      <div className="absolute top-3 right-3">
        <Badge className={getPriorityColor(insight.priority)}>
          {getPriorityLabel(insight.priority)}
        </Badge>
      </div>

      <div className="flex items-start space-x-3 pr-20">
        {/* Insight Icon */}
        <div className={`p-2 rounded-lg flex-shrink-0 ${colors.icon}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Insight Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold mb-1 ${colors.text}`}>
            {insight.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {insight.message}
          </p>

          {/* Action Button */}
          {insight.actionable && insight.action && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction?.(insight)}
                className="flex items-center space-x-1"
              >
                <span>{insight.action.label}</span>
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(insight.createdAt)}
            </span>

            {/* Dismiss Button */}
            {onDismiss && (
              <button
                onClick={() => onDismiss(insight.id)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Ignorer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Read Indicator */}
      {!insight.isRead && (
        <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full" />
      )}

      {/* High Priority Glow */}
      {insight.priority === 'high' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-400/10 to-orange-400/10 animate-pulse pointer-events-none" />
      )}
    </motion.div>
  );
};
