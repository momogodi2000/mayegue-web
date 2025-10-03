import axios, { AxiosError } from 'axios';
import { PaymentRequest, PaymentResponse } from './types';

export interface NoupaiConfig {
  apiKey: string;
  merchantId: string;
  baseUrl: string;
  mode: 'test' | 'live';
}

export class NouPaiService {
  private readonly config: NoupaiConfig;

  constructor(config?: Partial<NoupaiConfig>) {
    this.config = {
      apiKey: config?.apiKey || import.meta.env.VITE_NOUPAI_API_KEY || '',
      merchantId: config?.merchantId || import.meta.env.VITE_NOUPAI_MERCHANT_ID || '',
      baseUrl: config?.baseUrl || (import.meta.env.VITE_NOUPAI_MODE === 'live'
        ? 'https://api.noupai.cm/v1'
        : 'https://sandbox.noupai.cm/v1'),
      mode: (config?.mode || import.meta.env.VITE_NOUPAI_MODE || 'test') as 'test' | 'live'
    };
  }

  /**
   * Check if Noupai service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/health`, {
        headers: {
          'X-API-Key': this.config.apiKey,
        },
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.error('Noupai service unavailable:', error);
      return false;
    }
  }

  /**
   * Validate phone number for Cameroon operators
   */
  private validatePhoneNumber(phone: string): { valid: boolean; operator?: string } {
    const cleaned = phone.replace(/\D/g, '');

    // MTN Mobile Money
    if (/^237(67|650|651|652|653|654|680|681|682|683)/.test(cleaned)) {
      return { valid: true, operator: 'MTN' };
    }

    // Orange Money
    if (/^237(69|655|656|657|658|659)/.test(cleaned)) {
      return { valid: true, operator: 'ORANGE' };
    }

    return { valid: false };
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate phone number
      if (!request.customerPhone) {
        return {
          success: false,
          transactionId: '',
          reference: '',
          status: 'failed',
          amount: request.amount,
          currency: request.currency || 'XAF',
          fees: 0,
          netAmount: request.amount,
          message: 'Numéro de téléphone requis',
          timestamp: new Date()
        };
      }

      const phoneValidation = this.validatePhoneNumber(request.customerPhone);
      if (!phoneValidation.valid) {
        return {
          success: false,
          transactionId: '',
          reference: '',
          status: 'failed',
          amount: request.amount,
          currency: request.currency || 'XAF',
          fees: 0,
          netAmount: request.amount,
          message: 'Numéro de téléphone invalide. Utilisez un numéro MTN ou Orange Money.',
          timestamp: new Date()
        };
      }

      const response = await axios.post(
        `${this.config.baseUrl}/payments`,
        {
          merchant_id: this.config.merchantId,
          amount: request.amount,
          currency: request.currency || 'XAF',
          phone_number: request.customerPhone.replace(/\D/g, ''),
          description: request.description,
          reference: `MAYEGUE_${Date.now()}`,
        },
        {
          headers: {
            'X-API-Key': this.config.apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 2 minutes
        }
      );

      return {
        success: response.data.status === 'SUCCESS' || response.data.status === 'PENDING',
        transactionId: response.data.transaction_id,
        reference: response.data.reference,
        status: this.mapStatus(response.data.status),
        amount: request.amount,
        currency: request.currency || 'XAF',
        fees: response.data.fees || 0,
        netAmount: request.amount - (response.data.fees || 0),
        paymentUrl: response.data.payment_url,
        message: this.getStatusMessage(response.data.status),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Noupai payment error:', error);

      // Handle specific errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
          return {
            success: false,
            transactionId: '',
            reference: '',
            status: 'failed',
            amount: request.amount,
            currency: request.currency || 'XAF',
            fees: 0,
            netAmount: request.amount,
            message: 'Le paiement a expiré. Veuillez réessayer.',
            timestamp: new Date()
          };
        }

        if (axiosError.response?.data?.error === 'INSUFFICIENT_FUNDS') {
          return {
            success: false,
            transactionId: '',
            reference: '',
            status: 'failed',
            amount: request.amount,
            currency: request.currency || 'XAF',
            fees: 0,
            netAmount: request.amount,
            message: 'Solde insuffisant sur votre compte Mobile Money',
            timestamp: new Date()
          };
        }
      }

      return {
        success: false,
        transactionId: '',
        reference: '',
        status: 'failed',
        amount: request.amount,
        currency: request.currency || 'XAF',
        fees: 0,
        netAmount: request.amount,
        message: error instanceof Error ? error.message : 'Erreur lors du paiement',
        timestamp: new Date()
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/payments/${transactionId}`, {
        headers: {
          'X-API-Key': this.config.apiKey,
        },
      });

      return {
        success: response.data.status === 'SUCCESS',
        transactionId: response.data.transaction_id,
        reference: response.data.reference,
        status: this.mapStatus(response.data.status),
        amount: response.data.amount,
        currency: response.data.currency || 'XAF',
        fees: response.data.fees || 0,
        netAmount: response.data.amount - (response.data.fees || 0),
        message: this.getStatusMessage(response.data.status),
        timestamp: new Date(response.data.updated_at || Date.now())
      };
    } catch (error) {
      console.error('Noupai status check error:', error);
      throw new Error(error instanceof Error ? error.message : 'Échec de la vérification du statut');
    }
  }

  private mapStatus(status: string): PaymentResponse['status'] {
    const statusMap: Record<string, PaymentResponse['status']> = {
      'PENDING': 'pending',
      'SUCCESS': 'successful',
      'SUCCESSFUL': 'successful',
      'FAILED': 'failed',
      'CANCELLED': 'cancelled',
      'REFUNDED': 'cancelled'
    };

    return statusMap[status.toUpperCase()] || 'pending';
  }

  private getStatusMessage(status: string): string {
    const messages: Record<string, string> = {
      'SUCCESS': 'Paiement effectué avec succès',
      'SUCCESSFUL': 'Paiement effectué avec succès',
      'PENDING': 'Paiement en cours de traitement',
      'FAILED': 'Le paiement a échoué',
      'CANCELLED': 'Paiement annulé',
      'REFUNDED': 'Paiement remboursé'
    };

    return messages[status.toUpperCase()] || 'Statut inconnu';
  }

  /**
   * Get supported operators
   */
  getSupportedOperators(): string[] {
    return ['MTN', 'ORANGE'];
  }

  /**
   * Calculate transaction fee
   */
  getTransactionFee(amount: number): number {
    // Noupai fee structure (check your Noupai dashboard for actual rates)
    const feePercentage = 0.025; // 2.5% example
    return Math.ceil(amount * feePercentage);
  }
}

export const noupaiService = new NouPaiService();

