import { NextRequest, NextResponse } from 'next/server';

// Mock data for GraphQL responses
const mockEvents = [
  {
    title: 'Kisaan Mela 2024 - Spring Festival',
    slug: 'kisaan-mela-2024-spring-festival',
    date: new Date('2024-03-15').toISOString(),
    endDate: new Date('2024-03-17').toISOString(),
    location: {
      name: 'Delhi Agricultural Ground',
      address: 'Sector 15, Rohini',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110085'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
      alt: 'Kisaan Mela 2024'
    },
    description: 'Join us for the biggest agricultural festival of the year!',
    content: 'Experience the best of Indian agriculture with farmers, vendors, and agricultural experts from across the country.',
    organizer: {
      name: 'Ministry of Agriculture',
      type: 'government'
    },
    vendors: [
      { vendorName: 'Green Valley Farms', productType: 'organic' },
      { vendorName: 'Fresh Harvest Co.', productType: 'vegetables' }
    ],
    status: 'published',
    featured: true,
    tags: ['agriculture', 'festival', 'spring', 'farmers'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockVendors = [
  {
    vendorName: 'Green Valley Farms',
    slug: 'green-valley-farms',
    stallNumber: 'A-001',
    productType: 'organic',
    description: 'Premium organic produce from certified farms',
    contactInfo: {
      name: 'Rajesh Kumar',
      phone: '+91-9999778321',
      email: 'rajesh@greenvalley.com'
    },
    location: {
      address: 'Farm Road 1',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      alt: 'Green Valley Farms'
    },
    gallery: [],
    products: [],
    rating: { average: 4.5, count: 12 },
    status: 'active',
    verified: true,
    socialMedia: {
      facebook: 'greenvalleyfarms',
      instagram: 'greenvalleyfarms'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockProducts = [
  {
    name: 'Organic Wheat',
    slug: 'organic-wheat',
    description: 'Premium quality organic wheat grains',
    price: 2500,
    currency: 'INR',
    unit: 'quintal',
    category: 'crops',
    subcategory: 'grains',
    image: {
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      alt: 'Organic Wheat'
    },
    gallery: [],
    vendor: { vendorName: 'Green Valley Farms' },
    availability: { inStock: true, quantity: 100, minOrder: 1 },
    quality: 'premium',
    organic: true,
    certifications: ['Organic Certification', 'ISO 22000'],
    tags: ['organic', 'wheat', 'premium'],
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockOrganizations = [
  {
    name: 'Ministry of Agriculture',
    slug: 'ministry-of-agriculture',
    description: 'Government organization promoting agricultural development',
    type: 'government',
    address: {
      street: 'Krishi Bhavan',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India'
    },
    contactInfo: {
      phone: '+91-11-2338xxxx',
      email: 'info@agriculture.gov.in',
      website: 'https://agriculture.gov.in',
      contactPerson: 'Agricultural Officer'
    },
    logo: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&h=200&fit=crop',
      alt: 'Ministry of Agriculture Logo'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
      alt: 'Ministry of Agriculture'
    },
    socialMedia: {
      facebook: 'ministryofagriculture',
      twitter: 'agriculturegov'
    },
    services: ['Agricultural Policy', 'Farmer Support', 'Research & Development'],
    certifications: ['ISO 9001', 'Government Certified'],
    status: 'active',
    verified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockNewsUpdates = [
  {
    title: 'New Agricultural Policy Announced',
    slug: 'new-agricultural-policy-announced',
    excerpt: 'Government announces new policies to support farmers and agricultural development',
    content: 'The government has announced comprehensive new policies aimed at supporting farmers and promoting sustainable agricultural practices across the country.',
    author: {
      name: 'Agricultural Reporter',
      email: 'reporter@agriculture.gov.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    category: 'policy',
    tags: ['policy', 'government', 'agriculture'],
    image: {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      alt: 'Agricultural Policy',
      caption: 'New agricultural policy announcement'
    },
    gallery: [],
    status: 'published',
    featured: true,
    publishedAt: new Date().toISOString(),
    views: 1250,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Simple GraphQL resolver for our CMS
export async function POST(request: NextRequest) {
  try {
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
  const limit = variables.limit || 10;
  const events = mockEvents.slice(0, limit);

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
  const limit = variables.limit || 10;
  const vendors = mockVendors.slice(0, limit);

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
  const limit = variables.limit || 10;
  const products = mockProducts.slice(0, limit);

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
  const limit = variables.limit || 10;
  const organizations = mockOrganizations.slice(0, limit);

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
  const limit = variables.limit || 10;
  const newsUpdates = mockNewsUpdates.slice(0, limit);

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
