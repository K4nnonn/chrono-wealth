import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const checkSubscription = async (showToast = false) => {
    if (!user || !session) {
      setSubscriptionData({ subscribed: false });
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      console.log('Checking subscription status...');

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

      console.log('Subscription data received:', data);
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

  const createCheckout = async () => {
    if (!user || !session) {
      toast.error('Please log in to subscribe');
      return;
    }

    try {
      console.log('Creating checkout session...');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
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
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
      } else {
        toast.error('Invalid checkout session response');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
    }
  };

  const openCustomerPortal = async () => {
    if (!user || !session) {
      toast.error('Please log in to manage subscription');
      return;
    }

    try {
      console.log('Opening customer portal...');
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
        // Open Stripe customer portal in new tab
        window.open(data.url, '_blank');
      } else {
        toast.error('Invalid portal session response');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open billing portal');
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscriptionData({ subscribed: false });
      setLoading(false);
    }
  }, [user]);

  // Auto-refresh subscription status every 30 seconds when tab is visible
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