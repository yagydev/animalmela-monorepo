'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';
import { ProductCard, useCart, useFavorites } from './ProductCard';
import { CartItem } from './CartItem';

// Farmer Registration Component
export function FarmerRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    otp: '',
    role: 'farmer'
  });
  const [step, setStep] = useState(1); // 1: Basic info, 2: OTP verification, 3: Profile setup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/farmers-market/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.mobile, type: 'registration' })
      });
      
      const data = await response.json();
      if (data.success) {
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to send OTP');
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/farmers-market/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setStep(3);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Registration failed');
    }
    setLoading(false);
  };

  const completeProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farmers-market/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          location: {
            state: 'Punjab',
            district: 'Ludhiana',
            pincode: '141001',
            village: 'Test Village'
          },
          paymentPreferences: {
            preferredMethods: ['upi', 'bank_transfer'],
            upiId: 'farmer@upi'
          }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        window.location.href = '/farmers-market/dashboard';
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Profile setup failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join Farmers' Market
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Register as a farmer to sell your products
          </p>
        </div>

        {step === 1 && (
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="button"
              onClick={sendOTP}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="button"
              onClick={verifyOTP}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Register'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Complete Your Profile</h3>
              <p className="mt-2 text-sm text-gray-600">
                Set up your location and payment preferences
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="button"
              onClick={completeProfile}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Complete Profile'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Listing Form Component
export function ProductListingForm({ onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    unit: 'kg',
    quantity: '',
    quality: {
      grade: 'premium',
      organic: false,
      certified: false
    },
    images: [],
    location: {
      state: '',
      district: '',
      pincode: ''
    },
    ...initialData
  });

  const categories = [
    { value: 'crops', label: 'Crops', subcategories: ['wheat', 'rice', 'corn', 'sugarcane'] },
    { value: 'livestock', label: 'Livestock', subcategories: ['cattle', 'goats', 'sheep', 'poultry'] },
    { value: 'seeds', label: 'Seeds', subcategories: ['vegetable', 'flower', 'fruit', 'grain'] },
    { value: 'equipment', label: 'Equipment', subcategories: ['tractor', 'harvester', 'irrigation', 'tools'] }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farmers-market/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        onSave && onSave(data.listing);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to save listing');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subcategory</label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select Subcategory</option>
            {formData.category && categories.find(cat => cat.value === formData.category)?.subcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="kg">Kilogram</option>
            <option value="quintal">Quintal</option>
            <option value="ton">Ton</option>
            <option value="piece">Piece</option>
            <option value="head">Head</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Available Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Quality Grade</label>
          <select
            name="quality.grade"
            value={formData.quality.grade}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="premium">Premium</option>
            <option value="standard">Standard</option>
            <option value="economy">Economy</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="quality.organic"
            checked={formData.quality.organic}
            onChange={handleInputChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Organic</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="quality.certified"
            checked={formData.quality.certified}
            onChange={handleInputChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Certified</label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {initialData ? 'Update Listing' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
}

// Marketplace Browsing Component
export function MarketplaceBrowser() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'newest'
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();

  const fetchListings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.page.toString()
      });
      
      const response = await fetch(`/api/farmers-market/marketplace?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setListings(data.listings);
        setPagination(data.pagination);
      } else {
        // Show demo data if API fails or returns empty
        setListings([
          {
            _id: 'demo1',
            title: 'Fresh Organic Wheat',
            description: 'Premium quality organic wheat grown without pesticides. Perfect for making bread and other baked goods.',
            price: 2500,
            unit: 'quintal',
            quantity: 10,
            category: 'crops',
            images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
            sellerId: { name: 'Rajesh Kumar', _id: 'seller1' },
            location: { state: 'Punjab', district: 'Ludhiana' },
            rating: 4.5,
            totalRatings: 23,
            negotiable: true,
            minimumOrder: 1
          },
          {
            _id: 'demo2',
            title: 'Premium Rice',
            description: 'High-quality basmati rice with excellent aroma and taste. Perfect for daily consumption.',
            price: 3000,
            unit: 'quintal',
            quantity: 5,
            category: 'crops',
            images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'],
            sellerId: { name: 'Priya Sharma', _id: 'seller2' },
            location: { state: 'Haryana', district: 'Karnal' },
            rating: 4.8,
            totalRatings: 15,
            negotiable: false,
            minimumOrder: 1
          },
          {
            _id: 'demo3',
            title: 'Fresh Tomatoes',
            description: 'Fresh, juicy tomatoes perfect for cooking and salads. Picked daily from our farm.',
            price: 150,
            unit: 'kg',
            quantity: 50,
            category: 'crops',
            images: ['https://images.unsplash.com/photo-1546470427-5c4b1b4b8b8b?w=300&h=200&fit=crop'],
            sellerId: { name: 'Amit Singh', _id: 'seller3' },
            location: { state: 'Uttar Pradesh', district: 'Meerut' },
            rating: 4.2,
            totalRatings: 8,
            negotiable: true,
            minimumOrder: 5
          },
          {
            _id: 'demo4',
            title: 'Fresh Milk',
            description: 'Pure, fresh milk from healthy cows. Delivered daily to your doorstep.',
            price: 800,
            unit: 'liter',
            quantity: 20,
            category: 'livestock',
            images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop'],
            sellerId: { name: 'Sunita Devi', _id: 'seller4' },
            location: { state: 'Rajasthan', district: 'Jaipur' },
            rating: 4.6,
            totalRatings: 12,
            negotiable: false,
            minimumOrder: 1
          }
        ]);
        setPagination({ page: 1, total: 4, pages: 1 });
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      // Show demo data on error
      setListings([
        {
          _id: 'demo1',
          title: 'Fresh Organic Wheat',
          description: 'Premium quality organic wheat grown without pesticides.',
          price: 2500,
          unit: 'quintal',
          quantity: 10,
          category: 'crops',
          images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
          sellerId: { name: 'Rajesh Kumar', _id: 'seller1' },
          location: { state: 'Punjab', district: 'Ludhiana' },
          rating: 4.5,
          totalRatings: 23,
          negotiable: true,
          minimumOrder: 1
        }
      ]);
      setPagination({ page: 1, total: 1, pages: 1 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, [filters, pagination.page]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAddToCart = async (listingId: string, quantity: number = 1) => {
    try {
      await addToCart(listingId, quantity);
      // Show success message or update UI
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart');
    }
  };

  const handleToggleFavorite = async (listingId: string) => {
    try {
      await toggleFavorite(listingId);
    } catch (error: any) {
      alert(error.message || 'Failed to update favorites');
    }
  };

  const handleViewDetails = (listingId: string) => {
    router.push(`/farmers-market/product/${listingId}`);
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Categories</option>
              <option value="crops">Crops</option>
              <option value="livestock">Livestock</option>
              <option value="seeds">Seeds</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Min price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Max price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="State/District"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>
      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading products...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-8xl mb-6">🌾</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h3>
          <p className="text-lg text-gray-600 mb-6">Try adjusting your filters or check back later for new listings</p>
          <button
            onClick={() => setFilters({ category: '', subcategory: '', minPrice: '', maxPrice: '', location: '', sortBy: 'newest' })}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing: any) => (
            <ProductCard
              key={listing._id}
              listing={listing}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewDetails}
              isInCart={isInCart(listing._id)}
              isFavorite={isFavorite(listing._id)}
              variant="default"
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === pagination.page
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

// Shopping Cart Component
export function ShoppingCart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Show demo cart data when not logged in
        setCart({
          items: [
            {
              listingId: 'demo1',
              quantity: 2,
              unitPrice: 2500,
              totalPrice: 5000,
              listingId: {
                _id: 'demo1',
                title: 'Fresh Organic Wheat',
                unit: 'quintal',
                images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
                sellerId: { name: 'Rajesh Kumar' },
                category: 'crops'
              }
            },
            {
              listingId: 'demo2',
              quantity: 1,
              unitPrice: 3000,
              totalPrice: 3000,
              listingId: {
                _id: 'demo2',
                title: 'Premium Rice',
                unit: 'quintal',
                images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'],
                sellerId: { name: 'Priya Sharma' },
                category: 'crops'
              }
            },
            {
              listingId: 'demo3',
              quantity: 3,
              unitPrice: 150,
              totalPrice: 450,
              listingId: {
                _id: 'demo3',
                title: 'Fresh Tomatoes',
                unit: 'kg',
                images: ['https://images.unsplash.com/photo-1546470427-5c4b1b4b8b8b?w=300&h=200&fit=crop'],
                sellerId: { name: 'Amit Singh' },
                category: 'crops'
              }
            }
          ],
          totalAmount: 8450,
          itemCount: 3
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/farmers-market/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      } else {
        // Show demo data if API fails
        setCart({
          items: [
            {
              listingId: 'demo1',
              quantity: 2,
              unitPrice: 2500,
              totalPrice: 5000,
              listingId: {
                _id: 'demo1',
                title: 'Fresh Organic Wheat',
                unit: 'quintal',
                images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
                sellerId: { name: 'Rajesh Kumar' },
                category: 'crops'
              }
            },
            {
              listingId: 'demo2',
              quantity: 1,
              unitPrice: 3000,
              totalPrice: 3000,
              listingId: {
                _id: 'demo2',
                title: 'Premium Rice',
                unit: 'quintal',
                images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'],
                sellerId: { name: 'Priya Sharma' },
                category: 'crops'
              }
            }
          ],
          totalAmount: 8000,
          itemCount: 2
        });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Show demo data on error
      setCart({
        items: [
          {
            listingId: 'demo1',
            quantity: 1,
            unitPrice: 2500,
            totalPrice: 2500,
            listingId: {
              _id: 'demo1',
              title: 'Fresh Organic Wheat',
              unit: 'quintal',
              images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
              sellerId: { name: 'Rajesh Kumar' },
              category: 'crops'
            }
          }
        ],
        totalAmount: 2500,
        itemCount: 1
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (listingId: string) => {
    // Implementation for removing item from cart
    fetchCart(); // Refresh cart
  };

  const updateQuantity = async (listingId: string, quantity: number) => {
    // Implementation for updating quantity
    fetchCart(); // Refresh cart
  };

  const proceedToCheckout = () => {
    window.location.href = '/farmers-market/checkout';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-2 text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-4">Add some products from the marketplace</p>
        <a
          href="/farmers-market"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {cart.items.map((item: any) => (
            <CartItem
              key={item.listingId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              variant="default"
            />
          ))}
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-medium text-gray-900">
                Total: ₹{cart.totalAmount}
              </p>
              <p className="text-sm text-gray-600">
                {cart.itemCount} items
              </p>
            </div>
            
            <button
              onClick={proceedToCheckout}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
