import { connectDB } from '@/lib/mongodb';
import { Event, Vendor, Product, Organization, NewsUpdate } from '@/lib/models/CMSModels';

// Simple in-memory cache (in production, use Redis)
class CacheService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Pattern-based cache invalidation
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

const cacheService = new CacheService();

// Cache key generators
export const CacheKeys = {
  events: (filters?: any) => `events:${JSON.stringify(filters || {})}`,
  event: (id: string) => `event:${id}`,
  vendors: (filters?: any) => `vendors:${JSON.stringify(filters || {})}`,
  vendor: (id: string) => `vendor:${id}`,
  products: (filters?: any) => `products:${JSON.stringify(filters || {})}`,
  product: (id: string) => `product:${id}`,
  organizations: (filters?: any) => `organizations:${JSON.stringify(filters || {})}`,
  organization: (id: string) => `organization:${id}`,
  news: (filters?: any) => `news:${JSON.stringify(filters || {})}`,
  newsItem: (id: string) => `news:${id}`,
};

// Cached data fetchers
export class CachedDataService {
  static async getEvents(filters: any = {}, populate: string = '*') {
    const cacheKey = CacheKeys.events(filters);
    let data = cacheService.get(cacheKey);

    if (!data) {
      await connectDB();
      
      let query = Event.find({ status: 'published' });
      
      // Apply filters
      if (filters.city) {
        query = query.where('location.city', new RegExp(filters.city, 'i'));
      }
      if (filters.state) {
        query = query.where('location.state', new RegExp(filters.state, 'i'));
      }
      if (filters.featured) {
        query = query.where('featured', true);
      }
      if (filters.upcoming) {
        query = query.where('date').gte(new Date());
      }
      if (filters.date) {
        if (filters.date.$gte) {
          query = query.where('date').gte(new Date(filters.date.$gte));
        }
        if (filters.date.$lte) {
          query = query.where('date').lte(new Date(filters.date.$lte));
        }
      }

      query = query.sort({ date: 1 }).limit(filters.limit || 50);
      
      data = await query.lean();
      
      // Cache for 5 minutes
      cacheService.set(cacheKey, data, 5 * 60 * 1000);
    }

    return data;
  }

  static async getEvent(id: string, populate: string = '*') {
    const cacheKey = CacheKeys.event(id);
    let data = cacheService.get(cacheKey);

    if (!data) {
      await connectDB();
      data = await Event.findById(id).lean();
      
      if (data) {
        // Cache for 10 minutes
        cacheService.set(cacheKey, data, 10 * 60 * 1000);
      }
    }

    return data;
  }

  static async getVendors(filters: any = {}, populate: string = '*') {
    const cacheKey = CacheKeys.vendors(filters);
    let data = cacheService.get(cacheKey);

    if (!data) {
      await connectDB();
      
      let query = Vendor.find({ status: 'active' });
      
      // Apply filters
      if (filters.productType) {
        query = query.where('productType', filters.productType);
      }
      if (filters.verified !== undefined) {
        query = query.where('verified', filters.verified);
      }
      if (filters.city) {
        query = query.where('location.city', new RegExp(filters.city, 'i'));
      }

      query = query.sort({ createdAt: -1 }).limit(filters.limit || 50);
      
      data = await query.lean();
      
      // Cache for 5 minutes
      cacheService.set(cacheKey, data, 5 * 60 * 1000);
    }

    return data;
  }

  static async getVendor(id: string, populate: string = '*') {
    const cacheKey = CacheKeys.vendor(id);
    let data = cacheService.get(cacheKey);

    if (!data) {
      await connectDB();
      data = await Vendor.findById(id).lean();
      
      if (data) {
        // Cache for 10 minutes
        cacheService.set(cacheKey, data, 10 * 60 * 1000);
      }
    }

    return data;
  }

  static async getProducts(filters: any = {}, populate: string = '*') {
    const cacheKey = CacheKeys.products(filters);
    let data = cacheService.get(cacheKey);

    if (!data) {
      await connectDB();
      
      let query = Product.find({ status: 'active' });
      
      // Apply filters
      if (filters.category) {
        query = query.where('category', filters.category);
      }
      if (filters.organic !== undefined) {
        query = query.where('organic', filters.organic);
      }
      if (filters.featured !== undefined) {
        query = query.where('featured', filters.featured);
      }
      if (filters.price) {
        if (filters.price.$gte) {
          query = query.where('price').gte(filters.price.$gte);
        }
        if (filters.price.$lte) {
          query = query.where('price').lte(filters.price.$lte);
        }
      }
      if (filters.vendor) {
        query = query.where('vendor', filters.vendor);
      }

      query = query.sort({ createdAt: -1 }).limit(filters.limit || 50);
      
      data = await query.lean();
      
      // Cache for 5 minutes
      cacheService.set(cacheKey, data, 5 * 60 * 1000);
    }

    return data;
  }

  static async getProduct(id: string, populate: string = '*') {
    const cacheKey = CacheKeys.product(id);
    let data = cacheService.get(cacheKey);

    if (!data) {
      await connectDB();
      data = await Product.findById(id).lean();
      
      if (data) {
        // Cache for 10 minutes
        cacheService.set(cacheKey, data, 10 * 60 * 1000);
      }
    }

    return data;
  }

  static async getOrganizations(filters: any = {}, populate: string = '*') {
    const cacheKey = CacheKeys.organizations(filters);
    let data = cacheService.get(cacheKey);

    if (!data) {
      await connectDB();
      
      let query = Organization.find({ status: 'active' });
      
      // Apply filters
      if (filters.type) {
        query = query.where('type', filters.type);
      }
      if (filters.verified !== undefined) {
        query = query.where('verified', filters.verified);
      }

      query = query.sort({ createdAt: -1 }).limit(filters.limit || 50);
      
      data = await query.lean();
      
      // Cache for 10 minutes
      cacheService.set(cacheKey, data, 10 * 60 * 1000);
    }

    return data;
  }

  static async getNews(filters: any = {}, populate: string = '*') {
    const cacheKey = CacheKeys.news(filters);
    let data = cacheService.get(cacheKey);

    if (!data) {
      await connectDB();
      
      let query = NewsUpdate.find({ status: 'published' });
      
      // Apply filters
      if (filters.category) {
        query = query.where('category', filters.category);
      }
      if (filters.featured !== undefined) {
        query = query.where('featured', filters.featured);
      }

      query = query.sort({ publishedAt: -1 }).limit(filters.limit || 20);
      
      data = await query.lean();
      
      // Cache for 5 minutes
      cacheService.set(cacheKey, data, 5 * 60 * 1000);
    }

    return data;
  }

  // Cache invalidation methods
  static invalidateEventCache(eventId?: string) {
    if (eventId) {
      cacheService.delete(CacheKeys.event(eventId));
    }
    cacheService.invalidatePattern('^events:');
  }

  static invalidateVendorCache(vendorId?: string) {
    if (vendorId) {
      cacheService.delete(CacheKeys.vendor(vendorId));
    }
    cacheService.invalidatePattern('^vendors:');
  }

  static invalidateProductCache(productId?: string) {
    if (productId) {
      cacheService.delete(CacheKeys.product(productId));
    }
    cacheService.invalidatePattern('^products:');
  }

  static invalidateOrganizationCache(orgId?: string) {
    if (orgId) {
      cacheService.delete(CacheKeys.organization(orgId));
    }
    cacheService.invalidatePattern('^organizations:');
  }

  static invalidateNewsCache(newsId?: string) {
    if (newsId) {
      cacheService.delete(CacheKeys.newsItem(newsId));
    }
    cacheService.invalidatePattern('^news:');
  }

  // Clear all cache
  static clearAllCache() {
    cacheService.clear();
  }
}

export default cacheService;
