import { NextRequest, NextResponse } from 'next/server';
import { BREEDS_BY_TYPE } from '@/lib/livestock/livestockSpecifications';

/** GET /api/marketplace/livestock/breeds?animalType=cow */
export async function GET(request: NextRequest) {
  const t = request.nextUrl.searchParams.get('animalType')?.toLowerCase() || 'cow';
  const list = BREEDS_BY_TYPE[t] || BREEDS_BY_TYPE.other || [];
  return NextResponse.json({ success: true, data: list });
}
