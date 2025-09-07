// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/context/AuthContext';

// Buyer Screens
import HomeScreen from '@/screens/buyer/HomeScreen';
import OrdersScreen from '@/screens/buyer/OrdersScreen';
import ChatScreen from '@/screens/buyer/ChatScreen';
import ProfileScreen from '@/screens/buyer/ProfileScreen';

// Seller Screens
import SellerListingsScreen from '@/screens/seller/SellerListingsScreen';
import CreateListingScreen from '@/screens/seller/CreateListingScreen';
import SellerLeadsScreen from '@/screens/seller/SellerLeadsScreen';
import SellerProfileScreen from '@/screens/seller/SellerProfileScreen';

// Service Partner Screens
import ServiceJobsScreen from '@/screens/service/ServiceJobsScreen';
import ServiceProfileScreen from '@/screens/service/ServiceProfileScreen';

export type MainTabsParamList = {
  // Buyer Tabs
  Home: undefined;
  Orders: undefined;
  Chat: undefined;
  Profile: undefined;
  
  // Seller Tabs
  SellerListings: undefined;
  CreateListing: undefined;
  SellerLeads: undefined;
  SellerProfile: undefined;
  
  // Service Tabs
  ServiceJobs: undefined;
  ServiceProfile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TabBarIcon: React.FC<{
  name: string;
  color: string;
  size: number;
  focused: boolean;
}> = ({ name, color, size, focused }) => {
  return (
    <View className={`items-center justify-center ${focused ? 'bg-primary-100 rounded-lg px-2 py-1' : ''}`}>
      <Icon name={name} size={size} color={color} />
    </View>
  );
};

const MainTabs: React.FC = () => {
  const { user } = useAuth();

  const getTabScreens = () => {
    switch (user?.role) {
      case 'seller':
        return (
          <>
            <Tab.Screen
              name="SellerListings"
              component={SellerListingsScreen}
              options={{
                title: 'My Listings',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="pets" color={color} size={size} focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="CreateListing"
              component={CreateListingScreen}
              options={{
                title: 'Create',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="add-circle" color={color} size={size} focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="SellerLeads"
              component={SellerLeadsScreen}
              options={{
                title: 'Leads',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="trending-up" color={color} size={size} focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="SellerProfile"
              component={SellerProfileScreen}
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="person" color={color} size={size} focused={focused} />
                ),
              }}
            />
          </>
        );

      case 'service_partner':
        return (
          <>
            <Tab.Screen
              name="ServiceJobs"
              component={ServiceJobsScreen}
              options={{
                title: 'Jobs',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="work" color={color} size={size} focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="ServiceProfile"
              component={ServiceProfileScreen}
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="person" color={color} size={size} focused={focused} />
                ),
              }}
            />
          </>
        );

      default: // buyer
        return (
          <>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Discover',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="home" color={color} size={size} focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="Orders"
              component={OrdersScreen}
              options={{
                title: 'Orders',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="shopping-cart" color={color} size={size} focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                title: 'Chat',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="chat" color={color} size={size} focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: 'Profile',
                tabBarIcon: ({ color, size, focused }) => (
                  <TabBarIcon name="person" color={color} size={size} focused={focused} />
                ),
              }}
            />
          </>
        );
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {getTabScreens()}
    </Tab.Navigator>
  );
};

export default MainTabs;
