// src/api/payments.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiResponse } from '@/types';

const API_BASE_URL = 'http://localhost:5001/api';

class PaymentsAPI {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest(
    endpoint: string,
    options: any = {}
  ): Promise<any> {
    const token = await this.getAuthToken();
    
    const config = {
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      console.error('API request failed:', error);
      throw error.response?.data || error.message;
    }
  }

  // Create Razorpay order
  async createRazorpayOrder(orderData: {
    amount: number;
    currency: string;
    orderId: string;
    description: string;
  }): Promise<ApiResponse<{
    razorpayOrderId: string;
    amount: number;
    currency: string;
    key: string;
  }>> {
    return this.makeRequest('/payments/razorpay/create-order', {
      method: 'POST',
      data: orderData,
    });
  }

  // Verify payment
  async verifyPayment(paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  }): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.makeRequest('/payments/razorpay/verify', {
      method: 'POST',
      data: paymentData,
    });
  }

  // Get payment history
  async getPaymentHistory(): Promise<ApiResponse<{
    payments: Array<{
      id: string;
      orderId: string;
      amount: number;
      status: string;
      method: string;
      createdAt: string;
    }>;
  }>> {
    return this.makeRequest('/payments/history');
  }

  // Get payment receipt
  async getPaymentReceipt(paymentId: string): Promise<ApiResponse<{
    receipt: {
      id: string;
      orderId: string;
      amount: number;
      status: string;
      method: string;
      transactionId: string;
      createdAt: string;
      invoiceUrl: string;
    };
  }>> {
    return this.makeRequest(`/payments/receipt/${paymentId}`);
  }

  // Refund payment
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<ApiResponse<{
    refundId: string;
    status: string;
    amount: number;
  }>> {
    return this.makeRequest(`/payments/refund/${paymentId}`, {
      method: 'POST',
      data: { amount, reason },
    });
  }
}

export default new PaymentsAPI();
