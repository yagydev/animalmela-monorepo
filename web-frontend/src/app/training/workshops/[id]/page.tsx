'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  CreditCardIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorImage: string;
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
  agenda: { time: string; topic: string; description: string }[];
  materials: string[];
  certificate: boolean;
}

const mockWorkshop: Workshop = {
  id: '1',
  title: 'Organic Farming Workshop',
  description: 'Learn sustainable farming practices, soil health management, and organic certification processes.',
  instructor: 'Dr. Rajesh Kumar',
  instructorBio: 'Dr. Rajesh Kumar is a renowned agricultural scientist with over 20 years of experience in organic farming. He has published 50+ research papers and helped 1000+ farmers transition to organic farming.',
  instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  date: '2024-02-15',
  time: '09:00 AM',
  duration: '6 hours',
  location: 'Agricultural Research Center, Delhi',
  maxParticipants: 50,
  currentParticipants: 32,
  price: 0,
  category: 'Organic Farming',
  level: 'beginner',
  image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop',
  rating: 4.8,
  reviews: 124,
  tags: ['organic', 'sustainable', 'certification'],
  requirements: ['Basic farming knowledge', 'Notebook and pen'],
  whatYouWillLearn: [
    'Soil health assessment and improvement',
    'Organic pest and disease management',
    'Certification process and requirements',
    'Marketing organic produce'
  ],
  agenda: [
    { time: '09:00 - 09:30', topic: 'Welcome & Introduction', description: 'Overview of organic farming principles' },
    { time: '09:30 - 11:00', topic: 'Soil Health Management', description: 'Understanding soil composition and organic matter' },
    { time: '11:00 - 11:15', topic: 'Tea Break', description: 'Networking and refreshments' },
    { time: '11:15 - 12:45', topic: 'Organic Pest Control', description: 'Natural methods for pest and disease management' },
    { time: '12:45 - 13:45', topic: 'Lunch Break', description: 'Organic lunch provided' },
    { time: '13:45 - 15:15', topic: 'Certification Process', description: 'Steps to get organic certification' },
    { time: '15:15 - 15:30', topic: 'Break', description: 'Q&A session' },
    { time: '15:30 - 17:00', topic: 'Marketing & Economics', description: 'Selling organic produce and pricing strategies' }
  ],
  materials: [
    'Workshop handbook',
    'Soil testing kit',
    'Organic farming guide',
    'Certificate of completion'
  ],
  certificate: true
};

export default function WorkshopDetailPage() {
  const params = useParams();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    farmSize: '',
    interests: [] as string[]
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `₹${price}`;
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

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Registration successful! You will receive a confirmation email shortly.');
    setIsRegistering(false);
  };

  const handleInterestChange = (interest: string) => {
    setRegistrationData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/training/workshops"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Workshops
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                mockWorkshop.level === 'beginner' 
                  ? 'bg-green-100 text-green-800'
                  : mockWorkshop.level === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {mockWorkshop.level.charAt(0).toUpperCase() + mockWorkshop.level.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                mockWorkshop.price === 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {formatPrice(mockWorkshop.price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Workshop Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-64 bg-gray-100 relative">
                <Image
                  src={mockWorkshop.image}
                  alt={mockWorkshop.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Workshop Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{mockWorkshop.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {renderStars(mockWorkshop.rating)}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {mockWorkshop.rating} ({mockWorkshop.reviews} reviews)
                </span>
              </div>

              <p className="text-gray-600 text-lg mb-6">{mockWorkshop.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mockWorkshop.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* What You'll Learn */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                <ul className="space-y-2">
                  {mockWorkshop.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Workshop Agenda */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Workshop Agenda</h3>
                <div className="space-y-3">
                  {mockWorkshop.agenda.map((item, index) => (
                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900 w-24 flex-shrink-0">
                        {item.time}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{item.topic}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {mockWorkshop.requirements.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Materials Included */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Materials Included</h3>
                <ul className="space-y-2">
                  {mockWorkshop.materials.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Instructor</h3>
              <div className="flex items-start space-x-4">
                <Image
                  src={mockWorkshop.instructorImage}
                  alt={mockWorkshop.instructor}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{mockWorkshop.instructor}</h4>
                  <p className="text-gray-600 mt-2">{mockWorkshop.instructorBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Register for Workshop</h3>
              
              {/* Workshop Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{formatDate(mockWorkshop.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{mockWorkshop.time} ({mockWorkshop.duration})</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  <span>{mockWorkshop.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  <span>{mockWorkshop.currentParticipants}/{mockWorkshop.maxParticipants} participants</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Seats Available</span>
                  <span>{mockWorkshop.maxParticipants - mockWorkshop.currentParticipants} left</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(mockWorkshop.currentParticipants / mockWorkshop.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farming Experience</label>
                  <select
                    value={registrationData.experience}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select experience level</option>
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="advanced">Advanced (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size</label>
                  <select
                    value={registrationData.farmSize}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, farmSize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select farm size</option>
                    <option value="small">Small (0-2 acres)</option>
                    <option value="medium">Medium (2-10 acres)</option>
                    <option value="large">Large (10+ acres)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest</label>
                  <div className="space-y-2">
                    {['Soil Health', 'Pest Management', 'Marketing', 'Certification'].map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={registrationData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering ? 'Registering...' : 'Register Now'}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-4 flex items-start text-sm text-gray-600">
                <ShieldCheckIcon className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                <span>Your information is secure and will only be used for workshop communication.</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>+91-9999778321</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span>training@kisaanmela.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
