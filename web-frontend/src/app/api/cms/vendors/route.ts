import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event, Vendor, Product, Organization, NewsUpdate } from '@/lib/models/CMSModels';

// Helper function to create slug
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to populate references
async function populateReferences(data: any, populate: string = '*') {
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

// GET /api/cms/vendors - Get all vendors
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const populate = searchParams.get('populate') || '*';
    const filters = searchParams.get('filters') || '{}';
    const sort = searchParams.get('sort') || 'createdAt:desc';
    const page = parseInt(searchParams.get('pagination[page]') || '1');
    const pageSize = parseInt(searchParams.get('pagination[pageSize]') || '10');

    // Parse filters
    let filterObj: any = {};
    try {
      filterObj = JSON.parse(filters);
    } catch (e) {
      // Handle simple filters
      const status = searchParams.get('filters[status]');
      const productType = searchParams.get('filters[productType]');
      const verified = searchParams.get('filters[verified]');
      
      if (status) filterObj.status = status;
      if (productType) filterObj.productType = productType;
      if (verified !== null) filterObj.verified = verified === 'true';
    }

    // Parse sort
    let sortObj: any = {};
    if (sort.includes(':')) {
      const [field, order] = sort.split(':');
      sortObj[field] = order === 'desc' ? -1 : 1;
    } else {
      sortObj[sort] = -1;
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Get vendors
    const vendors = await Vendor.find(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Populate references
    const populatedVendors = await Promise.all(
      vendors.map((vendor: any) => populateReferences(vendor, populate))
    );

    // Get total count
    const total = await Vendor.countDocuments(filterObj);

    return NextResponse.json({
      data: populatedVendors,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

// POST /api/cms/vendors - Create new vendor
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { data } = body;

    if (!data.vendorName || !data.stallNumber || !data.productType) {
      return NextResponse.json(
        { error: 'Vendor name, stall number, and product type are required' },
        { status: 400 }
      );
    }

    // Create slug if not provided
    if (!data.slug) {
      data.slug = createSlug(data.vendorName);
    }

    const vendor = new Vendor(data);
    await vendor.save();

    // Populate references
    const populatedVendor = await populateReferences(vendor.toObject(), '*');

    return NextResponse.json({
      data: populatedVendor
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating vendor:', error);
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
}