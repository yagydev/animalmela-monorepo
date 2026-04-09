'use client';

import { useEffect, useState } from 'react';
import { BookingModal } from '@/components/mvp/BookingModal';
import type { EventItem } from '@/components/mvp/EventCard';
import { fetchEventById } from '../../../../lib/mvpApi';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [openBooking, setOpenBooking] = useState(false);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchEventById(params.id)
      .then((data) => {
        if (active) setEvent(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {loading ? 'Loading event...' : event?.title ?? 'Event Detail'}
      </h1>
      <p className="text-sm text-gray-600">Event ID: {params.id}</p>
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        {event ? (
          <div className="space-y-2 text-sm text-gray-700">
            <p>{event.description}</p>
            <p>Location: {event.location}</p>
            <p>Starts: {new Date(event.startDate).toLocaleDateString()}</p>
            <p>Price: ₹{event.price}</p>
          </div>
        ) : (
          <p className="text-gray-700">Event details are unavailable right now.</p>
        )}
        <div className="mt-4">
          <button
            disabled={!event || loading}
            onClick={() => setOpenBooking(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            Book Stall
          </button>
        </div>
      </div>

      <BookingModal eventId={params.id} open={openBooking} onClose={() => setOpenBooking(false)} />
    </div>
  );
}
