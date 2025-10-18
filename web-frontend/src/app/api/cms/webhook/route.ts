import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event, Vendor, Product, Organization, NewsUpdate } from '@/lib/models/CMSModels';

// Webhook endpoint for external CMS updates
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { event, data, type } = body;

    // Verify webhook signature (in production, use proper webhook verification)
    const signature = request.headers.get('x-webhook-signature');
    if (!verifyWebhookSignature(signature, JSON.stringify(body))) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    let result;

    switch (type) {
      case 'event':
        result = await handleEventWebhook(event, data);
        break;
      case 'vendor':
        result = await handleVendorWebhook(event, data);
        break;
      case 'product':
        result = await handleProductWebhook(event, data);
        break;
      case 'organization':
        result = await handleOrganizationWebhook(event, data);
        break;
      case 'news':
        result = await handleNewsWebhook(event, data);
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown content type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

function verifyWebhookSignature(signature: string | null, payload: string): boolean {
  // In production, implement proper webhook signature verification
  // For now, we'll accept all webhooks (implement proper verification)
  return true;
}

async function handleEventWebhook(event: string, data: any) {
  switch (event) {
    case 'create':
      const newEvent = new Event(data);
      await newEvent.save();
      return newEvent;
    
    case 'update':
      return await Event.findByIdAndUpdate(data.id, data, { new: true });
    
    case 'delete':
      return await Event.findByIdAndDelete(data.id);
    
    case 'publish':
      return await Event.findByIdAndUpdate(data.id, { status: 'published' }, { new: true });
    
    case 'unpublish':
      return await Event.findByIdAndUpdate(data.id, { status: 'draft' }, { new: true });
    
    default:
      throw new Error(`Unknown event type: ${event}`);
  }
}

async function handleVendorWebhook(event: string, data: any) {
  switch (event) {
    case 'create':
      const newVendor = new Vendor(data);
      await newVendor.save();
      return newVendor;
    
    case 'update':
      return await Vendor.findByIdAndUpdate(data.id, data, { new: true });
    
    case 'delete':
      return await Vendor.findByIdAndDelete(data.id);
    
    case 'activate':
      return await Vendor.findByIdAndUpdate(data.id, { status: 'active' }, { new: true });
    
    case 'deactivate':
      return await Vendor.findByIdAndUpdate(data.id, { status: 'inactive' }, { new: true });
    
    case 'verify':
      return await Vendor.findByIdAndUpdate(data.id, { verified: true }, { new: true });
    
    default:
      throw new Error(`Unknown event type: ${event}`);
  }
}

async function handleProductWebhook(event: string, data: any) {
  switch (event) {
    case 'create':
      const newProduct = new Product(data);
      await newProduct.save();
      return newProduct;
    
    case 'update':
      return await Product.findByIdAndUpdate(data.id, data, { new: true });
    
    case 'delete':
      return await Product.findByIdAndDelete(data.id);
    
    case 'activate':
      return await Product.findByIdAndUpdate(data.id, { status: 'active' }, { new: true });
    
    case 'deactivate':
      return await Product.findByIdAndUpdate(data.id, { status: 'inactive' }, { new: true });
    
    case 'out_of_stock':
      return await Product.findByIdAndUpdate(data.id, { status: 'out_of_stock' }, { new: true });
    
    case 'feature':
      return await Product.findByIdAndUpdate(data.id, { featured: true }, { new: true });
    
    case 'unfeature':
      return await Product.findByIdAndUpdate(data.id, { featured: false }, { new: true });
    
    default:
      throw new Error(`Unknown event type: ${event}`);
  }
}

async function handleOrganizationWebhook(event: string, data: any) {
  switch (event) {
    case 'create':
      const newOrg = new Organization(data);
      await newOrg.save();
      return newOrg;
    
    case 'update':
      return await Organization.findByIdAndUpdate(data.id, data, { new: true });
    
    case 'delete':
      return await Organization.findByIdAndDelete(data.id);
    
    case 'activate':
      return await Organization.findByIdAndUpdate(data.id, { status: 'active' }, { new: true });
    
    case 'deactivate':
      return await Organization.findByIdAndUpdate(data.id, { status: 'inactive' }, { new: true });
    
    case 'verify':
      return await Organization.findByIdAndUpdate(data.id, { verified: true }, { new: true });
    
    default:
      throw new Error(`Unknown event type: ${event}`);
  }
}

async function handleNewsWebhook(event: string, data: any) {
  switch (event) {
    case 'create':
      const newNews = new NewsUpdate(data);
      await newNews.save();
      return newNews;
    
    case 'update':
      return await NewsUpdate.findByIdAndUpdate(data.id, data, { new: true });
    
    case 'delete':
      return await NewsUpdate.findByIdAndDelete(data.id);
    
    case 'publish':
      return await NewsUpdate.findByIdAndUpdate(data.id, { 
        status: 'published',
        publishedAt: new Date()
      }, { new: true });
    
    case 'unpublish':
      return await NewsUpdate.findByIdAndUpdate(data.id, { status: 'draft' }, { new: true });
    
    case 'feature':
      return await NewsUpdate.findByIdAndUpdate(data.id, { featured: true }, { new: true });
    
    case 'unfeature':
      return await NewsUpdate.findByIdAndUpdate(data.id, { featured: false }, { new: true });
    
    default:
      throw new Error(`Unknown event type: ${event}`);
  }
}

// GET endpoint to test webhook functionality
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Webhook endpoint is active',
    supportedTypes: ['event', 'vendor', 'product', 'organization', 'news'],
    supportedEvents: {
      event: ['create', 'update', 'delete', 'publish', 'unpublish'],
      vendor: ['create', 'update', 'delete', 'activate', 'deactivate', 'verify'],
      product: ['create', 'update', 'delete', 'activate', 'deactivate', 'out_of_stock', 'feature', 'unfeature'],
      organization: ['create', 'update', 'delete', 'activate', 'deactivate', 'verify'],
      news: ['create', 'update', 'delete', 'publish', 'unpublish', 'feature', 'unfeature']
    },
    timestamp: new Date().toISOString()
  });
}
