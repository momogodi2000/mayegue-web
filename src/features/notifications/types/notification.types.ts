export interface NotificationPayload {
  id: string;
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'max';
  category: NotificationCategory;
  targetUsers?: string[]; // Firebase UIDs
  targetRoles?: ('guest' | 'learner' | 'teacher' | 'admin')[];
  scheduledFor?: Date;
  expiresAt?: Date;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
  url?: string;
}

export type NotificationCategory = 
  | 'achievement'
  | 'lesson'
  | 'quiz'
  | 'reminder'
  | 'social'
  | 'system'
  | 'marketing'
  | 'announcement'
  | 'progress'
  | 'goal';

export interface UserNotification {
  id: string;
  userId: string;
  notificationId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: 'low' | 'normal' | 'high' | 'max';
  isRead: boolean;
  isClicked: boolean;
  receivedAt: Date;
  readAt?: Date;
  clickedAt?: Date;
  data?: Record<string, any>;
  actions?: NotificationAction[];
}

export interface NotificationPreferences {
  userId: string;
  enabled: boolean;
  categories: {
    achievement: boolean;
    lesson: boolean;
    quiz: boolean;
    reminder: boolean;
    social: boolean;
    system: boolean;
    marketing: boolean;
    announcement: boolean;
    progress: boolean;
    goal: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
    timezone: string;
  };
  frequency: {
    immediate: boolean;
    daily: boolean;
    weekly: boolean;
  };
  channels: {
    push: boolean;
    email: boolean;
    inApp: boolean;
  };
}

export interface NotificationTemplate {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  icon?: string;
  actions?: NotificationAction[];
  variables?: string[]; // Template variables like {userName}, {lessonTitle}
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  dismissed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  engagementScore: number;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  category: NotificationCategory;
  template: NotificationTemplate;
  targetAudience: {
    roles?: ('guest' | 'learner' | 'teacher' | 'admin')[];
    userIds?: string[];
    filters?: {
      level?: { min?: number; max?: number };
      xp?: { min?: number; max?: number };
      lastActive?: { days: number };
      subscription?: ('free' | 'premium' | 'family' | 'teacher' | 'enterprise')[];
    };
  };
  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';
    scheduledFor?: Date;
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      daysOfWeek?: number[]; // 0-6, Sunday = 0
      time: string; // HH:mm
    };
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'completed';
  stats: NotificationStats;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
}

export interface FCMToken {
  userId: string;
  token: string;
  deviceType: 'web' | 'android' | 'ios';
  userAgent?: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed: Date;
}

export interface NotificationEvent {
  id: string;
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'dismissed' | 'error';
  notificationId: string;
  userId: string;
  timestamp: Date;
  data?: Record<string, any>;
  error?: string;
}
