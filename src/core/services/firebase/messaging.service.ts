import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { messaging } from '@/core/config/firebase.config';
import { config } from '@/core/config/env.config';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  sound?: string;
  data?: Record<string, string>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface MessagingSubscription {
  token: string;
  userId?: string;
  topics?: string[];
  preferences?: {
    lessons: boolean;
    community: boolean;
    achievements: boolean;
    reminders: boolean;
  };
}

export class MessagingService {
  private isSupported: boolean = false;
  private currentToken: string | null = null;
  private vapidKey: string | undefined;

  constructor() {
    this.checkSupport();
    this.vapidKey = config.firebase.measurementId; // You'll need to set the VAPID key in env
  }

  private async checkSupport(): Promise<void> {
    try {
      this.isSupported = await isSupported();
    } catch (error) {
      console.warn('Messaging not supported:', error);
      this.isSupported = false;
    }
  }

  /**
   * Request notification permission and get FCM token
   */
  async requestPermission(): Promise<string | null> {
    if (!this.isSupported || !messaging) {
      console.warn('Firebase Messaging not supported');
      return null;
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: this.vapidKey,
      });

      if (token) {
        this.currentToken = token;
        console.log('FCM Token:', token);
        
        // Store token for future use
        localStorage.setItem('fcm_token', token);
        
        return token;
      } else {
        console.warn('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting notification permission:', error);
      return null;
    }
  }

  /**
   * Get current FCM token
   */
  async getCurrentToken(): Promise<string | null> {
    if (!this.isSupported || !messaging) return null;

    try {
      if (this.currentToken) {
        return this.currentToken;
      }

      // Try to get token from localStorage
      const storedToken = localStorage.getItem('fcm_token');
      if (storedToken) {
        this.currentToken = storedToken;
        return storedToken;
      }

      // Request new token
      return await this.requestPermission();
    } catch (error) {
      console.error('Error getting current token:', error);
      return null;
    }
  }

  /**
   * Listen for foreground messages
   */
  onMessageReceived(callback: (payload: NotificationPayload) => void): () => void {
    if (!this.isSupported || !messaging) {
      return () => {};
    }

    try {
      return onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        
        const notification: NotificationPayload = {
          title: payload.notification?.title || 'Ma’a yegue',
          body: payload.notification?.body || '',
          icon: payload.notification?.icon || '/logo.jpg',
          image: payload.notification?.image,
          data: payload.data,
        };

        callback(notification);
        
        // Show browser notification if page is not visible
        if (document.hidden) {
          this.showNotification(notification);
        }
      });
    } catch (error) {
      console.error('Error setting up message listener:', error);
      return () => {};
    }
  }

  /**
   * Show browser notification
   */
  private async showNotification(payload: NotificationPayload): Promise<void> {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/logo.jpg',
        badge: payload.badge || '/logo.jpg',
        data: payload.data,
        tag: 'Ma’a yegue-notification',
        requireInteraction: false,
        // vibrate: [200, 100, 200], // Not supported in all browsers
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Subscribe to topic
   */
  async subscribeToTopic(topic: string): Promise<boolean> {
    const token = await this.getCurrentToken();
    if (!token) return false;

    try {
      // This would typically be done via your backend
      const response = await fetch(`${config.api.baseUrl}/subscribeToTopic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          topic,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from topic
   */
  async unsubscribeFromTopic(topic: string): Promise<boolean> {
    const token = await this.getCurrentToken();
    if (!token) return false;

    try {
      const response = await fetch(`${config.api.baseUrl}/unsubscribeFromTopic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          topic,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return false;
    }
  }

  /**
   * Send notification preferences to backend
   */
  async updateNotificationPreferences(
    userId: string,
    preferences: {
      lessons: boolean;
      community: boolean;
      achievements: boolean;
      reminders: boolean;
    }
  ): Promise<boolean> {
    const token = await this.getCurrentToken();
    if (!token) return false;

    try {
      const response = await fetch(`${config.api.baseUrl}/updateNotificationPreferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          token,
          preferences,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }

  /**
   * Subscribe to lesson reminders
   */
  async subscribeToLessonReminders(userId: string): Promise<boolean> {
    const topics = [
      `lesson_reminders_${userId}`,
      'daily_reminders',
      'streak_reminders',
    ];

    const results = await Promise.all(
      topics.map(topic => this.subscribeToTopic(topic))
    );

    return results.every(result => result);
  }

  /**
   * Subscribe to community notifications
   */
  async subscribeToCommunityNotifications(userId: string, languageIds: string[]): Promise<boolean> {
    const topics = [
      `community_${userId}`,
      ...languageIds.map(langId => `community_${langId}`),
      'community_general',
    ];

    const results = await Promise.all(
      topics.map(topic => this.subscribeToTopic(topic))
    );

    return results.every(result => result);
  }

  /**
   * Subscribe to achievement notifications
   */
  async subscribeToAchievementNotifications(userId: string): Promise<boolean> {
    const topics = [
      `achievements_${userId}`,
      'badges_earned',
      'level_up',
      'streak_achievements',
    ];

    const results = await Promise.all(
      topics.map(topic => this.subscribeToTopic(topic))
    );

    return results.every(result => result);
  }

  /**
   * Clear stored token (on logout)
   */
  clearToken(): void {
    this.currentToken = null;
    localStorage.removeItem('fcm_token');
  }

  /**
   * Check if notifications are supported and enabled
   */
  async isNotificationEnabled(): Promise<boolean> {
    if (!this.isSupported) return false;
    
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to check notification permission:', error);
      return false;
    }
  }

  /**
   * Get notification permission status
   */
  getPermissionStatus(): string {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Test notification (for debugging)
   */
  async testNotification(): Promise<void> {
    const testPayload: NotificationPayload = {
      title: 'Test Notification',
      body: 'This is a test notification from Ma’a yegue!',
      icon: '/logo.jpg',
      data: {
        type: 'test',
        timestamp: new Date().toISOString(),
      },
    };

    await this.showNotification(testPayload);
  }
}

// Export singleton instance
export const messagingService = new MessagingService();