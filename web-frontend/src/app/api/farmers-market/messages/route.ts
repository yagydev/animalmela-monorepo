import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1';
    const conversationId = searchParams.get('conversationId');

    // Mock conversation data
    const mockMessages = [
      {
        id: 1,
        senderId: '1',
        receiverId: '2',
        message: 'Hi, I\'m interested in your organic tomatoes. Are they available?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: true,
        conversationId: 'conv_1_2'
      },
      {
        id: 2,
        senderId: '2',
        receiverId: '1',
        message: 'Yes, I have fresh organic tomatoes available. How many kg do you need?',
        type: 'text',
        timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
        read: true,
        conversationId: 'conv_1_2'
      },
      {
        id: 3,
        senderId: '1',
        receiverId: '2',
        message: 'I need 5 kg. What\'s the price per kg?',
        type: 'text',
        timestamp: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
        read: true,
        conversationId: 'conv_1_2'
      },
      {
        id: 4,
        senderId: '2',
        receiverId: '1',
        message: 'Price is ₹80 per kg. Total would be ₹400 for 5 kg.',
        type: 'text',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        read: false,
        conversationId: 'conv_1_2'
      }
    ];

    // Filter messages if conversationId is provided
    let filteredMessages = mockMessages;
    if (conversationId) {
      filteredMessages = mockMessages.filter(msg => msg.conversationId === conversationId);
    }

    // Filter messages for specific user
    filteredMessages = filteredMessages.filter(msg => 
      msg.senderId === userId || msg.receiverId === userId
    );

    return NextResponse.json({
      success: true,
      messages: filteredMessages,
      totalMessages: filteredMessages.length
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { receiverId, message, type, conversationId } = await request.json();

    if (!receiverId || !message) {
      return NextResponse.json(
        { success: false, error: 'Receiver ID and message are required' },
        { status: 400 }
      );
    }

    // Mock message sending
    const messageData = {
      id: Date.now(),
      senderId: '1', // Mock sender ID
      receiverId: receiverId.toString(),
      message: message.trim(),
      type: type || 'text',
      timestamp: new Date().toISOString(),
      read: false,
      conversationId: conversationId || `conv_1_${receiverId}`
    };

    console.log('Message sent:', messageData);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: messageData
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
