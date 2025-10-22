import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Farmer Stories - Kisaanmela',
  description: 'Read inspiring success stories from farmers who have transformed their lives through innovative farming practices.',
};

export default function FarmerStoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Farmer Stories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read inspiring success stories from farmers who have transformed their lives through innovative farming practices.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🌾 Success Stories</h2>
          <p className="text-gray-600 mb-6">
            Discover how farmers across India are achieving success through modern agricultural techniques and sustainable practices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Rajesh Kumar - Organic Pioneer</h3>
              <p className="text-gray-600 text-sm mb-3">From traditional to organic farming</p>
              <p className="text-green-700 font-semibold">300% income increase</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Priya Sharma - Tech Innovator</h3>
              <p className="text-gray-600 text-sm mb-3">IoT and smart farming adoption</p>
              <p className="text-blue-700 font-semibold">50% water savings</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Amit Patel - Market Leader</h3>
              <p className="text-gray-600 text-sm mb-3">Direct-to-consumer sales</p>
              <p className="text-yellow-700 font-semibold">₹50L annual revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}