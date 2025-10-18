import { NextRequest, NextResponse } from 'next/server';

// GET /api/marketplace/vendor/dashboard - Get vendor dashboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    // Return mock data for development
    const mockDashboard = {
      vendor: {
        _id: vendorId,
        name: 'Demo Vendor',
        email: 'vendor@demo.com',
        phone: '9876543210',
        businessName: 'Demo Business',
        location: {
          address: '123 Demo Street',
          city: 'Demo City',
          state: 'Demo State',
          pincode: '123456'
        }
      },
      stats: {
        totalStalls: 5,
        activeStalls: 3,
        bookedStalls: 2,
        totalRevenue: 15000
      },
      stalls: [
        {
          _id: 'stall-1',
          name: 'Fresh Produce Stall',
          description: 'Fresh vegetables and fruits',
          price: 2000,
          capacity: 50,
          status: 'active',
          bookings: []
        },
        {
          _id: 'stall-2',
          name: 'Dairy Products Stall',
          description: 'Fresh milk and dairy products',
          price: 3000,
          capacity: 30,
          status: 'booked',
          bookings: [
            {
              buyer: 'buyer-1',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              totalAmount: 3000,
              status: 'confirmed',
              createdAt: new Date().toISOString()
            }
          ]
        },
        {
          _id: 'stall-3',
          name: 'Grain Storage Stall',
          description: 'Wheat, rice, and other grains',
          price: 2500,
          capacity: 40,
          status: 'active',
          bookings: []
        },
        {
          _id: 'stall-4',
          name: 'Livestock Stall',
          description: 'Cattle and poultry',
          price: 4000,
          capacity: 20,
          status: 'active',
          bookings: []
        },
        {
          _id: 'stall-5',
          name: 'Equipment Stall',
          description: 'Farming tools and equipment',
          price: 3500,
          capacity: 25,
          status: 'booked',
          bookings: [
            {
              buyer: 'buyer-2',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              totalAmount: 3500,
              status: 'confirmed',
              createdAt: new Date().toISOString()
            }
          ]
        }
      ],
      recentBookings: [
        {
          _id: 'booking-1',
          stallName: 'Dairy Products Stall',
          stallId: 'stall-2',
          buyer: 'buyer-1',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalAmount: 3000,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'booking-2',
          stallName: 'Equipment Stall',
          stallId: 'stall-5',
          buyer: 'buyer-2',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          totalAmount: 3500,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
      ]
    };

    return NextResponse.json({
      success: true,
      dashboard: mockDashboard
    });

  } catch (error) {
    console.error('Error fetching vendor dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendor dashboard' },
      { status: 500 }
    );
  }
}
