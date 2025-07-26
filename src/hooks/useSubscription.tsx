import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

/**
 * Custom hook for retrieving and managing a user's subscription status.
 *
 * This hook exposes the current subscription information along with a handful
 * of helpers for checking the status, initiating a checkout session and
 * opening the customer portal. The checkout helper now accepts an optional
 * tier argument (defaulting to the "Core" plan) and sends that along to the
 * Supabase Edge Function, which forwards it to Stripe. Without this body
 * parameter, the backend could only ever default to the Core plan.
 */
export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch the current subscription state for the logged‑in user.
   *
   * Optionally displays a toast upon completion; useful for manual refreshes.
   */
  const checkSubscription = async (showToast = false) => {
    if (!user || !session) {
      setSubscriptionData({ subscribed: false });
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Subscription check error:', error);
        if (showToast) {
          toast.error('Failed to check subscription status');
        }
        return;
      }

      setSubscriptionData(data);
      if (showToast) {
        if (data.subscribed) {
          toast.success(`Subscription active: ${data.subscription_tier} plan`);
        } else {
          toast.info('No active subscription found');
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      if (showToast) {
        toast.error('Failed to check subscription status');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Begin a Stripe checkout session for the given subscription tier.
   *
   * If no tier is provided, the user will be placed on the Core plan by
   * default. This helper injects both the JWT for Supabase authentication
   * (via the `Authorization` header) and a JSON body containing the tier.
   */
  const createCheckout = async (
    tier: 'Core' | 'Plus' | 'Pro' | 'Advisory' = 'Core'
  ) => {
    if (!user || !session) {
      toast.error('Please log in to subscribe');
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) {
        console.error('Checkout creation error:', error);
        toast.error('Failed to create checkout session');
        return;
      }
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        toast.error('Invalid checkout session response');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
    }
  };

  /**
   * Opens the Stripe customer billing portal for the current user.
   */
  const openCustomerPortal = async () => {
    if (!user || !session) {
      toast.error('Please log in to manage subscription');
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) {
        console.error('Customer portal error:', error);
        toast.error('Failed to open billing portal');
        return;
      }
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        toast.error('Invalid portal session response');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open billing portal');
    }
  };

  // Check subscription on mount and whenever the user object changes.
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscriptionData({ subscribed: false });
      setLoading(false);
    }
  }, [user]);

  // Refresh the subscription status periodically when the tab is visible.
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !document.hidden) {
        checkSubscription();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return {
    ...subscriptionData,
    loading,
    refreshing,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    refresh: () => checkSubscription(true),
  };
};
