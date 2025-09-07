// src/services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5001';

class ApiService {
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
    options: RequestInit = {}
  ): Promise<any> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // Services
  async getServices(filters?: any) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/services${queryParams}`);
  }

  async getServiceById(id: string) {
    return this.makeRequest(`/services/${id}`);
  }

  // Pets
  async getPets(filters?: any) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/pets${queryParams}`);
  }

  async getPetById(id: string) {
    return this.makeRequest(`/pets/${id}`);
  }

  // Bookings
  async createBooking(bookingData: any) {
    return this.makeRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings() {
    return this.makeRequest('/bookings');
  }

  // Reviews
  async createReview(reviewData: any) {
    return this.makeRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReviews(serviceId?: string, petId?: string) {
    const params = new URLSearchParams();
    if (serviceId) params.append('serviceId', serviceId);
    if (petId) params.append('petId', petId);
    
    return this.makeRequest(`/reviews?${params}`);
  }

  // User Profile
  async updateProfile(userData: any) {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async uploadImage(imageData: FormData) {
    const token = await this.getAuthToken();
    
    return fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: imageData,
    });
  }

  // Marketplace - Listings
  async getListings(filters?: any) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`/listings${queryParams}`);
  }

  async getListingById(id: string) {
    return this.makeRequest(`/listings/${id}`);
  }

  async createListing(listingData: any) {
    return this.makeRequest('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  async updateListing(id: string, listingData: any) {
    return this.makeRequest(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  }

  async deleteListing(id: string) {
    return this.makeRequest(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  // Marketplace - Orders
  async getOrders() {
    return this.makeRequest('/orders');
  }

  async getOrderById(id: string) {
    return this.makeRequest(`/orders/${id}`);
  }

  async createOrder(orderData: any) {
    return this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(id: string, orderData: any) {
    return this.makeRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: string) {
    return this.makeRequest(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  }

  // User Profile
  async getProfile() {
    return this.makeRequest('/auth/me');
  }
}

export default new ApiService();
