import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaanmela');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  stallNumber: { type: String, required: true },
  productType: { 
    type: String, 
    required: true,
    enum: ['crops', 'vegetables', 'fruits', 'livestock', 'dairy', 'seeds', 'equipment', 'organic', 'processed']
  },
  description: { type: String, required: true },
  contactInfo: {
    name: String,
    phone: String,
    email: String,
    website: String
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  image: {
    url: String,
    alt: String
  },
  gallery: [{
    url: String,
    alt: String
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  verified: { type: Boolean, default: false },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  }
}, { timestamps: true });

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

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

    // Build MongoDB query
    const query: any = {};
    
    if (filterObj.status) {
      query.status = filterObj.status;
    }
    
    if (filterObj.productType) {
      query.productType = filterObj.productType;
    }
    
    if (filterObj.verified !== undefined) {
      query.verified = filterObj.verified;
    }

    // Build sort object
    let sortObj: any = {};
    if (sort.includes(':')) {
      const [field, order] = sort.split(':');
      sortObj[field] = order === 'desc' ? -1 : 1;
    }

    // Apply pagination
    const skip = (page - 1) * pageSize;

    const vendors = await Vendor.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Vendor.countDocuments(query);

    return NextResponse.json({
      data: vendors,
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

    if (!data.vendorName || !data.productType || !data.description) {
      return NextResponse.json(
        { error: 'Vendor name, product type, and description are required' },
        { status: 400 }
      );
    }

    // Create slug if not provided
    const createSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    const vendorData = {
      ...data,
      slug: data.slug || createSlug(data.vendorName)
    };

    const newVendor = new Vendor(vendorData);
    await newVendor.save();

    return NextResponse.json({
      data: newVendor
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating vendor:', error);
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
}