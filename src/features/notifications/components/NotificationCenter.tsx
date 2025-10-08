import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { Button, Badge } from '@/shared/components/ui';
import { fcmService } from '../services/fcm.service';
import type { UserNotification } from '../types/notification.types';
import { NotificationItem } from './NotificationItem';
import { NotificationSettings } from './NotificationSettings';
import toast from 'react-hot-toast';

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    
    // Set up periodic refresh
    const interval = setInterval(loadNotifications, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    try {
      const allNotifications = fcmService.getStoredNotifications();
      setNotifications(allNotifications);
      setUnreadCount(fcmService.getUnreadCount());
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await fcmService.markNotificationAsRead(notificationId);
      await fcmService.handleNotificationClick(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fcmService.markNotificationAsRead(notificationId);
      loadNotifications();
      toast.success('Notification marquée comme lue');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Erreur lors du marquage');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      for (const notification of unreadNotifications) {
        await fcmService.markNotificationAsRead(notification.id);
      }
      
      loadNotifications();
      toast.success('Toutes les notifications marquées comme lues');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Erreur lors du marquage');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    try {
      fcmService.clearAllNotifications();
      loadNotifications();
      toast.success('Toutes les notifications supprimées');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleRequestPermission = async () => {
    try {
      setLoading(true);
      const token = await fcmService.requestPermission();
      
      if (token) {
        toast.success('Notifications activées avec succès !');
        
        // Send test notification
        setTimeout(() => {
          fcmService.sendTestNotification();
        }, 1000);
      } else {
        toast.error('Permission refusée pour les notifications');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast.error('Erreur lors de l\'activation des notifications');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

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

  if (showSettings) {
    return (
      <NotificationSettings
        onClose={() => setShowSettings(false)}
        onSave={() => {
          setShowSettings(false);
          toast.success('Préférences sauvegardées');
        }}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="w-6 h-6" />
        ) : (
          <BellIcon className="w-6 h-6" />
        )}
        
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      filter === 'all'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Toutes ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      filter === 'unread'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Non lues ({unreadCount})
                  </button>
                </div>

                {/* Action Buttons */}
                {notifications.length > 0 && (
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      {unreadCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          disabled={loading}
                          className="text-xs"
                        >
                          <CheckIcon className="w-3 h-3 mr-1" />
                          Tout marquer lu
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-3 h-3 mr-1" />
                        Tout supprimer
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    {fcmService.getPermissionStatus() !== 'granted' ? (
                      <div>
                        <BellIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Activez les notifications
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Recevez des notifications pour vos progrès, nouveaux contenus et rappels.
                        </p>
                        <Button
                          onClick={handleRequestPermission}
                          disabled={loading}
                          className="mx-auto"
                        >
                          <BellIcon className="w-4 h-4 mr-2" />
                          Activer les notifications
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <BellIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {filter === 'unread' 
                            ? 'Toutes vos notifications ont été lues.'
                            : 'Vous recevrez ici vos notifications.'
                          }
                        </p>
                        {filter === 'all' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fcmService.sendTestNotification()}
                            className="mt-4"
                          >
                            Envoyer une notification test
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Category Icon */}
                          <div className="flex-shrink-0 text-lg">
                            {getCategoryIcon(notification.category)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                  !notification.isRead 
                                    ? 'text-gray-900 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.body}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                  {formatTime(notification.receivedAt)}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.isRead && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkAsRead(notification.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    title="Marquer comme lu"
                                  >
                                    <EyeIcon className="w-4 h-4" />
                                  </button>
                                )}
                                
                                {/* Priority Indicator */}
                                {notification.priority === 'high' && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                )}
                                {notification.priority === 'max' && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 10 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    Voir toutes les notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
