import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../../../lib/database';
import { Event } from '../../../../../lib/models/CMSModels';

// GET /api/events/:id  — fetch a single event by ObjectId or slug
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
    const event = await Event.findOne(query).lean();

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error('GET /api/events/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
