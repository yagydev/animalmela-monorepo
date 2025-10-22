import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Innovation Hub - Kisaanmela',
  description: 'Explore the latest agricultural innovations, research, and technological advancements in farming.',
};

export default function InnovationHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Innovation Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the latest agricultural innovations, research, and technological advancements in farming.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Latest Innovations</h2>
          <p className="text-gray-600 mb-6">
            Stay updated with cutting-edge agricultural technologies and research breakthroughs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">AI-Powered Farming</h3>
              <p className="text-gray-600 text-sm mb-3">Machine learning for crop optimization</p>
              <p className="text-green-700 font-semibold">30% yield increase</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Drone Technology</h3>
              <p className="text-gray-600 text-sm mb-3">Precision agriculture with drones</p>
              <p className="text-blue-700 font-semibold">Real-time monitoring</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Vertical Farming</h3>
              <p className="text-gray-600 text-sm mb-3">Space-efficient growing systems</p>
              <p className="text-yellow-700 font-semibold">90% less water usage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}