// Shared constants across web, mobile, and backend

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh'
  },
  
  // Services endpoints
  SERVICES: {
    LIST: '/api/services',
    CREATE: '/api/services',
    GET: (id: string) => `/api/services/${id}`,
    UPDATE: (id: string) => `/api/services/${id}`,
    DELETE: (id: string) => `/api/services/${id}`,
    TYPES: '/api/services/types',
    PHOTOS: (id: string) => `/api/services/${id}/photos`,
    PROVIDER: (providerId: string) => `/api/services/provider/${providerId}`,
    TOGGLE_ACTIVE: (id: string) => `/api/services/${id}/toggle-active`
  },
  
  // Pets endpoints
  PETS: {
    LIST: '/api/pets',
    CREATE: '/api/pets',
    GET: (id: string) => `/api/pets/${id}`,
    UPDATE: (id: string) => `/api/pets/${id}`,
    DELETE: (id: string) => `/api/pets/${id}`,
    SPECIES: '/api/pets/species',
    PHOTOS: (id: string) => `/api/pets/${id}/photos`,
    OWNER: (ownerId: string) => `/api/pets/owner/${ownerId}`,
    TOGGLE_ADOPTION: (id: string) => `/api/pets/${id}/toggle-adoption`,
    VACCINATIONS: (id: string) => `/api/pets/${id}/vaccinations`,
    VACCINATION: (petId: string, vaccinationId: string) => `/api/pets/${petId}/vaccinations/${vaccinationId}`
  },
  
  // Bookings endpoints
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    GET: (id: string) => `/api/bookings/${id}`,
    UPDATE: (id: string) => `/api/bookings/${id}`,
    DELETE: (id: string) => `/api/bookings/${id}`,
    USER: (userId: string) => `/api/bookings/user/${userId}`,
    PROVIDER: (providerId: string) => `/api/bookings/provider/${providerId}`
  },
  
  // Reviews endpoints
  REVIEWS: {
    LIST: '/api/reviews',
    CREATE: '/api/reviews',
    GET: (id: string) => `/api/reviews/${id}`,
    UPDATE: (id: string) => `/api/reviews/${id}`,
    DELETE: (id: string) => `/api/reviews/${id}`,
    SERVICE: (serviceId: string) => `/api/reviews/service/${serviceId}`,
    USER: (userId: string) => `/api/reviews/user/${userId}`
  },
  
  // Marketplace endpoints
  LISTINGS: {
    LIST: '/api/listings',
    CREATE: '/api/listings',
    GET: (id: string) => `/api/listings/${id}`,
    UPDATE: (id: string) => `/api/listings/${id}`,
    DELETE: (id: string) => `/api/listings/${id}`,
    CATEGORIES: '/api/listings/categories',
    PHOTOS: (id: string) => `/api/listings/${id}/photos`,
    SELLER: (sellerId: string) => `/api/listings/seller/${sellerId}`,
    TOGGLE_FEATURED: (id: string) => `/api/listings/${id}/toggle-featured`
  },
  
  // Orders endpoints
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    GET: (id: string) => `/api/orders/${id}`,
    UPDATE: (id: string) => `/api/orders/${id}`,
    BUYER: (buyerId: string) => `/api/orders/buyer/${buyerId}`,
    SELLER: (sellerId: string) => `/api/orders/seller/${sellerId}`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
    TRACK: (id: string) => `/api/orders/${id}/track`
  }
};

export const USER_TYPES = {
  PET_OWNER: 'pet_owner',
  SERVICE_PROVIDER: 'service_provider',
  BREEDER: 'breeder',
  ADMIN: 'admin',
  SELLER: 'seller',
  BUYER: 'buyer'
} as const;

export const SERVICE_TYPES = {
  PET_SITTING: 'pet_sitting',
  DOG_WALKING: 'dog_walking',
  GROOMING: 'grooming',
  TRAINING: 'training',
  VETERINARY: 'veterinary',
  BOARDING: 'boarding',
  PET_TAXI: 'pet_taxi',
  PET_PHOTOGRAPHY: 'pet_photography',
  PET_MASSAGE: 'pet_massage',
  PET_YOGA: 'pet_yoga',
  OTHER: 'other'
} as const;

export const PET_SPECIES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  FISH: 'fish',
  REPTILE: 'reptile',
  RABBIT: 'rabbit',
  HAMSTER: 'hamster',
  OTHER: 'other'
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed'
} as const;

export const GENDER_OPTIONS = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown'
} as const;

export const API_RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
} as const;

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILES: 5
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  FAVORITES: 'favorites'
} as const;

export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

export const LANGUAGE_OPTIONS = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de'
} as const;

// Marketplace Constants
export const LISTING_CATEGORIES = {
  PETS: 'pets',
  PET_FOOD: 'pet_food',
  PET_TOYS: 'pet_toys',
  PET_ACCESSORIES: 'pet_accessories',
  PET_HEALTH: 'pet_health',
  PET_GROOMING: 'pet_grooming',
  PET_TRAINING: 'pet_training',
  PET_SERVICES: 'pet_services',
  OTHER: 'other'
} as const;

export const LISTING_CONDITIONS = {
  NEW: 'new',
  LIKE_NEW: 'like_new',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor'
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const;

export const PAYMENT_METHODS = {
  CASH: 'cash',
  ONLINE: 'online',
  UPI: 'upi',
  CARD: 'card',
  WALLET: 'wallet'
} as const;

export const KYC_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
} as const;
