'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BuildingStorefrontIcon,
  CubeIcon,
  CurrencyRupeeIcon,
  ChatBubbleLeftEllipsisIcon,
  PlusCircleIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  BookOpenIcon,
  PhoneIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalStalls: number;
  activeStalls: number;
  bookedStalls: number;
  totalRevenue: number;
}

interface StallBooking {
  _id: string;
  stallName: string;
  stallId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
}

interface DashboardData {
  vendor: {
    name: string;
    businessName: string;
    email: string;
    phone: string;
  };
  stats: DashboardStats;
  recentBookings: StallBooking[];
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

const QUICK_LINKS = [
  {
    label: 'Browse Stalls',
    href: '/vendors/book-stall',
    icon: MagnifyingGlassIcon,
    color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
  },
  {
    label: 'Manage Catalog',
    href: '/vendors/catalog',
    icon: BookOpenIcon,
    color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
  },
  {
    label: 'Book a Stall',
    href: '/vendors/book-stall',
    icon: BuildingStorefrontIcon,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
  },
  {
    label: 'Contact Support',
    href: 'tel:+911800123456',
    icon: PhoneIcon,
    color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
  },
];

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function VendorDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use demo vendorId for now; replace with session-based ID when auth is wired
      const res = await fetch('/api/marketplace/vendor/dashboard?vendorId=demo');
      if (res.status === 401) {
        setUnauthorized(true);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load dashboard data');
      }
      const json = await res.json();
      if (json.success && json.dashboard) {
        setData(json.dashboard);
      } else {
        throw new Error(json.error || 'Unexpected response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-md border border-yellow-200 p-8 text-center">
          <ExclamationCircleIcon className="w-14 h-14 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 text-sm mb-6">
            Please log in as a vendor to access your dashboard.
          </p>
          <Link
            href="/marketplace/auth"
            className="inline-block bg-green-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Log In / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-md border border-red-200 p-8 text-center">
          <ExclamationCircleIcon className="w-14 h-14 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const bookings = data?.recentBookings ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            {data?.vendor && (
              <p className="text-gray-500 mt-1 text-sm">
                Welcome back, <strong>{data.vendor.name}</strong> —{' '}
                {data.vendor.businessName}
              </p>
            )}
          </div>
          <Link
            href="/vendors/book-stall"
            className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm self-start sm:self-auto"
          >
            <BuildingStorefrontIcon className="w-4 h-4" />
            Book a Stall
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Stall Bookings"
            value={stats?.totalStalls ?? 0}
            icon={BuildingStorefrontIcon}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            label="Active Listings"
            value={stats?.activeStalls ?? 0}
            icon={CubeIcon}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Revenue"
            value={`₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`}
            icon={CurrencyRupeeIcon}
            color="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            label="Visitor Inquiries"
            value={stats?.bookedStalls ?? 0}
            icon={ChatBubbleLeftEllipsisIcon}
            color="bg-purple-100 text-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Bookings + Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Event Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-green-600" />
                  Upcoming Event Bookings
                </h2>
                <span className="text-xs text-gray-400">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
              </div>

              {bookings.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No upcoming bookings</p>
                  <Link
                    href="/vendors/book-stall"
                    className="mt-3 inline-block text-sm text-green-600 hover:underline"
                  >
                    Book a stall now
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Stall
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {booking.stallName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(booking.startDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            —{' '}
                            {new Date(booking.endDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                            ₹{booking.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                                STATUS_COLORS[booking.status] ?? 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* My Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-green-600" />
                  My Products
                </h2>
                <Link
                  href="/marketplace/sell"
                  className="inline-flex items-center gap-1.5 text-sm bg-green-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  Add Product
                </Link>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Manage your product listings and reach thousands of buyers across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/vendors/catalog"
                  className="flex-1 text-center border border-green-200 text-green-700 text-sm font-medium py-2.5 rounded-lg hover:bg-green-50 transition-colors"
                >
                  View All Listings
                </Link>
                <Link
                  href="/marketplace/sell"
                  className="flex-1 text-center bg-green-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-green-700 transition-colors"
                >
                  List New Product
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Quick Links */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex flex-col items-center justify-center gap-2 border rounded-xl p-4 text-sm font-medium transition-colors ${link.color}`}
                  >
                    <link.icon className="w-6 h-6" />
                    <span className="text-center leading-tight">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Vendor Profile Summary */}
            {data?.vendor && (
              <div className="bg-green-700 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-3">Your Profile</h3>
                <div className="space-y-2 text-sm text-green-100">
                  <p className="font-medium text-white">{data.vendor.businessName}</p>
                  <p>{data.vendor.email}</p>
                  <p>{data.vendor.phone}</p>
                </div>
                <Link
                  href="/marketplace/auth"
                  className="mt-4 block text-center bg-white text-green-700 font-semibold text-sm py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
