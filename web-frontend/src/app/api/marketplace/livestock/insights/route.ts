import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import { priceInsightLabel } from '@/lib/livestock/livestockSpecifications';

/** GET /api/marketplace/livestock/insights?price=&breed=&animalType= — simple price intelligence */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const price = parseFloat(searchParams.get('price') || '');
    const breed = searchParams.get('breed')?.trim();
    const animalType = searchParams.get('animalType')?.trim().toLowerCase();

    const match: Record<string, unknown> = { category: 'livestock', status: 'approved' };
    if (breed) match['specifications.breed'] = new RegExp(`^${breed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    if (animalType) match['specifications.animalType'] = animalType;

    const rows = await MarketplaceListing.find(match).select('price').lean();
    const prices = rows.map((r) => r.price).filter((p) => typeof p === 'number' && p > 0);
    const sampleSize = prices.length;
    const avg = sampleSize ? prices.reduce((a, b) => a + b, 0) / sampleSize : null;
    const min = sampleSize ? Math.min(...prices) : null;
    const max = sampleSize ? Math.max(...prices) : null;

    const insight =
      !Number.isNaN(price) && price > 0 ? priceInsightLabel(price, avg, sampleSize) : { label: '', tone: 'neutral' as const };

    return NextResponse.json({
      success: true,
      data: {
        sampleSize,
        averagePrice: avg != null ? Math.round(avg) : null,
        minPrice: min,
        maxPrice: max,
        insightLabel: insight.label,
        insightTone: insight.tone
      }
    });
  } catch (error) {
    console.error('Livestock insights error:', error);
    return NextResponse.json({ success: false, error: 'Failed to compute insights' }, { status: 500 });
  }
}
