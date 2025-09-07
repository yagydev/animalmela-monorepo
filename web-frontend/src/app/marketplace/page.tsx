'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for marketplace listings including livestock
const mockListings = [
  {
    id: '1',
    title: 'Premium Dog Food - Chicken & Rice',
    description: 'High-quality dry dog food made with real chicken and brown rice.',
    category: 'pet_food',
    subcategory: 'dry_food',
    price: 45.99,
    currency: 'USD',
    condition: 'new',
    quantity: 50,
    images: ['/api/placeholder/300/200'],
    tags: ['dog', 'food', 'premium', 'chicken'],
    seller: {
      id: 'seller1',
      name: 'Mike\'s Pet Store',
      verified: true,
      rating: 4.8
    },
    location: {
      city: 'Chicago',
      state: 'IL'
    },
    shipping_info: {
      available: true,
      cost: 5.99,
      estimated_days: 3
    },
    status: 'active',
    featured: true,
    views: 1250,
    likes: 89
  },
  {
    id: 'livestock-1',
    title: 'Holstein Dairy Cow - High Milk Yield',
    description: 'Healthy Holstein cow, 3 years old, producing 25-30 liters of milk daily. Vaccinated and health certified.',
    category: 'livestock',
    subcategory: 'cows',
    price: 85000,
    currency: 'INR',
    condition: 'new',
    quantity: 1,
    images: ['/api/placeholder/300/200'],
    tags: ['cow', 'dairy', 'holstein', 'milk'],
    seller: {
      id: 'farmer1',
      name: 'Green Valley Farm',
      verified: true,
      rating: 4.9,
      user_type: 'livestock_seller'
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India'
    },
    livestock_details: {
      breed_type: 'Dairy',
      age_months: 36,
      weight_kg: 450,
      health_status: 'excellent',
      milk_yield: {
        daily_liters: 28,
        monthly_liters: 840
      },
      breeding_status: 'active',
      vaccination_status: 'up_to_date',
      health_certificate: {
        available: true,
        certificate_number: 'HC-2024-001',
        expiry_date: '2025-12-31'
      },
      delivery_available: true,
      transport_included: false,
      insurance_available: true,
      veterinary_checkup: true
    },
    promotion: {
      is_featured: true,
      is_hot_deal: false
    },
    status: 'active',
    views: 2150,
    likes: 156
  },
  {
    id: 'livestock-2',
    title: 'Murrah Buffalo - Premium Breed',
    description: 'Pure Murrah buffalo, 4 years old, excellent milk production. Comes with health certificate and vaccination records.',
    category: 'livestock',
    subcategory: 'buffalo',
    price: 95000,
    currency: 'INR',
    condition: 'new',
    quantity: 1,
    images: ['/api/placeholder/300/200'],
    tags: ['buffalo', 'murrah', 'dairy', 'premium'],
    seller: {
      id: 'farmer2',
      name: 'Royal Dairy Farm',
      verified: true,
      rating: 4.7,
      user_type: 'livestock_seller'
    },
    location: {
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India'
    },
    livestock_details: {
      breed_type: 'Dairy',
      age_months: 48,
      weight_kg: 520,
      health_status: 'excellent',
      milk_yield: {
        daily_liters: 22,
        monthly_liters: 660
      },
      breeding_status: 'active',
      vaccination_status: 'up_to_date',
      health_certificate: {
        available: true,
        certificate_number: 'HC-2024-002',
        expiry_date: '2025-11-30'
      },
      delivery_available: true,
      transport_included: true,
      insurance_available: true,
      veterinary_checkup: true
    },
    promotion: {
      is_featured: false,
      is_hot_deal: true,
      discount_percentage: 10,
      original_price: 105000
    },
    status: 'active',
    views: 1890,
    likes: 134
  },
  {
    id: '2',
    title: 'Interactive Cat Toy - Laser Pointer',
    description: 'Automatic laser pointer toy that keeps your cat entertained for hours.',
    category: 'pet_toys',
    subcategory: 'interactive_toys',
    price: 29.99,
    currency: 'USD',
    condition: 'new',
    quantity: 25,
    images: ['/api/placeholder/300/200'],
    tags: ['cat', 'toy', 'laser', 'interactive'],
    seller: {
      id: 'seller1',
      name: 'Mike\'s Pet Store',
      verified: true,
      rating: 4.8
    },
    location: {
      city: 'Chicago',
      state: 'IL'
    },
    shipping_info: {
      available: true,
      cost: 4.99,
      estimated_days: 2
    },
    status: 'active',
    featured: false,
    views: 890,
    likes: 45
  },
  {
    id: '3',
    title: 'Golden Retriever Puppy - 8 weeks old',
    description: 'Purebred Golden Retriever puppy, 8 weeks old, fully vaccinated.',
    category: 'pets',
    subcategory: 'dogs',
    price: 1200.00,
    currency: 'USD',
    condition: 'new',
    quantity: 1,
    images: ['/api/placeholder/300/200'],
    tags: ['dog', 'puppy', 'golden_retriever', 'purebred'],
    seller: {
      id: 'breeder1',
      name: 'Sarah\'s Breeding Farm',
      verified: true,
      rating: 4.9
    },
    location: {
      city: 'Miami',
      state: 'FL'
    },
    shipping_info: {
      available: false,
      cost: 0,
      estimated_days: 0
    },
    status: 'active',
    featured: true,
    views: 2100,
    likes: 156
  },
  {
    id: '4',
    title: 'Professional Dog Grooming Kit',
    description: 'Complete grooming kit for professional and home use.',
    category: 'pet_grooming',
    subcategory: 'grooming_kits',
    price: 89.99,
    currency: 'USD',
    condition: 'new',
    quantity: 15,
    images: ['/api/placeholder/300/200'],
    tags: ['grooming', 'kit', 'professional', 'clippers'],
    seller: {
      id: 'seller1',
      name: 'Mike\'s Pet Store',
      verified: true,
      rating: 4.8
    },
    location: {
      city: 'Chicago',
      state: 'IL'
    },
    shipping_info: {
      available: true,
      cost: 7.99,
      estimated_days: 4
    },
    status: 'active',
    featured: false,
    views: 650,
    likes: 32
  }
];

const categories = [
  { value: 'all', label: 'All Categories', icon: '🐾' },
  { value: 'pets', label: 'Pets', icon: '🐕' },
  { value: 'livestock', label: 'Livestock', icon: '🐄' },
  { value: 'poultry', label: 'Poultry', icon: '🐔' },
  { value: 'pet_food', label: 'Pet Food', icon: '🍖' },
  { value: 'livestock_feed', label: 'Livestock Feed', icon: '🌾' },
  { value: 'pet_toys', label: 'Pet Toys', icon: '🎾' },
  { value: 'pet_accessories', label: 'Accessories', icon: '🦮' },
  { value: 'livestock_equipment', label: 'Livestock Equipment', icon: '🔧' },
  { value: 'pet_health', label: 'Health', icon: '💊' },
  { value: 'pet_grooming', label: 'Grooming', icon: '✂️' },
  { value: 'pet_training', label: 'Training', icon: '🎓' },
  { value: 'livestock_services', label: 'Livestock Services', icon: '🚛' }
];

export default function MarketplacePage() {
  const router = useRouter();
  const [listings, setListings] = useState(mockListings);
  const [filteredListings, setFilteredListings] = useState(mockListings);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  // Livestock-specific filters
  const [livestockFilters, setLivestockFilters] = useState({
    species: '',
    indianBreed: '',
    breedType: '',
    ageMin: '',
    ageMax: '',
    weightMin: '',
    weightMax: '',
    healthStatus: '',
    milkYieldMin: '',
    milkYieldMax: '',
    breedingStatus: '',
    vaccinationStatus: '',
    verificationStatus: '',
    deliveryAvailable: false,
    transportIncluded: false,
    insuranceAvailable: false,
    veterinaryCheckup: false
  });

  // Indian livestock breeds
  const indianBreeds = {
    cattle: {
      dairy: ['Gir', 'Sahiwal', 'Red Sindhi', 'Tharparkar', 'Rathi', 'Kankrej', 'Ongole'],
      dual_purpose: ['Hariana', 'Kankrej', 'Ongole', 'Deoni'],
      meat: ['Hallikar', 'Amritmahal', 'Kangayam']
    },
    buffalo: ['Murrah', 'Nili-Ravi', 'Surti', 'Jaffarabadi', 'Mehsana', 'Bhadawari'],
    goat: ['Boer', 'Jamnapari', 'Barbari', 'Beetal', 'Osmanabadi', 'Malabari', 'Sirohi'],
    sheep: ['Marwari', 'Nali', 'Chokla', 'Magra', 'Patanwadi', 'Malpura']
  };

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

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(listing => {
        const price = listing.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Livestock-specific filters
    if (selectedCategory === 'livestock' || selectedCategory === 'poultry') {
      filtered = filtered.filter(listing => {
        if (!listing.livestock_details) return false;

        const details = listing.livestock_details;
        
        // Breed type filter
        if (livestockFilters.breedType && details.breed_type !== livestockFilters.breedType) {
          return false;
        }

        // Age filter
        if (livestockFilters.ageMin && details.age_months < parseInt(livestockFilters.ageMin)) {
          return false;
        }
        if (livestockFilters.ageMax && details.age_months > parseInt(livestockFilters.ageMax)) {
          return false;
        }

        // Weight filter
        if (livestockFilters.weightMin && details.weight_kg < parseFloat(livestockFilters.weightMin)) {
          return false;
        }
        if (livestockFilters.weightMax && details.weight_kg > parseFloat(livestockFilters.weightMax)) {
          return false;
        }

        // Health status filter
        if (livestockFilters.healthStatus && details.health_status !== livestockFilters.healthStatus) {
          return false;
        }

        // Milk yield filter
        if (livestockFilters.milkYieldMin && details.milk_yield?.daily_liters < parseFloat(livestockFilters.milkYieldMin)) {
          return false;
        }
        if (livestockFilters.milkYieldMax && details.milk_yield?.daily_liters > parseFloat(livestockFilters.milkYieldMax)) {
          return false;
        }

        // Breeding status filter
        if (livestockFilters.breedingStatus && details.breeding_status !== livestockFilters.breedingStatus) {
          return false;
        }

        // Vaccination status filter
        if (livestockFilters.vaccinationStatus && details.vaccination_status !== livestockFilters.vaccinationStatus) {
          return false;
        }

        // Service availability filters
        if (livestockFilters.deliveryAvailable && !details.delivery_available) {
          return false;
        }
        if (livestockFilters.transportIncluded && !details.transport_included) {
          return false;
        }
        if (livestockFilters.insuranceAvailable && !details.insurance_available) {
          return false;
        }
        if (livestockFilters.veterinaryCheckup && !details.veterinary_checkup) {
          return false;
        }

        return true;
      });
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
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'popular':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  }, [listings, selectedCategory, searchTerm, sortBy, priceRange, livestockFilters]);

  const handleListingClick = (listingId: string) => {
    router.push(`/marketplace/${listingId}`);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="mt-2 text-gray-600">Find everything your pet needs</p>
            </div>
            <Link
              href="/marketplace/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sell Item
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search listings..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Livestock-specific filters */}
              {(selectedCategory === 'livestock' || selectedCategory === 'poultry') && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Livestock Filters</h4>
                  
                  {/* Breed Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Breed Type
                    </label>
                    <select
                      value={livestockFilters.breedType}
                      onChange={(e) => setLivestockFilters({ ...livestockFilters, breedType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Breeds</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Meat">Meat</option>
                      <option value="Dual-purpose">Dual-purpose</option>
                    </select>
                  </div>

                  {/* Age Range */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age (months)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={livestockFilters.ageMin}
                        onChange={(e) => setLivestockFilters({ ...livestockFilters, ageMin: e.target.value })}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={livestockFilters.ageMax}
                        onChange={(e) => setLivestockFilters({ ...livestockFilters, ageMax: e.target.value })}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Weight Range */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={livestockFilters.weightMin}
                        onChange={(e) => setLivestockFilters({ ...livestockFilters, weightMin: e.target.value })}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={livestockFilters.weightMax}
                        onChange={(e) => setLivestockFilters({ ...livestockFilters, weightMax: e.target.value })}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Health Status */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Health Status
                    </label>
                    <select
                      value={livestockFilters.healthStatus}
                      onChange={(e) => setLivestockFilters({ ...livestockFilters, healthStatus: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Health Status</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>

                  {/* Milk Yield Range */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Milk Yield (liters)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={livestockFilters.milkYieldMin}
                        onChange={(e) => setLivestockFilters({ ...livestockFilters, milkYieldMin: e.target.value })}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={livestockFilters.milkYieldMax}
                        onChange={(e) => setLivestockFilters({ ...livestockFilters, milkYieldMax: e.target.value })}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Service Options */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services Available
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={livestockFilters.deliveryAvailable}
                          onChange={(e) => setLivestockFilters({ ...livestockFilters, deliveryAvailable: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Delivery Available</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={livestockFilters.transportIncluded}
                          onChange={(e) => setLivestockFilters({ ...livestockFilters, transportIncluded: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Transport Included</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={livestockFilters.insuranceAvailable}
                          onChange={(e) => setLivestockFilters({ ...livestockFilters, insuranceAvailable: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Insurance Available</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={livestockFilters.veterinaryCheckup}
                          onChange={(e) => setLivestockFilters({ ...livestockFilters, veterinaryCheckup: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Veterinary Checkup</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="likes">Most Liked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredListings.length} listings found
                </h2>
                {selectedCategory !== 'all' && (
                  <p className="text-gray-600">
                    in {categories.find(c => c.value === selectedCategory)?.label}
                  </p>
                )}
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => handleListingClick(listing.id)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {listing.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Featured
                      </div>
                    )}
                    {listing.promotion?.is_hot_deal && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Hot Deal
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                      {listing.condition}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                        {listing.title}
                      </h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(listing.price, listing.currency)}
                        </div>
                        {listing.shipping_info?.available && (
                          <div className="text-xs text-gray-500">
                            +{formatPrice(listing.shipping_info.cost, listing.currency)} shipping
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {listing.description}
                    </p>

                    {/* Livestock-specific information */}
                    {listing.livestock_details && (
                      <div className="mb-3 p-3 bg-green-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium text-gray-700">Age:</span>
                            <span className="text-gray-600 ml-1">{listing.livestock_details.age_months} months</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Weight:</span>
                            <span className="text-gray-600 ml-1">{listing.livestock_details.weight_kg} kg</span>
                          </div>
                          {listing.livestock_details.milk_yield?.daily_liters && (
                            <div>
                              <span className="font-medium text-gray-700">Milk Yield:</span>
                              <span className="text-gray-600 ml-1">{listing.livestock_details.milk_yield.daily_liters}L/day</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">Health:</span>
                            <span className={`ml-1 capitalize ${
                              listing.livestock_details.health_status === 'excellent' ? 'text-green-600' :
                              listing.livestock_details.health_status === 'good' ? 'text-blue-600' :
                              listing.livestock_details.health_status === 'fair' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {listing.livestock_details.health_status}
                            </span>
                          </div>
                        </div>
                        
                        {/* Service badges */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {listing.livestock_details.delivery_available && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">🚚 Delivery</span>
                          )}
                          {listing.livestock_details.transport_included && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">🚛 Transport</span>
                          )}
                          {listing.livestock_details.insurance_available && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">🛡️ Insurance</span>
                          )}
                          {listing.livestock_details.veterinary_checkup && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">🏥 Vet Check</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Seller Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {listing.seller.name}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-1">⭐</span>
                            {listing.seller.rating}
                            {listing.seller.verified && (
                              <span className="ml-1 text-green-600">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {listing.location.city}, {listing.location.state}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-1">👁️</span>
                        {listing.views} views
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">❤️</span>
                        {listing.likes} likes
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">📦</span>
                        {listing.quantity} available
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or browse all categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
