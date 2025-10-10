'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  TagIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  ChartBarIcon,
  PhotoIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

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
}

interface ProductManagementProps {
  farmerId?: string;
  showAddButton?: boolean;
  onProductClick?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  className?: string;
}

export function ProductManagement({
  farmerId,
  showAddButton = true,
  onProductClick,
  onEditProduct,
  onDeleteProduct,
  className = ''
}: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const router = useRouter();

  // Mock data for demo
  const mockProducts: Product[] = [
    {
      _id: '1',
      title: 'Premium Organic Wheat - Grade A',
      description: 'High-quality organic wheat grown using traditional farming methods.',
      price: 2500,
      unit: 'quintal',
      quantity: 10,
      category: 'crops',
      subcategory: 'grains',
      images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
      rating: { average: 4.3, count: 15 },
      status: 'active',
      featured: true,
      views: 1250,
      likes: 89,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      negotiable: true,
      minimumOrder: 1,
      tags: ['organic', 'premium', 'wheat']
    },
    {
      _id: '2',
      title: 'Fresh Organic Rice - Basmati',
      description: 'Premium quality Basmati rice grown organically.',
      price: 1800,
      unit: 'quintal',
      quantity: 5,
      category: 'crops',
      subcategory: 'grains',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'],
      rating: { average: 4.1, count: 12 },
      status: 'active',
      featured: false,
      views: 890,
      likes: 45,
      createdAt: '2024-01-10T08:15:00Z',
      updatedAt: '2024-01-18T12:30:00Z',
      negotiable: true,
      minimumOrder: 1,
      tags: ['basmati', 'organic', 'aromatic']
    },
    {
      _id: '3',
      title: 'Fresh Vegetables Bundle',
      description: 'Mixed seasonal vegetables freshly harvested.',
      price: 500,
      unit: 'kg',
      quantity: 20,
      category: 'vegetables',
      subcategory: 'mixed',
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop'],
      rating: { average: 4.5, count: 8 },
      status: 'inactive',
      featured: false,
      views: 450,
      likes: 23,
      createdAt: '2024-01-05T14:20:00Z',
      updatedAt: '2024-01-12T09:30:00Z',
      negotiable: false,
      minimumOrder: 2,
      tags: ['fresh', 'seasonal', 'mixed']
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const url = farmerId 
          ? `/api/farmers-market/marketplace?farmerId=${farmerId}`
          : '/api/farmers-market/marketplace';
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProducts(data.listings || []);
          } else {
            throw new Error('Failed to fetch products');
          }
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.warn('Using mock data:', error);
        // Fallback to mock data
        setProducts(mockProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [farmerId]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'views':
        return b.views - a.views;
      case 'rating':
        return b.rating.average - a.rating.average;
      default:
        return 0;
    }
  });

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      router.push(`/farmers-market/product/${product._id}`);
    }
  };

  const handleEditProduct = (product: Product) => {
    if (onEditProduct) {
      onEditProduct(product);
    } else {
      router.push(`/farmers-market/edit-product/${product._id}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (onDeleteProduct) {
      onDeleteProduct(productId);
    } else {
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
    }
  };

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === sortedProducts.length) {
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedProducts(new Set(sortedProducts.map(p => p._id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.size === 0) return;
    
    const productIds = Array.from(selectedProducts);
    
    try {
      switch (action) {
        case 'activate':
          await Promise.all(productIds.map(id => 
            fetch(`/api/farmers-market/marketplace/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'active' })
            })
          ));
          break;
        case 'deactivate':
          await Promise.all(productIds.map(id => 
            fetch(`/api/farmers-market/marketplace/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'inactive' })
            })
          ));
          break;
        case 'delete':
          if (confirm(`Are you sure you want to delete ${productIds.length} products?`)) {
            await Promise.all(productIds.map(id => 
              fetch(`/api/farmers-market/marketplace/${id}`, { method: 'DELETE' })
            ));
          }
          break;
      }
      
      // Refresh products
      setProducts(products.filter(p => !productIds.includes(p._id)));
      setSelectedProducts(new Set());
      setShowBulkActions(false);
      alert(`Bulk ${action} completed successfully`);
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Failed to perform bulk action');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your product listings</p>
        </div>
        
        {showAddButton && (
          <button
            onClick={() => router.push('/farmers-market/add-product')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="sold">Sold</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Categories</option>
              <option value="crops">Crops</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="dairy">Dairy</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="views">Most Views</option>
              <option value="rating">Highest Rating</option>
            </select>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedProducts.size} product(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          {showAddButton && (
            <button
              onClick={() => router.push('/farmers-market/add-product')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {sortedProducts.map((product) => (
            <div
              key={product._id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Checkbox */}
              <div className="p-4 flex items-start">
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product._id)}
                  onChange={() => handleSelectProduct(product._id)}
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              {/* Image */}
              <div className={`${viewMode === 'list' ? 'w-32 h-24' : 'w-full h-48'} bg-gray-200 relative`}>
                <img
                  src={product.images[0] || '/api/placeholder/300/200'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                    Featured
                  </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${getStatusColor(product.status)}`}>
                  {product.status}
                </div>
              </div>

              {/* Content */}
              <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                  
                  {viewMode === 'grid' && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CurrencyRupeeIcon className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">{formatPrice(product.price)}</span>
                      <span className="text-sm text-gray-500">/{product.unit}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating.average)}
                      <span className="text-sm text-gray-600">({product.rating.count})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {product.views}
                      </span>
                      <span>Qty: {product.quantity}</span>
                    </div>
                    <span className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDate(product.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleProductClick(product)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="Edit Product"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete Product"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">ID: {product._id.slice(-6)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Select All */}
      {sortedProducts.length > 0 && (
        <div className="flex items-center justify-between py-4 border-t border-gray-200">
          <button
            onClick={handleSelectAll}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {selectedProducts.size === sortedProducts.length ? 'Deselect All' : 'Select All'}
          </button>
          
          <div className="text-sm text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
          </div>
        </div>
      )}
    </div>
  );
}

// Product Statistics Component
export function ProductStats({ products }: { products: Product[] }) {
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    sold: products.filter(p => p.status === 'sold').length,
    featured: products.filter(p => p.featured).length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    totalLikes: products.reduce((sum, p) => sum + p.likes, 0),
    averageRating: products.length > 0 
      ? products.reduce((sum, p) => sum + p.rating.average, 0) / products.length 
      : 0
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <DocumentTextIcon className="h-8 w-8 text-blue-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <ChartBarIcon className="h-8 w-8 text-green-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Active</p>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <EyeIcon className="h-8 w-8 text-purple-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Total Views</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <StarIcon className="h-8 w-8 text-yellow-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Avg Rating</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
