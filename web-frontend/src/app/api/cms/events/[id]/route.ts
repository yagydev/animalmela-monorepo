import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const populate = searchParams.get('populate') || '*';

    // Mock event data
    const event = {
      _id: params.id,
      title: 'Kisaan Mela 2024 - Spring Festival',
      slug: 'kisaan-mela-2024-spring-festival',
      date: new Date('2024-03-15').toISOString(),
      endDate: new Date('2024-03-17').toISOString(),
      location: {
        name: 'Delhi Agricultural Ground',
        address: 'Sector 15, Rohini',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110085'
      },
      image: {
        url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
        alt: 'Kisaan Mela 2024'
      },
      description: 'Join us for the biggest agricultural festival of the year!',
      content: 'Experience the best of Indian agriculture with farmers, vendors, and agricultural experts from across the country.',
      status: 'published',
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ data: event });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { data } = body;

    const updatedEvent = {
      _id: params.id,
      ...data,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ data: updatedEvent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}