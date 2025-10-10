'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../../../components/ProductCard';

interface ProductDetails {
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
}

interface Review {
  _id: string;
  userId: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

// Mock data for demo
const getMockProduct = (id: string): ProductDetails => ({
  _id: id,
  title: 'Premium Organic Wheat - Grade A',
  description: 'High-quality organic wheat grown using traditional farming methods without any chemical fertilizers or pesticides. This premium wheat is perfect for making rotis, bread, and other wheat-based products. Grown in the fertile lands of Punjab with excellent soil quality and irrigation facilities.',
  price: 2500,
  unit: 'quintal',
  quantity: 10,
  category: 'crops',
  subcategory: 'grains',
  images: [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop'
  ],
  sellerId: {
    _id: 'seller1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    mobile: '9876543210',
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      pincode: '141001',
      village: 'Village A'
    },
    rating: {
      average: 4.5,
      count: 23
    },
    verified: true,
    joinDate: '2020-01-15'
  },
  location: {
    state: 'Punjab',
    district: 'Ludhiana',
    pincode: '141001',
    village: 'Village A'
  },
  rating: {
    average: 4.3,
    count: 15
  },
  negotiable: true,
  minimumOrder: 1,
  specifications: {
    'Moisture Content': '12%',
    'Protein Content': '11-12%',
    'Gluten Content': 'Medium',
    'Color': 'Golden Yellow',
    'Purity': '99%',
    'Storage': 'Cool and Dry Place',
    'Shelf Life': '2 Years'
  },
  tags: ['organic', 'premium', 'wheat', 'traditional', 'chemical-free'],
  status: 'active',
  featured: true,
  views: 156,
  likes: 23,
  createdAt: '2024-01-10T10:30:00Z',
  updatedAt: '2024-01-14T16:45:00Z',
  shipping: {
    available: true,
    cost: 200,
    estimatedDays: 3
  },
  paymentMethods: ['cash', 'upi', 'bank_transfer'],
  returnPolicy: '7 days return policy for damaged goods',
  warranty: '1 year warranty on quality'
});

const mockReviews: Review[] = [
  {
    _id: 'review1',
    userId: {
      name: 'Amit Sharma',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    rating: 5,
    comment: 'Excellent quality wheat! Very satisfied with the purchase. The seller was very helpful and delivered on time.',
    createdAt: '2024-01-12T14:30:00Z',
    helpful: 8
  },
  {
    _id: 'review2',
    userId: {
      name: 'Priya Singh',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    rating: 4,
    comment: 'Good quality wheat, though slightly expensive. Packaging was good and delivery was fast.',
    createdAt: '2024-01-11T09:15:00Z',
    helpful: 5
  },
  {
    _id: 'review3',
    userId: {
      name: 'Vikram Patel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    rating: 5,
    comment: 'Amazing organic wheat! Perfect for making rotis. Highly recommend this seller.',
    createdAt: '2024-01-10T16:20:00Z',
    helpful: 12
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  // Debug logging
  console.log('ProductDetailPage rendered with productId:', productId, 'type:', typeof productId);
  
  // Early return for invalid product IDs
  if (!productId || productId === 'undefined' || productId === 'null' || productId === '') {
    console.log('Invalid product ID detected, showing not found');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/farmers-market"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Farmers Market
          </Link>
        </div>
      </div>
    );
  }
  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  
  const { addToCart, isInCart } = useCart();

  // Create mock product instance
  const mockProduct = getMockProduct(productId || 'demo');

  useEffect(() => {
    console.log('ProductId received:', productId, 'Type:', typeof productId);
    
    // Check for invalid product IDs first
    if (!productId || productId === 'undefined' || productId === 'null' || productId === '') {
      console.log('Invalid product ID detected, setting product to null');
      setLoading(false);
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const response = await fetch(`/api/farmers-market/marketplace/${productId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProduct(data.listing);
          } else {
            throw new Error('Product not found');
          }
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.warn('Using mock data:', error);
        // Fallback to mock data with valid ID
        const fallbackProduct = getMockProduct(productId || 'demo');
        setProduct(fallbackProduct);
        setReviews(mockReviews);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product._id, quantity);
      // Show success message
      alert(`Added ${quantity} ${product.unit}(s) to cart`);
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
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
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolidIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderReviewStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolidIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/farmers-market"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Farmers Market
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/farmers-market" className="text-gray-500 hover:text-gray-700">
                Farmers Market
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-gray-500">{product.category}</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-gray-900 font-medium">{product.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {renderStars(product.rating.average)}
                      <span className="ml-1">{product.rating.average} ({product.rating.count})</span>
                    </div>
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      <span>{product.views} views</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleFavorite}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ShareIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-gray-600">per {product.unit}</span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{product.location.district}, {product.location.state}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Listed {formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {showFullDescription 
                  ? product.description 
                  : `${product.description.substring(0, 200)}...`
                }
              </p>
              {product.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-green-600 hover:text-green-700 font-medium mt-2"
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">({product.quantity} available)</span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart(product._id)}
                  className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
                    isInCart(product._id)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 inline" />
                  Contact Seller
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{product.sellerId.name}</span>
                      {product.sellerId.verified && (
                        <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center">
                      {renderStars(product.sellerId.rating.average)}
                      <span className="ml-1 text-sm text-gray-600">
                        {product.sellerId.rating.average} ({product.sellerId.rating.count} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{product.sellerId.location.village}, {product.sellerId.location.district}, {product.sellerId.location.state}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Member since {formatDate(product.sellerId.joinDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'details', label: 'Product Details' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'shipping', label: 'Shipping & Returns' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subcategory:</span>
                        <span className="font-medium">{product.subcategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity Available:</span>
                        <span className="font-medium">{product.quantity} {product.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minimum Order:</span>
                        <span className="font-medium">{product.minimumOrder} {product.unit}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">{formatPrice(product.price)} per {product.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Negotiable:</span>
                        <span className="font-medium">{product.negotiable ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          product.status === 'active' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Featured:</span>
                        <span className="font-medium">{product.featured ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {key}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    {renderStars(product.rating.average)}
                    <span className="text-sm text-gray-600">
                      {product.rating.average} out of 5 ({product.rating.count} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {review.userId.avatar ? (
                            <Image
                              src={review.userId.avatar}
                              alt={review.userId.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{review.userId.name}</h4>
                              <div className="flex items-center space-x-1">
                                {renderReviewStars(review.rating)}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{review.comment}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <button className="flex items-center space-x-1 hover:text-gray-700">
                              <span>Helpful ({review.helpful})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Shipping Details</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <TruckIcon className="h-4 w-4 mr-2" />
                            <span>Shipping Available: {product.shipping?.available ? 'Yes' : 'No'}</span>
                          </div>
                          {product.shipping?.available && (
                            <>
                              <div className="flex items-center">
                                <CurrencyRupeeIcon className="h-4 w-4 mr-2" />
                                <span>Shipping Cost: {formatPrice(product.shipping.cost)}</span>
                              </div>
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                <span>Estimated Delivery: {product.shipping.estimatedDays} days</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Payment Methods</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          {product.paymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              <span className="capitalize">{method.replace('_', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {product.returnPolicy && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Policy</h3>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <p className="text-gray-600">{product.returnPolicy}</p>
                    </div>
                  </div>
                )}

                {product.warranty && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Warranty</h3>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <p className="text-gray-600">{product.warranty}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Seller</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{product.sellerId.mobile}</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{product.sellerId.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {product.sellerId.location.village}, {product.sellerId.location.district}, {product.sellerId.location.state}
                </span>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href={`tel:${product.sellerId.mobile}`}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Report Product</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="fake">Fake Product</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Please provide more details..."
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Report submitted successfully');
                  setShowReportModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}