import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Scheme } from '@/lib/models/MarketplaceModels';

// GET /api/marketplace/schemes - Get all government schemes
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const state = searchParams.get('state');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (state) filter['eligibility.state'] = state;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get schemes with pagination
    const schemes = await Scheme.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalSchemes = await Scheme.countDocuments(filter);
    const totalPages = Math.ceil(totalSchemes / limit);

    return NextResponse.json({
      success: true,
      schemes,
      pagination: {
        currentPage: page,
        totalPages,
        totalSchemes,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching schemes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schemes' },
      { status: 500 }
    );
  }
}

// POST /api/marketplace/schemes - Create new scheme (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      description,
      category,
      benefits,
      eligibility,
      applicationProcess,
      documents,
      contactInfo,
      validityPeriod,
      status
    } = body;

    // Validate required fields
    if (!name || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    const scheme = new Scheme({
      name,
      description,
      category,
      benefits,
      eligibility,
      applicationProcess,
      documents,
      contactInfo,
      validityPeriod,
      status: status || 'active'
    });

    await scheme.save();

    return NextResponse.json({
      success: true,
      scheme,
      message: 'Scheme created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating scheme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create scheme' },
      { status: 500 }
    );
  }
}
