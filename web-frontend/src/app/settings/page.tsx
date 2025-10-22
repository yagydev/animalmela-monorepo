import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - Kisaanmela',
  description: 'Manage your Kisaanmela account settings, preferences, and privacy options.',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Settings</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your Kisaanmela account settings, preferences, and privacy options.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">⚙️ Account Settings</h2>
          <p className="text-gray-600 mb-6">
            Customize your experience and manage your account preferences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Profile Settings</h3>
              <p className="text-gray-600 text-sm mb-3">Update your personal information and profile picture</p>
              <p className="text-green-700 font-semibold">Edit Profile</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Security</h3>
              <p className="text-gray-600 text-sm mb-3">Change password and manage security settings</p>
              <p className="text-blue-700 font-semibold">Security Options</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Notifications</h3>
              <p className="text-gray-600 text-sm mb-3">Configure email and SMS notification preferences</p>
              <p className="text-yellow-700 font-semibold">Notification Settings</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Privacy</h3>
              <p className="text-gray-600 text-sm mb-3">Manage your privacy settings and data preferences</p>
              <p className="text-purple-700 font-semibold">Privacy Options</p>
            </div>
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Language</h3>
              <p className="text-gray-600 text-sm mb-3">Change your preferred language and region</p>
              <p className="text-red-700 font-semibold">Language Settings</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Account Deletion</h3>
              <p className="text-gray-600 text-sm mb-3">Permanently delete your account and data</p>
              <p className="text-indigo-700 font-semibold">Delete Account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}