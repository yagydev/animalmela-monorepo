import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order, Product, User, Analytics } from '@/lib/models/MarketplaceModels';
import PaymentService from '@/lib/services/PaymentService';

// POST /api/marketplace/orders - Create order and payment
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { items, buyerId, shippingAddress, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No items in cart'
      }, { status: 400 });
    }

    // Calculate total amount and validate products
    let totalAmount = 0;
    const orderItems = [];
    const farmerIds = new Set();

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json({
          success: false,
          error: `Product ${item.productId} not found`
        }, { status: 404 });
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json({
          success: false,
          error: `Insufficient quantity for ${product.name}`
        }, { status: 400 });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      farmerIds.add(product.farmerId.toString());

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        totalPrice: itemTotal
      });
    }

    // Create order
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const order = new Order({
      orderId,
      buyerId,
      farmerId: Array.from(farmerIds)[0], // Primary farmer (simplified)
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // Create payment order if UPI/wallet
    if (paymentMethod === 'upi' || paymentMethod === 'wallet') {
      const paymentOrder = await PaymentService.createOrder({
        orderId: order.orderId,
        amount: totalAmount,
        buyerId,
        farmerId: Array.from(farmerIds)[0],
        description: `Order for ${orderItems.length} items`
      });

      if (!paymentOrder.success) {
        return NextResponse.json({
          success: false,
          error: 'Payment order creation failed'
        }, { status: 500 });
      }

      // Update order with Razorpay details
      order.razorpayOrderId = paymentOrder.orderId;
      await order.save();

      return NextResponse.json({
        success: true,
        order,
        payment: {
          orderId: paymentOrder.orderId,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          key: paymentOrder.key
        }
      });
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully'
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create order'
    }, { status: 500 });
  }
}

// GET /api/marketplace/orders - Get user orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');
    const farmerId = searchParams.get('farmerId');
    const status = searchParams.get('status');

    const filter: any = {};
    if (buyerId) filter.buyerId = buyerId;
    if (farmerId) filter.farmerId = farmerId;
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate('buyerId', 'name email phone')
      .populate('farmerId', 'name email phone')
      .populate('items.productId', 'name images price')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders'
    }, { status: 500 });
  }
}
