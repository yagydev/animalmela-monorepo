import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agri Tech Updates - Kisaanmela',
  description: 'Latest agricultural technology updates and innovations for farmers',
};

const AgriTechPage: React.FC = () => {
  const techUpdates = [
    {
      id: 1,
      title: 'Smart Irrigation Systems',
      description: 'IoT-based irrigation systems that monitor soil moisture and weather conditions to optimize water usage.',
      category: 'Water Management',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      featured: true,
    },
    {
      id: 2,
      title: 'Drone Technology for Crop Monitoring',
      description: 'Advanced drone systems equipped with multispectral cameras for precision agriculture and crop health monitoring.',
      category: 'Precision Agriculture',
      date: '2024-01-12',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',
      featured: true,
    },
    {
      id: 3,
      title: 'AI-Powered Pest Detection',
      description: 'Machine learning algorithms that can identify pest infestations early through image recognition technology.',
      category: 'Crop Protection',
      date: '2024-01-10',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      featured: false,
    },
    {
      id: 4,
      title: 'Blockchain in Supply Chain',
      description: 'Transparent and traceable agricultural supply chains using blockchain technology for better food safety.',
      category: 'Supply Chain',
      date: '2024-01-08',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      featured: false,
    },
    {
      id: 5,
      title: 'Vertical Farming Solutions',
      description: 'Indoor farming systems that maximize crop yield in limited spaces using LED lighting and hydroponics.',
      category: 'Urban Farming',
      date: '2024-01-05',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      featured: false,
    },
    {
      id: 6,
      title: 'Robotic Harvesting Systems',
      description: 'Automated harvesting robots that can identify and pick ripe fruits and vegetables with precision.',
      category: 'Automation',
      date: '2024-01-03',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      featured: false,
    },
  ];

  const categories = ['All', 'Water Management', 'Precision Agriculture', 'Crop Protection', 'Supply Chain', 'Urban Farming', 'Automation'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Agri Tech Updates</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest agricultural technology innovations, smart farming solutions, and digital tools that are transforming modern agriculture.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Technology Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {techUpdates.filter(update => update.featured).map((update) => (
              <div key={update.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={update.image} alt={update.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                      {update.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{update.date}</span>
                    <span className="mx-2">•</span>
                    <span>{update.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{update.title}</h3>
                  <p className="text-gray-600 mb-4">{update.description}</p>
                  <button className="text-green-600 hover:text-green-700 font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* All Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Technology Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techUpdates.map((update) => (
              <div key={update.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={update.image} alt={update.title} className="w-full h-40 object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                      {update.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>{update.date}</span>
                    <span className="mx-2">•</span>
                    <span>{update.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{update.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{update.description}</p>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-green-50 rounded-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated with Agri Tech</h2>
            <p className="text-gray-600 mb-6">
              Get the latest agricultural technology updates delivered to your inbox every week.
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Tech Resources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technology Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Tech Guides</h3>
              <p className="text-gray-600 text-sm">Comprehensive guides on implementing agricultural technology</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Video Tutorials</h3>
              <p className="text-gray-600 text-sm">Step-by-step video tutorials for agricultural technology</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Expert Community</h3>
              <p className="text-gray-600 text-sm">Connect with agricultural technology experts and farmers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriTechPage;