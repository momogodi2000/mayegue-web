import axios from 'axios';
import { ENV } from '@/core/config/env.config';

interface PaymentRequest {
  amount: number;
  currency?: string;
  description: string;
  externalReference: string;
  phoneNumber?: string;
}

interface PaymentResponse {
  reference: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  ussdCode?: string;
  description?: string;
}

export class CamPayService {
  private baseURL = ENV.CAMPAY_ENVIRONMENT === 'sandbox' 
    ? 'https://demo.campay.net/api' 
    : 'https://www.campay.net/api';

  private async getToken(): Promise<string> {
    // In production, implement proper token caching
    const response = await axios.post(`${this.baseURL}/token/`, {
      username: ENV.CAMPAY_API_KEY,
      password: ENV.CAMPAY_SECRET,
    });
    return response.data.token;
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const token = await this.getToken();
      const response = await axios.post(
        `${this.baseURL}/collect/`,
        {
          amount: request.amount.toString(),
          currency: request.currency || 'XAF',
          from: request.phoneNumber || '237xxxxxxxxx',
          description: request.description,
          external_reference: request.externalReference,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        reference: response.data.reference,
        status: response.data.status,
        ussdCode: response.data.ussd_code,
        description: response.data.description,
      };
    } catch (error: any) {
      console.error('CamPay payment error:', error);
      throw new Error(error?.response?.data?.message || 'Payment failed');
    }
  }

  async checkPaymentStatus(reference: string): Promise<PaymentResponse> {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${this.baseURL}/transaction/${reference}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      return {
        reference: response.data.reference,
        status: response.data.status,
        description: response.data.description,
      };
    } catch (error: any) {
      console.error('CamPay status check error:', error);
      throw new Error(error?.response?.data?.message || 'Status check failed');
    }
  }
}

export const campayService = new CamPayService();

