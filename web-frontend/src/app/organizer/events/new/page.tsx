'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

export default function NewEventPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    date: '',
    endDate: '',
    locationName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    imageUrl: '',
    stallCapacity: '20',
    pricePerStall: '5000',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect non-organizers away
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login?redirect=/organizer/events/new');
      return;
    }
    if (user && !['organizer', 'admin'].includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          content: form.content || form.description,
          date: form.date,
          endDate: form.endDate || form.date,
          location: {
            name: form.locationName,
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          image: { url: form.imageUrl, alt: form.title },
          stallCapacity: Number(form.stallCapacity),
          pricePerStall: Number(form.pricePerStall),
          status: 'published',
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to create event');
      router.push(`/events/${json.data._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/events" className="text-sm text-green-600 hover:text-green-700">
          ← Back to events
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Create a new event</h1>
        <p className="mt-1 text-gray-600">
          Add details about your mela. Vendors will be able to book stalls once
          you publish.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white border border-gray-200 rounded-lg p-6 space-y-5"
        >
          <div>
            <label className={labelCls}>Event title</label>
            <input
              required
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Punjab Kisaan Mela 2026"
            />
          </div>

          <div>
            <label className={labelCls}>Short description</label>
            <textarea
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className={inputCls}
              placeholder="One-line summary shown in event listings"
            />
          </div>

          <div>
            <label className={labelCls}>Full details</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={5}
              className={inputCls}
              placeholder="Schedule, attractions, who should attend…"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Start date</label>
              <input
                required
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>End date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Venue name</label>
              <input
                required
                name="locationName"
                value={form.locationName}
                onChange={handleChange}
                className={inputCls}
                placeholder="Krishi Bhawan Ground"
              />
            </div>
            <div>
              <label className={labelCls}>Pincode</label>
              <input
                required
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className={inputCls}
                placeholder="141001"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Address</label>
            <input
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputCls}
              placeholder="Street, area"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input
                required
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input
                required
                name="state"
                value={form.state}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Cover image URL</label>
            <input
              required
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className={inputCls}
              placeholder="https://…"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Number of stalls</label>
              <input
                required
                type="number"
                min={0}
                name="stallCapacity"
                value={form.stallCapacity}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Price per stall (₹)</label>
              <input
                required
                type="number"
                min={0}
                name="pricePerStall"
                value={form.pricePerStall}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg"
          >
            {submitting ? 'Publishing…' : 'Publish event'}
          </button>
        </form>
      </div>
    </div>
  );
}
