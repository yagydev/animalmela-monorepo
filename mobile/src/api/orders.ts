// src/api/orders.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Order, ApiResponse } from '@/types';

const API_BASE_URL = 'http://localhost:5001/api';

class OrdersAPI {
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

  // Create new order
  async createOrder(orderData: {
    listingId: string;
    quantity: number;
    advanceAmount: number;
    deliveryAddress: {
      address: string;
      city: string;
      state: string;
      pincode: string;
    };
    deliveryDate?: string;
    notes?: string;
  }): Promise<ApiResponse<Order>> {
    return this.makeRequest('/orders', {
      method: 'POST',
      data: orderData,
    });
  }

  // Get user's orders
  async getUserOrders(): Promise<ApiResponse<Order[]>> {
    return this.makeRequest('/orders/my');
  }

  // Get order by ID
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return this.makeRequest(`/orders/${id}`);
  }

  // Update order status
  async updateOrderStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<ApiResponse<Order>> {
    return this.makeRequest(`/orders/${id}/status`, {
      method: 'PATCH',
      data: { status },
    });
  }

  // Cancel order
  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return this.makeRequest(`/orders/${id}/cancel`, {
      method: 'POST',
      data: { reason },
    });
  }

  // Get seller's orders
  async getSellerOrders(): Promise<ApiResponse<Order[]>> {
    return this.makeRequest('/orders/seller');
  }

  // Confirm order (seller)
  async confirmOrder(id: string): Promise<ApiResponse<Order>> {
    return this.makeRequest(`/orders/${id}/confirm`, {
      method: 'POST',
    });
  }

  // Complete order
  async completeOrder(id: string): Promise<ApiResponse<Order>> {
    return this.makeRequest(`/orders/${id}/complete`, {
      method: 'POST',
    });
  }
}

export default new OrdersAPI();
