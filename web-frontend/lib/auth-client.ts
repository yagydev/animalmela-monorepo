// Client-safe authentication utilities for Farmers Market
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'buyer' | 'seller' | 'service' | 'admin';
  mobile: string;
  profileComplete: boolean;
  location?: {
    state: string;
    district: string;
    village: string;
    pincode: string;
  };
  rating?: number;
  totalRatings?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

// Login with email and password
export const loginWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      // Store authentication data
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Login failed. Please try again.'
    };
  }
};

// Login with OTP
export const loginWithOTP = async (mobile: string, otp: string, name?: string): Promise<AuthResponse> => {
  try {
    const response = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp, name })
    });

    const data = await response.json();
    
    if (data.success) {
      // Store authentication data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'OTP login failed. Please try again.'
    };
  }
};

// Send OTP
export const sendOTP = async (mobile: string, type: 'login' | 'registration' = 'login'): Promise<AuthResponse> => {
  try {
    const response = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, type })
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send OTP. Please try again.'
    };
  }
};

// Register new user
export const registerUser = async (userData: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'farmer' | 'buyer' | 'seller' | 'service' | 'admin';
}): Promise<AuthResponse> => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (data.success) {
      // Store authentication data
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Registration failed. Please try again.'
    };
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

// Get current token
export const getCurrentToken = (): string | null => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getCurrentToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// Logout
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

// Check if user is farmer
export const isFarmer = (): boolean => {
  return hasRole('farmer');
};

// Check if user is buyer
export const isBuyer = (): boolean => {
  return hasRole('buyer');
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return hasRole('admin');
};

// Make authenticated API request
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getCurrentToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

// Update user profile
export const updateProfile = async (profileData: Partial<User>): Promise<AuthResponse> => {
  try {
    const response = await authenticatedFetch('/api/farmers-market/profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    
    if (data.success) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Profile update failed. Please try again.'
    };
  }
};

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@kisaanmela.com', password: 'admin123' },
  farmer: { email: 'farmer@kisaanmela.com', password: 'farmer123' },
  buyer: { email: 'buyer@kisaanmela.com', password: 'buyer123' },
  demo: { email: 'demo@kisaanmela.com', password: 'demo123' },
  test: { email: 'test@kisaanmela.com', password: 'test123' }
};
