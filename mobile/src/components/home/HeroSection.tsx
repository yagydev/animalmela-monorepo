import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface HeroSectionProps {
  onSearch?: (location: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchLocation, setSearchLocation] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    if (searchLocation.trim() && onSearch) {
      onSearch(searchLocation);
    }
  };

  const handleFindServices = () => {
    navigation.navigate('Services' as never);
  };

  const handleBecomeSitter = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <LinearGradient
      colors={['#3B82F6', '#1D4ED8', '#7C3AED']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Your Pet's Best Friend</Text>
          <Text style={styles.subtitle}>
            Find trusted pet care services in your area. From pet sitting to grooming, 
            we connect you with verified professionals who love pets as much as you do.
          </Text>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleFindServices}>
              <Text style={styles.primaryButtonText}>Find Services</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleBecomeSitter}>
              <Text style={styles.secondaryButtonText}>Become a Sitter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchCard}>
            <View style={styles.searchHeader}>
              <View style={styles.iconContainer}>
                <Icon name="camera-alt" size={32} color="#E5E7EB" />
              </View>
              <Text style={styles.searchTitle}>Find Pet Care Near You</Text>
              <Text style={styles.searchSubtitle}>Enter your location to get started</Text>
            </View>
            
            {/* Search Input */}
            <View style={styles.searchInputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="location-on" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Enter your address or city"
                  placeholderTextColor="#9CA3AF"
                  value={searchLocation}
                  onChangeText={setSearchLocation}
                />
              </View>
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10,000+</Text>
                <Text style={styles.statLabel}>Happy Pets</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5,000+</Text>
                <Text style={styles.statLabel}>Trusted Sitters</Text>
              </View>
            </View>
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
    paddingBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 50,
    marginBottom: 16,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  searchSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#E5E7EB',
  },
});

export default HeroSection;
