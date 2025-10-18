'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarIcon, UserIcon, ArrowRightIcon, NewspaperIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: 'farmer-stories' | 'innovation' | 'market-updates' | 'technology';
  image: string;
  readTime: string;
  featured: boolean;
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock news data
  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'From Struggling Farmer to Organic Pioneer: Rajesh Kumar\'s Success Story',
      excerpt: 'How one farmer transformed his 5-acre plot into a thriving organic farm using sustainable practices and modern technology.',
      content: 'Rajesh Kumar, a farmer from Punjab, shares his journey from traditional farming to becoming a successful organic farmer...',
      author: 'Priya Sharma',
      publishedAt: '2024-01-15T10:00:00Z',
      category: 'farmer-stories',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
      readTime: '5 min read',
      featured: true
    },
    {
      id: '2',
      title: 'Revolutionary AI-Powered Crop Monitoring System Launched',
      excerpt: 'New technology helps farmers detect diseases and pests early, potentially increasing crop yields by 30%.',
      content: 'A groundbreaking AI system has been developed that can monitor crops 24/7 using satellite imagery and ground sensors...',
      author: 'Dr. Amit Singh',
      publishedAt: '2024-01-12T14:30:00Z',
      category: 'innovation',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
      readTime: '7 min read',
      featured: true
    },
    {
      id: '3',
      title: 'Market Prices Soar for Organic Vegetables in Delhi',
      excerpt: 'Organic produce prices have increased by 25% this month, creating new opportunities for organic farmers.',
      content: 'The demand for organic vegetables in Delhi has reached an all-time high, with prices reflecting the premium quality...',
      author: 'Market Analyst Team',
      publishedAt: '2024-01-10T09:15:00Z',
      category: 'market-updates',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop',
      readTime: '3 min read',
      featured: false
    },
    {
      id: '4',
      title: 'Smart Irrigation: The Future of Water Management',
      excerpt: 'IoT-based irrigation systems are helping farmers reduce water usage by 40% while maintaining crop quality.',
      content: 'Smart irrigation technology is revolutionizing how farmers manage water resources, using sensors and automation...',
      author: 'Tech Team',
      publishedAt: '2024-01-08T16:45:00Z',
      category: 'technology',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
      readTime: '6 min read',
      featured: false
    },
    {
      id: '5',
      title: 'Women Farmers Leading the Way in Sustainable Agriculture',
      excerpt: 'Meet the women who are transforming agriculture through innovative farming techniques and community leadership.',
      content: 'Across rural India, women farmers are taking the lead in sustainable agriculture practices...',
      author: 'Community Team',
      publishedAt: '2024-01-05T11:20:00Z',
      category: 'farmer-stories',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
      readTime: '8 min read',
      featured: false
    },
    {
      id: '6',
      title: 'Vertical Farming: Growing Up Instead of Out',
      excerpt: 'Urban vertical farms are producing 10x more food per square foot than traditional farming methods.',
      content: 'Vertical farming is gaining popularity in urban areas, offering a solution to food security challenges...',
      author: 'Innovation Team',
      publishedAt: '2024-01-03T13:10:00Z',
      category: 'innovation',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
      readTime: '4 min read',
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Articles', icon: NewspaperIcon },
    { id: 'farmer-stories', name: 'Farmer Stories', icon: UserIcon },
    { id: 'innovation', name: 'Innovation Hub', icon: LightBulbIcon },
    { id: 'market-updates', name: 'Market Updates', icon: CalendarIcon },
    { id: 'technology', name: 'Technology', icon: ArrowRightIcon }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  const featuredArticles = newsArticles.filter(article => article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">News & Blogs</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Stay updated with the latest agricultural news, farmer success stories, and innovative farming techniques.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Articles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span>{article.author}</span>
                    </div>
                    <Link 
                      href={`/news/${article.id}`}
                      className="text-green-600 hover:text-green-700 font-medium flex items-center"
                    >
                      Read More
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* All Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-700">
                      {categories.find(c => c.id === article.category)?.name}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="mx-1">•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-600">
                      <UserIcon className="h-3 w-3 mr-1" />
                      <span>{article.author}</span>
                    </div>
                    <Link 
                      href={`/news/${article.id}`}
                      className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
                    >
                      Read More
                      <ArrowRightIcon className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-green-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Get the latest agricultural news, market updates, and farming tips delivered to your inbox.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button className="px-6 py-2 bg-white text-green-600 rounded-r-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
