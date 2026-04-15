import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/MarketplaceModels';
import { requireAuth } from '@/lib/jwt';

// GET /api/marketplace/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const organic = searchParams.get('organic');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const filter: Record<string, unknown> = { availability: 'available' };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      filter.price = priceFilter;
    }

    if (location) {
      filter.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') },
      ];
    }

    if (organic === 'true') {
      filter.organic = true;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('farmerId', 'name email mobile rating location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        hasNext: page < Math.ceil(totalProducts / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}

// POST /api/marketplace/products - Create new product (Farmer only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;
    const farmerId = (auth.payload as { id: string }).id;

    const body = await request.json();
    const { name, description, price, quantity, unit, category, images, location, organic, harvestDate } = body;

    const product = new Product({
      name, description, price, quantity, unit, category, images, farmerId, location, organic, harvestDate,
    });

    await product.save();

    return NextResponse.json({ success: true, product, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 },
    );
  }
}
