'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { sanitizeStoredAccessToken } from '@/lib/clientAccessToken';
import {
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  StarIcon,
  BellIcon,
  PlusCircleIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  AcademicCapIcon,
  HomeModernIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  mobile?: string;
}

interface DashboardStats {
  listings: number | null;
  orders: number | null;
  pendingOrders: number;
  revenue: null;
  rating: null;
  notifications: number;
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-20 mb-1" />
      <div className="h-3 bg-gray-100 rounded w-36" />
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    listings: null,
    orders: null,
    pendingOrders: 0,
    revenue: null,
    rating: null,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      if (typeof window !== 'undefined') sanitizeStoredAccessToken();
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [meRes, productsRes, ordersRes] = await Promise.all([
          fetch('/api/me', { headers, credentials: 'include' }),
          fetch('/api/marketplace/products?limit=1', { headers, credentials: 'include' }),
          fetch('/api/marketplace/orders?limit=1', { headers, credentials: 'include' }),
        ]);

        if (meRes.status === 401) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.success) setUser(meData.data.user);
        }

        let listings: number | null = null;
        let orders: number | null = null;

        if (productsRes.ok) {
          const pd = await productsRes.json();
          if (pd.success && pd.pagination?.totalProducts !== undefined) {
            listings = pd.pagination.totalProducts;
          }
        }

        if (ordersRes.ok) {
          const od = await ordersRes.json();
          if (od.success && od.pagination?.total !== undefined) {
            orders = od.pagination.total;
          }
        }

        setStats((prev) => ({ ...prev, listings, orders }));
      } catch {
        // network error — keep nulls
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Sign in required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your dashboard.</p>
          <Link
            href="/login"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'My Listings',
      value: stats.listings !== null ? String(stats.listings) : '0',
      description: 'Active product listings',
      icon: <ShoppingBagIcon className="h-6 w-6 text-green-600" />,
      color: 'border-green-200',
    },
    {
      label: 'Total Orders',
      value: stats.orders !== null ? String(stats.orders) : '0',
      description: 'Orders placed',
      icon: <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />,
      color: 'border-blue-200',
    },
    {
      label: 'Pending Orders',
      value: String(stats.pendingOrders),
      description: 'Awaiting your action',
      icon: <ClockIcon className="h-6 w-6 text-yellow-600" />,
      color: 'border-yellow-200',
    },
    {
      label: 'Revenue',
      value: '—',
      description: 'Total earnings',
      icon: <CurrencyRupeeIcon className="h-6 w-6 text-emerald-600" />,
      color: 'border-emerald-200',
    },
    {
      label: 'Reviews Rating',
      value: '—',
      description: 'Average customer rating',
      icon: <StarIcon className="h-6 w-6 text-purple-600" />,
      color: 'border-purple-200',
    },
    {
      label: 'Notifications',
      value: String(stats.notifications),
      description: 'Unread notifications',
      icon: <BellIcon className="h-6 w-6 text-red-600" />,
      color: 'border-red-200',
    },
  ];

  const quickActions = [
    { label: 'Add New Listing', href: '/marketplace/sell', icon: <PlusCircleIcon className="h-5 w-5" /> },
    { label: 'Browse Marketplace', href: '/marketplace', icon: <BuildingStorefrontIcon className="h-5 w-5" /> },
    { label: 'View Orders', href: '/farmers-market?tab=orders', icon: <TruckIcon className="h-5 w-5" /> },
    { label: 'Training', href: '/training', icon: <AcademicCapIcon className="h-5 w-5" /> },
    { label: 'Book Stall', href: '/vendors/book-stall', icon: <HomeModernIcon className="h-5 w-5" /> },
    { label: 'Government Schemes', href: '/training/subsidies', icon: <DocumentTextIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name ?? 'Farmer'}!
          </h1>
          <p className="text-gray-500 mt-1 capitalize">
            {user?.role ?? 'user'} account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-lg shadow-sm border ${card.color} p-6`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">{card.label}</span>
                {card.icon}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-colors text-center"
              >
                <span className="text-green-600">{action.icon}</span>
                <span className="text-xs font-medium text-gray-700 leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-10 text-gray-500">
            <ClipboardDocumentListIcon className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No recent activity yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
