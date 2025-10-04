# Duplicate API Calls Solution

## Problem
The APIs `/api/me` and `/api/farmers-market/farmers` were being called twice, causing unnecessary network requests and potential performance issues.

## Root Causes

### 1. React Strict Mode (Development)
React's Strict Mode intentionally double-invokes effects in development to help detect side effects. This is normal behavior in development but can cause confusion.

### 2. Multiple Components Making Same Calls
- **AuthProvider**: Makes `/api/me` call in `checkAuth()` on component mount
- **Profile Page**: Makes `/api/me` call in `fetchProfile()` 
- **FarmersCRUD**: Makes `/api/farmers-market/farmers` call in `loadFarmers()`

### 3. Component Re-mounting
Components might re-mount due to navigation or state changes, triggering duplicate API calls.

## Solution: API Caching System

### Implementation
Created a comprehensive API caching system (`/web-frontend/src/lib/apiCache.ts`) that:

1. **Prevents Duplicate Requests**: If a request is already pending, subsequent calls wait for the same request
2. **Caches Responses**: Stores API responses with configurable TTL (Time To Live)
3. **Automatic Expiration**: Cache entries expire automatically based on TTL
4. **Cache Invalidation**: Manual cache clearing for data updates

### Key Features

#### 1. Request Deduplication
```typescript
// If request is already pending, wait for the same request
if (this.pendingRequests.has(key)) {
  return this.pendingRequests.get(key)!;
}
```

#### 2. Response Caching
```typescript
// Cache the result with TTL
this.cache.set(key, {
  data,
  timestamp: Date.now(),
  ttl: ttl || this.defaultTTL
});
```

#### 3. Cache Invalidation
```typescript
// Clear cache after data updates
apiCache.clear('/api/farmers-market/farmers:{}');
```

### Usage Examples

#### Before (Duplicate Calls)
```typescript
// AuthProvider.tsx
const response = await fetch('/api/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Profile page also calls /api/me
const response = await fetch('/api/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

#### After (Cached Calls)
```typescript
// AuthProvider.tsx - Cache for 30 seconds
const data = await cachedFetch('/api/me', {
  headers: { 'Authorization': `Bearer ${token}` }
}, 30000);

// Profile page - Uses cached result if within 30 seconds
const data = await cachedFetch('/api/me', {
  headers: { 'Authorization': `Bearer ${token}` }
}, 30000);
```

### Cache Configuration

| API Endpoint | TTL | Reason |
|-------------|-----|--------|
| `/api/me` | 30 seconds | User data changes infrequently |
| `/api/farmers-market/farmers` | 60 seconds | Farmer list changes moderately |

### Cache Invalidation Strategy

1. **After Create/Update/Delete**: Clear relevant cache entries
2. **On Logout**: Clear all user-related cache
3. **On Login**: Clear all cache to ensure fresh data

## Benefits

### 1. Performance Improvement
- **Reduced Network Requests**: Eliminates duplicate API calls
- **Faster Response Times**: Cached responses return immediately
- **Lower Server Load**: Fewer requests to backend

### 2. Better User Experience
- **Consistent Data**: All components see the same cached data
- **Reduced Loading States**: Cached data loads instantly
- **Smoother Navigation**: No unnecessary API calls on page changes

### 3. Development Benefits
- **Cleaner Network Tab**: No more duplicate requests in dev tools
- **Easier Debugging**: Clear cache behavior
- **Better Testing**: Predictable API call patterns

## Files Modified

1. **`/web-frontend/src/lib/apiCache.ts`** - New caching system
2. **`/web-frontend/src/components/providers/AuthProvider.tsx`** - Use cached `/api/me`
3. **`/web-frontend/src/components/FarmersCRUD.tsx`** - Use cached farmers API + invalidation
4. **`/web-frontend/src/app/profile/page.tsx`** - Use cached `/api/me`

## Testing

### Before Fix
```bash
# Multiple requests visible in Network tab
GET /api/me (200 OK)
GET /api/me (200 OK)  # Duplicate!
GET /api/farmers-market/farmers (200 OK)
GET /api/farmers-market/farmers (200 OK)  # Duplicate!
```

### After Fix
```bash
# Single request per unique API call
GET /api/me (200 OK)
GET /api/farmers-market/farmers (200 OK)
# Subsequent calls within TTL use cache
```

## Monitoring

The cache system provides stats for monitoring:

```typescript
const stats = apiCache.getStats();
console.log({
  cacheSize: stats.cacheSize,
  pendingRequests: stats.pendingRequests,
  keys: stats.keys
});
```

## Future Enhancements

1. **Persistent Cache**: Store cache in localStorage for page refreshes
2. **Background Refresh**: Update cache in background before expiration
3. **Cache Analytics**: Track cache hit/miss ratios
4. **Selective Invalidation**: More granular cache clearing strategies
