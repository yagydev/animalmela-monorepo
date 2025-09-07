// src/api/chat.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Conversation, ChatMessage, ApiResponse } from '@/types';

const API_BASE_URL = 'http://localhost:5001/api';

class ChatAPI {
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

  // Get user's conversations
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.makeRequest('/chat/conversations');
  }

  // Get conversation by ID
  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    return this.makeRequest(`/chat/conversations/${id}`);
  }

  // Create or get conversation
  async createConversation(participantId: string, listingId?: string): Promise<ApiResponse<Conversation>> {
    return this.makeRequest('/chat/conversations', {
      method: 'POST',
      data: { participantId, listingId },
    });
  }

  // Get messages for conversation
  async getMessages(conversationId: string, page = 1, limit = 50): Promise<ApiResponse<{ messages: ChatMessage[]; hasMore: boolean }>> {
    return this.makeRequest(`/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
  }

  // Send message
  async sendMessage(messageData: {
    conversationId: string;
    content: string;
    messageType: 'text' | 'image' | 'location' | 'offer' | 'counter_offer';
    attachments?: string[];
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
  }): Promise<ApiResponse<ChatMessage>> {
    return this.makeRequest('/chat/messages', {
      method: 'POST',
      data: messageData,
    });
  }

  // Mark message as read
  async markAsRead(conversationId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/chat/conversations/${conversationId}/read`, {
      method: 'POST',
    });
  }

  // Report user
  async reportUser(userId: string, reason: string, description?: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/chat/report/${userId}`, {
      method: 'POST',
      data: { reason, description },
    });
  }

  // Block user
  async blockUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/chat/block/${userId}`, {
      method: 'POST',
    });
  }

  // Unblock user
  async unblockUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/chat/unblock/${userId}`, {
      method: 'POST',
    });
  }

  // Get blocked users
  async getBlockedUsers(): Promise<ApiResponse<{ blockedUsers: string[] }>> {
    return this.makeRequest('/chat/blocked');
  }
}

export default new ChatAPI();
