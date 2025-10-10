'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon,
  MapPinIcon,
  UserIcon,
  EyeIcon,
  TagIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  FlagIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface FarmersMarketCardProps {
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    unit: string;
    quantity: number;
    category: string;
    subcategory?: string;
    images: string[];
    sellerId: {
      _id: string;
      name: string;
      email: string;
      mobile: string;
      location: {
        state: string;
        district: string;
        pincode: string;
        village: string;
      };
      rating: {
        average: number;
        count: number;
      };
      verified: boolean;
      joinDate: string;
    };
    location: {
      state: string;
      district: string;
      pincode: string;
      village: string;
    };
    rating: {
      average: number;
      count: number;
    };
    negotiable: boolean;
    minimumOrder: number;
    specifications?: {
      [key: string]: string;
    };
    tags: string[];
    status: 'active' | 'inactive' | 'sold';
    featured: boolean;
    views: number;
    likes: number;
    createdAt: string;
    updatedAt: string;
    shipping?: {
      available: boolean;
      cost: number;
      estimatedDays: number;
    };
    paymentMethods: string[];
    returnPolicy?: string;
    warranty?: string;
  };
  variant?: 'default' | 'compact' | 'detailed' | 'management';
  showActions?: boolean;
  onAddToCart?: (productId: string, quantity?: number) => Promise<void>;
  onToggleFavorite?: (productId: string) => Promise<void>;
  onContactSeller?: (sellerId: string) => void;
  onEditProduct?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
  isInCart?: boolean;
  isFavorite?: boolean;
  className?: string;
}

export function FarmersMarketCard({
  product,
  variant = 'default',
  showActions = true,
  onAddToCart,
  onToggleFavorite,
  onContactSeller,
  onEditProduct,
  onDeleteProduct,
  isInCart = false,
  isFavorite = false,
  className = ''
}: FarmersMarketCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSellerDetails, setShowSellerDetails] = useState(false);
  
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!onAddToCart || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(product._id, 1);
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
      await onToggleFavorite(product._id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleViewDetails = () => {
    router.push(`/farmers-market/product/${product._id}`);
  };

  const handleContactSeller = () => {
    if (onContactSeller) {
      onContactSeller(product.sellerId._id);
    } else {
      // Default contact behavior
      window.open(`mailto:${product.sellerId.email}?subject=Inquiry about ${product.title}`);
    }
  };

  const handleEditProduct = () => {
    if (onEditProduct) {
      onEditProduct(product._id);
    } else {
      router.push(`/farmers-market/edit-product/${product._id}`);
    }
  };

  const handleDeleteProduct = () => {
    if (onDeleteProduct) {
      onDeleteProduct(product._id);
    } else {
      if (confirm('Are you sure you want to delete this product?')) {
        // Default delete behavior
        console.log('Delete product:', product._id);
      }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImageSrc = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/api/placeholder/300/200';
  };

  // Compact variant for lists
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${className}`}>
        <div className="flex space-x-4">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={getImageSrc()}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                    <span className="font-medium text-green-600">{formatPrice(product.price)}/{product.unit}</span>
                  </div>
                  <div className="flex items-center">
                    {renderStars(product.rating.average)}
                    <span className="ml-1">({product.rating.count})</span>
                  </div>
                  <span>Qty: {product.quantity}</span>
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={handleViewDetails}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  {onAddToCart && (
                    <button
                      onClick={handleAddToCart}
                      disabled={isInCart || isAddingToCart}
                      className={`p-2 rounded ${
                        isInCart || isAddingToCart
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                      title="Add to Cart"
                    >
                      <ShoppingCartIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Management variant for admin/farmer view
  if (variant === 'management') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
        {/* Image */}
        <div className="relative">
          <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
            <img
              src={getImageSrc()}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            {/* Status badges */}
            <div className="absolute top-2 left-2 flex space-x-2">
              {product.featured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                  Featured
                </span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>

            {/* Management actions */}
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={handleViewDetails}
                className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100"
                title="View Details"
              >
                <EyeIcon className="h-4 w-4 text-gray-600" />
              </button>
              {onEditProduct && (
                <button
                  onClick={handleEditProduct}
                  className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100"
                  title="Edit Product"
                >
                  <PencilIcon className="h-4 w-4 text-blue-600" />
                </button>
              )}
              {onDeleteProduct && (
                <button
                  onClick={handleDeleteProduct}
                  className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100"
                  title="Delete Product"
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-500">/{product.unit}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {renderStars(product.rating.average)}
              <span className="text-sm text-gray-600">({product.rating.count})</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                {product.views}
              </span>
              <span>Qty: {product.quantity}</span>
            </div>
            <span className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(product.createdAt)}
            </span>
          </div>

          {/* Seller info */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{product.sellerId.name}</span>
                {product.sellerId.verified && (
                  <ShieldCheckIcon className="h-4 w-4 text-green-600" title="Verified Seller" />
                )}
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(product.sellerId.rating.average)}
                <span className="text-sm text-gray-600">({product.sellerId.rating.count})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant for featured products
  if (variant === 'detailed') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
        {/* Image */}
        <div className="relative">
          <div className="w-full h-64 bg-gray-200 relative overflow-hidden">
            <img
              src={getImageSrc()}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  onClick={handleViewDetails}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  title="View Details"
                >
                  <EyeIcon className="h-5 w-5 text-gray-600" />
                </button>
                {onToggleFavorite && (
                  <button
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

            {/* Status badges */}
            <div className="absolute top-3 left-3 flex space-x-2">
              {product.featured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                  Featured
                </span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />
              <span className="text-xl font-bold text-green-600">{formatPrice(product.price)}</span>
              <span className="text-gray-500">/{product.unit}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {renderStars(product.rating.average)}
              <span className="text-sm text-gray-600">({product.rating.count})</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.slice(0, 4).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Seller info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{product.sellerId.name}</span>
              {product.sellerId.verified && (
                <ShieldCheckIcon className="h-4 w-4 text-green-600" title="Verified Seller" />
              )}
            </div>
            <div className="flex items-center space-x-1">
              {renderStars(product.sellerId.rating.average)}
              <span className="text-sm text-gray-600">({product.sellerId.rating.count})</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{product.location.district}, {product.location.state}</span>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2">
              {onAddToCart && (
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart || isAddingToCart}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                    isInCart || isAddingToCart
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>{isAddingToCart ? 'Adding...' : isInCart ? 'In Cart' : 'Add to Cart'}</span>
                </button>
              )}
              
              <button
                onClick={handleContactSeller}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      {/* Image */}
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
          <img
            src={getImageSrc()}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
          
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex space-x-2">
              <button
                onClick={handleViewDetails}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                title="View Details"
              >
                <EyeIcon className="h-5 w-5 text-gray-600" />
              </button>
              {onToggleFavorite && (
                <button
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

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex space-x-2">
            {product.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                Featured
              </span>
            )}
            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(product.status)}`}>
              {product.status}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">{formatPrice(product.price)}</span>
            <span className="text-sm text-gray-500">/{product.unit}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {renderStars(product.rating.average)}
            <span className="text-sm text-gray-600">({product.rating.count})</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              #{tag}
            </span>
          ))}
        </div>

        {/* Seller and Location */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium">Seller: {product.sellerId.name}</p>
            <p>Location: {product.location.state}</p>
          </div>
          {product.sellerId.verified && (
            <ShieldCheckIcon className="h-4 w-4 text-green-600" title="Verified Seller" />
          )}
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
            
            <button
              onClick={handleViewDetails}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

