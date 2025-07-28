// Financial Health Scorecard Score (FHSS) Calculation Engine
// Real-time client-side calculations with confidence intervals

export interface FinancialProfile {
  // Income Data
  monthlyIncome: number;
  incomeStability: number; // 1-10 scale
  incomeSourceCount: number;
  
  // Expense Data
  monthlyExpenses: number;
  essentialExpenses: number;
  discretionaryExpenses: number;
  
  // Debt Data
  totalDebt: number;
  monthlyDebtPayments: number;
  creditUtilization: number; // 0-1 scale
  creditScore?: number;
  
  // Asset Data
  liquidSavings: number;
  investmentAccounts: number;
  retirementAccounts: number;
  
  // Demographics
  age: number;
  location: string;
  dependents: number;
  segment?: string;
}

export interface FHSSSubScores {
  liquidity: number;
  debt: number;
  savings: number;
  incomeStability: number;
  expensePredictability: number;
  growth: number;
}

export interface FHSSResponse {
  fhss: number;
  subScores: FHSSSubScores;
  confidence: number;
  ci95: [number, number];
  segment: string;
  recommendations: string[];
  criticalIssues: string[];
}

export interface ConfidenceInterval {
  confidence: number;
  range: [number, number];
}

// Segment-based weights for FHSS calculation
const SEGMENT_WEIGHTS: Record<string, Record<keyof FHSSSubScores, number>> = {
  EarlyCareer: {
    liquidity: 0.25,
    debt: 0.20,
    savings: 0.15,
    incomeStability: 0.15,
    expensePredictability: 0.15,
    growth: 0.10
  },
  MidCareer: {
    liquidity: 0.20,
    debt: 0.25,
    savings: 0.20,
    incomeStability: 0.10,
    expensePredictability: 0.15,
    growth: 0.10
  },
  PreRetirement: {
    liquidity: 0.15,
    debt: 0.15,
    savings: 0.30,
    incomeStability: 0.20,
    expensePredictability: 0.10,
    growth: 0.10
  },
  DebtRecovery: {
    liquidity: 0.30,
    debt: 0.40,
    savings: 0.10,
    incomeStability: 0.15,
    expensePredictability: 0.05,
    growth: 0.00
  }
};

// Calculate liquidity score based on emergency fund ratio
export function calculateLiquidityScore(
  liquidSavings: number,
  monthlyExpenses: number,
  incomeStability: number
): number {
  const emergencyFundRatio = liquidSavings / (monthlyExpenses || 1);
  const stabilityMultiplier = incomeStability / 10;
  
  // Target emergency fund months based on income stability
  const targetMonths = Math.max(3, 9 - incomeStability);
  
  let score = Math.min(emergencyFundRatio / targetMonths, 1.0);
  
  // Bonus for exceeding targets
  if (emergencyFundRatio > targetMonths) {
    score = Math.min(score + 0.1, 1.0);
  }
  
  return Math.max(0, Math.min(1, score));
}

// Calculate debt score based on DTI and utilization
export function calculateDebtScore(
  monthlyDebtPayments: number,
  monthlyIncome: number,
  creditUtilization: number,
  totalDebt: number
): number {
  const dti = monthlyDebtPayments / (monthlyIncome || 1);
  
  // DTI scoring (lower is better)
  let dtiScore = 1.0;
  if (dti > 0.43) dtiScore = 0.0;        // Critical
  else if (dti > 0.36) dtiScore = 0.3;   // Poor
  else if (dti > 0.28) dtiScore = 0.6;   // Fair
  else if (dti > 0.20) dtiScore = 0.8;   // Good
  // else dtiScore = 1.0 (Excellent)
  
  // Credit utilization scoring
  let utilizationScore = 1.0;
  if (creditUtilization > 0.90) utilizationScore = 0.0;
  else if (creditUtilization > 0.70) utilizationScore = 0.2;
  else if (creditUtilization > 0.50) utilizationScore = 0.4;
  else if (creditUtilization > 0.30) utilizationScore = 0.7;
  else if (creditUtilization > 0.10) utilizationScore = 0.9;
  // else utilizationScore = 1.0
  
  // Weight DTI more heavily than utilization
  return (dtiScore * 0.7) + (utilizationScore * 0.3);
}

// Calculate savings score based on savings rate and consistency
export function calculateSavingsScore(
  monthlyIncome: number,
  monthlyExpenses: number,
  investmentAccounts: number,
  retirementAccounts: number
): number {
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlySavings / (monthlyIncome || 1);
  
  // Savings rate scoring
  let rateScore = 0;
  if (savingsRate < 0) rateScore = 0.0;        // Spending more than earning
  else if (savingsRate < 0.05) rateScore = 0.2; // Less than 5%
  else if (savingsRate < 0.10) rateScore = 0.4; // 5-10%
  else if (savingsRate < 0.15) rateScore = 0.6; // 10-15%
  else if (savingsRate < 0.20) rateScore = 0.8; // 15-20%
  else rateScore = 1.0;                          // 20%+
  
  // Investment allocation bonus
  const totalInvestments = investmentAccounts + retirementAccounts;
  const investmentBonus = Math.min(totalInvestments / (monthlyIncome * 12), 0.2);
  
  return Math.min(rateScore + investmentBonus, 1.0);
}

// Calculate income stability score
export function calculateIncomeStabilityScore(
  incomeStability: number,
  incomeSourceCount: number
): number {
  const stabilityScore = incomeStability / 10;
  const diversificationBonus = Math.min((incomeSourceCount - 1) * 0.1, 0.2);
  
  return Math.min(stabilityScore + diversificationBonus, 1.0);
}

// Calculate expense predictability score
export function calculateExpensePredictabilityScore(
  essentialExpenses: number,
  discretionaryExpenses: number,
  monthlyIncome: number
): number {
  const totalExpenses = essentialExpenses + discretionaryExpenses;
  const essentialRatio = essentialExpenses / totalExpenses;
  const expenseToIncomeRatio = totalExpenses / (monthlyIncome || 1);
  
  // Higher essential ratio = more predictable
  let predictabilityScore = essentialRatio;
  
  // Penalty for high expense-to-income ratio
  if (expenseToIncomeRatio > 0.80) predictabilityScore *= 0.7;
  else if (expenseToIncomeRatio > 0.60) predictabilityScore *= 0.9;
  
  return Math.max(0, Math.min(1, predictabilityScore));
}

// Calculate growth score based on investment trajectory
export function calculateGrowthScore(
  age: number,
  investmentAccounts: number,
  retirementAccounts: number,
  monthlyIncome: number
): number {
  const totalInvestments = investmentAccounts + retirementAccounts;
  const annualIncome = monthlyIncome * 12;
  
  // Age-based investment targets
  let targetMultiplier = 0;
  if (age < 30) targetMultiplier = 0.5;
  else if (age < 40) targetMultiplier = 2.0;
  else if (age < 50) targetMultiplier = 4.0;
  else if (age < 60) targetMultiplier = 8.0;
  else targetMultiplier = 10.0;
  
  const targetInvestments = annualIncome * targetMultiplier;
  const growthScore = Math.min(totalInvestments / (targetInvestments || 1), 1.0);
  
  return growthScore;
}

// Determine user segment based on profile
export function determineSegment(profile: FinancialProfile): string {
  const { age, totalDebt, monthlyIncome, monthlyDebtPayments } = profile;
  const dti = monthlyDebtPayments / (monthlyIncome || 1);
  
  if (dti > 0.50 || totalDebt > monthlyIncome * 24) {
    return 'DebtRecovery';
  } else if (age < 35) {
    return 'EarlyCareer';
  } else if (age < 55) {
    return 'MidCareer';
  } else {
    return 'PreRetirement';
  }
}

// Calculate geometric mean with weights
function calculateWeightedGeometricMean(
  scores: FHSSSubScores,
  weights: Record<keyof FHSSSubScores, number>
): number {
  let product = 1;
  let totalWeight = 0;
  
  for (const [key, score] of Object.entries(scores)) {
    const weight = weights[key as keyof FHSSSubScores];
    product *= Math.pow(Math.max(score, 0.01), weight); // Avoid log(0)
    totalWeight += weight;
  }
  
  return Math.pow(product, 1 / totalWeight);
}

// Bootstrap confidence interval calculation
export function calculateBootstrapCI(
  profile: FinancialProfile,
  iterations: number = 500
): ConfidenceInterval {
  const scores: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    // Add random noise to simulate uncertainty
    const noisyProfile = {
      ...profile,
      monthlyIncome: profile.monthlyIncome * (0.9 + Math.random() * 0.2),
      monthlyExpenses: profile.monthlyExpenses * (0.9 + Math.random() * 0.2),
      liquidSavings: profile.liquidSavings * (0.8 + Math.random() * 0.4),
      creditUtilization: Math.min(1, Math.max(0, profile.creditUtilization + (Math.random() - 0.5) * 0.2))
    };
    
    const result = computeFHSS(noisyProfile);
    scores.push(result.fhss);
  }
  
  scores.sort((a, b) => a - b);
  const lower = scores[Math.floor(scores.length * 0.025)];
  const upper = scores[Math.floor(scores.length * 0.975)];
  
  const variance = scores.reduce((sum, score, _, arr) => {
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    return sum + Math.pow(score - mean, 2);
  }, 0) / scores.length;
  
  const confidence = 1 - Math.sqrt(variance);
  
  return {
    confidence: Math.max(0.5, Math.min(1, confidence)),
    range: [lower, upper]
  };
}

// Generate recommendations based on scores
function generateRecommendations(subScores: FHSSSubScores, profile: FinancialProfile): string[] {
  const recommendations: string[] = [];
  
  if (subScores.liquidity < 0.4) {
    recommendations.push("Build emergency fund: Aim for 3-6 months of expenses in liquid savings");
  }
  
  if (subScores.debt < 0.5) {
    const dti = profile.monthlyDebtPayments / profile.monthlyIncome;
    if (dti > 0.36) {
      recommendations.push("Reduce debt burden: Consider debt consolidation or payment acceleration");
    }
    if (profile.creditUtilization > 0.30) {
      recommendations.push("Lower credit utilization: Pay down credit card balances below 30%");
    }
  }
  
  if (subScores.savings < 0.5) {
    const savingsRate = (profile.monthlyIncome - profile.monthlyExpenses) / profile.monthlyIncome;
    if (savingsRate < 0.10) {
      recommendations.push("Increase savings rate: Target saving at least 10-15% of income");
    }
  }
  
  if (subScores.growth < 0.4 && profile.age < 55) {
    recommendations.push("Boost retirement savings: Maximize employer 401(k) match and consider IRA");
  }
  
  return recommendations;
}

// Identify critical financial issues
function identifyCriticalIssues(subScores: FHSSSubScores, profile: FinancialProfile): string[] {
  const issues: string[] = [];
  
  if (profile.monthlyIncome < profile.monthlyExpenses) {
    issues.push("CRITICAL: Monthly expenses exceed income");
  }
  
  if (subScores.liquidity < 0.2) {
    issues.push("CRITICAL: Insufficient emergency fund - financial shock vulnerability");
  }
  
  const dti = profile.monthlyDebtPayments / profile.monthlyIncome;
  if (dti > 0.50) {
    issues.push("CRITICAL: Debt payments consume over 50% of income");
  }
  
  if (profile.creditUtilization > 0.90) {
    issues.push("CRITICAL: Credit utilization near maximum - credit score at risk");
  }
  
  return issues;
}

// Main FHSS calculation function
export function computeFHSS(profile: Partial<FinancialProfile>): FHSSResponse {
  // Set defaults for missing data
  const completeProfile: FinancialProfile = {
    monthlyIncome: profile.monthlyIncome || 0,
    incomeStability: profile.incomeStability || 5,
    incomeSourceCount: profile.incomeSourceCount || 1,
    monthlyExpenses: profile.monthlyExpenses || 0,
    essentialExpenses: profile.essentialExpenses || profile.monthlyExpenses || 0,
    discretionaryExpenses: profile.discretionaryExpenses || 0,
    totalDebt: profile.totalDebt || 0,
    monthlyDebtPayments: profile.monthlyDebtPayments || 0,
    creditUtilization: profile.creditUtilization || 0,
    liquidSavings: profile.liquidSavings || 0,
    investmentAccounts: profile.investmentAccounts || 0,
    retirementAccounts: profile.retirementAccounts || 0,
    age: profile.age || 30,
    location: profile.location || 'US',
    dependents: profile.dependents || 0,
    segment: profile.segment
  };
  
  // Calculate sub-scores
  const subScores: FHSSSubScores = {
    liquidity: calculateLiquidityScore(
      completeProfile.liquidSavings,
      completeProfile.monthlyExpenses,
      completeProfile.incomeStability
    ),
    debt: calculateDebtScore(
      completeProfile.monthlyDebtPayments,
      completeProfile.monthlyIncome,
      completeProfile.creditUtilization,
      completeProfile.totalDebt
    ),
    savings: calculateSavingsScore(
      completeProfile.monthlyIncome,
      completeProfile.monthlyExpenses,
      completeProfile.investmentAccounts,
      completeProfile.retirementAccounts
    ),
    incomeStability: calculateIncomeStabilityScore(
      completeProfile.incomeStability,
      completeProfile.incomeSourceCount
    ),
    expensePredictability: calculateExpensePredictabilityScore(
      completeProfile.essentialExpenses,
      completeProfile.discretionaryExpenses,
      completeProfile.monthlyIncome
    ),
    growth: calculateGrowthScore(
      completeProfile.age,
      completeProfile.investmentAccounts,
      completeProfile.retirementAccounts,
      completeProfile.monthlyIncome
    )
  };
  
  // Determine segment and get weights
  const segment = completeProfile.segment || determineSegment(completeProfile);
  const weights = SEGMENT_WEIGHTS[segment] || SEGMENT_WEIGHTS.MidCareer;
  
  // Calculate overall FHSS
  const fhss = calculateWeightedGeometricMean(subScores, weights);
  
  // Calculate confidence interval
  const ci = calculateBootstrapCI(completeProfile);
  
  // Generate recommendations and identify issues
  const recommendations = generateRecommendations(subScores, completeProfile);
  const criticalIssues = identifyCriticalIssues(subScores, completeProfile);
  
  return {
    fhss,
    subScores,
    confidence: ci.confidence,
    ci95: ci.range,
    segment,
    recommendations,
    criticalIssues
  };
}

// Utility function for what-if analysis
export function computeWhatIf(
  baseProfile: FinancialProfile,
  changes: Partial<FinancialProfile>
): { original: FHSSResponse; modified: FHSSResponse; impact: number } {
  const original = computeFHSS(baseProfile);
  const modified = computeFHSS({ ...baseProfile, ...changes });
  const impact = modified.fhss - original.fhss;
  
  return { original, modified, impact };
}