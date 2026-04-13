import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import type { AnimalType } from '@/lib/livestock/livestockSpecifications';

const ANIMAL_TYPES: AnimalType[] = ['cow', 'buffalo', 'goat', 'sheep', 'poultry', 'other'];

function isDbUnavailableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('ECONNREFUSED') ||
    message.includes('buffering timed out') ||
    message.includes('ServerSelectionError')
  );
}

/** GET /api/marketplace/livestock — browse advanced livestock listings (Mongo, category=livestock). */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 48);
    const animalType = searchParams.get('animalType')?.toLowerCase();
    const breed = searchParams.get('breed')?.trim();
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location')?.trim();
    const q = searchParams.get('q')?.trim();
    const verifiedOnly = searchParams.get('verifiedOnly') === '1' || searchParams.get('verifiedOnly') === 'true';
    const minMilk = searchParams.get('minMilk');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sellerId = searchParams.get('sellerId')?.trim();
    const includePending = searchParams.get('includePending') === '1';
    const state = searchParams.get('state')?.trim();
    const district = searchParams.get('district')?.trim();

    const and: Record<string, unknown>[] = [];

    if (sellerId) {
      and.push({ sellerId });
    }

    if (animalType && ANIMAL_TYPES.includes(animalType as AnimalType)) {
      and.push({ 'specifications.animalType': animalType });
    }
    if (breed) {
      and.push({ 'specifications.breed': { $regex: breed, $options: 'i' } });
    }
    if (verifiedOnly) {
      and.push({ 'specifications.verifiedListing': true });
    }
    if (minPrice || maxPrice) {
      const price: Record<string, number> = {};
      if (minPrice) price.$gte = parseInt(minPrice, 10);
      if (maxPrice) price.$lte = parseInt(maxPrice, 10);
      and.push({ price });
    }
    if (location) {
      and.push({
        $or: [
          { location: { $regex: location, $options: 'i' } },
          { 'specifications.city': { $regex: location, $options: 'i' } },
          { 'specifications.state': { $regex: location, $options: 'i' } }
        ]
      });
    }
    if (state) {
      and.push({ 'specifications.state': { $regex: state, $options: 'i' } });
    }
    if (district) {
      and.push({ 'specifications.city': { $regex: district, $options: 'i' } });
    }
    if (minMilk) {
      const v = parseFloat(minMilk);
      if (!Number.isNaN(v)) and.push({ 'specifications.milkYieldPerDay': { $gte: v } });
    }
    if (q) {
      and.push({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } },
          { 'specifications.breed': { $regex: q, $options: 'i' } }
        ]
      });
    }

    const statusFilter = includePending && sellerId ? { $in: ['approved', 'pending', 'rejected'] as const } : 'approved';
    const base: Record<string, unknown> = { category: 'livestock', status: statusFilter };
    const filters: Record<string, unknown> = and.length > 0 ? { ...base, $and: and } : base;

    const sort: Record<string, 1 | -1> = { featured: -1 };
    if (sortBy === 'price-asc') sort.price = 1;
    else if (sortBy === 'price-desc') sort.price = -1;
    else if (sortBy === 'milk-desc') sort['specifications.milkYieldPerDay'] = -1;
    else sort.createdAt = -1;

    const skip = (page - 1) * limit;
    const [listings, totalCount] = await Promise.all([
      MarketplaceListing.find(filters).sort(sort).skip(skip).limit(limit).lean(),
      MarketplaceListing.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      success: true,
      data: listings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    });
  } catch (error) {
    console.error('Livestock browse error:', error);
    if (isDbUnavailableError(error)) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 12
        },
        warning: 'Database unavailable.'
      });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch livestock listings' }, { status: 500 });
  }
}

/** POST /api/marketplace/livestock — create livestock listing (pending approval). */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const {
      name,
      description,
      price,
      images,
      location,
      sellerId,
      sellerName,
      sellerPhone,
      condition = 'used',
      specifications = {},
      tags = []
    } = body;

    if (!name || !description || price == null || !location || !sellerId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, price, location, sellerId' },
        { status: 400 }
      );
    }
    const imgs: string[] = Array.isArray(images) ? images.filter(Boolean) : [];
    if (imgs.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one image URL is required' }, { status: 400 });
    }

    const spec = typeof specifications === 'object' && specifications !== null ? specifications : {};
    if (spec.animalType && !ANIMAL_TYPES.includes(String(spec.animalType).toLowerCase() as AnimalType)) {
      return NextResponse.json({ success: false, error: 'Invalid animalType' }, { status: 400 });
    }

    const listing = await MarketplaceListing.create({
      name: String(name).slice(0, 200),
      description: String(description).slice(0, 2000),
      category: 'livestock',
      condition: ['new', 'used'].includes(condition) ? condition : 'used',
      price: Number(price),
      images: imgs.slice(0, 10),
      location: String(location).slice(0, 200),
      sellerId: String(sellerId),
      sellerName: sellerName ? String(sellerName) : undefined,
      sellerPhone: sellerPhone ? String(sellerPhone) : undefined,
      status: 'pending',
      featured: false,
      tags: Array.isArray(tags) ? tags.map(String).slice(0, 20) : [],
      specifications: spec,
      viewsCount: 0
    });

    return NextResponse.json(
      {
        success: true,
        data: listing,
        message: 'Listing submitted for review. It will appear after approval.'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Livestock create error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create listing' }, { status: 500 });
  }
}
