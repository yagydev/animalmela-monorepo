import { NextResponse } from 'next/server';

export function jsonError(
  message: string,
  status: number,
  data: Record<string, unknown> = {}
) {
  return NextResponse.json({ success: false, message, data }, { status });
}

export function jsonOk<T>(data: T, message = '') {
  return NextResponse.json({ success: true, message, data });
}
