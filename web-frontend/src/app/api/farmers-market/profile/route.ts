import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1';

    // Mock user profile data
    const mockProfile = {
      _id: userId,
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      mobile: '+919876543210',
      role: 'farmer',
      profileComplete: true,
      location: {
        state: 'Punjab',
        district: 'Ludhiana',
        pincode: '141001',
        village: 'Model Town'
      },
      paymentPreferences: {
        upi: 'rajesh@paytm',
        bankAccount: '1234567890',
        ifsc: 'SBIN0001234'
      },
      rating: {
        average: 4.5,
        count: 12
      },
      totalRatings: 12,
      totalListings: 8,
      totalOrders: 25,
      memberSince: '2023-01-15',
      isVerified: true,
      profileImage: '/images/farmer-profile.jpg',
      bio: 'Experienced farmer with 10+ years in organic farming',
      specialties: ['Organic Vegetables', 'Dairy Products', 'Grains'],
      certifications: ['Organic Certification', 'Good Agricultural Practices'],
      socialLinks: {
        whatsapp: '+919876543210',
        facebook: 'rajesh.farmer'
      }
    };

    return NextResponse.json({
      success: true,
      profile: mockProfile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const updateData = await request.json();

    // Mock profile update
    const updatedUser = {
      _id: 1,
      name: 'Test User',
      email: 'test@test.com',
      mobile: '+919876543210',
      role: 'farmer',
      location: updateData.location,
      paymentPreferences: updateData.paymentPreferences,
      profileComplete: true
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
