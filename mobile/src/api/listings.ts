// src/api/listings.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Listing, ListingFilters, PaginationParams, ApiResponse } from '@/types';

const API_BASE_URL = 'http://localhost:5001/api';

class ListingsAPI {
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

  // Get all listings with filters
  async getListings(
    filters?: ListingFilters,
    pagination?: PaginationParams
  ): Promise<ApiResponse<{ listings: Listing[]; total: number; page: number; pages: number }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            params.append(key, JSON.stringify(value));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    if (pagination) {
      params.append('page', String(pagination.page));
      params.append('limit', String(pagination.limit));
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);
    }

    return this.makeRequest(`/listings?${params.toString()}`);
  }

  // Get single listing by ID
  async getListingById(id: string): Promise<ApiResponse<Listing>> {
    return this.makeRequest(`/listings/${id}`);
  }

  // Create new listing
  async createListing(listingData: {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    species: string;
    breed: string;
    age: number;
    weight: number;
    gender: string;
    price: number;
    negotiable: boolean;
    healthStatus: string;
    images: string[];
    video?: string;
    location: {
      address: string;
      city: string;
      state: string;
      coordinates: { lat: number; lng: number };
    };
  }): Promise<ApiResponse<Listing>> {
    return this.makeRequest('/listings', {
      method: 'POST',
      data: listingData,
    });
  }

  // Update listing
  async updateListing(id: string, listingData: Partial<Listing>): Promise<ApiResponse<Listing>> {
    return this.makeRequest(`/listings/${id}`, {
      method: 'PUT',
      data: listingData,
    });
  }

  // Delete listing
  async deleteListing(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  // Get user's listings
  async getUserListings(): Promise<ApiResponse<Listing[]>> {
    return this.makeRequest('/listings/my');
  }

  // Update listing status
  async updateListingStatus(id: string, status: 'active' | 'paused' | 'sold'): Promise<ApiResponse<Listing>> {
    return this.makeRequest(`/listings/${id}/status`, {
      method: 'PATCH',
      data: { status },
    });
  }

  // Promote listing (Hot Deal/Featured)
  async promoteListing(id: string, promotionType: 'hot_deal' | 'featured'): Promise<ApiResponse<Listing>> {
    return this.makeRequest(`/listings/${id}/promote`, {
      method: 'POST',
      data: { promotionType },
    });
  }

  // Add to wishlist
  async addToWishlist(listingId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/listings/${listingId}/wishlist`, {
      method: 'POST',
    });
  }

  // Remove from wishlist
  async removeFromWishlist(listingId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/listings/${listingId}/wishlist`, {
      method: 'DELETE',
    });
  }

  // Get wishlist
  async getWishlist(): Promise<ApiResponse<Listing[]>> {
    return this.makeRequest('/listings/wishlist');
  }

  // Report listing
  async reportListing(listingId: string, reason: string, description?: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/listings/${listingId}/report`, {
      method: 'POST',
      data: { reason, description },
    });
  }

  // Get listing categories
  async getCategories(): Promise<ApiResponse<{ categories: string[]; subcategories: Record<string, string[]> }>> {
    return this.makeRequest('/listings/categories');
  }

  // Get breeds by species
  async getBreeds(species: string): Promise<ApiResponse<{ breeds: string[] }>> {
    return this.makeRequest(`/listings/breeds?species=${species}`);
  }
}

export default new ListingsAPI();
