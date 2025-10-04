import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { receiverId, message, type } = await request.json();

    if (!receiverId || !message) {
      return NextResponse.json(
        { success: false, error: 'Receiver ID and message are required' },
        { status: 400 }
      );
    }

    // Mock message sending
    const messageData = {
      senderId: 1,
      receiverId,
      message,
      type: type || 'text',
      timestamp: new Date().toISOString(),
      read: false
    };

    console.log('Message sent:', messageData);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      messageData
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
