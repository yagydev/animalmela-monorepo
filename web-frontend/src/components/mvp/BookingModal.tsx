'use client';

import { useState } from 'react';
import { createBooking } from '../../lib/mvpApi';

interface BookingModalProps {
  eventId: string;
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ eventId, open, onClose }: BookingModalProps) {
  const [stallType, setStallType] = useState<'basic' | 'premium' | 'corner'>('basic');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!open) return null;

  const amount = stallType === 'basic' ? 2500 : stallType === 'premium' ? 5000 : 7000;

  const handleBook = async () => {
    setStatus('loading');
    try {
      const ok = await createBooking({ eventId, stallType, amount });
      setStatus(ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white p-5">
        <h3 className="text-xl font-semibold text-gray-900">Book Stall</h3>
        <p className="mt-1 text-sm text-gray-600">Event ID: {eventId}</p>
        <label className="mt-4 block text-sm font-medium text-gray-700">Stall type</label>
        <select
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          value={stallType}
          onChange={(e) => setStallType(e.target.value as 'basic' | 'premium' | 'corner')}
        >
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="corner">Corner</option>
        </select>
        <p className="mt-3 text-sm text-gray-700">Amount: ₹{amount}</p>

        {status === 'success' && (
          <p className="mt-2 text-sm text-green-700">Booking confirmed with mock payment.</p>
        )}
        {status === 'error' && (
          <p className="mt-2 text-sm text-red-700">Booking failed. Please retry.</p>
        )}

        <div className="mt-5 flex gap-2 justify-end">
          <button
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="rounded-md bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800 disabled:opacity-60"
            onClick={handleBook}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Processing...' : 'Pay & Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
