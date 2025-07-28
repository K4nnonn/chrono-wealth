// Demo configuration for FlowSight Fi
// Used for demo mode to show fake data without real API calls

export const DEMO_CONFIG = {
  // Use fake data for demo mode
  USE_DEMO_DATA: true,
  DEMO_USER: {
    email: 'demo@flowsightfi.com',
    name: 'Demo User',
    id: 'demo-user-123'
  },
  // Demo API responses
  DEMO_API_DELAY: 1000, // Simulate network delay
  DEMO_FINANCIAL_DATA: {
    totalAssets: 125000,
    totalLiabilities: 45000,
    netWorth: 80000,
    monthlyIncome: 8500,
    monthlyExpenses: 6200,
    savingsRate: 0.27,
    creditScore: 742,
    financialHealthScore: 78
  },
  DEMO_GOALS: [
    {
      id: 'demo-goal-1',
      name: 'Emergency Fund',
      target_amount: 25000,
      current_amount: 18500,
      target_date: '2024-12-31',
      category: 'savings'
    },
    {
      id: 'demo-goal-2',
      name: 'Home Down Payment',
      target_amount: 100000,
      current_amount: 65000,
      target_date: '2025-06-30',
      category: 'investment'
    }
  ]
} as const;

export function isDemoMode(): boolean {
  return window.location.pathname === '/demo' || 
         window.location.pathname.startsWith('/demo/');
}

export function generateDemoUserData() {
  return {
    user: DEMO_CONFIG.DEMO_USER,
    financial: DEMO_CONFIG.DEMO_FINANCIAL_DATA,
    goals: DEMO_CONFIG.DEMO_GOALS,
    timestamp: new Date().toISOString()
  };
}

// Demo API simulation
export async function simulateApiCall<T>(data: T, delay?: number): Promise<T> {
  const actualDelay = delay ?? DEMO_CONFIG.DEMO_API_DELAY;
  await new Promise(resolve => setTimeout(resolve, actualDelay));
  return data;
}