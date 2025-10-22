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

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  unit: { 
    type: String, 
    required: true,
    enum: ['kg', 'quintal', 'ton', 'piece', 'dozen', 'litre', 'gram', 'box', 'bundle']
  },
  category: { 
    type: String, 
    required: true,
    enum: ['crops', 'vegetables', 'fruits', 'livestock', 'dairy', 'seeds', 'equipment', 'organic', 'processed']
  },
  subcategory: String,
  image: {
    url: { type: String, required: true },
    alt: String
  },
  gallery: [{
    url: String,
    alt: String
  }],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  availability: {
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    minOrder: { type: Number, default: 1 }
  },
  quality: { type: String, enum: ['premium', 'standard', 'budget'], default: 'standard' },
  organic: { type: Boolean, default: false },
  certifications: [String],
  tags: [String],
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// GET /api/cms/products - Get all products
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
      const category = searchParams.get('filters[category]');
      const organic = searchParams.get('filters[organic]');
      const featured = searchParams.get('filters[featured]');
      
      if (status) filterObj.status = status;
      if (category) filterObj.category = category;
      if (organic !== null) filterObj.organic = organic === 'true';
      if (featured !== null) filterObj.featured = featured === 'true';
    }

    // Build MongoDB query
    const query: any = {};
    
    if (filterObj.status) {
      query.status = filterObj.status;
    }
    
    if (filterObj.category) {
      query.category = filterObj.category;
    }
    
    if (filterObj.organic !== undefined) {
      query.organic = filterObj.organic;
    }
    
    if (filterObj.featured !== undefined) {
      query.featured = filterObj.featured;
    }

    // Build sort object
    let sortObj: any = {};
    if (sort.includes(':')) {
      const [field, order] = sort.split(':');
      sortObj[field] = order === 'desc' ? -1 : 1;
    }

    // Apply pagination
    const skip = (page - 1) * pageSize;

    const products = await Product.find(query)
      .populate('vendor', 'vendorName contactInfo')
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      data: products,
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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/cms/products - Create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { data } = body;

    if (!data.name || !data.description || !data.price || !data.vendor) {
      return NextResponse.json(
        { error: 'Name, description, price, and vendor are required' },
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

    const productData = {
      ...data,
      slug: data.slug || createSlug(data.name)
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    // Populate vendor data in response
    await newProduct.populate('vendor', 'vendorName contactInfo');

    return NextResponse.json({
      data: newProduct
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}