# Headless CMS Implementation for Kisan Mela

## Overview

This document outlines the comprehensive Headless CMS implementation for Kisan Mela, providing a custom solution that offers the same functionality as Strapi v5 while being compatible with our current Node.js v23.7.0 environment.

## Architecture

### Core Components

1. **CMS Models** (`/lib/models/CMSModels.js`)
   - Event, Vendor, Product, Organization, NewsUpdate schemas
   - Comprehensive field definitions with validation
   - Indexes for optimal performance
   - Relationship management

2. **REST API Endpoints** (`/api/cms/`)
   - Full CRUD operations for all content types
   - Strapi-compatible API structure
   - Advanced filtering and pagination
   - Population of related data

3. **GraphQL API** (`/api/cms/graphql/`)
   - GraphQL query support
   - Contentful-compatible query structure
   - Efficient data fetching

4. **Caching Service** (`/lib/services/CacheService.ts`)
   - In-memory caching with TTL
   - Pattern-based cache invalidation
   - Performance optimization

5. **Webhook System** (`/api/cms/webhook/`)
   - Real-time data synchronization
   - External CMS integration support
   - Event-driven updates

## Content Models

### Event Model
```javascript
{
  title: String (required),
  slug: String (required, unique),
  description: String (required),
  content: String (required),
  date: Date (required),
  endDate: Date (required),
  location: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: { lat: Number, lng: Number }
  },
  image: { url: String, alt: String },
  organizer: ObjectId (ref: Organization),
  vendors: [ObjectId] (ref: Vendor),
  status: 'draft' | 'published' | 'archived',
  featured: Boolean,
  tags: [String],
  seo: { title: String, description: String, keywords: [String] }
}
```

### Vendor Model
```javascript
{
  vendorName: String (required),
  slug: String (required, unique),
  stallNumber: String (required),
  productType: String (required),
  description: String (required),
  contactInfo: {
    name: String,
    phone: String,
    email: String,
    website: String
  },
  location: { address: String, city: String, state: String, pincode: String },
  image: { url: String, alt: String },
  products: [ObjectId] (ref: Product),
  rating: { average: Number, count: Number },
  status: 'active' | 'inactive' | 'pending',
  verified: Boolean,
  socialMedia: { facebook: String, instagram: String, twitter: String, youtube: String }
}
```

### Product Model
```javascript
{
  name: String (required),
  slug: String (required, unique),
  description: String (required),
  price: Number (required),
  currency: String (default: 'INR'),
  unit: String (required),
  category: String (required),
  subcategory: String,
  image: { url: String, alt: String },
  vendor: ObjectId (ref: Vendor, required),
  availability: {
    inStock: Boolean,
    quantity: Number,
    minOrder: Number
  },
  quality: 'premium' | 'standard' | 'budget',
  organic: Boolean,
  certifications: [String],
  tags: [String],
  status: 'active' | 'inactive' | 'out_of_stock',
  featured: Boolean,
  seo: { title: String, description: String, keywords: [String] }
}
```

## API Endpoints

### REST API

#### Events
- `GET /api/cms/events` - List events with filtering and pagination
- `POST /api/cms/events` - Create new event
- `GET /api/cms/events/[id]` - Get single event
- `PUT /api/cms/events/[id]` - Update event
- `DELETE /api/cms/events/[id]` - Delete event

#### Vendors
- `GET /api/cms/vendors` - List vendors with filtering and pagination
- `POST /api/cms/vendors` - Create new vendor
- `GET /api/cms/vendors/[id]` - Get single vendor
- `PUT /api/cms/vendors/[id]` - Update vendor
- `DELETE /api/cms/vendors/[id]` - Delete vendor

#### Products
- `GET /api/cms/products` - List products with filtering and pagination
- `POST /api/cms/products` - Create new product
- `GET /api/cms/products/[id]` - Get single product
- `PUT /api/cms/products/[id]` - Update product
- `DELETE /api/cms/products/[id]` - Delete product

### GraphQL API

#### Endpoint
- `POST /api/cms/graphql` - GraphQL queries

#### Example Queries
```graphql
query GetEvents {
  eventCollection {
    items {
      title
      date
      location {
        name
        address
        city
        state
      }
      image {
        url
        alt
      }
      organizer {
        name
      }
    }
  }
}

query GetProducts {
  productCollection {
    items {
      name
      price
      currency
      unit
      category
      image {
        url
      }
      vendor {
        vendorName
        stallNumber
      }
    }
  }
}
```

## Schema.org Structured Data

### Event Schema
```javascript
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.title,
  "description": event.description,
  "startDate": event.date,
  "endDate": event.endDate,
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": event.location.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": event.location.address,
      "addressLocality": event.location.city,
      "addressRegion": event.location.state,
      "postalCode": event.location.pincode,
      "addressCountry": "IN"
    }
  },
  "image": event.image.url,
  "organizer": {
    "@type": "Organization",
    "name": event.organizer.name
  }
}
```

### Product Schema
```javascript
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image.url,
  "category": product.category,
  "brand": {
    "@type": "Brand",
    "name": product.vendor.vendorName
  },
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": product.currency,
    "availability": product.availability.inStock 
      ? "https://schema.org/InStock" 
      : "https://schema.org/OutOfStock",
    "seller": {
      "@type": "Organization",
      "name": product.vendor.vendorName
    }
  }
}
```

## Google Maps Integration

### Components
- `MelaMap` - Interactive map component with event locations
- `WeatherWidget` - Real-time weather information
- `DirectionsService` - Route planning and navigation

### Features
- Event location markers
- User location detection
- Directions and routing
- Weather overlay
- Responsive design

### Environment Variables
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

## Caching Strategy

### Cache Keys
- `events:{filters}` - Cached event lists
- `event:{id}` - Individual event cache
- `vendors:{filters}` - Cached vendor lists
- `vendor:{id}` - Individual vendor cache
- `products:{filters}` - Cached product lists
- `product:{id}` - Individual product cache

### Cache TTL
- Event lists: 5 minutes
- Individual events: 10 minutes
- Vendor lists: 5 minutes
- Individual vendors: 10 minutes
- Product lists: 5 minutes
- Individual products: 10 minutes

### Cache Invalidation
- Automatic invalidation on content updates
- Pattern-based invalidation for related content
- Manual cache clearing for maintenance

## Webhook System

### Supported Events
- `create` - Content creation
- `update` - Content updates
- `delete` - Content deletion
- `publish` - Content publishing
- `unpublish` - Content unpublishing
- `activate` - Content activation
- `deactivate` - Content deactivation
- `verify` - Content verification
- `feature` - Content featuring
- `unfeature` - Content unfeaturing

### Webhook Payload
```javascript
{
  "event": "create|update|delete|publish|...",
  "type": "event|vendor|product|organization|news",
  "data": {
    "id": "content_id",
    // ... other content fields
  }
}
```

## Frontend Integration

### Events Page (`/events`)
- Dynamic event listing with filtering
- Interactive map integration
- Weather information
- Schema.org structured data
- Responsive design

### CMS Admin (`/admin/cms`)
- Content management interface
- CRUD operations for all content types
- Status management
- Bulk operations
- Real-time updates

### API Usage Examples

#### Fetching Events
```javascript
// REST API
const response = await fetch('/api/cms/events?populate=*&filters[status]=published');
const data = await response.json();

// GraphQL API
const query = `
  query GetEvents {
    eventCollection {
      items {
        title
        date
        location {
          name
          city
        }
      }
    }
  }
`;
const response = await fetch('/api/cms/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
});
```

#### Creating Content
```javascript
const newEvent = {
  data: {
    title: "Agricultural Fair 2024",
    description: "Annual agricultural fair showcasing local produce",
    date: "2024-03-15T10:00:00Z",
    location: {
      name: "Community Center",
      address: "123 Main Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001"
    },
    image: {
      url: "https://example.com/image.jpg",
      alt: "Agricultural Fair"
    },
    status: "published"
  }
};

const response = await fetch('/api/cms/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newEvent)
});
```

## Performance Optimizations

### Database Indexes
- Slug fields for fast lookups
- Status fields for filtering
- Date fields for sorting
- Location fields for geographic queries

### Caching Strategy
- In-memory caching for frequently accessed data
- TTL-based cache expiration
- Pattern-based cache invalidation
- Lazy loading for large datasets

### API Optimizations
- Pagination for large result sets
- Field selection to reduce payload size
- Compression for large responses
- Rate limiting for API protection

## Security Considerations

### Authentication
- JWT-based authentication for admin access
- Role-based access control
- API key validation for webhooks

### Data Validation
- Input sanitization
- Schema validation
- SQL injection prevention
- XSS protection

### Rate Limiting
- API rate limiting
- Webhook rate limiting
- DDoS protection

## Deployment

### Environment Setup
```bash
# Required environment variables
MONGODB_URI=mongodb://localhost:27017/kisanmela
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
OPENWEATHER_API_KEY=your_api_key
WEBHOOK_SECRET=your_webhook_secret
```

### Production Considerations
- Use Redis for caching instead of in-memory
- Implement proper webhook signature verification
- Set up monitoring and logging
- Configure CDN for static assets
- Implement backup strategies

## Monitoring and Analytics

### Key Metrics
- API response times
- Cache hit rates
- Database query performance
- Webhook delivery success rates
- User engagement metrics

### Logging
- API request/response logging
- Error tracking and monitoring
- Performance metrics collection
- User activity tracking

## Future Enhancements

### Planned Features
- Multi-language content support
- Advanced search functionality
- Content versioning
- Workflow management
- Advanced analytics dashboard
- Mobile app integration
- Real-time notifications
- Content scheduling

### Scalability Considerations
- Database sharding
- Microservices architecture
- CDN integration
- Load balancing
- Auto-scaling capabilities

## Conclusion

This Headless CMS implementation provides a robust, scalable solution for managing agricultural content with advanced features including:

- **Content Management**: Full CRUD operations for events, vendors, products, and organizations
- **API Flexibility**: Both REST and GraphQL APIs for different use cases
- **Performance**: Comprehensive caching strategy and database optimization
- **SEO**: Schema.org structured data for better search engine visibility
- **Integration**: Google Maps and weather APIs for enhanced user experience
- **Real-time Updates**: Webhook system for automatic content synchronization
- **Admin Interface**: User-friendly content management dashboard

The system is designed to be production-ready with proper security, monitoring, and scalability considerations.
