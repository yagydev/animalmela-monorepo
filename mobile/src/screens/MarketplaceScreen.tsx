import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock data for marketplace listings
const mockListings = [
  {
    id: '1',
    title: 'Premium Dog Food - Chicken & Rice',
    description: 'High-quality dry dog food made with real chicken and brown rice.',
    category: 'pet_food',
    price: 45.99,
    currency: 'USD',
    condition: 'new',
    quantity: 50,
    images: ['https://via.placeholder.com/300x200'],
    tags: ['dog', 'food', 'premium', 'chicken'],
    seller: {
      name: 'Mike\'s Pet Store',
      verified: true,
      rating: 4.8,
    },
    location: {
      city: 'Chicago',
      state: 'IL',
    },
    shipping_info: {
      available: true,
      cost: 5.99,
      estimated_days: 3,
    },
    status: 'active',
    featured: true,
    views: 1250,
    likes: 89,
  },
  {
    id: '2',
    title: 'Interactive Cat Toy - Laser Pointer',
    description: 'Automatic laser pointer toy that keeps your cat entertained for hours.',
    category: 'pet_toys',
    price: 29.99,
    currency: 'USD',
    condition: 'new',
    quantity: 25,
    images: ['https://via.placeholder.com/300x200'],
    tags: ['cat', 'toy', 'laser', 'interactive'],
    seller: {
      name: 'Mike\'s Pet Store',
      verified: true,
      rating: 4.8,
    },
    location: {
      city: 'Chicago',
      state: 'IL',
    },
    shipping_info: {
      available: true,
      cost: 4.99,
      estimated_days: 2,
    },
    status: 'active',
    featured: false,
    views: 890,
    likes: 45,
  },
  {
    id: '3',
    title: 'Golden Retriever Puppy - 8 weeks old',
    description: 'Purebred Golden Retriever puppy, 8 weeks old, fully vaccinated.',
    category: 'pets',
    price: 1200.00,
    currency: 'USD',
    condition: 'new',
    quantity: 1,
    images: ['https://via.placeholder.com/300x200'],
    tags: ['dog', 'puppy', 'golden_retriever', 'purebred'],
    seller: {
      name: 'Sarah\'s Breeding Farm',
      verified: true,
      rating: 4.9,
    },
    location: {
      city: 'Miami',
      state: 'FL',
    },
    shipping_info: {
      available: false,
      cost: 0,
      estimated_days: 0,
    },
    status: 'active',
    featured: true,
    views: 2100,
    likes: 156,
  },
];

const categories = [
  { value: 'all', label: 'All', icon: '🐾' },
  { value: 'pets', label: 'Pets', icon: '🐕' },
  { value: 'pet_food', label: 'Food', icon: '🍖' },
  { value: 'pet_toys', label: 'Toys', icon: '🎾' },
  { value: 'pet_accessories', label: 'Accessories', icon: '🦮' },
  { value: 'pet_health', label: 'Health', icon: '💊' },
  { value: 'pet_grooming', label: 'Grooming', icon: '✂️' },
];

export default function MarketplaceScreen() {
  const navigation = useNavigation();
  const [listings, setListings] = useState(mockListings);
  const [filteredListings, setFilteredListings] = useState(mockListings);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Filter and search functionality
  useEffect(() => {
    let filtered = listings;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'popular':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  }, [listings, selectedCategory, searchTerm, sortBy]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const handleListingPress = (listing: any) => {
    navigation.navigate('ListingDetail', { listingId: listing.id });
  };

  const renderListingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => handleListingPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.listingImage} />
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>{item.condition}</Text>
        </View>
      </View>

      <View style={styles.listingContent}>
        <View style={styles.titleRow}>
          <Text style={styles.listingTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.listingPrice}>
            {formatPrice(item.price, item.currency)}
          </Text>
        </View>

        <Text style={styles.listingDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.sellerRow}>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerAvatar} />
            <View>
              <Text style={styles.sellerName}>{item.seller.name}</Text>
              <View style={styles.sellerRating}>
                <Text style={styles.ratingText}>⭐ {item.seller.rating}</Text>
                {item.seller.verified && (
                  <Text style={styles.verifiedText}>✓</Text>
                )}
              </View>
            </View>
          </View>
          <Text style={styles.locationText}>
            {item.location.city}, {item.location.state}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>👁️</Text>
            <Text style={styles.statText}>{item.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statText}>{item.quantity}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.value && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(item.value)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.value && styles.selectedCategoryText,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity style={styles.sellButton}>
          <Text style={styles.sellButtonText}>Sell</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search listings..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'price_low', label: 'Price: Low to High' },
            { value: 'price_high', label: 'Price: High to Low' },
            { value: 'popular', label: 'Most Popular' },
            { value: 'likes', label: 'Most Liked' },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortOption,
                sortBy === option.value && styles.selectedSortOption,
              ]}
              onPress={() => setSortBy(option.value)}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === option.value && styles.selectedSortOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredListings.length} listings found
        </Text>
      </View>

      {/* Listings */}
      <FlatList
        data={filteredListings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listingsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  sellButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sellButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#111827',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  selectedCategoryItem: {
    backgroundColor: '#DBEAFE',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedCategoryText: {
    color: '#3B82F6',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginRight: 12,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  selectedSortOption: {
    backgroundColor: '#DBEAFE',
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedSortOptionText: {
    color: '#3B82F6',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  listingsContainer: {
    padding: 16,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  listingImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  conditionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  conditionText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  listingContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  listingDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  sellerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
    marginRight: 8,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  verifiedText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
