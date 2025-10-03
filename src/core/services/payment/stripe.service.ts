/**
 * Stripe Payment Service
 * International credit/debit card payments
 * API Documentation: https://stripe.com/docs/api
 */

import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import axios from 'axios';
import { PaymentRequest, PaymentResponse } from './types';

export interface StripeConfig {
  publishableKey: string;
  mode: 'test' | 'live';
}

export class StripeService {
  private readonly config: StripeConfig;
  private stripePromise: Promise<Stripe | null>;

  constructor(config?: Partial<StripeConfig>) {
    this.config = {
      publishableKey: config?.publishableKey || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
      mode: (config?.mode || (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.includes('test') ? 'test' : 'live')) as 'test' | 'live'
    };

    this.stripePromise = loadStripe(this.config.publishableKey);
  }

  /**
   * Check if Stripe is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const stripe = await this.stripePromise;
      return stripe !== null;
    } catch (error) {
      console.error('Stripe service unavailable:', error);
      return false;
    }
  }

  /**
   * Get Stripe instance
   */
  async getStripe(): Promise<Stripe> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      throw new Error('Stripe n\'a pas pu être chargé');
    }
    return stripe;
  }

  /**
   * Create payment intent (server-side should create this)
   * This is a client-side example - in production, call your backend
   */
  async createPaymentIntent(request: PaymentRequest): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    try {
      // In production, this should call your Firebase Function/backend
      // Example: const response = await axios.post('/api/create-payment-intent', {...});

      // For now, returning mock structure
      // Replace with actual backend call
      throw new Error('createPaymentIntent doit être implémenté côté serveur (Firebase Functions)');
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm card payment
   */
  async confirmCardPayment(
    clientSecret: string,
    paymentMethodId: string,
    billingDetails?: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<PaymentResponse> {
    try {
      const stripe = await this.getStripe();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
        ...(billingDetails && {
          payment_method_data: {
            billing_details: billingDetails
          }
        })
      });

      if (result.error) {
        return {
          success: false,
          transactionId: '',
          reference: '',
          status: 'failed',
          amount: 0,
          currency: 'USD',
          fees: 0,
          netAmount: 0,
          message: this.translateStripeError(result.error.code || 'unknown'),
          timestamp: new Date()
        };
      }

      const paymentIntent = result.paymentIntent;

      return {
        success: paymentIntent.status === 'succeeded',
        transactionId: paymentIntent.id,
        reference: paymentIntent.id,
        status: this.mapStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        fees: 0, // Calculate Stripe fees if needed
        netAmount: paymentIntent.amount / 100,
        message: this.getStatusMessage(paymentIntent.status),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Stripe payment confirmation error:', error);
      return {
        success: false,
        transactionId: '',
        reference: '',
        status: 'failed',
        amount: 0,
        currency: 'USD',
        fees: 0,
        netAmount: 0,
        message: error instanceof Error ? error.message : 'Erreur lors du paiement',
        timestamp: new Date()
      };
    }
  }

  /**
   * Handle payment with card element
   */
  async handleCardPayment(
    clientSecret: string,
    cardElement: any,
    billingDetails?: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<PaymentResponse> {
    try {
      const stripe = await this.getStripe();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails || {}
        }
      });

      if (result.error) {
        return {
          success: false,
          transactionId: '',
          reference: '',
          status: 'failed',
          amount: 0,
          currency: 'USD',
          fees: 0,
          netAmount: 0,
          message: this.translateStripeError(result.error.code || 'unknown'),
          timestamp: new Date()
        };
      }

      const paymentIntent = result.paymentIntent;

      return {
        success: paymentIntent.status === 'succeeded',
        transactionId: paymentIntent.id,
        reference: paymentIntent.id,
        status: this.mapStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        fees: 0,
        netAmount: paymentIntent.amount / 100,
        message: this.getStatusMessage(paymentIntent.status),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Stripe card payment error:', error);
      return {
        success: false,
        transactionId: '',
        reference: '',
        status: 'failed',
        amount: 0,
        currency: 'USD',
        fees: 0,
        netAmount: 0,
        message: error instanceof Error ? error.message : 'Erreur lors du paiement',
        timestamp: new Date()
      };
    }
  }

  /**
   * Retrieve payment intent status
   */
  async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentResponse> {
    try {
      const stripe = await this.getStripe();
      const paymentIntent = await stripe.retrievePaymentIntent(paymentIntentId);

      if (!paymentIntent.paymentIntent) {
        throw new Error('Payment Intent introuvable');
      }

      const pi = paymentIntent.paymentIntent;

      return {
        success: pi.status === 'succeeded',
        transactionId: pi.id,
        reference: pi.id,
        status: this.mapStatus(pi.status),
        amount: pi.amount / 100,
        currency: pi.currency.toUpperCase(),
        fees: 0,
        netAmount: pi.amount / 100,
        message: this.getStatusMessage(pi.status),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to retrieve payment intent:', error);
      throw error;
    }
  }

  /**
   * Map Stripe status to our PaymentResponse status
   */
  private mapStatus(stripeStatus: string): PaymentResponse['status'] {
    const statusMap: Record<string, PaymentResponse['status']> = {
      'succeeded': 'successful',
      'processing': 'pending',
      'requires_payment_method': 'pending',
      'requires_confirmation': 'pending',
      'requires_action': 'pending',
      'canceled': 'cancelled',
      'failed': 'failed'
    };

    return statusMap[stripeStatus] || 'pending';
  }

  /**
   * Get user-friendly status message
   */
  private getStatusMessage(status: string): string {
    const messages: Record<string, string> = {
      'succeeded': 'Paiement effectué avec succès',
      'processing': 'Paiement en cours de traitement',
      'requires_payment_method': 'Méthode de paiement requise',
      'requires_confirmation': 'Confirmation requise',
      'requires_action': 'Action requise (3D Secure)',
      'canceled': 'Paiement annulé',
      'failed': 'Le paiement a échoué'
    };

    return messages[status] || 'Statut inconnu';
  }

  /**
   * Translate Stripe error codes to French
   */
  private translateStripeError(code: string): string {
    const errorMessages: Record<string, string> = {
      'card_declined': 'Carte refusée. Veuillez contacter votre banque.',
      'expired_card': 'Carte expirée.',
      'incorrect_cvc': 'Code de sécurité (CVC) incorrect.',
      'processing_error': 'Erreur de traitement. Veuillez réessayer.',
      'incorrect_number': 'Numéro de carte incorrect.',
      'invalid_expiry_month': 'Mois d\'expiration invalide.',
      'invalid_expiry_year': 'Année d\'expiration invalide.',
      'invalid_cvc': 'Code CVC invalide.',
      'insufficient_funds': 'Fonds insuffisants.',
      'generic_decline': 'Paiement refusé.',
      'authentication_required': 'Authentification 3D Secure requise.',
      'payment_intent_authentication_failure': 'Échec de l\'authentification.'
    };

    return errorMessages[code] || 'Une erreur est survenue lors du paiement.';
  }

  /**
   * Calculate Stripe fees
   */
  getTransactionFee(amount: number, currency: string = 'USD'): number {
    // Stripe international pricing (approximate)
    // Check https://stripe.com/pricing for exact rates
    const percentageFee = 0.029; // 2.9%
    const fixedFee = currency === 'EUR' ? 0.25 : 0.30; // $0.30 or €0.25

    return Math.ceil((amount * percentageFee) + fixedFee);
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return ['USD', 'EUR', 'GBP', 'CAD'];
  }
}

export const stripeService = new StripeService();
