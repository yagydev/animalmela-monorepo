// src/navigation/FullNavigator.js
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import featureFlags from '../config/featureFlags';
import { loadFeatureModules } from '../utils/lazyLoad';

// Core screens (always loaded)
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import KYCScreen from '../screens/auth/KYCScreen';
import HomeScreen from '../screens/buyer/HomeScreen';
import ProfileScreen from '../screens/buyer/ProfileScreen';
import LoadingScreen from '../screens/LoadingScreen';

// Lazy-loaded screens
const ListingDetailScreen = React.lazy(() => import('../screens/ListingDetailScreen'));
const PaymentScreen = React.lazy(() => import('../screens/PaymentScreen'));
const TransportRequestScreen = React.lazy(() => import('../screens/TransportRequestScreen'));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Lazy-loaded tab screens
const ChatScreen = React.lazy(() => import('../screens/buyer/ChatScreen'));
const OrdersScreen = React.lazy(() => import('../screens/buyer/OrdersScreen'));
const SellerListingsScreen = React.lazy(() => import('../screens/seller/SellerListingsScreen'));
const CreateListingScreen = React.lazy(() => import('../screens/seller/CreateListingScreen'));
const SellerLeadsScreen = React.lazy(() => import('../screens/seller/SellerLeadsScreen'));
const ServiceJobsScreen = React.lazy(() => import('../screens/service/ServiceJobsScreen'));

const FullNavigator = () => {
  const { user, isLoading } = useAuth();
  const [loadedFeatures, setLoadedFeatures] = useState(new Set());

  useEffect(() => {
    // Load modules for enabled features
    const loadEnabledFeatures = async () => {
      const enabledFeatures = Object.keys(featureFlags.getAllFlags())
        .filter(flag => featureFlags.isEnabled(flag));

      for (const feature of enabledFeatures) {
        try {
          await loadFeatureModules(feature);
          setLoadedFeatures(prev => new Set([...prev, feature]));
        } catch (error) {
          console.error(`Failed to load feature ${feature}:`, error);
        }
      }
    };

    loadEnabledFeatures();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const MainTabs = () => {
    const tabs = [];

    // Home tab (always present)
    tabs.push(
      <Tab.Screen
        key="Home"
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />
    );

    // Chat tab (if enabled)
    if (featureFlags.isEnabled('CHAT') && loadedFeatures.has('CHAT')) {
      tabs.push(
        <Tab.Screen
          key="Chat"
          name="Chat"
          component={ChatScreen}
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }) => <Text style={{ color }}>💬</Text>,
          }}
        />
      );
    }

    // Orders tab (if enabled)
    if (featureFlags.isEnabled('PAYMENTS') && loadedFeatures.has('PAYMENTS')) {
      tabs.push(
        <Tab.Screen
          key="Orders"
          name="Orders"
          component={OrdersScreen}
          options={{
            title: 'Orders',
            tabBarIcon: ({ color }) => <Text style={{ color }}>📦</Text>,
          }}
        />
      );
    }

    // Seller tabs (if user is seller)
    if (user?.role === 'seller') {
      if (featureFlags.isEnabled('CREATE_LISTING') && loadedFeatures.has('CREATE_LISTING')) {
        tabs.push(
          <Tab.Screen
            key="MyListings"
            name="MyListings"
            component={SellerListingsScreen}
            options={{
              title: 'My Listings',
              tabBarIcon: ({ color }) => <Text style={{ color }}>📋</Text>,
            }}
          />
        );
      }
    }

    // Service partner tabs (if user is service partner)
    if (user?.role === 'service') {
      if (featureFlags.isEnabled('TRANSPORT') && loadedFeatures.has('TRANSPORT')) {
        tabs.push(
          <Tab.Screen
            key="Jobs"
            name="Jobs"
            component={ServiceJobsScreen}
            options={{
              title: 'Jobs',
              tabBarIcon: ({ color }) => <Text style={{ color }}>🚚</Text>,
            }}
          />
        );
      }
    }

    // Profile tab (always present)
    tabs.push(
      <Tab.Screen
        key="Profile"
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
        }}
      />
    );

    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#666666',
        }}
      >
        {tabs}
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="KYC" component={KYCScreen} />
          </>
        ) : (
          // Main Stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            
            {/* Lazy-loaded detail screens */}
            <Stack.Screen 
              name="ListingDetail" 
              component={ListingDetailScreen}
              options={{ title: 'Animal Details' }}
            />
            
            {featureFlags.isEnabled('PAYMENTS') && loadedFeatures.has('PAYMENTS') && (
              <Stack.Screen 
                name="Payment" 
                component={PaymentScreen}
                options={{ title: 'Payment' }}
              />
            )}
            
            {featureFlags.isEnabled('TRANSPORT') && loadedFeatures.has('TRANSPORT') && (
              <Stack.Screen 
                name="TransportRequest" 
                component={TransportRequestScreen}
                options={{ title: 'Transport Request' }}
              />
            )}
            
            {featureFlags.isEnabled('CREATE_LISTING') && loadedFeatures.has('CREATE_LISTING') && (
              <Stack.Screen 
                name="CreateListing" 
                component={CreateListingScreen}
                options={{ title: 'Create Listing' }}
              />
            )}
            
            {featureFlags.isEnabled('CREATE_LISTING') && loadedFeatures.has('CREATE_LISTING') && (
              <Stack.Screen 
                name="SellerLeads" 
                component={SellerLeadsScreen}
                options={{ title: 'Leads' }}
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default FullNavigator;
