import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import mongoose from 'mongoose';

// GET /api/marketplace/[category]/[id] - Get single listing
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    await dbConnect();
    
    const { category, id } = await params;
    
    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid listing ID format' },
        { status: 400 }
      );
    }

    // Find the listing
    const listing = await MarketplaceListing.findOne({
      _id: id,
      category,
      status: 'approved'
    }).lean();

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Create seller object from listing data
    const seller = {
      _id: listing.sellerId,
      name: listing.sellerName || 'Seller',
      phone: listing.sellerPhone || '',
      location: listing.location,
      rating: 4.5, // Default rating, can be fetched from separate seller collection
      profileImage: undefined
    };

    // Get related listings from same seller
    const relatedListings = await MarketplaceListing.find({
      sellerId: listing.sellerId,
      _id: { $ne: id },
      status: 'approved'
    })
    .limit(4)
    .select('_id name price images category condition location')
    .lean();

    return NextResponse.json({
      success: true,
      data: {
        listing: {
          ...listing,
          sellerId: seller
        },
        relatedListings
      }
    });

  } catch (error) {
    console.error('Get Listing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

// PUT /api/marketplace/[category]/[id] - Update listing
export async function PUT(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    await dbConnect();
    
    const { category, id } = await params;
    const body = await request.json();
    
    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid listing ID format' },
        { status: 400 }
      );
    }

    // Find the listing
    const listing = await MarketplaceListing.findOne({
      _id: id,
      category
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Validate condition if provided
    if (body.condition && !['new', 'used'].includes(body.condition)) {
      return NextResponse.json(
        { success: false, error: 'Invalid condition' },
        { status: 400 }
      );
    }

    // Validate price if provided
    if (body.price && body.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Update listing
    const updatedListing = await MarketplaceListing.findByIdAndUpdate(
      id,
      { 
        ...body, 
        status: 'pending' // Reset to pending after update for review
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedListing,
      message: 'Listing updated successfully. It will be reviewed before going live.'
    });

  } catch (error) {
    console.error('Update Listing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

// DELETE /api/marketplace/[category]/[id] - Delete listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    await dbConnect();
    
    const { category, id } = await params;
    
    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid listing ID format' },
        { status: 400 }
      );
    }

    // Find and delete the listing
    const listing = await MarketplaceListing.findOneAndDelete({
      _id: id,
      category
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Update seller's listing count
    await MarketplaceUser.findByIdAndUpdate(listing.sellerId, {
      $inc: { totalListings: -1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete Listing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
