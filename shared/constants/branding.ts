// Animall Platform Branding Configuration
// Update these values to customize your platform's branding

export const BRAND_CONFIG = {
  // Company Information
  name: 'Animall',
  fullName: 'Animall - Your Pet\'s Best Friend',
  tagline: 'Your Pet\'s Best Friend',
  description: 'Comprehensive pet services platform for pet sitting, walking, grooming, training, veterinary care, and more.',
  
  // Contact Information
  contact: {
    email: 'hello@animall.com',
    phone: '+1 (555) 123-4567',
    address: '123 Pet Street, Pet City, PC 12345',
    website: 'https://animall.com',
  },
  
  // Social Media Links
  social: {
    facebook: 'https://facebook.com/animall',
    twitter: 'https://twitter.com/animall',
    instagram: 'https://instagram.com/animall',
    linkedin: 'https://linkedin.com/company/animall',
  },
  
  // Color Palette
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Main primary color
      600: '#2563eb',  // Primary hover
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',  // Main secondary color
      600: '#c026d3',  // Secondary hover
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Neutral colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  
  // Typography
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'Menlo, Monaco, Consolas, monospace',
  },
  
  // Logo and Assets
  logo: {
    text: 'A', // Single letter logo
    favicon: '/favicon.ico',
    ogImage: '/images/og-image.jpg',
    appleTouchIcon: '/images/apple-touch-icon.png',
  },
  
  // App Store Information
  appStore: {
    ios: {
      appId: 'your-ios-app-id',
      bundleId: 'com.animall.mobile',
      name: 'Animall - Pet Services',
    },
    android: {
      packageName: 'com.animall.mobile',
      playStoreId: 'your-android-app-id',
    },
  },
  
  // Business Settings
  business: {
    founded: '2024',
    location: 'United States',
    type: 'Pet Services Platform',
    features: [
      'Pet Sitting',
      'Dog Walking', 
      'Pet Grooming',
      'Pet Training',
      'Veterinary Care',
      'Pet Transportation',
    ],
  },
  
  // Platform Statistics (update these with real numbers)
  stats: {
    happyPets: '10,000+',
    trustedSitters: '5,000+',
    servicesCompleted: '50,000+',
    averageRating: '4.9/5',
  },
  
  // SEO and Marketing
  seo: {
    keywords: 'pet services, pet sitting, dog walking, pet grooming, pet training, veterinary care, pet adoption',
    author: 'Animall Team',
    robots: 'index, follow',
  },
};

// Theme configuration for consistent styling
export const THEME_CONFIG = {
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

export default BRAND_CONFIG;
