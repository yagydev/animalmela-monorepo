import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';

// GET /api/marketplace/[category] - Fetch listings by category
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    await dbConnect();
    
    const { category } = await params;
    const { searchParams } = request.nextUrl;
    
    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filters: any = { 
      category, 
      status: 'approved' 
    };
    
    if (condition && ['new', 'used'].includes(condition)) {
      filters.condition = condition;
    }
    
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }
    
    if (location) {
      filters.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort: any = {};
    if (sortBy === 'price') {
      sort.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sort.name = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.featured = -1;
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [listings, totalCount] = await Promise.all([
      MarketplaceListing.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      MarketplaceListing.countDocuments(filters)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: listings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });

  } catch (error) {
    console.error('Category API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST /api/marketplace/[category] - Create new listing in specific category
export async function POST(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    await dbConnect();
    
    const { category } = await params;
    const body = await request.json();
    
    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['name', 'description', 'condition', 'price', 'images', 'location', 'sellerId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate condition
    if (!['new', 'used'].includes(body.condition)) {
      return NextResponse.json(
        { success: false, error: 'Invalid condition' },
        { status: 400 }
      );
    }

    // Validate price
    if (body.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Create listing with category
    const listing = await MarketplaceListing.create({
      ...body,
      category,
      status: 'pending' // New listings need approval
    });

    return NextResponse.json({
      success: true,
      data: listing,
      message: 'Listing created successfully. It will be reviewed before going live.'
    }, { status: 201 });

  } catch (error) {
    console.error('Create Category Listing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
