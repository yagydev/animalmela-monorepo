import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/pool.js';
import { requireAuth, requireRole, type AuthRequest } from '../middleware/auth.js';
import { mockStore } from '../data/mockStore.js';

const bookingSchema = z.object({
  eventId: z.string().min(1),
  stallType: z.enum(['basic', 'premium', 'corner']),
  amount: z.number().positive()
});

export const stallsRouter = Router();

stallsRouter.post(
  '/book',
  requireAuth,
  requireRole('vendor'),
  async (req: AuthRequest, res) => {
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const { eventId, stallType, amount } = parsed.data;
    const mockTxnId = `MOCK_TXN_${Date.now()}`;

    try {
      const booking = await db.query(
        `
        INSERT INTO stall_bookings (event_id, vendor_id, stall_type, amount, payment_txn_id, status)
        VALUES ($1, $2, $3, $4, $5, 'confirmed')
        RETURNING id, event_id, vendor_id, stall_type, amount, payment_txn_id, status, created_at
        `,
        [eventId, req.user?.id ?? 'unknown-vendor', stallType, amount, mockTxnId]
      );

      return res.status(201).json({
        data: booking.rows[0],
        message: 'Stall booked with mock payment',
        source: 'postgres'
      });
    } catch {
      const booking = {
        id: `booking-mock-${Date.now()}`,
        event_id: eventId,
        vendor_id: req.user?.id ?? 'unknown-vendor',
        stall_type: stallType,
        amount,
        payment_txn_id: mockTxnId,
        status: 'confirmed' as const,
        created_at: new Date().toISOString()
      };
      mockStore.bookings.unshift(booking);
      return res.status(201).json({
        data: booking,
        message: 'Stall booked with mock payment',
        source: 'mock'
      });
    }
  }
);

stallsRouter.get('/bookings', requireAuth, requireRole('vendor', 'organizer'), async (req: AuthRequest, res) => {
  const isVendor = req.user?.role === 'vendor';
  try {
    const result = await db.query(
      `
        SELECT id, event_id, vendor_id, stall_type, amount, payment_txn_id, status, created_at
        FROM stall_bookings
        ${isVendor ? 'WHERE vendor_id = $1' : ''}
        ORDER BY created_at DESC
      `,
      isVendor ? [req.user?.id ?? ''] : []
    );

    return res.json({ data: result.rows, source: 'postgres' });
  } catch {
    const rows = isVendor
      ? mockStore.bookings.filter((booking) => booking.vendor_id === req.user?.id)
      : mockStore.bookings;
    return res.json({ data: rows, source: 'mock' });
  }
});
