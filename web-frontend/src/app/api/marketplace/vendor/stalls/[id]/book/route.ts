import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Stall, MarketplaceUser } from '@/lib/models/MarketplaceModels';

// POST /api/marketplace/vendor/stalls/[id]/book - Book a stall
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const stallId = params.id;
    const body = await request.json();
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      endDate,
      purpose,
      specialRequirements
    } = body;

    if (!customerId || !customerName || !customerEmail || !customerPhone || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Get stall
    const stall = await Stall.findById(stallId);
    if (!stall) {
      return NextResponse.json(
        { success: false, error: 'Stall not found' },
        { status: 404 }
      );
    }

    // Check if stall is available
    if (stall.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Stall is not available for booking' },
        { status: 400 }
      );
    }

    // Check for date conflicts
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const hasConflict = stall.bookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      return (
        (startDateObj >= bookingStart && startDateObj <= bookingEnd) ||
        (endDateObj >= bookingStart && endDateObj <= bookingEnd) ||
        (startDateObj <= bookingStart && endDateObj >= bookingEnd)
      );
    });

    if (hasConflict) {
      return NextResponse.json(
        { success: false, error: 'Stall is already booked for the selected dates' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      startDate: startDateObj,
      endDate: endDateObj,
      purpose,
      specialRequirements,
      status: 'pending',
      createdAt: new Date()
    };

    stall.bookings.push(booking);
    await stall.save();

    return NextResponse.json({
      success: true,
      booking,
      message: 'Stall booking request submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error booking stall:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to book stall' },
      { status: 500 }
    );
  }
}

// GET /api/marketplace/vendor/stalls/[id]/bookings - Get stall bookings
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const stallId = params.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const stall = await Stall.findById(stallId).lean();
    if (!stall) {
      return NextResponse.json(
        { success: false, error: 'Stall not found' },
        { status: 404 }
      );
    }

    let bookings = stall.bookings || [];
    
    // Filter by status if provided
    if (status) {
      bookings = bookings.filter(booking => booking.status === status);
    }

    // Sort by creation date
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      bookings,
      stall: {
        _id: stall._id,
        name: stall.name,
        location: stall.location
      }
    });

  } catch (error) {
    console.error('Error fetching stall bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stall bookings' },
      { status: 500 }
    );
  }
}
