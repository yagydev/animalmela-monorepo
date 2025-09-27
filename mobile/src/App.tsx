import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '@/context/AuthContext';
import AppNavigator from '@/navigation/AppNavigator';
import { BRAND_CONFIG } from '../../shared/constants/branding';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={BRAND_CONFIG?.colors?.primary?.[500] || "#3b82f6"} 
        />
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
