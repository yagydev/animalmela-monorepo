// Shared TypeScript types and interfaces for API communication

// Base API Response Types
export interface BaseApiResponse {
  success: boolean;
  status: 'success' | 'error';
  message?: string;
}

export interface SuccessResponse<T = any> extends BaseApiResponse {
  success: true;
  status: 'success';
  data: T;
  pagination?: PaginationInfo;
}

export interface ErrorResponse extends BaseApiResponse {
  success: false;
  status: 'error';
  error: string;
  details?: ValidationError[];
  statusCode?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  user_type: UserType;
  verified: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  preferences: Record<string, any>;
  stripe_customer_id?: string;
  stripe_account_id?: string;
  last_login?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserType = 'pet_owner' | 'service_provider' | 'breeder' | 'admin';

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'pet_owner' | 'service_provider';
  phone?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Service Types
export interface Service {
  id: string;
  provider_id: string | User;
  title: string;
  description?: string;
  service_type: ServiceType;
  price?: number;
  currency: string;
  location?: ServiceLocation;
  availability: Record<string, any>;
  service_areas: string[];
  verified: boolean;
  active: boolean;
  requirements: Record<string, any>;
  photos: string[];
  features: string[];
  policies: ServicePolicies;
  included: string[];
  not_included: string[];
  createdAt: string;
  updatedAt: string;
}

export type ServiceType = 
  | 'pet_sitting'
  | 'dog_walking'
  | 'grooming'
  | 'training'
  | 'veterinary'
  | 'boarding'
  | 'pet_taxi'
  | 'pet_photography'
  | 'pet_massage'
  | 'pet_yoga'
  | 'other';

export interface ServiceLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface ServicePolicies {
  cancellation?: string;
  refund?: string;
  emergency?: string;
}

export interface ServiceCreateData {
  title: string;
  description?: string;
  serviceType: ServiceType;
  price?: number;
  currency?: string;
  location?: ServiceLocation;
  availability?: Record<string, any>;
  serviceAreas?: string[];
  requirements?: Record<string, any>;
  features?: string[];
  policies?: ServicePolicies;
  included?: string[];
  notIncluded?: string[];
}

export interface ServiceUpdateData extends Partial<ServiceCreateData> {}

export interface ServiceTypeOption {
  value: ServiceType;
  label: string;
  icon: string;
  description: string;
}

// Pet Types
export interface Pet {
  id: string;
  owner_id: string | User;
  name: string;
  species: PetSpecies;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: PetGender;
  color?: string;
  neutered: boolean;
  description?: string;
  medical_notes?: string;
  special_needs: string[];
  vaccinations: Vaccination[];
  health_info: Record<string, any>;
  behavior_traits: Record<string, any>;
  photos: string[];
  gallery: string[];
  emergency_contact: EmergencyContact;
  vet_info: VetInfo;
  available_for_adoption: boolean;
  adoption_fee?: number;
  createdAt: string;
  updatedAt: string;
}

export type PetSpecies = 
  | 'dog'
  | 'cat'
  | 'bird'
  | 'fish'
  | 'reptile'
  | 'rabbit'
  | 'hamster'
  | 'other';

export type PetGender = 'male' | 'female' | 'unknown';

export interface Vaccination {
  id?: string;
  name: string;
  date: string;
  next_due: string;
}

export interface EmergencyContact {
  name?: string;
  phone?: string;
  relationship?: string;
}

export interface VetInfo {
  name?: string;
  clinic?: string;
  phone?: string;
  address?: string;
}

export interface PetCreateData {
  name: string;
  species: PetSpecies;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: PetGender;
  color?: string;
  neutered?: boolean;
  description?: string;
  medicalNotes?: string;
  specialNeeds?: string[];
  vaccinations?: Omit<Vaccination, 'id'>[];
  healthInfo?: Record<string, any>;
  behaviorTraits?: Record<string, any>;
  photos?: string[];
  gallery?: string[];
  emergencyContact?: EmergencyContact;
  vetInfo?: VetInfo;
  availableForAdoption?: boolean;
  adoptionFee?: number;
}

export interface PetUpdateData extends Partial<PetCreateData> {}

export interface PetSpeciesOption {
  value: PetSpecies;
  label: string;
  icon: string;
  description: string;
}

// Booking Types
export interface Booking {
  id: string;
  service_id: string | Service;
  pet_id: string | Pet;
  owner_id: string | User;
  provider_id: string | User;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  total_amount: number;
  payment_status: PaymentStatus;
  special_instructions?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'refunded'
  | 'failed';

export interface BookingCreateData {
  serviceId: string;
  petId: string;
  startDate: string;
  endDate: string;
  specialInstructions?: string;
  notes?: string;
}

export interface BookingUpdateData {
  status?: BookingStatus;
  payment_status?: PaymentStatus;
  specialInstructions?: string;
  notes?: string;
}

// Review Types
export interface Review {
  id: string;
  service_id: string | Service;
  booking_id: string | Booking;
  reviewer_id: string | User;
  reviewee_id: string | User;
  rating: number;
  comment?: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCreateData {
  serviceId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  photos?: string[];
}

export interface ReviewUpdateData {
  rating?: number;
  comment?: string;
  photos?: string[];
}

// Filter and Query Types
export interface ServiceFilters {
  page?: number;
  limit?: number;
  serviceType?: ServiceType;
  verified?: boolean;
  active?: boolean;
  priceMin?: number;
  priceMax?: number;
  providerId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export interface PetFilters {
  page?: number;
  limit?: number;
  species?: PetSpecies;
  breed?: string;
  ageMin?: number;
  ageMax?: number;
  gender?: PetGender;
  availableForAdoption?: boolean;
  ownerId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'age';
  sortOrder?: 'asc' | 'desc';
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  payment_status?: PaymentStatus;
  userId?: string;
  providerId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'start_date' | 'end_date';
  sortOrder?: 'asc' | 'desc';
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface FileUploadError {
  error: string;
  filename?: string;
}

// API Client Types
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  details?: ValidationError[];
}

export interface NetworkError {
  message: string;
  code: 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'CANCELLED';
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
}

// Language Types
export type Language = 'en' | 'es' | 'fr' | 'de';

export interface LanguageConfig {
  language: Language;
  translations: Record<string, string>;
}

// Storage Types
export interface StorageItem<T = any> {
  key: string;
  value: T;
  expiresAt?: number;
}

export interface StorageConfig {
  prefix: string;
  encryption?: boolean;
  compression?: boolean;
}
