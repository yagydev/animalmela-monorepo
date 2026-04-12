import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Schema, Model } from 'mongoose';
import dbConnect from '@/lib/dbConnect';

interface IContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  contactMethod: string;
  createdAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  contactMethod: { type: String, default: 'email' },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model re-registration during hot reload in development.
// Cast via `unknown` to avoid the TS2590 "union too complex" error from mongoose.models typing.
const ContactMessage: Model<IContactMessage> =
  (mongoose.models as Record<string, unknown>)['ContactMessage']
    ? ((mongoose.models as Record<string, unknown>)['ContactMessage'] as Model<IContactMessage>)
    : mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema, 'contactmessages');

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: Record<string, unknown> = await request.json();

    const { name, email, phone, subject, message, contactMethod } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, subject, and message are required.' },
        { status: 400 }
      );
    }

    await ContactMessage.create({
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : undefined,
      subject: String(subject),
      message: String(message),
      contactMethod: contactMethod ? String(contactMethod) : 'email',
    });

    return NextResponse.json({
      success: true,
      message: 'Message received. We will respond within 24 hours.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
