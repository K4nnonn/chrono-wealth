import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  onboarding_completed: boolean;
  risk_profile: string;
  preferred_currency: string;
  dark_mode: boolean;
  ai_voice_enabled: boolean;
  notifications_email: boolean;
  notifications_push: boolean;
}

interface FinancialData {
  annual_salary: number | null;
  monthly_rent: number | null;
  monthly_subscriptions: number | null;
  has_variable_income: boolean;
  has_dependents: boolean;
  emergency_fund_months: number;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPlaidData, setHasPlaidData] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchFinancialData();
      checkPlaidData();
    } else {
      setProfile(null);
      setFinancialData(null);
      setHasPlaidData(false);
      setLoading(false);
    }
  }, [user]);

  const checkPlaidData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('plaid_data')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1);

      if (error && error.code !== 'PGRST116') throw error;
      setHasPlaidData((data?.length || 0) > 0);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error checking Plaid data:', error);
      }
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data ? {
        id: data.id,
        email: data.email || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        onboarding_completed: data.onboarding_completed || false,
        risk_profile: data.risk_profile || 'moderate',
        preferred_currency: data.preferred_currency || 'USD',
        ai_voice_enabled: data.ai_voice_enabled ?? false,
        dark_mode: data.dark_mode ?? false,
        notifications_email: data.notifications_email ?? false,
        notifications_push: data.notifications_push ?? false
      } : null);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_financial_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
      setFinancialData(data ? {
        annual_salary: data.annual_salary,
        monthly_rent: data.monthly_rent,
        monthly_subscriptions: data.monthly_subscriptions,
        has_variable_income: data.has_variable_income ?? false,
        has_dependents: data.has_dependents ?? false,
        emergency_fund_months: data.emergency_fund_months ?? 3
      } : null);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching financial data:', error);
      }
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { success: true };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error updating profile:', error);
      }
      return { success: false, error };
    }
  };

  const updateFinancialData = async (data: Partial<FinancialData>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_financial_data')
        .upsert({
          user_id: user.id,
          ...data
        });

      if (error) throw error;
      
      setFinancialData(prev => prev ? { ...prev, ...data } : data as FinancialData);
      return { success: true };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error updating financial data:', error);
      }
      return { success: false, error };
    }
  };

  return {
    profile,
    financialData,
    loading,
    hasPlaidData,
    updateProfile,
    updateFinancialData,
    refetch: () => {
      fetchProfile();
      fetchFinancialData();
      checkPlaidData();
    }
  };
};