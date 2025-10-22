import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Seeds & Tools - Kisaanmela',
  description: 'Browse and buy quality seeds, farming equipment, and agricultural tools from verified suppliers.',
};

export default function BuySeedsToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Buy Seeds & Tools</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse and buy quality seeds, farming equipment, and agricultural tools from verified suppliers.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🌱 Seeds & Equipment</h2>
          <p className="text-gray-600 mb-6">
            Find the best quality seeds, farming tools, and equipment from trusted suppliers across India.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Premium Seeds</h3>
              <p className="text-gray-600 text-sm mb-3">High-yield, disease-resistant varieties</p>
              <p className="text-green-700 font-semibold">Starting from ₹50/kg</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Farming Tools</h3>
              <p className="text-gray-600 text-sm mb-3">Essential tools for modern farming</p>
              <p className="text-blue-700 font-semibold">Starting from ₹500</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Irrigation Equipment</h3>
              <p className="text-gray-600 text-sm mb-3">Water-efficient irrigation systems</p>
              <p className="text-yellow-700 font-semibold">Starting from ₹2,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
