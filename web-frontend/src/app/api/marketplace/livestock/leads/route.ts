import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import LivestockLead from '@/lib/models/LivestockLead';
import mongoose from 'mongoose';
import { verifyToken } from '../../../../../../lib/jwt';

function buyerFromAuth(request: NextRequest): { id?: string; phone?: string; name?: string } {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return {};
  try {
    const u = verifyToken(auth.slice(7)) as { id?: string; mobile?: string; name?: string };
    return { id: u.id != null ? String(u.id) : undefined, phone: u.mobile, name: u.name };
  } catch {
    return {};
  }
}

/** POST /api/marketplace/livestock/leads */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { listingId, buyerName, buyerPhone, buyerMessage } = body;

    if (!listingId || !buyerName || !buyerPhone) {
      return NextResponse.json(
        { success: false, error: 'listingId, buyerName and buyerPhone are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json({ success: false, error: 'Invalid listingId' }, { status: 400 });
    }

    const listing = await MarketplaceListing.findOne({
      _id: listingId,
      category: 'livestock',
      status: 'approved'
    }).lean();

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    const authBuyer = buyerFromAuth(request);

    const lead = await LivestockLead.create({
      listingId: new mongoose.Types.ObjectId(listingId),
      sellerId: listing.sellerId,
      sellerPhone: listing.sellerPhone || '',
      buyerId: authBuyer.id,
      buyerName: String(buyerName).slice(0, 120),
      buyerPhone: String(buyerPhone).replace(/\s/g, '').slice(0, 20),
      buyerMessage: buyerMessage ? String(buyerMessage).slice(0, 2000) : undefined,
      status: 'new'
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: lead._id, status: lead.status },
        message: 'Interest recorded. The seller may contact you on WhatsApp or phone.'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Livestock lead error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create lead' }, { status: 500 });
  }
}
