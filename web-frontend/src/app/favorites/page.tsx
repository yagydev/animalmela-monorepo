'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/providers/AuthProvider';
import { HeartIcon as HeartSolidIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { HeartIcon, EyeIcon } from '@heroicons/react/24/outline';

interface FavoriteItem {
  _id: string;
  title: string;
  description?: string;
  price: number;
  unit: string;
  quantity: number;
  category: string;
  images?: string[];
  sellerId?: {
    name: string;
    _id: string;
  };
  location?: {
    state: string;
    district?: string;
  };
  rating?: number;
  totalRatings?: number;
}

export default function FavoritesPage() {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      // For now, we'll use demo data since we don't have a favorites API yet
      const demoFavorites: FavoriteItem[] = [
        {
          _id: '1',
          title: 'Organic Wheat',
          description: 'High-quality organic wheat, freshly harvested.',
          price: 2500,
          unit: 'quintal',
          quantity: 100,
          category: 'crop',
          images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
          sellerId: { name: 'Rajesh Kumar', _id: 'farmer1' },
          location: { state: 'Punjab', district: 'Ludhiana' },
          rating: 4.7,
          totalRatings: 50
        },
        {
          _id: '2',
          title: 'Fresh Tomatoes',
          description: 'Farm-fresh, juicy red tomatoes.',
          price: 40,
          unit: 'kg',
          quantity: 500,
          category: 'vegetables',
          images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'],
          sellerId: { name: 'Priya Sharma', _id: 'farmer2' },
          location: { state: 'Haryana', district: 'Karnal' },
          rating: 4.5,
          totalRatings: 120
        }
      ];
      
      setFavorites(demoFavorites);
    } catch (err) {
      setError('Failed to load favorites');
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (itemId: string) => {
    try {
      // Remove from local state
      setFavorites(prev => prev.filter(item => item._id !== itemId));
      
      // TODO: Implement API call to remove from favorites
      console.log('Removed from favorites:', itemId);
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  const addToCart = async (itemId: string) => {
    try {
      // TODO: Implement add to cart functionality
      console.log('Added to cart:', itemId);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const viewDetails = (itemId: string) => {
    // TODO: Navigate to product details page
    console.log('View details:', itemId);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Favorites</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your favorite products</p>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Favorites</h1>
            <p className="text-red-600 mb-8">{error}</p>
            <button
              onClick={loadFavorites}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-8">
              Start exploring products and add them to your favorites!
            </p>
            <a
              href="/farmers-market"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={item.images?.[0] || '/api/placeholder/300/200'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => removeFromFavorites(item._id)}
                      className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                      title="Remove from Favorites"
                    >
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    </button>
                    <button
                      onClick={() => viewDetails(item._id)}
                      className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-xl font-bold text-green-600">
                        ₹{item.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">/{item.unit}</span>
                    </div>
                    {item.rating && (
                      <div className="text-sm text-gray-600">
                        ⭐ {item.rating} ({item.totalRatings})
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 mb-3">
                    <p>Seller: {item.sellerId?.name}</p>
                    <p>Location: {item.location?.state}</p>
                  </div>

                  <button
                    onClick={() => addToCart(item._id)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
