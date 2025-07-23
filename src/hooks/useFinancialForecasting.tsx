import { usePlaidData } from '@/hooks/usePlaidData';
import { useProfile } from '@/hooks/useProfile';

interface FinancialProjection {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  netWorth: number;
  emergencyFund: number;
  goalProgress: number;
}

interface ScenarioAnalysis {
  scenario: 'current' | 'optimistic' | 'conservative' | 'crisis';
  projections: FinancialProjection[];
  summary: {
    finalNetWorth: number;
    goalAchievementMonths: number;
    emergencyFundCoverage: number;
    riskScore: number;
  };
}

export const useFinancialForecasting = () => {
  const { plaidData } = usePlaidData();
  const { financialData } = useProfile();

  const calculateBaseMetrics = () => {
    const monthlyIncome = plaidData?.computed_metrics?.monthly_income || 
                         (financialData?.annual_salary ? financialData.annual_salary / 12 : 0);
    
    const monthlyExpenses = plaidData?.computed_metrics?.monthly_expenses ||
                           ((financialData?.monthly_rent || 0) + (financialData?.monthly_subscriptions || 0));
    
    const currentNetWorth = plaidData?.computed_metrics?.net_worth || 0;
    const monthlySavings = monthlyIncome - monthlyExpenses;
    
    return {
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      currentNetWorth,
      savingsRate: monthlyIncome > 0 ? (monthlySavings / monthlyIncome) : 0
    };
  };

  const generateProjections = (
    scenario: ScenarioAnalysis['scenario'],
    months: number = 24
  ): FinancialProjection[] => {
    const base = calculateBaseMetrics();
    const projections: FinancialProjection[] = [];
    
    // Scenario modifiers
    const modifiers = {
      current: { income: 1.0, expenses: 1.0, growth: 0.02 },
      optimistic: { income: 1.1, expenses: 0.95, growth: 0.05 },
      conservative: { income: 0.95, expenses: 1.05, growth: 0.01 },
      crisis: { income: 0.7, expenses: 1.2, growth: -0.02 }
    };
    
    const modifier = modifiers[scenario];
    let runningNetWorth = base.currentNetWorth;
    let runningEmergencyFund = base.monthlySavings * (financialData?.emergency_fund_months || 3);
    
    for (let i = 0; i < months; i++) {
      const monthlyGrowth = Math.pow(1 + modifier.growth, i / 12);
      const adjustedIncome = base.monthlyIncome * modifier.income * monthlyGrowth;
      const adjustedExpenses = base.monthlyExpenses * modifier.expenses * (1 + (i * 0.002)); // inflation
      const monthlySavings = adjustedIncome - adjustedExpenses;
      
      runningNetWorth += monthlySavings;
      runningEmergencyFund += Math.max(0, monthlySavings * 0.3); // 30% to emergency fund
      
      projections.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }),
        income: adjustedIncome,
        expenses: adjustedExpenses,
        savings: monthlySavings,
        netWorth: runningNetWorth,
        emergencyFund: runningEmergencyFund,
        goalProgress: Math.min(100, (runningNetWorth / 100000) * 100) // Assuming $100k goal
      });
    }
    
    return projections;
  };

  const analyzeScenario = (scenario: ScenarioAnalysis['scenario']): ScenarioAnalysis => {
    const projections = generateProjections(scenario);
    const final = projections[projections.length - 1];
    
    // Calculate goal achievement timeline
    const goalTarget = 100000; // $100k net worth goal
    const goalAchievementMonths = projections.findIndex(p => p.netWorth >= goalTarget) + 1 || 24;
    
    // Calculate emergency fund coverage
    const emergencyFundCoverage = final.emergencyFund / (final.expenses * 6); // 6 months coverage
    
    // Calculate risk score based on volatility and savings rate
    const savingsRates = projections.map(p => p.savings / p.income);
    const avgSavingsRate = savingsRates.reduce((a, b) => a + b, 0) / savingsRates.length;
    const riskScore = Math.max(0, Math.min(100, 100 - (avgSavingsRate * 200))); // Lower savings = higher risk
    
    return {
      scenario,
      projections,
      summary: {
        finalNetWorth: final.netWorth,
        goalAchievementMonths,
        emergencyFundCoverage,
        riskScore
      }
    };
  };

  const generateForecastInsights = (): string[] => {
    const base = calculateBaseMetrics();
    const current = analyzeScenario('current');
    const optimistic = analyzeScenario('optimistic');
    const crisis = analyzeScenario('crisis');
    
    const insights: string[] = [];
    
    // Savings rate analysis
    if (base.savingsRate > 0.2) {
      insights.push("💪 Excellent savings rate! You're on track for early financial independence.");
    } else if (base.savingsRate > 0.1) {
      insights.push("👍 Good savings rate. Consider increasing by 5% to accelerate wealth building.");
    } else if (base.savingsRate > 0) {
      insights.push("⚠️ Low savings rate detected. Optimizing expenses could improve your financial trajectory.");
    } else {
      insights.push("🚨 Negative savings rate. Immediate budget optimization recommended.");
    }
    
    // Goal achievement comparison
    const goalDiff = optimistic.summary.goalAchievementMonths - current.summary.goalAchievementMonths;
    if (goalDiff > 6) {
      insights.push(`🎯 Optimizing your finances could help you reach your goals ${goalDiff} months earlier.`);
    }
    
    // Crisis resilience
    if (crisis.summary.finalNetWorth < 0) {
      insights.push("🛡️ Building a larger emergency fund would improve your crisis resilience.");
    }
    
    // Net worth growth potential
    const netWorthGrowth = ((current.summary.finalNetWorth - base.currentNetWorth) / base.currentNetWorth) * 100;
    insights.push(`📈 Current trajectory projects ${netWorthGrowth.toFixed(1)}% net worth growth over 2 years.`);
    
    return insights;
  };

  const calculateWhatIfScenario = (adjustments: {
    incomeChange?: number;
    expenseChange?: number;
    additionalSavings?: number;
  }) => {
    const base = calculateBaseMetrics();
    const adjustedIncome = base.monthlyIncome + (adjustments.incomeChange || 0);
    const adjustedExpenses = base.monthlyExpenses + (adjustments.expenseChange || 0);
    const adjustedSavings = (adjustedIncome - adjustedExpenses) + (adjustments.additionalSavings || 0);
    
    // Project 12 months forward
    const futureNetWorth = base.currentNetWorth + (adjustedSavings * 12);
    const monthsToGoal = adjustedSavings > 0 ? Math.ceil((100000 - base.currentNetWorth) / adjustedSavings) : Infinity;
    
    return {
      newMonthlySavings: adjustedSavings,
      newSavingsRate: adjustedIncome > 0 ? adjustedSavings / adjustedIncome : 0,
      futureNetWorth,
      monthsToGoal: monthsToGoal === Infinity ? "Never" : monthsToGoal,
      improvementVsCurrent: adjustedSavings - base.monthlySavings
    };
  };

  return {
    calculateBaseMetrics,
    generateProjections,
    analyzeScenario,
    generateForecastInsights,
    calculateWhatIfScenario,
    currentMetrics: calculateBaseMetrics()
  };
};