import axios from 'axios';
import { PaymentRequest, PaymentResponse } from './types';

export interface CamPayConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  webhookSecret: string;
  environment: 'sandbox' | 'production';
}

export class CamPayService {
  private readonly config: CamPayConfig;
  private tokenCache: { token: string; expires: number } | null = null;

  constructor(config?: Partial<CamPayConfig>) {
    // Default configuration - should be loaded from environment
    this.config = {
      apiKey: config?.apiKey || import.meta.env.VITE_CAMPAY_API_KEY || '',
      apiSecret: config?.apiSecret || import.meta.env.VITE_CAMPAY_API_SECRET || '',
      baseUrl: config?.baseUrl || (import.meta.env.VITE_CAMPAY_ENVIRONMENT === 'production' 
        ? 'https://www.campay.net/api' 
        : 'https://demo.campay.net/api'),
      webhookSecret: config?.webhookSecret || import.meta.env.VITE_CAMPAY_WEBHOOK_SECRET || '',
      environment: (config?.environment || import.meta.env.VITE_CAMPAY_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production'
    };
  }

  private async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.tokenCache && this.tokenCache.expires > Date.now()) {
      return this.tokenCache.token;
    }

    try {
      const response = await axios.post(`${this.config.baseUrl}/token/`, {
        username: this.config.apiKey,
        password: this.config.apiSecret,
      });

      // Cache token for 50 minutes (tokens usually expire in 1 hour)
      this.tokenCache = {
        token: response.data.token,
        expires: Date.now() + (50 * 60 * 1000)
      };

      return response.data.token;
    } catch (error) {
      console.error('Failed to get CamPay token:', error);
      throw new Error('Authentication failed');
    }
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

