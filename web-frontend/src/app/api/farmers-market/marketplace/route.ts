import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock data for farmers market listings
    const mockListings = [
      {
        id: 1,
        title: 'Premium Organic Wheat',
        description: 'High quality organic wheat from our certified farm',
        category: 'crops',
        subcategory: 'wheat',
        price: 2500,
        unit: 'quintal',
        quantity: 100,
        quality: {
          grade: 'premium',
          organic: true,
          certified: true
        },
        images: ['/api/placeholder/300/200'],
        location: {
          state: 'Punjab',
          district: 'Ludhiana',
          pincode: '141001'
        },
        sellerId: {
          id: 1,
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          mobile: '+919876543210',
          location: {
            state: 'Punjab',
            district: 'Ludhiana'
          }
        },
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Fresh Organic Rice',
        description: 'Premium quality organic rice from our farm',
        category: 'crops',
        subcategory: 'rice',
        price: 3000,
        unit: 'quintal',
        quantity: 50,
        quality: {
          grade: 'premium',
          organic: true,
          certified: true
        },
        images: ['/api/placeholder/300/200'],
        location: {
          state: 'Haryana',
          district: 'Karnal',
          pincode: '132001'
        },
        sellerId: {
          id: 2,
          name: 'Priya Sharma',
          email: 'priya@example.com',
          mobile: '+919876543211',
          location: {
            state: 'Haryana',
            district: 'Karnal'
          }
        },
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Healthy Cattle',
        description: 'Well-bred cattle for dairy farming',
        category: 'livestock',
        subcategory: 'cattle',
        price: 50000,
        unit: 'head',
        quantity: 5,
        quality: {
          grade: 'premium',
          organic: false,
          certified: true
        },
        images: ['/api/placeholder/300/200'],
        location: {
          state: 'Rajasthan',
          district: 'Jaipur',
          pincode: '302001'
        },
        sellerId: {
          id: 3,
          name: 'Amit Singh',
          email: 'amit@example.com',
          mobile: '+919876543212',
          location: {
            state: 'Rajasthan',
            district: 'Jaipur'
          }
        },
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    let filteredListings = [...mockListings];

    // Apply filters
    if (category) {
      filteredListings = filteredListings.filter(l => l.category === category);
    }
    if (subcategory) {
      filteredListings = filteredListings.filter(l => l.subcategory === subcategory);
    }
    if (minPrice) {
      filteredListings = filteredListings.filter(l => l.price >= Number(minPrice));
    }
    if (maxPrice) {
      filteredListings = filteredListings.filter(l => l.price <= Number(maxPrice));
    }
    if (location) {
      filteredListings = filteredListings.filter(l => 
        l.location.state.toLowerCase().includes(location.toLowerCase()) ||
        l.location.district.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === 'price_low') {
      filteredListings.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      filteredListings.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filteredListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedListings = filteredListings.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      listings: paginatedListings,
      pagination: {
        page,
        limit,
        total: filteredListings.length,
        pages: Math.ceil(filteredListings.length / limit)
      }
    });

  } catch (error) {
    console.error('Marketplace API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch marketplace listings' },
      { status: 500 }
    );
  }
}
