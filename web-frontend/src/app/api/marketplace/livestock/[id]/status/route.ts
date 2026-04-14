import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import mongoose from 'mongoose';
import { requireAuth } from '@/lib/jwt';

const VALID_STATUSES = ['approved', 'rejected', 'pending'] as const;
type ListingStatus = (typeof VALID_STATUSES)[number];

/**
 * PATCH /api/marketplace/livestock/[id]/status
 * Body: { status: 'approved' | 'rejected' | 'pending', reason?: string }
 * Requires Bearer JWT with payload.role === 'admin'
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if ('error' in auth) return auth.error;

  const payload = auth.payload as { role?: string };
  if (payload.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid listing ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status, reason } = body as { status: string; reason?: string };

    if (!VALID_STATUSES.includes(status as ListingStatus)) {
      return NextResponse.json(
        { success: false, error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const update: Record<string, unknown> = { status };
    if (reason) update.adminNote = String(reason).slice(0, 500);

    const result = await MarketplaceListing.findOneAndUpdate(
      { _id: id, category: 'livestock' },
      { $set: update },
      { new: true }
    ).select('_id name status').lean();

    if (!result) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Listing status update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}
