// src/screens/seller/SellerListingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SellerListingsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Mock listings data
  const listings = [
    {
      id: '1',
      title: 'High Quality Cattle #1',
      category: 'Cattle',
      price: 60000,
      status: 'active',
      views: 45,
      inquiries: 3,
      image: 'pets',
    },
    {
      id: '2',
      title: 'Premium Goat #2',
      category: 'Goat',
      price: 25000,
      status: 'paused',
      views: 23,
      inquiries: 1,
      image: 'pets',
    },
    {
      id: '3',
      title: 'Healthy Sheep #3',
      category: 'Sheep',
      price: 18000,
      status: 'sold',
      views: 67,
      inquiries: 5,
      image: 'pets',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'paused':
        return '#f59e0b';
      case 'sold':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {listings.map((listing) => (
          <View key={listing.id} style={styles.listingCard}>
            <View style={styles.listingImage}>
              <Icon name={listing.image} size={32} color="#9ca3af" />
            </View>
            
            <View style={styles.listingContent}>
              <Text style={styles.listingTitle}>{listing.title}</Text>
              <Text style={styles.listingCategory}>{listing.category}</Text>
              <Text style={styles.listingPrice}>₹{listing.price.toLocaleString()}</Text>
              
              <View style={styles.listingStats}>
                <View style={styles.statItem}>
                  <Icon name="visibility" size={16} color="#6b7280" />
                  <Text style={styles.statText}>{listing.views}</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="chat" size={16} color="#6b7280" />
                  <Text style={styles.statText}>{listing.inquiries}</Text>
                </View>
              </View>
            </View>

            <View style={styles.listingActions}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(listing.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(listing.status) }]}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="more-vert" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {listings.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="pets" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Listings Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first livestock listing to start selling
            </Text>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Create Listing</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listingImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listingContent: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  listingCategory: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  listingStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  listingActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellerListingsScreen;
