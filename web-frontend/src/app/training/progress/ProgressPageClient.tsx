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
  PlayIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  ArrowRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface LearningProgress {
  resourceId: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'tool';
  category: string;
  progress: number;
  completed: boolean;
  startedDate: string;
  completedDate?: string;
  timeSpent: number; // in minutes
  rating?: number;
  notes?: string;
  image: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: string;
}

const mockProgress: LearningProgress[] = [
  {
    resourceId: '1',
    title: 'IoT Sensors for Smart Farming',
    type: 'article',
    category: 'IoT & Sensors',
    progress: 100,
    completed: true,
    startedDate: '2024-01-15',
    completedDate: '2024-01-16',
    timeSpent: 45,
    rating: 5,
    notes: 'Very informative, learned about soil moisture sensors',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop',
    difficulty: 'intermediate'
  },
  {
    resourceId: '2',
    title: 'Drone Technology in Agriculture',
    type: 'video',
    category: 'Drones & UAVs',
    progress: 75,
    completed: false,
    startedDate: '2024-01-20',
    timeSpent: 35,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=200&fit=crop',
    difficulty: 'beginner'
  },
  {
    resourceId: '3',
    title: 'Machine Learning for Crop Prediction',
    type: 'course',
    category: 'AI & Machine Learning',
    progress: 30,
    completed: false,
    startedDate: '2024-02-01',
    timeSpent: 90,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop',
    difficulty: 'advanced'
  },
  {
    resourceId: '4',
    title: 'Blockchain in Supply Chain',
    type: 'article',
    category: 'Blockchain',
    progress: 100,
    completed: true,
    startedDate: '2024-02-05',
    completedDate: '2024-02-06',
    timeSpent: 25,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
    difficulty: 'intermediate'
  },
  {
    resourceId: '5',
    title: 'Precision Agriculture Tools',
    type: 'tool',
    category: 'Precision Agriculture',
    progress: 60,
    completed: false,
    startedDate: '2024-02-10',
    timeSpent: 20,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
    difficulty: 'beginner'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Completed your first learning resource',
    icon: '🎯',
    earnedDate: '2024-01-16',
    category: 'Learning'
  },
  {
    id: '2',
    title: 'Tech Enthusiast',
    description: 'Completed 5 tech resources',
    icon: '🔥',
    earnedDate: '2024-02-06',
    category: 'Learning'
  },
  {
    id: '3',
    title: 'IoT Explorer',
    description: 'Completed IoT & Sensors category',
    icon: '📡',
    earnedDate: '2024-01-16',
    category: 'Category'
  },
  {
    id: '4',
    title: 'Blockchain Pioneer',
    description: 'Completed blockchain resources',
    icon: '⛓️',
    earnedDate: '2024-02-06',
    category: 'Category'
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

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

export default function ProgressPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProgress = mockProgress.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'completed' && item.completed) ||
      (selectedStatus === 'in_progress' && !item.completed);
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesType && matchesStatus && matchesSearch;
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
      day: 'numeric'
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const totalTimeSpent = mockProgress.reduce((sum, item) => sum + item.timeSpent, 0);
  const completedCount = mockProgress.filter(item => item.completed).length;
  const averageRating = mockProgress
    .filter(item => item.rating)
    .reduce((sum, item) => sum + (item.rating || 0), 0) / 
    mockProgress.filter(item => item.rating).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Learning Progress</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your agricultural technology learning journey and celebrate your achievements.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedCount}</div>
            <div className="text-sm text-gray-600">Resources Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{formatTime(totalTimeSpent)}</div>
            <div className="text-sm text-gray-600">Total Learning Time</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{mockAchievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="text-3xl mr-3">{achievement.icon}</div>
                <div>
                  <div className="font-medium text-gray-900">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatDate(achievement.earnedDate)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Learning Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgress.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <div key={item.resourceId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="h-48 bg-gray-100 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                    </span>
                  </div>
                  {item.completed && (
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-green-500 text-white rounded-full p-2">
                        <CheckCircleIcon className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <TypeIcon className="h-4 w-4 mr-2" />
                      <span>{item.category}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>{formatTime(item.timeSpent)} spent</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>Started: {formatDate(item.startedDate)}</span>
                    </div>
                    {item.completedDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        <span>Completed: {formatDate(item.completedDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  {item.rating && (
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <StarSolidIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < item.rating! ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {item.rating}/5
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <strong>Notes:</strong> {item.notes}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    href={`/training/tech/${item.resourceId}`}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <span>{item.completed ? 'Review Again' : 'Continue Learning'}</span>
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredProgress.length === 0 && (
          <div className="text-center py-16">
            <ComputerDesktopIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No learning progress found</h3>
            <p className="text-gray-600 mb-6">Start learning to track your progress here.</p>
            <Link
              href="/training/tech"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Browse Tech Resources
            </Link>
          </div>
        )}

        {/* Learning Recommendations */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Continue Your Learning Journey</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Discover new agricultural technologies and expand your knowledge with our curated learning resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/training/tech"
                className="px-6 py-3 bg-white text-green-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
              >
                Explore Tech Resources
              </Link>
              <Link
                href="/training/workshops"
                className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-green-600 transition-colors font-medium"
              >
                Join Workshops
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
