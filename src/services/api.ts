// API service for FlowSight Fi with real Supabase integration
import { supabase } from '@/integrations/supabase/client';

// Real API functions using Supabase
export async function fetchUserData() {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) {
    throw new Error('User not authenticated');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.user.id)
    .single();

  if (profileError) {
    throw new Error(`Profile fetch failed: ${profileError.message}`);
  }

  return { user: user.user, profile };
}

export async function fetchFinancialData() {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) {
    throw new Error('User not authenticated');
  }

  const { data: financialData, error } = await supabase
    .from('user_financial_data')
    .select('*')
    .eq('user_id', user.user.id)
    .single();

  if (error) {
    throw new Error(`Financial data fetch failed: ${error.message}`);
  }

  return financialData;
}

export async function fetchGoals() {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) {
    throw new Error('User not authenticated');
  }

  const { data: goals, error } = await supabase
    .from('financial_goals')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Goals fetch failed: ${error.message}`);
  }

  return goals || [];
}

export async function fetchTransactions() {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) {
    throw new Error('User not authenticated');
  }

  const { data: transactions, error } = await supabase
    .from('user_transactions')
    .select('*')
    .eq('user_id', user.user.id)
    .order('date', { ascending: false })
    .limit(1000);

  if (error) {
    throw new Error(`Transactions fetch failed: ${error.message}`);
  }

  return transactions || [];
}

// Export Supabase info for debugging
export function getApiConfig() {
  return {
    apiUrl: 'Supabase',
    isAuthenticated: true,
    isProduction: !import.meta.env.DEV,
    hasSupabaseConnection: !!supabase
  };
}