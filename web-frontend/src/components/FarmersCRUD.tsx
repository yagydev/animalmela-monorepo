'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MapPinIcon,
  UserIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
// import Image from 'next/image';
import ImageUploader, { ImageFile } from './ImageUploader';
import CursorPrompt from './CursorPrompt';
import { cachedFetch, apiCache } from '../lib/apiCache';

interface Farmer {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  location: {
    state: string;
    district: string;
    pincode: string;
    village: string;
  };
  products: string[];
  images: string[];
  createdAt: string;
}

interface FarmersCRUDProps {
  className?: string;
}

export default function FarmersCRUD({ className = '' }: FarmersCRUDProps) {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    location: {
      state: '',
      district: '',
      pincode: '',
      village: ''
    },
    products: [] as string[]
  });
  const [images, setImages] = useState<ImageFile[]>([]);
  const [saving, setSaving] = useState(false);

  const loadFarmers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cachedFetch('/api/farmers-market/farmers', {}, 60000); // Cache for 1 minute
      setFarmers(data.farmers || []);
    } catch (error) {
      console.error('Error loading farmers:', error);
      // Use demo data if API fails
      setFarmers([
        {
          _id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          mobile: '9876543210',
          location: {
            state: 'Punjab',
            district: 'Ludhiana',
            pincode: '141001',
            village: 'Village A'
          },
          products: ['Wheat', 'Rice', 'Corn'],
          images: [
            'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop'
          ],
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          mobile: '9876543211',
          location: {
            state: 'Haryana',
            district: 'Karnal',
            pincode: '132001',
            village: 'Village B'
          },
          products: ['Rice', 'Vegetables', 'Fruits'],
          images: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'
          ],
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load farmers data
  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      location: {
        state: '',
        district: '',
        pincode: '',
        village: ''
      },
      products: []
    });
    setImages([]);
    setEditingFarmer(null);
  };

  const handleAddFarmer = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditFarmer = (farmer: Farmer) => {
    setFormData({
      name: farmer.name,
      email: farmer.email,
      mobile: farmer.mobile,
      location: farmer.location,
      products: farmer.products
    });
    
    // Convert existing images to ImageFile format
    const existingImages: ImageFile[] = farmer.images.map((url, index) => ({
      id: `existing-${index}`,
      file: new File([], 'existing-image'),
      preview: url,
      uploaded: true,
      url: url
    }));
    setImages(existingImages);
    
    setEditingFarmer(farmer);
    setShowForm(true);
  };

  const handleDeleteFarmer = async (farmerId: string) => {
    if (!confirm('Are you sure you want to delete this farmer?')) return;

    try {
      const response = await fetch(`/api/farmers-market/farmers/${farmerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setFarmers(farmers.filter(f => f._id !== farmerId));
        // Clear cache to ensure fresh data on next load
        apiCache.clear('/api/farmers-market/farmers:{}');
      } else {
        // Simulate deletion for demo
        setFarmers(farmers.filter(f => f._id !== farmerId));
        // Clear cache to ensure fresh data on next load
        apiCache.clear('/api/farmers-market/farmers:{}');
      }
    } catch (error) {
      console.error('Error deleting farmer:', error);
      // Simulate deletion for demo
      setFarmers(farmers.filter(f => f._id !== farmerId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const farmerData = {
        ...formData,
        images: images.filter(img => img.uploaded).map(img => img.url || img.preview)
      };

      const url = editingFarmer 
        ? `/api/farmers-market/farmers/${editingFarmer._id}`
        : '/api/farmers-market/farmers';
      
      const method = editingFarmer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(farmerData)
      });

      if (response.ok) {
        const newFarmer = await response.json();
        if (editingFarmer) {
          setFarmers(farmers.map(f => f._id === editingFarmer._id ? newFarmer : f));
        } else {
          setFarmers([...farmers, newFarmer]);
        }
        // Clear cache to ensure fresh data on next load
        apiCache.clear('/api/farmers-market/farmers:{}');
        setShowForm(false);
        resetForm();
      } else {
        // Simulate success for demo
        const newFarmer: Farmer = {
          _id: editingFarmer?._id || Math.random().toString(),
          ...farmerData,
          createdAt: new Date().toISOString()
        };
        
        if (editingFarmer) {
          setFarmers(farmers.map(f => f._id === editingFarmer._id ? newFarmer : f));
        } else {
          setFarmers([...farmers, newFarmer]);
        }
        setShowForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving farmer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProductsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const productsArray = value.split(',').map(p => p.trim()).filter(p => p);
    setFormData(prev => ({
      ...prev,
      products: productsArray
    }));
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Farmers Management</h2>
          <p className="text-gray-600">Manage farmer profiles, products, and images</p>
        </div>
        <button
          onClick={handleAddFarmer}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Farmer</span>
        </button>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {farmers.map((farmer) => (
          <div key={farmer._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Images */}
            <div className="h-48 bg-gray-100 relative">
              {farmer.images && farmer.images.length > 0 ? (
                <div className="relative h-full">
                  <img
                    src={farmer.images[0]}
                    alt={farmer.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    style={{ cursor: 'zoom-in' }}
                  />
                  {farmer.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      +{farmer.images.length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{farmer.name}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditFarmer(farmer)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit farmer"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFarmer(farmer._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete farmer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4" />
                  <span>{farmer.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{farmer.location.district}, {farmer.location.state}</span>
                </div>
                <div>
                  <span className="font-medium">Products:</span> {farmer.products.join(', ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowForm(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                      <input
                        type="text"
                        name="location.district"
                        value={formData.location.district}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        name="location.pincode"
                        value={formData.location.pincode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                      <input
                        type="text"
                        name="location.village"
                        value={formData.location.village}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Products (comma-separated)</label>
                      <input
                        type="text"
                        value={formData.products.join(', ')}
                        onChange={handleProductsChange}
                        placeholder="Wheat, Rice, Corn"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                    <ImageUploader
                      images={images}
                      onImagesChange={setImages}
                      maxImages={5}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingFarmer ? 'Update' : 'Save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cursor Prompt */}
      <CursorPrompt />
    </div>
  );
}
