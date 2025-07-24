/**
 * Financial Intelligence Platform - Core Calculations
 * Exact implementation of dashboard element formulas
 */

// Z-score calculation for insight significance
export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

// Monthly Income calculation (K-1)
export function calculateMonthlyIncome(dailyIncomes: number[]): number {
  const last30Days = dailyIncomes.slice(-30);
  return (1/30) * last30Days.reduce((sum, income) => sum + income, 0);
}

// Savings Rate calculation (M-1)
export function calculateSavingsRate(incomes: number[], expenses: number[]): number {
  const totalIncome = incomes.reduce((sum, inc) => sum + inc, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp, 0);
  if (totalIncome === 0) return 0;
  return ((totalIncome - totalExpenses) / totalIncome) * 100;
}

// Momentum calculation for savings rate
export function calculateMomentum(savingsRates: number[]): number {
  if (savingsRates.length < 2) return 0;
  const current = savingsRates[savingsRates.length - 1];
  const previous = savingsRates[savingsRates.length - 2];
  return current - previous;
}

// Goals Velocity (K-3) - active goals with probability > 80%
export function calculateGoalsVelocity(goals: Array<{probability: number}>): number {
  return goals.filter(goal => goal.probability > 0.8).length;
}

// Resilience Score (K-4) - comprehensive financial health metric
export function calculateResilienceScore(
  runwayDays: number, 
  savingsRatePercentile: number, 
  liquidityBuffer: number
): number {
  const runwayComponent = 0.4 * Math.min(runwayDays / 90, 1); // Cap at 90 days
  const savingsComponent = 0.3 * (savingsRatePercentile / 100);
  const liquidityComponent = 0.3 * Math.min(liquidityBuffer / 10000, 1); // Cap at $10k
  
  return Math.round((runwayComponent + savingsComponent + liquidityComponent) * 100);
}

// Liquidity Runway (L-1) - days until cash hits zero
export function calculateLiquidityRunway(
  currentBalance: number,
  monthlyBurnRate: number
): number {
  if (monthlyBurnRate <= 0) return Infinity;
  return Math.floor((currentBalance / monthlyBurnRate) * 30);
}

// Category Coefficient of Variation for volatility detection
export function calculateCategoryCV(expenses: number[]): number {
  if (expenses.length === 0) return 0;
  
  const mean = expenses.reduce((sum, exp) => sum + exp, 0) / expenses.length;
  if (mean === 0) return 0;
  
  const variance = expenses.reduce((sum, exp) => sum + Math.pow(exp - mean, 2), 0) / expenses.length;
  const stdDev = Math.sqrt(variance);
  
  return stdDev / mean;
}

// Monte Carlo simulation for trajectory fan chart
export function runMonteCarloSimulation(
  initialValue: number,
  monthlyContribution: number,
  expectedReturn: number,
  volatility: number,
  months: number,
  simulations: number = 5000
): { p10: number[], p50: number[], p90: number[] } {
  const results: number[][] = [];
  
  for (let sim = 0; sim < simulations; sim++) {
    const trajectory: number[] = [initialValue];
    let currentValue = initialValue;
    
    for (let month = 1; month <= months; month++) {
      // Generate random return using normal distribution approximation
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      const monthlyReturn = expectedReturn / 12 + (volatility / Math.sqrt(12)) * z0;
      currentValue = currentValue * (1 + monthlyReturn) + monthlyContribution;
      trajectory.push(currentValue);
    }
    
    results.push(trajectory);
  }
  
  // Calculate percentiles for each time point
  const p10: number[] = [];
  const p50: number[] = [];
  const p90: number[] = [];
  
  for (let timePoint = 0; timePoint <= months; timePoint++) {
    const values = results.map(result => result[timePoint]).sort((a, b) => a - b);
    p10.push(values[Math.floor(simulations * 0.1)]);
    p50.push(values[Math.floor(simulations * 0.5)]);
    p90.push(values[Math.floor(simulations * 0.9)]);
  }
  
  return { p10, p50, p90 };
}

// Goal probability calculation using time and current progress
export function calculateGoalProbability(
  currentAmount: number,
  targetAmount: number,
  monthlyContribution: number,
  monthsRemaining: number,
  expectedReturn: number = 0.07
): number {
  if (monthsRemaining <= 0) return currentAmount >= targetAmount ? 1 : 0;
  
  const futureValue = currentAmount * Math.pow(1 + expectedReturn/12, monthsRemaining) +
    monthlyContribution * (Math.pow(1 + expectedReturn/12, monthsRemaining) - 1) / (expectedReturn/12);
  
  // Simple probability based on distance to target
  const achievementRatio = futureValue / targetAmount;
  return Math.min(achievementRatio * 0.8, 1); // Cap at 100%
}

// Behavioral pattern detection
export function detectSpendingPattern(dailyExpenses: number[]): string {
  if (dailyExpenses.length < 30) return 'Insufficient data';
  
  const last30Days = dailyExpenses.slice(-30);
  const firstHalf = last30Days.slice(0, 15);
  const secondHalf = last30Days.slice(15);
  
  const firstHalfAvg = firstHalf.reduce((sum, exp) => sum + exp, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, exp) => sum + exp, 0) / secondHalf.length;
  
  if (secondHalfAvg > firstHalfAvg * 1.3) {
    return 'Back-Half Spender';
  } else if (firstHalfAvg > secondHalfAvg * 1.3) {
    return 'Front-Loaded Spender';
  } else {
    return 'Consistent Spender';
  }
}

// Insight significance calculation using Z-score
export function calculateInsightSignificance(
  currentValue: number,
  historicalValues: number[]
): number {
  if (historicalValues.length < 2) return 0;
  
  const mean = historicalValues.reduce((sum, val) => sum + val, 0) / historicalValues.length;
  const variance = historicalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalValues.length;
  const stdDev = Math.sqrt(variance);
  
  const zScore = Math.abs(calculateZScore(currentValue, mean, stdDev));
  return Math.min(zScore / 3, 1); // Normalize to 0-1 scale
}