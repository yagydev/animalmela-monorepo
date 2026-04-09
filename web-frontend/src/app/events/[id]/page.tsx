'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

type EventDoc = {
  _id: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  endDate?: string;
  location: { name?: string; address?: string; city: string; state: string; pincode?: string };
  image?: { url?: string; alt?: string };
  stallCapacity?: number;
  stallsBooked?: number;
  pricePerStall?: number;
  organizerPhone?: string;
  status?: string;
};

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingMsg, setBookingMsg] = useState('');

  useEffect(() => {
    if (!params?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/events/${params.id}`);
        const json = await res.json();
        if (cancelled) return;
        if (!json.success) throw new Error(json.message || 'Not found');
        setEvent(json.data);
      } catch (e: any) {
        setError(e.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  const handleBookStall = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${params.id}`);
      return;
    }
    if (!event) return;
    setBooking(true);
    setBookingMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: event._id, quantity: 1 }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Booking failed');
      setBookingMsg(`Stall booked! Booking ID: ${json.data._id}`);
      setEvent({ ...event, stallsBooked: (event.stallsBooked || 0) + 1 });
    } catch (e: any) {
      setBookingMsg(e.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading event…
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Event not found</h1>
        <p className="text-gray-600 mb-6">{error || 'This event may have been removed.'}</p>
        <Link href="/events" className="text-green-600 hover:text-green-700 font-medium">
          ← Back to all events
        </Link>
      </div>
    );
  }

  const remaining = Math.max(
    0,
    (event.stallCapacity || 0) - (event.stallsBooked || 0)
  );
  const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const canBookStall = isAuthenticated && ['vendor', 'seller', 'admin'].includes(user?.role || '');
  const whatsappPhone = event.organizerPhone || '919999778321';
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in "${event.title}" on ${eventDate} at ${event.location.city}. Could you share stall booking details?`
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {event.image?.url && (
        <div className="w-full h-64 sm:h-80 bg-gray-200 overflow-hidden">
          <img
            src={event.image.url}
            alt={event.image.alt || event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/events" className="text-sm text-green-600 hover:text-green-700">
          ← Back to all events
        </Link>

        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
          {event.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            📅 {eventDate}
          </span>
          <span className="inline-flex items-center gap-1">
            📍 {event.location.city}, {event.location.state}
          </span>
          {event.location.address && (
            <span className="inline-flex items-center gap-1">🏠 {event.location.address}</span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs uppercase text-gray-500">Stalls available</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {remaining} <span className="text-sm font-normal text-gray-500">/ {event.stallCapacity || 0}</span>
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs uppercase text-gray-500">Price per stall</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              ₹{(event.pricePerStall || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs uppercase text-gray-500">Status</p>
            <p className="mt-1 text-2xl font-semibold capitalize text-green-600">
              {remaining > 0 ? 'Open' : 'Sold out'}
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">About this event</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {event.content || event.description}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleBookStall}
            disabled={booking || remaining === 0 || (isAuthenticated && !canBookStall)}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
            title={
              isAuthenticated && !canBookStall
                ? 'Only vendors can book stalls'
                : remaining === 0
                ? 'No stalls remaining'
                : 'Book a stall'
            }
          >
            {booking
              ? 'Booking…'
              : remaining === 0
              ? 'Sold out'
              : !isAuthenticated
              ? 'Sign in to book a stall'
              : !canBookStall
              ? 'Vendors only'
              : `Book a stall — ₹${(event.pricePerStall || 0).toLocaleString('en-IN')}`}
          </button>

          <a
            href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M20.52 3.48A11.78 11.78 0 0012.05 0C5.5 0 .17 5.33.16 11.88c0 2.09.55 4.13 1.59 5.93L0 24l6.34-1.66a11.86 11.86 0 005.7 1.45h.01c6.55 0 11.88-5.33 11.89-11.88a11.8 11.8 0 00-3.42-8.43zM12.05 21.8h-.01a9.86 9.86 0 01-5.03-1.38l-.36-.21-3.76.99 1-3.66-.24-.38a9.85 9.85 0 01-1.51-5.27c.01-5.45 4.44-9.88 9.92-9.88a9.86 9.86 0 019.91 9.89c-.01 5.46-4.45 9.9-9.92 9.9z" />
            </svg>
            Contact organizer on WhatsApp
          </a>
        </div>

        {bookingMsg && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
            {bookingMsg}
          </div>
        )}
      </div>
    </div>
  );
}
