'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function EventsGalleryPage() {
  // Simple static data for testing
  const galleryItems = [
    {
      id: '1',
      title: 'Kisaan Mela 2024 - Spring Festival',
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
      caption: 'Join us for the biggest agricultural festival of the year!',
      eventTitle: 'Kisaan Mela 2024',
      eventDate: 'March 15, 2024',
      eventLocation: 'Delhi, Delhi'
    },
    {
      id: '2',
      title: 'Farmers Market',
      url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop',
      caption: 'Local farmers showcasing their produce',
      eventTitle: 'Kisaan Mela 2024',
      eventDate: 'March 15, 2024',
      eventLocation: 'Delhi, Delhi'
    },
    {
      id: '3',
      title: 'Agricultural Equipment',
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
      caption: 'Modern farming equipment display',
      eventTitle: 'Kisaan Mela 2024',
      eventDate: 'March 15, 2024',
      eventLocation: 'Delhi, Delhi'
    },
    {
      id: '4',
      title: 'Organic Farming Workshop',
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
      caption: 'Learn sustainable organic farming techniques from experts',
      eventTitle: 'Organic Farming Workshop',
      eventDate: 'April 20, 2024',
      eventLocation: 'Pune, Maharashtra'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/events" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Back to Events</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Events Gallery</h1>
                <p className="text-gray-600">Photos and videos from agricultural events</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {galleryItems.length} items
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  Photo
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div className="text-sm text-gray-600 mb-2">
                  <div className="font-medium">{item.eventTitle}</div>
                  <div>{item.eventDate}</div>
                  <div>{item.eventLocation}</div>
                </div>
                {item.caption && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {galleryItems.length === 0 && (
          <div className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gallery items found</h3>
            <p className="text-gray-600">Check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
