/**
 * Enterprise Caching System
 * Multi-layer caching with TTL, compression, and invalidation strategies
 */

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  compressed?: boolean;
  version: string;
  tags: string[];
}

export interface CacheConfig {
  maxSize: number;
  defaultTtl: number;
  compressionThreshold: number;
  enableCompression: boolean;
  persistToLocalStorage: boolean;
}

export class EnterpriseCache {
  private memoryCache = new Map<string, CacheEntry>();
  private accessOrder = new Map<string, number>();
  private accessCounter = 0;
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTtl: 300000, // 5 minutes
      compressionThreshold: 1024, // 1KB
      enableCompression: true,
      persistToLocalStorage: true,
      ...config
    };

    this.loadFromPersistentStorage();
    this.setupCleanupInterval();
  }

  async set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      tags?: string[];
      persist?: boolean;
      version?: string;
    } = {}
  ): Promise<void> {
    const ttl = options.ttl || this.config.defaultTtl;
    const tags = options.tags || [];
    const version = options.version || '1.0.0';
    
    let processedData = data;
    let compressed = false;

    // Compress large data if enabled
    if (this.config.enableCompression) {
      const serialized = JSON.stringify(data);
      if (serialized.length > this.config.compressionThreshold) {
        processedData = await this.compress(serialized) as T;
        compressed = true;
      }
    }

    const entry: CacheEntry<T> = {
      data: processedData,
      timestamp: Date.now(),
      ttl,
      compressed,
      version,
      tags
    };

    // Evict if at capacity
    if (this.memoryCache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    this.memoryCache.set(key, entry);
    this.updateAccessOrder(key);

    // Persist to localStorage if enabled
    if (this.config.persistToLocalStorage && (options.persist !== false)) {
      this.persistEntry(key, entry);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    let entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;

    // If not in memory, try to load from persistent storage
    if (!entry && this.config.persistToLocalStorage) {
      const loadedEntry = await this.loadEntry<T>(key);
      if (loadedEntry) {
        entry = loadedEntry;
        this.memoryCache.set(key, entry);
      }
    }

    if (!entry) {
      return null;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.delete(key);
      return null;
    }

    this.updateAccessOrder(key);

    // Decompress if needed
    if (entry.compressed) {
      const decompressed = await this.decompress(entry.data as string);
      return JSON.parse(decompressed);
    }

    return entry.data;
  }

  delete(key: string): boolean {
    const deleted = this.memoryCache.delete(key);
    this.accessOrder.delete(key);
    
    if (this.config.persistToLocalStorage) {
      this.removePersistentEntry(key);
    }
    
    return deleted;
  }

  clear(): void {
    this.memoryCache.clear();
    this.accessOrder.clear();
    
    if (this.config.persistToLocalStorage) {
      this.clearPersistentStorage();
    }
  }

  invalidateByTag(tag: string): number {
    let invalidated = 0;
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.tags.includes(tag)) {
        this.delete(key);
        invalidated++;
      }
    }
    
    return invalidated;
  }

  invalidateByPattern(pattern: RegExp): number {
    let invalidated = 0;
    
    for (const key of this.memoryCache.keys()) {
      if (pattern.test(key)) {
        this.delete(key);
        invalidated++;
      }
    }
    
    return invalidated;
  }

  // Cache statistics
  getStats() {
    const entries = Array.from(this.memoryCache.values());
    const now = Date.now();
    
    return {
      size: this.memoryCache.size,
      maxSize: this.config.maxSize,
      utilization: (this.memoryCache.size / this.config.maxSize) * 100,
      expired: entries.filter(entry => this.isExpired(entry)).length,
      compressed: entries.filter(entry => entry.compressed).length,
      averageAge: entries.reduce((sum, entry) => sum + (now - entry.timestamp), 0) / entries.length || 0,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  // Utility methods for common caching patterns
  async memoize<T>(
    fn: (...args: any[]) => Promise<T>,
    keyGenerator: (...args: any[]) => string,
    options?: { ttl?: number; tags?: string[] }
  ) {
    return async (...args: any[]): Promise<T> => {
      const key = keyGenerator(...args);
      
      let result = await this.get<T>(key);
      if (result !== null) {
        return result;
      }
      
      result = await fn(...args);
      await this.set(key, result, options);
      
      return result;
    };
  }

  // Batch operations
  async setMany<T>(entries: Array<{ key: string; data: T; options?: any }>): Promise<void> {
    const promises = entries.map(({ key, data, options }) => 
      this.set(key, data, options)
    );
    await Promise.all(promises);
  }

  async getMany<T>(keys: string[]): Promise<Record<string, T | null>> {
    const promises = keys.map(async key => ({
      key,
      value: await this.get<T>(key)
    }));
    
    const results = await Promise.all(promises);
    
    return results.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, T | null>);
  }

  // Private methods
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private updateAccessOrder(key: string): void {
    this.accessOrder.set(key, ++this.accessCounter);
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestAccess = Infinity;
    
    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private async compress(data: string): Promise<string> {
    // Simple compression simulation - in production, use a real compression library
    return btoa(data);
  }

  private async decompress(data: string): Promise<string> {
    // Simple decompression simulation
    return atob(data);
  }

  private persistEntry(key: string, entry: CacheEntry): void {
    try {
      const storageKey = `cache_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      // localStorage might be full or unavailable
      if (import.meta.env.DEV) {
        console.warn('Failed to persist cache entry:', error);
      }
    }
  }

  private async loadEntry<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const storageKey = `cache_${key}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const entry = JSON.parse(stored) as CacheEntry<T>;
        
        // Check if expired
        if (this.isExpired(entry)) {
          localStorage.removeItem(storageKey);
          return null;
        }
        
        return entry;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to load cache entry:', error);
      }
    }
    
    return null;
  }

  private removePersistentEntry(key: string): void {
    try {
      const storageKey = `cache_${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to remove persistent cache entry:', error);
      }
    }
  }

  private loadFromPersistentStorage(): void {
    if (!this.config.persistToLocalStorage) return;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          const cacheKey = key.substring(6);
          const stored = localStorage.getItem(key);
          
          if (stored) {
            const entry = JSON.parse(stored) as CacheEntry;
            
            if (!this.isExpired(entry)) {
              this.memoryCache.set(cacheKey, entry);
            } else {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to load from persistent storage:', error);
      }
    }
  }

  private clearPersistentStorage(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to clear persistent storage:', error);
      }
    }
  }

  private setupCleanupInterval(): void {
    // Run cleanup every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 300000);
  }

  private cleanup(): void {
    const keysToDelete: string[] = [];
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.delete(key));
  }

  private estimateMemoryUsage(): number {
    let size = 0;
    
    for (const entry of this.memoryCache.values()) {
      // Rough estimation of memory usage
      size += JSON.stringify(entry).length * 2; // UTF-16 encoding
    }
    
    return size;
  }
}

// Create and export default cache instance
export const enterpriseCache = new EnterpriseCache({
  maxSize: 500,
  defaultTtl: 300000, // 5 minutes
  enableCompression: true,
  persistToLocalStorage: true
});

// Specialized cache instances for different use cases
export const financialDataCache = new EnterpriseCache({
  maxSize: 100,
  defaultTtl: 600000, // 10 minutes
  enableCompression: false,
  persistToLocalStorage: true
});

export const behavioralPatternsCache = new EnterpriseCache({
  maxSize: 50,
  defaultTtl: 1800000, // 30 minutes
  enableCompression: true,
  persistToLocalStorage: true
});