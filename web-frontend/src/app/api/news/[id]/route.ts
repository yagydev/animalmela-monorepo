import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { NewsUpdate } from '@/lib/models/CMSModels';

/** GET /api/news/:slug — full article including content, increments view count */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id: slug } = await params;

    const article = await NewsUpdate.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Related: same category, exclude current
    const related = await NewsUpdate.find({
      status: 'published',
      slug: { $ne: slug },
      category: (article as unknown as { category: string }).category,
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('slug title image readTime publishedAt category')
      .lean();

    return NextResponse.json({ success: true, data: { article, related } });
  } catch (error) {
    console.error('News detail error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load article' }, { status: 500 });
  }
}
