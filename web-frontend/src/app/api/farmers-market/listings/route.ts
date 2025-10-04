import { NextRequest, NextResponse } from 'next/server';

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
