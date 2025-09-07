// src/App.js - Minimal Bootstrap Version
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

// Minimal imports for fast cold start
import SplashScreen from './components/SplashScreen';
import MinimalNavigator from './navigation/MinimalNavigator';
import FullNavigator from './navigation/FullNavigator';
import { AuthProvider } from './context/AuthContext';
import featureFlags from './config/featureFlags';
import { preloadModules, FEATURE_MODULES } from './utils/lazyLoad';

// Create QueryClient with minimal config for fast start
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reduced retries for faster failure
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMinimalMode, setIsMinimalMode] = useState(true);
  const [initializationMessage, setInitializationMessage] = useState('Initializing...');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Step 1: Initialize feature flags (fast)
      setInitializationMessage('Loading configuration...');
      await featureFlags.initialize();

      // Step 2: Load remote feature flags (non-blocking)
      setInitializationMessage('Syncing features...');
      const remoteLoaded = await featureFlags.loadRemoteFlags();
      
      if (remoteLoaded) {
        console.log('Remote feature flags loaded successfully');
      }

      // Step 3: Show minimal UI immediately
      setIsInitialized(true);
      setInitializationMessage('Ready!');

      // Step 4: Start lazy loading heavy modules in background
      setTimeout(() => {
        preloadHeavyModules();
      }, 100);

    } catch (error) {
      console.error('App initialization failed:', error);
      // Still show the app even if initialization fails
      setIsInitialized(true);
    }
  };

  const preloadHeavyModules = async () => {
    try {
      setInitializationMessage('Loading features...');
      
      // Preload modules for enabled features
      const enabledFeatures = Object.keys(featureFlags.getAllFlags())
        .filter(flag => featureFlags.isEnabled(flag));

      const modulePromises = enabledFeatures
        .map(feature => FEATURE_MODULES[feature] || [])
        .flat()
        .map(moduleLoader => moduleLoader());

      if (modulePromises.length > 0) {
        await Promise.allSettled(modulePromises);
      }

      // Switch to full mode after modules are loaded
      setTimeout(() => {
        setIsMinimalMode(false);
        console.log('Switched to full navigation mode');
      }, 500);

    } catch (error) {
      console.error('Failed to preload modules:', error);
      // Still switch to full mode
      setIsMinimalMode(false);
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

  // Render appropriate navigator based on mode
  const Navigator = isMinimalMode ? MinimalNavigator : FullNavigator;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Navigator />
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
