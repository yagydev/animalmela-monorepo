import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/database';
import { Event } from '../../../../lib/models/CMSModels';
import { requireAuth, requireRole } from '../../../../lib/apiAuth';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// GET /api/events?city=&upcoming=true&page=&pageSize=
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const upcoming = searchParams.get('upcoming');
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 50);

    const query: any = { status: 'published' };
    if (city) query['location.city'] = new RegExp(`^${city}$`, 'i');
    if (upcoming === 'true') query.date = { $gte: new Date() };

    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ date: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Event.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      meta: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) },
    });
  } catch (error: any) {
    console.error('GET /api/events error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events  (organizer or admin only)
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if ('error' in auth) return auth.error;

  const forbidden = requireRole(auth.user, ['organizer', 'admin']);
  if (forbidden) return forbidden;

  try {
    await connectDB();
    const body = await request.json();

    const required = ['title', 'description', 'date', 'endDate', 'location', 'image'];
    for (const f of required) {
      if (!body[f]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${f}` },
          { status: 400 }
        );
      }
    }

    if (typeof body.stallCapacity !== 'number' || body.stallCapacity < 0) {
      return NextResponse.json(
        { success: false, message: 'stallCapacity must be a non-negative number' },
        { status: 400 }
      );
    }
    if (typeof body.pricePerStall !== 'number' || body.pricePerStall < 0) {
      return NextResponse.json(
        { success: false, message: 'pricePerStall must be a non-negative number' },
        { status: 400 }
      );
    }

    const event = await Event.create({
      ...body,
      content: body.content || body.description,
      slug: body.slug || `${slugify(body.title)}-${Date.now().toString(36)}`,
      organizerUser: auth.user.id,
      status: body.status || 'published',
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/events error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}
