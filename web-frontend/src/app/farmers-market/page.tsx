'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MarketplaceBrowser } from '../../components/FarmersMarket';
import { CartItem } from '../../components/CartItem';
import { getCurrentUser, logout, isAuthenticated } from '../../../lib/auth-client';

// Main Farmers' Market Page
export default function FarmersMarketPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('browse');
  const searchParams = useSearchParams();

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
  }, []);

  // Handle URL query parameters for tab switching
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['browse', 'cart', 'orders', 'profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.reload();
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farmers' Market</h1>
              <p className="text-gray-600">Fresh products from local farmers</p>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                  <a
                    href="/farmers-management"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Manage Farmers
                  </a>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  Please sign in to access Farmers Market features
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && <MarketplaceBrowser />}
        {activeTab === 'cart' && <ShoppingCartTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
}

// Shopping Cart Tab Component
function ShoppingCartTab() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Show demo cart data when not logged in
        setCart({
          items: [
            {
              listingId: 'demo1',
              quantity: 2,
              unitPrice: 2500,
              totalPrice: 5000,
              listingId: {
                _id: 'demo1',
                title: 'Fresh Organic Wheat',
                unit: 'quintal',
                images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
                sellerId: { name: 'Rajesh Kumar' },
                category: 'crops'
              }
            },
            {
              listingId: 'demo2',
              quantity: 1,
              unitPrice: 3000,
              totalPrice: 3000,
              listingId: {
                _id: 'demo2',
                title: 'Premium Rice',
                unit: 'quintal',
                images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'],
                sellerId: { name: 'Priya Sharma' },
                category: 'crops'
              }
            },
            {
              listingId: 'demo3',
              quantity: 3,
              unitPrice: 150,
              totalPrice: 450,
              listingId: {
                _id: 'demo3',
                title: 'Fresh Tomatoes',
                unit: 'kg',
                images: ['https://images.unsplash.com/photo-1546470427-5c4b1b4b8b8b?w=300&h=200&fit=crop'],
                sellerId: { name: 'Amit Singh' },
                category: 'crops'
              }
            },
            {
              listingId: 'demo4',
              quantity: 1,
              unitPrice: 800,
              totalPrice: 800,
              listingId: {
                _id: 'demo4',
                title: 'Fresh Milk',
                unit: 'liter',
                images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop'],
                sellerId: { name: 'Sunita Devi' },
                category: 'livestock'
              }
            }
          ],
          totalAmount: 9250,
          itemCount: 4
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/farmers-market/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      } else {
        // Show demo data if API fails
        setCart({
          items: [
            {
              listingId: 'demo1',
              quantity: 1,
              unitPrice: 2500,
              totalPrice: 2500,
              listingId: {
                _id: 'demo1',
                title: 'Fresh Organic Wheat',
                unit: 'quintal',
                images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
                sellerId: { name: 'Rajesh Kumar' },
                category: 'crops'
              }
            }
          ],
          totalAmount: 2500,
          itemCount: 1
        });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Show demo data on error
      setCart({
        items: [
          {
            listingId: 'demo1',
            quantity: 1,
            unitPrice: 2500,
            totalPrice: 2500,
            listingId: {
              _id: 'demo1',
              title: 'Fresh Organic Wheat',
              unit: 'quintal',
              images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
              sellerId: { name: 'Rajesh Kumar' },
              category: 'crops'
            }
          }
        ],
        totalAmount: 2500,
        itemCount: 1
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (listingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farmers-market/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ listingId })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchCart();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(listingId);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farmers-market/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ listingId, quantity })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchCart();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const proceedToCheckout = () => {
    window.location.href = '/farmers-market/checkout';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-2 text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-4">Add some products from the marketplace</p>
        <button
          onClick={() => setActiveTab('browse')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {cart.items.map((item: any) => (
            <CartItem
              key={item.listingId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              variant="default"
            />
          ))}
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-medium text-gray-900">
                Total: ₹{cart.totalAmount}
              </p>
              <p className="text-sm text-gray-600">
                {cart.itemCount} items
              </p>
            </div>
            
            <button
              onClick={proceedToCheckout}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Orders Tab Component
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to view your orders');
        return;
      }

      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-2 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
          <button
            onClick={() => setActiveTab('browse')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">₹{order.totalAmount}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Items:</h4>
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm text-gray-600">
                    <span>{item.listingId?.title || 'Product'} x {item.quantity}</span>
                    <span>₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>
              
              {order.shippingAddress && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900">Shipping Address:</h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Profile Tab Component
function ProfileTab() {
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    location: {
      state: '',
      district: '',
      pincode: '',
      village: ''
    },
    paymentPreferences: {
      preferredMethods: [],
      upiId: '',
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        bankName: ''
      }
    }
  });

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
      setProfileData(prev => ({ ...prev, ...userData }));
    }
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farmers-market/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully');
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">👤</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in to view profile</h3>
        <p className="text-gray-600 mb-4">Use the sign-in button in the main header to access your profile settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={profileData.mobile}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="location.state"
              value={profileData.location.state}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">District</label>
            <input
              type="text"
              name="location.district"
              value={profileData.location.district}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pincode</label>
            <input
              type="text"
              name="location.pincode"
              value={profileData.location.pincode}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Village</label>
            <input
              type="text"
              name="location.village"
              value={profileData.location.village}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">UPI ID</label>
            <input
              type="text"
              name="paymentPreferences.upiId"
              value={profileData.paymentPreferences.upiId}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="yourname@upi"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
