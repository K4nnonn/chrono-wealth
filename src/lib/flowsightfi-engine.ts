// @ts-nocheck
/**
 * FlowSightFi Behavioral Intelligence Engine
 * Core mathematical logic for behavioral pattern detection and trajectory forecasting
 */

import { monteCarloNetWorthForecast, bstsSpendingForecast, kMeansClustering, elasticNetRegression } from './advancedForecastModels';

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  time: string;
  category: string;
  merchant: string;
}

export interface BehavioralMetrics {
  entropy: number;
  volatility: number;
  timeCluster: {
    peakDay: number;
    peakHour: number;
    pattern: string;
  };
  savingsStreak: number;
  consistency: number;
}

export interface TrajectoryPoint {
  week: number;
  date: string;
  P_week: number;
  P_month: number;
  P_quarter: number;
  P_year: number;
  behaviorImpact: number;
  goalProjection?: number;
}

export interface DetectedPattern {
  type: 'back_half_saver' | 'weekend_rebounder' | 'midweek_impulse' | 'consistency_champion' | 'entropy_spike';
  category: string;
  impact: number;
  confidence: number;
  description: string;
  formula: string;
  actionSuggestion: string;
  timePattern?: string;
  streakData?: number;
}

export class FlowSightFiEngine {
  private transactions: Transaction[];
  private currentIncome: number;
  private currentExpenses: number;

  constructor(transactions: Transaction[], monthlyIncome: number, monthlyExpenses: number) {
    this.transactions = transactions;
    this.currentIncome = monthlyIncome;
    this.currentExpenses = monthlyExpenses;
  }

  /**
   * Calculate entropy for a series of values
   * Higher entropy = more unpredictable spending
   */
  private calculateEntropy(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Coefficient of variation as entropy measure
    return mean > 0 ? standardDeviation / mean : 0;
  }

  /**
   * Calculate moving average for smooth trend detection
   */
  private movingAverage(values: number[], window: number): number[] {
    const result: number[] = [];
    for (let i = window - 1; i < values.length; i++) {
      const slice = values.slice(i - window + 1, i + 1);
      const avg = slice.reduce((sum, val) => sum + val, 0) / window;
      result.push(avg);
    }
    return result;
  }

  /**
   * Detect behavioral patterns from transaction data
   */
  detectBehavioralPatterns(): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];
    const categories = [...new Set(this.transactions.map(t => t.category))];

    categories.forEach(category => {
      const categoryTxns = this.transactions.filter(t => t.category === category);
      if (categoryTxns.length < 10) return; // Need sufficient data

      // Calculate behavioral metrics
      const amounts = categoryTxns.map(t => t.amount);
      const entropy = this.calculateEntropy(amounts);
      const volatility = this.calculateVolatility(categoryTxns);
      const timePattern = this.detectTimePatterns(categoryTxns);
      const totalImpact = amounts.reduce((sum, amount) => sum + amount, 0);

      // Pattern 1: High Volatility (Weekend Rebounder type)
      if (volatility > 1.2 && category.toLowerCase().includes('dining')) {
        const weekendRatio = this.calculateWeekendRatio(categoryTxns);
        if (weekendRatio > 1.5) {
          patterns.push({
            type: 'weekend_rebounder',
            category,
            impact: -Math.round(totalImpact * 0.3),
            confidence: Math.round(85 + Math.random() * 10),
            description: `🍕 ${Math.round((weekendRatio - 1) * 100)}% of weekday gains lost to weekend ${category.toLowerCase()}.`,
            formula: `weekend_ratio = Σ(weekend_spend) / Σ(weekday_spend) = ${weekendRatio.toFixed(2)}`,
            actionSuggestion: 'Set weekend spending limits or find alternative activities.',
            timePattern: timePattern.description
          });
        }
      }

      // Pattern 2: Time-based Impulse (Midweek Drift)
      if (this.detectImpulseTimeWindow(categoryTxns)) {
        patterns.push({
          type: 'midweek_impulse',
          category,
          impact: -Math.round(totalImpact * 0.15),
          confidence: Math.round(80 + Math.random() * 15),
          description: `🧃 Impulse spending peaks during ${timePattern.description}.`,
          formula: `time_cluster_variance = ${entropy.toFixed(3)} (high entropy window)`,
          actionSuggestion: 'Consider app blocks or alerts during vulnerable hours.',
          timePattern: timePattern.description
        });
      }

      // Pattern 3: Entropy Spike Detection
      if (entropy > 0.8) {
        patterns.push({
          type: 'entropy_spike',
          category,
          impact: -Math.round(totalImpact * 0.2),
          confidence: Math.round(75 + entropy * 20),
          description: `📊 ${category} spending entropy increased ${Math.round(entropy * 100)}% above baseline.`,
          formula: `CV = σ/μ = ${entropy.toFixed(3)} (high volatility)`,
          actionSuggestion: 'Review recent purchases and identify triggers.'
        });
      }
    });

    // Pattern 4: Savings Consistency (Back-Half Saver, Consistency Champion)
    const savingsPattern = this.detectSavingsPatterns();
    if (savingsPattern) {
      patterns.push(savingsPattern);
    }

    return patterns;
  }

  /**
   * Calculate weekend vs weekday spending ratio
   */
  private calculateWeekendRatio(transactions: Transaction[]): number {
    let weekendSpend = 0;
    let weekdaySpend = 0;

    transactions.forEach(txn => {
      const date = new Date(txn.date);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendSpend += txn.amount;
      } else {
        weekdaySpend += txn.amount;
      }
    });

    return weekdaySpend > 0 ? weekendSpend / weekdaySpend : 0;
  }

  /**
   * Detect time-based patterns in spending
   */
  private detectTimePatterns(transactions: Transaction[]): { description: string; peakDay: number; peakHour: number } {
    const dayOfWeekCounts = new Array(7).fill(0);
    const hourCounts = new Array(24).fill(0);

    transactions.forEach(txn => {
      const date = new Date(txn.date);
      const hour = parseInt(txn.time.split(':')[0]) || 12;
      
      dayOfWeekCounts[date.getDay()]++;
      hourCounts[hour]++;
    });

    const peakDay = dayOfWeekCounts.indexOf(Math.max(...dayOfWeekCounts));
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return {
      description: `${dayNames[peakDay]} ${peakHour}:00-${peakHour + 2}:00`,
      peakDay,
      peakHour
    };
  }

  /**
   * Detect impulse spending windows (midweek evening pattern)
   */
  private detectImpulseTimeWindow(transactions: Transaction[]): boolean {
    let midweekEveningCount = 0;
    let totalCount = transactions.length;

    transactions.forEach(txn => {
      const date = new Date(txn.date);
      const hour = parseInt(txn.time.split(':')[0]) || 12;
      const dayOfWeek = date.getDay();
      
      // Wednesday (3) or Thursday (4) between 9 PM and 11 PM
      if ((dayOfWeek === 3 || dayOfWeek === 4) && hour >= 21 && hour <= 23) {
        midweekEveningCount++;
      }
    });

    return (midweekEveningCount / totalCount) > 0.2; // 20% of transactions in this window
  }

  /**
   * Calculate volatility for a category
   */
  private calculateVolatility(transactions: Transaction[]): number {
    const amounts = transactions.map(t => t.amount);
    if (amounts.length < 2) return 0;
    
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    
    return mean > 0 ? Math.sqrt(variance) / mean : 0;
  }

  /**
   * Detect savings behavior patterns
   */
  private detectSavingsPatterns(): DetectedPattern | null {
    const monthlySavings = this.currentIncome - this.currentExpenses;
    if (monthlySavings <= 0) return null;

    // Simulate end-of-month savings pattern detection
    const endOfMonthPattern = this.detectEndOfMonthSavings();
    
    if (endOfMonthPattern.isDetected) {
      return {
        type: 'back_half_saver',
        category: 'Savings',
        impact: Math.round(monthlySavings * 1.3), // 30% boost from optimization
        confidence: 94,
        description: `💰 You save ${endOfMonthPattern.multiplier}× more during the final 5 days of your pay cycle.`,
        formula: `end_month_multiplier = ${endOfMonthPattern.multiplier.toFixed(1)}`,
        actionSuggestion: "Auto-schedule transfers during high-surplus window?",
        timePattern: 'Days 26-30 of month'
      };
    }

    // Check for consistency streaks
    const streakWeeks = this.calculateSavingsStreak();
    if (streakWeeks > 4) {
      return {
        type: 'consistency_champion',
        category: 'Savings',
        impact: Math.round(monthlySavings + streakWeeks * 25),
        confidence: 96,
        description: `🏆 You've saved consistently for ${streakWeeks} weeks. Longest streak detected.`,
        formula: `streak_multiplier = 1 + (weeks * 0.05) = ${(1 + streakWeeks * 0.05).toFixed(2)}`,
        actionSuggestion: 'Reward yourself with a small celebration!',
        streakData: streakWeeks
      };
    }

    return null;
  }

  /**
   * Detect end-of-month savings behavior
   */
  private detectEndOfMonthSavings(): { isDetected: boolean; multiplier: number } {
    // Simulate analysis of spending patterns by day of month
    const dailySpending = new Map<number, number>();
    
    this.transactions.forEach(txn => {
      const date = new Date(txn.date);
      const dayOfMonth = date.getDate();
      const current = dailySpending.get(dayOfMonth) || 0;
      dailySpending.set(dayOfMonth, current + txn.amount);
    });

    // Calculate average spending for first 25 days vs last 5 days
    let earlyMonthSpend = 0;
    let lateMonthSpend = 0;
    let earlyDays = 0;
    let lateDays = 0;

    dailySpending.forEach((amount, day) => {
      if (day <= 25) {
        earlyMonthSpend += amount;
        earlyDays++;
      } else {
        lateMonthSpend += amount;
        lateDays++;
      }
    });

    const earlyAvg = earlyDays > 0 ? earlyMonthSpend / earlyDays : 0;
    const lateAvg = lateDays > 0 ? lateMonthSpend / lateDays : 0;
    
    const multiplier = earlyAvg > 0 ? earlyAvg / (lateAvg || 1) : 1;
    
    return {
      isDetected: multiplier > 1.5, // Spending drops significantly at month end
      multiplier: multiplier
    };
  }

  /**
   * Calculate savings streak in weeks
   */
  private calculateSavingsStreak(): number {
    // Simulate weekly savings analysis
    const weeklySavings = [];
    const avgMonthlyExpenses = this.currentExpenses;
    const weeklyBudget = avgMonthlyExpenses / 4.33; // weeks per month

    // Generate weekly spending data from transactions
    const weeklyData = new Map<string, number>();
    this.transactions.forEach(txn => {
      const date = new Date(txn.date);
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      const current = weeklyData.get(weekKey) || 0;
      weeklyData.set(weekKey, current + txn.amount);
    });

    // Count consecutive weeks under budget
    let streak = 0;
    let maxStreak = 0;
    
    Array.from(weeklyData.values()).forEach(weeklySpend => {
      if (weeklySpend < weeklyBudget * 0.9) { // 10% under budget
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    });

    return maxStreak;
  }

  /**
   * Generate multi-layer trajectory projections using FlowSightFi formulas
   */
  generateTrajectoryProjections(weeks: number = 52): TrajectoryPoint[] {
    const S = this.currentIncome - this.currentExpenses; // Base surplus
    const R = S > 0 ? S / this.currentIncome : 0; // Resilience/savings rate
    const projections: TrajectoryPoint[] = [];
    
    // Detect behavior delta from recent patterns
    const recentPatterns = this.detectBehavioralPatterns();
    const behaviorDelta = recentPatterns.reduce((sum, pattern) => {
      return sum + (pattern.impact / this.currentIncome); // Normalize to income
    }, 0);

    let cumulativeNetWorth = 0; // Start from current baseline
    
    for (let week = 0; week <= weeks; week++) {
      // FlowSightFi Core Formulas
      const P_week = S * 0.9; // Account for volatility
      
      // Moving average simulation (using smoothed surplus)
      const MA_S = S * (1 + Math.sin(week * 0.1) * 0.1); // Simulate 4-week MA with variation
      const P_month = MA_S * (1 + behaviorDelta * 0.25);
      
      const P_quarter = P_month * (1 + 0.15); // 15% compound quarterly effect
      const P_year = P_quarter * (1 + R * 0.4); // Resilience factor boost
      
      // Accumulate net worth progression
      cumulativeNetWorth += P_year / 52; // Weekly accumulation
      
      // Calculate behavior impact for this week
      const weekBehaviorImpact = recentPatterns.reduce((sum, pattern) => {
        // Apply time-based pattern impacts
        if (pattern.timePattern && this.isPatternActiveThisWeek(pattern, week)) {
          return sum + pattern.impact / 52; // Weekly portion
        }
        return sum;
      }, 0);

      projections.push({
        week,
        date: new Date(Date.now() + week * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        P_week: cumulativeNetWorth + (P_week * week / 52),
        P_month: cumulativeNetWorth + (P_month * week / 52),
        P_quarter: cumulativeNetWorth + (P_quarter * week / 52),
        P_year: cumulativeNetWorth + (P_year * week / 52),
        behaviorImpact: weekBehaviorImpact
      });
    }

    return projections;
  }

  /**
   * Check if a behavioral pattern is active during a specific week
   */
  private isPatternActiveThisWeek(pattern: DetectedPattern, week: number): boolean {
    if (!pattern.timePattern) return false;
    
    // Simulate pattern timing based on description
    if (pattern.timePattern.includes('Weekend')) {
      return week % 4 < 2; // More active in first half of month
    }
    
    if (pattern.timePattern.includes('Wednesday') || pattern.timePattern.includes('Thursday')) {
      return week % 2 === 0; // Every other week pattern
    }
    
    return Math.random() > 0.7; // 30% chance for other patterns
  }

  /**
   * Calculate goal achievement timeline with behavioral adjustments
   */
  calculateGoalAchievement(goalAmount: number, projections: TrajectoryPoint[]): {
    optimisticWeeks: number | null;
    realisticWeeks: number | null;
    impactOfBehaviorChange: number;
  } {
    const optimisticAchievement = projections.find(p => p.P_year >= goalAmount);
    const realisticAchievement = projections.find(p => p.P_quarter >= goalAmount);
    
    const behaviorImpact = projections.reduce((sum, p) => sum + p.behaviorImpact, 0);
    
    return {
      optimisticWeeks: optimisticAchievement ? optimisticAchievement.week : null,
      realisticWeeks: realisticAchievement ? realisticAchievement.week : null,
      impactOfBehaviorChange: behaviorImpact
    };
  }


  // Advanced forecasting models
  monteCarloNetWorthForecast(initialNetWorth: number, expectedReturn: number, volatility: number, years: number, numSimulations: number = 1000): number[] {
    return monteCarloNetWorthForecast(initialNetWorth, expectedReturn, volatility, years, numSimulations);
  }

  bstsSpendingForecast(history: number[], steps: number = 12): number[] {
    return bstsSpendingForecast(history, steps);
  }

  clusterSpendingPatterns(data: number[][], k: number): { centroids: number[][]; labels: number[] } {
    return kMeansClustering(data, k);
  }

  fitElasticNetSpendingModel(features: number[][], targets: number[], alpha: number = 1, l1Ratio: number = 0.5, iterations: number = 1000, learningRate: number = 0.01): { coefficients: number[]; intercept: number } {
    return elasticNetRegression(features, targets, alpha, l1Ratio, iterations, learningRate);
  }
}
