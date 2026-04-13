import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import mongoose from 'mongoose';

const BOOST_PRICES: Record<number, number> = { 3: 49, 5: 99, 10: 199 };

/**
 * POST /api/marketplace/livestock/boost
 * Body: { listingId, sellerPhone, days: 3|5|10 }
 * Marks listing as featured + sets boostedUntil.
 * Payment via Razorpay is planned — for now boost is applied immediately (demo mode).
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { listingId, sellerPhone, days } = await request.json();

    if (!listingId || !sellerPhone || !days) {
      return NextResponse.json(
        { success: false, error: 'listingId, sellerPhone, and days are required' },
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json({ success: false, error: 'Invalid listingId' }, { status: 400 });
    }
    const daysNum = Number(days);
    if (![3, 5, 10].includes(daysNum)) {
      return NextResponse.json({ success: false, error: 'days must be 3, 5, or 10' }, { status: 400 });
    }

    const listing = await MarketplaceListing.findOne({
      _id: listingId,
      category: 'livestock'
    }).lean() as { sellerPhone?: string; _id: unknown } | null;

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    // Phone verification (last 10 digits)
    const incomingDigits = String(sellerPhone).replace(/\D/g, '').slice(-10);
    const storedDigits = String(listing.sellerPhone || '').replace(/\D/g, '').slice(-10);
    if (incomingDigits.length < 10 || storedDigits.length < 10 || incomingDigits !== storedDigits) {
      return NextResponse.json({ success: false, error: 'Phone number does not match listing' }, { status: 403 });
    }

    const boostedUntil = new Date(Date.now() + daysNum * 24 * 60 * 60 * 1000);
    const price = BOOST_PRICES[daysNum];

    await MarketplaceListing.updateOne(
      { _id: listingId },
      { $set: { featured: true, boostedUntil } }
    );

    return NextResponse.json({
      success: true,
      data: { boostedUntil, price, days: daysNum },
      message: `Listing boosted for ${daysNum} days! ₹${price} — payment integration coming soon.`
    });
  } catch (error) {
    console.error('Boost error:', error);
    return NextResponse.json({ success: false, error: 'Failed to boost listing' }, { status: 500 });
  }
}
