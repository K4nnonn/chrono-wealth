// Environment configuration for FlowSight Fi
// Security: Environment variables are stored in Vercel, not in .env files

export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'https://api.flowsightfi.com',
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  PLAID_PUBLIC_KEY: import.meta.env.VITE_PLAID_PUBLIC_KEY || '',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

// Type safety
export type EnvConfig = typeof ENV;

// Environment validation
export function validateEnvironment() {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    if (ENV.IS_PRODUCTION) {
      console.error('Missing required environment variables:', missing);
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    } else {
      console.warn('Missing environment variables (development mode):', missing);
    }
  }
  
  return true;
}