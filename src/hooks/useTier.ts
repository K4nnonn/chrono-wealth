import { useAuth } from '@supabase/auth-helpers-react';
import type { Tier } from '../config/tiers';

// Hook that returns the current user's subscription tier. Falls back to 'Free' if no session or tier is present.
export const useTier = (): Tier => {
  const { session } = useAuth();
  const tier = (session?.user?.app_metadata as any)?.subscription_tier;
  return (tier as Tier) ?? 'Free';
};
