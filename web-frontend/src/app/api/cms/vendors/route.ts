import { NextRequest, NextResponse } from 'next/server';

// Mock vendors data for development
const mockVendors = [
  {
    _id: 'vendor-1',
    vendorName: 'Green Valley Farms',
    slug: 'green-valley-farms',
    stallNumber: 'A-001',
    productType: 'organic',
    description: 'Premium organic produce from certified farms',
    contactInfo: {
      name: 'Rajesh Kumar',
      phone: '+91-9999778321',
      email: 'rajesh@greenvalley.com',
      website: 'https://greenvalley.com'
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
    gallery: [],
    products: [],
    rating: { average: 4.5, count: 12 },
    status: 'active',
    verified: true,
    socialMedia: {
      facebook: 'greenvalleyfarms',
      instagram: 'greenvalleyfarms',
      twitter: 'greenvalleyfarms'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'vendor-2',
    vendorName: 'Fresh Harvest Co.',
    slug: 'fresh-harvest-co',
    stallNumber: 'A-002',
    productType: 'vegetables',
    description: 'Fresh vegetables and fruits from local farms',
    contactInfo: {
      name: 'Priya Sharma',
      phone: '+91-9999778322',
      email: 'priya@freshharvest.com',
      website: 'https://freshharvest.com'
    },
    location: {
      address: 'Market Street 2',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      alt: 'Fresh Harvest Co.'
    },
    gallery: [],
    products: [],
    rating: { average: 4.2, count: 8 },
    status: 'active',
    verified: true,
    socialMedia: {
      facebook: 'freshharvestco',
      instagram: 'freshharvestco'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/cms/vendors - Get all vendors
export async function GET(request: NextRequest) {
  try {
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

    // Apply filters to mock data
    let filteredVendors = [...mockVendors];

    // Filter by status
    if (filterObj.status) {
      filteredVendors = filteredVendors.filter(vendor => vendor.status === filterObj.status);
    }

    // Filter by product type
    if (filterObj.productType) {
      filteredVendors = filteredVendors.filter(vendor => vendor.productType === filterObj.productType);
    }

    // Filter by verified
    if (filterObj.verified !== undefined) {
      filteredVendors = filteredVendors.filter(vendor => vendor.verified === filterObj.verified);
    }

    // Apply sorting
    if (sort.includes(':')) {
      const [field, order] = sort.split(':');
      filteredVendors.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];
        
        if (aVal < bVal) return order === 'desc' ? 1 : -1;
        if (aVal > bVal) return order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const skip = (page - 1) * pageSize;
    const paginatedVendors = filteredVendors.slice(skip, skip + pageSize);

    return NextResponse.json({
      data: paginatedVendors,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(filteredVendors.length / pageSize),
          total: filteredVendors.length
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
    const body = await request.json();
    const { data } = body;

    if (!data.vendorName || !data.description || !data.productType) {
      return NextResponse.json(
        { error: 'Vendor name, description, and product type are required' },
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

    const newVendor = {
      _id: `vendor-${Date.now()}`,
      ...data,
      slug: data.slug || createSlug(data.vendorName),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock data (in real app, this would save to database)
    mockVendors.push(newVendor);

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