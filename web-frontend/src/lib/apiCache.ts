// API Cache utility for client-side caching
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache = new Map<string, CacheEntry>();

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}

const apiCache = new APICache();

export async function cachedFetch(
  url: string, 
  options: RequestInit = {}, 
  ttl: number = 300000
): Promise<any> {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the result
    apiCache.set(cacheKey, data, ttl);
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export { apiCache };