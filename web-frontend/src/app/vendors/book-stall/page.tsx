'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  StarIcon,
  UsersIcon,
  ChartBarIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

interface ApiStall {
  _id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  capacity: number;
  status: string;
}

interface StallTier {
  id: string;
  name: string;
  size: string;
  price: number;
  color: string;
  features: string[];
}

const STALL_TIERS: StallTier[] = [
  {
    id: 'standard',
    name: 'Standard Stall',
    size: '10×10 ft',
    price: 5000,
    color: 'green',
    features: [
      '100 sq ft exhibition space',
      'Basic furniture (1 table, 2 chairs)',
      'Electricity connection (5A)',
      'Business listing on website',
      'Entry passes (2)',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Stall',
    size: '15×15 ft',
    price: 8000,
    color: 'blue',
    features: [
      '225 sq ft exhibition space',
      'Premium furniture package',
      'Electricity connection (10A)',
      'Featured listing + social media mention',
      'Entry passes (5)',
      'Branded backdrop banner',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Stall',
    size: '20×20 ft',
    price: 12000,
    color: 'yellow',
    features: [
      '400 sq ft exhibition space',
      'Full furniture + display racks',
      'Electricity connection (15A)',
      'Homepage featured placement',
      'Entry passes (10)',
      'Custom branding support',
      'Dedicated event coordinator',
    ],
  },
];

const EVENTS = [
  'KisaanMela Delhi 2025',
  'KisaanMela Mumbai 2025',
  'KisaanMela Pune 2025',
  'KisaanMela Bangalore 2025',
];

const WHY_EXHIBIT = [
  {
    icon: UsersIcon,
    title: 'Massive Farmer Reach',
    desc: 'Connect directly with 10,000+ farmers, buyers, and agri-entrepreneurs across each event.',
  },
  {
    icon: ChartBarIcon,
    title: 'Drive Real Sales',
    desc: 'Showcase products and services to a highly targeted agricultural audience ready to buy.',
  },
  {
    icon: MegaphoneIcon,
    title: 'Brand Visibility',
    desc: 'Get featured on KisaanMela digital platforms, banners, and promotional materials.',
  },
  {
    icon: StarIcon,
    title: 'Network & Grow',
    desc: 'Build partnerships with agri-input companies, government bodies, and NGOs on-site.',
  },
];

type TierColor = 'green' | 'blue' | 'yellow';

const colorMap: Record<TierColor, { card: string; heading: string; price: string; badge: string; btn: string }> = {
  green: {
    card: 'bg-green-50 border-green-200',
    heading: 'text-green-800',
    price: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    btn: 'bg-green-600 hover:bg-green-700',
  },
  blue: {
    card: 'bg-blue-50 border-blue-200',
    heading: 'text-blue-800',
    price: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    btn: 'bg-blue-600 hover:bg-blue-700',
  },
  yellow: {
    card: 'bg-yellow-50 border-yellow-200',
    heading: 'text-yellow-800',
    price: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
    btn: 'bg-yellow-600 hover:bg-yellow-700',
  },
};

interface FormData {
  vendorName: string;
  companyName: string;
  phone: string;
  email: string;
  event: string;
  startDate: string;
  endDate: string;
  stallType: string;
  stallId: string;
  purpose: string;
  specialRequirements: string;
}

export default function BookStallPage() {
  const [apiStalls, setApiStalls] = useState<ApiStall[]>([]);
  const [loadingStalls, setLoadingStalls] = useState(true);
  const [selectedStall, setSelectedStall] = useState<ApiStall | null>(null);
  const [selectedTier, setSelectedTier] = useState<StallTier | null>(null);

  const [form, setForm] = useState<FormData>({
    vendorName: '',
    companyName: '',
    phone: '',
    email: '',
    event: '',
    startDate: '',
    endDate: '',
    stallType: '',
    stallId: '',
    purpose: '',
    specialRequirements: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ message: string; reference: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const res = await fetch('/api/marketplace/vendor/stalls?vendorId=public&status=active&limit=20');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.stalls)) {
            setApiStalls(data.stalls);
          }
        }
      } catch {
        // silently fall back to static tiers
      } finally {
        setLoadingStalls(false);
      }
    };
    fetchStalls();
  }, []);

  const useStaticFallback = !loadingStalls && apiStalls.length === 0;

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectApiStall = (stall: ApiStall) => {
    setSelectedStall(stall);
    setSelectedTier(null);
    setForm((prev) => ({ ...prev, stallId: stall._id, stallType: '' }));
  };

  const handleSelectTier = (tier: StallTier) => {
    setSelectedTier(tier);
    setSelectedStall(null);
    setForm((prev) => ({ ...prev, stallType: tier.id, stallId: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let url: string;
      let body: Record<string, unknown>;

      if (form.stallId) {
        url = `/api/marketplace/vendor/stalls/${form.stallId}/book`;
        body = {
          customerId: 'guest',
          customerName: form.vendorName,
          customerEmail: form.email,
          customerPhone: form.phone,
          startDate: form.startDate,
          endDate: form.endDate,
          purpose: form.purpose || form.event,
          specialRequirements: form.specialRequirements,
        };
      } else {
        url = '/api/marketplace/vendor/stalls';
        body = {
          vendorId: 'guest',
          name: `${form.stallType ? STALL_TIERS.find((t) => t.id === form.stallType)?.name : 'Stall'} - ${form.companyName}`,
          description: `Booking request from ${form.vendorName} for ${form.event}`,
          location: form.event,
          price: STALL_TIERS.find((t) => t.id === form.stallType)?.price ?? 5000,
          capacity: 50,
          availability: [{ startDate: form.startDate, endDate: form.endDate }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Booking failed. Please try again.');
      }

      const ref = data.booking?._id || data.stall?._id || `KM-${Date.now()}`;
      setSuccess({ message: data.message || 'Booking request submitted!', reference: ref });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-green-200 p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h2>
          <p className="text-gray-600 mb-4">{success.message}</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
            <p className="text-lg font-mono font-semibold text-green-700 break-all">{success.reference}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Our team will contact you shortly to confirm your stall booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/vendors/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => setSuccess(null)}
              className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Book Another Stall
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Vendor Portal
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Exhibition Stall</h1>
          <p className="text-xl text-gray-600">
            Reserve your space at KisaanMela and connect with thousands of farmers and agri-buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Stall Selection + Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stall Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BuildingStorefrontIcon className="w-5 h-5 text-green-600" />
                Select a Stall
              </h2>

              {loadingStalls ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : !useStaticFallback ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {apiStalls.map((stall) => (
                    <button
                      key={stall._id}
                      onClick={() => handleSelectApiStall(stall)}
                      className={`text-left rounded-lg border p-4 transition-all ${
                        selectedStall?._id === stall._id
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-gray-900">{stall.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            stall.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {stall.status === 'active' ? 'Available' : 'Booked'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">{stall.description}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          {stall.location}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-green-700">
                          <CurrencyRupeeIcon className="w-3.5 h-3.5" />
                          {stall.price.toLocaleString('en-IN')}/day
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Choose a stall tier that fits your needs:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {STALL_TIERS.map((tier) => {
                      const c = colorMap[tier.color as TierColor];
                      return (
                        <button
                          key={tier.id}
                          onClick={() => handleSelectTier(tier)}
                          className={`text-left rounded-lg border-2 p-4 transition-all ${
                            selectedTier?.id === tier.id
                              ? `${c.card} ring-2 ring-offset-1`
                              : `border-gray-200 hover:${c.card}`
                          } ${selectedTier?.id === tier.id ? c.card : ''}`}
                        >
                          <h3 className={`font-semibold mb-1 ${c.heading}`}>{tier.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{tier.size}</p>
                          <p className={`text-lg font-bold ${c.price}`}>
                            ₹{tier.price.toLocaleString('en-IN')}/day
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-green-600" />
                Booking Details
              </h2>

              {error && (
                <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                  <ExclamationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor / Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.vendorName}
                      onChange={(e) => handleFieldChange('vendorName', e.target.value)}
                      placeholder="Your full name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company / Farm Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.companyName}
                      onChange={(e) => handleFieldChange('companyName', e.target.value)}
                      placeholder="Your business or farm name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Event <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.event}
                    onChange={(e) => handleFieldChange('event', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">-- Choose an event --</option>
                    {EVENTS.map((ev) => (
                      <option key={ev} value={ev}>
                        {ev}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={form.startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleFieldChange('startDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={form.endDate}
                      min={form.startDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleFieldChange('endDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {useStaticFallback && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stall Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.stallType}
                      onChange={(e) => {
                        const tier = STALL_TIERS.find((t) => t.id === e.target.value);
                        if (tier) handleSelectTier(tier);
                        handleFieldChange('stallType', e.target.value);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">-- Choose stall type --</option>
                      {STALL_TIERS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} — {t.size} — ₹{t.price.toLocaleString('en-IN')}/day
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedStall && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                    Selected: <strong>{selectedStall.name}</strong> at {selectedStall.location} —{' '}
                    ₹{selectedStall.price.toLocaleString('en-IN')}/day
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose / Products to Display
                  </label>
                  <textarea
                    rows={2}
                    value={form.purpose}
                    onChange={(e) => handleFieldChange('purpose', e.target.value)}
                    placeholder="What will you exhibit? (e.g., organic vegetables, farm machinery...)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={form.specialRequirements}
                    onChange={(e) => handleFieldChange('specialRequirements', e.target.value)}
                    placeholder="Any special setup, power requirements, or accessibility needs..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || (!selectedStall && !selectedTier && !form.stallId)}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    'Submit Booking Request'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Why Exhibit */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Exhibit at KisaanMela?</h3>
              <div className="space-y-4">
                {WHY_EXHIBIT.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stall Pricing</h3>
              <div className="space-y-4">
                {STALL_TIERS.map((tier) => {
                  const c = colorMap[tier.color as TierColor];
                  return (
                    <div key={tier.id} className={`rounded-lg border p-4 ${c.card}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold text-sm ${c.heading}`}>{tier.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
                          {tier.size}
                        </span>
                      </div>
                      <p className={`text-xl font-bold mb-3 ${c.price}`}>
                        ₹{tier.price.toLocaleString('en-IN')}/day
                      </p>
                      <ul className="space-y-1">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                            <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-700 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2">Need help choosing?</h3>
              <p className="text-sm text-green-100 mb-4">
                Our team is here to help you pick the perfect stall for your business.
              </p>
              <a
                href="tel:+911800123456"
                className="block text-center bg-white text-green-700 font-semibold text-sm py-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                Call 1800-123-456
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
