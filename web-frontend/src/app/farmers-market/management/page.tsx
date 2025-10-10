'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductManagement, ProductStats } from '../../../components/ProductManagement';
import { FarmersMarketCard } from '../../../components/FarmersMarketCard';
import { 
  PlusIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../../../../lib/auth-client';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  category: string;
  subcategory?: string;
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  status: 'active' | 'inactive' | 'sold';
  featured: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  negotiable: boolean;
  minimumOrder: number;
  tags: string[];
  sellerId: {
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
    rating: {
      average: number;
      count: number;
    };
    verified: boolean;
    joinDate: string;
  };
  location: {
    state: string;
    district: string;
    pincode: string;
    village: string;
  };
}

export default function FarmersMarketManagement() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/farmers-market/marketplace');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProducts(data.listings || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    router.push(`/farmers-market/edit-product/${product._id}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/farmers-market/marketplace/${productId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p._id !== productId));
          alert('Product deleted successfully');
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    try {
      const response = await fetch('/api/farmers-market/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: productId,
          quantity: quantity
        })
      });
      
      if (response.ok) {
        alert(`Added ${quantity} item(s) to cart`);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart');
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    try {
      // API call to toggle favorite
      console.log('Toggle favorite:', productId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'products', label: 'Products', icon: DocumentTextIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please sign in to access the management dashboard.</p>
          <Link
            href="/farmers-market/login"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign In
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
            <div className="flex items-center space-x-4">
              <Link
                href="/farmers-market"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                ← Back to Farmers Market
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Management Dashboard</h1>
                <p className="text-gray-600">Manage your products and analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
              <Link
                href="/farmers-market/add-product"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Product</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <ProductStats products={products} />
            
            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
                <Link
                  href="/farmers-market/management?tab=products"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  View All
                </Link>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first product</p>
                  <Link
                    href="/farmers-market/add-product"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Product
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice(0, 6).map((product) => (
                    <FarmersMarketCard
                      key={product._id}
                      product={product}
                      variant="management"
                      onProductClick={handleProductClick}
                      onEditProduct={handleEditProduct}
                      onDeleteProduct={handleDeleteProduct}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/farmers-market/add-product"
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <PlusIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Add Product</p>
                    <p className="text-lg font-bold text-gray-900">New Listing</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/farmers-market/management?tab=products"
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Manage Products</p>
                    <p className="text-lg font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/farmers-market/management?tab=analytics"
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Analytics</p>
                    <p className="text-lg font-bold text-gray-900">View Stats</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/farmers-market/management?tab=settings"
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <Cog6ToothIcon className="h-8 w-8 text-gray-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Settings</p>
                    <p className="text-lg font-bold text-gray-900">Configure</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <ProductManagement
            farmerId={user._id}
            onProductClick={handleProductClick}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{products.length}</div>
                  <div className="text-sm text-gray-500">Total Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {products.reduce((sum, p) => sum + p.views, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {products.reduce((sum, p) => sum + p.likes, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {products.length > 0 
                      ? (products.reduce((sum, p) => sum + p.rating.average, 0) / products.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <div className="text-sm text-gray-500">Avg Rating</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h2>
              
              <div className="space-y-4">
                {products
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{product.title}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{product.views} views</div>
                        <div className="text-sm text-gray-500">{product.rating.average}★</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue={user.mobile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="pt-4">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">New Order Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified when you receive new orders</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Product Review Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified when customers review your products</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Marketing Updates</h3>
                    <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <FarmersMarketCard
                product={selectedProduct}
                variant="detailed"
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
