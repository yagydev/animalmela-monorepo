import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Event } from '@/lib/models/CMSModels';

// GET /api/cms/events - Get all events (MongoDB `events` collection)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const filters = searchParams.get('filters') || '{}';
    const sort = searchParams.get('sort') || 'date:desc';
    const page = parseInt(searchParams.get('pagination[page]') || '1');
    const pageSize = parseInt(searchParams.get('pagination[pageSize]') || '10');

    let filterObj: Record<string, unknown> = {};
    try {
      filterObj = JSON.parse(filters);
    } catch {
      /* use query params below */
    }

    const query: Record<string, unknown> = {};

    const status = searchParams.get('filters[status]');
    if (status) query.status = status;
    else if (filterObj.status) query.status = filterObj.status;

    const featured = searchParams.get('filters[featured]');
    if (featured !== null && featured !== '') query.featured = featured === 'true';
    if (filterObj.featured !== undefined) query.featured = filterObj.featured;

    const city = searchParams.get('filters[location][city]');
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (filterObj['location.city']) query['location.city'] = filterObj['location.city'];

    let sortObj: Record<string, 1 | -1> = {};
    if (sort.includes(':')) {
      const [field, order] = sort.split(':');
      sortObj[field] = order === 'desc' ? -1 : 1;
    }

    const skip = (page - 1) * pageSize;

    const summary = searchParams.get('summary') === '1';
    const listProjection =
      'title slug description date endDate location image featured tags melaMeta status';

    let cursor = Event.find(query);
    if (summary) {
      cursor = cursor.select(listProjection);
    }
    const events = await cursor.sort(sortObj).skip(skip).limit(pageSize).lean();

    const total = await Event.countDocuments(query);

    return NextResponse.json({
      data: events,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/cms/events - Create new event
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { data } = body;

    if (!data.title || !data.description || !data.date) {
      return NextResponse.json(
        { error: 'Title, description, and date are required' },
        { status: 400 },
      );
    }

    const createSlug = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const eventData = {
      ...data,
      slug: data.slug || createSlug(data.title),
    };

    const newEvent = new Event(eventData);
    await newEvent.save();

    return NextResponse.json({ data: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
