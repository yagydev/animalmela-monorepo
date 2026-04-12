'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { getCurrentUser, getCurrentToken, User } from '../../../../lib/auth-client';

// ---------- types ----------

interface Listing {
  id: number | string;
  title: string;
  category: string;
  description?: string;
  price: number;
  quantity: number;
  unit: string;
  status: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  createdAt?: string;
}

interface ListingFormData {
  title: string;
  category: string;
  description: string;
  price: string;
  quantity: string;
  unit: string;
}

const CATEGORIES = [
  'vegetables',
  'fruits',
  'grains',
  'dairy',
  'poultry',
  'spices',
  'pulses',
  'oilseeds',
  'other',
];

const UNITS = ['kg', 'quintal', 'ton', 'liter', 'piece', 'dozen', 'bundle'];

const EMPTY_FORM: ListingFormData = {
  title: '',
  category: '',
  description: '',
  price: '',
  quantity: '',
  unit: 'kg',
};

// ---------- page ----------

export default function FarmersMarketManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState<ListingFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const token = getCurrentToken();
      const res = await fetch('/api/farmers-market/listings', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setListings(data.listings ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const openAddForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (listing: Listing) => {
    setEditingId(listing.id);
    setFormData({
      title: listing.title,
      category: listing.category,
      description: listing.description ?? '',
      price: String(listing.price),
      quantity: String(listing.quantity),
      unit: listing.unit,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const token = getCurrentToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        unit: formData.unit,
      };

      let res: Response;
      if (editingId !== null) {
        res = await fetch(
          `/api/farmers-market/listings?id=${editingId}`,
          { method: 'PUT', headers, body: JSON.stringify(payload) }
        );
      } else {
        res = await fetch('/api/farmers-market/listings', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        fetchListings();
      } else {
        setFormError(data.error ?? data.message ?? 'Failed to save listing');
      }
    } catch (err) {
      console.error('Save listing error:', err);
      setFormError('An error occurred. Please try again.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    try {
      const token = getCurrentToken();
      const res = await fetch(`/api/farmers-market/listings?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert(data.error ?? data.message ?? 'Delete failed');
      }
    } catch (err) {
      console.error('Delete listing error:', err);
      alert('An error occurred. Please try again.');
    }
  };

  // ── Not logged in ──
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-10 text-center max-w-md w-full">
          <ShoppingBagIcon className="h-14 w-14 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to manage your product listings.
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/farmers-market/dashboard"
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                ← Dashboard
              </Link>
              <div className="h-5 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Product Management
                </h1>
                <p className="text-gray-500 text-sm">
                  Manage your product listings
                </p>
              </div>
            </div>
            <button
              onClick={openAddForm}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Inline add/edit form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId !== null ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close form"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Fresh Organic Tomatoes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white capitalize"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹ per unit) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Available <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  required
                  min="0"
                  step="1"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Describe your product (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? 'Saving…'
                    : editingId !== null
                    ? 'Update Product'
                    : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listings table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              My Products{' '}
              <span className="text-sm font-normal text-gray-500">
                ({listings.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBagIcon className="h-14 w-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No products yet
              </h3>
              <p className="text-gray-500 mb-5">
                Start listing your farm produce to reach buyers across India.
              </p>
              <button
                onClick={openAddForm}
                className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                <PlusIcon className="h-4 w-4" />
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Product Name',
                      'Category',
                      'Price',
                      'Quantity',
                      'Status',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-900 max-w-xs">
                        <div className="truncate">{listing.title}</div>
                        {listing.description && (
                          <div className="text-xs text-gray-400 truncate">
                            {listing.description}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-600 capitalize whitespace-nowrap">
                        {listing.category}
                      </td>
                      <td className="px-5 py-4 text-gray-900 font-medium whitespace-nowrap">
                        ₹{listing.price.toLocaleString('en-IN')}/{listing.unit}
                      </td>
                      <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                        {listing.quantity} {listing.unit}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={listing.status} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEditForm(listing)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-medium"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
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

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-700',
    sold: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };
  const cls = variants[status] ?? 'bg-gray-100 text-gray-700';
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${cls} capitalize`}
    >
      {status}
    </span>
  );
}
