import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard - Kisaanmela',
  description: 'Track your performance, sales, and customer engagement with detailed analytics.',
};

export default function AnalyticsDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your performance, sales, and customer engagement with detailed analytics.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📊 Performance Analytics</h2>
          <p className="text-gray-600 mb-6">
            Monitor your business performance with comprehensive analytics and insights.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Sales Analytics</h3>
              <p className="text-gray-600 text-sm mb-3">Track your sales performance</p>
              <p className="text-green-700 font-semibold">Revenue insights</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Customer Insights</h3>
              <p className="text-gray-600 text-sm mb-3">Understand your customers</p>
              <p className="text-blue-700 font-semibold">Behavior patterns</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Product Performance</h3>
              <p className="text-gray-600 text-sm mb-3">Best-selling products</p>
              <p className="text-yellow-700 font-semibold">Market trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}