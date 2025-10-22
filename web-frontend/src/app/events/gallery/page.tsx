import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Gallery - Kisaanmela',
  description: 'Browse photos and videos from our agricultural events, farmer meets, and exhibitions.',
};

export default function EventGalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse photos and videos from our agricultural events, farmer meets, and exhibitions.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📷 Photo Gallery</h2>
          <p className="text-gray-600 mb-6">
            Visual memories from our agricultural events showcasing farmer success stories and community engagement.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <span className="text-gray-500">Event Photo 1</span>
            </div>
            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <span className="text-gray-500">Event Photo 2</span>
            </div>
            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <span className="text-gray-500">Event Photo 3</span>
            </div>
            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <span className="text-gray-500">Event Photo 4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}