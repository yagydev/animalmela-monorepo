// src/utils/lazyLoad.js
import { useState, useEffect } from 'react';

// Lazy load a module with error handling and loading state
export async function lazyLoad(modulePath) {
  try {
    console.log(`Lazy loading module: ${modulePath}`);
    const startTime = Date.now();
    
    const module = await import(modulePath);
    const loadTime = Date.now() - startTime;
    
    console.log(`Module ${modulePath} loaded in ${loadTime}ms`);
    
    return module.default || module;
  } catch (error) {
    console.error(`Failed to lazy load module ${modulePath}:`, error);
    throw error;
  }
}

// React hook for lazy loading components
export function useLazyComponent(modulePath, enabled = true) {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    lazyLoad(modulePath)
      .then((LoadedComponent) => {
        setComponent(() => LoadedComponent);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [modulePath, enabled]);

  return { Component, loading, error };
}

// Preload modules in background
export function preloadModules(modulePaths) {
  return Promise.allSettled(
    modulePaths.map(path => lazyLoad(path))
  );
}

// Heavy modules that should be lazy loaded
export const HEAVY_MODULES = {
  MAPS: () => import('react-native-maps'),
  FIREBASE_MESSAGING: () => import('@react-native-firebase/messaging'),
  RAZORPAY: () => import('razorpay-react-native'),
  IMAGE_PICKER: () => import('react-native-image-picker'),
  CAMERA: () => import('expo-camera'),
  LOCATION: () => import('expo-location'),
  NOTIFICATIONS: () => import('expo-notifications'),
};

// Feature-specific module bundles
export const FEATURE_MODULES = {
  CHAT: [
    () => import('@react-native-firebase/messaging'),
    () => import('react-native-image-picker'),
  ],
  PAYMENTS: [
    () => import('razorpay-react-native'),
  ],
  TRANSPORT: [
    () => import('react-native-maps'),
    () => import('expo-location'),
  ],
  CREATE_LISTING: [
    () => import('react-native-image-picker'),
    () => import('expo-camera'),
  ],
  NOTIFICATIONS: [
    () => import('@react-native-firebase/messaging'),
    () => import('expo-notifications'),
  ],
};

// Load modules for a specific feature
export async function loadFeatureModules(feature) {
  const modules = FEATURE_MODULES[feature] || [];
  if (modules.length === 0) return [];

  console.log(`Loading modules for feature: ${feature}`);
  const startTime = Date.now();

  try {
    const results = await Promise.allSettled(
      modules.map(moduleLoader => moduleLoader())
    );

    const loadTime = Date.now() - startTime;
    console.log(`Feature ${feature} modules loaded in ${loadTime}ms`);

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
  } catch (error) {
    console.error(`Failed to load modules for feature ${feature}:`, error);
    return [];
  }
}
