/**
 * Payment Service Types
 * Unified payment interface for multiple payment providers
 */

export type PaymentProvider = 'campay' | 'noupai' | 'stripe';
export type PaymentMethod = 'mobile_money' | 'credit_card' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type Currency = 'XAF' | 'USD' | 'EUR';

export interface PaymentConfig {
  provider: PaymentProvider;
  isAvailable: boolean;
  priority: number; // Lower number = higher priority
  supportedMethods: PaymentMethod[];
  supportedCurrencies: Currency[];
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  method: PaymentMethod;
  userId: string;
  userEmail: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  message: string;
  errorCode?: string;
  errorDetails?: any;
  paymentUrl?: string; // For redirect-based payments
  timestamp: Date;
}

export interface PaymentError {
  code: string;
  message: string;
  provider: PaymentProvider;
  retryable: boolean;
  userMessage: string; // User-friendly error message in French
  details?: any;
}

// Campay specific types
export interface CampayPaymentRequest {
  amount: string;
  currency: 'XAF';
  from: string; // Phone number
  description: string;
  external_reference: string;
}

export interface CampayPaymentResponse {
  reference: string;
  status: string;
  operator: string;
  amount: string;
  currency: string;
  description: string;
  external_reference: string;
}

// Noupai specific types
export interface NoupaiPaymentRequest {
  amount: number;
  currency: 'XAF';
  phoneNumber: string;
  description: string;
  reference: string;
  callbackUrl?: string;
}

export interface NoupaiPaymentResponse {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  paymentUrl?: string;
}

// Stripe specific types
export interface StripePaymentRequest {
  amount: number; // In cents
  currency: 'usd' | 'eur';
  paymentMethodId?: string;
  email: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface StripePaymentResponse {
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  amount: number;
  currency: string;
}

// Transaction record for Firestore
export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
  externalReference?: string;
  providerTransactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

// Subscription plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: Currency;
  duration: number; // Duration in days
  features: string[];
  limitations?: string[];
  popular?: boolean;
  trialDays?: number;
  customPricing?: boolean;
}

// Admin wallet types
export interface AdminWallet {
  userId: string;
  balance: number;
  currency: Currency;
  pendingBalance: number; // Money in processing
  totalEarnings: number;
  totalWithdrawals: number;
  lastUpdated: number;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit' | 'pending' | 'refund';
  amount: number;
  currency: Currency;
  description: string;
  relatedTransactionId?: string;
  createdAt: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  averageTransactionValue: number;
  revenueByProvider: Record<PaymentProvider, number>;
  revenueByMethod: Record<PaymentMethod, number>;
  revenueByCurrency: Record<Currency, number>;
  period: {
    start: Date;
    end: Date;
  };
}
