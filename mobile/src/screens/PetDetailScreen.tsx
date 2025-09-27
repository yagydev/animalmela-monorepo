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

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  description: string;
  image: string;
  owner: {
    name: string;
    avatar: string;
  };
  location: string;
  rating: number;
  reviews: number;
  price: string;
  availability: string[];
}

const PetDetailScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { pet } = route.params as { pet: Pet };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
  ];

  const handleBookPet = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select a date and time for your booking.');
      return;
    }
    
    Alert.alert(
      'Book Pet Care',
      `Book care for ${pet.name} on ${selectedDate} at ${selectedTime}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm Booking', onPress: () => console.log('Booking confirmed') },
      ]
    );
  };

  const handleContactOwner = () => {
    Alert.alert(
      'Contact Owner',
      `Would you like to contact ${pet.owner.name} about ${pet.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => console.log('Send message') },
        { text: 'Call', onPress: () => console.log('Make call') },
      ]
    );
  };

  const handleAddToFavorites = () => {
    Alert.alert('Added to Favorites', `${pet.name} has been added to your favorites.`);
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
      <Header title={pet.name} showBackButton={true} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Pet Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: pet.image }} style={styles.petImage} />
          <TouchableOpacity style={styles.favoriteButton} onPress={handleAddToFavorites}>
            <Icon name="favorite-border" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Pet Info */}
        <View style={styles.petInfoSection}>
          <View style={styles.petHeader}>
            <View style={styles.petBasicInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed}</Text>
            </View>
            <Text style={styles.petPrice}>{pet.price}</Text>
          </View>
          
          <View style={styles.petDetails}>
            <View style={styles.petDetailItem}>
              <Icon name="cake" size={20} color="#3B82F6" />
              <Text style={styles.petDetailText}>{pet.age} years old</Text>
            </View>
            <View style={styles.petDetailItem}>
              <Icon name="pets" size={20} color="#3B82F6" />
              <Text style={styles.petDetailText}>{pet.gender} • {pet.size}</Text>
            </View>
            <View style={styles.petDetailItem}>
              <Icon name="place" size={20} color="#3B82F6" />
              <Text style={styles.petDetailText}>{pet.location}</Text>
            </View>
          </View>
          
          <View style={styles.petRating}>
            <Icon name="star" size={20} color="#F59E0B" />
            <Text style={styles.ratingText}>{pet.rating}</Text>
            <Text style={styles.reviewsText}>({pet.reviews} reviews)</Text>
          </View>
        </View>

        {/* Pet Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About {pet.name}</Text>
          <Text style={styles.descriptionText}>
            {pet.description} This lovely {pet.type.toLowerCase()} is well-behaved and loves to play. 
            Perfect for families looking for a caring pet companion.
          </Text>
        </View>

        {/* Owner Info */}
        <View style={styles.ownerSection}>
          <Text style={styles.sectionTitle}>Pet Owner</Text>
          <View style={styles.ownerCard}>
            <Image source={{ uri: pet.owner.avatar }} style={styles.ownerAvatar} />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{pet.owner.name}</Text>
              <Text style={styles.ownerTitle}>Pet Owner</Text>
              <View style={styles.ownerRating}>
                <Icon name="star" size={16} color="#F59E0B" />
                <Text style={styles.ownerRatingText}>4.9 (23 reviews)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactOwner}>
              <Icon name="message" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Availability */}
        <View style={styles.availabilitySection}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityDays}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <View
                key={day}
                style={[
                  styles.availabilityDay,
                  pet.availability.includes(day) && styles.availabilityDayActive
                ]}
              >
                <Text style={[
                  styles.availabilityDayText,
                  pet.availability.includes(day) && styles.availabilityDayTextActive
                ]}>
                  {day.substring(0, 3)}
                </Text>
              </View>
            ))}
          </View>
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
              {pet.name} is such a wonderful {pet.type.toLowerCase()}! Very friendly and well-behaved.
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
              Great experience with {pet.name}. The owner is very responsible and caring.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>{pet.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookPet}>
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
  imageContainer: {
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 25,
  },
  petInfoSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  petBasicInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 18,
    color: '#6B7280',
  },
  petPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  petDetails: {
    marginBottom: 16,
  },
  petDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  petDetailText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
  },
  petRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 4,
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
  ownerSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ownerTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerRatingText: {
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
  availabilitySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  availabilityDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  availabilityDay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityDayActive: {
    backgroundColor: '#3B82F6',
  },
  availabilityDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  availabilityDayTextActive: {
    color: '#FFFFFF',
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

export default PetDetailScreen;
