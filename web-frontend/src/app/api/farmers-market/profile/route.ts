import { NextRequest, NextResponse } from 'next/server';

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
