import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import mongoose from 'mongoose';
import { parseLivestockSpec } from '@/lib/livestock/livestockSpecifications';

/** GET /api/marketplace/livestock/[id] — detail + related + view increment */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid listing ID' }, { status: 400 });
    }

    const listing = await MarketplaceListing.findOne({
      _id: id,
      category: 'livestock',
      status: 'approved'
    }).lean();

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    MarketplaceListing.updateOne({ _id: id }, { $inc: { viewsCount: 1 } }).catch(() => {});

    const spec = parseLivestockSpec(listing.specifications);
    const seller = {
      _id: listing.sellerId,
      name: listing.sellerName || 'Seller',
      phone: listing.sellerPhone || '',
      location: listing.location,
      rating: 4.5,
      verifiedSeller: Boolean(spec.verifiedListing)
    };

    const relatedFilter: Record<string, unknown> = {
      category: 'livestock',
      status: 'approved',
      _id: { $ne: listing._id }
    };
    if (spec.animalType) relatedFilter['specifications.animalType'] = spec.animalType;

    const relatedListings = await MarketplaceListing.find(relatedFilter)
      .limit(6)
      .select('_id name price images location specifications')
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        listing: { ...listing, sellerId: seller },
        relatedListings,
        viewsTodayHint: Math.min(12, (listing.viewsCount || 0) % 9 + 3)
      }
    });
  } catch (error) {
    console.error('Livestock detail error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch listing' }, { status: 500 });
  }
}
