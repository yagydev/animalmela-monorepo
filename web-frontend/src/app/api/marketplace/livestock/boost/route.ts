import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import mongoose from 'mongoose';

const BOOST_PRICES: Record<number, number> = { 3: 49, 5: 79, 10: 149 };
const VALID_DAYS = [3, 5, 10];

/**
 * POST /api/marketplace/livestock/boost
 * Body: { listingId, sellerPhone, days: 3 | 5 | 10 }
 *
 * Sets boostedUntil = now + days on the listing.
 * Phone-based ownership check (last 10 digits must match listing.sellerPhone).
 * Returns the new boostedUntil date and indicative price.
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { listingId, sellerPhone, days } = body as {
      listingId?: string;
      sellerPhone?: string;
      days?: number;
    };

    if (!listingId || !sellerPhone || !days) {
      return NextResponse.json(
        { success: false, error: 'listingId, sellerPhone and days are required' },
        { status: 400 }
      );
    }

    if (!VALID_DAYS.includes(days)) {
      return NextResponse.json(
        { success: false, error: 'days must be 3, 5, or 10' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json({ success: false, error: 'Invalid listingId' }, { status: 400 });
    }

    const listing = await MarketplaceListing.findOne({
      _id: listingId,
      category: 'livestock',
    }).lean() as { sellerPhone?: string; boostedUntil?: Date } | null;

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    // Phone ownership check (last 10 digits)
    const incoming = String(sellerPhone).replace(/\D/g, '').slice(-10);
    const stored = String(listing.sellerPhone || '').replace(/\D/g, '').slice(-10);
    if (incoming.length < 10 || stored.length < 10 || incoming !== stored) {
      return NextResponse.json({ success: false, error: 'Not authorised' }, { status: 403 });
    }

    // If already boosted and not expired, extend from the current end
    const now = new Date();
    const base = listing.boostedUntil && listing.boostedUntil > now ? listing.boostedUntil : now;
    const boostedUntil = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

    await MarketplaceListing.updateOne({ _id: listingId }, { $set: { boostedUntil } });

    return NextResponse.json({
      success: true,
      data: {
        listingId,
        boostedUntil: boostedUntil.toISOString(),
        days,
        price: BOOST_PRICES[days],
        message: `Listing boosted for ${days} days (until ${boostedUntil.toLocaleDateString('en-IN')}).`
      }
    });
  } catch (error) {
    console.error('Livestock boost error:', error);
    return NextResponse.json({ success: false, error: 'Failed to boost listing' }, { status: 500 });
  }
}
