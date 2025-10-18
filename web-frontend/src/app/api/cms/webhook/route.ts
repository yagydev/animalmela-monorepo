import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock webhook processing
    console.log('Webhook received:', body);
    
    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      received: true 
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}