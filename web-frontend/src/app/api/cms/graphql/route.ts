import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event, Vendor, Product, Organization, NewsUpdate } from '@/lib/models/CMSModels';

// Simple GraphQL resolver for our CMS
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { query, variables = {} } = body;

    // Parse GraphQL query
    const result = await executeGraphQLQuery(query, variables);

    return NextResponse.json(result);

  } catch (error) {
    console.error('GraphQL Error:', error);
    return NextResponse.json(
      { 
        errors: [{ 
          message: error.message || 'GraphQL execution error',
          locations: [],
          path: []
        }] 
      },
      { status: 500 }
    );
  }
}

async function executeGraphQLQuery(query: string, variables: any) {
  // Simple query parser - in production, use a proper GraphQL library
  const queryLower = query.toLowerCase();

  if (queryLower.includes('eventcollection')) {
    return await handleEventCollectionQuery(query, variables);
  } else if (queryLower.includes('vendorcollection')) {
    return await handleVendorCollectionQuery(query, variables);
  } else if (queryLower.includes('productcollection')) {
    return await handleProductCollectionQuery(query, variables);
  } else if (queryLower.includes('organizationcollection')) {
    return await handleOrganizationCollectionQuery(query, variables);
  } else if (queryLower.includes('newsupdatecollection')) {
    return await handleNewsUpdateCollectionQuery(query, variables);
  }

  throw new Error('Unsupported GraphQL query');
}

async function handleEventCollectionQuery(query: string, variables: any) {
  const events = await Event.find({ status: 'published' })
    .sort({ date: -1 })
    .limit(variables.limit || 10)
    .lean();

  return {
    data: {
      eventCollection: {
        items: events.map(event => ({
          title: event.title,
          slug: event.slug,
          date: event.date,
          endDate: event.endDate,
          location: event.location,
          image: event.image,
          description: event.description,
          content: event.content,
          organizer: event.organizer,
          vendors: event.vendors,
          status: event.status,
          featured: event.featured,
          tags: event.tags,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt
        }))
      }
    }
  };
}

async function handleVendorCollectionQuery(query: string, variables: any) {
  const vendors = await Vendor.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(variables.limit || 10)
    .lean();

  return {
    data: {
      vendorCollection: {
        items: vendors.map(vendor => ({
          vendorName: vendor.vendorName,
          slug: vendor.slug,
          stallNumber: vendor.stallNumber,
          productType: vendor.productType,
          description: vendor.description,
          contactInfo: vendor.contactInfo,
          location: vendor.location,
          image: vendor.image,
          gallery: vendor.gallery,
          products: vendor.products,
          rating: vendor.rating,
          status: vendor.status,
          verified: vendor.verified,
          socialMedia: vendor.socialMedia,
          createdAt: vendor.createdAt,
          updatedAt: vendor.updatedAt
        }))
      }
    }
  };
}

async function handleProductCollectionQuery(query: string, variables: any) {
  const products = await Product.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(variables.limit || 10)
    .lean();

  return {
    data: {
      productCollection: {
        items: products.map(product => ({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          currency: product.currency,
          unit: product.unit,
          category: product.category,
          subcategory: product.subcategory,
          image: product.image,
          gallery: product.gallery,
          vendor: product.vendor,
          availability: product.availability,
          quality: product.quality,
          organic: product.organic,
          certifications: product.certifications,
          tags: product.tags,
          status: product.status,
          featured: product.featured,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }))
      }
    }
  };
}

async function handleOrganizationCollectionQuery(query: string, variables: any) {
  const organizations = await Organization.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(variables.limit || 10)
    .lean();

  return {
    data: {
      organizationCollection: {
        items: organizations.map(org => ({
          name: org.name,
          slug: org.slug,
          description: org.description,
          type: org.type,
          address: org.address,
          contactInfo: org.contactInfo,
          logo: org.logo,
          image: org.image,
          socialMedia: org.socialMedia,
          services: org.services,
          certifications: org.certifications,
          status: org.status,
          verified: org.verified,
          createdAt: org.createdAt,
          updatedAt: org.updatedAt
        }))
      }
    }
  };
}

async function handleNewsUpdateCollectionQuery(query: string, variables: any) {
  const newsUpdates = await NewsUpdate.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(variables.limit || 10)
    .lean();

  return {
    data: {
      newsUpdateCollection: {
        items: newsUpdates.map(news => ({
          title: news.title,
          slug: news.slug,
          excerpt: news.excerpt,
          content: news.content,
          author: news.author,
          category: news.category,
          tags: news.tags,
          image: news.image,
          gallery: news.gallery,
          status: news.status,
          featured: news.featured,
          publishedAt: news.publishedAt,
          views: news.views,
          createdAt: news.createdAt,
          updatedAt: news.updatedAt
        }))
      }
    }
  };
}
