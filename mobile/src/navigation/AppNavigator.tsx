// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@/context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import LoadingScreen from '@/screens/LoadingScreen';

// Detail Screens
import ListingDetailScreen from '@/screens/ListingDetailScreen';
import ChatDetailScreen from '@/screens/ChatDetailScreen';
import PaymentScreen from '@/screens/PaymentScreen';
import TransportRequestScreen from '@/screens/TransportRequestScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Loading: undefined;
  ListingDetail: { listingId: string };
  ChatDetail: { conversationId: string };
  Payment: { orderId: string; amount: number };
  TransportRequest: { orderId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="ListingDetail"
              component={ListingDetailScreen}
              options={{
                headerShown: true,
                title: 'Listing Details',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="ChatDetail"
              component={ChatDetailScreen}
              options={{
                headerShown: true,
                title: 'Chat',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{
                headerShown: true,
                title: 'Payment',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="TransportRequest"
              component={TransportRequestScreen}
              options={{
                headerShown: true,
                title: 'Transport Request',
                headerBackTitle: 'Back',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
