'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  ClockIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PresentationChartBarIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
  requirements: string[];
  whatYouWillLearn: string[];
}

const mockWorkshops: Workshop[] = [
  {
    id: '1',
    title: 'Organic Farming Workshop',
    description: 'Learn sustainable farming practices, soil health management, and organic certification processes.',
    instructor: 'Dr. Rajesh Kumar',
    date: '2024-02-15',
    time: '09:00 AM',
    duration: '6 hours',
    location: 'Agricultural Research Center, Delhi',
    maxParticipants: 50,
    currentParticipants: 32,
    price: 0,
    category: 'Organic Farming',
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 124,
    tags: ['organic', 'sustainable', 'certification'],
    requirements: ['Basic farming knowledge', 'Notebook and pen'],
    whatYouWillLearn: [
      'Soil health assessment and improvement',
      'Organic pest and disease management',
      'Certification process and requirements',
      'Marketing organic produce'
    ]
  },
  {
    id: '2',
    title: 'Modern Irrigation Techniques',
    description: 'Master water-efficient irrigation methods including drip irrigation, sprinkler systems, and smart farming.',
    instructor: 'Prof. Sunita Sharma',
    date: '2024-02-20',
    time: '10:00 AM',
    duration: '4 hours',
    location: 'Krishi Vigyan Kendra, Punjab',
    maxParticipants: 30,
    currentParticipants: 18,
    price: 500,
    category: 'Irrigation',
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 89,
    tags: ['irrigation', 'water-management', 'technology'],
    requirements: ['Farming experience', 'Calculator'],
    whatYouWillLearn: [
      'Drip irrigation system design',
      'Water usage optimization',
      'Smart irrigation controllers',
      'Cost-benefit analysis'
    ]
  },
  {
    id: '3',
    title: 'Digital Marketing for Farmers',
    description: 'Learn to market your produce online, build your brand, and reach customers directly.',
    instructor: 'Amit Patel',
    date: '2024-02-25',
    time: '02:00 PM',
    duration: '3 hours',
    location: 'Online Workshop',
    maxParticipants: 100,
    currentParticipants: 67,
    price: 0,
    category: 'Marketing',
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 156,
    tags: ['marketing', 'digital', 'online'],
    requirements: ['Smartphone or computer', 'Internet connection'],
    whatYouWillLearn: [
      'Social media marketing for farmers',
      'Building an online presence',
      'Direct-to-consumer sales',
      'Digital payment methods'
    ]
  },
  {
    id: '4',
    title: 'Livestock Health Management',
    description: 'Comprehensive training on animal health, disease prevention, and veterinary care basics.',
    instructor: 'Dr. Priya Singh',
    date: '2024-03-01',
    time: '09:30 AM',
    duration: '5 hours',
    location: 'Veterinary College, Mumbai',
    maxParticipants: 40,
    currentParticipants: 25,
    price: 800,
    category: 'Livestock',
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 203,
    tags: ['livestock', 'health', 'veterinary'],
    requirements: ['Livestock farming experience', 'Medical kit'],
    whatYouWillLearn: [
      'Common livestock diseases',
      'Preventive healthcare measures',
      'Basic veterinary procedures',
      'Nutrition and feeding management'
    ]
  },
  {
    id: '5',
    title: 'Government Schemes & Subsidies',
    description: 'Understand various government agricultural schemes, subsidies, and how to apply for them.',
    instructor: 'Rajesh Verma',
    date: '2024-03-05',
    time: '11:00 AM',
    duration: '3 hours',
    location: 'District Agriculture Office, UP',
    maxParticipants: 60,
    currentParticipants: 45,
    price: 0,
    category: 'Government Schemes',
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop',
    rating: 4.5,
    reviews: 78,
    tags: ['government', 'subsidies', 'schemes'],
    requirements: ['Aadhaar card', 'Bank account details'],
    whatYouWillLearn: [
      'PM-KISAN scheme details',
      'Crop insurance programs',
      'Equipment subsidy schemes',
      'Application process and documentation'
    ]
  },
  {
    id: '6',
    title: 'Precision Agriculture & IoT',
    description: 'Explore cutting-edge technologies like IoT sensors, drones, and data analytics in farming.',
    instructor: 'Dr. Vikram Mehta',
    date: '2024-03-10',
    time: '10:30 AM',
    duration: '6 hours',
    location: 'IIT Delhi Campus',
    maxParticipants: 25,
    currentParticipants: 12,
    price: 1500,
    category: 'Technology',
    level: 'advanced',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 45,
    tags: ['technology', 'IoT', 'precision-agriculture'],
    requirements: ['Basic computer knowledge', 'Smartphone'],
    whatYouWillLearn: [
      'IoT sensors for soil monitoring',
      'Drone technology in agriculture',
      'Data analytics and interpretation',
      'Smart farming automation'
    ]
  }
];

const categories = [
  'All',
  'Organic Farming',
  'Irrigation',
  'Marketing',
  'Livestock',
  'Government Schemes',
  'Technology'
];

const levels = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export default function WorkshopsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkshops = mockWorkshops.filter(workshop => {
    const matchesCategory = selectedCategory === 'All' || workshop.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || workshop.level === selectedLevel;
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `₹${price}`;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Training Workshops</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your farming skills with our comprehensive training programs. 
              Learn from experts and connect with fellow farmers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Workshops</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => (
            <div key={workshop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="h-48 bg-gray-100 relative">
                <Image
                  src={workshop.image}
                  alt={workshop.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workshop.price === 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {formatPrice(workshop.price)}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workshop.level === 'beginner' 
                      ? 'bg-green-100 text-green-800'
                      : workshop.level === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {workshop.level.charAt(0).toUpperCase() + workshop.level.slice(1)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{workshop.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{workshop.description}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {renderStars(workshop.rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {workshop.rating} ({workshop.reviews} reviews)
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>{workshop.instructor}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{formatDate(workshop.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{workshop.time} ({workshop.duration})</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{workshop.location}</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Participants</span>
                    <span>{workshop.currentParticipants}/{workshop.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(workshop.currentParticipants / workshop.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {workshop.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredWorkshops.length === 0 && (
          <div className="text-center py-16">
            <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No workshops found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new workshops.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('all');
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">
            We're constantly adding new workshops. Let us know what topics you'd like to learn about.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Suggest a Workshop
            </Link>
            <Link
              href="/training"
              className="px-6 py-3 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
            >
              View All Training
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
