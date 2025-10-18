import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event, Vendor, Product, Organization, NewsUpdate } from '@/lib/models/CMSModels';

// Helper function to populate references
async function populateReferences(data, populate = '*') {
  if (populate === '*' || populate.includes('vendor')) {
    if (data.vendor) {
      data.vendor = await Vendor.findById(data.vendor);
    }
  }
  
  if (populate === '*' || populate.includes('products')) {
    if (data.products && data.products.length > 0) {
      data.products = await Product.find({ _id: { $in: data.products } });
    }
  }
  
  return data;
}

// GET /api/cms/vendors/[id] - Get single vendor
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const populate = searchParams.get('populate') || '*';

    const vendor = await Vendor.findById(params.id).lean();
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Populate references
    const populatedVendor = await populateReferences(vendor, populate);

    return NextResponse.json({
      data: populatedVendor
    });

  } catch (error) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
}

// PUT /api/cms/vendors/[id] - Update vendor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { data } = body;

    const vendor = await Vendor.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).lean();

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Populate references
    const populatedVendor = await populateReferences(vendor, '*');

    return NextResponse.json({
      data: populatedVendor
    });

  } catch (error) {
    console.error('Error updating vendor:', error);
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/vendors/[id] - Delete vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const vendor = await Vendor.findByIdAndDelete(params.id);
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: vendor
    });

  } catch (error) {
    console.error('Error deleting vendor:', error);
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}
