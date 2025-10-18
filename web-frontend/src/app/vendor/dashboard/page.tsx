'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

interface Stall {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  availability: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  status: string;
  bookings: any[];
  createdAt: string;
}

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface DashboardData {
  vendor: Vendor;
  stats: {
    totalStalls: number;
    activeStalls: number;
    bookedStalls: number;
    totalRevenue: number;
  };
  stalls: Stall[];
  recentBookings: any[];
}

export default function VendorDashboard() {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock vendor ID - in real app, this would come from auth context
  const vendorId = 'mock-vendor-id';

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/marketplace/vendor/dashboard?vendorId=${vendorId}`);
      const data = await response.json();

      if (data.success) {
        setDashboardData(data.dashboard);
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error fetching dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600">No dashboard data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('vendor_dashboard')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('welcome_back')}, {dashboardData.vendor.name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('total_stalls')}</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalStalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('active_stalls')}</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.activeStalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('booked_stalls')}</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.bookedStalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('total_revenue')}</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('overview')}
              </button>
              <button
                onClick={() => setActiveTab('stalls')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stalls'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('my_stalls')}
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('bookings')}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('recent_bookings')}</h3>
                {dashboardData.recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📅</div>
                    <p className="text-gray-600">{t('no_recent_bookings')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentBookings.slice(0, 5).map((booking, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{booking.stallName}</h4>
                            <p className="text-sm text-gray-600">{booking.customerName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {t(booking.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stalls Tab */}
            {activeTab === 'stalls' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{t('my_stalls')}</h3>
                  <Link
                    href="/vendor/stalls/create"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    {t('add_new_stall')}
                  </Link>
                </div>

                {dashboardData.stalls.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🏪</div>
                    <p className="text-gray-600 mb-4">{t('no_stalls_yet')}</p>
                    <Link
                      href="/vendor/stalls/create"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                      {t('create_first_stall')}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.stalls.map((stall) => (
                      <div key={stall._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold text-gray-900">{stall.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(stall.status)}`}>
                            {t(stall.status)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stall.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{t('location')}:</span>
                            <span className="text-gray-900">{stall.location.city}, {stall.location.state}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{t('price')}:</span>
                            <span className="text-gray-900 font-medium">{formatCurrency(stall.price)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{t('capacity')}:</span>
                            <span className="text-gray-900">{stall.capacity} {t('people')}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            href={`/vendor/stalls/${stall._id}`}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium text-center transition-colors duration-200"
                          >
                            {t('view_details')}
                          </Link>
                          <Link
                            href={`/vendor/stalls/${stall._id}/edit`}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors duration-200"
                          >
                            {t('edit')}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('all_bookings')}</h3>
                {dashboardData.recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-gray-600">{t('no_bookings_yet')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentBookings.map((booking, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{booking.stallName}</h4>
                            <p className="text-gray-600">{booking.customerName}</p>
                            <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {t(booking.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">{t('booking_dates')}</p>
                            <p className="text-gray-900">
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('purpose')}</p>
                            <p className="text-gray-900">{booking.purpose || t('not_specified')}</p>
                          </div>
                        </div>

                        {booking.specialRequirements && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500">{t('special_requirements')}</p>
                            <p className="text-gray-900">{booking.specialRequirements}</p>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200">
                            {t('approve')}
                          </button>
                          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200">
                            {t('reject')}
                          </button>
                          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors duration-200">
                            {t('contact')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
