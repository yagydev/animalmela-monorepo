'use client';

import React from 'react';
import { BuildingOfficeIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, StarIcon } from '@heroicons/react/24/outline';

export default function VendorsPage() {
  const vendors = [
    {
      id: 1,
      name: 'Green Valley Seeds',
      category: 'Seeds & Fertilizers',
      location: 'Punjab, India',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      description: 'Premium quality seeds and organic fertilizers for sustainable farming.',
      contact: {
        phone: '+91-9876543210',
        email: 'info@greenvalleyseeds.com',
        website: 'www.greenvalleyseeds.com'
      },
      specialties: ['Organic Seeds', 'Bio Fertilizers', 'Crop Protection'],
      verified: true
    },
    {
      id: 2,
      name: 'FarmTech Equipment',
      category: 'Agricultural Machinery',
      location: 'Haryana, India',
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      description: 'Modern farming equipment and machinery for efficient agricultural operations.',
      contact: {
        phone: '+91-9876543211',
        email: 'sales@farmtechequipment.com',
        website: 'www.farmtechequipment.com'
      },
      specialties: ['Tractors', 'Harvesting Machines', 'Irrigation Systems'],
      verified: true
    },
    {
      id: 3,
      name: 'Organic Harvest Co.',
      category: 'Organic Products',
      location: 'Uttar Pradesh, India',
      rating: 4.9,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      description: 'Certified organic products and sustainable farming solutions.',
      contact: {
        phone: '+91-9876543212',
        email: 'contact@organicharvest.co.in',
        website: 'www.organicharvest.co.in'
      },
      specialties: ['Organic Vegetables', 'Natural Pesticides', 'Compost'],
      verified: true
    },
    {
      id: 4,
      name: 'Livestock Solutions',
      category: 'Animal Husbandry',
      location: 'Rajasthan, India',
      rating: 4.7,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
      description: 'Complete livestock management solutions and veterinary services.',
      contact: {
        phone: '+91-9876543213',
        email: 'support@livestocksolutions.com',
        website: 'www.livestocksolutions.com'
      },
      specialties: ['Cattle Feed', 'Veterinary Services', 'Breeding Programs'],
      verified: true
    },
    {
      id: 5,
      name: 'AgriFinance Partners',
      category: 'Financial Services',
      location: 'Maharashtra, India',
      rating: 4.5,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      description: 'Agricultural loans, insurance, and financial planning for farmers.',
      contact: {
        phone: '+91-9876543214',
        email: 'loans@agrifinancepartners.com',
        website: 'www.agrifinancepartners.com'
      },
      specialties: ['Farm Loans', 'Crop Insurance', 'Investment Planning'],
      verified: true
    },
    {
      id: 6,
      name: 'Smart Irrigation Systems',
      category: 'Technology Solutions',
      location: 'Karnataka, India',
      rating: 4.8,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      description: 'IoT-based smart irrigation and precision farming technologies.',
      contact: {
        phone: '+91-9876543215',
        email: 'tech@smartirrigation.com',
        website: 'www.smartirrigation.com'
      },
      specialties: ['IoT Sensors', 'Automated Irrigation', 'Data Analytics'],
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendors & Partners</h1>
          <p className="text-gray-600">Connect with trusted agricultural vendors and service providers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Vendors</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">All Categories</option>
                <option value="seeds">Seeds & Fertilizers</option>
                <option value="equipment">Agricultural Machinery</option>
                <option value="organic">Organic Products</option>
                <option value="livestock">Animal Husbandry</option>
                <option value="finance">Financial Services</option>
                <option value="technology">Technology Solutions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">All Locations</option>
                <option value="punjab">Punjab</option>
                <option value="haryana">Haryana</option>
                <option value="up">Uttar Pradesh</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="karnataka">Karnataka</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-48 object-cover"
                />
                {vendor.verified && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Verified
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{vendor.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-green-600 font-medium mb-2">{vendor.category}</p>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">{vendor.location}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{vendor.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{vendor.contact.email}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {vendor.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    Contact Vendor
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-md">
              1
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
