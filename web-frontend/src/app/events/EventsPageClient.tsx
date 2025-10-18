'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MelaMap from '@/components/maps/MelaMap';
import WeatherWidget from '@/components/weather/WeatherWidget';
import EventSchema from '@/components/seo/EventSchema';

interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
  endDate: string;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  image: {
    url: string;
    alt?: string;
  };
  organizer?: {
    name: string;
    url?: string;
  };
  vendors: any[];
  status: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface EventsPageClientProps {
  initialEvents: Event[];
}

export default function EventsPageClient({ initialEvents }: EventsPageClientProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    featured: false,
    upcoming: true
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      queryParams.append('populate', '*');
      queryParams.append('filters[status]', 'published');
      
      if (filters.city) {
        queryParams.append('filters[location][city]', filters.city);
      }
      if (filters.state) {
        queryParams.append('filters[location][state]', filters.state);
      }
      if (filters.featured) {
        queryParams.append('filters[featured]', 'true');
      }
      if (filters.upcoming) {
        queryParams.append('filters[date][$gte]', new Date().toISOString());
      }

      const response = await fetch(`/api/cms/events?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.data) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueCities = () => {
    const cities = events.map(event => event.location.city).filter(Boolean);
    return [...new Set(cities)].sort();
  };

  const getUniqueStates = () => {
    const states = events.map(event => event.location.state).filter(Boolean);
    return [...new Set(states)].sort();
  };

  return (
    <>
      <Head>
        <title>Agricultural Events & Fairs | Kisan Mela</title>
        <meta name="description" content="Discover upcoming agricultural events, fairs, and exhibitions across India. Connect with farmers, vendors, and agricultural organizations." />
        <meta name="keywords" content="agricultural events, farmer fairs, kisan mela, agricultural exhibitions, farming events" />
        <link rel="canonical" href="https://www.kisanmela.com/events" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Agricultural Events & Fairs
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover upcoming agricultural events, farmer fairs, and exhibitions across India. 
                Connect with farmers, vendors, and agricultural organizations.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Cities</option>
                  {getUniqueCities().map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All States</option>
                  {getUniqueStates().map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={filters.featured}
                  onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Featured Events Only
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="upcoming"
                  checked={filters.upcoming}
                  onChange={(e) => setFilters({ ...filters, upcoming: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="upcoming" className="ml-2 text-sm text-gray-700">
                  Upcoming Events Only
                </label>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={event.image.url}
                      alt={event.image.alt || event.title}
                      className="w-full h-48 object-cover"
                    />
                    {event.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location.name}, {event.location.city}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                      <Link
                        href={`/events/${event.slug}`}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium text-center"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {events.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600">Try adjusting your filters to find more events.</p>
            </div>
          )}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedEvent.image.url}
                      alt={selectedEvent.image.alt || selectedEvent.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedEvent.content }} />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">Start:</span>
                            <span className="ml-2">{formatDate(selectedEvent.date)}</span>
                          </div>
                          {selectedEvent.endDate && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">End:</span>
                              <span className="ml-2">{formatDate(selectedEvent.endDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedEvent.location.coordinates && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                          <MelaMap
                            eventLocation={selectedEvent.location}
                            showDirections={true}
                            className="mb-4"
                          />
                          <WeatherWidget
                            coordinates={selectedEvent.location.coordinates}
                            className="mb-4"
                          />
                        </div>
                      )}

                      {selectedEvent.organizer && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-900 mb-2">Organizer</h3>
                          <p className="text-sm text-gray-600">{selectedEvent.organizer.name}</p>
                          {selectedEvent.organizer.url && (
                            <a
                              href={selectedEvent.organizer.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 text-sm"
                            >
                              Visit Website →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schema.org structured data for each event */}
        {events.map((event) => (
          <EventSchema key={event._id} event={event} />
        ))}
      </div>
    </>
  );
}
