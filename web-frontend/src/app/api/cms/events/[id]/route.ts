import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import { Event } from '@/lib/models/CMSModels';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const raw = params.id;

    let doc = null;
    if (mongoose.isValidObjectId(raw)) {
      doc = await Event.findById(raw).lean();
    }
    if (!doc) {
      doc = await Event.findOne({ slug: raw }).lean();
    }

    if (!doc) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ data: doc });
  } catch (error) {
    console.error('CMS event GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const data = body.data ?? body;

    const raw = params.id;
    let updated = null;

    if (mongoose.isValidObjectId(raw)) {
      updated = await Event.findByIdAndUpdate(raw, { $set: data }, { new: true }).lean();
    }
    if (!updated) {
      updated = await Event.findOneAndUpdate({ slug: raw }, { $set: data }, { new: true }).lean();
    }

    if (!updated) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('CMS event PUT error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const raw = params.id;

    let res = null;
    if (mongoose.isValidObjectId(raw)) {
      res = await Event.findByIdAndDelete(raw).lean();
    }
    if (!res) {
      res = await Event.findOneAndDelete({ slug: raw }).lean();
    }

    if (!res) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('CMS event DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
