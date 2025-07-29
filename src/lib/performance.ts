// Performance monitoring utilities for Core Web Vitals and custom metrics

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
          this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
          this.reportMetric('lcp', this.metrics.lcp);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.reportMetric('fid', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.reportMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              this.reportMetric('fcp', this.metrics.fcp);
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (e) {
        console.warn('FCP observer not supported');
      }
    }

    // Time to First Byte
    if (performance.timing) {
      const ttfb = performance.timing.responseStart - performance.timing.requestStart;
      this.metrics.ttfb = ttfb;
      this.reportMetric('ttfb', ttfb);
    }
  }

  private reportMetric(name: string, value: number) {
    console.log(`Performance Metric - ${name.toUpperCase()}: ${value.toFixed(2)}ms`);
    
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Google Analytics, Mixpanel, custom analytics
      // gtag('event', name, { value: value, event_category: 'performance' });
    }
  }

  // Measure custom performance marks
  mark(name: string) {
    if (performance.mark) {
      performance.mark(name);
    }
  }

  // Measure time between marks
  measure(name: string, startMark: string, endMark?: string) {
    if (performance.measure) {
      performance.measure(name, startMark, endMark);
      const measures = performance.getEntriesByName(name, 'measure');
      if (measures.length > 0) {
        const duration = measures[measures.length - 1].duration;
        this.reportMetric(name, duration);
        return duration;
      }
    }
    return 0;
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Resource loading performance
export const measureResourceTiming = () => {
  if (performance.getEntriesByType) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const analysis = {
      totalResources: resources.length,
      slowResources: resources.filter(r => r.duration > 1000),
      largeResources: resources.filter(r => r.transferSize > 100000),
      averageLoadTime: resources.reduce((sum, r) => sum + r.duration, 0) / resources.length,
    };

    console.log('Resource Performance Analysis:', analysis);
    return analysis;
  }
};

// Bundle size analysis
export const analyzeBundleSize = () => {
  if (performance.getEntriesByType) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const analysis = {
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      firstByte: navigation.responseStart - navigation.fetchStart,
      domComplete: navigation.domComplete - navigation.fetchStart,
    };

    console.log('Bundle Performance Analysis:', analysis);
    return analysis;
  }
};

export const performanceMonitor = new PerformanceMonitor();

// Export for use in components
export const usePerformanceMonitoring = () => {
  const trackUserAction = (action: string) => {
    performanceMonitor.mark(`${action}-start`);
    
    return () => {
      performanceMonitor.mark(`${action}-end`);
      performanceMonitor.measure(action, `${action}-start`, `${action}-end`);
    };
  };

  return {
    trackUserAction,
    getMetrics: () => performanceMonitor.getMetrics(),
    measureResourceTiming,
    analyzeBundleSize,
  };
};