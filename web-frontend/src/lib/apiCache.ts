// Simple API cache to prevent duplicate calls
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class APICache {
  private cache = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, Promise<any>>();

  // Default TTL: 30 seconds
  private defaultTTL = 30 * 1000;

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  async get<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Check cache
    const cached = this.cache.get(key);
    if (cached && !this.isExpired(cached)) {
      return cached.data;
    }

    // Create new request
    const request = fetcher().then((data) => {
      // Cache the result
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL
      });

      // Remove from pending requests
      this.pendingRequests.delete(key);

      return data;
    }).catch((error) => {
      // Remove from pending requests on error
      this.pendingRequests.delete(key);
      throw error;
    });

    // Store pending request
    this.pendingRequests.set(key, request);

    return request;
  }

  // Clear cache for a specific key
  clear(key: string): void {
    this.cache.delete(key);
    this.pendingRequests.delete(key);
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  // Get cache stats
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const apiCache = new APICache();

// Helper function for API calls with caching
export async function cachedFetch<T>(
  url: string, 
  options?: RequestInit, 
  ttl?: number
): Promise<T> {
  const cacheKey = `${url}:${JSON.stringify(options || {})}`;
  
  return apiCache.get(
    cacheKey,
    async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    ttl
  );
}
