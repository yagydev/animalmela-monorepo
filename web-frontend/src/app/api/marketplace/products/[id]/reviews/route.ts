import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product, User } from '@/lib/models/MarketplaceModels';

// POST /api/marketplace/products/[id]/reviews - Add product review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, rating, comment, images } = body;

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.userId.toString() === userId
    );

    if (existingReview) {
      return NextResponse.json({
        success: false,
        error: 'You have already reviewed this product'
      }, { status: 400 });
    }

    // Add review
    const review = {
      userId,
      rating,
      comment,
      images: images || []
    };

    product.reviews.push(review);

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = totalRating / product.reviews.length;
    product.totalReviews = product.reviews.length;

    await product.save();

    // Update farmer's overall rating
    const farmer = await User.findById(product.farmerId);
    if (farmer) {
      const farmerProducts = await Product.find({ farmerId: farmer._id });
      const allRatings = farmerProducts.flatMap(p => p.reviews.map(r => r.rating));
      
      if (allRatings.length > 0) {
        farmer.rating.average = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
        farmer.rating.count = allRatings.length;
        await farmer.save();
      }
    }

    return NextResponse.json({
      success: true,
      review,
      message: 'Review added successfully'
    });
  } catch (error: any) {
    console.error('Error adding review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add review'
    }, { status: 500 });
  }
}

// GET /api/marketplace/products/[id]/reviews - Get product reviews
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const product = await Product.findById(params.id)
      .populate('reviews.userId', 'name profileImage')
      .select('reviews averageRating totalReviews');

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      reviews: product.reviews,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reviews'
    }, { status: 500 });
  }
}
