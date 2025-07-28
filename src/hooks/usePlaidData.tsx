import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PlaidAccount {
  account_id: string;
  balances: {
    available: number | null;
    current: number | null;
    limit: number | null;
  };
  mask: string;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string;
}

interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  category: string[];
  account_owner: string | null;
}

interface PlaidData {
  accounts: PlaidAccount[];
  transactions: PlaidTransaction[];
  computed_metrics?: {
    net_worth: number;
    total_assets: number;
    total_liabilities: number;
    monthly_income: number;
    monthly_expenses: number;
    monthly_savings: number;
  };
}

interface PlaidInstitution {
  id: string;
  institution_name: string;
  is_active: boolean;
  access_token: string;
  item_id: string;
}

export const usePlaidData = () => {
  const { user } = useAuth();
  const [plaidData, setPlaidData] = useState<PlaidData | null>(null);
  const [institutions, setInstitutions] = useState<PlaidInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaidData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch institutions
      const { data: institutionsData, error: institutionsError } = await supabase
        .from('plaid_institutions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (institutionsError) throw institutionsError;

      setInstitutions(institutionsData || []);

      // Fetch consolidated plaid data
      const { data: plaidDataResponse, error: plaidError } = await supabase
        .from('plaid_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (plaidError && plaidError.code !== 'PGRST116') {
        throw plaidError;
      }

      if (plaidDataResponse) {
        // Process the data to extract accounts and transactions
        const accountsData = plaidDataResponse.accounts as any;
        const transactionsData = plaidDataResponse.transactions as any;
        const dataObj = plaidDataResponse.data as any;
        
        const accounts = accountsData?.accounts || [];
        const transactions = transactionsData?.transactions || [];
        
        setPlaidData({
          accounts,
          transactions,
          computed_metrics: dataObj?.computed_metrics,
        });
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error fetching Plaid data:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    if (!user || institutions.length === 0) return;

    try {
      setError(null);
      
      // Sync data for all active institutions
      for (const institution of institutions) {
        const response = await supabase.functions.invoke('plaid-sync-data', {
          body: {
            access_token: institution.access_token,
            user_id: user.id,
          }
        });

        if (response.error) {
          throw new Error(response.error.message || `Failed to sync data for ${institution.institution_name}`);
        }

        const syncedData = await response.json();

        // Update the database
        const { error: updateError } = await supabase
          .from('plaid_data')
          .upsert({
            user_id: user.id,
            item_id: institution.item_id,
            access_token: institution.access_token,
            data: syncedData,
            accounts: syncedData.accounts,
            transactions: syncedData.transactions,
            identity: syncedData.identity,
            income: syncedData.income,
            assets: syncedData.assets,
            last_updated: new Date().toISOString(),
            status: 'active',
          });

        if (updateError) throw updateError;
      }

      // Refresh the data
      await fetchPlaidData();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error syncing Plaid data:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to sync data');
    }
  };

  const disconnectInstitution = async (institutionId: string) => {
    try {
      const { error } = await supabase
        .from('plaid_institutions')
        .update({ is_active: false })
        .eq('id', institutionId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Refresh data
      await fetchPlaidData();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error disconnecting institution:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    }
  };

  useEffect(() => {
    fetchPlaidData();
  }, [user]);

  return {
    plaidData,
    institutions,
    loading,
    error,
    syncData,
    disconnectInstitution,
    refetch: fetchPlaidData,
  };
};