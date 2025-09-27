// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';

interface Settings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  language: string;
  privacy: {
    showPhone: boolean;
    showLocation: boolean;
    showEmail: boolean;
  };
  theme: string;
}

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false,
    },
    language: 'en',
    privacy: {
      showPhone: false,
      showLocation: true,
      showEmail: false,
    },
    theme: 'light',
  });

  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Load settings from API
      // const response = await SettingsAPI.getSettings();
      // setSettings(response.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      // TODO: Update settings via API
      // await SettingsAPI.updateSettings(updatedSettings);
      
      Alert.alert('Success', 'Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings');
    }
  };

  const handleNotificationToggle = (key: keyof Settings['notifications']) => {
    const newNotifications = {
      ...settings.notifications,
      [key]: !settings.notifications[key],
    };
    updateSettings({ notifications: newNotifications });
  };

  const handlePrivacyToggle = (key: keyof Settings['privacy']) => {
    const newPrivacy = {
      ...settings.privacy,
      [key]: !settings.privacy[key],
    };
    updateSettings({ privacy: newPrivacy });
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => updateSettings({ language: 'en' }) },
        { text: 'Hindi', onPress: () => updateSettings({ language: 'hi' }) },
        { text: 'Telugu', onPress: () => updateSettings({ language: 'te' }) },
        { text: 'Tamil', onPress: () => updateSettings({ language: 'ta' }) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Select Theme',
      'Choose your preferred theme',
      [
        { text: 'Light', onPress: () => updateSettings({ theme: 'light' }) },
        { text: 'Dark', onPress: () => updateSettings({ theme: 'dark' }) },
        { text: 'Auto', onPress: () => updateSettings({ theme: 'auto' }) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderSettingItem = (
    title: string,
    icon: string,
    rightComponent: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={24} color="#3B82F6" />
        </View>
        <Text style={styles.settingText}>{title}</Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const renderSwitch = (value: boolean, onValueChange: () => void) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
      thumbColor="#FFFFFF"
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Settings" showBackButton={true} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          {renderSettingItem(
            'Email Notifications',
            'email',
            renderSwitch(settings.notifications.email, () => handleNotificationToggle('email'))
          )}
          
          {renderSettingItem(
            'SMS Notifications',
            'sms',
            renderSwitch(settings.notifications.sms, () => handleNotificationToggle('sms'))
          )}
          
          {renderSettingItem(
            'Push Notifications',
            'notifications',
            renderSwitch(settings.notifications.push, () => handleNotificationToggle('push'))
          )}
          
          {renderSettingItem(
            'Marketing Notifications',
            'campaign',
            renderSwitch(settings.notifications.marketing, () => handleNotificationToggle('marketing'))
          )}
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          {renderSettingItem(
            'Show Phone Number',
            'phone',
            renderSwitch(settings.privacy.showPhone, () => handlePrivacyToggle('showPhone'))
          )}
          
          {renderSettingItem(
            'Show Location',
            'location-on',
            renderSwitch(settings.privacy.showLocation, () => handlePrivacyToggle('showLocation'))
          )}
          
          {renderSettingItem(
            'Show Email',
            'email',
            renderSwitch(settings.privacy.showEmail, () => handlePrivacyToggle('showEmail'))
          )}
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          {renderSettingItem(
            'Language',
            'language',
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>
                {settings.language === 'en' ? 'English' : 
                 settings.language === 'hi' ? 'Hindi' :
                 settings.language === 'te' ? 'Telugu' :
                 settings.language === 'ta' ? 'Tamil' : 'English'}
              </Text>
              <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </View>,
            handleLanguageChange
          )}
          
          {renderSettingItem(
            'Theme',
            'palette',
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>
                {settings.theme === 'light' ? 'Light' :
                 settings.theme === 'dark' ? 'Dark' : 'Auto'}
              </Text>
              <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </View>,
            handleThemeChange
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderSettingItem(
            'Change Password',
            'lock',
            <Icon name="chevron-right" size={24} color="#9CA3AF" />,
            () => Alert.alert('Coming Soon', 'Password change functionality will be available soon')
          )}
          
          {renderSettingItem(
            'Delete Account',
            'delete',
            <Icon name="chevron-right" size={24} color="#EF4444" />,
            () => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => {
                    // TODO: Implement delete account
                    Alert.alert('Coming Soon', 'Account deletion will be available soon');
                  }}
                ]
              );
            }
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingItem(
            'Help & Support',
            'help',
            <Icon name="chevron-right" size={24} color="#9CA3AF" />,
            () => Alert.alert('Coming Soon', 'Help & support will be available soon')
          )}
          
          {renderSettingItem(
            'Contact Us',
            'contact-support',
            <Icon name="chevron-right" size={24} color="#9CA3AF" />,
            () => Alert.alert('Coming Soon', 'Contact us functionality will be available soon')
          )}
          
          {renderSettingItem(
            'About',
            'info',
            <Icon name="chevron-right" size={24} color="#9CA3AF" />,
            () => Alert.alert('About', 'Pashu Marketplace v1.0.0\n\nYour trusted platform for livestock trading.')
          )}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default SettingsScreen;
