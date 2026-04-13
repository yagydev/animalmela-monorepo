import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LivestockLead from '@/lib/models/LivestockLead';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import { verifyToken } from '../../../../../../../lib/jwt';

/** GET /api/marketplace/livestock/leads/mine?role=buyer|seller — uses Bearer JWT mobile/id */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const auth = request.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Authorization required' }, { status: 401 });
    }

    let user: { id?: string; mobile?: string; name?: string };
    try {
      user = verifyToken(auth.slice(7)) as { id?: string; mobile?: string; name?: string };
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const role = request.nextUrl.searchParams.get('role') || 'buyer';
    const mobile = user.mobile ? String(user.mobile).replace(/\s/g, '') : '';
    const userId = user.id != null ? String(user.id) : '';

    if (role === 'seller') {
      if (!mobile) {
        return NextResponse.json({ success: false, error: 'User mobile missing for seller leads' }, { status: 400 });
      }
      const leads = await LivestockLead.find({ sellerPhone: mobile }).sort({ createdAt: -1 }).limit(100).lean();
      const listingIds = [...new Set(leads.map((l) => l.listingId.toString()))];
      const titles = await MarketplaceListing.find({ _id: { $in: listingIds } })
        .select('name')
        .lean();
      const titleById = Object.fromEntries(titles.map((t) => [t._id.toString(), t.name]));

      return NextResponse.json({
        success: true,
        data: leads.map((l) => ({
          ...l,
          listingTitle: titleById[l.listingId.toString()] || 'Listing'
        }))
      });
    }

    const or: object[] = [];
    if (userId) or.push({ buyerId: userId });
    if (mobile) or.push({ buyerPhone: mobile });

    if (or.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const leads = await LivestockLead.find({ $or: or }).sort({ createdAt: -1 }).limit(100).lean();
    const listingIds = [...new Set(leads.map((l) => l.listingId.toString()))];
    const titles = await MarketplaceListing.find({ _id: { $in: listingIds } })
      .select('name')
      .lean();
    const titleById = Object.fromEntries(titles.map((t) => [t._id.toString(), t.name]));

    return NextResponse.json({
      success: true,
      data: leads.map((l) => ({
        ...l,
        listingTitle: titleById[l.listingId.toString()] || 'Listing'
      }))
    });
  } catch (error) {
    console.error('Livestock leads mine error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load leads' }, { status: 500 });
  }
}
