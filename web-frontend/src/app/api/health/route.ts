import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

/** GET /api/health — ALB / K8s liveness probe */
export async function GET() {
  try {
    await dbConnect();
    const dbState = mongoose.connection.readyState;
    // 1 = connected
    if (dbState !== 1) {
      return NextResponse.json(
        { status: 'degraded', db: 'disconnected', dbState },
        { status: 503 }
      );
    }
    return NextResponse.json({ status: 'ok', db: 'connected' });
  } catch {
    return NextResponse.json(
      { status: 'error', db: 'unreachable' },
      { status: 503 }
    );
  }
}
