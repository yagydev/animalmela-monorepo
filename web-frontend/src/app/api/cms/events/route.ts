import { NextRequest, NextResponse } from 'next/server';

// Mock events data for development
const mockEvents = [
  {
    _id: 'event-1',
    title: 'Kisaan Mela 2024 - Spring Festival',
    slug: 'kisaan-mela-2024-spring-festival',
    description: 'Join us for the biggest agricultural festival of the year!',
    content: 'Experience the best of Indian agriculture with farmers, vendors, and agricultural experts from across the country.',
    date: new Date('2024-03-15').toISOString(),
    endDate: new Date('2024-03-17').toISOString(),
    location: {
      name: 'Delhi Agricultural Ground',
      address: 'Sector 15, Rohini',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110085',
      coordinates: { lat: 28.7041, lng: 77.1025 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
      alt: 'Kisaan Mela 2024',
      caption: 'Spring Agricultural Festival'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop',
        alt: 'Farmers Market',
        caption: 'Local farmers showcasing their produce'
      },
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
        alt: 'Agricultural Equipment',
        caption: 'Modern farming equipment display'
      }
    ],
    organizer: {
      _id: 'org-1',
      name: 'Ministry of Agriculture',
      type: 'government'
    },
    vendors: [
      {
        _id: 'vendor-1',
        vendorName: 'Green Valley Farms',
        productType: 'organic'
      },
      {
        _id: 'vendor-2',
        vendorName: 'Fresh Harvest Co.',
        productType: 'vegetables'
      }
    ],
    status: 'published',
    featured: true,
    tags: ['agriculture', 'festival', 'spring', 'farmers'],
    meta: {
      title: 'Kisaan Mela 2024 - Spring Festival',
      description: 'Join us for the biggest agricultural festival of the year!',
      keywords: ['agriculture', 'festival', 'farmers', 'delhi']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'event-2',
    title: 'Organic Farming Workshop',
    slug: 'organic-farming-workshop',
    description: 'Learn sustainable organic farming techniques from experts.',
    content: 'A comprehensive workshop covering organic farming methods, soil health, and sustainable agriculture practices.',
    date: new Date('2024-04-20').toISOString(),
    endDate: new Date('2024-04-20').toISOString(),
    location: {
      name: 'Agricultural Training Center',
      address: 'Plot 45, Industrial Area',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
      alt: 'Organic Farming Workshop',
      caption: 'Sustainable Agriculture Training'
    },
    gallery: [],
    organizer: {
      _id: 'org-2',
      name: 'Pune Agricultural Society',
      type: 'ngo'
    },
    vendors: [],
    status: 'published',
    featured: false,
    tags: ['workshop', 'organic', 'training', 'sustainable'],
    meta: {
      title: 'Organic Farming Workshop',
      description: 'Learn sustainable organic farming techniques from experts.',
      keywords: ['organic', 'farming', 'workshop', 'pune']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'event-3',
    title: 'Cattle Fair & Livestock Exhibition',
    slug: 'cattle-fair-livestock-exhibition',
    description: 'Annual cattle fair showcasing the best livestock breeds.',
    content: 'Traditional cattle fair with livestock trading, breed competitions, and agricultural equipment displays.',
    date: new Date('2024-05-10').toISOString(),
    endDate: new Date('2024-05-12').toISOString(),
    location: {
      name: 'Rural Development Center',
      address: 'Village Road, Block A',
      city: 'Mathura',
      state: 'Uttar Pradesh',
      pincode: '281001',
      coordinates: { lat: 27.4924, lng: 77.6737 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      alt: 'Cattle Fair',
      caption: 'Traditional Livestock Exhibition'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        alt: 'Livestock Trading',
        caption: 'Cattle trading and breed competitions'
      }
    ],
    organizer: {
      _id: 'org-3',
      name: 'Uttar Pradesh Livestock Board',
      type: 'government'
    },
    vendors: [
      {
        _id: 'vendor-3',
        vendorName: 'Premium Cattle Breeders',
        productType: 'livestock'
      }
    ],
    status: 'published',
    featured: true,
    tags: ['cattle', 'livestock', 'fair', 'traditional'],
    meta: {
      title: 'Cattle Fair & Livestock Exhibition',
      description: 'Annual cattle fair showcasing the best livestock breeds.',
      keywords: ['cattle', 'livestock', 'fair', 'mathura']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/cms/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const populate = searchParams.get('populate') || '*';
    const filters = searchParams.get('filters') || '{}';
    const sort = searchParams.get('sort') || 'date:desc';
    const page = parseInt(searchParams.get('pagination[page]') || '1');
    const pageSize = parseInt(searchParams.get('pagination[pageSize]') || '10');

    // Parse filters
    let filterObj = {};
    try {
      filterObj = JSON.parse(filters);
    } catch (e) {
      // Handle simple filters
      const status = searchParams.get('filters[status]');
      const featured = searchParams.get('filters[featured]');
      const city = searchParams.get('filters[location][city]');
      
      if (status) filterObj.status = status;
      if (featured !== null) filterObj.featured = featured === 'true';
      if (city) filterObj['location.city'] = new RegExp(city, 'i');
    }

    // Apply filters to mock data
    let filteredEvents = [...mockEvents];

    // Filter by status
    if (filterObj.status) {
      filteredEvents = filteredEvents.filter(event => event.status === filterObj.status);
    }

    // Filter by featured
    if (filterObj.featured !== undefined) {
      filteredEvents = filteredEvents.filter(event => event.featured === filterObj.featured);
    }

    // Filter by city
    if (filterObj['location.city']) {
      const cityRegex = filterObj['location.city'];
      filteredEvents = filteredEvents.filter(event => 
        cityRegex.test(event.location.city)
      );
    }

    // Apply sorting
    if (sort.includes(':')) {
      const [field, order] = sort.split(':');
      filteredEvents.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        
        if (aVal < bVal) return order === 'desc' ? 1 : -1;
        if (aVal > bVal) return order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const skip = (page - 1) * pageSize;
    const paginatedEvents = filteredEvents.slice(skip, skip + pageSize);

    return NextResponse.json({
      data: paginatedEvents,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(filteredEvents.length / pageSize),
          total: filteredEvents.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/cms/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data.title || !data.description || !data.date) {
      return NextResponse.json(
        { error: 'Title, description, and date are required' },
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

    const newEvent = {
      _id: `event-${Date.now()}`,
      ...data,
      slug: data.slug || createSlug(data.title),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock data (in real app, this would save to database)
    mockEvents.push(newEvent);

    return NextResponse.json({
      data: newEvent
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

