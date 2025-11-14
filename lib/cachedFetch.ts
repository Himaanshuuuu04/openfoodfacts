import { apiCache, CACHE_TTL, createCacheKey } from "./cache";
import { cacheLogger } from "./cacheLogger";

interface FetchOptions extends RequestInit {
  cacheTTL?: number;
  cacheKey?: string;
  bypassCache?: boolean;
}

/**
 * Enhanced fetch wrapper with multi-layer caching
 * - Checks frontend cache first
 * - Respects backend Cache-Control headers
 * - Stores responses in frontend cache
 */
export async function cachedFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const startTime = performance.now();
  const { cacheTTL, cacheKey, bypassCache = false, ...fetchOptions } = options;

  // Generate cache key if not provided
  const key =
    cacheKey || createCacheKey("fetch", url, JSON.stringify(fetchOptions));

  // Check frontend cache first (unless bypassed)
  if (!bypassCache) {
    const cached = apiCache.get<T>(key);
    if (cached !== null) {
      const duration = performance.now() - startTime;
      cacheLogger.logHit(url, duration);
      return cached;
    }
  }

  // Fetch from backend
  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const duration = performance.now() - startTime;
  cacheLogger.logMiss(url, duration);

  // Determine cache TTL
  let ttl = cacheTTL || CACHE_TTL.MEDIUM;

  // Parse Cache-Control header if present
  const cacheControl = response.headers.get("Cache-Control");
  if (cacheControl) {
    const maxAge = cacheControl.match(/max-age=(\d+)/);
    const sMaxAge = cacheControl.match(/s-maxage=(\d+)/);

    if (sMaxAge) {
      ttl = parseInt(sMaxAge[1]) * 1000; // Convert to milliseconds
    } else if (maxAge) {
      ttl = parseInt(maxAge[1]) * 1000;
    }
  }

  // Get ETag for cache validation (future enhancement)
  const etag = response.headers.get("ETag") || undefined;

  // Store in frontend cache
  apiCache.set(key, data, ttl, etag);

  return data;
}

/**
 * Prefetch data and store in cache
 */
export async function prefetch(
  url: string,
  options: FetchOptions = {}
): Promise<void> {
  try {
    await cachedFetch(url, options);
  } catch (error) {
    console.warn(`Prefetch failed for ${url}:`, error);
  }
}

/**
 * Clear cache for specific URL pattern
 */
export function clearUrlCache(urlPattern: string): void {
  const key = createCacheKey("fetch", urlPattern);
  apiCache.delete(key);
}

/**
 * Revalidate cached data by refetching
 */
export async function revalidate<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  return cachedFetch<T>(url, { ...options, bypassCache: true });
}
