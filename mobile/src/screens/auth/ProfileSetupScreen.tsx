// src/screens/auth/ProfileSetupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@/context/AuthContext';
import { AuthStackParamList } from '@/navigation/AuthStack';

type ProfileSetupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ProfileSetup'>;

const ProfileSetupScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'buyer' as 'buyer' | 'seller' | 'service_partner',
    userType: 'buyer' as 'transporter' | 'vet' | 'insurance' | 'farmer' | 'buyer',
    location: {
      address: '',
      city: '',
      state: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const { completeProfile } = useAuth();

  const handleCompleteProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.location.address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return;
    }

    if (!formData.location.city.trim()) {
      Alert.alert('Error', 'Please enter your city');
      return;
    }

    if (!formData.location.state.trim()) {
      Alert.alert('Error', 'Please enter your state');
      return;
    }

    setIsLoading(true);
    const success = await completeProfile(formData);
    setIsLoading(false);

    if (success) {
      if (formData.role === 'seller') {
        navigation.navigate('KYC');
      }
      // For buyers and service partners, navigation will be handled by AuthContext
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateLocation = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const getRoleOptions = () => {
    return [
      { value: 'buyer', label: 'Buyer', description: 'Looking to buy livestock' },
      { value: 'seller', label: 'Seller', description: 'Want to sell livestock' },
      { value: 'service_partner', label: 'Service Partner', description: 'Provide transport, vet, or insurance services' },
    ];
  };

  const getServiceTypeOptions = () => {
    if (formData.role !== 'service_partner') return [];
    
    return [
      { value: 'transporter', label: 'Transporter', description: 'Transport livestock' },
      { value: 'vet', label: 'Veterinarian', description: 'Provide veterinary services' },
      { value: 'insurance', label: 'Insurance Provider', description: 'Provide insurance services' },
    ];
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#0ea5e9', '#3b82f6', '#7c3aed']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Icon name="person-add" size={24} color="#ffffff" />
              </View>
              <Text style={styles.logoTitle}>Complete Profile</Text>
            </View>
            <Text style={styles.welcomeText}>Tell us about yourself</Text>
            <Text style={styles.subtitleText}>This helps us personalize your experience</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <Icon name="person" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                />
              </View>
            </View>

            {/* Role Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>I want to *</Text>
              {getRoleOptions().map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData.role === option.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => updateFormData('role', option.value)}
                >
                  <View style={styles.optionContent}>
                    <Text style={[
                      styles.optionLabel,
                      formData.role === option.value && styles.optionLabelSelected,
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.optionDescription,
                      formData.role === option.value && styles.optionDescriptionSelected,
                    ]}>
                      {option.description}
                    </Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    formData.role === option.value && styles.radioButtonSelected,
                  ]}>
                    {formData.role === option.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Service Type (for service partners) */}
            {formData.role === 'service_partner' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Service Type *</Text>
                {getServiceTypeOptions().map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      formData.userType === option.value && styles.optionButtonSelected,
                    ]}
                    onPress={() => updateFormData('userType', option.value)}
                  >
                    <View style={styles.optionContent}>
                      <Text style={[
                        styles.optionLabel,
                        formData.userType === option.value && styles.optionLabelSelected,
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={[
                        styles.optionDescription,
                        formData.userType === option.value && styles.optionDescriptionSelected,
                      ]}>
                        {option.description}
                      </Text>
                    </View>
                    <View style={[
                      styles.radioButton,
                      formData.userType === option.value && styles.radioButtonSelected,
                    ]}>
                      {formData.userType === option.value && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location *</Text>
              
              <View style={styles.inputWrapper}>
                <Icon name="location-on" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Address"
                  placeholderTextColor="#9ca3af"
                  value={formData.location.address}
                  onChangeText={(value) => updateLocation('address', value)}
                />
              </View>
              
              <View style={[styles.inputWrapper, styles.inputWrapperMargin]}>
                <Icon name="location-city" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="City"
                  placeholderTextColor="#9ca3af"
                  value={formData.location.city}
                  onChangeText={(value) => updateLocation('city', value)}
                />
              </View>
              
              <View style={[styles.inputWrapper, styles.inputWrapperMargin]}>
                <Icon name="map" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="State"
                  placeholderTextColor="#9ca3af"
                  value={formData.location.state}
                  onChangeText={(value) => updateLocation('state', value)}
                />
              </View>
            </View>

            {/* Complete Button */}
            <TouchableOpacity
              style={[styles.completeButton, isLoading && styles.completeButtonDisabled]}
              onPress={handleCompleteProfile}
              disabled={isLoading}
            >
              <Text style={styles.completeButtonText}>
                {isLoading ? 'Setting up...' : 'Complete Setup'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
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
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputWrapperMargin: {
    marginTop: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionButtonSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#0ea5e9',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#0ea5e9',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionDescriptionSelected: {
    color: '#0369a1',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#0ea5e9',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0ea5e9',
  },
  completeButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
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
});

export default ProfileSetupScreen;
