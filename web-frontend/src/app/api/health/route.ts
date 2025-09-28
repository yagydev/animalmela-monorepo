import { NextResponse } from 'next/server';

// Health check endpoint for kisaanmela.com
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Kisaan Mela API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      login: '/api/login',
      register: '/api/register',
      health: '/api/health',
      me: '/api/me'
    }
  });
}
