import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const populate = searchParams.get('populate') || '*';

    // Mock vendor data
    const vendor = {
      _id: params.id,
      vendorName: 'Green Valley Farms',
      slug: 'green-valley-farms',
      stallNumber: 'A-001',
      productType: 'organic',
      description: 'Premium organic produce from certified farms',
      contactInfo: {
        name: 'Rajesh Kumar',
        phone: '+91-9999778321',
        email: 'rajesh@greenvalley.com'
      },
      location: {
        address: 'Farm Road 1',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      image: {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        alt: 'Green Valley Farms'
      },
      status: 'active',
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ data: vendor });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { data } = body;

    const updatedVendor = {
      _id: params.id,
      ...data,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ data: updatedVendor });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return NextResponse.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}