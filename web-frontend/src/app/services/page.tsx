'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  HeartIcon,
  UserGroupIcon,
  ScissorsIcon,
  AcademicCapIcon,
  HomeIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  provider: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  features: string[];
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('rating');

  const categories = [
    { id: 'all', name: 'All Services', icon: UserGroupIcon },
    { id: 'sitting', name: 'Pet Sitting', icon: HomeIcon },
    { id: 'walking', name: 'Dog Walking', icon: UserGroupIcon },
    { id: 'grooming', name: 'Pet Grooming', icon: ScissorsIcon },
    { id: 'training', name: 'Pet Training', icon: AcademicCapIcon },
    { id: 'transport', name: 'Transportation', icon: TruckIcon },
  ];

  const mockServices: Service[] = [
    {
      id: '1',
      name: 'Professional Pet Sitting',
      description: 'In-home pet sitting with 24/7 care and daily updates',
      price: 45,
      rating: 4.9,
      reviews: 127,
      location: 'Downtown',
      image: '/images/services/pet-sitting.jpg',
      icon: HomeIcon,
      category: 'sitting',
      provider: {
        name: 'Sarah Johnson',
        avatar: '/images/avatars/sarah.jpg',
        verified: true
      },
      features: ['24/7 supervision', 'Daily updates', 'Medication administration']
    },
    {
      id: '2',
      name: 'Daily Dog Walking',
      description: 'Regular walks to keep your dog healthy and happy',
      price: 25,
      rating: 4.8,
      reviews: 89,
      location: 'Midtown',
      image: '/images/services/dog-walking.jpg',
      icon: UserGroupIcon,
      category: 'walking',
      provider: {
        name: 'Mike Chen',
        avatar: '/images/avatars/mike.jpg',
        verified: true
      },
      features: ['GPS tracking', 'Exercise & play', 'Socialization']
    },
    {
      id: '3',
      name: 'Premium Pet Grooming',
      description: 'Professional grooming services for all pets',
      price: 65,
      rating: 4.9,
      reviews: 156,
      location: 'Uptown',
      image: '/images/services/grooming.jpg',
      icon: ScissorsIcon,
      category: 'grooming',
      provider: {
        name: 'Emma Davis',
        avatar: '/images/avatars/emma.jpg',
        verified: true
      },
      features: ['Bath & brush', 'Nail trimming', 'Styling']
    },
    {
      id: '4',
      name: 'Expert Pet Training',
      description: 'Behavioral training and obedience classes',
      price: 80,
      rating: 4.7,
      reviews: 73,
      location: 'Westside',
      image: '/images/services/training.jpg',
      icon: AcademicCapIcon,
      category: 'training',
      provider: {
        name: 'David Wilson',
        avatar: '/images/avatars/david.jpg',
        verified: true
      },
      features: ['Behavioral training', 'Obedience classes', 'Puppy training']
    },
    {
      id: '5',
      name: 'Pet Transportation',
      description: 'Safe and comfortable pet transportation services',
      price: 35,
      rating: 4.8,
      reviews: 45,
      location: 'Eastside',
      image: '/images/services/transport.jpg',
      icon: TruckIcon,
      category: 'transport',
      provider: {
        name: 'Lisa Rodriguez',
        avatar: '/images/avatars/lisa.jpg',
        verified: true
      },
      features: ['Vet visits', 'Airport pickup', 'Emergency transport']
    },
  ];

  useEffect(() => {
    setServices(mockServices);
    setFilteredServices(mockServices);
  }, []);

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  useEffect(() => {
    let filtered = services;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(service =>
        service.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(service =>
      service.price >= priceRange[0] && service.price <= priceRange[1]
    );

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory, selectedLocation, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Pet Services</h1>
          <p className="text-gray-600">Discover trusted pet care professionals in your area</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Services
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search services..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    placeholder="Enter location..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {filteredServices.length} services found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <div 
                  key={service.id} 
                  onClick={() => handleServiceClick(service.id)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
                >
                  {/* Service Image */}
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <service.icon className="h-16 w-16 text-primary-600" />
                  </div>

                  {/* Service Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <HeartIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="text-gray-600 mb-4">{service.description}</p>

                    {/* Provider Info */}
                    <div className="flex items-center mb-4">
                      <img
                        src={service.provider.avatar}
                        alt={service.provider.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.provider.name}</p>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{service.location}</span>
                          {service.provider.verified && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rating and Price */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({service.reviews} reviews)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary-600">${service.price}</span>
                        <span className="text-sm text-gray-500">/service</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/services/${service.id}`}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        <span>View Details</span>
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedLocation('');
                    setPriceRange([0, 1000]);
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
