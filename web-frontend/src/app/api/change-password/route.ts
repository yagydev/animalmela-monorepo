import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/database';
import User from '../../../../models/User';
import { verifyToken } from '../../../../lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Authorization token required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);

    let userData: any;
    try {
      userData = verifyToken(token);
    } catch {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token'
      }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'Current password, new password, and confirm password are required'
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'New password must be at least 6 characters long'
      }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'New passwords do not match'
      }, { status: 400 });
    }

    try {
      await connectDB();
    } catch (dbError: any) {
      console.error('MongoDB connection failed:', dbError.message);
      return NextResponse.json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.'
      }, { status: 503 });
    }

    const user = await User.findById(userData.id).select('+password');

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Current password is incorrect'
      }, { status: 400 });
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);

    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Change password endpoint. Use POST method with current and new passwords.'
  }, { status: 405 });
}
