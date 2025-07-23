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

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchFinancialData();
    } else {
      setProfile(null);
      setFinancialData(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
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
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
      setFinancialData(data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
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
      console.error('Error updating profile:', error);
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
      console.error('Error updating financial data:', error);
      return { success: false, error };
    }
  };

  return {
    profile,
    financialData,
    loading,
    updateProfile,
    updateFinancialData,
    refetch: () => {
      fetchProfile();
      fetchFinancialData();
    }
  };
};