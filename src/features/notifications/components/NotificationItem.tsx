import React from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/shared/components/ui';
import type { UserNotification } from '../types/notification.types';

interface NotificationItemProps {
  notification: UserNotification;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  showActions?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDelete,
  onClick,
  showActions = true
}) => {
  const getCategoryIcon = (category: string) => {
    const icons = {
      achievement: '🏆',
      lesson: '📚',
      quiz: '❓',
      reminder: '⏰',
      social: '👥',
      system: '⚙️',
      marketing: '📢',
      announcement: '📣',
      progress: '📈',
      goal: '🎯'
    };
    return icons[category as keyof typeof icons] || '🔔';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'max':
        return 'border-red-500 bg-red-50 dark:bg-red-900/10';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'normal':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/10';
      case 'low':
        return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
      default:
        return 'border-gray-300 bg-white dark:bg-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'max':
      case 'high':
        return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      achievement: 'Succès',
      lesson: 'Leçon',
      quiz: 'Quiz',
      reminder: 'Rappel',
      social: 'Social',
      system: 'Système',
      marketing: 'Marketing',
      announcement: 'Annonce',
      progress: 'Progrès',
      goal: 'Objectif'
    };
    return labels[category as keyof typeof labels] || 'Notification';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      achievement: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      lesson: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      quiz: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      reminder: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      social: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      system: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      marketing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      announcement: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      progress: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
      goal: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
        getPriorityColor(notification.priority)
      } ${!notification.isRead ? 'ring-1 ring-blue-200 dark:ring-blue-800' : ''}`}
      onClick={() => onClick?.(notification.id)}
    >
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
      )}

      <div className="flex items-start space-x-3">
        {/* Category Icon */}
        <div className="flex-shrink-0 text-xl">
          {getCategoryIcon(notification.category)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${getCategoryColor(notification.category)}`}>
                {getCategoryLabel(notification.category)}
              </Badge>
              {getPriorityIcon(notification.priority)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="w-3 h-3" />
              <span>{formatTime(notification.receivedAt)}</span>
            </div>
          </div>

          {/* Title */}
          <h4 className={`text-sm font-semibold mb-1 ${
            !notification.isRead 
              ? 'text-gray-900 dark:text-white' 
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {notification.title}
          </h4>

          {/* Body */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {notification.body}
          </p>

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (action.url) {
                      window.open(action.url, '_blank');
                    }
                  }}
                  className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                >
                  {action.title}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {notification.isRead && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <EyeIcon className="w-3 h-3 mr-1" />
                  Lu {notification.readAt && formatTime(notification.readAt)}
                </span>
              )}
              {notification.isClicked && (
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  ✓ Cliqué
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className="flex items-center space-x-1">
                {!notification.isRead && onRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRead(notification.id);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Marquer comme lu"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Priority Glow Effect */}
      {notification.priority === 'max' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-400/10 to-orange-400/10 animate-pulse pointer-events-none" />
      )}
    </motion.div>
  );
};
