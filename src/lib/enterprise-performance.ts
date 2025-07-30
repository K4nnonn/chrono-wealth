// Enterprise Performance Monitoring & Optimization
// Real-time performance tracking, query optimization, and caching

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  threshold?: number;
  category: 'memory' | 'network' | 'rendering' | 'database' | 'cache';
}

export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number;
  accessCount: number;
  lastAccessed: Date;
}

export interface QueryPerformance {
  query: string;
  executionTime: number;
  resultSize: number;
  cacheHit: boolean;
  timestamp: Date;
}

class EnterprisePerformanceManager {
  private static instance: EnterprisePerformanceManager;
  private metrics: PerformanceMetric[] = [];
  private cache = new Map<string, CacheEntry<any>>();
  private queryLog: QueryPerformance[] = [];
  private performanceObserver?: PerformanceObserver;

  private constructor() {
    this.initializePerformanceObserver();
    this.startMemoryMonitoring();
    this.startCacheCleanup();
  }

  public static getInstance(): EnterprisePerformanceManager {
    if (!EnterprisePerformanceManager.instance) {
      EnterprisePerformanceManager.instance = new EnterprisePerformanceManager();
    }
    return EnterprisePerformanceManager.instance;
  }

  /**
   * Initialize Web Performance Observer for real-time metrics
   */
  private initializePerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric({
            name: entry.name,
            value: entry.duration || entry.startTime,
            timestamp: new Date(),
            category: this.categorizePerformanceEntry(entry)
          });
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['measure', 'navigation', 'resource', 'paint', 'largest-contentful-paint']
      });
    }
  }

  /**
   * Categorize performance entries for better analysis
   */
  private categorizePerformanceEntry(entry: PerformanceEntry): PerformanceMetric['category'] {
    if (entry.entryType === 'navigation') return 'network';
    if (entry.entryType === 'resource') return 'network';
    if (entry.entryType === 'paint') return 'rendering';
    if (entry.entryType === 'largest-contentful-paint') return 'rendering';
    if (entry.name.includes('database') || entry.name.includes('query')) return 'database';
    return 'rendering';
  }

  /**
   * Monitor memory usage patterns
   */
  private startMemoryMonitoring(): void {
    setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.recordMetric({
          name: 'heap_used',
          value: memory.usedJSHeapSize / 1024 / 1024, // MB
          timestamp: new Date(),
          threshold: 100, // 100MB threshold
          category: 'memory'
        });

        this.recordMetric({
          name: 'heap_total',
          value: memory.totalJSHeapSize / 1024 / 1024, // MB
          timestamp: new Date(),
          threshold: 200, // 200MB threshold
          category: 'memory'
        });
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Intelligent cache with LRU eviction and TTL
   */
  public setCache<T>(key: string, data: T, ttlMs: number = 300000): void {
    // Clean expired entries first
    this.cleanExpiredCache();

    // If cache is getting large, remove LRU items
    if (this.cache.size > 1000) {
      this.evictLRUEntries(100);
    }

    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl: ttlMs,
      accessCount: 0,
      lastAccessed: new Date()
    });
  }

  public getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const isExpired = now - entry.timestamp.getTime() > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    // Update access patterns
    entry.accessCount++;
    entry.lastAccessed = new Date();

    this.recordMetric({
      name: 'cache_hit',
      value: 1,
      timestamp: new Date(),
      category: 'cache'
    });

    return entry.data;
  }

  /**
   * Clean expired cache entries
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp.getTime() > entry.ttl) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  /**
   * Evict least recently used cache entries
   */
  private evictLRUEntries(count: number): void {
    const entries = Array.from(this.cache.entries())
      .sort(([,a], [,b]) => a.lastAccessed.getTime() - b.lastAccessed.getTime())
      .slice(0, count);

    entries.forEach(([key]) => this.cache.delete(key));
  }

  /**
   * Start automatic cache cleanup
   */
  private startCacheCleanup(): void {
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60000); // Every minute
  }

  /**
   * Record performance metric
   */
  public recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only last 10,000 metrics in memory
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-10000);
    }

    // Alert on threshold breach
    if (metric.threshold && metric.value > metric.threshold) {
      console.warn(`Performance threshold breached: ${metric.name} = ${metric.value} (threshold: ${metric.threshold})`);
    }
  }

  /**
   * Log database query performance
   */
  public logQuery(query: string, executionTime: number, resultSize: number, cacheHit: boolean = false): void {
    const queryPerf: QueryPerformance = {
      query: query.substring(0, 200), // Truncate long queries
      executionTime,
      resultSize,
      cacheHit,
      timestamp: new Date()
    };

    this.queryLog.push(queryPerf);

    // Keep only last 1000 queries
    if (this.queryLog.length > 1000) {
      this.queryLog = this.queryLog.slice(-1000);
    }

    // Record as metric
    this.recordMetric({
      name: 'database_query_time',
      value: executionTime,
      timestamp: new Date(),
      threshold: 1000, // 1 second threshold
      category: 'database'
    });
  }

  /**
   * Measure function execution time
   */
  public async measureFunction<T>(
    name: string, 
    fn: () => Promise<T> | T
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.recordMetric({
        name: `function_${name}`,
        value: duration,
        timestamp: new Date(),
        category: 'rendering'
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      this.recordMetric({
        name: `function_${name}_error`,
        value: duration,
        timestamp: new Date(),
        category: 'rendering'
      });
      
      throw error;
    }
  }

  /**
   * Get performance analytics
   */
  public getAnalytics(hours: number = 1): {
    metrics: PerformanceMetric[];
    summary: Record<string, { avg: number; max: number; min: number; count: number }>;
    slowQueries: QueryPerformance[];
    cacheStats: { hitRate: number; size: number; totalAccess: number };
  } {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff);
    const recentQueries = this.queryLog.filter(q => q.timestamp >= cutoff);

    // Calculate summary statistics
    const summary: Record<string, { avg: number; max: number; min: number; count: number }> = {};
    
    recentMetrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { avg: 0, max: 0, min: Infinity, count: 0 };
      }
      
      const stat = summary[metric.name];
      stat.count++;
      stat.max = Math.max(stat.max, metric.value);
      stat.min = Math.min(stat.min, metric.value);
      stat.avg = (stat.avg * (stat.count - 1) + metric.value) / stat.count;
    });

    // Find slow queries
    const slowQueries = recentQueries
      .filter(q => q.executionTime > 500) // Slower than 500ms
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, 10);

    // Cache statistics
    const cacheEntries = Array.from(this.cache.values());
    const totalAccess = cacheEntries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const cacheHits = recentQueries.filter(q => q.cacheHit).length;
    const hitRate = recentQueries.length > 0 ? cacheHits / recentQueries.length : 0;

    return {
      metrics: recentMetrics,
      summary,
      slowQueries,
      cacheStats: {
        hitRate,
        size: this.cache.size,
        totalAccess
      }
    };
  }

  /**
   * Generate performance recommendations
   */
  public generateRecommendations(): string[] {
    const analytics = this.getAnalytics(24); // Last 24 hours
    const recommendations: string[] = [];

    // Memory recommendations
    const heapUsed = analytics.summary['heap_used'];
    if (heapUsed && heapUsed.avg > 50) {
      recommendations.push('High memory usage detected. Consider implementing data pagination or lazy loading.');
    }

    // Query performance recommendations
    if (analytics.slowQueries.length > 0) {
      recommendations.push(`${analytics.slowQueries.length} slow queries detected. Consider adding database indexes or query optimization.`);
    }

    // Cache recommendations
    if (analytics.cacheStats.hitRate < 0.7) {
      recommendations.push('Low cache hit rate. Consider adjusting cache TTL or improving cache keys.');
    }

    // Network recommendations
    const networkMetrics = analytics.metrics.filter(m => m.category === 'network');
    const avgNetworkTime = networkMetrics.reduce((sum, m) => sum + m.value, 0) / networkMetrics.length;
    if (avgNetworkTime > 2000) {
      recommendations.push('High network latency detected. Consider implementing request batching or CDN usage.');
    }

    return recommendations;
  }

  /**
   * Export performance data for analysis
   */
  public exportData(): {
    metrics: PerformanceMetric[];
    queries: QueryPerformance[];
    cacheSize: number;
    exportedAt: Date;
  } {
    return {
      metrics: [...this.metrics],
      queries: [...this.queryLog],
      cacheSize: this.cache.size,
      exportedAt: new Date()
    };
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    this.cache.clear();
    this.metrics = [];
    this.queryLog = [];
  }
}

// Export singleton instance
export const performanceManager = EnterprisePerformanceManager.getInstance();

// Performance decorator for methods
export function measurePerformance(name: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      return performanceManager.measureFunction(
        name || `${target.constructor.name}.${propertyKey}`,
        () => originalMethod.apply(this, args)
      );
    };
    
    return descriptor;
  };
}

// Query optimization utilities
export class QueryOptimizer {

  /**
   * Optimize Supabase query with caching and performance tracking
   */
  static async optimizedQuery<T>(
    queryKey: string,
    queryFn: () => Promise<{ data: T | null; error: any }>,
    cacheMs: number = 300000
  ): Promise<{ data: T | null; error: any }> {
    const start = performance.now();
    
    // Try cache first
    const cached = performanceManager.getCache<T>(queryKey);
    if (cached) {
      performanceManager.logQuery(queryKey, 0, JSON.stringify(cached).length, true);
      return { data: cached, error: null };
    }

    // Execute query
    const result = await queryFn();
    const executionTime = performance.now() - start;
    
    // Cache successful results
    if (result.data && !result.error) {
      performanceManager.setCache(queryKey, result.data, cacheMs);
    }

    // Log performance
    const resultSize = result.data ? JSON.stringify(result.data).length : 0;
    performanceManager.logQuery(queryKey, executionTime, resultSize, false);

    return result;
  }

  /**
   * Batch multiple queries for better performance
   */
  static async batchQueries<T>(
    queries: Array<{ key: string; fn: () => Promise<{ data: T | null; error: any }> }>
  ): Promise<Array<{ data: T | null; error: any }>> {
    return performanceManager.measureFunction('batch_queries', async () => {
      return Promise.all(queries.map(q => this.optimizedQuery(q.key, q.fn)));
    });
  }
}
