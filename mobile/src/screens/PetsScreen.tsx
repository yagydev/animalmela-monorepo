import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/layout/Header';

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

const PetsScreen: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const navigation = useNavigation();

  const filters = [
    { id: 'all', name: 'All Pets', icon: 'pets' },
    { id: 'dogs', name: 'Dogs', icon: 'pets' },
    { id: 'cats', name: 'Cats', icon: 'pets' },
    { id: 'other', name: 'Other', icon: 'pets' },
  ];

  const mockPets: Pet[] = [
    {
      id: '1',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'Male',
      size: 'Large',
      description: 'Friendly and energetic dog who loves playing fetch and going for walks.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
      owner: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      },
      location: 'Downtown',
      rating: 4.9,
      reviews: 23,
      price: '$30/day',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    {
      id: '2',
      name: 'Whiskers',
      type: 'Cat',
      breed: 'Persian',
      age: 2,
      gender: 'Female',
      size: 'Medium',
      description: 'Calm and affectionate cat who enjoys cuddling and gentle play.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      owner: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      location: 'Midtown',
      rating: 4.8,
      reviews: 18,
      price: '$25/day',
      availability: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
    },
    {
      id: '3',
      name: 'Max',
      type: 'Dog',
      breed: 'Labrador',
      age: 5,
      gender: 'Male',
      size: 'Large',
      description: 'Well-trained and social dog perfect for families with children.',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
      owner: {
        name: 'Emily Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      },
      location: 'Uptown',
      rating: 4.7,
      reviews: 31,
      price: '$35/day',
      availability: ['Tuesday', 'Thursday', 'Saturday'],
    },
    {
      id: '4',
      name: 'Luna',
      type: 'Cat',
      breed: 'Siamese',
      age: 1,
      gender: 'Female',
      size: 'Small',
      description: 'Playful kitten who loves toys and interactive games.',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
      owner: {
        name: 'David Wilson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      },
      location: 'Eastside',
      rating: 4.9,
      reviews: 12,
      price: '$20/day',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
  ];

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPets(mockPets);
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  const handlePetPress = (pet: Pet) => {
    navigation.navigate('PetDetail' as never, { pet } as never);
  };

  const handleContactOwner = (pet: Pet) => {
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

  const filteredPets = selectedFilter === 'all' 
    ? pets 
    : pets.filter(pet => pet.type.toLowerCase() === selectedFilter);

  const renderPetCard = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => handlePetPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.petImage} />
      
      <View style={styles.petContent}>
        <View style={styles.petHeader}>
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petBreed}>{item.breed}</Text>
          </View>
          <Text style={styles.petPrice}>{item.price}</Text>
        </View>
        
        <View style={styles.petDetails}>
          <View style={styles.petDetailItem}>
            <Icon name="cake" size={16} color="#6B7280" />
            <Text style={styles.petDetailText}>{item.age} years old</Text>
          </View>
          <View style={styles.petDetailItem}>
            <Icon name="place" size={16} color="#6B7280" />
            <Text style={styles.petDetailText}>{item.location}</Text>
          </View>
        </View>
        
        <Text style={styles.petDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.petFooter}>
          <View style={styles.ownerInfo}>
            <Image source={{ uri: item.owner.avatar }} style={styles.ownerAvatar} />
            <Text style={styles.ownerName}>{item.owner.name}</Text>
          </View>
          
          <View style={styles.petRating}>
            <Icon name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContactOwner(item)}
        >
          <Icon name="message" size={16} color="#3B82F6" />
          <Text style={styles.contactButtonText}>Contact Owner</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: typeof filters[0]) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Icon
        name={filter.icon}
        size={20}
        color={selectedFilter === filter.id ? '#FFFFFF' : '#3B82F6'}
      />
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter.id && styles.filterButtonTextActive
        ]}
      >
        {filter.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Pets" showBackButton={false} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {filters.map(renderFilterButton)}
          </ScrollView>
        </View>

        {/* Pets List */}
        <View style={styles.petsContainer}>
          <View style={styles.petsHeader}>
            <Text style={styles.petsTitle}>
              {selectedFilter === 'all' ? 'All Pets' : filters.find(f => f.id === selectedFilter)?.name}
            </Text>
            <Text style={styles.petsCount}>
              {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading pets...</Text>
            </View>
          ) : filteredPets.length > 0 ? (
            <FlatList
              data={filteredPets}
              renderItem={renderPetCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="pets" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No pets found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filter criteria
              </Text>
            </View>
          )}
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
  filtersContainer: {
    paddingVertical: 16,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 8,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  petsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  petsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  petsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  petsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  petImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  petContent: {
    padding: 16,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: '#6B7280',
  },
  petPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  petDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  petDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  petDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  petFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  ownerName: {
    fontSize: 14,
    color: '#6B7280',
  },
  petRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  contactButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default PetsScreen;
