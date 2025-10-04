'use client';

import React, { useState } from 'react';
// import Image from 'next/image';
import { ShoppingCartIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
  listing: {
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
    negotiable?: boolean;
    minimumOrder?: number;
  };
  onAddToCart?: (listingId: string, quantity?: number) => Promise<void>;
  onViewDetails?: (listingId: string) => void;
  onToggleFavorite?: (listingId: string) => void;
  isInCart?: boolean;
  isFavorite?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function ProductCard({
  listing,
  onAddToCart,
  onViewDetails,
  onToggleFavorite,
  isInCart = false,
  isFavorite = false,
  showActions = true,
  variant = 'default',
  className = ''
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleAddToCart = async () => {
    if (!onAddToCart || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(listing._id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!onToggleFavorite || isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    try {
      await onToggleFavorite(listing._id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(listing._id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageSrc = () => {
    if (listing.images && listing.images.length > 0) {
      return listing.images[0];
    }
    // Fallback to Unsplash images based on category
    const categoryPlaceholders = {
      crops: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
      livestock: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop',
      seeds: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
      equipment: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop',
    };
    return categoryPlaceholders[listing.category as keyof typeof categoryPlaceholders] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop';
  };

  const getCardClasses = () => {
    const baseClasses = "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200";
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} hover:scale-105`;
      case 'detailed':
        return `${baseClasses} hover:shadow-lg`;
      default:
        return `${baseClasses} hover:shadow-md`;
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'compact':
        return 'h-32';
      case 'detailed':
        return 'h-64';
      default:
        return 'h-48';
    }
  };

  const getPaddingClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-4';
      case 'detailed':
        return 'p-6';
      default:
        return 'p-6';
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`${getCardClasses()} ${className}`}>
        <div className="flex">
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={getImageSrc()}
              alt={listing.title}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
            {onToggleFavorite && (
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
              >
                {isFavorite ? (
                  <HeartSolidIcon className="h-4 w-4 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            )}
          </div>
          
          <div className="flex-1 p-3">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
              <span className="text-xs text-gray-500 capitalize ml-2">{listing.category}</span>
            </div>
            
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-bold text-green-600">{formatPrice(listing.price)}</span>
                <span className="text-xs text-gray-500">/{listing.unit}</span>
              </div>
              
              {showActions && onAddToCart && (
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart || isAddingToCart}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    isInCart || isAddingToCart
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isAddingToCart ? 'Adding...' : isInCart ? 'In Cart' : 'Add'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getCardClasses()} ${className}`}>
      {/* Image Section */}
      <div className="relative">
        <div className={`${getImageHeight()} bg-gray-200 relative overflow-hidden`}>
          <img
            src={getImageSrc()}
            alt={listing.title}
            width={300}
            height={variant === 'detailed' ? 256 : 192}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex space-x-2">
              {onViewDetails && (
                <button
                  key="view-details"
                  onClick={handleViewDetails}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  title="View Details"
                >
                  <EyeIcon className="h-5 w-5 text-gray-600" />
                </button>
              )}
              {onToggleFavorite && (
                <button
                  key="toggle-favorite"
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs font-medium bg-white bg-opacity-90 text-gray-700 rounded-full capitalize">
            {listing.category}
          </span>
        </div>
        
        {/* Negotiable Badge */}
        {listing.negotiable && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Negotiable
            </span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className={getPaddingClasses()}>
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
          {listing.rating && listing.totalRatings && (
            <div className="flex items-center ml-2">
              <span className="text-sm font-medium text-gray-900">{listing.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({listing.totalRatings})</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        {variant !== 'compact' && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
        )}
        
        {/* Price and Availability */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-green-600">{formatPrice(listing.price)}</span>
            <span className="text-sm text-gray-500">/{listing.unit}</span>
            {listing.minimumOrder && (
              <div className="text-xs text-gray-500">Min: {listing.minimumOrder} {listing.unit}</div>
            )}
          </div>
          <div className="text-sm text-gray-500 text-right">
            <div>Available: {listing.quantity} {listing.unit}</div>
          </div>
        </div>
        
        {/* Seller and Location */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium">Seller: {listing.sellerId?.name || 'Unknown'}</p>
            <p>Location: {listing.location?.state || 'N/A'}</p>
          </div>
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            {onAddToCart && (
              <button
                onClick={handleAddToCart}
                disabled={isInCart || isAddingToCart}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2 ${
                  isInCart || isAddingToCart
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <ShoppingCartIcon className="h-4 w-4" />
                <span>{isAddingToCart ? 'Adding...' : isInCart ? 'In Cart' : 'Add to Cart'}</span>
              </button>
            )}
            
            {onViewDetails && (
              <button
                onClick={handleViewDetails}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                <EyeIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for managing cart state
export function useCart() {
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());

  const addToCart = async (listingId: string, quantity: number = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to add items to cart');
      }

      const response = await fetch('/api/farmers-market/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId,
          quantity
        })
      });

      const data = await response.json();
      if (data.success) {
        setCartItems(prev => new Set([...prev, listingId]));
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (listingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farmers-market/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ listingId })
      });

      const data = await response.json();
      if (data.success) {
        setCartItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(listingId);
          return newSet;
        });
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const isInCart = (listingId: string) => cartItems.has(listingId);

  return {
    cartItems: Array.from(cartItems),
    addToCart,
    removeFromCart,
    isInCart
  };
}

// Hook for managing favorites
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = async (listingId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to manage favorites');
      }

      const isCurrentlyFavorite = favorites.has(listingId);
      const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
      
      const response = await fetch('/api/farmers-market/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ listingId })
      });

      const data = await response.json();
      if (data.success) {
        setFavorites(prev => {
          const newSet = new Set(prev);
          if (isCurrentlyFavorite) {
            newSet.delete(listingId);
          } else {
            newSet.add(listingId);
          }
          return newSet;
        });
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  };

  const isFavorite = (listingId: string) => favorites.has(listingId);

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite
  };
}
