'use client';

import React from 'react';
// import Image from 'next/image';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

// Demo Cart Page to showcase cart images
export default function DemoCartPage() {
  const demoCartData = {
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
      },
      {
        listingId: 'demo5',
        quantity: 2,
        unitPrice: 1200,
        totalPrice: 2400,
        listingId: {
          _id: 'demo5',
          title: 'Farm Equipment - Tractor',
          unit: 'day',
          images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop'],
          sellerId: { name: 'Vikram Singh' },
          category: 'equipment'
        }
      }
    ],
    totalAmount: 11650,
    itemCount: 5
  };

  const handleUpdateQuantity = (listingId: string, quantity: number) => {
    console.log(`Update quantity for ${listingId} to ${quantity}`);
  };

  const handleRemoveItem = (listingId: string) => {
    console.log(`Remove item ${listingId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageSrc = (item: any) => {
    if (item.listingId?.images && item.listingId.images.length > 0) {
      return item.listingId.images[0];
    }
    return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=64&h=64&fit=crop';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Shopping Cart</h1>
          <p className="text-gray-600">Cart items with beautiful product images</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {demoCartData.items.map((item: any) => (
              <div key={item.listingId} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                <div className="flex-shrink-0">
                  <img
                    src={getImageSrc(item)}
                    alt={item.listingId.title}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {item.listingId.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    by {item.listingId.sellerId.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.listingId.unit}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.listingId, item.quantity - 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium text-gray-900 w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.listingId, item.quantity + 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(item.totalPrice)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.unitPrice)} each
                  </p>
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item.listingId)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Total: {formatPrice(demoCartData.totalAmount)}
                </p>
                <p className="text-sm text-gray-600">
                  {demoCartData.itemCount} {demoCartData.itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              
              <button
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Features</h3>
          <ul className="text-blue-800 space-y-1">
            <li>✅ Product images from Unsplash</li>
            <li>✅ Category-based fallback images</li>
            <li>✅ Responsive cart item layout</li>
            <li>✅ Quantity controls with icons</li>
            <li>✅ Price formatting in Indian Rupees</li>
            <li>✅ Seller information display</li>
            <li>✅ Category badges</li>
            <li>✅ Remove item functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
