import { NextRequest, NextResponse } from 'next/server';

// Mock products data
const mockProducts = [
  {
    _id: 'product-1',
    name: 'Organic Wheat',
    slug: 'organic-wheat',
    description: 'Premium quality organic wheat grains',
    price: 2500,
    currency: 'INR',
    unit: 'quintal',
    category: 'crops',
    subcategory: 'grains',
    image: {
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      alt: 'Organic Wheat'
    },
    gallery: [],
    vendor: { vendorName: 'Green Valley Farms' },
    availability: { inStock: true, quantity: 100, minOrder: 1 },
    quality: 'premium',
    organic: true,
    certifications: ['Organic Certification', 'ISO 22000'],
    tags: ['organic', 'wheat', 'premium'],
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('pagination[page]') || '1');
    const pageSize = parseInt(searchParams.get('pagination[pageSize]') || '10');

    return NextResponse.json({
      data: mockProducts,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: 1,
          total: mockProducts.length
        }
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    const newProduct = {
      _id: `product-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockProducts.push(newProduct);

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}