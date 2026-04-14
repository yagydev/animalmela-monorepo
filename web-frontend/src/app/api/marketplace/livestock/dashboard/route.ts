import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import LivestockLead from '@/lib/models/LivestockLead';

/**
 * GET /api/marketplace/livestock/dashboard?phone=XXXXXXXXXX&role=seller|buyer
 *
 * Seller: returns their listings (all statuses) + leads received (with listing title).
 * Buyer:  returns their submitted inquiries with listing info.
 *
 * Phone lookup uses last-10-digit suffix match to tolerate country-code variants.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const rawPhone = request.nextUrl.searchParams.get('phone') || '';
    const phone = rawPhone.replace(/\D/g, '').slice(-10);
    const role = request.nextUrl.searchParams.get('role') || 'seller';

    if (phone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Provide a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    const phoneSuffix = new RegExp(phone + '$');

    if (role === 'seller') {
      const [listings, leads] = await Promise.all([
        MarketplaceListing.find({
          category: 'livestock',
          sellerPhone: { $regex: phoneSuffix }
        })
          .sort({ createdAt: -1 })
          .limit(50)
          .select('_id name price status featured viewsCount boostedUntil images location specifications createdAt')
          .lean(),

        LivestockLead.find({ sellerPhone: { $regex: phoneSuffix } })
          .sort({ createdAt: -1 })
          .limit(200)
          .lean()
      ]);

      // Enrich leads with listing title
      const listingIds = Array.from(new Set(leads.map((l) => l.listingId.toString())));
      const titles = await MarketplaceListing.find({ _id: { $in: listingIds } })
        .select('name')
        .lean();
      const titleById = Object.fromEntries(titles.map((t) => [String(t._id), (t as unknown as { name: string }).name]));

      // Count leads per listing for analytics
      const leadCountByListing: Record<string, number> = {};
      leads.forEach((l) => {
        const lid = l.listingId.toString();
        leadCountByListing[lid] = (leadCountByListing[lid] || 0) + 1;
      });

      const enrichedListings = listings.map((lst) => ({
        ...lst,
        leadCount: leadCountByListing[String(lst._id)] || 0
      }));

      return NextResponse.json({
        success: true,
        data: {
          listings: enrichedListings,
          leads: leads.map((l) => ({
            ...l,
            listingTitle: titleById[l.listingId.toString()] || 'Listing'
          }))
        }
      });
    }

    // Buyer role
    const leads = await LivestockLead.find({ buyerPhone: { $regex: phoneSuffix } })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const listingIds = Array.from(new Set(leads.map((l) => l.listingId.toString())));
    const listings = await MarketplaceListing.find({ _id: { $in: listingIds } })
      .select('_id name price images location specifications status')
      .lean();
    const listingById = Object.fromEntries(listings.map((l) => [String(l._id), l]));

    return NextResponse.json({
      success: true,
      data: {
        leads: leads.map((l) => ({
          ...l,
          listing: listingById[l.listingId.toString()] || null
        }))
      }
    });
  } catch (error) {
    console.error('Livestock dashboard error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load dashboard' }, { status: 500 });
  }
}
