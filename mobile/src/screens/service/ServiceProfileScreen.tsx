// src/screens/service/ServiceProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ServiceProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Service Profile Screen - Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  text: {
    fontSize: 18,
    color: '#6b7280',
  },
});

export default ServiceProfileScreen;
