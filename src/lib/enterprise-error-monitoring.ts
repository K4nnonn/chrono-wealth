// Enterprise Error Monitoring and Recovery System
// Comprehensive error tracking, performance monitoring, and auto-recovery

export interface ErrorContext {
  userId?: string;
  sessionId: string;
  timestamp: Date;
  url: string;
  userAgent: string;
  stackTrace?: string;
  componentStack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'ui' | 'api' | 'data' | 'security' | 'performance';
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  timestamp: Date;
  threshold?: number;
  isThresholdExceeded: boolean;
}

export interface RecoveryAction {
  action: string;
  description: string;
  automated: boolean;
  success: boolean;
  timestamp: Date;
}

export class EnterpriseErrorMonitor {
  private static instance: EnterpriseErrorMonitor;
  private errors: (Error & { context: ErrorContext })[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private recoveryActions: RecoveryAction[] = [];
  private sessionId: string;

  private constructor() {
    this.sessionId = crypto.randomUUID();
    this.initializeGlobalErrorHandling();
    this.initializePerformanceMonitoring();
  }

  public static getInstance(): EnterpriseErrorMonitor {
    if (!EnterpriseErrorMonitor.instance) {
      EnterpriseErrorMonitor.instance = new EnterpriseErrorMonitor();
    }
    return EnterpriseErrorMonitor.instance;
  }

  /**
   * Initialize global error handling
   */
  private initializeGlobalErrorHandling(): void {
    // Capture unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        sessionId: this.sessionId,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        stackTrace: event.error?.stack,
        severity: 'high',
        category: 'ui'
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        sessionId: this.sessionId,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: 'high',
        category: 'api'
      });
    });
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would be implemented with actual web-vitals library
      // For now, simulate monitoring
      setInterval(() => {
        this.capturePerformanceMetric('memory-usage', (performance as any).memory?.usedJSHeapSize || 0, 50 * 1024 * 1024);
        this.capturePerformanceMetric('dom-nodes', document.querySelectorAll('*').length, 1500);
      }, 30000); // Every 30 seconds
    }

    // Monitor API response times
    this.monitorFetchPerformance();
  }

  /**
   * Monitor fetch API performance
   */
  private monitorFetchPerformance(): void {
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const startTime = performance.now();
      const url = typeof input === 'string' ? input : input.toString();
      
      try {
        const response = await originalFetch(input, init);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log API performance
        this.capturePerformanceMetric(`api-response-${url}`, duration, 2000); // 2 second threshold
        
        // Log API errors
        if (!response.ok) {
          this.captureError(new Error(`API Error: ${response.status} ${response.statusText}`), {
            sessionId: this.sessionId,
            timestamp: new Date(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            severity: response.status >= 500 ? 'high' : 'medium',
            category: 'api'
          });
        }
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.capturePerformanceMetric(`api-error-${url}`, duration);
        
        this.captureError(error as Error, {
          sessionId: this.sessionId,
          timestamp: new Date(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          severity: 'critical',
          category: 'api'
        });
        
        throw error;
      }
    };
  }

  /**
   * Capture and log errors with context
   */
  public captureError(error: Error, context: Partial<ErrorContext>): void {
    const fullContext: ErrorContext = {
      sessionId: this.sessionId,
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity: 'medium',
      category: 'ui',
      ...context
    };

    const enhancedError = Object.assign(error, { context: fullContext });
    this.errors.push(enhancedError);

    // Keep only last 1000 errors in memory
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-1000);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Enterprise Error Monitor:', error, fullContext);
    }

    // Attempt automatic recovery for certain error types
    this.attemptAutoRecovery(error, fullContext);

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(enhancedError);
    }
  }

  /**
   * Capture performance metrics
   */
  public capturePerformanceMetric(metric: string, value: number, threshold?: number): void {
    const performanceMetric: PerformanceMetric = {
      metric,
      value,
      timestamp: new Date(),
      threshold,
      isThresholdExceeded: threshold ? value > threshold : false
    };

    this.performanceMetrics.push(performanceMetric);

    // Keep only last 10,000 metrics in memory
    if (this.performanceMetrics.length > 10000) {
      this.performanceMetrics = this.performanceMetrics.slice(-10000);
    }

    // Log threshold violations
    if (performanceMetric.isThresholdExceeded) {
      this.captureError(new Error(`Performance threshold exceeded: ${metric}`), {
        sessionId: this.sessionId,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: 'medium',
        category: 'performance'
      });
    }
  }

  /**
   * Attempt automatic recovery for certain error types
   */
  private attemptAutoRecovery(error: Error, context: ErrorContext): void {
    const recoveryActions: RecoveryAction[] = [];

    // Network-related errors
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      recoveryActions.push({
        action: 'network-retry',
        description: 'Attempt to retry failed network request',
        automated: true,
        success: false,
        timestamp: new Date()
      });
    }

    // Memory-related errors
    if (error.message.includes('out of memory') || context.category === 'performance') {
      recoveryActions.push({
        action: 'memory-cleanup',
        description: 'Clear caches and perform garbage collection',
        automated: true,
        success: false,
        timestamp: new Date()
      });
      
      // Attempt memory cleanup
      this.performMemoryCleanup();
    }

    // API timeout errors
    if (error.message.includes('timeout')) {
      recoveryActions.push({
        action: 'api-fallback',
        description: 'Switch to backup API endpoint or cached data',
        automated: true,
        success: false,
        timestamp: new Date()
      });
    }

    this.recoveryActions.push(...recoveryActions);
  }

  /**
   * Perform memory cleanup
   */
  private performMemoryCleanup(): void {
    try {
      // Clear old performance metrics
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
      
      // Clear old errors
      this.errors = this.errors.slice(-100);
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      this.recoveryActions.push({
        action: 'memory-cleanup',
        description: 'Successfully cleaned up memory caches',
        automated: true,
        success: true,
        timestamp: new Date()
      });
    } catch (cleanupError) {
      this.recoveryActions.push({
        action: 'memory-cleanup',
        description: 'Failed to clean up memory caches',
        automated: true,
        success: false,
        timestamp: new Date()
      });
    }
  }

  /**
   * Send error to monitoring service
   */
  private sendToMonitoringService(error: Error & { context: ErrorContext }): void {
    // In a real implementation, this would send to services like:
    // - Sentry
    // - DataDog
    // - New Relic
    // - Custom monitoring endpoint
    
    const payload = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context: error.context,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    // Simulate sending to monitoring service
    fetch('/api/monitoring/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {
      // Silently fail if monitoring service is unavailable
    });
  }

  /**
   * Get error report for dashboard
   */
  public getErrorReport(hours: number = 24): {
    totalErrors: number;
    errorsByCategory: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    recentErrors: (Error & { context: ErrorContext })[];
    performanceIssues: PerformanceMetric[];
    recoveryActions: RecoveryAction[];
  } {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentErrors = this.errors.filter(error => error.context.timestamp >= cutoff);
    const recentMetrics = this.performanceMetrics.filter(metric => metric.timestamp >= cutoff);
    const recentRecovery = this.recoveryActions.filter(action => action.timestamp >= cutoff);

    const errorsByCategory = recentErrors.reduce((acc, error) => {
      acc[error.context.category] = (acc[error.context.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsBySeverity = recentErrors.reduce((acc, error) => {
      acc[error.context.severity] = (acc[error.context.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const performanceIssues = recentMetrics.filter(metric => metric.isThresholdExceeded);

    return {
      totalErrors: recentErrors.length,
      errorsByCategory,
      errorsBySeverity,
      recentErrors: recentErrors.slice(-50), // Last 50 errors
      performanceIssues,
      recoveryActions: recentRecovery
    };
  }

  /**
   * Get system health status
   */
  public getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    score: number;
    issues: string[];
    lastUpdated: Date;
  } {
    const recentErrors = this.errors.filter(
      error => error.context.timestamp >= new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );
    const criticalErrors = recentErrors.filter(error => error.context.severity === 'critical');
    const performanceIssues = this.performanceMetrics.filter(
      metric => metric.isThresholdExceeded && 
      metric.timestamp >= new Date(Date.now() - 60 * 60 * 1000)
    );

    let score = 100;
    const issues: string[] = [];

    // Deduct points for errors
    score -= recentErrors.length * 2;
    score -= criticalErrors.length * 10;
    score -= performanceIssues.length * 5;

    if (recentErrors.length > 10) {
      issues.push(`High error rate: ${recentErrors.length} errors in the last hour`);
    }

    if (criticalErrors.length > 0) {
      issues.push(`${criticalErrors.length} critical errors detected`);
    }

    if (performanceIssues.length > 5) {
      issues.push(`${performanceIssues.length} performance thresholds exceeded`);
    }

    score = Math.max(0, Math.min(100, score));

    let status: 'healthy' | 'warning' | 'critical';
    if (score >= 90) status = 'healthy';
    else if (score >= 70) status = 'warning';
    else status = 'critical';

    return {
      status,
      score,
      issues,
      lastUpdated: new Date()
    };
  }
}

// Export singleton instance
export const enterpriseErrorMonitor = EnterpriseErrorMonitor.getInstance();
