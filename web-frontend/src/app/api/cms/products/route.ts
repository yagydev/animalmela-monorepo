import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event, Vendor, Product, Organization, NewsUpdate } from '@/lib/models/CMSModels';

// Helper function to create slug
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to populate references
async function populateReferences(data, populate = '*') {
  if (populate === '*' || populate.includes('vendor')) {
    if (data.vendor) {
      data.vendor = await Vendor.findById(data.vendor);
    }
  }
  
  return data;
}

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
    let filterObj = {};
    try {
      filterObj = JSON.parse(filters);
    } catch (e) {
      // Handle simple filters
      const status = searchParams.get('filters[status]');
      const category = searchParams.get('filters[category]');
      const organic = searchParams.get('filters[organic]');
      const featured = searchParams.get('filters[featured]');
      const minPrice = searchParams.get('filters[price][$gte]');
      const maxPrice = searchParams.get('filters[price][$lte]');
      
      if (status) filterObj.status = status;
      if (category) filterObj.category = category;
      if (organic !== null) filterObj.organic = organic === 'true';
      if (featured !== null) filterObj.featured = featured === 'true';
      if (minPrice || maxPrice) {
        filterObj.price = {};
        if (minPrice) filterObj.price.$gte = parseFloat(minPrice);
        if (maxPrice) filterObj.price.$lte = parseFloat(maxPrice);
      }
    }

    // Parse sort
    let sortObj = {};
    if (sort.includes(':')) {
      const [field, order] = sort.split(':');
      sortObj[field] = order === 'desc' ? -1 : 1;
    } else {
      sortObj[sort] = -1;
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Get products
    const products = await Product.find(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Populate references
    const populatedProducts = await Promise.all(
      products.map(product => populateReferences(product, populate))
    );

    // Get total count
    const total = await Product.countDocuments(filterObj);

    return NextResponse.json({
      data: populatedProducts,
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

    if (!data.name || !data.price || !data.category || !data.vendor) {
      return NextResponse.json(
        { error: 'Name, price, category, and vendor are required' },
        { status: 400 }
      );
    }

    // Create slug if not provided
    if (!data.slug) {
      data.slug = createSlug(data.name);
    }

    const product = new Product(data);
    await product.save();

    // Populate references
    const populatedProduct = await populateReferences(product.toObject(), '*');

    return NextResponse.json({
      data: populatedProduct
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
