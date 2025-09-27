// src/api/services.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ServicePartner, TransportRequest, ApiResponse } from '@/types';

const API_BASE_URL = 'http://localhost:5001/api';

class ServicesAPI {
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

  // Get service partners
  async getServicePartners(serviceType?: 'transporter' | 'vet' | 'insurance'): Promise<ApiResponse<ServicePartner[]>> {
    const params = serviceType ? `?serviceType=${serviceType}` : '';
    return this.makeRequest(`/services/partners${params}`);
  }

  // Create transport request
  async createTransportRequest(requestData: {
    orderId: string;
    pickupAddress: {
      address: string;
      city: string;
      state: string;
      coordinates: { lat: number; lng: number };
    };
    deliveryAddress: {
      address: string;
      city: string;
      state: string;
      coordinates: { lat: number; lng: number };
    };
    vehicleType: 'truck' | 'van' | 'trailer' | 'specialized';
    pickupDate: string;
    specialRequirements?: string[];
  }): Promise<ApiResponse<TransportRequest>> {
    return this.makeRequest('/services/transport/request', {
      method: 'POST',
      data: requestData,
    });
  }

  // Get transport requests
  async getTransportRequests(): Promise<ApiResponse<TransportRequest[]>> {
    return this.makeRequest('/services/transport/requests');
  }

  // Accept transport request (for transporters)
  async acceptTransportRequest(requestId: string, quote: {
    estimatedCost: number;
    vehicleDetails: {
      number: string;
      model: string;
      capacity: string;
    };
    driverDetails: {
      name: string;
      phone: string;
      licenseNumber: string;
    };
  }): Promise<ApiResponse<TransportRequest>> {
    return this.makeRequest(`/services/transport/requests/${requestId}/accept`, {
      method: 'POST',
      data: quote,
    });
  }

  // Update transport status
  async updateTransportStatus(requestId: string, status: string, location?: string, notes?: string): Promise<ApiResponse<TransportRequest>> {
    return this.makeRequest(`/services/transport/requests/${requestId}/status`, {
      method: 'PATCH',
      data: { status, location, notes },
    });
  }

  // Get vet consultations
  async getVetConsultations(): Promise<ApiResponse<Array<{
    id: string;
    petId: string;
    consultationType: 'teleconsultation' | 'visit' | 'emergency';
    consultationDate: string;
    status: string;
    fee: number;
  }>>> {
    return this.makeRequest('/services/vet/consultations');
  }

  // Book vet consultation
  async bookVetConsultation(consultationData: {
    vetId: string;
    petId: string;
    consultationType: 'teleconsultation' | 'visit' | 'emergency';
    consultationDate: string;
    symptoms: string[];
    notes?: string;
  }): Promise<ApiResponse<{ consultationId: string; fee: number }>> {
    return this.makeRequest('/services/vet/book', {
      method: 'POST',
      data: consultationData,
    });
  }

  // Get insurance quotes
  async getInsuranceQuotes(quoteData: {
    petId: string;
    insuranceType: 'health' | 'death' | 'transport' | 'farm' | 'comprehensive';
    coverageAmount: number;
  }): Promise<ApiResponse<Array<{
    providerId: string;
    providerName: string;
    premiumAmount: number;
    coverageDetails: any;
    policyDuration: number;
  }>>> {
    return this.makeRequest('/services/insurance/quotes', {
      method: 'POST',
      data: quoteData,
    });
  }

  // Apply for insurance
  async applyInsurance(applicationData: {
    providerId: string;
    petId: string;
    insuranceType: string;
    coverageAmount: number;
    premiumAmount: number;
  }): Promise<ApiResponse<{ applicationId: string; status: string }>> {
    return this.makeRequest('/services/insurance/apply', {
      method: 'POST',
      data: applicationData,
    });
  }
}

export default new ServicesAPI();
