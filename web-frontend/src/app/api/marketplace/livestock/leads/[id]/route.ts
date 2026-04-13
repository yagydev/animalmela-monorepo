import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LivestockLead from '@/lib/models/LivestockLead';
import mongoose from 'mongoose';

const VALID_STATUSES = ['new', 'contacted', 'closed', 'spam'] as const;
type LeadStatus = (typeof VALID_STATUSES)[number];

/**
 * PATCH /api/marketplace/livestock/leads/[id]
 * Body: { status: LeadStatus, sellerPhone: string }
 * Seller updates the lead status. sellerPhone must match lead.sellerPhone (last 10 digits).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid lead ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status, sellerPhone } = body as { status: string; sellerPhone?: string };

    if (!status || !VALID_STATUSES.includes(status as LeadStatus)) {
      return NextResponse.json(
        { success: false, error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const lead = await LivestockLead.findById(id).lean() as { sellerPhone?: string } | null;
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    // Phone-based authorization: last 10 digits must match
    if (sellerPhone) {
      const incoming = String(sellerPhone).replace(/\D/g, '').slice(-10);
      const stored = String(lead.sellerPhone || '').replace(/\D/g, '').slice(-10);
      if (incoming.length < 10 || stored.length < 10 || incoming !== stored) {
        return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
      }
    }

    await LivestockLead.updateOne({ _id: id }, { status: status as LeadStatus });

    return NextResponse.json({ success: true, data: { id, status } });
  } catch (error) {
    console.error('Lead PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update lead' }, { status: 500 });
  }
}
