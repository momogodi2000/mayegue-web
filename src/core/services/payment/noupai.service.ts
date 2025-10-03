import axios from 'axios';
import config from '@/core/config/env.config';

interface NouPaiPaymentRequest {
  amount: number;
  currency?: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

interface NouPaiPaymentResponse {
  paymentUrl: string;
  transactionId: string;
  status: string;
}

export class NouPaiService {
  private baseURL = 'https://api.noupai.cm/v1';

  async createPayment(request: NouPaiPaymentRequest): Promise<NouPaiPaymentResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/payments`,
        {
          merchant_id: config.payment.noupai.clientId,
          amount: request.amount,
          currency: request.currency || 'XAF',
          description: request.description,
          return_url: request.returnUrl,
          cancel_url: request.cancelUrl,
        },
        {
          headers: {
            'X-API-Key': config.payment.noupai.clientSecret,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        paymentUrl: response.data.payment_url,
        transactionId: response.data.transaction_id,
        status: response.data.status,
      };
    } catch (error: any) {
      console.error('NouPai payment error:', error);
      throw new Error(error?.response?.data?.message || 'Payment creation failed');
    }
  }

  async verifyPayment(transactionId: string): Promise<{ status: string; amount: number }> {
    try {
      const response = await axios.get(`${this.baseURL}/payments/${transactionId}`, {
        headers: {
          'X-API-Key': config.payment.noupai.clientSecret,
        },
      });

      return {
        status: response.data.status,
        amount: response.data.amount,
      };
    } catch (error: any) {
      console.error('NouPai verification error:', error);
      throw new Error(error?.response?.data?.message || 'Verification failed');
    }
  }
}

export const noupaiService = new NouPaiService();

