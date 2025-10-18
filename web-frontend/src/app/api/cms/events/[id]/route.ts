import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event, Vendor, Product, Organization, NewsUpdate } from '@/lib/models/CMSModels';

// Helper function to populate references
async function populateReferences(data, populate = '*') {
  if (populate === '*' || populate.includes('organizer')) {
    if (data.organizer) {
      data.organizer = await Organization.findById(data.organizer);
    }
  }
  
  if (populate === '*' || populate.includes('vendors')) {
    if (data.vendors && data.vendors.length > 0) {
      data.vendors = await Vendor.find({ _id: { $in: data.vendors } });
    }
  }
  
  return data;
}

// GET /api/cms/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const populate = searchParams.get('populate') || '*';

    const event = await Event.findById(params.id).lean();
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Populate references
    const populatedEvent = await populateReferences(event, populate);

    return NextResponse.json({
      data: populatedEvent
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT /api/cms/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { data } = body;

    const event = await Event.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).lean();

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Populate references
    const populatedEvent = await populateReferences(event, '*');

    return NextResponse.json({
      data: populatedEvent
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const event = await Event.findByIdAndDelete(params.id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: event
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

