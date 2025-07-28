// API service for FlowSight Fi with environment variable support
import { ENV } from '@/config/env';
import { isDemoMode, simulateApiCall, generateDemoUserData } from '@/config/demo';

// Helper to get auth token (implement based on your auth system)
function getAuthToken(): string | null {
  // This would typically get from localStorage, cookies, or auth context
  return localStorage.getItem('auth_token');
}

// Demo mode API simulation
export async function fetchUserData() {
  // In demo mode, return fake data
  if (isDemoMode()) {
    const demoData = generateDemoUserData();
    return simulateApiCall(demoData);
  }
  
  // Real API call
  const token = getAuthToken();
  const response = await fetch(`${ENV.API_URL}/user`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchFinancialData() {
  if (isDemoMode()) {
    const demoData = generateDemoUserData();
    return simulateApiCall(demoData.financial);
  }
  
  const token = getAuthToken();
  const response = await fetch(`${ENV.API_URL}/financial`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Financial data fetch failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchGoals() {
  if (isDemoMode()) {
    const demoData = generateDemoUserData();
    return simulateApiCall(demoData.goals);
  }
  
  const token = getAuthToken();
  const response = await fetch(`${ENV.API_URL}/goals`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Goals fetch failed: ${response.statusText}`);
  }
  
  return response.json();
}

// Export environment info for debugging
export function getApiConfig() {
  return {
    apiUrl: ENV.API_URL,
    isDemoMode: isDemoMode(),
    isProduction: ENV.IS_PRODUCTION,
    hasPaidIntegrations: !!(ENV.STRIPE_PUBLIC_KEY && ENV.PLAID_PUBLIC_KEY)
  };
}