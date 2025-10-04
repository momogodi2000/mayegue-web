import { campayService } from './campay.service';
import { noupaiService } from './noupai.service';
import { stripeService } from './stripe.service';
import { receiptService } from './receipt.service';
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
import { User } from '@/shared/types/user.types';

type PaymentProvider = 'campay' | 'noupai' | 'stripe';

export class PaymentService {
  private readonly subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'freemium',
      name: 'Freemium',
      description: 'Parfait pour débuter',
      price: 0,
      currency: 'XAF',
      duration: 0, // Permanent
      features: [
        '5 leçons par mois',
        'Dictionnaire de base (1,000 mots)',
        'Assistant IA limité (10 requêtes/jour)',
        'Mode hors ligne basique',
        'Support communautaire',
        'Certificat de participation'
      ],
      limitations: [
        'Pas d\'accès à l\'Atlas Linguistique',
        'Pas d\'Encyclopédie Culturelle',
        'Pas d\'expériences AR/VR',
        'Pas de Marketplace'
      ]
    },
    {
      id: 'premium_monthly',
      name: 'Premium',
      description: 'Le plus populaire',
      price: 2500,
      currency: 'XAF',
      duration: 30,
      features: [
        'Leçons illimitées',
        'Dictionnaire complet (15,000+ mots)',
        'Assistant IA Gemini illimité',
        'Atlas Linguistique Interactif',
        'Encyclopédie Culturelle',
        'Sites Historiques avec visites virtuelles',
        'Mode hors ligne complet',
        'Certificats officiels',
        'Gamification de base',
        'Support prioritaire'
      ],
      popular: true,
      trialDays: 7
    },
    {
      id: 'premium_yearly',
      name: 'Premium Annuel',
      description: 'Meilleure valeur - Économisez 20%',
      price: 25000,
      currency: 'XAF',
      duration: 365,
      features: [
        'Tout Premium +',
        '2 mois gratuits',
        'Support client prioritaire',
        'Accès anticipé aux nouvelles fonctionnalités',
        'Événements communautaires exclusifs',
        'Ngondo Coins bonus'
      ],
      trialDays: 7
    },
    {
      id: 'family_monthly',
      name: 'Famille',
      description: 'Pour toute la famille',
      price: 5000,
      currency: 'XAF',
      duration: 30,
      features: [
        'Tout Premium +',
        'Jusqu\'à 6 comptes familiaux',
        'Mode Famille Intergénérationnel',
        'Arbre Linguistique Familial',
        'Mode "Apprendre avec Grand-mère"',
        'Partage de progression',
        'Contrôle parental',
        'Statistiques familiales',
        'Ngondo Coins partagés'
      ]
    },
    {
      id: 'family_yearly',
      name: 'Famille Annuel',
      description: 'Famille - Économisez 20%',
      price: 50000,
      currency: 'XAF',
      duration: 365,
      features: [
        'Tout Famille +',
        '2 mois gratuits',
        'Support dédié famille',
        'Formation parentale incluse',
        'Événements familiaux exclusifs'
      ]
    },
    {
      id: 'teacher_monthly',
      name: 'Enseignant',
      description: 'Pour les éducateurs',
      price: 8000,
      currency: 'XAF',
      duration: 30,
      features: [
        'Tout Premium +',
        'Gestion de classes (jusqu\'à 100 élèves)',
        'Création de contenu personnalisé',
        'Analytics avancés des élèves',
        'Outils d\'évaluation',
        'Certificats personnalisés',
        'Support dédié',
        'Formation et webinaires',
        'Accès aux ressources pédagogiques'
      ]
    },
    {
      id: 'teacher_yearly',
      name: 'Enseignant Annuel',
      description: 'Enseignant - Économisez 20%',
      price: 80000,
      currency: 'XAF',
      duration: 365,
      features: [
        'Tout Enseignant +',
        '2 mois gratuits',
        'Support pédagogique dédié',
        'Formation continue incluse',
        'Ressources pédagogiques exclusives'
      ]
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      description: 'Pour les organisations',
      price: 0, // Custom pricing
      currency: 'XAF',
      duration: 365,
      features: [
        'Tout Teacher +',
        'Gestion multi-utilisateurs illimitée',
        'API et intégrations',
        'Support 24/7',
        'Formation personnalisée',
        'Branding personnalisé',
        'Analytics avancés',
        'Sécurité renforcée',
        'Conformité RGPD'
      ],
      customPricing: true
    }
  ];

  /**
   * Initialize payment with automatic fallback mechanism
   * Priority: Campay (Mobile Money) → Noupai (Mobile Money Fallback) → Stripe (International)
   */
  async initializePayment(
    userId: string,
    planId: string,
    paymentMethod: 'mobile_money' | 'credit_card' = 'mobile_money',
    phoneNumber?: string
  ): Promise<PaymentResponse> {
    try {
      const plan = this.getSubscriptionPlan(planId);
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }

      // Check if user already has an active subscription (except for freemium)
      if (planId !== 'freemium') {
        const existingSubscription = await this.getUserActiveSubscription(userId);
        if (existingSubscription && existingSubscription.status === 'active') {
          throw new Error('User already has an active subscription');
        }
      }

      // Create payment request
      const paymentRequest: PaymentRequest = {
        amount: plan.price,
        currency: plan.currency,
        description: `Abonnement ${plan.name}`,
        customerId: userId,
        customerEmail: `${userId}@maayegue.app`, // This should come from user data
        customerPhone: phoneNumber,
        metadata: {
          type: 'subscription',
          planId: plan.id,
          userId,
          duration: plan.duration
        },
        subscriptionPlan: plan.id
      };

      let paymentResponse: PaymentResponse;
      let provider: PaymentProvider;

      // Handle freemium plan (no payment required)
      if (planId === 'freemium') {
        paymentResponse = {
          success: true,
          transactionId: `freemium_${userId}_${Date.now()}`,
          reference: `FREEMIUM_${Date.now()}`,
          status: 'successful',
          amount: 0,
          currency: plan.currency,
          fees: 0,
          netAmount: 0,
          message: 'Plan Freemium activé avec succès',
          timestamp: new Date()
        };
        provider = 'campay'; // Use campay as default provider for tracking
      } else {
        // Process based on payment method
        if (paymentMethod === 'mobile_money') {
          // Try Mobile Money with automatic fallback
          paymentResponse = await this.processMobileMoneyPayment(paymentRequest);
          provider = (paymentResponse as any).provider || 'campay';
        } else {
          // Use Stripe for credit card
          paymentResponse = await this.processCreditCardPayment(paymentRequest);
          provider = 'stripe';
        }
      }

      // Store payment history
      await this.storePaymentHistory({
        id: paymentResponse.transactionId,
        userId,
        transactionId: paymentResponse.transactionId,
        amount: paymentResponse.amount,
        currency: paymentResponse.currency,
        status: paymentResponse.status,
        provider,
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
        provider,
        userId
      });

      // Generate receipt for completed payments
      if (paymentResponse.success && paymentResponse.status === 'successful') {
        try {
          const user = await firestoreService.getDocument<User>('users', userId);
          if (user) {
            await receiptService.generateReceipt({
              id: paymentResponse.transactionId,
              userId,
              userEmail: user.email,
              amount: paymentResponse.amount,
              currency: paymentResponse.currency as any,
              provider: provider as any,
              method: paymentMethod as any,
              status: paymentResponse.status as any,
              description: paymentRequest.description,
              externalReference: paymentResponse.reference,
              providerTransactionId: paymentResponse.transactionId,
              metadata: paymentRequest.metadata,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              completedAt: Date.now()
            }, user);
          }
        } catch (error) {
          console.error('Failed to generate receipt:', error);
          // Don't throw error - payment was successful
        }
      }

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

  /**
   * Process Mobile Money payment with automatic fallback
   * Try Campay first, fallback to Noupai if Campay fails
   */
  private async processMobileMoneyPayment(request: PaymentRequest): Promise<PaymentResponse> {
    let lastError: Error | null = null;

    // 1. Try Campay (Primary)
    try {
      const isAvailable = await campayService.isAvailable();
      if (isAvailable) {
        console.log('Using Campay as primary provider...');
        const response = await campayService.initiatePayment(request);
        if (response.success || response.status === 'pending') {
          return { ...response, provider: 'campay' } as any;
        }
        lastError = new Error(response.message);
      }
    } catch (error) {
      console.error('Campay payment failed:', error);
      lastError = error as Error;
    }

    // 2. Fallback to Noupai
    try {
      const isAvailable = await noupaiService.isAvailable();
      if (isAvailable) {
        console.log('Falling back to Noupai...');
        const response = await noupaiService.initiatePayment(request);
        if (response.success || response.status === 'pending') {
          // Track fallback
          await analyticsService.trackPaymentEvent('payment_fallback', {
            from: 'campay',
            to: 'noupai',
            userId: request.customerId
          });
          return { ...response, provider: 'noupai' } as any;
        }
        lastError = new Error(response.message);
      }
    } catch (error) {
      console.error('Noupai payment failed:', error);
      lastError = error as Error;
    }

    // If all providers failed
    throw lastError || new Error('Tous les services de paiement Mobile Money sont indisponibles');
  }

  /**
   * Process credit card payment via Stripe
   */
  private async processCreditCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const isAvailable = await stripeService.isAvailable();
      if (!isAvailable) {
        throw new Error('Stripe service indisponible');
      }

      console.log('Using Stripe for credit card payment...');

      // Note: Actual Stripe payment requires client-side card element
      // This should be implemented in the frontend component
      // Here we just return the structure for Payment Intent creation

      return {
        success: false,
        transactionId: '',
        reference: '',
        status: 'pending',
        amount: request.amount,
        currency: request.currency,
        fees: 0,
        netAmount: request.amount,
        message: 'Paiement par carte en attente de confirmation',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Stripe payment failed:', error);
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
        'freemium': ['basic_lessons', 'basic_dictionary', 'basic_offline', 'community_support'],
        'premium_monthly': ['unlimited_lessons', 'full_dictionary', 'gemini_ai', 'atlas_linguistique', 'encyclopedia_culturelle', 'sites_historiques', 'full_offline', 'certificates', 'basic_gamification', 'priority_support'],
        'premium_yearly': ['unlimited_lessons', 'full_dictionary', 'gemini_ai', 'atlas_linguistique', 'encyclopedia_culturelle', 'sites_historiques', 'full_offline', 'certificates', 'basic_gamification', 'priority_support', 'early_access', 'exclusive_events', 'ngondo_coins'],
        'family_monthly': ['unlimited_lessons', 'full_dictionary', 'gemini_ai', 'atlas_linguistique', 'encyclopedia_culturelle', 'sites_historiques', 'full_offline', 'certificates', 'basic_gamification', 'priority_support', 'family_mode', 'family_tree', 'grandmother_mode', 'progress_sharing', 'parental_controls', 'family_stats', 'shared_coins'],
        'family_yearly': ['unlimited_lessons', 'full_dictionary', 'gemini_ai', 'atlas_linguistique', 'encyclopedia_culturelle', 'sites_historiques', 'full_offline', 'certificates', 'basic_gamification', 'priority_support', 'family_mode', 'family_tree', 'grandmother_mode', 'progress_sharing', 'parental_controls', 'family_stats', 'shared_coins', 'family_support', 'parent_training', 'family_events'],
        'teacher_monthly': ['unlimited_lessons', 'full_dictionary', 'gemini_ai', 'atlas_linguistique', 'encyclopedia_culturelle', 'sites_historiques', 'full_offline', 'certificates', 'basic_gamification', 'priority_support', 'class_management', 'content_creation', 'student_analytics', 'assessment_tools', 'custom_certificates', 'dedicated_support', 'training_webinars', 'educational_resources'],
        'teacher_yearly': ['unlimited_lessons', 'full_dictionary', 'gemini_ai', 'atlas_linguistique', 'encyclopedia_culturelle', 'sites_historiques', 'full_offline', 'certificates', 'basic_gamification', 'priority_support', 'class_management', 'content_creation', 'student_analytics', 'assessment_tools', 'custom_certificates', 'dedicated_support', 'training_webinars', 'educational_resources', 'continuous_training', 'exclusive_resources'],
        'enterprise': ['unlimited_lessons', 'full_dictionary', 'gemini_ai', 'atlas_linguistique', 'encyclopedia_culturelle', 'sites_historiques', 'full_offline', 'certificates', 'basic_gamification', 'priority_support', 'class_management', 'content_creation', 'student_analytics', 'assessment_tools', 'custom_certificates', 'dedicated_support', 'training_webinars', 'educational_resources', 'unlimited_users', 'api_integrations', '24_7_support', 'custom_training', 'custom_branding', 'advanced_analytics', 'enhanced_security', 'gdpr_compliance']
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