// Payment service types
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'mobile_money' | 'card' | 'bank_transfer';
  provider: 'campay' | 'noupai' | 'stripe';
  enabled: boolean;
  fees: {
    fixed: number;
    percentage: number;
    currency: string;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerId: string;
  customerEmail: string;
  customerPhone?: string;
  metadata?: Record<string, unknown>;
  subscriptionPlan?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  reference: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  fees: number;
  netAmount: number;
  paymentUrl?: string;
  qrCode?: string;
  message: string;
  timestamp: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // days
  features: string[];
  popular?: boolean;
  trialDays?: number;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded';
  provider: string;
  description: string;
  subscriptionPlan?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface WebhookPayload {
  event: string;
  data: {
    transactionId: string;
    reference: string;
    status: string;
    amount: number;
    currency: string;
    fees: number;
    customerEmail: string;
    metadata?: Record<string, unknown>;
  };
  timestamp: string;
  signature: string;
}

// Subscription management types
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  lastPaymentId?: string;
  trialUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  paymentSuccessRate: number;
  topPlans: Array<{
    planId: string;
    subscribers: number;
    revenue: number;
  }>;
}

// Mobile Money specific types
export interface MobileMoneyPayment {
  phoneNumber: string;
  operator: 'mtn' | 'orange' | 'expressu' | 'nextel';
  amount: number;
  currency: 'XAF' | 'USD';
  description: string;
  reference: string;
}

export interface MobileMoneyResponse {
  success: boolean;
  transactionId: string;
  ussdCode?: string;
  instructions: string;
  status: 'pending' | 'successful' | 'failed';
  message: string;
}