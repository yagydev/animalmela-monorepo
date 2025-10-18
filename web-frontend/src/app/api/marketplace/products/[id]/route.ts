import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product, Order, User } from '@/lib/models/MarketplaceModels';
import PaymentService from '@/lib/services/PaymentService';

// GET /api/marketplace/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const product = await Product.findById(params.id)
      .populate('farmerId', 'name email phone rating location')
      .populate('reviews.userId', 'name profileImage');

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product'
    }, { status: 500 });
  }
}

// PUT /api/marketplace/products/[id] - Update product (Farmer only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const farmerId = body.farmerId; // Should come from JWT token

    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    if (product.farmerId.toString() !== farmerId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to update this product'
      }, { status: 403 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).populate('farmerId', 'name email phone rating location');

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
}

// DELETE /api/marketplace/products/[id] - Delete product (Farmer only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const farmerId = request.headers.get('farmer-id'); // Should come from JWT token

    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    if (product.farmerId.toString() !== farmerId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to delete this product'
      }, { status: 403 });
    }

    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 });
  }
}
