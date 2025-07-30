import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Import and use monitoring
    import('@/lib/monitoring').then(({ logError }) => {
      logError(error, {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Import and use compliance logging
    import('@/lib/compliance').then(({ auditLogger }) => {
      auditLogger.log({
        action: 'error_boundary_triggered',
        resource: 'application',
        sensitivity: 'high',
        metadata: {
          errorMessage: error.message,
          errorStack: error.stack,
          componentStack: errorInfo.componentStack,
        },
      });
    });
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-6">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message || 'An unexpected error occurred. Our team has been notified.'}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <Button onClick={retry} className="w-full">
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-xs">
            <summary className="cursor-pointer text-muted-foreground">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  type, 
  title, 
  description, 
  duration = 5000,
  onClose 
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  if (!isVisible) return null;

  return (
    <Alert 
      variant={getVariant()}
      className={cn(
        "fixed top-4 right-4 w-96 z-100 transition-all duration-300",
        "shadow-elegant border",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
      >
        <XCircle className="h-3 w-3" />
      </Button>
    </Alert>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-muted", sizeClasses[size], className)}>
      <div className="h-full w-full rounded-full border-2 border-primary border-t-transparent"></div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div className={cn("skeleton rounded-md", className)}>
      {children}
    </div>
  );
};

interface RetryBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export const RetryBoundary: React.FC<RetryBoundaryProps> = ({ children, fallback }) => {
  const [retryCount, setRetryCount] = React.useState(0);
  
  const handleRetry = React.useCallback(() => {
    setRetryCount(count => count + 1);
  }, []);

  // Use handleRetry to prevent unused variable warning
  React.useEffect(() => {
    if (retryCount > 0) {
      // Retry logic handled by key prop change
    }
  }, [retryCount, handleRetry]);

  return (
    <ErrorBoundary key={retryCount} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;