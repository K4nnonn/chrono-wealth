import * as Sentry from '@sentry/react';
import { ENV } from '@/config/env';

// Initialize Sentry for error tracking and performance monitoring
export const initializeMonitoring = () => {
  if (ENV.IS_PRODUCTION) {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN || '',
      environment: ENV.IS_PRODUCTION ? 'production' : 'development',
      integrations: [],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event) {
        // Filter out noise and PII
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.value?.includes('Network request failed')) {
            return null; // Don't send network errors
          }
        }
        return event;
      },
    });
  }
};

// Custom error logging with context
export const logError = (error: Error, context?: Record<string, any>) => {
  console.error('Application Error:', error, context);
  
  if (ENV.IS_PRODUCTION) {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setContext(key, value);
        });
      }
      Sentry.captureException(error);
    });
  }
};

// Performance monitoring
export const startTransaction = (name: string, operation: string) => {
  if (ENV.IS_PRODUCTION) {
    // Use Sentry performance monitoring when available
    console.log(`Starting transaction: ${name} (${operation})`);
  }
  return null;
};

// Custom metrics tracking
export const trackMetric = (name: string, value: number, tags?: Record<string, string>) => {
  console.log(`Metric: ${name} = ${value}`, tags);
  
  if (ENV.IS_PRODUCTION) {
    Sentry.addBreadcrumb({
      category: 'metric',
      message: `${name}: ${value}`,
      level: 'info',
      data: tags,
    });
  }
};

// User context for debugging
export const setUserContext = (user: { id: string; email?: string }) => {
  if (ENV.IS_PRODUCTION) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  }
};

// Clear user context on logout
export const clearUserContext = () => {
  if (ENV.IS_PRODUCTION) {
    Sentry.setUser(null);
  }
};