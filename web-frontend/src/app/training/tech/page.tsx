'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  PaperAirplaneIcon,
  CheckCircleIcon,
  BeakerIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CloudArrowUpIcon,
  BoltIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';

interface AgriTechTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface TechArticle {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
}

const agriTechTopics: AgriTechTopic[] = [
  {
    id: 'drone',
    title: 'Drone Farming',
    description:
      'Aerial crop monitoring, precision spraying, and field mapping using unmanned aerial vehicles equipped with multispectral cameras.',
    icon: CpuChipIcon,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    id: 'iot',
    title: 'IoT Sensors',
    description:
      'Real-time soil moisture, temperature, and nutrient level monitoring using connected sensor networks deployed across farm fields.',
    icon: BeakerIcon,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  {
    id: 'precision',
    title: 'Precision Agriculture',
    description:
      'Variable-rate application of fertilisers, pesticides, and water guided by GPS and field data to reduce waste and boost yield.',
    icon: GlobeAltIcon,
    color: 'bg-green-50 border-green-200 text-green-700',
  },
  {
    id: 'ai',
    title: 'AI Crop Diagnosis',
    description:
      'Machine learning algorithms that identify crop diseases, pest infestations, and nutrient deficiencies from smartphone photos.',
    icon: BoltIcon,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  },
  {
    id: 'irrigation',
    title: 'Smart Irrigation',
    description:
      'IoT-driven drip and sprinkler systems that automatically adjust water delivery based on weather forecasts and soil-moisture data.',
    icon: CloudArrowUpIcon,
    color: 'bg-sky-50 border-sky-200 text-sky-700',
  },
  {
    id: 'blockchain',
    title: 'Blockchain in Supply Chain',
    description:
      'Immutable digital records that trace produce from farm to fork, ensuring food safety, reducing fraud, and securing fair payments.',
    icon: CubeTransparentIcon,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
  },
];

const techArticles: TechArticle[] = [
  {
    id: 1,
    title: 'Smart Irrigation Systems',
    description:
      'IoT-based irrigation systems that monitor soil moisture and weather conditions to optimise water usage and cut costs by up to 40%.',
    category: 'Smart Irrigation',
    date: '2026-03-15',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Drone Technology for Crop Monitoring',
    description:
      'Advanced drone systems equipped with multispectral cameras for precision agriculture and early crop stress detection.',
    category: 'Drone Farming',
    date: '2026-03-12',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    id: 3,
    title: 'AI-Powered Pest Detection',
    description:
      'Machine learning algorithms that identify pest infestations early through image recognition, reducing pesticide use by 30%.',
    category: 'AI Crop Diagnosis',
    date: '2026-03-10',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    id: 4,
    title: 'Blockchain in Agricultural Supply Chain',
    description:
      'Transparent and traceable supply chains using blockchain technology for better food safety and farmer payments.',
    category: 'Blockchain in Supply Chain',
    date: '2026-03-08',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    id: 5,
    title: 'Precision Agriculture with IoT Sensors',
    description:
      'Deploy sensor networks across your fields to gather soil and microclimate data that drives smarter input decisions.',
    category: 'IoT Sensors',
    date: '2026-03-05',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    id: 6,
    title: 'Variable-Rate Fertiliser Application',
    description:
      'Combine GPS field mapping and soil analysis to apply fertiliser only where it is needed, cutting costs while protecting the environment.',
    category: 'Precision Agriculture',
    date: '2026-03-03',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=500&fit=crop',
    featured: false,
  },
];

const ALL_CATEGORIES = ['All', ...Array.from(new Set(techArticles.map((a) => a.category)))];

export default function AgriTechPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredArticles =
    activeCategory === 'All'
      ? techArticles
      : techArticles.filter((a) => a.category === activeCategory);

  const featuredArticles = techArticles.filter((a) => a.featured);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-3">Agri Tech Updates</h1>
          <p className="text-green-100 text-lg max-w-2xl">
            Explore the latest agricultural technology innovations transforming how India farms — from drones and IoT
            to AI-powered diagnostics and blockchain traceability.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* Agri-Tech Topics Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Key Technologies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agriTechTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.id}
                  className={`rounded-xl border p-5 flex flex-col gap-3 ${topic.color} transition-shadow hover:shadow-md`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-7 w-7 shrink-0" />
                    <h3 className="font-semibold text-lg">{topic.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed opacity-80">{topic.description}</p>
                  <button
                    onClick={() => setActiveCategory(topic.title)}
                    className="mt-auto self-start px-4 py-1.5 rounded-full text-xs font-semibold border border-current hover:opacity-80 transition-opacity"
                  >
                    Learn More
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Articles */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Technology Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-52">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-2 gap-2">
                    <span>{formatDate(article.date)}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{article.description}</p>
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Filter + All Articles */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-gray-900">All Technology Updates</h2>
            <span className="text-sm text-gray-500">{filteredArticles.length} articles</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-40">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-400 mb-2 gap-2">
                    <span>{formatDate(article.date)}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.description}</p>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-green-50 rounded-xl border border-green-100 p-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated with Agri Tech</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Get the latest agricultural technology updates delivered to your inbox every week.
            </p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                <CheckCircleIcon className="h-6 w-6" />
                <span>You&apos;re subscribed! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shrink-0"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
