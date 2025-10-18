import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event, Vendor, Product, Organization, NewsUpdate } from '@/lib/models/CMSModels';
import { CachedDataService } from '@/lib/services/CacheService';

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
  if (populate === '*' || populate.includes('organizer')) {
    if (data.organizer) {
      data.organizer = await Organization.findById(data.organizer);
    }
  }
  
  if (populate === '*' || populate.includes('vendors')) {
    if (data.vendors && data.vendors.length > 0) {
      data.vendors = await Vendor.find({ _id: { $in: data.vendors } });
    }
  }
  
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

// GET /api/cms/events - Get all events
export async function GET(request: NextRequest) {
  try {
    await connectDB();

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

    // Try to get from cache first
    let events = await CachedDataService.getEvents(filterObj, populate);
    
    if (!events) {
      // Get events from database
      events = await Event.find(filterObj)
        .sort(sortObj)
        .skip(skip)
        .limit(pageSize)
        .lean();

      // Populate references
      events = await Promise.all(
        events.map(event => populateReferences(event, populate))
      );
    }

    // Get total count
    const total = await Event.countDocuments(filterObj);

    return NextResponse.json({
      data: events,
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
    await connectDB();

    const body = await request.json();
    const { data } = body;

    if (!data.title || !data.description || !data.date) {
      return NextResponse.json(
        { error: 'Title, description, and date are required' },
        { status: 400 }
      );
    }

    // Create slug if not provided
    if (!data.slug) {
      data.slug = createSlug(data.title);
    }

    const event = new Event(data);
    await event.save();

    // Invalidate cache
    CachedDataService.invalidateEventCache();

    // Populate references
    const populatedEvent = await populateReferences(event.toObject(), '*');

    return NextResponse.json({
      data: populatedEvent
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

