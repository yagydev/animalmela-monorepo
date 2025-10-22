import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upcoming Melas - Kisaanmela',
  description: 'Discover upcoming agricultural fairs and exhibitions near you. Join farmers, vendors, and agricultural enthusiasts.',
};

export default function UpcomingMelasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Melas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover upcoming agricultural fairs and exhibitions near you. Join farmers, vendors, and agricultural enthusiasts.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚜 Upcoming Agricultural Events</h2>
          <p className="text-gray-600 mb-6">
            Stay updated with the latest agricultural fairs, exhibitions, and farmer meets happening in your region.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Spring Agriculture Fair</h3>
              <p className="text-green-700 text-sm mb-3">March 15-17, 2024</p>
              <p className="text-gray-600 text-sm">Delhi Agricultural Ground</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Organic Farming Expo</h3>
              <p className="text-blue-700 text-sm mb-3">March 22-24, 2024</p>
              <p className="text-gray-600 text-sm">Pune Convention Center</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Seed & Technology Fair</h3>
              <p className="text-yellow-700 text-sm mb-3">April 5-7, 2024</p>
              <p className="text-gray-600 text-sm">Bangalore Exhibition Center</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
