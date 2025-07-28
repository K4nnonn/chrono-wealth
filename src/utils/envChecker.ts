// Environment variable checker for FlowSight Fi
import { ENV } from '@/config/env';

export function checkRequiredEnvVars() {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const optional = [
    'VITE_API_URL',
    'VITE_STRIPE_PUBLIC_KEY',
    'VITE_PLAID_PUBLIC_KEY'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  const missingOptional = optional.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0 && ENV.IS_PRODUCTION) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  if (missing.length > 0 && ENV.IS_DEVELOPMENT) {
    console.warn('Missing required environment variables (development mode):', missing);
  }
  
  if (missingOptional.length > 0 && ENV.IS_DEVELOPMENT) {
    console.info('Missing optional environment variables:', missingOptional);
  }
  
  return true;
}

export function getEnvironmentInfo() {
  return {
    mode: ENV.IS_PRODUCTION ? 'production' : 'development',
    hasSupabase: !!(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY),
    hasStripe: !!ENV.STRIPE_PUBLIC_KEY,
    hasPlaid: !!ENV.PLAID_PUBLIC_KEY,
    apiUrl: ENV.API_URL
  };
}