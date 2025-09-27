// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import AuthAPI from '@/api/auth';
import { User, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string, name?: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>;
  facebookLogin: () => Promise<boolean>;
  completeProfile: (profileData: any) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await AuthAPI.sendOTP(phone);
      
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Please check your phone for the OTP.',
        });
        return true;
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      
      // Enhanced error handling with specific error messages
      let errorMessage = 'Please try again.';
      
      if (error.message) {
        if (error.message.includes('Invalid phone') || error.message.includes('invalid')) {
          errorMessage = 'Please enter a valid mobile number.';
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait before trying again.';
        } else if (error.message.includes('blocked')) {
          errorMessage = 'This number is temporarily blocked. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Toast.show({
        type: 'error',
        text1: 'OTP Failed',
        text2: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phone: string, otp: string, name?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response: AuthResponse = await AuthAPI.verifyOTP(phone, otp, name);
      
      if (response.success) {
        setUser(response.user);
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: 'You have successfully logged in.',
        });
        
        return true;
      } else {
        throw new Error(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      
      // Enhanced error handling with specific error messages
      let errorMessage = 'Please check your OTP and try again.';
      
      if (error.message) {
        if (error.message.includes('Invalid OTP') || error.message.includes('expired')) {
          errorMessage = 'Invalid or expired OTP. Please request a new one.';
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many attempts. Please wait before trying again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would use Google Sign-In SDK
      // For now, we'll simulate the login process
      const response: AuthResponse = await AuthAPI.googleLogin({
        googleId: 'mock_google_id',
        email: 'user@gmail.com',
        name: 'Google User',
        profilePic: 'https://via.placeholder.com/150'
      });
      
      if (response.success) {
        setUser(response.user);
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: 'You have successfully logged in with Google.',
        });
        
        return true;
      } else {
        throw new Error(response.message || 'Google login failed');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Google Login Failed',
        text2: error.message || 'Please try again.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const facebookLogin = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would use Facebook Login SDK
      // For now, we'll simulate the login process
      const response: AuthResponse = await AuthAPI.facebookLogin({
        facebookId: 'mock_facebook_id',
        email: 'user@facebook.com',
        name: 'Facebook User',
        profilePic: 'https://via.placeholder.com/150'
      });
      
      if (response.success) {
        setUser(response.user);
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: 'You have successfully logged in with Facebook.',
        });
        
        return true;
      } else {
        throw new Error(response.message || 'Facebook login failed');
      }
    } catch (error: any) {
      console.error('Facebook login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Facebook Login Failed',
        text2: error.message || 'Please try again.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async (profileData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await AuthAPI.completeProfile(profileData);
      
      if (response.success) {
        setUser(response.user);
        
        Toast.show({
          type: 'success',
          text1: 'Profile Complete',
          text2: 'Your profile has been set up successfully.',
        });
        
        return true;
      } else {
        throw new Error('Failed to complete profile');
      }
    } catch (error: any) {
      console.error('Complete profile error:', error);
      Toast.show({
        type: 'error',
        text1: 'Profile Setup Failed',
        text2: error.message || 'Please try again.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) return;

      const response = await AuthAPI.updateProfile(userData);

      if (response.success) {
        setUser(response.user);
        
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
          text2: 'Your profile has been updated successfully.',
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Please try again.',
      });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      await AuthAPI.logout();
      setUser(null);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await AuthAPI.getCurrentUser();
      setUser(response);
      await AsyncStorage.setItem('user', JSON.stringify(response));
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    sendOTP,
    verifyOTP,
    googleLogin,
    facebookLogin,
    completeProfile,
    updateProfile,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
