'use client';

import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon,
  MapPinIcon,
  XMarkIcon,
  CheckCircleIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface Workshop {
  id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  location?: string;
  durationDays: number;
  price: number;
  instructor: string;
  enrolled: number;
  date: string;
  description: string;
}

const workshops: Workshop[] = [
  {
    id: '1',
    title: 'Modern Drip Irrigation Techniques',
    category: 'Crop Management',
    mode: 'Online',
    durationDays: 2,
    price: 0,
    instructor: 'Dr. Ramesh Yadav',
    enrolled: 245,
    date: '2026-05-10',
    description:
      'Learn water-efficient drip irrigation setups, scheduling, and maintenance to maximise yield while conserving water resources.',
  },
  {
    id: '2',
    title: 'Organic Farming Certification',
    category: 'Organic Farming',
    mode: 'Hybrid',
    durationDays: 5,
    price: 500,
    instructor: 'Priya Joshi',
    enrolled: 89,
    date: '2026-05-18',
    description:
      'A comprehensive course covering soil health, natural pest management, composting, and the organic certification process.',
  },
  {
    id: '3',
    title: 'Drone Technology in Agriculture',
    category: 'Technology',
    mode: 'Online',
    durationDays: 1,
    price: 0,
    instructor: 'AgriTech Labs',
    enrolled: 412,
    date: '2026-05-25',
    description:
      'Hands-on introduction to agricultural drones — from crop surveillance and spraying to data interpretation using drone imagery.',
  },
  {
    id: '4',
    title: 'Kisan Credit Card & Loan Management',
    category: 'Finance',
    mode: 'Offline',
    location: 'Pune',
    durationDays: 1,
    price: 0,
    instructor: 'NABARD',
    enrolled: 167,
    date: '2026-06-02',
    description:
      'Understand Kisan Credit Card eligibility, application procedures, loan limits, repayment options, and interest subvention benefits.',
  },
  {
    id: '5',
    title: 'Hydroponics for Small Farmers',
    category: 'Technology',
    mode: 'Online',
    durationDays: 3,
    price: 1200,
    instructor: 'HydroGrow India',
    enrolled: 78,
    date: '2026-06-08',
    description:
      'Set up low-cost hydroponic systems, select the right nutrient solutions, and grow high-value crops without soil in limited spaces.',
  },
  {
    id: '6',
    title: 'Goat Farming Best Practices',
    category: 'Livestock',
    mode: 'Offline',
    location: 'Delhi',
    durationDays: 2,
    price: 0,
    instructor: 'CIRG',
    enrolled: 234,
    date: '2026-06-14',
    description:
      'Covers breed selection, feeding management, health care, disease prevention, and profitable marketing strategies for goat farmers.',
  },
];

const CATEGORIES = ['All', 'Crop Management', 'Livestock', 'Organic Farming', 'Technology', 'Finance'];
const MODES = ['All', 'Online', 'Offline', 'Hybrid'];

interface RegistrationForm {
  name: string;
  phone: string;
  email: string;
}

const categoryColors: Record<string, string> = {
  'Crop Management': 'bg-green-100 text-green-800',
  Livestock: 'bg-yellow-100 text-yellow-800',
  'Organic Farming': 'bg-lime-100 text-lime-800',
  Technology: 'bg-blue-100 text-blue-800',
  Finance: 'bg-purple-100 text-purple-800',
};

const modeColors: Record<string, string> = {
  Online: 'bg-sky-100 text-sky-800',
  Offline: 'bg-orange-100 text-orange-800',
  Hybrid: 'bg-teal-100 text-teal-800',
};

export default function WorkshopsPageClient() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [form, setForm] = useState<RegistrationForm>({ name: '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const filtered = workshops.filter((w) => {
    const matchSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || w.category === categoryFilter;
    const matchMode = modeFilter === 'All' || w.mode === modeFilter;
    const matchDuration =
      durationFilter === 'All' ||
      (durationFilter === '1' && w.durationDays === 1) ||
      (durationFilter === '2' && w.durationDays === 2) ||
      (durationFilter === '3+' && w.durationDays >= 3);
    const matchPrice =
      priceFilter === 'All' ||
      (priceFilter === 'Free' && w.price === 0) ||
      (priceFilter === 'Paid' && w.price > 0);
    return matchSearch && matchCategory && matchMode && matchDuration && matchPrice;
  });

  const freeCount = workshops.filter((w) => w.price === 0).length;
  const onlineCount = workshops.filter((w) => w.mode === 'Online').length;

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function handleRegister(workshop: Workshop) {
    setSelectedWorkshop(workshop);
    setForm({ name: '', phone: '', email: '' });
    setSubmitted(false);
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function closeModal() {
    setSelectedWorkshop(null);
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-3">Training Workshops</h1>
          <p className="text-green-100 text-lg max-w-2xl">
            Hands-on training programs led by agricultural experts. Enhance your skills and grow your farm.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="bg-green-700 bg-opacity-60 rounded-full px-4 py-1">
              {workshops.length} workshops available
            </span>
            <span className="bg-green-700 bg-opacity-60 rounded-full px-4 py-1">
              {freeCount} free workshops
            </span>
            <span className="bg-green-700 bg-opacity-60 rounded-full px-4 py-1">
              {onlineCount} online workshops
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Workshops</h3>
            <span className="ml-auto text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search workshops or instructors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode */}
            <div>
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                {MODES.map((m) => (
                  <option key={m} value={m}>
                    {m === 'All' ? 'All Modes' : m}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="All">Any Duration</option>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3+">3+ Days</option>
              </select>
            </div>
          </div>

          {/* Price toggle */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Price:</span>
            {['All', 'Free', 'Paid'].map((p) => (
              <button
                key={p}
                onClick={() => setPriceFilter(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  priceFilter === p
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Workshop Cards */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((workshop) => (
              <div
                key={workshop.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Card header */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 border-b border-gray-100">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        categoryColors[workshop.category] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {workshop.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        modeColors[workshop.mode] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {workshop.mode}
                      {workshop.location ? ` · ${workshop.location}` : ''}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 leading-snug">{workshop.title}</h3>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workshop.description}</p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <AcademicCapIcon className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{workshop.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{formatDate(workshop.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-green-500 shrink-0" />
                      <span>
                        {workshop.durationDays} {workshop.durationDays === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>
                    {workshop.location && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-green-500 shrink-0" />
                        <span>{workshop.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{workshop.enrolled.toLocaleString()} enrolled</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <span
                      className={`text-lg font-bold ${
                        workshop.price === 0 ? 'text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {workshop.price === 0 ? 'Free' : `₹${workshop.price.toLocaleString()}`}
                    </span>
                    <button
                      onClick={() => handleRegister(workshop)}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No workshops match your filters</h3>
            <p className="text-gray-500 mb-6">Try adjusting the search or filters above.</p>
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setModeFilter('All');
                setDurationFilter('All');
                setPriceFilter('All');
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {selectedWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {submitted ? (
              <div className="p-8 text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Confirmed!</h2>
                <p className="text-gray-600 mb-1">
                  You have successfully registered for:
                </p>
                <p className="font-semibold text-green-700 mb-4">{selectedWorkshop.title}</p>
                <p className="text-sm text-gray-500 mb-6">
                  A confirmation will be sent to your email. See you on{' '}
                  {new Date(selectedWorkshop.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  !
                </p>
                <button
                  onClick={closeModal}
                  className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Register for Workshop</h2>
                <p className="text-sm text-gray-500 mb-5 line-clamp-1">{selectedWorkshop.title}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      required
                      placeholder="10-digit mobile number"
                      pattern="[6-9][0-9]{9}"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-sm text-gray-600">
                    <span>Workshop Fee:</span>
                    <span className={`font-semibold ${selectedWorkshop.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {selectedWorkshop.price === 0 ? 'Free' : `₹${selectedWorkshop.price.toLocaleString()}`}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Confirm Registration
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
