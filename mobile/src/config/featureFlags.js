// src/config/featureFlags.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default feature flags - conservative approach for fast cold start
const DEFAULT_FLAGS = {
  AUTH: true,
  LISTINGS: true,
  CREATE_LISTING: false,
  CHAT: false,
  PAYMENTS: false,
  TRANSPORT: false,
  NOTIFICATIONS: false,
  ADMIN: false,
  MAPS: false,
  IMAGE_PICKER: false,
  FIREBASE: false,
  RAZORPAY: false,
};

// Local storage key for feature flags
const FEATURE_FLAGS_KEY = 'feature_flags';

class FeatureFlags {
  constructor() {
    this.flags = { ...DEFAULT_FLAGS };
    this.remoteLoaded = false;
  }

  // Initialize flags from local storage
  async initialize() {
    try {
      const storedFlags = await AsyncStorage.getItem(FEATURE_FLAGS_KEY);
      if (storedFlags) {
        const parsedFlags = JSON.parse(storedFlags);
        this.flags = { ...DEFAULT_FLAGS, ...parsedFlags };
      }
    } catch (error) {
      console.warn('Failed to load feature flags from storage:', error);
    }
  }

  // Load remote feature flags
  async loadRemoteFlags() {
    try {
      const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_BASE_URL}/config/features`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 second timeout
      });

      if (response.ok) {
        const remoteFlags = await response.json();
        this.flags = { ...this.flags, ...remoteFlags };
        this.remoteLoaded = true;
        
        // Store updated flags locally
        await AsyncStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(this.flags));
        
        console.log('Remote feature flags loaded:', remoteFlags);
        return true;
      }
    } catch (error) {
      console.warn('Failed to load remote feature flags:', error);
    }
    return false;
  }

  // Check if a feature is enabled
  isEnabled(feature) {
    return Boolean(this.flags[feature]);
  }

  // Enable a feature (for debug purposes)
  enable(feature) {
    this.flags[feature] = true;
    this.saveFlags();
  }

  // Disable a feature (for debug purposes)
  disable(feature) {
    this.flags[feature] = false;
    this.saveFlags();
  }

  // Toggle a feature (for debug purposes)
  toggle(feature) {
    this.flags[feature] = !this.flags[feature];
    this.saveFlags();
  }

  // Get all flags
  getAllFlags() {
    return { ...this.flags };
  }

  // Save flags to local storage
  async saveFlags() {
    try {
      await AsyncStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(this.flags));
    } catch (error) {
      console.warn('Failed to save feature flags:', error);
    }
  }

  // Reset to defaults
  async resetToDefaults() {
    this.flags = { ...DEFAULT_FLAGS };
    await this.saveFlags();
  }

  // Get feature dependencies
  getDependencies(feature) {
    const dependencies = {
      CREATE_LISTING: ['LISTINGS', 'IMAGE_PICKER'],
      CHAT: ['AUTH'],
      PAYMENTS: ['AUTH', 'RAZORPAY'],
      TRANSPORT: ['AUTH', 'MAPS'],
      NOTIFICATIONS: ['AUTH', 'FIREBASE'],
      ADMIN: ['AUTH'],
      MAPS: [],
      IMAGE_PICKER: [],
      FIREBASE: [],
      RAZORPAY: [],
    };

    return dependencies[feature] || [];
  }

  // Check if all dependencies are enabled
  canEnable(feature) {
    const dependencies = this.getDependencies(feature);
    return dependencies.every(dep => this.isEnabled(dep));
  }
}

// Create singleton instance
const featureFlags = new FeatureFlags();

export default featureFlags;

// Export individual flag checkers for convenience
export const isAuthEnabled = () => featureFlags.isEnabled('AUTH');
export const isListingsEnabled = () => featureFlags.isEnabled('LISTINGS');
export const isCreateListingEnabled = () => featureFlags.isEnabled('CREATE_LISTING');
export const isChatEnabled = () => featureFlags.isEnabled('CHAT');
export const isPaymentsEnabled = () => featureFlags.isEnabled('PAYMENTS');
export const isTransportEnabled = () => featureFlags.isEnabled('TRANSPORT');
export const isNotificationsEnabled = () => featureFlags.isEnabled('NOTIFICATIONS');
export const isAdminEnabled = () => featureFlags.isEnabled('ADMIN');
export const isMapsEnabled = () => featureFlags.isEnabled('MAPS');
export const isImagePickerEnabled = () => featureFlags.isEnabled('IMAGE_PICKER');
export const isFirebaseEnabled = () => featureFlags.isEnabled('FIREBASE');
export const isRazorpayEnabled = () => featureFlags.isEnabled('RAZORPAY');
