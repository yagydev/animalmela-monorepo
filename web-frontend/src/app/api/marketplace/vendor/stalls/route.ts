import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Stall, MarketplaceUser } from '@/lib/models/MarketplaceModels';

// GET /api/marketplace/vendor/stalls - Get vendor's stalls
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    // Build filter
    const filter = { vendor: vendorId };
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get stalls
    const stalls = await Stall.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalStalls = await Stall.countDocuments(filter);
    const totalPages = Math.ceil(totalStalls / limit);

    return NextResponse.json({
      success: true,
      stalls,
      pagination: {
        currentPage: page,
        totalPages,
        totalStalls,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching stalls:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stalls' },
      { status: 500 }
    );
  }
}

// POST /api/marketplace/vendor/stalls - Create new stall
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      vendorId,
      name,
      description,
      location,
      price,
      capacity,
      amenities,
      images,
      availability
    } = body;

    if (!vendorId || !name || !description || !location || !price) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Verify vendor exists
    const vendor = await MarketplaceUser.findById(vendorId);
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const stall = new Stall({
      vendor: vendorId,
      name,
      description,
      location,
      price,
      capacity,
      amenities,
      images,
      availability,
      status: 'active'
    });

    await stall.save();

    return NextResponse.json({
      success: true,
      stall,
      message: 'Stall created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating stall:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create stall' },
      { status: 500 }
    );
  }
}
