import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface Service {
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

const ServicesSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation();

  const services: Service[] = [
    {
      name: 'Pet Sitting',
      description: 'In-home pet sitting for when you\'re away',
      icon: 'home',
      color: '#3B82F6',
      features: ['In-home care', '24/7 supervision', 'Daily updates'],
    },
    {
      name: 'Dog Walking',
      description: 'Regular walks to keep your dog healthy and happy',
      icon: 'directions-walk',
      color: '#10B981',
      features: ['Exercise & play', 'Socialization', 'GPS tracking'],
    },
    {
      name: 'Pet Grooming',
      description: 'Professional grooming services for all pets',
      icon: 'content-cut',
      color: '#8B5CF6',
      features: ['Bath & brush', 'Nail trimming', 'Styling'],
    },
    {
      name: 'Pet Training',
      description: 'Expert training for behavioral issues',
      icon: 'school',
      color: '#F59E0B',
      features: ['Behavioral training', 'Obedience classes', 'Puppy training'],
    },
    {
      name: 'Pet Transportation',
      description: 'Safe and comfortable pet transportation services',
      icon: 'local-shipping',
      color: '#6366F1',
      features: ['Vet visits', 'Airport pickup', 'Emergency transport'],
    },
    {
      name: 'Pet Health',
      description: 'Comprehensive health and wellness services',
      icon: 'favorite',
      color: '#EF4444',
      features: ['Health checkups', 'Vaccinations', 'Emergency care'],
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleServicePress = (service: Service) => {
    navigation.navigate('ServiceDetail' as never, { service } as never);
  };

  const renderServiceCard = ({ item, index }: { item: Service; index: number }) => (
    <Animatable.View
      animation={isVisible ? 'fadeInUp' : undefined}
      delay={index * 100}
      style={styles.serviceCard}
    >
      <TouchableOpacity
        style={styles.serviceTouchable}
        onPress={() => handleServicePress(item)}
        activeOpacity={0.8}
      >
        {/* Service Icon */}
        <View style={[styles.serviceIconContainer, { backgroundColor: item.color }]}>
          <Icon name={item.icon} size={40} color="#FFFFFF" />
        </View>
        
        {/* Service Content */}
        <View style={styles.serviceContent}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceDescription}>{item.description}</Text>
          
          {/* Features */}
          <View style={styles.featuresContainer}>
            {item.features.map((feature, featureIndex) => (
              <View key={featureIndex} style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
          
          {/* Learn More */}
          <View style={styles.learnMoreContainer}>
            <Text style={styles.learnMoreText}>Learn More →</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Our Services</Text>
          <Text style={styles.subtitle}>
            From daily walks to overnight stays, we offer a comprehensive range of 
            pet care services to meet all your needs.
          </Text>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesContainer}>
          <FlatList
            data={services}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.name}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Service Categories */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesCard}>
            <Text style={styles.categoriesTitle}>Service Categories</Text>
            <View style={styles.categoriesGrid}>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryTitle}>Daily Care</Text>
                <Text style={styles.categoryDescription}>Walking, feeding, and basic care services</Text>
              </View>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryTitle}>Overnight Care</Text>
                <Text style={styles.categoryDescription}>Extended stays and 24/7 supervision</Text>
              </View>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryTitle}>Specialized Services</Text>
                <Text style={styles.categoryDescription}>Grooming, training, and health services</Text>
              </View>
            </View>
          </View>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.9,
  },
  servicesContainer: {
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 50) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceTouchable: {
    flex: 1,
  },
  serviceIconContainer: {
    padding: 32,
    alignItems: 'center',
  },
  serviceContent: {
    padding: 20,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
    marginRight: 12,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  learnMoreContainer: {
    alignItems: 'flex-start',
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  categoriesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryItem: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ServicesSection;
