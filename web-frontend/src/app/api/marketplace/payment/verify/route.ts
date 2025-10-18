import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order, Product, User, Analytics } from '@/lib/models/MarketplaceModels';
import PaymentService from '@/lib/services/PaymentService';

// POST /api/marketplace/payment/verify - Verify payment
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = body;

    // Verify payment signature
    const verification = PaymentService.verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!verification.success) {
      return NextResponse.json({
        success: false,
        error: 'Payment verification failed'
      }, { status: 400 });
    }

    // Update order status
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    
    await order.save();

    // Update product quantities
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } }
      );
    }

    // Track analytics
    const analytics = new Analytics({
      type: 'purchase',
      userId: order.buyerId,
      metadata: {
        source: 'marketplace',
        orderId: order.orderId,
        amount: order.totalAmount
      },
      value: order.totalAmount
    });
    await analytics.save();

    return NextResponse.json({
      success: true,
      order,
      message: 'Payment verified and order confirmed'
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to verify payment'
    }, { status: 500 });
  }
}
