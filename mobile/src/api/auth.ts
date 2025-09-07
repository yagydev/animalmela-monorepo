// src/api/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthResponse, User } from '@/types';

const API_BASE_URL = 'http://localhost:5001/api';

class AuthAPI {
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

  // Send OTP to phone number
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/auth/otp/send', {
      method: 'POST',
      data: { phone },
    });
  }

  // Verify OTP and login
  async verifyOTP(phone: string, otp: string, name?: string): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/otp/verify', {
      method: 'POST',
      data: { phone, otp, name },
    });

    if (response.success && response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  // Google login
  async googleLogin(userData: {
    googleId: string;
    email: string;
    name: string;
    profilePic?: string;
  }): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/google', {
      method: 'POST',
      data: userData,
    });

    if (response.success && response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  // Facebook login
  async facebookLogin(userData: {
    facebookId: string;
    email?: string;
    name: string;
    profilePic?: string;
  }): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/facebook', {
      method: 'POST',
      data: userData,
    });

    if (response.success && response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    return this.makeRequest('/user/me');
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<{ success: boolean; user: User }> {
    const response = await this.makeRequest('/user/update', {
      method: 'PATCH',
      data: userData,
    });

    if (response.success && response.user) {
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  // Complete profile setup
  async completeProfile(profileData: {
    name: string;
    role: 'buyer' | 'seller' | 'service_partner';
    userType?: 'transporter' | 'vet' | 'insurance' | 'farmer' | 'buyer';
    location?: {
      address: string;
      city: string;
      state: string;
      coordinates: { lat: number; lng: number };
    };
  }): Promise<{ success: boolean; user: User }> {
    const response = await this.makeRequest('/auth/complete-profile', {
      method: 'POST',
      data: profileData,
    });

    if (response.success && response.user) {
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  // Upload KYC documents
  async uploadKYC(documents: {
    aadhaar?: string;
    pan?: string;
    farmLocation?: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/auth/kyc', {
      method: 'POST',
      data: documents,
    });
  }

  // Logout
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
    }

    return { success: true, message: 'Logged out successfully' };
  }

  // Refresh token
  async refreshToken(): Promise<{ success: boolean; token: string }> {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.makeRequest('/auth/refresh', {
      method: 'POST',
      data: { refreshToken },
    });

    if (response.success && response.token) {
      await AsyncStorage.setItem('authToken', response.token);
    }

    return response;
  }
}

export default new AuthAPI();
