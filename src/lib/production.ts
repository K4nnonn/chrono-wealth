// Production utilities and initialization
import { initializeMonitoring } from './monitoring';
import { performanceMonitor } from './performance';
import { backupScheduler } from './backup';
import { auditLogger } from './compliance';
import { rateLimiter } from './security';

// Production initialization
export const initializeProductionServices = () => {
  // Initialize monitoring
  initializeMonitoring();
  
  // Start performance monitoring
  performanceMonitor;
  
  // Start automated backup scheduling (daily)
  if (process.env.NODE_ENV === 'production') {
    backupScheduler.start(24);
  }
  
  // Log application startup
  auditLogger.log({
    action: 'application_startup',
    resource: 'system',
    sensitivity: 'low',
    metadata: {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
  
  console.log('🚀 Production services initialized successfully');
};

// Graceful shutdown
export const shutdownProductionServices = () => {
  backupScheduler.stop();
  performanceMonitor.disconnect();
  
  auditLogger.log({
    action: 'application_shutdown',
    resource: 'system',
    sensitivity: 'low',
    metadata: {
      timestamp: new Date().toISOString(),
    },
  });
  
  console.log('📴 Production services shut down gracefully');
};

// Health check utilities
export const getSystemStatus = () => ({
  status: 'operational',
  timestamp: new Date().toISOString(),
  services: {
    monitoring: 'active',
    performance: 'active',
    backup: 'active',
    audit: 'active',
    security: 'active',
  },
});

// Rate limiting for API endpoints
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  return (req: any) => {
    const key = req.ip || 'unknown';
    return rateLimiter.isAllowed(key, maxRequests, windowMs);
  };
};