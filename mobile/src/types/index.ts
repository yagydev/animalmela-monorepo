// src/types/index.ts
export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: 'buyer' | 'seller' | 'service_partner' | 'admin';
  userType: 'transporter' | 'vet' | 'insurance' | 'farmer' | 'buyer';
  isVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
  profileComplete: boolean;
  avatar?: string;
  location?: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  seller: User;
  title: string;
  description: string;
  category: 'cattle' | 'goat' | 'sheep' | 'buffalo' | 'poultry' | 'other';
  subcategory: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female' | 'castrated';
  price: number;
  negotiable: boolean;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  images: string[];
  video?: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  status: 'active' | 'paused' | 'sold';
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  listing: Listing;
  buyer: User;
  seller: User;
  quantity: number;
  totalAmount: number;
  advanceAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash';
  orderStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  deliveryAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  content: string;
  messageType: 'text' | 'image' | 'location' | 'offer' | 'counter_offer';
  attachments?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  listingId?: string;
  orderId?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransportRequest {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  transporterId?: string;
  pickupAddress: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  deliveryAddress: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  distance: number;
  estimatedCost: number;
  actualCost?: number;
  vehicleType: 'truck' | 'van' | 'trailer' | 'specialized';
  status: 'requested' | 'quoted' | 'assigned' | 'picked' | 'in_transit' | 'delivered' | 'cancelled';
  pickupDate: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePartner {
  id: string;
  userId: string;
  user: User;
  serviceType: 'transporter' | 'vet' | 'insurance';
  businessName: string;
  description: string;
  serviceAreas: string[];
  pricing: {
    perKm?: number;
    perHour?: number;
    consultationFee?: number;
    minimumCharge?: number;
  };
  vehicleTypes?: string[];
  specializations?: string[];
  certifications: string[];
  rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'listing' | 'order' | 'message' | 'transport' | 'payment' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: User;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ListingFilters {
  category?: string;
  species?: string;
  breed?: string;
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
  gender?: string;
  healthStatus?: string;
  verified?: boolean;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  search?: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}