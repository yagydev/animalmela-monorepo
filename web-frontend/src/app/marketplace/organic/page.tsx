import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organic Products - Kisaanmela',
  description: 'Discover certified organic products, natural fertilizers, and eco-friendly farming solutions.',
};

export default function OrganicProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Organic Products</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover certified organic products, natural fertilizers, and eco-friendly farming solutions.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🌿 Certified Organic Products</h2>
          <p className="text-gray-600 mb-6">
            Browse our collection of certified organic products that promote sustainable and eco-friendly farming practices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Organic Seeds</h3>
              <p className="text-gray-600 text-sm mb-3">Non-GMO, certified organic seeds</p>
              <p className="text-green-700 font-semibold">100% Natural</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Natural Fertilizers</h3>
              <p className="text-gray-600 text-sm mb-3">Compost, vermicompost, and bio-fertilizers</p>
              <p className="text-blue-700 font-semibold">Eco-friendly</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Organic Pesticides</h3>
              <p className="text-gray-600 text-sm mb-3">Natural pest control solutions</p>
              <p className="text-yellow-700 font-semibold">Safe for crops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
