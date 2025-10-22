import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Past Highlights - Kisaanmela',
  description: 'Explore past agricultural fairs, exhibitions, and farmer success stories from previous events.',
};

export default function PastHighlightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Past Highlights</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore past agricultural fairs, exhibitions, and farmer success stories from previous events.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📸 Event Highlights</h2>
          <p className="text-gray-600 mb-6">
            Relive the moments from our successful agricultural events and see the impact we've made together.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Winter Agriculture Fair 2023</h3>
              <p className="text-green-700 text-sm mb-3">December 10-12, 2023</p>
              <p className="text-gray-600 text-sm">500+ farmers participated</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Technology Innovation Summit</h3>
              <p className="text-blue-700 text-sm mb-3">November 15-17, 2023</p>
              <p className="text-gray-600 text-sm">200+ tech demonstrations</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Organic Certification Workshop</h3>
              <p className="text-yellow-700 text-sm mb-3">October 20-22, 2023</p>
              <p className="text-gray-600 text-sm">150+ farmers certified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
