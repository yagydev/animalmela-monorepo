'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  DocumentTextIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Subsidy {
  id: string;
  title: string;
  description: string;
  amount: string;
  category: string;
  eligibility: string[];
  documents: string[];
  deadline: string;
  status: 'active' | 'upcoming' | 'closed';
  applicationLink: string;
  benefits: string[];
}

const mockSubsidies: Subsidy[] = [
  {
    id: '1',
    title: 'PM-KISAN Scheme',
    description: 'Direct income support to farmers for cultivation expenses',
    amount: '₹6,000 per year',
    category: 'Income Support',
    eligibility: [
      'Small and marginal farmers',
      'Landholding up to 2 hectares',
      'Valid land records'
    ],
    documents: [
      'Aadhaar Card',
      'Land ownership documents',
      'Bank account details',
      'Mobile number'
    ],
    deadline: 'Ongoing',
    status: 'active',
    applicationLink: 'https://pmkisan.gov.in',
    benefits: [
      'Direct cash transfer',
      'No middlemen',
      'Quarterly installments',
      'Covers all crops'
    ]
  },
  {
    id: '2',
    title: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme to protect farmers from crop loss',
    amount: 'Up to ₹40,000 per hectare',
    category: 'Crop Insurance',
    eligibility: [
      'All farmers growing notified crops',
      'Valid land records',
      'Aadhaar card'
    ],
    documents: [
      'Aadhaar Card',
      'Land records',
      'Bank account details',
      'Crop details'
    ],
    deadline: 'March 31, 2024',
    status: 'active',
    applicationLink: 'https://pmfby.gov.in',
    benefits: [
      'Comprehensive crop coverage',
      'Low premium rates',
      'Quick claim settlement',
      'Weather-based insurance'
    ]
  },
  {
    id: '3',
    title: 'Soil Health Card Scheme',
    description: 'Free soil testing and recommendations for farmers',
    amount: 'Free service',
    category: 'Soil Health',
    eligibility: [
      'All farmers',
      'Valid land records',
      'Aadhaar card'
    ],
    documents: [
      'Aadhaar Card',
      'Land ownership proof',
      'Application form'
    ],
    deadline: 'Ongoing',
    status: 'active',
    applicationLink: 'https://soilhealth.dac.gov.in',
    benefits: [
      'Free soil testing',
      'Nutrient recommendations',
      'Fertilizer guidance',
      'Crop-specific advice'
    ]
  },
  {
    id: '4',
    title: 'Kisan Credit Card',
    description: 'Credit facility for farmers at low interest rates',
    amount: 'Up to ₹3 lakh',
    category: 'Credit Support',
    eligibility: [
      'Farmers with landholding',
      'Valid land records',
      'Good credit history'
    ],
    documents: [
      'Aadhaar Card',
      'Land records',
      'Income certificate',
      'Bank statements'
    ],
    deadline: 'Ongoing',
    status: 'active',
    applicationLink: 'https://kcc.gov.in',
    benefits: [
      'Low interest rates',
      'Flexible repayment',
      'Emergency credit',
      'Insurance coverage'
    ]
  },
  {
    id: '5',
    title: 'Pradhan Mantri Kisan Sampada Yojana',
    description: 'Infrastructure development for food processing',
    amount: 'Up to ₹10 crore',
    category: 'Infrastructure',
    eligibility: [
      'Food processing units',
      'Farmer producer organizations',
      'Cooperative societies'
    ],
    documents: [
      'Project proposal',
      'Financial statements',
      'Land documents',
      'Technical specifications'
    ],
    deadline: 'December 31, 2024',
    status: 'active',
    applicationLink: 'https://sampada.gov.in',
    benefits: [
      'Infrastructure development',
      'Technology upgradation',
      'Market linkage',
      'Employment generation'
    ]
  },
  {
    id: '6',
    title: 'National Mission on Oilseeds and Oil Palm',
    description: 'Promotion of oilseed cultivation and processing',
    amount: 'Up to ₹25,000 per hectare',
    category: 'Oilseeds',
    eligibility: [
      'Oilseed farmers',
      'Valid land records',
      'Aadhaar card'
    ],
    documents: [
      'Aadhaar Card',
      'Land records',
      'Crop details',
      'Bank account'
    ],
    deadline: 'March 31, 2024',
    status: 'active',
    applicationLink: 'https://oilseeds.gov.in',
    benefits: [
      'Seed subsidy',
      'Fertilizer support',
      'Technology transfer',
      'Market support'
    ]
  }
];

const categories = [
  'All',
  'Income Support',
  'Crop Insurance',
  'Soil Health',
  'Credit Support',
  'Infrastructure',
  'Oilseeds'
];

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'closed', label: 'Closed' }
];

export default function SubsidiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubsidies = mockSubsidies.filter(subsidy => {
    const matchesCategory = selectedCategory === 'All' || subsidy.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || subsidy.status === selectedStatus;
    const matchesSearch = subsidy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subsidy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subsidy.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Government Subsidies & Schemes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access various government schemes and subsidies designed to support farmers and improve agricultural practices.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Schemes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schemes..."
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

        {/* Subsidies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSubsidies.map((subsidy) => (
            <div key={subsidy.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{subsidy.title}</h3>
                  <p className="text-gray-600 mb-3">{subsidy.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subsidy.status)}`}>
                  {subsidy.status.charAt(0).toUpperCase() + subsidy.status.slice(1)}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center mb-4">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-lg font-semibold text-green-600">{subsidy.amount}</span>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {subsidy.category}
                </span>
              </div>

              {/* Deadline */}
              <div className="flex items-center mb-4 text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>Deadline: {subsidy.deadline}</span>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Benefits:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {subsidy.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      {benefit}
                    </li>
                  ))}
                  {subsidy.benefits.length > 3 && (
                    <li className="text-gray-500">+{subsidy.benefits.length - 3} more benefits</li>
                  )}
                </ul>
              </div>

              {/* Eligibility */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Eligibility:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {subsidy.eligibility.slice(0, 2).map((item, index) => (
                    <li key={index} className="flex items-center">
                      <InformationCircleIcon className="h-4 w-4 text-blue-500 mr-2" />
                      {item}
                    </li>
                  ))}
                  {subsidy.eligibility.length > 2 && (
                    <li className="text-gray-500">+{subsidy.eligibility.length - 2} more criteria</li>
                  )}
                </ul>
              </div>

              {/* Action Button */}
              <div className="flex gap-3">
                <a
                  href={subsidy.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium text-center"
                >
                  Apply Now
                </a>
                <Link
                  href="/training/subsidies/tracking"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Track Applications
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSubsidies.length === 0 && (
          <div className="text-center py-16">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new schemes.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Applications?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our team can help you understand eligibility criteria, gather required documents, and complete applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Application Help
              </Link>
              <Link
                href="/training"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                View Training Programs
              </Link>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Information</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• Always verify scheme details on official government websites</li>
                <li>• Keep all required documents ready before applying</li>
                <li>• Application deadlines may vary by state and district</li>
                <li>• Contact your local agriculture office for assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

