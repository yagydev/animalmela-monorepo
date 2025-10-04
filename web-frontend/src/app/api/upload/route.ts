import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const type = formData.get('type') as string;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (image.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // For demo purposes, return a mock URL
    // In production, you would upload to a cloud storage service
    const mockUrl = `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800&h=600&fit=crop`;
    
    return NextResponse.json({
      success: true,
      url: mockUrl,
      filename: image.name,
      size: image.size,
      type: image.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
