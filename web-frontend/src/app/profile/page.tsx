import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - Kisaanmela',
  description: 'Manage your Kisaanmela profile, update your information, and view your activity.',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your Kisaanmela profile, update your information, and view your activity.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">👤 Profile Information</h2>
          <p className="text-gray-600 mb-6">
            Update your personal information and preferences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Personal Details</h3>
              <p className="text-gray-600 text-sm mb-3">Update your name, email, and contact information</p>
              <p className="text-green-700 font-semibold">Edit Profile</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Account Settings</h3>
              <p className="text-gray-600 text-sm mb-3">Manage your password and security settings</p>
              <p className="text-blue-700 font-semibold">Security</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Notifications</h3>
              <p className="text-gray-600 text-sm mb-3">Configure your notification preferences</p>
              <p className="text-yellow-700 font-semibold">Settings</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Activity History</h3>
              <p className="text-gray-600 text-sm mb-3">View your recent activity and transactions</p>
              <p className="text-purple-700 font-semibold">View History</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}