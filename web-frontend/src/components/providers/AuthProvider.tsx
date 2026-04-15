'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { looksLikeJwt, sanitizeStoredAccessToken } from '@/lib/clientAccessToken';
export interface AuthUser {
  id: string;
  _id: string;
  email: string | null;
  username?: string | null;
  name: string;
  role: string;
  authRole: 'USER' | 'ADMIN';
  isVerified: boolean;
  mobile: string;
  profileComplete?: boolean;
  location?: unknown;
  rating?: number;
  totalRatings?: number;
  avatar?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  sendOTP: (mobile: string) => Promise<{ success: boolean; message?: string; otp?: string; demo?: boolean }>;
  verifyOTP: (mobile: string, otp: string, name?: string, rememberMe?: boolean) => Promise<void>;
  googleLogin: () => Promise<void>;
  facebookLogin: () => Promise<void>;
  isAuthenticated: boolean;
  refreshSession: () => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  mobile: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchAuth(path: string, init?: RequestInit) {
  return fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
}

function persistAccessToken(token?: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    if (!looksLikeJwt(token)) {
      localStorage.removeItem('token');
      return;
    }
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    const res = await fetchAuth('/api/auth/refresh', { method: 'POST', body: JSON.stringify({}) });
    const j = await res.json().catch(() => ({}));
    if (res.ok && j.success && j.data?.accessToken) {
      persistAccessToken(j.data.accessToken);
      return true;
    }
    return false;
  }, []);

  const loadMe = useCallback(async () => {
    if (typeof window !== 'undefined') sanitizeStoredAccessToken();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch('/api/auth/me', {
      credentials: 'include',
      headers,
      cache: 'no-store',
    });
    let data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      const ok = await refreshSession();
      if (ok) {
        const t2 = localStorage.getItem('token');
        const h2: Record<string, string> = {};
        if (t2) h2.Authorization = `Bearer ${t2}`;
        const retry = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: h2,
          cache: 'no-store',
        });
        data = await retry.json().catch(() => ({}));
        if (retry.ok && data.success) {
          setUser(data.data.user as AuthUser);
          return;
        }
      }
      setUser(null);
      persistAccessToken(null);
      return;
    }

    if (data.success && data.data?.user) {
      setUser(data.data.user as AuthUser);
    } else {
      setUser(null);
      persistAccessToken(null);
    }
  }, [refreshSession]);

  const checkAuth = useCallback(async () => {
    try {
      await loadMe();
    } catch (e) {
      console.error('Auth check failed:', e);
      setUser(null);
      persistAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [loadMe]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (identifier: string, password: string, rememberMe = false) => {
    const response = await fetchAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login: identifier.trim(), password, rememberMe }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    persistAccessToken(data.data.accessToken || data.data.token);
    setUser(data.data.user as AuthUser);
  };

  const register = async (userData: RegisterData) => {
    const response = await fetchAuth('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        mobile: userData.mobile,
        role: userData.role,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }
    persistAccessToken(data.data.accessToken || data.data.token);
    setUser(data.data.user as AuthUser);
  };

  const logout = async () => {
    try {
      await fetchAuth('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    } catch (e) {
      console.error('Logout API call failed:', e);
    } finally {
      persistAccessToken(null);
      setUser(null);
      router.push('/');
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok || !responseData.success) {
      throw new Error(responseData.error || responseData.message || 'Profile update failed');
    }
    setUser(responseData.user);
  };

  const sendOTP = async (mobile: string) => {
    const response = await fetchAuth('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: mobile.replace(/\D/g, '').slice(-10) }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false as const,
        message: data.message || data.error || 'Failed to send OTP',
      };
    }
    return {
      success: true as const,
      message: data.message,
      otp: data.data?.otp as string | undefined,
      demo: data.data?.demo as boolean | undefined,
    };
  };

  const verifyOTP = async (
    mobile: string,
    otp: string,
    name?: string,
    rememberMe = false
  ) => {
    const response = await fetchAuth('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        phone: mobile.replace(/\D/g, '').slice(-10),
        otp,
        name,
        rememberMe,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Invalid OTP');
    }
    persistAccessToken(data.data.accessToken || data.data.token);
    setUser(data.data.user as AuthUser);
  };

  const googleLogin = async () => {
    throw new Error('Google login not implemented yet');
  };

  const facebookLogin = async () => {
    throw new Error('Facebook login not implemented yet');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    sendOTP,
    verifyOTP,
    googleLogin,
    facebookLogin,
    isAuthenticated: !!user,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
