// src/screens/DevFeatureToggle.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import featureFlags from '../config/featureFlags';

const DevFeatureToggleScreen = () => {
  const [flags, setFlags] = useState(featureFlags.getAllFlags());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFlags(featureFlags.getAllFlags());
  }, []);

  const handleToggle = (flag) => {
    featureFlags.toggle(flag);
    setFlags(featureFlags.getAllFlags());
  };

  const handleResetToDefaults = async () => {
    Alert.alert(
      'Reset Feature Flags',
      'Are you sure you want to reset all feature flags to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await featureFlags.resetToDefaults();
            setFlags(featureFlags.getAllFlags());
          },
        },
      ]
    );
  };

  const handleRefreshRemote = async () => {
    setLoading(true);
    try {
      const success = await featureFlags.loadRemoteFlags();
      if (success) {
        setFlags(featureFlags.getAllFlags());
        Alert.alert('Success', 'Remote feature flags refreshed successfully');
      } else {
        Alert.alert('Warning', 'Failed to load remote feature flags');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh remote flags');
    } finally {
      setLoading(false);
    }
  };

  const getFlagDescription = (flag) => {
    const descriptions = {
      AUTH: 'Core authentication system',
      LISTINGS: 'Browse and view animal listings',
      CREATE_LISTING: 'Create new animal listings (requires IMAGE_PICKER)',
      CHAT: 'In-app messaging system (requires AUTH)',
      PAYMENTS: 'Payment processing with Razorpay (requires AUTH, RAZORPAY)',
      TRANSPORT: 'Transport request system (requires AUTH, MAPS)',
      NOTIFICATIONS: 'Push notifications (requires AUTH, FIREBASE)',
      ADMIN: 'Admin panel access (requires AUTH)',
      MAPS: 'Google Maps integration',
      IMAGE_PICKER: 'Image selection and camera access',
      FIREBASE: 'Firebase services integration',
      RAZORPAY: 'Razorpay payment SDK',
    };
    return descriptions[flag] || 'No description available';
  };

  const getFlagStatus = (flag) => {
    const enabled = flags[flag];
    const canEnable = featureFlags.canEnable(flag);
    
    if (enabled) return 'Enabled';
    if (!canEnable) return 'Disabled (dependencies missing)';
    return 'Disabled';
  };

  const getFlagColor = (flag) => {
    const enabled = flags[flag];
    const canEnable = featureFlags.canEnable(flag);
    
    if (enabled) return '#4CAF50';
    if (!canEnable) return '#FF9800';
    return '#666666';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Feature Flags</Text>
        <Text style={styles.subtitle}>Development Feature Toggle</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleRefreshRemote}
          disabled={loading}
        >
          <Text style={styles.actionButtonText}>
            {loading ? 'Refreshing...' : 'Refresh Remote'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={handleResetToDefaults}
        >
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flagsContainer}>
        {Object.keys(flags).map((flag) => (
          <View key={flag} style={styles.flagItem}>
            <View style={styles.flagHeader}>
              <Text style={styles.flagName}>{flag}</Text>
              <Text style={[styles.flagStatus, { color: getFlagColor(flag) }]}>
                {getFlagStatus(flag)}
              </Text>
            </View>
            
            <Text style={styles.flagDescription}>
              {getFlagDescription(flag)}
            </Text>
            
            <View style={styles.flagToggle}>
              <Switch
                value={flags[flag]}
                onValueChange={() => handleToggle(flag)}
                disabled={!featureFlags.canEnable(flag) && !flags[flag]}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={flags[flag] ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Changes are saved automatically. Restart the app to see full effects.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#FF5722',
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  flagsContainer: {
    padding: 20,
  },
  flagItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flagName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  flagStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  flagDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
    lineHeight: 18,
  },
  flagToggle: {
    alignItems: 'flex-end',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default DevFeatureToggleScreen;
