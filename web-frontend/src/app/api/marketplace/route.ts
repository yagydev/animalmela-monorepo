import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import MarketplaceUser from '@/lib/models/MarketplaceUser';

// GET /api/marketplace - Fetch all listings with filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: any = { status: 'approved' };
    
    if (category && category !== 'all' && ['equipment', 'livestock', 'product'].includes(category)) {
      query.category = category;
    }
    
    if (condition && condition !== 'all' && ['new', 'used'].includes(condition)) {
      query.condition = condition;
    }
    
    if (minPrice) {
      query.price = { ...query.price, $gte: parseInt(minPrice) };
    }
    
    if (maxPrice) {
      query.price = { ...query.price, $lte: parseInt(maxPrice) };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    let sort: any = {};
    if (sortBy === 'price') {
      sort.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sort.name = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.featured = -1; // Featured first
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const [listings, totalCount] = await Promise.all([
      MarketplaceListing.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      MarketplaceListing.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: listings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    });

  } catch (error) {
    console.error('Marketplace API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}


// POST /api/marketplace - Create new listing
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'condition', 'price', 'images', 'location', 'sellerId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(body.category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
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

    // Get seller info
    const seller = await MarketplaceUser.findById(body.sellerId);
    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Seller not found' },
        { status: 404 }
      );
    }

    // Create listing
    const listing = await MarketplaceListing.create({
      ...body,
      sellerName: seller.name,
      sellerPhone: seller.phone,
      status: 'pending' // New listings need approval
    });

    // Update seller's listing count
    await MarketplaceUser.findByIdAndUpdate(body.sellerId, {
      $inc: { totalListings: 1 },
      lastActive: new Date()
    });

    return NextResponse.json({
      success: true,
      data: listing,
      message: 'Listing created successfully. It will be reviewed before going live.'
    }, { status: 201 });

  } catch (error) {
    console.error('Create Listing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
