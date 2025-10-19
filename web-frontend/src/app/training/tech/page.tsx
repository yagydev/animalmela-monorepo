'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  CpuChipIcon,
  CloudIcon,
  ChartBarIcon,
  CogIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  PlayIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface TechResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'tool';
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  author: string;
  publishDate: string;
  views: number;
  rating: number;
  tags: string[];
  content: string;
}

const mockTechResources: TechResource[] = [
  {
    id: '1',
    title: 'IoT Sensors for Smart Farming',
    description: 'Learn how to implement IoT sensors for monitoring soil moisture, temperature, and crop health.',
    type: 'article',
    category: 'IoT & Sensors',
    duration: '15 min read',
    difficulty: 'intermediate',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
    author: 'Dr. Vikram Mehta',
    publishDate: '2024-01-15',
    views: 1250,
    rating: 4.8,
    tags: ['IoT', 'sensors', 'monitoring', 'automation'],
    content: 'Comprehensive guide on implementing IoT sensors in agricultural settings...'
  },
  {
    id: '2',
    title: 'Drone Technology in Agriculture',
    description: 'Master the use of drones for crop monitoring, spraying, and field analysis.',
    type: 'video',
    category: 'Drones & UAVs',
    duration: '45 min',
    difficulty: 'beginner',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop',
    author: 'Capt. Rajesh Singh',
    publishDate: '2024-01-20',
    views: 2100,
    rating: 4.7,
    tags: ['drones', 'monitoring', 'spraying', 'aerial'],
    content: 'Step-by-step video tutorial on drone operations in agriculture...'
  },
  {
    id: '3',
    title: 'Machine Learning for Crop Prediction',
    description: 'Use AI and machine learning to predict crop yields and optimize farming decisions.',
    type: 'course',
    category: 'AI & Machine Learning',
    duration: '3 hours',
    difficulty: 'advanced',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
    author: 'Prof. Sunita Sharma',
    publishDate: '2024-01-25',
    views: 890,
    rating: 4.9,
    tags: ['AI', 'machine learning', 'prediction', 'analytics'],
    content: 'Comprehensive course on applying machine learning in agriculture...'
  },
  {
    id: '4',
    title: 'Blockchain in Supply Chain',
    description: 'Understand how blockchain technology can improve agricultural supply chain transparency.',
    type: 'article',
    category: 'Blockchain',
    duration: '20 min read',
    difficulty: 'intermediate',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
    author: 'Amit Patel',
    publishDate: '2024-02-01',
    views: 1560,
    rating: 4.6,
    tags: ['blockchain', 'supply chain', 'transparency', 'traceability'],
    content: 'Exploring blockchain applications in agricultural supply chains...'
  },
  {
    id: '5',
    title: 'Precision Agriculture Tools',
    description: 'Comprehensive guide to precision agriculture tools and technologies.',
    type: 'tool',
    category: 'Precision Agriculture',
    duration: '30 min',
    difficulty: 'beginner',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
    author: 'Dr. Priya Singh',
    publishDate: '2024-02-05',
    views: 1780,
    rating: 4.8,
    tags: ['precision agriculture', 'tools', 'GPS', 'mapping'],
    content: 'Interactive tool for learning precision agriculture techniques...'
  },
  {
    id: '6',
    title: 'Digital Marketing for Farmers',
    description: 'Learn digital marketing strategies specifically designed for agricultural businesses.',
    type: 'course',
    category: 'Digital Marketing',
    duration: '2 hours',
    difficulty: 'beginner',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    author: 'Marketing Expert Team',
    publishDate: '2024-02-10',
    views: 3200,
    rating: 4.7,
    tags: ['marketing', 'digital', 'social media', 'e-commerce'],
    content: 'Complete course on digital marketing for agricultural businesses...'
  }
];

const categories = [
  'All',
  'IoT & Sensors',
  'Drones & UAVs',
  'AI & Machine Learning',
  'Blockchain',
  'Precision Agriculture',
  'Digital Marketing'
];

const types = [
  { value: 'all', label: 'All Types' },
  { value: 'article', label: 'Articles' },
  { value: 'video', label: 'Videos' },
  { value: 'course', label: 'Courses' },
  { value: 'tool', label: 'Tools' }
];

const difficulties = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export default function TechPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = mockTechResources.filter(resource => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesType && matchesDifficulty && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return BookOpenIcon;
      case 'video':
        return PlayIcon;
      case 'course':
        return AcademicCapIcon;
      case 'tool':
        return CogIcon;
      default:
        return BookOpenIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'course':
        return 'bg-green-100 text-green-800';
      case 'tool':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Agri Tech Updates</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest agricultural technologies, tools, and innovations that are transforming farming practices.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
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

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>{difficulty.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="h-48 bg-gray-100 relative">
                  <Image
                    src={resource.image}
                    alt={resource.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{resource.description}</p>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <TypeIcon className="h-4 w-4 mr-2" />
                      <span>{resource.author}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      <span>{resource.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">{formatDate(resource.publishDate)}</span>
                      <span>•</span>
                      <span className="ml-2">{formatViews(resource.views)} views</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(resource.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {resource.rating}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{resource.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/training/tech/${resource.id}`}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <span>View Resource</span>
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <ComputerDesktopIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new resources.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedType('all');
                setSelectedDifficulty('all');
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Progress Tracking CTA */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Your Learning Progress</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Monitor your agricultural technology learning journey and celebrate your achievements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/training/progress"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View My Progress
              </Link>
              <Link
                href="/training/workshops"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Join Workshops
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated with Agri Tech</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Get the latest agricultural technology updates, innovations, and insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

