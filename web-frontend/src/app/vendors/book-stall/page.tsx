import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Stall / Advertise - Kisaanmela',
  description: 'Reserve your exhibition space at agricultural fairs and advertise your products to thousands of farmers.',
};

export default function BookStallPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Stall / Advertise</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reserve your exhibition space at agricultural fairs and advertise your products to thousands of farmers.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🏪 Exhibition Space Booking</h2>
          <p className="text-gray-600 mb-6">
            Join our agricultural fairs and reach thousands of farmers, buyers, and agricultural enthusiasts.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Standard Stall</h3>
              <p className="text-gray-600 text-sm mb-3">10x10 feet space</p>
              <p className="text-green-700 font-semibold">₹5,000/day</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Premium Stall</h3>
              <p className="text-gray-600 text-sm mb-3">15x15 feet space</p>
              <p className="text-blue-700 font-semibold">₹8,000/day</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">VIP Stall</h3>
              <p className="text-gray-600 text-sm mb-3">20x20 feet space</p>
              <p className="text-yellow-700 font-semibold">₹12,000/day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}