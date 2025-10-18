'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import WhatsAppButton from './WhatsAppButton';

interface EventCardProps {
  title: string;
  image: string;
  date: string;
  location: string;
  description?: string;
  category?: string;
  price?: string;
  phone?: string;
  eventDetails?: {
    title: string;
    date: string;
    location: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  image,
  date,
  location,
  description,
  category,
  price,
  phone,
  eventDetails
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        {category && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
            {category}
          </div>
        )}
        {price && (
          <div className="absolute top-2 right-2 bg-white text-green-600 px-2 py-1 rounded text-sm font-bold">
            ₹{price}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            {t('join')}
          </button>
          
          {phone && (
            <WhatsAppButton 
              phone={phone}
              eventDetails={eventDetails || { title, date, location }}
              className="px-3 py-2 text-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
