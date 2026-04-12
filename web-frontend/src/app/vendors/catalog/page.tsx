'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CubeIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  availability: string;
  organic: boolean;
  images: string[];
  location?: {
    city?: string;
    state?: string;
  };
  createdAt?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const CATEGORIES = [
  'all',
  'vegetables',
  'fruits',
  'grains',
  'dairy',
  'livestock',
  'equipment',
  'seeds',
  'fertilizers',
  'others',
];

const AVAILABILITY_BADGE: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  'out-of-stock': 'bg-red-100 text-red-700',
  limited: 'bg-yellow-100 text-yellow-700',
};

export default function VendorCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (category !== 'all') params.set('category', category);

      const res = await fetch(`/api/marketplace/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();

      if (data.success) {
        // Client-side filter by search term
        const allProducts: Product[] = data.products ?? [];
        const filtered = search.trim()
          ? allProducts.filter(
              (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description?.toLowerCase().includes(search.toLowerCase()),
            )
          : allProducts;
        setProducts(filtered);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error || 'Could not load products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [category, page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/marketplace/products/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setDeleteSuccess('Product removed from your catalog.');
      setTimeout(() => setDeleteSuccess(null), 3000);
    } catch {
      setError('Could not delete product. Please try again.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Product Catalog</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage all your product listings in one place.
            </p>
          </div>
          <Link
            href="/marketplace/sell"
            className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm self-start sm:self-auto"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add New Product
          </Link>
        </div>

        {/* Alerts */}
        {deleteSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
            <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
            {deleteSuccess}
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative sm:w-48">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => fetchProducts()}
              className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-40 bg-gray-100 rounded-lg mb-3" />
                <div className="h-4 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-20 text-center">
            <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              {search || category !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : "You haven't added any products yet. Start listing to reach thousands of buyers."}
            </p>
            <Link
              href="/marketplace/sell"
              className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-40 bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <CubeIcon className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {product.organic && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        Organic
                      </span>
                    )}
                    <span
                      className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                        AVAILABILITY_BADGE[product.availability] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.availability?.replace('-', ' ') ?? 'Unknown'}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm truncate mb-0.5">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize mb-2">{product.category}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{product.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-green-700">
                        ₹{product.price.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-gray-500">/{product.unit}</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Qty: {product.quantity} {product.unit}
                      </span>
                    </div>

                    {product.location?.city && (
                      <p className="text-xs text-gray-400 mb-3">
                        {product.location.city}, {product.location.state}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/marketplace/sell?edit=${product._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 border border-green-200 text-green-700 text-xs font-medium py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <PencilSquareIcon className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      {deleteConfirm === product._id ? (
                        <div className="flex-1 flex gap-1">
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="flex-1 bg-red-600 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 border border-gray-300 text-gray-600 text-xs font-medium py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="inline-flex items-center justify-center gap-1.5 border border-red-200 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Showing page {pagination.currentPage} of {pagination.totalPages} (
                  {pagination.totalProducts} products)
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={!pagination.hasPrev}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={!pagination.hasNext}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
