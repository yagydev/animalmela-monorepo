// src/App.js - Simplified Version for Basic Functionality
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

// Core components
import SplashScreen from './components/SplashScreen';
import { AuthProvider } from './context/AuthContext';
import MinimalNavigator from './navigation/MinimalNavigator';

// Create QueryClient with minimal config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationMessage, setInitializationMessage] = useState('Initializing...');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setInitializationMessage('Loading configuration...');
      
      // Simulate initialization time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setInitializationMessage('Ready!');
      setIsInitialized(true);
    } catch (error) {
      console.error('App initialization failed:', error);
      setIsInitialized(true);
    }
  };

  // Show splash screen during initialization
  if (!isInitialized) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        <SplashScreen message={initializationMessage} />
      </>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <MinimalNavigator />
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;