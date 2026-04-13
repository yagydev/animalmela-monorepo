import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LivestockDemand from '@/lib/models/LivestockDemand';

const VALID_ANIMAL_TYPES = ['cow', 'buffalo', 'goat', 'sheep', 'poultry', 'other'];

/** GET /api/marketplace/livestock/demand — list open demand posts */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const animalType = searchParams.get('animalType')?.toLowerCase();
    const state = searchParams.get('state')?.trim();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    const filter: Record<string, unknown> = {
      status: 'open',
      expiresAt: { $gt: new Date() }
    };
    if (animalType && VALID_ANIMAL_TYPES.includes(animalType)) {
      filter.animalType = animalType;
    }
    if (state) {
      filter.state = { $regex: state, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const [demands, totalCount] = await Promise.all([
      LivestockDemand.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      LivestockDemand.countDocuments(filter)
    ]);

    // Mask buyer phone for public view
    const masked = demands.map(d => ({
      ...d,
      buyerPhone: String(d.buyerPhone || '').slice(0, -4).replace(/./g, '•') + String(d.buyerPhone || '').slice(-4)
    }));

    return NextResponse.json({
      success: true,
      data: masked,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 1,
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Demand GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load demands' }, { status: 500 });
  }
}

/** POST /api/marketplace/livestock/demand — create demand post */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { animalType, breed, minMilkYield, budgetMin, budgetMax, state, district, description, buyerName, buyerPhone } = body;

    if (!animalType || !state || !description || !buyerName || !buyerPhone) {
      return NextResponse.json(
        { success: false, error: 'animalType, state, description, buyerName, buyerPhone are required' },
        { status: 400 }
      );
    }
    if (!VALID_ANIMAL_TYPES.includes(String(animalType).toLowerCase())) {
      return NextResponse.json({ success: false, error: 'Invalid animalType' }, { status: 400 });
    }
    if (String(description).length > 500) {
      return NextResponse.json({ success: false, error: 'Description max 500 chars' }, { status: 400 });
    }

    const demand = await LivestockDemand.create({
      animalType: String(animalType).toLowerCase(),
      breed: breed ? String(breed).slice(0, 100) : undefined,
      minMilkYield: minMilkYield ? Number(minMilkYield) : undefined,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      state: String(state).slice(0, 100),
      district: district ? String(district).slice(0, 100) : undefined,
      description: String(description).slice(0, 500),
      buyerName: String(buyerName).slice(0, 100),
      buyerPhone: String(buyerPhone).replace(/\s/g, '').slice(0, 20),
    });

    return NextResponse.json(
      { success: true, data: { id: demand._id }, message: 'Your requirement has been posted! Sellers will contact you.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Demand POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to post demand' }, { status: 500 });
  }
}
