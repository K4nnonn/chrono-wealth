import React, { useCallback, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link as LinkIcon } from 'lucide-react';

interface PlaidLinkProps {
  onSuccess?: () => void;
  className?: string;
}

export const PlaidLink: React.FC<PlaidLinkProps> = ({ onSuccess, className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const createLinkToken = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('plaid-link-token', {
        body: { user_id: user.id }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create link token');
      }

      const data = response.data;
      setLinkToken(data.link_token);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating link token:', error);
      }
      toast({
        title: 'Connection Error',
        description: 'Failed to initialize bank connection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onPlaidSuccess = useCallback(async (public_token: string, metadata: any) => {
    if (!user) return;

    setLoading(true);
    try {
      // Exchange public token for access token
      const exchangeResponse = await supabase.functions.invoke('plaid-exchange-token', {
        body: {
          public_token,
          user_id: user.id,
        }
      });

      if (exchangeResponse.error) {
        throw new Error(exchangeResponse.error.message || 'Failed to exchange token');
      }

      const { access_token, item_id, institution_name } = exchangeResponse.data;

      // Store institution info
      const { error: institutionError } = await supabase
        .from('plaid_institutions')
        .insert({
          user_id: user.id,
          institution_id: metadata.institution?.institution_id || '',
          institution_name: institution_name || metadata.institution?.name || 'Unknown',
          access_token,
          item_id,
        });

      if (institutionError) throw institutionError;

      // Sync financial data
      const syncResponse = await supabase.functions.invoke('plaid-sync-data', {
        body: {
          access_token,
          user_id: user.id,
        }
      });

      if (syncResponse.error) {
        if (import.meta.env.DEV) {
          console.error('Failed to sync data:', syncResponse.error);
        }
      }

      if (!syncResponse.ok) {
        throw new Error('Failed to sync data');
      }

      const plaidData = await syncResponse.json();

      // Store comprehensive data
      const { error: dataError } = await supabase
        .from('plaid_data')
        .upsert({
          user_id: user.id,
          item_id,
          access_token,
          data: plaidData,
          accounts: plaidData.accounts,
          transactions: plaidData.transactions,
          identity: plaidData.identity,
          income: plaidData.income,
          assets: plaidData.assets,
          last_updated: new Date().toISOString(),
          status: 'active',
        });

      if (dataError) throw dataError;

      // Update user financial data with real data
      if (plaidData.computed_metrics) {
        const { error: financialError } = await supabase
          .from('user_financial_data')
          .upsert({
            user_id: user.id,
            annual_salary: plaidData.computed_metrics.monthly_income * 12,
            // We'll need to categorize transactions to get rent/subscriptions
            // For now, use existing values if available
          });

        if (financialError && import.meta.env.DEV) {
          console.error('Error updating financial data:', financialError);
        }
      }

      toast({
        title: 'Bank Connected Successfully',
        description: `Connected to ${institution_name}. Your financial data is now syncing.`,
      });

      onSuccess?.();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error connecting bank account:', error);
      }
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect your bank account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, onSuccess]);

  const onPlaidExit = useCallback(() => {
    setLoading(false);
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: onPlaidExit,
  });

  const handleConnect = () => {
    if (linkToken && ready) {
      open();
    } else {
      createLinkToken();
    }
  };

  // Auto-open when token is ready
  React.useEffect(() => {
    if (linkToken && ready && !loading) {
      open();
    }
  }, [linkToken, ready, open, loading]);

  return (
    <Button
      onClick={handleConnect}
      disabled={loading || !user}
      className={className}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <LinkIcon className="w-4 h-4 mr-2" />
          Connect Bank Account
        </>
      )}
    </Button>
  );
};