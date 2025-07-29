// Performance optimization utilities

import { trackMetric } from './monitoring';

// Debounce utility for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Throttle utility for rate limiting
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading utility for components
export const createLazyComponent = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  const LazyComponent = React.lazy(importFn);
  
  return (props: any) => React.createElement(
    React.Suspense, 
    { fallback: React.createElement('div', { className: 'animate-pulse' }, 'Loading...') },
    React.createElement(LazyComponent, props)
  );
};

// Virtual scrolling utility for large lists
export const useVirtualScroll = (items: any[], itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  
  return {
    visibleItems,
    offsetY,
    totalHeight: items.length * itemHeight,
    setScrollTop,
  };
};

// Image optimization utility
export const optimizeImage = (src: string, width?: number, quality = 80): string => {
  // For production, this would integrate with a CDN like Cloudinary or ImageKit
  if (width) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', quality.toString());
    return url.toString();
  }
  return src;
};

// Bundle splitting utility
export const preloadRoute = (routeModule: () => Promise<any>) => {
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = routeModule.toString();
  document.head.appendChild(link);
};

// Performance monitoring for components
export const withPerformanceTracking = (
  Component: React.ComponentType<any>,
  componentName: string
) => {
  return React.memo((props: any) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const renderTime = performance.now() - startTime;
        trackMetric(`component_render_time_${componentName}`, renderTime);
      };
    }, []);
    
    return React.createElement(Component, props);
  });
};

// Resource preloading
export const preloadResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.as = 'image';
    }
    
    document.head.appendChild(link);
  });
};

// Critical CSS extraction
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.innerHTML = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      trackMetric('service_worker_registered', 1);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      trackMetric('service_worker_registration_failed', 1);
    }
  }
};

// React import for the lazy component utility
import React from 'react';