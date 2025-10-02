import { camPayService } from './campay.service';
import { firestoreService } from '../firebase/firestore.service';
import { analyticsService } from '../firebase/analytics.service';
import { 
  PaymentRequest, 
  PaymentResponse, 
  PaymentHistory, 
  SubscriptionPlan, 
  UserSubscription,
  PaymentStats,
  WebhookPayload 
} from './types';

export class PaymentService {
  private readonly subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic_monthly',
      name: 'Basic Monthly',
      description: 'Access to basic lessons and dictionary',
      price: 2500,
      currency: 'XAF',
      duration: 30,
      features: [
        'Access to all lessons',
        'Basic dictionary',
        'Progress tracking',
        'Mobile access'
      ]
    },
    {
      id: 'premium_monthly',
      name: 'Premium Monthly',
      description: 'Full access with AI features and offline content',
      price: 5000,
      currency: 'XAF',
      duration: 30,
      features: [
        'All Basic features',
        'AI pronunciation feedback',
        'Offline content download',
        'Advanced progress analytics',
        'Community features',
        'Priority support'
      ],
      popular: true
    },
    {
      id: 'premium_yearly',
      name: 'Premium Yearly',
      description: 'Best value - Premium features for a full year',
      price: 50000,
      currency: 'XAF',
      duration: 365,
      features: [
        'All Premium features',
        '2 months free',
        'Priority customer support',
        'Early access to new features',
        'Exclusive community events'
      ],
      trialDays: 7
    }
  ];

  async initializePayment(
    userId: string, 
    planId: string, 
    paymentMethod: 'campay' | 'noupai' = 'campay'
  ): Promise<PaymentResponse> {
    try {
      const plan = this.getSubscriptionPlan(planId);
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }

      // Check if user already has an active subscription
      const existingSubscription = await this.getUserActiveSubscription(userId);
      if (existingSubscription && existingSubscription.status === 'active') {
        throw new Error('User already has an active subscription');
      }

      // Create payment request
      const paymentRequest: PaymentRequest = {
        amount: plan.price,
        currency: plan.currency,
        description: `Subscription to ${plan.name}`,
        customerId: userId,
        customerEmail: `${userId}@mayegue.app`, // This should come from user data
        metadata: {
          type: 'subscription',
          planId: plan.id,
          userId,
          duration: plan.duration
        },
        subscriptionPlan: plan.id
      };

      // Process payment based on method
      let paymentResponse: PaymentResponse;
      
      if (paymentMethod === 'campay') {
        paymentResponse = await camPayService.initiatePayment(paymentRequest);
      } else {
        // TODO: Implement NouPai service
        throw new Error('NouPai payment method not yet implemented');
      }

      // Store payment history
      await this.storePaymentHistory({
        id: paymentResponse.transactionId,
        userId,
        transactionId: paymentResponse.transactionId,
        amount: paymentResponse.amount,
        currency: paymentResponse.currency,
        status: paymentResponse.status,
        provider: paymentMethod,
        description: paymentRequest.description,
        subscriptionPlan: planId,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: paymentRequest.metadata
      });

      // Track payment analytics
      await analyticsService.trackPaymentEvent('payment_initiated', {
        planId,
        amount: plan.price,
        currency: plan.currency,
        provider: paymentMethod,
        userId
      });

      return paymentResponse;
    } catch (error) {
      console.error('Payment initialization failed:', error);
      
      await analyticsService.trackPaymentEvent('payment_failed', {
        planId,
        error: error instanceof Error ? error.message : 'Unknown error',
        userId
      });
      
      throw error;
    }
  }

  async processPaymentWebhook(payload: WebhookPayload): Promise<void> {
    try {
      // Verify webhook signature (implementation depends on provider)
      // For now, we'll process it directly
      
      const { transactionId, status, metadata } = payload.data;
      
      // Update payment history
      await this.updatePaymentStatus(transactionId, status as PaymentHistory['status']);
      
      if (status === 'successful' && metadata?.type === 'subscription') {
        await this.activateSubscription(
          metadata.userId as string,
          metadata.planId as string,
          transactionId
        );
      }

      // Track webhook processing
      await analyticsService.trackPaymentEvent('webhook_processed', {
        transactionId,
        status,
        event: payload.event
      });

    } catch (error) {
      console.error('Webhook processing failed:', error);
      throw error;
    }
  }

  private async activateSubscription(userId: string, planId: string, paymentId: string): Promise<void> {
    const plan = this.getSubscriptionPlan(planId);
    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    const subscription: UserSubscription = {
      id: `sub_${userId}_${planId}_${Date.now()}`,
      userId,
      planId,
      status: 'active',
      startDate,
      endDate,
      autoRenew: true,
      lastPaymentId: paymentId,
      trialUsed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store subscription in Firestore
    await firestoreService.addDocument('subscriptions', subscription);

    // Track subscription activation
    await analyticsService.trackPaymentEvent('subscription_activated', {
      userId,
      planId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
  }

  async getUserActiveSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const subscriptions = await firestoreService.queryDocuments('subscriptions', {
        filters: [
          { field: 'userId', operator: '==', value: userId },
          { field: 'status', operator: '==', value: 'active' }
        ]
      });

      if (subscriptions.length === 0) return null;

      // Return the most recent active subscription
      const sortedSubscriptions = subscriptions.sort((a, b) => {
        const aDate = a.createdAt instanceof Date ? a.createdAt : 
                     a.createdAt ? new Date(a.createdAt) : new Date(0);
        const bDate = b.createdAt instanceof Date ? b.createdAt : 
                     b.createdAt ? new Date(b.createdAt) : new Date(0);
        return bDate.getTime() - aDate.getTime();
      });

      return sortedSubscriptions[0] as UserSubscription;
    } catch (error) {
      console.error('Failed to get user subscription:', error);
      return null;
    }
  }

  async getUserPaymentHistory(userId: string, limit = 20): Promise<PaymentHistory[]> {
    try {
      const payments = await firestoreService.queryDocuments('payment_history', {
        filters: [{ field: 'userId', operator: '==', value: userId }],
        orderByField: 'createdAt',
        orderDirection: 'desc',
        limitCount: limit
      });

      return payments as PaymentHistory[];
    } catch (error) {
      console.error('Failed to get payment history:', error);
      return [];
    }
  }

  async cancelSubscription(userId: string, reason?: string): Promise<void> {
    try {
      const subscription = await this.getUserActiveSubscription(userId);
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Update subscription status
      await firestoreService.updateDocument('subscriptions', subscription.id, {
        status: 'cancelled',
        autoRenew: false,
        updatedAt: new Date(),
        cancellationReason: reason
      });

      // Track cancellation
      await analyticsService.trackPaymentEvent('subscription_cancelled', {
        userId,
        planId: subscription.planId,
        reason: reason || 'user_requested'
      });

    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  async renewSubscription(userId: string): Promise<PaymentResponse> {
    try {
      const subscription = await this.getUserActiveSubscription(userId);
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      const plan = this.getSubscriptionPlan(subscription.planId);
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }

      // Check if subscription is near expiry (within 7 days)
      const daysUntilExpiry = Math.ceil(
        (subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry > 7) {
        throw new Error('Subscription not yet due for renewal');
      }

      // Create renewal payment
      return this.initializePayment(userId, subscription.planId);

    } catch (error) {
      console.error('Failed to renew subscription:', error);
      throw error;
    }
  }

  getSubscriptionPlans(): SubscriptionPlan[] {
    return [...this.subscriptionPlans];
  }

  getSubscriptionPlan(planId: string): SubscriptionPlan | null {
    return this.subscriptionPlans.find(plan => plan.id === planId) || null;
  }

  async getPaymentStats(): Promise<PaymentStats> {
    try {
      // This would typically be calculated from a data warehouse
      // For now, we'll calculate from Firestore (not recommended for production)
      
      const allPayments = await firestoreService.getCollection<PaymentHistory>('payment_history');
      const allSubscriptions = await firestoreService.getCollection<UserSubscription>('subscriptions');

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const totalRevenue = allPayments
        .filter(p => p.status === 'successful')
        .reduce((sum, p) => sum + p.amount, 0);

      const monthlyRevenue = allPayments
        .filter(p => {
          const paymentDate = new Date(p.createdAt);
          return p.status === 'successful' && 
                 paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + p.amount, 0);

      const activeSubscriptions = allSubscriptions
        .filter(s => s.status === 'active').length;

      const successfulPayments = allPayments.filter(p => p.status === 'successful').length;
      const totalPayments = allPayments.length;
      const paymentSuccessRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;

      // Calculate ARPU (Average Revenue Per User)
      const uniqueUsers = new Set(allPayments.map(p => p.userId)).size;
      const averageRevenuePerUser = uniqueUsers > 0 ? totalRevenue / uniqueUsers : 0;

      // Calculate churn rate (simplified)
      const cancelledSubscriptions = allSubscriptions.filter(s => s.status === 'cancelled').length;
      const churnRate = allSubscriptions.length > 0 ? (cancelledSubscriptions / allSubscriptions.length) * 100 : 0;

      // Top plans by subscribers
      const planCounts = allSubscriptions.reduce((acc, sub) => {
        acc[sub.planId] = (acc[sub.planId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topPlans = Object.entries(planCounts)
        .map(([planId, subscribers]) => {
          const revenue = allPayments
            .filter(p => p.subscriptionPlan === planId && p.status === 'successful')
            .reduce((sum, p) => sum + p.amount, 0);
          
          return { planId, subscribers, revenue };
        })
        .sort((a, b) => b.subscribers - a.subscribers)
        .slice(0, 5);

      return {
        totalRevenue,
        monthlyRevenue,
        activeSubscriptions,
        churnRate,
        averageRevenuePerUser,
        paymentSuccessRate,
        topPlans
      };

    } catch (error) {
      console.error('Failed to get payment stats:', error);
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        activeSubscriptions: 0,
        churnRate: 0,
        averageRevenuePerUser: 0,
        paymentSuccessRate: 0,
        topPlans: []
      };
    }
  }

  private async storePaymentHistory(payment: PaymentHistory): Promise<void> {
    try {
      await firestoreService.addDocument('payment_history', payment);
    } catch (error) {
      console.error('Failed to store payment history:', error);
      throw error;
    }
  }

  private async updatePaymentStatus(transactionId: string, status: PaymentHistory['status']): Promise<void> {
    try {
      const payments = await firestoreService.queryDocuments('payment_history', {
        filters: [{ field: 'transactionId', operator: '==', value: transactionId }]
      });

      if (payments.length > 0) {
        await firestoreService.updateDocument('payment_history', payments[0].id, {
          status,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
      throw error;
    }
  }

  // Helper method to check if user has access to features
  async userHasAccess(userId: string, feature: string): Promise<boolean> {
    try {
      const subscription = await this.getUserActiveSubscription(userId);
      if (!subscription) return false;

      const plan = this.getSubscriptionPlan(subscription.planId);
      if (!plan) return false;

      // Check if subscription is still valid
      if (subscription.endDate.getTime() < Date.now()) {
        return false;
      }

      // Check if plan includes the requested feature
      const featureMap: Record<string, string[]> = {
        'basic_monthly': ['lessons', 'dictionary', 'progress'],
        'premium_monthly': ['lessons', 'dictionary', 'progress', 'ai_features', 'offline', 'community'],
        'premium_yearly': ['lessons', 'dictionary', 'progress', 'ai_features', 'offline', 'community', 'priority_support']
      };

      const planFeatures = featureMap[plan.id] || [];
      return planFeatures.includes(feature);

    } catch (error) {
      console.error('Failed to check user access:', error);
      return false;
    }
  }
}

export const paymentService = new PaymentService();