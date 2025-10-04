'use client';

import React from 'react';
// import Image from 'next/image';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CartItemProps {
  item: {
    listingId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    listingId?: {
      _id: string;
      title: string;
      unit: string;
      images?: string[];
      sellerId?: {
        name: string;
      };
      category?: string;
    };
  };
  onUpdateQuantity: (listingId: string, quantity: number) => void;
  onRemoveItem: (listingId: string) => void;
  variant?: 'default' | 'compact';
}

export function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem, 
  variant = 'default' 
}: CartItemProps) {
  const getImageSrc = () => {
    if (item.listingId?.images && item.listingId.images.length > 0) {
      return item.listingId.images[0];
    }
    // Fallback to category-based placeholder with Unsplash images
    const categoryPlaceholders = {
      crops: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=64&h=64&fit=crop',
      livestock: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=64&h=64&fit=crop',
      seeds: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=64&h=64&fit=crop',
      equipment: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=64&h=64&fit=crop',
    };
    return categoryPlaceholders[item.listingId?.category as keyof typeof categoryPlaceholders] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=64&h=64&fit=crop';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
        <div className="relative w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={getImageSrc()}
            alt={item.listingId?.title || 'Product'}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{item.listingId?.title}</h4>
          <p className="text-xs text-gray-500">{formatPrice(item.unitPrice)}/{item.listingId?.unit}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">×{item.quantity}</span>
          <span className="text-sm font-semibold text-green-600">{formatPrice(item.totalPrice)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={getImageSrc()}
            alt={item.listingId?.title || 'Product'}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{item.listingId?.title}</h3>
          <p className="text-sm text-gray-600">{formatPrice(item.unitPrice)} per {item.listingId?.unit}</p>
          <p className="text-xs text-gray-500">Seller: {item.listingId?.sellerId?.name}</p>
          {item.listingId?.category && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
              {item.listingId.category}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.listingId, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Decrease quantity"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          
          <button
            onClick={() => onUpdateQuantity(item.listingId, item.quantity + 1)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            title="Increase quantity"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-right min-w-0">
          <p className="font-semibold text-gray-900">{formatPrice(item.totalPrice)}</p>
        </div>
        
        <button
          onClick={() => onRemoveItem(item.listingId)}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          title="Remove from cart"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Enhanced Shopping Cart Component with better image display
export function EnhancedShoppingCart() {
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
            }
          ],
          totalAmount: 8450,
          itemCount: 3
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/farmers-market/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        await fetchCart(); // Refresh cart
      } else {
        alert(data.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (listingId: string, quantity: number) => {
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
        await fetchCart(); // Refresh cart
      } else {
        alert(data.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const proceedToCheckout = () => {
    window.location.href = '/farmers-market/checkout';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
        <a
          href="/farmers-market"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="text-sm text-gray-500">{cart.itemCount} items</span>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
              <p className="text-lg font-semibold text-gray-900">
                Total: {formatPrice(cart.totalAmount)}
              </p>
              <p className="text-sm text-gray-600">
                {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            
            <button
              onClick={proceedToCheckout}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
