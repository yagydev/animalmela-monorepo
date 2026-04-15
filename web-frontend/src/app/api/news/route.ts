import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { NewsUpdate } from '@/lib/models/CMSModels';

/**
 * GET /api/news
 *   ?category=policy|market|technology|agriculture|livestock|export|farmer-stories|events
 *   ?featured=true
 *   ?q=search+term
 *   ?limit=20 (default 20, max 50)
 *   ?page=1
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category')?.trim();
    const featured  = searchParams.get('featured');
    const q         = searchParams.get('q')?.trim();
    const limit     = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const page      = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const skip      = (page - 1) * limit;

    type RegexCond = { $regex: string; $options: string };
    type NewsListFilter = {
      status: string;
      category?: string;
      featured?: boolean;
      $or?: Array<{ title?: RegexCond; excerpt?: RegexCond; tags?: RegexCond }>;
    };

    const filter: NewsListFilter = { status: 'published' };

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (q) {
      filter.$or = [
        { title:   { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { tags:    { $regex: q, $options: 'i' } },
      ];
    }

    const [articles, total] = await Promise.all([
      NewsUpdate.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content') // list view — exclude body
        .lean(),
      NewsUpdate.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        articles,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load news' }, { status: 500 });
  }
}
