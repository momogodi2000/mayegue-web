import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { app } from '@/core/config/firebase.config';
import { sqliteService } from '@/core/services/offline/sqlite.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import type { 
  NotificationPayload, 
  UserNotification, 
  NotificationPreferences,
  FCMToken,
  NotificationEvent
} from '../types/notification.types';
import toast from 'react-hot-toast';

export class FCMService {
  private messaging: any;
  private vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  private isInitialized = false;
  private currentToken: string | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize FCM service
   */
  private async initialize() {
    try {
      if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        console.warn('FCM not supported in this browser');
        return;
      }

      this.messaging = getMessaging(app);
      this.isInitialized = true;

      // Set up message listener
      this.setupMessageListener();

      console.log('FCM Service initialized successfully');
    } catch (error) {
      console.error('Error initializing FCM service:', error);
    }
  }

  /**
   * Request notification permission and get FCM token
   */
  async requestPermission(): Promise<string | null> {
    try {
      if (!this.isInitialized || !this.messaging) {
        throw new Error('FCM service not initialized');
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      // Get FCM token
      const token = await getToken(this.messaging, {
        vapidKey: this.vapidKey
      });

      if (token) {
        this.currentToken = token;
        await this.saveFCMToken(token);
        console.log('FCM token obtained:', token);
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error requesting FCM permission:', error);
      return null;
    }
  }

  /**
   * Save FCM token to local storage and sync with server
   */
  private async saveFCMToken(token: string) {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user) return;

      const fcmToken: FCMToken = {
        userId: user.id,
        token,
        deviceType: 'web',
        userAgent: navigator.userAgent,
        isActive: true,
        createdAt: new Date(),
        lastUsed: new Date()
      };

      // Save to localStorage for immediate use
      localStorage.setItem('fcm_token', token);
      localStorage.setItem('fcm_token_data', JSON.stringify(fcmToken));

      // TODO: Sync with Firebase/server when online
      console.log('FCM token saved locally');
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  /**
   * Set up foreground message listener
   */
  private setupMessageListener() {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload: MessagePayload) => {
      console.log('Foreground message received:', payload);
      this.handleForegroundMessage(payload);
    });
  }

  /**
   * Handle foreground messages
   */
  private async handleForegroundMessage(payload: MessagePayload) {
    try {
      const { notification, data } = payload;
      
      if (!notification) return;

      // Create user notification record
      const userNotification = await this.createUserNotification({
        title: notification.title || 'Notification',
        body: notification.body || '',
        category: (data?.category as any) || 'system',
        priority: (data?.priority as any) || 'normal',
        data: data || {}
      });

      // Show toast notification
      this.showToastNotification(userNotification);

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        this.showBrowserNotification(userNotification);
      }

      // Record notification event
      await this.recordNotificationEvent({
        type: 'delivered',
        notificationId: userNotification.id,
        userId: userNotification.userId,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error handling foreground message:', error);
    }
  }

  /**
   * Create user notification record
   */
  async createUserNotification(payload: Partial<NotificationPayload>): Promise<UserNotification> {
    const user = hybridAuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const notification: UserNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      notificationId: payload.id || `notif_${Date.now()}`,
      title: payload.title || 'Notification',
      body: payload.body || '',
      category: payload.category || 'system',
      priority: payload.priority || 'normal',
      isRead: false,
      isClicked: false,
      receivedAt: new Date(),
      data: payload.data,
      actions: payload.actions
    };

    // Save to local storage (SQLite would be better but this is simpler for now)
    const notifications = this.getStoredNotifications();
    notifications.unshift(notification);
    
    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.splice(100);
    }
    
    localStorage.setItem('user_notifications', JSON.stringify(notifications));

    return notification;
  }

  /**
   * Get stored notifications from localStorage
   */
  getStoredNotifications(): UserNotification[] {
    try {
      const stored = localStorage.getItem('user_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored notifications:', error);
      return [];
    }
  }

  /**
   * Show toast notification
   */
  private showToastNotification(notification: UserNotification) {
    const icon = this.getCategoryIcon(notification.category);
    
    // Use simple toast notification
    toast.success(`${icon} ${notification.title}: ${notification.body}`, {
      duration: 5000,
      position: 'top-right'
    });
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(notification: UserNotification) {
    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: notification.category,
        data: notification.data,
        requireInteraction: notification.priority === 'high' || notification.priority === 'max'
      });

      browserNotification.onclick = () => {
        this.handleNotificationClick(notification.id);
        browserNotification.close();
      };

      // Auto close after 10 seconds for low priority notifications
      if (notification.priority === 'low' || notification.priority === 'normal') {
        setTimeout(() => {
          browserNotification.close();
        }, 10000);
      }
    } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  }

  /**
   * Handle notification click
   */
  async handleNotificationClick(notificationId: string) {
    try {
      // Mark as clicked
      await this.markNotificationAsClicked(notificationId);

      // Record click event
      const user = hybridAuthService.getCurrentUser();
      if (user) {
        await this.recordNotificationEvent({
          type: 'clicked',
          notificationId,
          userId: user.id,
          timestamp: new Date()
        });
      }

      // Handle navigation or action based on notification data
      const notification = this.getNotificationById(notificationId);
      if (notification?.data?.url) {
        window.location.href = notification.data.url;
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string) {
    try {
      const notifications = this.getStoredNotifications();
      const notification = notifications.find(n => n.id === notificationId);
      
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();
        localStorage.setItem('user_notifications', JSON.stringify(notifications));

        // Record read event
        const user = hybridAuthService.getCurrentUser();
        if (user) {
          await this.recordNotificationEvent({
            type: 'opened',
            notificationId,
            userId: user.id,
            timestamp: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  /**
   * Mark notification as clicked
   */
  async markNotificationAsClicked(notificationId: string) {
    try {
      const notifications = this.getStoredNotifications();
      const notification = notifications.find(n => n.id === notificationId);
      
      if (notification && !notification.isClicked) {
        notification.isClicked = true;
        notification.clickedAt = new Date();
        
        // Also mark as read
        if (!notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date();
        }
        
        localStorage.setItem('user_notifications', JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Error marking notification as clicked:', error);
    }
  }

  /**
   * Get notification by ID
   */
  getNotificationById(notificationId: string): UserNotification | undefined {
    const notifications = this.getStoredNotifications();
    return notifications.find(n => n.id === notificationId);
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(): number {
    const notifications = this.getStoredNotifications();
    return notifications.filter(n => !n.isRead).length;
  }

  /**
   * Get notifications by category
   */
  getNotificationsByCategory(category: string): UserNotification[] {
    const notifications = this.getStoredNotifications();
    return notifications.filter(n => n.category === category);
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications() {
    localStorage.removeItem('user_notifications');
  }

  /**
   * Clear old notifications (older than 30 days)
   */
  clearOldNotifications() {
    const notifications = this.getStoredNotifications();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentNotifications = notifications.filter(n => 
      new Date(n.receivedAt) > thirtyDaysAgo
    );

    localStorage.setItem('user_notifications', JSON.stringify(recentNotifications));
  }

  /**
   * Record notification event for analytics
   */
  private async recordNotificationEvent(event: Omit<NotificationEvent, 'id'>) {
    try {
      const notificationEvent: NotificationEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...event
      };

      // Store events locally for now (could sync to Firebase later)
      const events = JSON.parse(localStorage.getItem('notification_events') || '[]');
      events.push(notificationEvent);
      
      // Keep only last 1000 events
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }
      
      localStorage.setItem('notification_events', JSON.stringify(events));
    } catch (error) {
      console.error('Error recording notification event:', error);
    }
  }

  /**
   * Get category icon
   */
  private getCategoryIcon(category: string): string {
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
  }

  /**
   * Get default notification preferences
   */
  getDefaultPreferences(userId: string): NotificationPreferences {
    return {
      userId,
      enabled: true,
      categories: {
        achievement: true,
        lesson: true,
        quiz: true,
        reminder: true,
        social: true,
        system: true,
        marketing: false,
        announcement: true,
        progress: true,
        goal: true
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      frequency: {
        immediate: true,
        daily: false,
        weekly: false
      },
      channels: {
        push: true,
        email: false,
        inApp: true
      }
    };
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: NotificationPreferences) {
    try {
      localStorage.setItem('notification_preferences', JSON.stringify(preferences));
      console.log('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  }

  /**
   * Get notification preferences
   */
  getPreferences(): NotificationPreferences | null {
    try {
      const stored = localStorage.getItem('notification_preferences');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
  }

  /**
   * Check if notifications are enabled for category
   */
  isEnabledForCategory(category: string): boolean {
    const preferences = this.getPreferences();
    if (!preferences || !preferences.enabled) return false;
    
    return preferences.categories[category as keyof typeof preferences.categories] ?? true;
  }

  /**
   * Send local notification (for testing)
   */
  async sendTestNotification() {
    try {
      const testNotification = await this.createUserNotification({
        title: 'Test Notification',
        body: 'This is a test notification from Ma\'a Yegue',
        category: 'system',
        priority: 'normal',
        data: { test: true }
      });

      this.showToastNotification(testNotification);
      
      if (Notification.permission === 'granted') {
        this.showBrowserNotification(testNotification);
      }

      return testNotification;
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }

  /**
   * Get current FCM token
   */
  getCurrentToken(): string | null {
    return this.currentToken || localStorage.getItem('fcm_token');
  }

  /**
   * Check if FCM is supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'Notification' in window && this.isInitialized;
  }

  /**
   * Get notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

export const fcmService = new FCMService();
