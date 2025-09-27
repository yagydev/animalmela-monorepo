// src/navigation/AuthStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/auth/LoginScreen';
import OTPScreen from '@/screens/auth/OTPScreen';
import ProfileSetupScreen from '@/screens/auth/ProfileSetupScreen';
import KYCScreen from '@/screens/auth/KYCScreen';

export type AuthStackParamList = {
  Login: undefined;
  OTP: { phone: string };
  ProfileSetup: undefined;
  KYC: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="KYC" component={KYCScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
