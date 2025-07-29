import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[HEALTH-CHECK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting comprehensive health check');
    const startTime = Date.now();

    // Initialize Supabase client with service role for comprehensive checks
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const health = {
      status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: 'down' as 'up' | 'down' | 'degraded', latency: 0 },
        auth: { status: 'down' as 'up' | 'down' | 'degraded', latency: 0 },
        functions: { status: 'down' as 'up' | 'down' | 'degraded', latency: 0 },
        storage: { status: 'down' as 'up' | 'down' | 'degraded', latency: 0 },
      },
      metadata: {
        environment: Deno.env.get('DENO_DEPLOYMENT_ID') ? 'production' : 'development',
        version: '1.0.0',
        uptime: Date.now() - startTime,
      },
    };

    // Test database connectivity
    try {
      const dbStart = Date.now();
      const { error: dbError } = await supabaseAdmin
        .from('profiles')
        .select('count')
        .limit(1);
      
      health.checks.database.latency = Date.now() - dbStart;
      health.checks.database.status = dbError ? 'degraded' : 'up';
      logStep('Database check completed', { status: health.checks.database.status, latency: health.checks.database.latency });
    } catch (error) {
      health.checks.database.status = 'down';
      logStep('Database check failed', { error: error.message });
    }

    // Test auth service
    try {
      const authStart = Date.now();
      const { error: authError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
      
      health.checks.auth.latency = Date.now() - authStart;
      health.checks.auth.status = authError ? 'degraded' : 'up';
      logStep('Auth check completed', { status: health.checks.auth.status, latency: health.checks.auth.latency });
    } catch (error) {
      health.checks.auth.status = 'down';
      logStep('Auth check failed', { error: error.message });
    }

    // Test edge functions (self-reference)
    try {
      const funcStart = Date.now();
      health.checks.functions.latency = Date.now() - funcStart;
      health.checks.functions.status = 'up';
      logStep('Functions check completed', { status: health.checks.functions.status });
    } catch (error) {
      health.checks.functions.status = 'degraded';
      logStep('Functions check failed', { error: error.message });
    }

    // Test storage (if buckets exist)
    try {
      const storageStart = Date.now();
      const { error: storageError } = await supabaseAdmin.storage.listBuckets();
      
      health.checks.storage.latency = Date.now() - storageStart;
      health.checks.storage.status = storageError ? 'degraded' : 'up';
      logStep('Storage check completed', { status: health.checks.storage.status, latency: health.checks.storage.latency });
    } catch (error) {
      health.checks.storage.status = 'degraded';
      logStep('Storage check failed', { error: error.message });
    }

    // Determine overall health status
    const checkStatuses = Object.values(health.checks).map(check => check.status);
    if (checkStatuses.includes('down')) {
      health.status = 'unhealthy';
    } else if (checkStatuses.includes('degraded')) {
      health.status = 'degraded';
    }

    // Calculate total response time
    health.metadata.uptime = Date.now() - startTime;

    logStep('Health check completed', { 
      status: health.status, 
      totalTime: health.metadata.uptime,
      checks: Object.fromEntries(
        Object.entries(health.checks).map(([key, value]) => [key, value.status])
      )
    });

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

    return new Response(JSON.stringify(health), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });

  } catch (error) {
    const errorResponse = {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    logStep('Health check failed with exception', { error: error.message });

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 503,
    });
  }
});