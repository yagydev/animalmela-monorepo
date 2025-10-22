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

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: { lat: Number, lng: Number }
  },
  image: {
    url: { type: String, required: true },
    alt: String,
    caption: String
  },
  gallery: [{
    url: String,
    alt: String,
    caption: String
  }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false },
  tags: [String],
  meta: {
    title: String,
    description: String,
    keywords: [String]
  }
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

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
    let filterObj: any = {};
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

    // Build MongoDB query
    const query: any = {};
    
    if (filterObj.status) {
      query.status = filterObj.status;
    }
    
    if (filterObj.featured !== undefined) {
      query.featured = filterObj.featured;
    }
    
    if (filterObj['location.city']) {
      query['location.city'] = filterObj['location.city'];
    }

    // Build sort object
    let sortObj: any = {};
    if (sort.includes(':')) {
      const [field, order] = sort.split(':');
      sortObj[field] = order === 'desc' ? -1 : 1;
    }

    // Apply pagination
    const skip = (page - 1) * pageSize;

    const events = await Event.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Event.countDocuments(query);

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
    const createSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    const eventData = {
      ...data,
      slug: data.slug || createSlug(data.title)
    };

    const newEvent = new Event(eventData);
    await newEvent.save();

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