'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface Listing {
  _id: string;
  name: string;
  description: string;
  category: 'equipment' | 'livestock' | 'product';
  condition: 'new' | 'used';
  price: number;
  images: string[];
  location: string;
  sellerId: string;
  sellerName?: string;
  createdAt: string;
  featured: boolean;
}

interface MarketplaceData {
  data: Listing[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

const categoryInfo = {
  equipment: {
    name: 'Agricultural Equipment',
    icon: '🚜',
    description: 'Farm machinery, tools, and equipment for agricultural operations',
    placeholder: 'Search tractors, harvesters, irrigation systems...'
  },
  livestock: {
    name: 'Livestock & Cattle',
    icon: '🐄',
    description: 'Cattle, poultry, and other farm animals',
    placeholder: 'Search cows, buffaloes, goats, chickens...'
  },
  product: {
    name: 'Agricultural Produce',
    icon: '🌾',
    description: 'Fresh fruits, vegetables, grains, and other farm produce',
    placeholder: 'Search wheat, rice, vegetables, fruits...'
  }
};

const conditions = [
  { id: 'all', name: 'All Conditions' },
  { id: 'new', name: 'New' },
  { id: 'used', name: 'Used' },
];

const sortOptions = [
  { id: 'createdAt', name: 'Latest First' },
  { id: 'price-asc', name: 'Price: Low to High' },
  { id: 'price-desc', name: 'Price: High to Low' },
  { id: 'name', name: 'Name: A to Z' },
];

export default function CategoryMarketplacePage() {
  const params = useParams();
  const category = params.category as string;
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);

  // Validate category
  if (!categoryInfo[category as keyof typeof categoryInfo]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
          <Link
            href="/marketplace"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const categoryData = categoryInfo[category as keyof typeof categoryInfo];

  // Fetch listings
  const fetchListings = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedCondition !== 'all') params.append('condition', selectedCondition);
      if (searchQuery) params.append('search', searchQuery);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (location) params.append('location', location);
      if (sortBy) params.append('sortBy', sortBy);
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await fetch(`/api/marketplace/${category}?${params.toString()}`);
      const result: MarketplaceData = await response.json();

      if (result.success) {
        setListings(result.data);
        setPagination(result.pagination);
        setCurrentPage(page);
      } else {
        setError('Failed to fetch listings');
      }
    } catch (err) {
      setError('Failed to fetch listings');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(1);
  }, [selectedCondition, searchQuery, minPrice, maxPrice, location, sortBy]);

  const handleSearch = () => {
    fetchListings(1);
  };

  const handlePageChange = (page: number) => {
    fetchListings(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCondition('all');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
    setSortBy('createdAt');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Link
                  href="/marketplace"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Marketplace
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm text-gray-600">{categoryData.name}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">{categoryData.icon}</span>
                {categoryData.name}
              </h1>
              <p className="mt-2 text-gray-600">{categoryData.description}</p>
            </div>
            <div className="mt-4 lg:mt-0">
              <Link
                href={`/marketplace/sell?category=${category}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                <span className="mr-2">📝</span>
                Sell {categoryData.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={categoryData.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Search Button */}
            <div>
              <button
                onClick={handleSearch}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Advanced Filters
            </button>
            
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {conditions.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sort and Results */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {pagination ? `${pagination.totalCount} items found` : 'Loading...'}
            </span>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={() => fetchListings(currentPage)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && listings.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing._id}
                  href={`/marketplace/${listing.category}/${listing._id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={listing.images[0] || '/images/placeholder.jpg'}
                      alt={listing.name}
                      className="w-full h-48 object-cover"
                    />
                    {listing.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                      {listing.condition.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {listing.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        ₹{listing.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {listing.location}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded-lg ${
                          page === currentPage
                            ? 'bg-green-600 text-white border-green-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <span className="text-6xl">{categoryData.icon}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {categoryData.name.toLowerCase()} found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or check back later for new listings.
            </p>
            <div className="space-x-4">
              <button
                onClick={clearFilters}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Clear Filters
              </button>
              <Link
                href={`/marketplace/sell?category=${category}`}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg inline-block"
              >
                Sell {categoryData.name}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
