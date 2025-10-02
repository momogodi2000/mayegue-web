import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { analytics } from '@/core/config/firebase.config';
import { config } from '@/core/config/env.config';

export interface UserProperties {
  user_role?: string;
  subscription_tier?: string;
  language_preference?: string;
  learning_level?: string;
  platform?: string;
  app_version?: string;
}

export interface LearningEvent extends Record<string, unknown> {
  lesson_id?: string;
  language_id?: string;
  difficulty_level?: string;
  score?: number;
  time_spent?: number;
  completion_rate?: number;
}

export class AnalyticsService {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = config.monitoring.performanceMonitoring && !!analytics;
  }

  /**
   * Log a custom event
   */
  logEvent(eventName: string, params?: Record<string, unknown>): void {
    if (!this.isEnabled || !analytics) return;

    try {
      const eventParams = {
        ...params,
        platform: 'web',
        app_version: config.appVersion,
        timestamp: new Date().toISOString(),
      };

      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.warn('Analytics error:', error);
    }
  }

  /**
   * Set user ID for analytics
   */
  setUserId(userId: string): void {
    if (!this.isEnabled || !analytics) return;

    try {
      setUserId(analytics, userId);
    } catch (error) {
      console.warn('Analytics setUserId error:', error);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.isEnabled || !analytics) return;

    try {
      setUserProperties(analytics, {
        platform: 'web',
        app_version: config.appVersion,
        ...properties,
      });
    } catch (error) {
      console.warn('Analytics setUserProperties error:', error);
    }
  }

  // Legacy methods for backward compatibility
  trackPageView(pageName: string, path: string): void {
    this.logPageView(pageName, pageName);
  }

  trackLogin(method: string): void {
    this.logLogin(method);
  }

  trackSignUp(method: string): void {
    this.logSignUp(method);
  }

  trackSearch(searchTerm: string, category?: string): void {
    this.logSearch(searchTerm, category || 'dictionary', 0);
  }

  trackLessonStarted(lessonId: string, lessonName: string): void {
    this.logLessonStarted({ lesson_id: lessonId });
  }

  trackLessonCompleted(lessonId: string, lessonName: string, duration: number): void {
    this.logLessonCompleted({ lesson_id: lessonId, time_spent: duration, score: 0 });
  }

  trackPaymentInitiated(amount: number, currency: string, plan: string): void {
    this.logPurchaseInitiated(plan, amount, currency);
  }

  trackPaymentCompleted(amount: number, currency: string, transactionId: string): void {
    this.logPurchaseCompleted('premium', amount, currency, 'card');
  }

  trackAIChatSent(messageLength: number): void {
    this.logAIMessageSent(messageLength, 'general');
  }

  setUser(userId: string, properties?: Record<string, unknown>): void {
    this.setUserId(userId);
    if (properties) {
      this.setUserProperties(properties as UserProperties);
    }
  }

  // Enhanced methods
  logPageView(pageName: string, pageTitle?: string): void {
    this.logEvent('page_view', {
      page_name: pageName,
      page_title: pageTitle || pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }

  logLogin(method: string): void {
    this.logEvent('login', { method });
  }

  logSignUp(method: string): void {
    this.logEvent('sign_up', { method });
  }

  logLogout(): void {
    this.logEvent('logout');
  }

  // Learning events
  logLessonStarted(params: LearningEvent): void {
    this.logEvent('lesson_started', params);
  }

  logLessonCompleted(params: LearningEvent & { score: number }): void {
    this.logEvent('lesson_completed', params);
  }

  logQuizCompleted(params: LearningEvent & { score: number; correct_answers: number; total_questions: number }): void {
    this.logEvent('quiz_completed', params);
  }

  // Dictionary events
  logDictionarySearch(query: string, languageId: string, resultsCount: number): void {
    this.logEvent('dictionary_search', {
      search_term: query,
      language_id: languageId,
      results_count: resultsCount,
    });
  }

  logWordPronunciation(wordId: string, languageId: string): void {
    this.logEvent('word_pronunciation_played', {
      word_id: wordId,
      language_id: languageId,
    });
  }

  // Gamification events
  logBadgeEarned(badgeId: string, badgeType: string): void {
    this.logEvent('badge_earned', {
      badge_id: badgeId,
      badge_type: badgeType,
    });
  }

  logLevelUp(newLevel: number, xpEarned: number): void {
    this.logEvent('level_up', {
      new_level: newLevel,
      xp_earned: xpEarned,
    });
  }

  // Payment events
  logPurchaseInitiated(planType: string, amount: number, currency: string): void {
    this.logEvent('purchase_initiated', {
      plan_type: planType,
      value: amount,
      currency,
    });
  }

  logPurchaseCompleted(planType: string, amount: number, currency: string, paymentMethod: string): void {
    this.logEvent('purchase', {
      plan_type: planType,
      value: amount,
      currency,
      payment_method: paymentMethod,
    });
  }

  // AI interaction events
  logAIConversationStarted(conversationType: string, languageId: string): void {
    this.logEvent('ai_conversation_started', {
      conversation_type: conversationType,
      language_id: languageId,
    });
  }

  logAIMessageSent(messageLength: number, languageId: string): void {
    this.logEvent('ai_message_sent', {
      message_length: messageLength,
      language_id: languageId,
    });
  }

  // Feature usage events
  logFeatureUsed(featureName: string, context?: string): void {
    this.logEvent('feature_used', {
      feature_name: featureName,
      context,
    });
  }

  logVoiceRecognitionUsed(languageId: string, accuracy?: number): void {
    this.logEvent('voice_recognition_used', {
      language_id: languageId,
      accuracy_score: accuracy,
    });
  }

  // Error tracking
  logError(errorType: string, errorMessage: string, errorContext?: string): void {
    this.logEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      error_context: errorContext,
    });
  }

  // Search methods
  logSearch(searchTerm: string, searchType: string, resultsCount: number): void {
    this.logEvent('search', {
      search_term: searchTerm,
      search_type: searchType,
      results_count: resultsCount,
    });
  }

  // Session tracking
  logSessionStarted(): void {
    this.logEvent('session_start');
  }

  logSessionEnded(duration: number): void {
    this.logEvent('session_end', {
      session_duration_minutes: Math.round(duration / 60000),
    });
  }

  // Utility methods
  startTimer(): () => number {
    const startTime = Date.now();
    return () => Date.now() - startTime;
  }

  /**
   * Track time spent on a specific activity
   */
  trackTimeSpent<T>(
    activity: string,
    asyncFn: () => Promise<T>,
    additionalParams?: Record<string, unknown>
  ): Promise<T> {
    const startTime = Date.now();
    
    return asyncFn().finally(() => {
      const duration = Date.now() - startTime;
      this.logEvent('time_spent', {
        activity,
        duration_ms: duration,
        duration_seconds: Math.round(duration / 1000),
        ...additionalParams,
      });
    });
  }
}

export const analyticsService = new AnalyticsService();

