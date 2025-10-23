import { NextRequest, NextResponse } from 'next/server';
import { marketplaceAI } from '../../../../../lib/services/marketplaceAI';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['itemName', 'category', 'condition', 'price', 'location'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate AI listing
    const aiResponse = await marketplaceAI.generateListing({
      itemName: body.itemName,
      category: body.category,
      condition: body.condition,
      price: body.price,
      quantity: body.quantity,
      location: body.location,
      brandBreedVariety: body.brandBreedVariety,
      conditionSummary: body.conditionSummary,
      specifications: body.specifications
    });

    // Generate SEO keywords
    const seoKeywords = await marketplaceAI.generateSEOKeywords({
      itemName: body.itemName,
      category: body.category,
      condition: body.condition,
      price: body.price,
      quantity: body.quantity,
      location: body.location,
      brandBreedVariety: body.brandBreedVariety,
      conditionSummary: body.conditionSummary,
      specifications: body.specifications
    });

    return NextResponse.json({
      success: true,
      data: {
        ...aiResponse,
        seoKeywords
      }
    });

  } catch (error) {
    console.error('AI Generation API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Generation endpoint. Use POST method with listing data.'
  }, { status: 405 });
}
