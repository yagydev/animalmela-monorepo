import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../../lib/database';
import Booking from '../../../../models/Booking';
import { Event } from '../../../../lib/models/CMSModels';
import { requireAuth, requireRole } from '../../../../lib/apiAuth';

// GET /api/bookings  — current user's bookings (vendor sees own; admin sees all)
export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if ('error' in auth) return auth.error;

  try {
    await connectDB();
    const query: any = auth.user.role === 'admin' ? {} : { vendor: auth.user.id };

    const bookings = await Booking.find(query)
      .populate('event', 'title date location image pricePerStall')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    console.error('GET /api/bookings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings  — vendor books one or more stalls in an event
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if ('error' in auth) return auth.error;

  const forbidden = requireRole(auth.user, ['vendor', 'seller', 'admin']);
  if (forbidden) return forbidden;

  try {
    await connectDB();
    const { eventId, quantity = 1, stallNumber, contactPhone, notes } =
      await request.json();

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return NextResponse.json(
        { success: false, message: 'Valid eventId is required' },
        { status: 400 }
      );
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    const remaining = (event.stallCapacity || 0) - (event.stallsBooked || 0);
    if (remaining < qty) {
      return NextResponse.json(
        { success: false, message: `Only ${remaining} stalls remaining` },
        { status: 409 }
      );
    }

    const amount = (event.pricePerStall || 0) * qty;

    let booking;
    try {
      booking = await Booking.create({
        event: event._id,
        vendor: auth.user.id,
        quantity: qty,
        amount,
        stallNumber,
        contactPhone,
        notes,
        paymentStatus: 'pending',
        paymentProvider: 'mock',
        status: 'pending',
      });
    } catch (e: any) {
      if (e.code === 11000) {
        return NextResponse.json(
          { success: false, message: 'You already have a booking for this event' },
          { status: 409 }
        );
      }
      throw e;
    }

    event.stallsBooked = (event.stallsBooked || 0) + qty;
    await event.save();

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/bookings error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
