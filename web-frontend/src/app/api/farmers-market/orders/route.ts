import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items, shippingAddress, paymentMethod, paymentDetails } = await request.json();

    if (!items || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Items, shipping address, and payment method are required' },
        { status: 400 }
      );
    }

    // Mock response for placing order
    const newOrder = {
      id: Date.now(),
      buyerId: 1,
      sellerId: 2,
      items,
      totalAmount: items.reduce((sum: number, item: any) => sum + item.totalPrice, 0),
      shippingAddress,
      paymentMethod,
      paymentDetails,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      orders: [newOrder]
    });

  } catch (error) {
    console.error('Place order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to place order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock orders data
    const mockOrders = [
      {
        id: 1,
        buyerId: { id: 1, name: 'Test Buyer' },
        sellerId: { id: 2, name: 'Test Seller' },
        items: [
          {
            listingId: { id: 1, title: 'Premium Organic Wheat' },
            quantity: 2,
            unitPrice: 2500,
            totalPrice: 5000
          }
        ],
        totalAmount: 5000,
        shippingAddress: {
          fullName: 'Test Buyer',
          mobile: '+919876543210',
          address: '123 Test Street',
          city: 'Test City',
          state: 'Punjab',
          pincode: '141001'
        },
        paymentMethod: 'cash_on_delivery',
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockOrders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
