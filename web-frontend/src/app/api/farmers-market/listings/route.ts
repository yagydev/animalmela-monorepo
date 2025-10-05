import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // Mock listings data
    const mockListings = [
      {
        id: 1,
        title: 'Fresh Organic Tomatoes',
        description: 'Freshly harvested organic tomatoes from local farm',
        category: 'vegetables',
        price: 80,
        unit: 'kg',
        sellerId: 1,
        sellerName: 'Rajesh Kumar',
        location: 'Punjab',
        images: ['/images/tomatoes.jpg'],
        status: 'active',
        createdAt: new Date().toISOString(),
        rating: 4.5,
        reviews: 12
      },
      {
        id: 2,
        title: 'Premium Basmati Rice',
        description: 'High quality basmati rice, perfect for cooking',
        category: 'grains',
        price: 120,
        unit: 'kg',
        sellerId: 2,
        sellerName: 'Priya Sharma',
        location: 'Haryana',
        images: ['/images/rice.jpg'],
        status: 'active',
        createdAt: new Date().toISOString(),
        rating: 4.8,
        reviews: 25
      },
      {
        id: 3,
        title: 'Fresh Milk',
        description: 'Fresh cow milk, delivered daily',
        category: 'dairy',
        price: 60,
        unit: 'liter',
        sellerId: 3,
        sellerName: 'Mohan Singh',
        location: 'Rajasthan',
        images: ['/images/milk.jpg'],
        status: 'active',
        createdAt: new Date().toISOString(),
        rating: 4.2,
        reviews: 8
      },
      {
        id: 4,
        title: 'Organic Wheat Flour',
        description: 'Stone ground organic wheat flour',
        category: 'grains',
        price: 45,
        unit: 'kg',
        sellerId: 4,
        sellerName: 'Sunita Devi',
        location: 'Uttar Pradesh',
        images: ['/images/wheat.jpg'],
        status: 'active',
        createdAt: new Date().toISOString(),
        rating: 4.6,
        reviews: 18
      },
      {
        id: 5,
        title: 'Fresh Mangoes',
        description: 'Sweet and juicy mangoes from our orchard',
        category: 'fruits',
        price: 150,
        unit: 'kg',
        sellerId: 5,
        sellerName: 'Vikram Patel',
        location: 'Gujarat',
        images: ['/images/mangoes.jpg'],
        status: 'active',
        createdAt: new Date().toISOString(),
        rating: 4.7,
        reviews: 22
      }
    ];

    // Filter by category if specified
    let filteredListings = mockListings;
    if (category) {
      filteredListings = mockListings.filter(listing => 
        listing.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedListings = filteredListings.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      listings: paginatedListings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredListings.length / limit),
        totalItems: filteredListings.length,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const listingData = await request.json();

    if (!listingData.title || !listingData.category || !listingData.price) {
      return NextResponse.json(
        { success: false, error: 'Title, category, and price are required' },
        { status: 400 }
      );
    }

    // Mock response for creating listing
    const newListing = {
      id: Date.now(),
      ...listingData,
      sellerId: 1,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Product listed successfully',
      listing: newListing
    });

  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const updateData = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Mock response for updating listing
    const updatedListing = {
      id: parseInt(id),
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing
    });

  } catch (error) {
    console.error('Update listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Mock response for deleting listing
    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
