// src/screens/auth/KYCScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/navigation/AuthStack';

type KYCScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'KYC'>;

const KYCScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState({
    aadhaar: null,
    pan: null,
    farmLocation: null,
  });
  
  const navigation = useNavigation<KYCScreenNavigationProp>();

  const handleDocumentUpload = (type: 'aadhaar' | 'pan' | 'farmLocation') => {
    // TODO: Implement document picker
    Alert.alert('Document Upload', `${type} upload functionality will be implemented`);
  };

  const handleCompleteKYC = async () => {
    if (!documents.aadhaar || !documents.pan || !documents.farmLocation) {
      Alert.alert('Error', 'Please upload all required documents');
      return;
    }

    setIsLoading(true);
    
    // TODO: Implement KYC submission
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'KYC Submitted',
        'Your documents have been submitted for verification. You will be notified once verified.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigation will be handled by AuthContext
            },
          },
        ]
      );
    }, 2000);
  };

  const kycSteps = [
    {
      id: 'aadhaar',
      title: 'Aadhaar Card',
      description: 'Upload front and back of your Aadhaar card',
      icon: 'credit-card',
      required: true,
    },
    {
      id: 'pan',
      title: 'PAN Card',
      description: 'Upload your PAN card for tax verification',
      icon: 'account-balance',
      required: true,
    },
    {
      id: 'farmLocation',
      title: 'Farm Location',
      description: 'Upload farm registration or location proof',
      icon: 'location-on',
      required: true,
    },
  ];

  return (
    <LinearGradient
      colors={['#0ea5e9', '#3b82f6', '#7c3aed']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="verified-user" size={24} color="#ffffff" />
            </View>
            <Text style={styles.logoTitle}>KYC Verification</Text>
          </View>
          
          <Text style={styles.welcomeText}>Complete Your Verification</Text>
          <Text style={styles.subtitleText}>
            Upload your documents to start selling livestock
          </Text>
        </View>

        {/* KYC Steps */}
        <View style={styles.formContainer}>
          {kycSteps.map((step) => (
            <TouchableOpacity
              key={step.id}
              style={styles.stepCard}
              onPress={() => handleDocumentUpload(step.id as any)}
            >
              <View style={styles.stepIcon}>
                <Icon name={step.icon} size={24} color="#0ea5e9" />
              </View>
              
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  {step.required && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>Required</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.stepDescription}>{step.description}</Text>
                
                {documents[step.id as keyof typeof documents] ? (
                  <View style={styles.uploadedBadge}>
                    <Icon name="check-circle" size={16} color="#10b981" />
                    <Text style={styles.uploadedText}>Uploaded</Text>
                  </View>
                ) : (
                  <View style={styles.uploadBadge}>
                    <Icon name="cloud-upload" size={16} color="#6b7280" />
                    <Text style={styles.uploadText}>Tap to Upload</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Complete Button */}
          <TouchableOpacity
            style={[styles.completeButton, isLoading && styles.completeButtonDisabled]}
            onPress={handleCompleteKYC}
            disabled={isLoading}
          >
            <Text style={styles.completeButtonText}>
              {isLoading ? 'Submitting...' : 'Submit for Verification'}
            </Text>
          </TouchableOpacity>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Icon name="info" size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              Your documents will be verified within 24-48 hours. You can start using the app while verification is in progress.
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  stepIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#eff6ff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  requiredBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  requiredText: {
    fontSize: 10,
    color: '#d97706',
    fontWeight: '500',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  uploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadedText: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 4,
    fontWeight: '500',
  },
  uploadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    lineHeight: 16,
  },
});

export default KYCScreen;
