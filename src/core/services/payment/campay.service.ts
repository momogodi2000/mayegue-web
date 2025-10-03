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
      const token = await this.getToken();
      const response = await axios.post(
        `${this.config.baseUrl}/collect/`,
        {
          amount: request.amount.toString(),
          currency: request.currency || 'XAF',
          from: request.customerPhone || '237xxxxxxxxx',
          description: request.description,
          external_reference: `Ma’a yegue_${Date.now()}`,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: response.data.status === 'SUCCESSFUL',
        transactionId: response.data.reference,
        reference: response.data.reference,
        status: this.mapStatus(response.data.status),
        amount: request.amount,
        currency: request.currency || 'XAF',
        fees: 0, // CamPay fees would need to be calculated
        netAmount: request.amount,
        paymentUrl: response.data.link,
        message: response.data.description || 'Payment initiated successfully',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('CamPay payment error:', error);
      return {
        success: false,
        transactionId: '',
        reference: '',
        status: 'failed',
        amount: request.amount,
        currency: request.currency || 'XAF',
        fees: 0,
        netAmount: request.amount,
        message: error instanceof Error ? error.message : 'Payment failed',
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
}

export const camPayService = new CamPayService();

export const campayService = new CamPayService();

