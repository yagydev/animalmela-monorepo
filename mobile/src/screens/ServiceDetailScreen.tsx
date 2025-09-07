import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/layout/Header';

const { width } = Dimensions.get('window');

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  price: string;
  rating: number;
  reviews: number;
  features: string[];
  category: string;
}

const ServiceDetailScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { service } = route.params as { service: Service };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
  ];

  const handleBookService = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select a date and time for your booking.');
      return;
    }
    
    Alert.alert(
      'Book Service',
      `Book ${service.name} for ${selectedDate} at ${selectedTime}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm Booking', onPress: () => console.log('Booking confirmed') },
      ]
    );
  };

  const handleContactProvider = () => {
    Alert.alert('Contact Provider', 'Contact provider functionality will be implemented soon.');
  };

  const handleAddToFavorites = () => {
    Alert.alert('Added to Favorites', `${service.name} has been added to your favorites.`);
  };

  const renderTimeSlot = (time: string) => (
    <TouchableOpacity
      key={time}
      style={[
        styles.timeSlot,
        selectedTime === time && styles.timeSlotSelected
      ]}
      onPress={() => setSelectedTime(time)}
    >
      <Text style={[
        styles.timeSlotText,
        selectedTime === time && styles.timeSlotTextSelected
      ]}>
        {time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title={service.name} showBackButton={true} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Service Header */}
        <View style={styles.serviceHeader}>
          <View style={[styles.serviceIconContainer, { backgroundColor: service.color }]}>
            <Icon name={service.icon} size={48} color="#FFFFFF" />
          </View>
          
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>{service.price}</Text>
            
            <View style={styles.serviceRating}>
              <Icon name="star" size={20} color="#F59E0B" />
              <Text style={styles.ratingText}>{service.rating}</Text>
              <Text style={styles.reviewsText}>({service.reviews} reviews)</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.favoriteButton} onPress={handleAddToFavorites}>
            <Icon name="favorite-border" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Service Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {service.description} Our professional team ensures the highest quality care for your beloved pets.
            We provide comprehensive services tailored to meet your pet's specific needs.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          {service.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name="check-circle" size={20} color="#10B981" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Date Selection */}
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => Alert.alert('Date Picker', 'Date picker will be implemented soon.')}
          >
            <Icon name="calendar-today" size={20} color="#3B82F6" />
            <Text style={styles.dateButtonText}>
              {selectedDate || 'Select a date'}
            </Text>
            <Icon name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map(renderTimeSlot)}
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.providerSection}>
          <Text style={styles.sectionTitle}>Service Provider</Text>
          <View style={styles.providerCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100' }}
              style={styles.providerAvatar}
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>Sarah Johnson</Text>
              <Text style={styles.providerTitle}>Professional Pet Sitter</Text>
              <View style={styles.providerRating}>
                <Icon name="star" size={16} color="#F59E0B" />
                <Text style={styles.providerRatingText}>4.9 (127 reviews)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactProvider}>
              <Icon name="message" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' }}
                style={styles.reviewerAvatar}
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>Mike Chen</Text>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon key={star} name="star" size={14} color="#F59E0B" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>
              Excellent service! Sarah took great care of my dog Buddy. Highly recommended!
            </Text>
          </View>
          
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50' }}
                style={styles.reviewerAvatar}
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>Emily Davis</Text>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon key={star} name="star" size={14} color="#F59E0B" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>
              Professional and caring. My cat was very happy with the service.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>{service.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookService}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
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
  serviceHeader: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
  },
  serviceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 8,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 8,
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  featuresSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  dateSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  timeSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeSlotSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  providerSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  providerTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerRatingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  contactButton: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  reviewsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  reviewCard: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceDetailScreen;
