import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import path from 'path';

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.mp4', '.mov']);
const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/heic',
  'video/mp4', 'video/quicktime'
]);
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * GET /api/marketplace/livestock/upload-url?filename=cow.jpg&contentType=image/jpeg&size=204800
 *
 * Returns a pre-signed S3 PUT URL (valid 5 min) and the final public object URL.
 * Client uploads directly to S3; finalises listing with objectUrl.
 *
 * Requires: AWS_S3_BUCKET, AWS_REGION (+ credentials via IAM role or env)
 */
export async function GET(request: NextRequest) {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION || 'ap-south-1';

  if (!bucket) {
    return NextResponse.json(
      { success: false, error: 'Media storage not configured (AWS_S3_BUCKET missing)' },
      { status: 503 }
    );
  }

  const { searchParams } = request.nextUrl;
  const filename = searchParams.get('filename')?.trim() || '';
  const contentType = searchParams.get('contentType')?.trim() || '';
  const size = parseInt(searchParams.get('size') || '0', 10);

  if (!filename || !contentType) {
    return NextResponse.json(
      { success: false, error: 'filename and contentType are required' },
      { status: 400 }
    );
  }

  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTS.has(ext)) {
    return NextResponse.json(
      { success: false, error: `File type not allowed. Supported: ${Array.from(ALLOWED_EXTS).join(', ')}` },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIME.has(contentType)) {
    return NextResponse.json({ success: false, error: 'Content-type not allowed' }, { status: 400 });
  }

  if (size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { success: false, error: 'File too large. Maximum 25 MB.' },
      { status: 400 }
    );
  }

  const key = `livestock/${randomUUID()}${ext}`;

  const s3 = new S3Client({ region });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ...(size > 0 ? { ContentLength: size } : {}),
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min
  const cdnBase = process.env.AWS_CDN_URL || `https://${bucket}.s3.${region}.amazonaws.com`;
  const objectUrl = `${cdnBase}/${key}`;

  return NextResponse.json({ success: true, data: { uploadUrl, objectUrl, key } });
}
