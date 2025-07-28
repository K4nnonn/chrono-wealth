// Feature flags for FlowSight Fi
import { ENV } from '@/config/env';

export const FEATURES = {
  // Enable demo mode in all environments
  DEMO_MODE: true,
  
  // Only enable in production
  ANALYTICS: ENV.IS_PRODUCTION,
  ERROR_REPORTING: ENV.IS_PRODUCTION,
  PERFORMANCE_MONITORING: ENV.IS_PRODUCTION,
  
  // Enable in development for testing
  DEBUG_MODE: ENV.IS_DEVELOPMENT,
  SHOW_DEV_TOOLS: ENV.IS_DEVELOPMENT,
  MOCK_API_RESPONSES: ENV.IS_DEVELOPMENT,
  
  // Feature-specific flags
  PLAID_INTEGRATION: !!ENV.PLAID_PUBLIC_KEY,
  STRIPE_PAYMENTS: !!ENV.STRIPE_PUBLIC_KEY,
  AI_CHAT: true, // Always enabled
  ADVANCED_FORECASTING: true,
  BEHAVIORAL_INSIGHTS: true,
  
  // UI Features
  DARK_MODE: true,
  ANIMATIONS: true,
  EXPERIMENTAL_UI: ENV.IS_DEVELOPMENT,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURES[flag];
}

export function getEnabledFeatures(): FeatureFlag[] {
  return Object.entries(FEATURES)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag as FeatureFlag);
}

export function getEnvironmentFeatures() {
  return {
    environment: ENV.IS_PRODUCTION ? 'production' : 'development',
    enabledFeatures: getEnabledFeatures(),
    hasExternalIntegrations: {
      plaid: FEATURES.PLAID_INTEGRATION,
      stripe: FEATURES.STRIPE_PAYMENTS,
    }
  };
}