import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Kisaanmela',
  description: 'Access your Kisaanmela dashboard to manage your listings, track orders, and view analytics.',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access your Kisaanmela dashboard to manage your listings, track orders, and view analytics.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📊 Your Overview</h2>
          <p className="text-gray-600 mb-6">
            Monitor your performance and manage your agricultural business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Active Listings</h3>
              <p className="text-gray-600 text-sm mb-3">Manage your product listings</p>
              <p className="text-green-700 font-semibold">12 Products</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Orders</h3>
              <p className="text-gray-600 text-sm mb-3">Track your sales and orders</p>
              <p className="text-blue-700 font-semibold">45 Orders</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Revenue</h3>
              <p className="text-gray-600 text-sm mb-3">View your earnings</p>
              <p className="text-yellow-700 font-semibold">₹1,25,000</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Customer Reviews</h3>
              <p className="text-gray-600 text-sm mb-3">Manage your reviews and ratings</p>
              <p className="text-purple-700 font-semibold">4.8/5 Stars</p>
            </div>
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Pending Orders</h3>
              <p className="text-gray-600 text-sm mb-3">Orders awaiting your action</p>
              <p className="text-red-700 font-semibold">3 Orders</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm mb-3">View detailed performance metrics</p>
              <p className="text-indigo-700 font-semibold">View Reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}