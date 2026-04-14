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

const EDITABLE_FIELDS = [
  'name', 'description', 'price', 'images', 'location',
  'tags', 'specifications', 'videoUrl'
] as const;

/**
 * PATCH /api/marketplace/livestock/[id]
 * Body: { sellerPhone, ...editableFields }
 * Seller updates their own listing. Phone-based ownership check.
 * Editing resets status to 'pending' so the listing goes back through moderation.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid listing ID' }, { status: 400 });
    }

    const body = await request.json();
    const { sellerPhone, ...edits } = body as { sellerPhone?: string; [key: string]: unknown };

    if (!sellerPhone) {
      return NextResponse.json({ success: false, error: 'sellerPhone required' }, { status: 400 });
    }

    const listing = await MarketplaceListing.findOne({
      _id: id,
      category: 'livestock'
    }).lean() as { sellerPhone?: string } | null;

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    const incoming = String(sellerPhone).replace(/\D/g, '').slice(-10);
    const stored = String(listing.sellerPhone || '').replace(/\D/g, '').slice(-10);
    if (incoming.length < 10 || stored.length < 10 || incoming !== stored) {
      return NextResponse.json({ success: false, error: 'Not authorised' }, { status: 403 });
    }

    const allowed = new Set(EDITABLE_FIELDS);
    const update: Record<string, unknown> = { status: 'pending' };
    for (const [key, val] of Object.entries(edits)) {
      if (allowed.has(key as typeof EDITABLE_FIELDS[number])) {
        update[key] = val;
      }
    }

    if (update.price) update.price = Number(update.price);
    if (update.name) update.name = String(update.name).slice(0, 200);
    if (update.description) update.description = String(update.description).slice(0, 2000);

    const updated = await MarketplaceListing.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    ).lean();

    return NextResponse.json({ success: true, data: updated, message: 'Listing updated. Re-submitted for review.' });
  } catch (error) {
    console.error('Livestock edit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update listing' }, { status: 500 });
  }
}

/**
 * DELETE /api/marketplace/livestock/[id]
 * Body: { sellerPhone }
 * Soft-deletes by setting status = 'archived'. Phone ownership check.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid listing ID' }, { status: 400 });
    }

    const body = await request.json();
    const { sellerPhone } = body as { sellerPhone?: string };

    if (!sellerPhone) {
      return NextResponse.json({ success: false, error: 'sellerPhone required' }, { status: 400 });
    }

    const listing = await MarketplaceListing.findOne({
      _id: id,
      category: 'livestock'
    }).lean() as { sellerPhone?: string } | null;

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    const incoming = String(sellerPhone).replace(/\D/g, '').slice(-10);
    const stored = String(listing.sellerPhone || '').replace(/\D/g, '').slice(-10);
    if (incoming.length < 10 || stored.length < 10 || incoming !== stored) {
      return NextResponse.json({ success: false, error: 'Not authorised' }, { status: 403 });
    }

    await MarketplaceListing.updateOne({ _id: id }, { $set: { status: 'archived' } });

    return NextResponse.json({ success: true, message: 'Listing removed.' });
  } catch (error) {
    console.error('Livestock delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove listing' }, { status: 500 });
  }
}
