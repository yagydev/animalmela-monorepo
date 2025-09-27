'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for listing detail
const mockListing = {
  id: '1',
  title: 'Premium Dog Food - Chicken & Rice',
  description: 'High-quality dry dog food made with real chicken and brown rice. Perfect for adult dogs of all sizes. Contains essential vitamins and minerals for optimal health. Made with natural ingredients and no artificial preservatives.',
  category: 'pet_food',
  subcategory: 'dry_food',
  price: 45.99,
  currency: 'USD',
  condition: 'new',
  quantity: 50,
  images: [
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400'
  ],
  tags: ['dog', 'food', 'premium', 'chicken', 'rice', 'natural'],
  seller: {
    id: 'seller1',
    name: 'Mike\'s Pet Store',
    verified: true,
    rating: 4.8,
    totalSales: 1250,
    joinDate: '2020-01-15',
    avatar: '/api/placeholder/100/100',
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA'
    },
    business_info: {
      business_name: 'Mike\'s Pet Store',
      business_type: 'retail'
    }
  },
  location: {
    address: '789 Pine St',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    pincode: '60601'
  },
  shipping_info: {
    available: true,
    cost: 5.99,
    estimated_days: 3,
    pickup_available: true
  },
  payment_methods: ['online', 'upi', 'card'],
  return_policy: '30-day return policy for unopened items',
  warranty: 'Manufacturer warranty included',
  specifications: {
    weight: '15 lbs',
    age_range: 'adult',
    breed_size: 'all_sizes',
    ingredients: 'chicken, brown rice, vegetables, vitamins',
    protein_content: '25%',
    fat_content: '12%',
    fiber_content: '4%',
    moisture_content: '10%'
  },
  status: 'active',
  featured: true,
  views: 1250,
  likes: 89,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:45:00Z'
};

const mockReviews = [
  {
    id: '1',
    reviewer: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/50/50',
      verified: true
    },
    rating: 5,
    comment: 'Excellent quality dog food! My dog loves it and his coat looks amazing.',
    date: '2024-01-18T09:15:00Z',
    helpful: 12
  },
  {
    id: '2',
    reviewer: {
      name: 'Mike Chen',
      avatar: '/api/placeholder/50/50',
      verified: false
    },
    rating: 4,
    comment: 'Good value for money. Shipping was fast and packaging was secure.',
    date: '2024-01-16T16:30:00Z',
    helpful: 8
  },
  {
    id: '3',
    reviewer: {
      name: 'Emily Davis',
      avatar: '/api/placeholder/50/50',
      verified: true
    },
    rating: 5,
    comment: 'My picky eater finally found a food he likes! Highly recommended.',
    date: '2024-01-14T11:45:00Z',
    helpful: 15
  }
];

export default function ListingDetailPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviews, setShowReviews] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBuyNow = () => {
    // Navigate to checkout or show order modal
    console.log('Buy now clicked', { listingId: mockListing.id, quantity });
  };

  const handleAddToCart = () => {
    // Add to cart functionality
    console.log('Add to cart clicked', { listingId: mockListing.id, quantity });
  };

  const handleContactSeller = () => {
    // Open contact seller modal or navigate to messages
    console.log('Contact seller clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/marketplace" className="text-gray-500 hover:text-gray-700">
              Marketplace
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/marketplace?category=${mockListing.category}`} className="text-gray-500 hover:text-gray-700">
              {mockListing.category.replace('_', ' ')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{mockListing.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-200">
                <Image
                  src={mockListing.images[selectedImage]}
                  alt={mockListing.title}
                  fill
                  className="object-cover"
                />
                {mockListing.featured && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm font-medium">
                    Featured
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {mockListing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${mockListing.title} ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{mockListing.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(mockListing.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                </button>
              </div>
              
              {showReviews && (
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-start space-x-3">
                        <Image
                          src={review.reviewer.avatar}
                          alt={review.reviewer.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{review.reviewer.name}</span>
                            {review.reviewer.verified && (
                              <span className="text-green-600 text-sm">✓</span>
                            )}
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{formatDate(review.date)}</span>
                            <button className="text-blue-600 hover:text-blue-700">
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Purchase Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-4">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(mockListing.price, mockListing.currency)}
                </div>
                {mockListing.shipping_info.available && (
                  <div className="text-sm text-gray-600">
                    + {formatPrice(mockListing.shipping_info.cost, mockListing.currency)} shipping
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={mockListing.quantity}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(mockListing.quantity, quantity + 1))}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {mockListing.quantity} available
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleContactSeller}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Contact Seller
                </button>
              </div>

              {/* Seller Info */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Seller Information</h3>
                <div className="flex items-center space-x-3 mb-3">
                  <Image
                    src={mockListing.seller.avatar}
                    alt={mockListing.seller.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{mockListing.seller.name}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-1">⭐</span>
                      {mockListing.seller.rating} ({mockListing.seller.totalSales} sales)
                      {mockListing.seller.verified && (
                        <span className="ml-1 text-green-600">✓</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div>📍 {mockListing.seller.location.city}, {mockListing.seller.location.state}</div>
                  <div>📅 Member since {formatDate(mockListing.seller.joinDate)}</div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">Additional Information</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Condition:</span>
                  <span className="ml-2 text-gray-900 capitalize">{mockListing.condition}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Payment Methods:</span>
                  <div className="mt-1">
                    {mockListing.payment_methods.map((method) => (
                      <span key={method} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                {mockListing.shipping_info.available && (
                  <div>
                    <span className="font-medium text-gray-700">Shipping:</span>
                    <div className="mt-1 text-gray-900">
                      {mockListing.shipping_info.estimated_days} days
                      {mockListing.shipping_info.pickup_available && (
                        <span className="ml-2 text-green-600">• Pickup available</span>
                      )}
                    </div>
                  </div>
                )}

                {mockListing.return_policy && (
                  <div>
                    <span className="font-medium text-gray-700">Return Policy:</span>
                    <div className="mt-1 text-gray-900">{mockListing.return_policy}</div>
                  </div>
                )}

                {mockListing.warranty && (
                  <div>
                    <span className="font-medium text-gray-700">Warranty:</span>
                    <div className="mt-1 text-gray-900">{mockListing.warranty}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
