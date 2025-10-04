import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock cart data
    const mockCart = {
      items: [
        {
          listingId: {
            id: 1,
            title: 'Premium Organic Wheat',
            price: 2500,
            unit: 'quintal',
            images: ['/api/placeholder/300/200'],
            category: 'crops'
          },
          quantity: 2,
          unitPrice: 2500,
          totalPrice: 5000,
          addedAt: new Date().toISOString()
        },
        {
          listingId: {
            id: 2,
            title: 'Fresh Organic Rice',
            price: 3000,
            unit: 'quintal',
            images: ['/api/placeholder/300/200'],
            category: 'crops'
          },
          quantity: 1,
          unitPrice: 3000,
          totalPrice: 3000,
          addedAt: new Date().toISOString()
        }
      ],
      totalAmount: 8000,
      itemCount: 3
    };

    return NextResponse.json({
      success: true,
      cart: mockCart
    });

  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { listingId, quantity } = await request.json();

    if (!listingId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Listing ID and quantity are required' },
        { status: 400 }
      );
    }

    // Mock response for adding to cart
    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: [{
          listingId: { id: listingId, title: 'Product', price: 1000, unit: 'kg' },
          quantity,
          unitPrice: 1000,
          totalPrice: quantity * 1000,
          addedAt: new Date().toISOString()
        }],
        totalAmount: quantity * 1000,
        itemCount: quantity
      }
    });

  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { listingId, quantity } = await request.json();

    // Mock response for updating cart
    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      cart: {
        items: [{
          listingId: { id: listingId, title: 'Product', price: 1000, unit: 'kg' },
          quantity,
          unitPrice: 1000,
          totalPrice: quantity * 1000,
          addedAt: new Date().toISOString()
        }],
        totalAmount: quantity * 1000,
        itemCount: quantity
      }
    });

  } catch (error) {
    console.error('Cart PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { listingId } = await request.json();

    // Mock response for removing from cart
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: [],
        totalAmount: 0,
        itemCount: 0
      }
    });

  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
