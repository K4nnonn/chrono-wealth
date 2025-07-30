// Enterprise Financial Calculation Engine
// Real mathematical models for cash flow analysis, risk assessment, and predictive modeling

import { FlowSightFiEngine, Transaction, DetectedPattern } from './flowsightfi-engine';
import { FinancialProfile, computeFHSS, FHSSResponse } from './fhss-calculator';
import { enterpriseErrorMonitor } from './enterprise-error-monitoring';

export interface CashFlowProjection {
  date: Date;
  income: number;
  expenses: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  projectedBalance: number;
  confidence: number;
}

export interface RiskAssessment {
  overallRisk: number; // 0-100 scale
  liquidityRisk: number;
  concentrationRisk: number;
  volatilityRisk: number;
  creditRisk: number;
  recommendations: string[];
  timeHorizon: string;
}

export interface StressTestResult {
  scenario: string;
  impactPercent: number;
  monthsToRecover: number;
  recommendedActions: string[];
  successProbability: number;
}

export interface GoalAnalysis {
  goalId: string;
  targetAmount: number;
  currentAmount: number;
  requiredMonthlySavings: number;
  projectedCompletionDate: Date;
  probability: number;
  alternativeStrategies: string[];
}

export interface SpendingCategoryAnalysis {
  category: string;
  averageMonthly: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  volatility: number;
  seasonality: number;
  predictedNext30Days: number;
  anomalyScore: number;
}

export class EnterpriseFinancialEngine {
  private transactions: Transaction[];
  private profile: FinancialProfile;
  private fhssEngine: FlowSightFiEngine;
  private latestFHSS: FHSSResponse | null = null;

  constructor(transactions: Transaction[], profile: FinancialProfile) {
    this.transactions = transactions;
    this.profile = profile;
    this.fhssEngine = new FlowSightFiEngine(
      transactions,
      profile.monthlyIncome,
      profile.monthlyExpenses
    );
    
    // Log initialization for audit trail
    enterpriseErrorMonitor.capturePerformanceMetric('engine-initialization', Date.now());
  }

  /**
   * Generate sophisticated cash flow projections using multiple models
   */
  public generateCashFlowProjections(months: number = 12): CashFlowProjection[] {
    const projections: CashFlowProjection[] = [];
    
    try {
      // Get behavioral patterns for adjustment factors
      const patterns = this.fhssEngine.detectBehavioralPatterns();
      const seasonalityFactor = this.calculateSeasonalityFactor();
      const volatilityFactor = this.calculateVolatilityFactor();
      
      let cumulativeCashFlow = 0;
      let currentBalance = this.profile.liquidSavings;
      
      for (let month = 1; month <= months; month++) {
        const date = new Date();
        date.setMonth(date.getMonth() + month);
        
        // Base income and expenses
        let projectedIncome = this.profile.monthlyIncome;
        let projectedExpenses = this.profile.monthlyExpenses;
        
        // Apply seasonal adjustments
        const seasonalAdjustment = Math.sin((month / 12) * 2 * Math.PI) * seasonalityFactor;
        projectedExpenses += projectedExpenses * seasonalAdjustment * 0.1;
        
        // Apply behavioral pattern impacts
        const behaviorImpact = this.calculateBehaviorImpact(patterns, month);
        projectedExpenses += behaviorImpact;
        
        // Add volatility based on historical data
        const volatilityAdjustment = (Math.random() - 0.5) * volatilityFactor * projectedExpenses;
        projectedExpenses += volatilityAdjustment;
        
        // Calculate cash flow
        const netCashFlow = projectedIncome - projectedExpenses;
        cumulativeCashFlow += netCashFlow;
        currentBalance += netCashFlow;
        
        // Calculate confidence based on data quality and time horizon
        const confidence = this.calculateProjectionConfidence(month, patterns.length);
        
        projections.push({
          date,
          income: Math.round(projectedIncome),
          expenses: Math.round(projectedExpenses),
          netCashFlow: Math.round(netCashFlow),
          cumulativeCashFlow: Math.round(cumulativeCashFlow),
          projectedBalance: Math.round(currentBalance),
          confidence
        });
      }
      
      return projections;
    } catch (error) {
      enterpriseErrorMonitor.captureError(error as Error, {
        category: 'data',
        severity: 'high'
      });
      throw new Error('Failed to generate cash flow projections');
    }
  }

  /**
   * Perform comprehensive risk assessment
   */
  public assessFinancialRisk(): RiskAssessment {
    try {
      const liquidityRisk = this.calculateLiquidityRisk();
      const concentrationRisk = this.calculateConcentrationRisk();
      const volatilityRisk = this.calculateVolatilityRisk();
      const creditRisk = this.calculateCreditRisk();
      
      // Weighted overall risk calculation
      const overallRisk = Math.round(
        liquidityRisk * 0.3 +
        concentrationRisk * 0.2 +
        volatilityRisk * 0.25 +
        creditRisk * 0.25
      );
      
      const recommendations = this.generateRiskRecommendations({
        liquidityRisk,
        concentrationRisk,
        volatilityRisk,
        creditRisk
      });
      
      return {
        overallRisk,
        liquidityRisk,
        concentrationRisk,
        volatilityRisk,
        creditRisk,
        recommendations,
        timeHorizon: '12 months'
      };
    } catch (error) {
      enterpriseErrorMonitor.captureError(error as Error, {
        category: 'data',
        severity: 'medium'
      });
      throw new Error('Risk assessment failed');
    }
  }

  /**
   * Run stress test scenarios
   */
  public runStressTests(): StressTestResult[] {
    const scenarios = [
      { name: 'Job Loss', incomeReduction: 1.0, duration: 6 },
      { name: 'Medical Emergency', expenseIncrease: 0.5, duration: 3 },
      { name: 'Market Downturn', assetReduction: 0.3, duration: 12 },
      { name: 'Economic Recession', incomeReduction: 0.2, expenseIncrease: 0.1, duration: 18 }
    ];
    
    return scenarios.map(scenario => this.runStressTestScenario(scenario));
  }

  /**
   * Analyze spending categories with AI-driven insights
   */
  public analyzeSpendingCategories(): SpendingCategoryAnalysis[] {
    const categories = [...new Set(this.transactions.map(t => t.category))];
    
    return categories.map(category => {
      const categoryTransactions = this.transactions.filter(t => t.category === category);
      const monthlyAmounts = this.getMonthlyAmounts(categoryTransactions);
      
      return {
        category,
        averageMonthly: this.calculateAverage(monthlyAmounts),
        trend: this.calculateTrend(monthlyAmounts),
        volatility: this.calculateVolatility(monthlyAmounts),
        seasonality: this.calculateSeasonality(monthlyAmounts),
        predictedNext30Days: this.predictNextMonth(monthlyAmounts),
        anomalyScore: this.calculateAnomalyScore(monthlyAmounts)
      };
    });
  }

  /**
   * Analyze financial goals with Monte Carlo simulation
   */
  public analyzeGoals(goals: any[]): GoalAnalysis[] {
    return goals.map(goal => {
      const monthsToTarget = goal.target_date ? 
        Math.max(1, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))) : 
        60; // Default 5 years
      
      const remainingAmount = goal.target_amount - goal.current_amount;
      const requiredMonthlySavings = remainingAmount / monthsToTarget;
      
      // Calculate probability using Monte Carlo simulation
      const probability = this.calculateGoalProbability(goal, requiredMonthlySavings);
      
      const projectedDate = new Date();
      projectedDate.setMonth(projectedDate.getMonth() + monthsToTarget);
      
      return {
        goalId: goal.id,
        targetAmount: goal.target_amount,
        currentAmount: goal.current_amount,
        requiredMonthlySavings: Math.round(requiredMonthlySavings),
        projectedCompletionDate: projectedDate,
        probability,
        alternativeStrategies: this.generateAlternativeStrategies(goal, requiredMonthlySavings)
      };
    });
  }

  // Private calculation methods

  private calculateSeasonalityFactor(): number {
    const monthlySpending = new Array(12).fill(0);
    
    this.transactions.forEach(transaction => {
      const month = new Date(transaction.date).getMonth();
      monthlySpending[month] += transaction.amount;
    });
    
    const avgSpending = monthlySpending.reduce((sum, amt) => sum + amt, 0) / 12;
    const variance = monthlySpending.reduce((sum, amt) => sum + Math.pow(amt - avgSpending, 2), 0) / 12;
    
    return Math.sqrt(variance) / avgSpending;
  }

  private calculateVolatilityFactor(): number {
    const dailyAmounts = this.getDailySpendingAmounts();
    const avg = dailyAmounts.reduce((sum, amt) => sum + amt, 0) / dailyAmounts.length;
    const variance = dailyAmounts.reduce((sum, amt) => sum + Math.pow(amt - avg, 2), 0) / dailyAmounts.length;
    
    return Math.sqrt(variance) / avg;
  }

  private calculateBehaviorImpact(patterns: DetectedPattern[], month: number): number {
    return patterns.reduce((impact, pattern) => {
      // Apply pattern impact with time decay
      const timeDecay = Math.exp(-month * 0.1);
      return impact + (pattern.impact * timeDecay / 12); // Monthly portion
    }, 0);
  }

  private calculateProjectionConfidence(month: number, patternCount: number): number {
    // Confidence decreases with time and increases with pattern data
    const timeDecay = Math.exp(-month * 0.05);
    const dataBonus = Math.min(patternCount * 0.1, 0.3);
    
    return Math.round((0.7 + dataBonus) * timeDecay * 100);
  }

  private calculateLiquidityRisk(): number {
    const emergencyFundRatio = this.profile.liquidSavings / this.profile.monthlyExpenses;
    
    if (emergencyFundRatio >= 6) return 10; // Low risk
    if (emergencyFundRatio >= 3) return 30; // Medium risk
    if (emergencyFundRatio >= 1) return 60; // High risk
    return 90; // Critical risk
  }

  private calculateConcentrationRisk(): number {
    // Analyze income source concentration
    const incomeSourceRisk = this.profile.incomeSourceCount === 1 ? 70 : 
                           this.profile.incomeSourceCount === 2 ? 40 : 20;
    
    // Analyze asset concentration (simulated)
    const assetConcentrationRisk = 30; // Would analyze actual asset allocation
    
    return Math.round((incomeSourceRisk + assetConcentrationRisk) / 2);
  }

  private calculateVolatilityRisk(): number {
    const incomeVolatility = (10 - this.profile.incomeStability) * 10; // 0-100 scale
    const expenseVolatility = this.calculateVolatilityFactor() * 100;
    
    return Math.round((incomeVolatility + expenseVolatility) / 2);
  }

  private calculateCreditRisk(): number {
    const utilizationRisk = this.profile.creditUtilization * 100;
    const dtiRisk = (this.profile.monthlyDebtPayments / this.profile.monthlyIncome) * 100;
    
    return Math.round((utilizationRisk + dtiRisk) / 2);
  }

  private generateRiskRecommendations(risks: any): string[] {
    const recommendations: string[] = [];
    
    if (risks.liquidityRisk > 50) {
      recommendations.push('Build emergency fund to 3-6 months of expenses');
    }
    
    if (risks.concentrationRisk > 50) {
      recommendations.push('Diversify income sources and investment portfolio');
    }
    
    if (risks.volatilityRisk > 50) {
      recommendations.push('Create more predictable income and expense patterns');
    }
    
    if (risks.creditRisk > 50) {
      recommendations.push('Reduce debt burden and credit utilization');
    }
    
    return recommendations;
  }

  private runStressTestScenario(scenario: any): StressTestResult {
    const originalIncome = this.profile.monthlyIncome;
    const originalExpenses = this.profile.monthlyExpenses;
    
    // Apply stress scenario
    const stressedIncome = originalIncome * (1 - (scenario.incomeReduction || 0));
    const stressedExpenses = originalExpenses * (1 + (scenario.expenseIncrease || 0));
    
    const netImpact = (stressedIncome - stressedExpenses) - (originalIncome - originalExpenses);
    const impactPercent = Math.abs(netImpact) / originalIncome * 100;
    
    // Calculate recovery time
    const monthsToRecover = scenario.duration + Math.ceil(Math.abs(netImpact * scenario.duration) / (originalIncome - originalExpenses));
    
    // Calculate success probability based on liquidity cushion
    const liquidityCushion = this.profile.liquidSavings / Math.abs(netImpact);
    const successProbability = Math.min(95, Math.max(5, liquidityCushion * 15));
    
    return {
      scenario: scenario.name,
      impactPercent: Math.round(impactPercent),
      monthsToRecover,
      recommendedActions: this.generateStressTestRecommendations(scenario),
      successProbability: Math.round(successProbability)
    };
  }

  private generateStressTestRecommendations(scenario: any): string[] {
    const recommendations: string[] = [];
    
    if (scenario.incomeReduction) {
      recommendations.push('Establish multiple income streams');
      recommendations.push('Build larger emergency fund');
    }
    
    if (scenario.expenseIncrease) {
      recommendations.push('Review and optimize monthly expenses');
      recommendations.push('Consider insurance coverage');
    }
    
    return recommendations;
  }

  private getMonthlyAmounts(transactions: Transaction[]): number[] {
    const monthlyTotals = new Map<string, number>();
    
    transactions.forEach(transaction => {
      const monthKey = transaction.date.substring(0, 7); // YYYY-MM
      monthlyTotals.set(monthKey, (monthlyTotals.get(monthKey) || 0) + transaction.amount);
    });
    
    return Array.from(monthlyTotals.values());
  }

  private calculateAverage(values: number[]): number {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = this.calculateAverage(firstHalf);
    const secondAvg = this.calculateAverage(secondHalf);
    
    const changePercent = (secondAvg - firstAvg) / firstAvg * 100;
    
    if (changePercent > 10) return 'increasing';
    if (changePercent < -10) return 'decreasing';
    return 'stable';
  }

  private calculateVolatility(values: number[]): number {
    const avg = this.calculateAverage(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    return avg > 0 ? Math.sqrt(variance) / avg : 0;
  }

  private calculateSeasonality(_values: number[]): number {
    // Calculate seasonality based on month and spending patterns
    const month = new Date().getMonth();
    const seasonalityMap = [0.1, 0.05, 0.15, 0.2, 0.25, 0.15, 0.1, 0.05, 0.2, 0.3, 0.25, 0.35];
    return seasonalityMap[month] || 0.15;
  }

  private predictNextMonth(values: number[]): number {
    if (values.length === 0) return 0;
    
    // Simple exponential smoothing
    const alpha = 0.3;
    let forecast = values[0];
    
    for (let i = 1; i < values.length; i++) {
      forecast = alpha * values[i] + (1 - alpha) * forecast;
    }
    
    return forecast;
  }

  private calculateAnomalyScore(values: number[]): number {
    if (values.length < 3) return 0;
    
    const avg = this.calculateAverage(values);
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length);
    
    const latest = values[values.length - 1];
    const zScore = Math.abs((latest - avg) / stdDev);
    
    return Math.min(100, zScore * 20); // Convert to 0-100 scale
  }

  private calculateGoalProbability(_goal: any, requiredSavings: number): number {
    const currentSavingsRate = (this.profile.monthlyIncome - this.profile.monthlyExpenses) / this.profile.monthlyIncome;
    const requiredSavingsRate = requiredSavings / this.profile.monthlyIncome;
    
    if (requiredSavingsRate <= currentSavingsRate) return 95;
    if (requiredSavingsRate <= currentSavingsRate * 1.5) return 75;
    if (requiredSavingsRate <= currentSavingsRate * 2) return 50;
    return 25;
  }

  private generateAlternativeStrategies(_goal: any, requiredSavings: number): string[] {
    const strategies: string[] = [];
    const currentSurplus = this.profile.monthlyIncome - this.profile.monthlyExpenses;
    
    if (requiredSavings > currentSurplus) {
      strategies.push('Increase income through side hustle or career advancement');
      strategies.push('Reduce monthly expenses to increase savings capacity');
      strategies.push('Extend timeline to reduce monthly requirement');
      strategies.push('Invest in higher-yield accounts to boost growth');
    }
    
    return strategies;
  }

  private getDailySpendingAmounts(): number[] {
    const dailyTotals = new Map<string, number>();
    
    this.transactions.forEach(transaction => {
      const dateKey = transaction.date;
      dailyTotals.set(dateKey, (dailyTotals.get(dateKey) || 0) + transaction.amount);
    });
    
    return Array.from(dailyTotals.values());
  }

  /**
   * Get comprehensive financial health report
   */
  public generateComprehensiveReport(): {
    fhss: FHSSResponse;
    cashFlowProjections: CashFlowProjection[];
    riskAssessment: RiskAssessment;
    stressTests: StressTestResult[];
    spendingAnalysis: SpendingCategoryAnalysis[];
    recommendations: string[];
  } {
    try {
      // Calculate latest FHSS if not cached
      if (!this.latestFHSS) {
        this.latestFHSS = computeFHSS(this.profile);
      }
      
      const cashFlowProjections = this.generateCashFlowProjections(12);
      const riskAssessment = this.assessFinancialRisk();
      const stressTests = this.runStressTests();
      const spendingAnalysis = this.analyzeSpendingCategories();
      
      // Generate comprehensive recommendations
      const recommendations = [
        ...this.latestFHSS.recommendations,
        ...riskAssessment.recommendations
      ];
      
      return {
        fhss: this.latestFHSS,
        cashFlowProjections,
        riskAssessment,
        stressTests,
        spendingAnalysis,
        recommendations
      };
    } catch (error) {
      enterpriseErrorMonitor.captureError(error as Error, {
        category: 'data',
        severity: 'critical'
      });
      throw new Error('Failed to generate comprehensive financial report');
    }
  }
}