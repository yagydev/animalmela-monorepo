'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CurrencyRupeeIcon,
  StarIcon,
  PlusIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { getCurrentUser, getCurrentToken, logout, User } from '../../../../lib/auth-client';

// ---------- shared types (derived from API shapes) ----------

interface Listing {
  id: number | string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  status: string;
  images?: string[];
  description?: string;
  rating?: number;
  reviews?: number;
}

interface OrderItem {
  listingId: { id: number | string; title: string };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: number | string;
  buyerId: { id: number | string; name: string } | null;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

// ---------- main page ----------

export default function FarmersMarketDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getCurrentToken();
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const [listingsRes, ordersRes] = await Promise.all([
        fetch('/api/farmers-market/listings', { headers }),
        fetch('/api/farmers-market/orders', { headers }),
      ]);

      const listingsData = await listingsRes.json();
      if (listingsData.success) {
        setListings(listingsData.listings ?? []);
      }

      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setOrders(ordersData.data ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // ── Not logged in ──
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-10 text-center max-w-md w-full">
          <UserCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your farmer dashboard.
          </p>
          <Link
            href="/farmers-market/login"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Stats
  const activeOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed');
  const totalSales = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const avgRating =
    listings.length > 0
      ? (
          listings.reduce((sum, l) => sum + (l.rating ?? 0), 0) / listings.length
        ).toFixed(1)
      : '—';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/farmers-market/management"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                Add Listing
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/farmers-market/login';
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="My Products"
            value={listings.length}
            icon={ShoppingBagIcon}
            color="green"
          />
          <StatCard
            label="Active Orders"
            value={activeOrders.length}
            icon={ClipboardDocumentListIcon}
            color="blue"
          />
          <StatCard
            label="Total Sales"
            value={`₹${totalSales.toLocaleString('en-IN')}`}
            icon={CurrencyRupeeIcon}
            color="yellow"
          />
          <StatCard
            label="Avg. Rating"
            value={avgRating}
            icon={StarIcon}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickAction
              href="/farmers-market/management"
              icon={PlusIcon}
              label="Add Listing"
              color="green"
            />
            <QuickAction
              href="/farmers-market/cart"
              icon={ShoppingCartIcon}
              label="View Cart"
              color="blue"
            />
            <QuickAction
              href="/farmers-market/orders"
              icon={TruckIcon}
              label="Track Orders"
              color="yellow"
            />
            <QuickAction
              href="/farmers-market/profile"
              icon={UserCircleIcon}
              label="Update Profile"
              color="purple"
            />
          </div>
        </div>

        {/* My Listings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Listings</h2>
            <Link
              href="/farmers-market/management"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Manage all →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <ShoppingBagIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="mb-3">No listings yet</p>
              <Link
                href="/farmers-market/management"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Add New Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onDelete={async (id) => {
                    const token = getCurrentToken();
                    const res = await fetch(
                      `/api/farmers-market/listings?id=${id}`,
                      {
                        method: 'DELETE',
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                      }
                    );
                    const data = await res.json();
                    if (data.success) fetchDashboardData();
                    else alert(data.message ?? 'Delete failed');
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/farmers-market/orders"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Buyer', 'Amount', 'Status', 'Date'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        #
                        {String(order.id).length > 6
                          ? String(order.id).slice(-6)
                          : order.id}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {order.buyerId?.name ?? 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- sub-components ----------

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: 'green' | 'blue' | 'yellow' | 'purple';
}

const colorMap: Record<StatCardProps['color'], { bg: string; text: string }> = {
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
};

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const { bg, text } = colorMap[color];
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bg}`}>
        <Icon className={`h-6 w-6 ${text}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

interface QuickActionProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  color: 'green' | 'blue' | 'yellow' | 'purple';
}

function QuickAction({ href, icon: Icon, label, color }: QuickActionProps) {
  const { bg, text } = colorMap[color];
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-center"
    >
      <div className={`p-3 rounded-full ${bg}`}>
        <Icon className={`h-6 w-6 ${text}`} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  );
}

interface ListingCardProps {
  listing: Listing;
  onDelete: (id: number | string) => void;
}

function ListingCard({ listing, onDelete }: ListingCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <img
        src={listing.images?.[0] ?? '/api/placeholder/300/200'}
        alt={listing.title}
        className="w-full h-36 object-cover bg-gray-100"
      />
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
        <p className="text-xs text-gray-500 capitalize mb-1">{listing.category}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-green-600">
            ₹{listing.price}/{listing.unit}
          </span>
          <span className="text-gray-500">{listing.quantity} {listing.unit}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <StatusBadge status={listing.status} />
          <div className="flex gap-2">
            <Link
              href={`/farmers-market/management?edit=${listing.id}`}
              className="text-blue-600 hover:text-blue-700"
              aria-label="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </Link>
            <button
              onClick={() => onDelete(listing.id)}
              className="text-red-500 hover:text-red-600"
              aria-label="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    inactive: 'bg-gray-100 text-gray-700',
    sold: 'bg-gray-100 text-gray-700',
  };
  const cls = variants[status] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${cls} capitalize`}>
      {status}
    </span>
  );
}
