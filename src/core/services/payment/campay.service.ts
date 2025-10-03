import axios, { AxiosError } from 'axios';
import { PaymentRequest, PaymentResponse } from './types';

export interface CamPayConfig {
  username: string;
  password: string;
  baseUrl: string;
  environment: 'sandbox' | 'production';
}

export class CamPayService {
  private readonly config: CamPayConfig;
  private tokenCache: { token: string; expires: number } | null = null;

  constructor(config?: Partial<CamPayConfig>) {
    // Default configuration - should be loaded from environment
    this.config = {
      username: config?.username || import.meta.env.VITE_CAMPAY_USERNAME || '',
      password: config?.password || import.meta.env.VITE_CAMPAY_PASSWORD || '',
      baseUrl: config?.baseUrl || (import.meta.env.VITE_CAMPAY_MODE === 'live'
        ? 'https://www.campay.net/api'
        : 'https://demo.campay.net/api'),
      environment: (config?.environment || import.meta.env.VITE_CAMPAY_MODE || 'sandbox') as 'sandbox' | 'production'
    };
  }

  private async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.tokenCache && this.tokenCache.expires > Date.now()) {
      return this.tokenCache.token;
    }

    try {
      const response = await axios.post(`${this.config.baseUrl}/token/`, {
        username: this.config.username,
        password: this.config.password,
      });

      // Cache token for 50 minutes (tokens usually expire in 1 hour)
      this.tokenCache = {
        token: response.data.token,
        expires: Date.now() + (50 * 60 * 1000)
      };

      return response.data.token;
    } catch (error) {
      console.error('Failed to get CamPay token:', error);
      throw new Error('Échec d\'authentification avec Campay');
    }
  }

  /**
   * Check if Campay service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.getToken();
      return true;
    } catch (error) {
      console.error('Campay service unavailable:', error);
      return false;
    }
  }

  /**
   * Validate phone number for Cameroon operators
   */
  private validatePhoneNumber(phone: string): { valid: boolean; operator?: string } {
    const cleaned = phone.replace(/\D/g, '');

    // MTN Mobile Money (237 6XX XXX XXX)
    if (/^237(67|650|651|652|653|654|680|681|682|683)/.test(cleaned)) {
      return { valid: true, operator: 'MTN' };
    }

    // Orange Money (237 69X XXX XXX or 237 655-659)
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

      const token = await this.getToken();
      const response = await axios.post(
        `${this.config.baseUrl}/collect/`,
        {
          amount: request.amount.toString(),
          currency: request.currency || 'XAF',
          from: request.customerPhone.replace(/\D/g, ''),
          description: request.description,
          external_reference: `MAYEGUE_${Date.now()}`,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 2 minutes
        }
      );

      return {
        success: response.data.status === 'SUCCESSFUL',
        transactionId: response.data.reference,
        reference: response.data.reference,
        status: this.mapStatus(response.data.status),
        amount: request.amount,
        currency: request.currency || 'XAF',
        fees: 0,
        netAmount: request.amount,
        paymentUrl: response.data.link,
        message: this.getStatusMessage(response.data.status),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('CamPay payment error:', error);

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

        if (axiosError.response?.data?.code === 'INSUFFICIENT_BALANCE') {
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

  async checkPaymentStatus(reference: string): Promise<PaymentResponse> {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${this.config.baseUrl}/transaction/${reference}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      return {
        success: response.data.status === 'SUCCESSFUL',
        transactionId: response.data.reference,
        reference: response.data.reference,
        status: this.mapStatus(response.data.status),
        amount: parseFloat(response.data.amount),
        currency: response.data.currency || 'XAF',
        fees: 0,
        netAmount: parseFloat(response.data.amount),
        message: response.data.description || 'Payment status checked',
        timestamp: new Date(response.data.created_at || Date.now())
      };
    } catch (error) {
      console.error('CamPay status check error:', error);
      throw new Error(error instanceof Error ? error.message : 'Status check failed');
    }
  }

  private mapStatus(status: string): PaymentResponse['status'] {
    const statusMap: Record<string, PaymentResponse['status']> = {
      'PENDING': 'pending',
      'SUCCESSFUL': 'successful',
      'FAILED': 'failed',
      'CANCELLED': 'cancelled'
    };

    return statusMap[status.toUpperCase()] || 'pending';
  }

  private getStatusMessage(status: string): string {
    const messages: Record<string, string> = {
      'SUCCESSFUL': 'Paiement effectué avec succès',
      'PENDING': 'Paiement en cours de traitement',
      'FAILED': 'Le paiement a échoué',
      'CANCELLED': 'Paiement annulé'
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
    // Campay fee structure (check your Campay dashboard for actual rates)
    const feePercentage = 0.02; // 2% example
    return Math.ceil(amount * feePercentage);
  }
}

export const camPayService = new CamPayService();
export const campayService = new CamPayService();

