'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  PresentationChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const trainingCategories = [
  {
    title: 'Workshops',
    description: 'Hands-on training sessions with industry experts',
    icon: PresentationChartBarIcon,
    href: '/training/workshops',
    count: 6,
    color: 'bg-blue-500'
  },
  {
    title: 'Subsidy Guidance',
    description: 'Learn about government schemes and subsidies',
    icon: BookOpenIcon,
    href: '/training/subsidies',
    count: 12,
    color: 'bg-green-500'
  },
  {
    title: 'Agri Tech Updates',
    description: 'Latest technology trends in agriculture',
    icon: AcademicCapIcon,
    href: '/training/tech',
    count: 8,
    color: 'bg-purple-500'
  }
];

const featuredWorkshops = [
  {
    id: '1',
    title: 'Organic Farming Workshop',
    instructor: 'Dr. Rajesh Kumar',
    date: 'Feb 15, 2024',
    rating: 4.8,
    reviews: 124,
    price: 0,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Modern Irrigation Techniques',
    instructor: 'Prof. Sunita Sharma',
    date: 'Feb 20, 2024',
    rating: 4.6,
    reviews: 89,
    price: 500,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Digital Marketing for Farmers',
    instructor: 'Amit Patel',
    date: 'Feb 25, 2024',
    rating: 4.7,
    reviews: 156,
    price: 0,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
  }
];

const stats = [
  { label: 'Total Workshops', value: '50+' },
  { label: 'Expert Instructors', value: '25+' },
  { label: 'Farmers Trained', value: '2,500+' },
  { label: 'Success Rate', value: '95%' }
];

const benefits = [
  {
    icon: UserGroupIcon,
    title: 'Expert Instructors',
    description: 'Learn from certified agricultural experts and industry professionals'
  },
  {
    icon: CheckCircleIcon,
    title: 'Practical Learning',
    description: 'Hands-on training with real-world applications and case studies'
  },
  {
    icon: ClockIcon,
    title: 'Flexible Schedule',
    description: 'Choose from various time slots and formats including online sessions'
  },
  {
    icon: StarIcon,
    title: 'Certification',
    description: 'Receive certificates upon completion of training programs'
  }
];

export default function TrainingPage() {
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Agricultural Training & Learning
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Enhance your farming skills with our comprehensive training programs. 
              Learn from experts and stay updated with the latest agricultural practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/training/workshops"
                className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Workshops
              </Link>
              <Link
                href="/training/subsidies"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                View Subsidies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training Categories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Training Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of training programs designed for farmers at all levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingCategories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${category.color} text-white mr-4`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.count} programs available
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
                  <span>Explore Programs</span>
                  <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Workshops */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Workshops
            </h2>
            <p className="text-xl text-gray-600">
              Don't miss these popular training sessions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredWorkshops.map((workshop) => (
              <div key={workshop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
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
                      {workshop.price === 0 ? 'Free' : `₹${workshop.price}`}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {workshop.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>{workshop.instructor}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{workshop.date}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {renderStars(workshop.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {workshop.rating} ({workshop.reviews} reviews)
                    </span>
                  </div>

                  <Link
                    href={`/training/workshops#${workshop.id}`}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium text-center block"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/training/workshops"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              View All Workshops
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Training Programs?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive, practical training that helps farmers succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <benefit.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Enhance Your Farming Skills?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who have improved their agricultural practices through our training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/training/workshops"
              className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Learning Today
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

