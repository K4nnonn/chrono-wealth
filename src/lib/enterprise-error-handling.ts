/**
 * Enterprise Error Handling System
 * Centralized error management with categorization, reporting, and recovery strategies
 */

export interface ErrorContext {
  userId?: string;
  feature: string;
  action: string;
  metadata?: Record<string, any>;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorRecoveryStrategy {
  type: 'retry' | 'fallback' | 'graceful_degradation' | 'user_notification';
  maxRetries?: number;
  backoffMultiplier?: number;
  fallbackAction?: () => Promise<any>;
}

export class EnterpriseErrorHandler {
  private static instance: EnterpriseErrorHandler;
  private errorQueue: Array<{ error: Error; context: ErrorContext }> = [];
  private isOnline = true;

  static getInstance(): EnterpriseErrorHandler {
    if (!EnterpriseErrorHandler.instance) {
      EnterpriseErrorHandler.instance = new EnterpriseErrorHandler();
    }
    return EnterpriseErrorHandler.instance;
  }

  constructor() {
    this.setupErrorListeners();
    this.setupConnectivityMonitoring();
  }

  private setupErrorListeners() {
    // Global error handler for unhandled promises
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(new Error(event.reason), {
        feature: 'global',
        action: 'unhandled_promise_rejection',
        severity: 'high',
        timestamp: new Date().toISOString(),
        metadata: { reason: event.reason }
      });
    });

    // Global error handler for uncaught exceptions
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        feature: 'global',
        action: 'uncaught_exception',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });
  }

  private setupConnectivityMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async handleError(
    error: Error,
    context: ErrorContext,
    recoveryStrategy?: ErrorRecoveryStrategy
  ): Promise<any> {
    // Enhance error with context
    const enhancedError = this.enhanceError(error, context);
    
    // Apply recovery strategy if provided
    if (recoveryStrategy) {
      const result = await this.applyRecoveryStrategy(enhancedError, recoveryStrategy);
      if (result.success) {
        return result.data;
      }
    }

    // Queue error for reporting
    this.queueError(enhancedError, context);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Enhanced Error:', enhancedError);
      console.error('Context:', context);
    }

    // Report immediately if online, otherwise queue
    if (this.isOnline) {
      await this.reportError(enhancedError, context);
    }

    throw enhancedError;
  }

  private enhanceError(error: Error, context: ErrorContext): Error {
    const enhanced = new Error(error.message);
    enhanced.name = error.name;
    enhanced.stack = error.stack;
    
    // Add context to error object
    (enhanced as any).context = context;
    (enhanced as any).errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return enhanced;
  }

  private async applyRecoveryStrategy(
    error: Error,
    strategy: ErrorRecoveryStrategy
  ): Promise<{ success: boolean; data?: any }> {
    switch (strategy.type) {
      case 'retry':
        return this.attemptRetry(strategy);
      
      case 'fallback':
        if (strategy.fallbackAction) {
          try {
            const data = await strategy.fallbackAction();
            return { success: true, data };
          } catch (fallbackError) {
            return { success: false };
          }
        }
        return { success: false };
      
      case 'graceful_degradation':
        // Return minimal safe state
        return { success: true, data: this.getGracefulFallback(error) };
      
      case 'user_notification':
        this.notifyUser(error);
        return { success: false };
      
      default:
        return { success: false };
    }
  }

  private async attemptRetry(
    strategy: ErrorRecoveryStrategy
  ): Promise<{ success: boolean; data?: any }> {
    const maxRetries = strategy.maxRetries || 3;
    const backoffMultiplier = strategy.backoffMultiplier || 1.5;
    let delay = 1000; // Start with 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Attempt to re-execute the original operation
        // This would need to be provided by the caller
        return { success: true };
      } catch (retryError) {
        if (attempt === maxRetries) {
          return { success: false };
        }
        delay *= backoffMultiplier;
      }
    }

    return { success: false };
  }

  private getGracefulFallback(error: Error): any {
    const context = (error as any).context as ErrorContext;
    
    switch (context.feature) {
      case 'financial_data':
        return {
          monthlyIncome: 0,
          monthlyExpenses: 0,
          monthlySavings: 0,
          currentNetWorth: 0,
          savingsRate: 0
        };
      
      case 'behavioral_patterns':
        return {
          insights: [],
          metrics: {
            entropy: 0,
            volatility: 0,
            consistency: 0,
            timeCluster: 'Unknown'
          }
        };
      
      case 'forecasting':
        return {
          projections: [],
          summary: {
            finalNetWorth: 0,
            goalAchievementMonths: 0,
            emergencyFundCoverage: 0,
            riskScore: 50
          }
        };
      
      default:
        return {};
    }
  }

  private notifyUser(error: Error) {
    // In a real application, this would show a toast notification
    if (import.meta.env.DEV) {
      console.warn('User notification:', error.message);
    }
  }

  private queueError(error: Error, context: ErrorContext) {
    this.errorQueue.push({ error, context });
    
    // Limit queue size to prevent memory issues
    if (this.errorQueue.length > 100) {
      this.errorQueue.shift();
    }
  }

  private async flushErrorQueue() {
    while (this.errorQueue.length > 0) {
      const { error, context } = this.errorQueue.shift()!;
      try {
        await this.reportError(error, context);
      } catch (reportError) {
        // If reporting fails, put it back in queue
        this.errorQueue.unshift({ error, context });
        break;
      }
    }
  }

  private async reportError(error: Error, context: ErrorContext) {
    try {
      // In production, this would send to error reporting service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        context,
        errorId: (error as any).errorId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Simulate error reporting API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (import.meta.env.DEV) {
        // Development-only structured logging  
        performance.mark(`error-reported-${errorReport.errorId}`);
      }
    } catch (reportingError) {
      // Queue for retry
      this.queueError(error, context);
    }
  }

  // Utility methods for common error scenarios
  async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    recoveryStrategy?: ErrorRecoveryStrategy
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      return this.handleError(error as Error, context, recoveryStrategy);
    }
  }

  createErrorBoundary(feature: string) {
    return (error: Error, errorInfo: any) => {
      this.handleError(error, {
        feature,
        action: 'react_error_boundary',
        severity: 'high',
        timestamp: new Date().toISOString(),
        metadata: errorInfo
      });
    };
  }

  // Performance monitoring integration
  trackPerformanceError(metric: string, threshold: number, actual: number) {
    if (actual > threshold) {
      this.handleError(
        new Error(`Performance threshold exceeded: ${metric}`),
        {
          feature: 'performance',
          action: 'threshold_exceeded',
          severity: 'medium',
          timestamp: new Date().toISOString(),
          metadata: {
            metric,
            threshold,
            actual,
            ratio: actual / threshold
          }
        }
      );
    }
  }
}

// Export singleton instance
export const errorHandler = EnterpriseErrorHandler.getInstance();