'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';

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
  organizer?: string;
  vendors: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  tags: string[];
}

interface Vendor {
  _id: string;
  vendorName: string;
  slug: string;
  stallNumber: string;
  productType: string;
  description: string;
  contactInfo: {
    name?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  location: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  image?: {
    url: string;
    alt?: string;
  };
  status: 'active' | 'inactive' | 'pending';
  verified: boolean;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  unit: string;
  category: string;
  subcategory?: string;
  image: {
    url: string;
    alt?: string;
  };
  vendor: string;
  availability: {
    inStock: boolean;
    quantity: number;
    minOrder: number;
  };
  quality: 'premium' | 'standard' | 'budget';
  organic: boolean;
  certifications: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
}

export default function CMSAdmin() {
  const [activeTab, setActiveTab] = useState<'events' | 'vendors' | 'products'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'events':
          response = await fetch('/api/cms/events?populate=*');
          const eventsData = await response.json();
          setEvents(eventsData.data || []);
          break;
        case 'vendors':
          response = await fetch('/api/cms/vendors?populate=*');
          const vendorsData = await response.json();
          setVendors(vendorsData.data || []);
          break;
        case 'products':
          response = await fetch('/api/cms/products?populate=*');
          const productsData = await response.json();
          setProducts(productsData.data || []);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/cms/${type}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert('Item deleted successfully');
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  const handleStatusChange = async (id: string, type: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/cms/${type}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: { status: newStatus }
        })
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert('Status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
      case 'inactive':
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderEventsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full object-cover" src={event.image.url} alt={event.title} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(event.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {event.location.city}, {event.location.state}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <select
                  value={event.status}
                  onChange={(e) => handleStatusChange(event._id, 'events', e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  onClick={() => handleDelete(event._id, 'events')}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderVendorsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stall</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vendors.map((vendor) => (
            <tr key={vendor._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {vendor.image && (
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={vendor.image.url} alt={vendor.vendorName} />
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                    <div className="text-sm text-gray-500">{vendor.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vendor.stallNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vendor.productType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(vendor)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <select
                  value={vendor.status}
                  onChange={(e) => handleStatusChange(vendor._id, 'vendors', e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  onClick={() => handleDelete(vendor._id, 'vendors')}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProductsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full object-cover" src={product.image.url} alt={product.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{product.price}/{product.unit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <select
                  value={product.status}
                  onChange={(e) => handleStatusChange(product._id, 'products', e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                <button
                  onClick={() => handleDelete(product._id, 'products')}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Head>
        <title>CMS Admin | Kisan Mela</title>
        <meta name="description" content="Content Management System for Kisan Mela" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">CMS Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage events, vendors, and products</p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {[
                { key: 'events', label: 'Events', count: events.length },
                { key: 'vendors', label: 'Vendors', count: vendors.length },
                { key: 'products', label: 'Products', count: products.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 capitalize">
                  {activeTab} Management
                </h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowForm(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Add New {activeTab.slice(0, -1)}
                </button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <>
                  {activeTab === 'events' && renderEventsTable()}
                  {activeTab === 'vendors' && renderVendorsTable()}
                  {activeTab === 'products' && renderProductsTable()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
