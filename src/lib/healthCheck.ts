import { supabase } from '@/integrations/supabase/client';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    database: 'up' | 'down' | 'degraded';
    auth: 'up' | 'down' | 'degraded';
    functions: 'up' | 'down' | 'degraded';
  };
  timestamp: string;
  responseTime: number;
}

export const performHealthCheck = async (): Promise<HealthStatus> => {
  const startTime = Date.now();
  
  const health: HealthStatus = {
    status: 'healthy',
    services: {
      database: 'down',
      auth: 'down',
      functions: 'down',
    },
    timestamp: new Date().toISOString(),
    responseTime: 0,
  };

  try {
    // Test database connection
    const { error: dbError } = await supabase
      .from('subscribers')
      .select('count')
      .limit(1);
    
    health.services.database = dbError ? 'down' : 'up';

    // Test auth service
    const { error: authError } = await supabase.auth.getUser();
    health.services.auth = authError ? 'degraded' : 'up';

    // Test edge functions
    try {
      const { error: funcError } = await supabase.functions.invoke('check-subscription');
      health.services.functions = funcError ? 'degraded' : 'up';
    } catch {
      health.services.functions = 'degraded';
    }

  } catch (error) {
    console.error('Health check failed:', error);
  }

  // Determine overall status
  const services = Object.values(health.services);
  if (services.includes('down')) {
    health.status = 'unhealthy';
  } else if (services.includes('degraded')) {
    health.status = 'degraded';
  }

  health.responseTime = Date.now() - startTime;
  return health;
};

// Continuous health monitoring
export class HealthMonitor {
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: ((status: HealthStatus) => void)[] = [];

  start(intervalMs = 30000) {
    this.intervalId = setInterval(async () => {
      const status = await performHealthCheck();
      this.listeners.forEach(listener => listener(status));
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  addListener(listener: (status: HealthStatus) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (status: HealthStatus) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}

export const healthMonitor = new HealthMonitor();