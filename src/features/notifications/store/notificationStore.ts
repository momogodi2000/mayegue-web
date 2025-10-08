import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { fcmService } from '../services/fcm.service';
import type { 
  UserNotification, 
  NotificationPreferences,
  NotificationStats
} from '../types/notification.types';
import toast from 'react-hot-toast';

interface NotificationState {
  // Notifications
  notifications: UserNotification[];
  unreadCount: number;
  
  // Preferences
  preferences: NotificationPreferences | null;
  
  // FCM
  fcmToken: string | null;
  permissionStatus: NotificationPermission;
  
  // UI State
  isNotificationCenterOpen: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadNotifications: () => void;
  loadPreferences: () => void;
  requestPermission: () => Promise<boolean>;
  updatePreferences: (preferences: NotificationPreferences) => Promise<void>;
  
  // Notification Management
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // UI Actions
  setNotificationCenterOpen: (open: boolean) => void;
  showNotification: (notification: Partial<UserNotification>) => Promise<void>;
  
  // Utility
  getNotificationsByCategory: (category: string) => UserNotification[];
  getNotificationStats: () => NotificationStats;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        notifications: [],
        unreadCount: 0,
        preferences: null,
        fcmToken: null,
        permissionStatus: 'default',
        isNotificationCenterOpen: false,
        loading: false,
        error: null,

        // Load notifications
        loadNotifications: () => {
          try {
            const notifications = fcmService.getStoredNotifications();
            const unreadCount = fcmService.getUnreadCount();
            
            set({ 
              notifications, 
              unreadCount,
              error: null 
            });
          } catch (error) {
            console.error('Error loading notifications:', error);
            set({ error: 'Erreur lors du chargement des notifications' });
          }
        },

        // Load preferences
        loadPreferences: () => {
          try {
            let preferences = fcmService.getPreferences();
            
            if (!preferences) {
              // Create default preferences
              const userId = 'current_user'; // Should come from auth service
              preferences = fcmService.getDefaultPreferences(userId);
              fcmService.updatePreferences(preferences);
            }
            
            set({ 
              preferences,
              permissionStatus: fcmService.getPermissionStatus(),
              fcmToken: fcmService.getCurrentToken(),
              error: null 
            });
          } catch (error) {
            console.error('Error loading preferences:', error);
            set({ error: 'Erreur lors du chargement des préférences' });
          }
        },

        // Request notification permission
        requestPermission: async () => {
          try {
            set({ loading: true, error: null });
            
            const token = await fcmService.requestPermission();
            const permissionStatus = fcmService.getPermissionStatus();
            
            set({ 
              fcmToken: token,
              permissionStatus,
              loading: false 
            });

            if (token) {
              // Update preferences to enable notifications
              const { preferences } = get();
              if (preferences) {
                const updatedPreferences = {
                  ...preferences,
                  enabled: true,
                  channels: {
                    ...preferences.channels,
                    push: true
                  }
                };
                await get().updatePreferences(updatedPreferences);
              }
              
              toast.success('Notifications activées avec succès !');
              return true;
            } else {
              toast.error('Permission refusée pour les notifications');
              return false;
            }
          } catch (error) {
            console.error('Error requesting permission:', error);
            set({ 
              error: 'Erreur lors de la demande de permission',
              loading: false 
            });
            toast.error('Erreur lors de l\'activation des notifications');
            return false;
          }
        },

        // Update preferences
        updatePreferences: async (preferences: NotificationPreferences) => {
          try {
            set({ loading: true, error: null });
            
            await fcmService.updatePreferences(preferences);
            
            set({ 
              preferences,
              loading: false 
            });
            
            toast.success('Préférences mises à jour');
          } catch (error) {
            console.error('Error updating preferences:', error);
            set({ 
              error: 'Erreur lors de la mise à jour des préférences',
              loading: false 
            });
            toast.error('Erreur lors de la sauvegarde');
          }
        },

        // Mark notification as read
        markAsRead: async (notificationId: string) => {
          try {
            await fcmService.markNotificationAsRead(notificationId);
            get().loadNotifications();
          } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Erreur lors du marquage');
          }
        },

        // Mark all notifications as read
        markAllAsRead: async () => {
          try {
            set({ loading: true });
            
            const { notifications } = get();
            const unreadNotifications = notifications.filter(n => !n.isRead);
            
            for (const notification of unreadNotifications) {
              await fcmService.markNotificationAsRead(notification.id);
            }
            
            get().loadNotifications();
            set({ loading: false });
            
            toast.success('Toutes les notifications marquées comme lues');
          } catch (error) {
            console.error('Error marking all as read:', error);
            set({ loading: false });
            toast.error('Erreur lors du marquage');
          }
        },

        // Delete notification
        deleteNotification: (notificationId: string) => {
          try {
            const { notifications } = get();
            const updatedNotifications = notifications.filter(n => n.id !== notificationId);
            
            localStorage.setItem('user_notifications', JSON.stringify(updatedNotifications));
            get().loadNotifications();
            
            toast.success('Notification supprimée');
          } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Erreur lors de la suppression');
          }
        },

        // Clear all notifications
        clearAllNotifications: () => {
          try {
            fcmService.clearAllNotifications();
            get().loadNotifications();
            toast.success('Toutes les notifications supprimées');
          } catch (error) {
            console.error('Error clearing notifications:', error);
            toast.error('Erreur lors de la suppression');
          }
        },

        // Set notification center open state
        setNotificationCenterOpen: (open: boolean) => {
          set({ isNotificationCenterOpen: open });
        },

        // Show notification
        showNotification: async (notificationData: Partial<UserNotification>): Promise<void> => {
          try {
            const notification = await fcmService.createUserNotification(notificationData);
            get().loadNotifications();
            
            // Show toast if preferences allow
            const { preferences } = get();
            if (preferences?.enabled && preferences.channels.inApp) {
              const icon = '🔔'; // Simple icon for now
              toast.success(`${icon} ${notification.title}: ${notification.body}`, {
                duration: 5000,
                position: 'top-right'
              });
            }
            
            // Don't return anything for void return type
          } catch (error) {
            console.error('Error showing notification:', error);
            throw error;
          }
        },

        // Get notifications by category
        getNotificationsByCategory: (category: string) => {
          const { notifications } = get();
          return notifications.filter(n => n.category === category);
        },

        // Get notification statistics
        getNotificationStats: () => {
          const { notifications } = get();
          
          const total = notifications.length;
          const read = notifications.filter(n => n.isRead).length;
          const clicked = notifications.filter(n => n.isClicked).length;
          
          return {
            sent: total,
            delivered: total,
            opened: read,
            clicked: clicked,
            dismissed: 0, // Not tracked yet
            deliveryRate: 100, // Assuming all are delivered locally
            openRate: total > 0 ? (read / total) * 100 : 0,
            clickRate: total > 0 ? (clicked / total) * 100 : 0,
            engagementScore: total > 0 ? ((read + clicked) / (total * 2)) * 100 : 0
          };
        },

        // Reset store
        reset: () => {
          set({
            notifications: [],
            unreadCount: 0,
            preferences: null,
            fcmToken: null,
            permissionStatus: 'default',
            isNotificationCenterOpen: false,
            loading: false,
            error: null
          });
        }
      }),
      {
        name: 'notification-store',
        partialize: (state) => ({
          // Only persist essential data
          preferences: state.preferences,
          fcmToken: state.fcmToken,
          permissionStatus: state.permissionStatus
        })
      }
    ),
    {
      name: 'notification-store'
    }
  )
);
