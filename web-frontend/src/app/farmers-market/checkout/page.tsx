'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// ---------- types matching cart / orders API ----------

interface CartListing {
  id: number | string;
  title: string;
  price: number;
  unit: string;
  images?: string[];
  category?: string;
}

interface CartItem {
  listingId: CartListing;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt: string;
}

interface Cart {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

interface ShippingAddress {
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

type PaymentMethod = 'cash_on_delivery' | 'upi' | 'net_banking';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

// ---------- page ----------

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [upiId, setUpiId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | number | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/farmers-market/cart', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart as Cart);
      } else {
        setCart(null);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCart(null);
    }
    setCartLoading(false);
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value as PaymentMethod);
  };

  const placeOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cart) return;
    setPlacingOrder(true);
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const paymentDetails: Record<string, string> = {
        method: paymentMethod,
        ...(paymentMethod === 'upi' ? { upiId } : {}),
      };

      const res = await fetch('/api/farmers-market/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: cart.items,
          shippingAddress: address,
          paymentMethod,
          paymentDetails,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const placed = Array.isArray(data.orders) ? data.orders[0] : data.order;
        setOrderId(placed?.id ?? 'N/A');
      } else {
        alert(data.error ?? data.message ?? 'Failed to place order');
      }
    } catch (err) {
      console.error('Place order error:', err);
      alert('An error occurred. Please try again.');
    }
    setPlacingOrder(false);
  };

  // ── Loading ──
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    );
  }

  // ── Empty cart ──
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500 mb-6">
            Add some products before checking out.
          </p>
          <Link
            href="/farmers-market"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ── Success screen ──
  if (orderId !== null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-10 text-center max-w-md w-full">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed!
          </h2>
          <p className="text-gray-600 mb-1">
            Your order has been placed successfully.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Order ID:{' '}
            <span className="font-semibold text-gray-800">#{orderId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/farmers-market/dashboard"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/farmers-market"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout form ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 text-sm">Complete your order below</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={placeOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: delivery + payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery address */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={address.mobile}
                      onChange={handleAddressChange}
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleAddressChange}
                      required
                      placeholder="House / Flat / Block No., Street"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={handleAddressChange}
                      placeholder="Village / Landmark (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      required
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="6-digit pincode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </section>

              {/* Payment method */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <PaymentOption
                    id="cod"
                    value="cash_on_delivery"
                    current={paymentMethod}
                    onChange={handlePaymentChange}
                    title="Cash on Delivery"
                    subtitle="Pay when your order arrives"
                  />
                  <PaymentOption
                    id="upi"
                    value="upi"
                    current={paymentMethod}
                    onChange={handlePaymentChange}
                    title="UPI"
                    subtitle="PhonePe, Google Pay, Paytm, etc."
                  />
                  {paymentMethod === 'upi' && (
                    <div className="ml-8 mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setUpiId(e.target.value)
                        }
                        required={paymentMethod === 'upi'}
                        placeholder="yourname@upi"
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  )}
                  <PaymentOption
                    id="net_banking"
                    value="net_banking"
                    current={paymentMethod}
                    onChange={handlePaymentChange}
                    title="Net Banking"
                    subtitle="All major Indian banks supported"
                  />
                </div>
              </section>
            </div>

            {/* Right column: order summary + place order */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4">
                  {cart.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div className="flex-1 pr-2">
                        <p className="font-medium text-gray-900 truncate">
                          {item.listingId.title}
                        </p>
                        <p className="text-gray-500">
                          {item.quantity} × ₹{item.unitPrice}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 whitespace-nowrap">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ₹{cart.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ₹{cart.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={placingOrder}
                  className="mt-6 w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placingOrder ? 'Placing Order…' : 'Place Order'}
                </button>

                <ul className="mt-4 text-xs text-gray-500 space-y-1">
                  <li>• Free delivery on all orders</li>
                  <li>• 7-day hassle-free return policy</li>
                  <li>• Secure payment processing</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- sub-components ----------

interface PaymentOptionProps {
  id: string;
  value: PaymentMethod;
  current: PaymentMethod;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  subtitle: string;
}

function PaymentOption({
  id,
  value,
  current,
  onChange,
  title,
  subtitle,
}: PaymentOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
        current === value
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <input
        id={id}
        type="radio"
        name="paymentMethod"
        value={value}
        checked={current === value}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
      />
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </label>
  );
}
