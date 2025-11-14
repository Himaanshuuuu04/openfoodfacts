// Enhanced in-memory cache with TTL (Time To Live) and better browser integration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  etag?: string;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>>;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.cache = new Map();
    // Auto cleanup expired entries every 5 minutes
    if (typeof window !== "undefined") {
      this.cleanupInterval = setInterval(() => {
        this.clearExpired();
      }, 5 * 60 * 1000);
    }
  }

  // Set cache with custom TTL (in milliseconds)
  set<T>(
    key: string,
    data: T,
    ttl: number = 5 * 60 * 1000,
    etag?: string
  ): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      etag,
    });

    // Store in sessionStorage for persistence across page reloads
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        sessionStorage.setItem(
          `cache_${key}`,
          JSON.stringify({
            data,
            timestamp: Date.now(),
            ttl,
            etag,
          })
        );
      } catch (e) {
        // Ignore quota exceeded errors
        console.warn("SessionStorage quota exceeded");
      }
    }
  }

  // Get cached data if not expired
  get<T>(key: string): T | null {
    let entry = this.cache.get(key);

    // Try to get from sessionStorage if not in memory
    if (!entry && typeof window !== "undefined" && window.sessionStorage) {
      try {
        const stored = sessionStorage.getItem(`cache_${key}`);
        if (stored) {
          entry = JSON.parse(stored);
          if (entry) {
            this.cache.set(key, entry); // Restore to memory cache
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.removeItem(`cache_${key}`);
      }
      return null;
    }

    return entry.data as T;
  }

  // Check if cache has valid (non-expired) data
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Clear specific cache entry
  delete(key: string): void {
    this.cache.delete(key);
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.removeItem(`cache_${key}`);
    }
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    if (typeof window !== "undefined" && window.sessionStorage) {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith("cache_")) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }

  // Clear expired entries
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.delete(key);
      }
    }
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // Destroy cache and cleanup
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Export singleton instance
export const apiCache = new ApiCache();

// Cache TTL constants (in milliseconds) - aligned with backend
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes (products, search)
  LONG: 15 * 60 * 1000, // 15 minutes (product details)
  VERY_LONG: 60 * 60 * 1000, // 1 hour (categories)
};

// Helper function to create cache key
export const createCacheKey = (prefix: string, ...params: any[]): string => {
  return `${prefix}:${params.map((p) => String(p)).join(":")}`;
};

// Helper to invalidate cache by pattern
export const invalidateCachePattern = (pattern: string): void => {
  const stats = apiCache.getStats();
  stats.keys.forEach((key) => {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  });
};

// Cleanup on unmount (for SPA)
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    // Keep sessionStorage but clear interval
    if ((apiCache as any).cleanupInterval) {
      clearInterval((apiCache as any).cleanupInterval);
    }
  });
}
