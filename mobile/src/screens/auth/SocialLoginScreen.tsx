// src/screens/auth/SocialLoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@/context/AuthContext';
import { AuthStackParamList } from '@/navigation/AuthStack';

type SocialLoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SocialLogin'>;

const SocialLoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<SocialLoginScreenNavigationProp>();
  const { googleLogin, facebookLogin } = useAuth();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await googleLogin();
      if (success) {
        // Navigation will be handled by AuthContext
      }
    } catch (error) {
      Alert.alert('Error', 'Google login failed. Please try again.');
    }
    setIsLoading(false);
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const success = await facebookLogin();
      if (success) {
        // Navigation will be handled by AuthContext
      }
    } catch (error) {
      Alert.alert('Error', 'Facebook login failed. Please try again.');
    }
    setIsLoading(false);
  };

  const handlePhoneLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#0ea5e9', '#3b82f6', '#7c3aed']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Icon name="pets" size={32} color="#ffffff" />
              </View>
              <Text style={styles.logoTitle}>Pashu Marketplace</Text>
            </View>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.subtitleText}>Choose your preferred login method</Text>
          </View>

          {/* Social Login Options */}
          <View style={styles.formContainer}>
            {/* Google Login */}
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton, isLoading && styles.buttonDisabled]}
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <Icon name="google" size={24} color="#ffffff" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Facebook Login */}
            <TouchableOpacity
              style={[styles.socialButton, styles.facebookButton, isLoading && styles.buttonDisabled]}
              onPress={handleFacebookLogin}
              disabled={isLoading}
            >
              <Icon name="facebook" size={24} color="#ffffff" />
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Phone Login */}
            <TouchableOpacity
              style={[styles.phoneButton, isLoading && styles.buttonDisabled]}
              onPress={handlePhoneLogin}
              disabled={isLoading}
            >
              <Icon name="phone" size={24} color="#0ea5e9" />
              <Text style={styles.phoneButtonText}>Continue with Phone</Text>
            </TouchableOpacity>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
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
    fontSize: 32,
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
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleButton: {
    backgroundColor: '#db4437',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  socialButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#0ea5e9',
    marginBottom: 24,
  },
  phoneButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#0ea5e9',
    fontWeight: '500',
  },
});

export default SocialLoginScreen;
