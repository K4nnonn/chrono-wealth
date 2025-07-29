// Caching utilities for performance optimization

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 100;

  set<T>(key: string, data: T, ttlMs = 300000): void { // 5 minutes default
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton cache instance
export const memoryCache = new MemoryCache();

// Cache-aware data fetching
export const withCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs = 300000
): Promise<T> => {
  // Try cache first
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch and cache
  const data = await fetchFn();
  memoryCache.set(key, data, ttlMs);
  return data;
};

// Local storage cache with compression
export const persistentCache = {
  set: (key: string, data: any, ttlMs = 86400000): void => { // 24 hours default
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl: ttlMs,
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache to localStorage:', error);
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();

      if (now - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to read from localStorage cache:', error);
      return null;
    }
  },

  delete: (key: string): void => {
    localStorage.removeItem(`cache_${key}`);
  },

  clear: (): void => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('cache_'))
      .forEach(key => localStorage.removeItem(key));
  },
};

// Automatic cache cleanup
setInterval(() => {
  memoryCache.cleanup();
}, 300000); // Clean up every 5 minutes