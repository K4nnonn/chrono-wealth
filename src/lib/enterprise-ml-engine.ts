// Enterprise Machine Learning Engine
// Advanced spending predictions, anomaly detection, and behavioral analysis

export interface SpendingPattern {
  category: string;
  amount: number;
  frequency: number;
  dayOfWeek: number;
  dayOfMonth: number;
  seasonality: number;
  confidence: number;
}

export interface AnomalyDetection {
  type: 'amount' | 'frequency' | 'category' | 'timing';
  score: number; // 0-1, higher = more anomalous
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export interface PredictionModel {
  type: 'linear' | 'polynomial' | 'exponential' | 'seasonal';
  accuracy: number;
  confidence: number;
  lastTrained: Date;
  features: string[];
}

export interface SpendingPrediction {
  category: string;
  predictedAmount: number;
  confidence: number;
  timeframe: 'week' | 'month' | 'quarter';
  model: PredictionModel;
  factors: Array<{ name: string; impact: number }>;
}

export interface BehavioralInsight {
  pattern: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  recommendation: string;
  potentialSavings?: number;
}

export interface RiskAssessment {
  overall: number; // 0-100 risk score
  factors: Array<{
    name: string;
    score: number;
    weight: number;
    description: string;
  }>;
  recommendations: string[];
  timeline: 'immediate' | 'short_term' | 'long_term';
}

class EnterpriseMachineLearningEngine {
  private static instance: EnterpriseMachineLearningEngine;
  private models = new Map<string, PredictionModel>();

  private constructor() {
    this.initializeModels();
  }

  public static getInstance(): EnterpriseMachineLearningEngine {
    if (!EnterpriseMachineLearningEngine.instance) {
      EnterpriseMachineLearningEngine.instance = new EnterpriseMachineLearningEngine();
    }
    return EnterpriseMachineLearningEngine.instance;
  }

  /**
   * Initialize baseline prediction models
   */
  private initializeModels(): void {
    const baseModel: PredictionModel = {
      type: 'linear',
      accuracy: 0.75,
      confidence: 0.8,
      lastTrained: new Date(),
      features: ['amount', 'category', 'dayOfWeek', 'dayOfMonth']
    };

    this.models.set('spending_prediction', { ...baseModel });
    this.models.set('anomaly_detection', { ...baseModel, type: 'polynomial' });
    this.models.set('risk_assessment', { ...baseModel, type: 'exponential' });
  }

  /**
   * Advanced spending pattern analysis using statistical methods
   */
  public analyzeSpendingPatterns(transactions: any[]): SpendingPattern[] {
    if (!transactions || transactions.length === 0) return [];

    const patterns: SpendingPattern[] = [];
    const categoryGroups = this.groupTransactionsByCategory(transactions);

    for (const [category, categoryTransactions] of categoryGroups) {
      const amounts = categoryTransactions.map(t => Math.abs(t.amount || 0));
      const dates = categoryTransactions.map(t => new Date(t.date || t.created_at));

      // Calculate statistical measures
      const avgAmount = this.calculateMean(amounts);
      const frequency = this.calculateFrequency(dates);
      const dayOfWeekPattern = this.analyzeDayOfWeekPattern(dates);
      const dayOfMonthPattern = this.analyzeDayOfMonthPattern(dates);
      const seasonality = this.analyzeSeasonality(dates, amounts);

      // Calculate confidence based on data consistency
      const confidence = this.calculatePatternConfidence(amounts, dates);

      patterns.push({
        category,
        amount: avgAmount,
        frequency,
        dayOfWeek: dayOfWeekPattern,
        dayOfMonth: dayOfMonthPattern,
        seasonality,
        confidence
      });
    }

    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Machine learning-based anomaly detection
   */
  public detectAnomalies(transactions: any[]): AnomalyDetection[] {
    if (!transactions || transactions.length < 10) return [];

    const anomalies: AnomalyDetection[] = [];
    const patterns = this.analyzeSpendingPatterns(transactions);

    for (const transaction of transactions) {
      const amount = Math.abs(transaction.amount || 0);
      const category = transaction.category || 'Other';
      const date = new Date(transaction.date || transaction.created_at);

      const pattern = patterns.find(p => p.category === category);
      if (!pattern) continue;

      // Amount anomaly detection using Z-score
      const amountZScore = this.calculateZScore(amount, pattern.amount, this.getStandardDeviation(transactions, category));
      if (Math.abs(amountZScore) > 2.5) {
        anomalies.push({
          type: 'amount',
          score: Math.min(Math.abs(amountZScore) / 3, 1),
          description: `Unusual ${category} spending: $${amount.toFixed(2)} (${amountZScore > 0 ? 'higher' : 'lower'} than normal)`,
          severity: Math.abs(amountZScore) > 3 ? 'critical' : 'high',
          recommendation: amountZScore > 0 
            ? 'Review this large expense and ensure it aligns with your budget'
            : 'This unusually small transaction might indicate a partial payment or error'
        });
      }

      // Frequency anomaly detection
      const expectedFrequency = pattern.frequency;
      const actualFrequency = this.calculateRecentFrequency(transactions, category, 30);
      if (Math.abs(actualFrequency - expectedFrequency) > expectedFrequency * 0.5) {
        anomalies.push({
          type: 'frequency',
          score: Math.abs(actualFrequency - expectedFrequency) / expectedFrequency,
          description: `Unusual ${category} spending frequency: ${actualFrequency.toFixed(1)} times vs expected ${expectedFrequency.toFixed(1)} times`,
          severity: Math.abs(actualFrequency - expectedFrequency) > expectedFrequency ? 'medium' : 'low',
          recommendation: actualFrequency > expectedFrequency
            ? 'Consider if increased spending in this category is necessary'
            : 'Reduced spending detected - ensure all necessary expenses are covered'
        });
      }

      // Timing anomaly detection
      const dayOfWeek = date.getDay();
      const hourOfDay = date.getHours();
      if (this.isTimingAnomalous(dayOfWeek, hourOfDay, category)) {
        anomalies.push({
          type: 'timing',
          score: 0.6,
          description: `Unusual timing for ${category} transaction: ${this.getDayName(dayOfWeek)} at ${hourOfDay}:00`,
          severity: 'low',
          recommendation: 'Verify this transaction timing aligns with your normal spending patterns'
        });
      }
    }

    return anomalies.sort((a, b) => b.score - a.score);
  }

  /**
   * Advanced spending predictions using multiple algorithms
   */
  public predictSpending(transactions: any[], timeframe: 'week' | 'month' | 'quarter'): SpendingPrediction[] {
    if (!transactions || transactions.length === 0) return [];

    const predictions: SpendingPrediction[] = [];
    const patterns = this.analyzeSpendingPatterns(transactions);
    const timeframeDays = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;

    for (const pattern of patterns) {
      const categoryTransactions = transactions.filter(t => 
        (t.category || 'Other') === pattern.category
      );

      if (categoryTransactions.length < 3) continue;

      // Multiple prediction models
      const linearPrediction = this.linearRegression(categoryTransactions, timeframeDays);
      const seasonalPrediction = this.seasonalPrediction(categoryTransactions, timeframeDays, pattern);
      const trendPrediction = this.trendAnalysisPrediction(categoryTransactions, timeframeDays);

      // Ensemble prediction (weighted average)
      const predictions_ensemble = [
        { prediction: linearPrediction, weight: 0.4 },
        { prediction: seasonalPrediction, weight: 0.4 },
        { prediction: trendPrediction, weight: 0.2 }
      ];

      const weightedPrediction = predictions_ensemble.reduce(
        (sum, { prediction, weight }) => sum + prediction * weight, 0
      );

      // Calculate confidence based on model agreement
      const predictions_array = predictions_ensemble.map(p => p.prediction);
      const predictionStd = this.calculateStandardDeviation(predictions_array);
      const confidence = Math.max(0.3, 1 - (predictionStd / weightedPrediction));

      // Identify key factors influencing prediction
      const factors = this.identifyPredictionFactors(categoryTransactions, pattern);

      predictions.push({
        category: pattern.category,
        predictedAmount: Math.max(0, weightedPrediction),
        confidence,
        timeframe,
        model: this.models.get('spending_prediction')!,
        factors
      });
    }

    return predictions.sort((a, b) => b.predictedAmount - a.predictedAmount);
  }

  /**
   * Comprehensive behavioral analysis
   */
  public analyzeBehavioralPatterns(transactions: any[]): BehavioralInsight[] {
    if (!transactions || transactions.length === 0) return [];

    const insights: BehavioralInsight[] = [];

    // Weekend vs weekday spending analysis
    const weekendSpending = this.analyzeWeekendSpending(transactions);
    if (weekendSpending.insight) {
      insights.push(weekendSpending.insight);
    }

    // Monthly spending cycle analysis
    const monthlyPattern = this.analyzeMonthlySpendingCycle(transactions);
    if (monthlyPattern.insight) {
      insights.push(monthlyPattern.insight);
    }

    // Category concentration analysis
    const categoryConcentration = this.analyzeCategoryConcentration(transactions);
    if (categoryConcentration.insight) {
      insights.push(categoryConcentration.insight);
    }

    // Impulse spending detection
    const impulseSpending = this.detectImpulseSpending(transactions);
    if (impulseSpending.insight) {
      insights.push(impulseSpending.insight);
    }

    // Subscription analysis
    const subscriptionAnalysis = this.analyzeSubscriptions(transactions);
    if (subscriptionAnalysis.insight) {
      insights.push(subscriptionAnalysis.insight);
    }

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Advanced risk assessment using multiple factors
   */
  public assessFinancialRisk(profile: any, transactions: any[]): RiskAssessment {
    const factors: RiskAssessment['factors'] = [];

    // Income stability risk
    const incomeStability = profile.incomeStability || 5;
    factors.push({
      name: 'Income Stability',
      score: Math.max(0, 10 - incomeStability) * 10,
      weight: 0.25,
      description: incomeStability < 5 
        ? 'Irregular income increases financial vulnerability'
        : 'Stable income provides financial foundation'
    });

    // Debt-to-income ratio risk
    const dti = (profile.monthlyDebtPayments || 0) / (profile.monthlyIncome || 1);
    const debtRisk = Math.min(100, dti * 200);
    factors.push({
      name: 'Debt Burden',
      score: debtRisk,
      weight: 0.3,
      description: dti > 0.4
        ? 'High debt payments strain monthly budget'
        : dti > 0.2
        ? 'Moderate debt burden requires monitoring'
        : 'Low debt burden provides financial flexibility'
    });

    // Emergency fund risk
    const emergencyFund = (profile.liquidSavings || 0) / (profile.monthlyExpenses || 1);
    const emergencyRisk = Math.max(0, Math.min(100, (6 - emergencyFund) * 20));
    factors.push({
      name: 'Emergency Preparedness',
      score: emergencyRisk,
      weight: 0.2,
      description: emergencyFund < 3
        ? 'Insufficient emergency fund creates vulnerability to unexpected expenses'
        : emergencyFund < 6
        ? 'Emergency fund partially adequate but could be stronger'
        : 'Strong emergency fund provides excellent protection'
    });

    // Spending volatility risk
    const spendingVolatility = this.calculateSpendingVolatility(transactions);
    factors.push({
      name: 'Spending Consistency',
      score: spendingVolatility * 100,
      weight: 0.15,
      description: spendingVolatility > 0.3
        ? 'High spending volatility makes budgeting difficult'
        : 'Consistent spending patterns support financial planning'
    });

    // Credit utilization risk
    const creditUtil = profile.creditUtilization || 0;
    const creditRisk = Math.min(100, creditUtil * 100);
    factors.push({
      name: 'Credit Management',
      score: creditRisk,
      weight: 0.1,
      description: creditUtil > 0.7
        ? 'High credit utilization negatively impacts credit score'
        : creditUtil > 0.3
        ? 'Moderate credit utilization should be monitored'
        : 'Low credit utilization supports healthy credit'
    });

    // Calculate overall risk score
    const overall = factors.reduce((sum, factor) => 
      sum + (factor.score * factor.weight), 0
    );

    // Generate recommendations
    const recommendations = this.generateRiskRecommendations(factors, overall);

    // Determine timeline
    const timeline = overall > 70 ? 'immediate' : overall > 40 ? 'short_term' : 'long_term';

    return {
      overall,
      factors,
      recommendations,
      timeline
    };
  }

  // Helper methods for statistical calculations

  private groupTransactionsByCategory(transactions: any[]): Map<string, any[]> {
    const groups = new Map<string, any[]>();
    for (const transaction of transactions) {
      const category = transaction.category || 'Other';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(transaction);
    }
    return groups;
  }

  private calculateMean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = this.calculateMean(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateZScore(value: number, mean: number, std: number): number {
    return std === 0 ? 0 : (value - mean) / std;
  }

  private calculateFrequency(dates: Date[]): number {
    if (dates.length < 2) return 0;
    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    const daySpan = (sortedDates[sortedDates.length - 1].getTime() - sortedDates[0].getTime()) / (1000 * 60 * 60 * 24);
    return daySpan === 0 ? 0 : (dates.length - 1) / daySpan * 30; // Monthly frequency
  }

  private analyzeDayOfWeekPattern(dates: Date[]): number {
    const dayCount = new Array(7).fill(0);
    dates.forEach(date => dayCount[date.getDay()]++);
    const maxDay = dayCount.indexOf(Math.max(...dayCount));
    return maxDay;
  }

  private analyzeDayOfMonthPattern(dates: Date[]): number {
    const dayCount = new Array(31).fill(0);
    dates.forEach(date => dayCount[date.getDate() - 1]++);
    const maxDay = dayCount.indexOf(Math.max(...dayCount));
    return maxDay + 1;
  }

  private analyzeSeasonality(dates: Date[], amounts: number[]): number {
    if (dates.length < 4) return 0;
    
    const monthlyAmounts = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);
    
    dates.forEach((date, index) => {
      const month = date.getMonth();
      monthlyAmounts[month] += amounts[index] || 0;
      monthlyCounts[month]++;
    });
    
    const monthlyAverages = monthlyAmounts.map((sum, i) => 
      monthlyCounts[i] > 0 ? sum / monthlyCounts[i] : 0
    );
    
    return this.calculateStandardDeviation(monthlyAverages) / this.calculateMean(monthlyAverages);
  }

  private calculatePatternConfidence(amounts: number[], dates: Date[]): number {
    const amountConsistency = 1 - (this.calculateStandardDeviation(amounts) / this.calculateMean(amounts));
    const dataPoints = Math.min(1, dates.length / 10);
    const timeSpan = dates.length > 1 
      ? Math.min(1, (dates[dates.length - 1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24 * 90))
      : 0;
    
    return Math.max(0.1, Math.min(1, (amountConsistency + dataPoints + timeSpan) / 3));
  }

  private getStandardDeviation(transactions: any[], category: string): number {
    const categoryTransactions = transactions.filter(t => (t.category || 'Other') === category);
    const amounts = categoryTransactions.map(t => Math.abs(t.amount || 0));
    return this.calculateStandardDeviation(amounts);
  }

  private calculateRecentFrequency(transactions: any[], category: string, days: number): number {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const recentTransactions = transactions.filter(t => 
      (t.category || 'Other') === category && 
      new Date(t.date || t.created_at) >= cutoff
    );
    return recentTransactions.length;
  }

  private isTimingAnomalous(dayOfWeek: number, hourOfDay: number, category: string): boolean {
    // Simple rules for common categories
    if (category.toLowerCase().includes('grocery') && (hourOfDay < 6 || hourOfDay > 22)) return true;
    if (category.toLowerCase().includes('restaurant') && dayOfWeek === 1 && hourOfDay < 11) return true;
    return false;
  }

  private getDayName(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  }

  private linearRegression(transactions: any[], days: number): number {
    if (transactions.length < 2) return 0;
    
    const sortedTransactions = transactions
      .sort((a, b) => new Date(a.date || a.created_at).getTime() - new Date(b.date || b.created_at).getTime());
    
    const n = sortedTransactions.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    sortedTransactions.forEach((transaction, index) => {
      const x = index;
      const y = Math.abs(transaction.amount || 0);
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Project for the specified number of days
    const avgDaysBetweenTransactions = n > 1 
      ? (sortedTransactions[n-1].date - sortedTransactions[0].date) / (1000 * 60 * 60 * 24) / (n - 1)
      : 1;
    
    const transactionsInPeriod = Math.max(1, days / avgDaysBetweenTransactions);
    const futureX = n + transactionsInPeriod;
    
    return Math.max(0, (slope * futureX + intercept) * transactionsInPeriod);
  }

  private seasonalPrediction(_transactions: any[], days: number, pattern: SpendingPattern): number {
    const baseAmount = pattern.amount;
    const seasonalityFactor = 1 + (pattern.seasonality * 0.2); // Adjust for seasonality
    const frequencyFactor = pattern.frequency * (days / 30); // Scale by timeframe
    
    return baseAmount * seasonalityFactor * frequencyFactor;
  }

  private trendAnalysisPrediction(transactions: any[], days: number): number {
    if (transactions.length < 3) return 0;
    
    const recentTransactions = transactions.slice(-5); // Last 5 transactions
    const amounts = recentTransactions.map(t => Math.abs(t.amount || 0));
    const avgAmount = this.calculateMean(amounts);
    
    const frequency = this.calculateFrequency(
      recentTransactions.map(t => new Date(t.date || t.created_at))
    );
    
    return avgAmount * frequency * (days / 30);
  }

  private identifyPredictionFactors(_transactions: any[], pattern: SpendingPattern): Array<{ name: string; impact: number }> {
    const factors: Array<{ name: string; impact: number }> = [];
    
    factors.push({
      name: 'Historical Average',
      impact: 0.4
    });
    
    factors.push({
      name: 'Seasonal Trends',
      impact: pattern.seasonality * 0.3
    });
    
    factors.push({
      name: 'Frequency Pattern',
      impact: Math.min(0.3, pattern.frequency / 10)
    });
    
    factors.push({
      name: 'Recent Trend',
      impact: 0.2
    });
    
    return factors;
  }

  private analyzeWeekendSpending(transactions: any[]): { insight?: BehavioralInsight } {
    const weekendTransactions = transactions.filter(t => {
      const day = new Date(t.date || t.created_at).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    });
    
    const weekdayTransactions = transactions.filter(t => {
      const day = new Date(t.date || t.created_at).getDay();
      return day >= 1 && day <= 5;
    });
    
    if (weekendTransactions.length === 0 || weekdayTransactions.length === 0) {
      return {};
    }
    
    const weekendAvg = this.calculateMean(weekendTransactions.map(t => Math.abs(t.amount || 0)));
    const weekdayAvg = this.calculateMean(weekdayTransactions.map(t => Math.abs(t.amount || 0)));
    
    const ratio = weekendAvg / weekdayAvg;
    
    if (ratio > 1.5) {
      return {
        insight: {
          pattern: 'High Weekend Spending',
          description: `You spend ${(ratio * 100 - 100).toFixed(0)}% more on weekends than weekdays`,
          impact: 'negative',
          confidence: 0.8,
          recommendation: 'Consider planning weekend activities with budget limits to control discretionary spending',
          potentialSavings: (weekendAvg - weekdayAvg) * weekendTransactions.length * 0.3
        }
      };
    }
    
    return {};
  }

  private analyzeMonthlySpendingCycle(transactions: any[]): { insight?: BehavioralInsight } {
    const spendingByDay = new Array(31).fill(0);
    const countByDay = new Array(31).fill(0);
    
    transactions.forEach(t => {
      const day = new Date(t.date || t.created_at).getDate();
      spendingByDay[day - 1] += Math.abs(t.amount || 0);
      countByDay[day - 1]++;
    });
    
    const avgByDay = spendingByDay.map((sum, i) => 
      countByDay[i] > 0 ? sum / countByDay[i] : 0
    );
    
    const firstWeekAvg = this.calculateMean(avgByDay.slice(0, 7));
    const lastWeekAvg = this.calculateMean(avgByDay.slice(-7));
    
    if (lastWeekAvg > firstWeekAvg * 1.4) {
      return {
        insight: {
          pattern: 'End-of-Month Spending Spike',
          description: 'Spending increases significantly in the last week of the month',
          impact: 'negative',
          confidence: 0.7,
          recommendation: 'Distribute monthly expenses more evenly to avoid budget strain at month-end'
        }
      };
    }
    
    return {};
  }

  private analyzeCategoryConcentration(transactions: any[]): { insight?: BehavioralInsight } {
    const categoryTotals = new Map<string, number>();
    let totalSpending = 0;
    
    transactions.forEach(t => {
      const amount = Math.abs(t.amount || 0);
      const category = t.category || 'Other';
      categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount);
      totalSpending += amount;
    });
    
    const maxCategory = Array.from(categoryTotals.entries())
      .sort((a, b) => b[1] - a[1])[0];
    
    if (maxCategory && maxCategory[1] / totalSpending > 0.6) {
      return {
        insight: {
          pattern: 'High Category Concentration',
          description: `${maxCategory[0]} represents ${((maxCategory[1] / totalSpending) * 100).toFixed(0)}% of your spending`,
          impact: 'neutral',
          confidence: 0.9,
          recommendation: 'Consider diversifying expenses or evaluating if this concentration aligns with your priorities'
        }
      };
    }
    
    return {};
  }

  private detectImpulseSpending(transactions: any[]): { insight?: BehavioralInsight } {
    // Look for multiple transactions on the same day in discretionary categories
    const discretionaryCategories = ['entertainment', 'dining', 'shopping', 'retail'];
    const dailySpending = new Map<string, number>();
    
    transactions.forEach(t => {
      const category = (t.category || '').toLowerCase();
      if (discretionaryCategories.some(dc => category.includes(dc))) {
        const dateKey = new Date(t.date || t.created_at).toDateString();
        dailySpending.set(dateKey, (dailySpending.get(dateKey) || 0) + Math.abs(t.amount || 0));
      }
    });
    
    const highSpendingDays = Array.from(dailySpending.values()).filter(amount => amount > 200);
    
    if (highSpendingDays.length > transactions.length * 0.1) {
      const avgImpulseSpending = this.calculateMean(highSpendingDays);
      return {
        insight: {
          pattern: 'Frequent Impulse Spending',
          description: `${highSpendingDays.length} days with high discretionary spending detected`,
          impact: 'negative',
          confidence: 0.6,
          recommendation: 'Implement a 24-hour waiting period for non-essential purchases over $100',
          potentialSavings: avgImpulseSpending * highSpendingDays.length * 0.2
        }
      };
    }
    
    return {};
  }

  private analyzeSubscriptions(transactions: any[]): { insight?: BehavioralInsight } {
    // Detect recurring transactions (same amount, similar timing)
    const recurringTransactions = this.findRecurringTransactions(transactions);
    
    if (recurringTransactions.length > 5) {
      const totalSubscriptionCost = recurringTransactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
      
      return {
        insight: {
          pattern: 'Multiple Subscriptions',
          description: `${recurringTransactions.length} recurring charges detected totaling $${totalSubscriptionCost.toFixed(2)}/month`,
          impact: 'neutral',
          confidence: 0.7,
          recommendation: 'Review all subscriptions and cancel unused services to optimize spending',
          potentialSavings: totalSubscriptionCost * 0.3
        }
      };
    }
    
    return {};
  }

  private findRecurringTransactions(transactions: any[]): any[] {
    const amountGroups = new Map<string, any[]>();
    
    transactions.forEach(t => {
      const amountKey = Math.abs(t.amount || 0).toFixed(2);
      if (!amountGroups.has(amountKey)) {
        amountGroups.set(amountKey, []);
      }
      amountGroups.get(amountKey)!.push(t);
    });
    
    const recurring: any[] = [];
    
    amountGroups.forEach(group => {
      if (group.length >= 3) { // At least 3 occurrences
        const dates = group.map(t => new Date(t.date || t.created_at)).sort((a, b) => a.getTime() - b.getTime());
        const intervals = [];
        
        for (let i = 1; i < dates.length; i++) {
          const daysDiff = (dates[i].getTime() - dates[i-1].getTime()) / (1000 * 60 * 60 * 24);
          intervals.push(daysDiff);
        }
        
        const avgInterval = this.calculateMean(intervals);
        const intervalStd = this.calculateStandardDeviation(intervals);
        
        // If intervals are consistent (monthly ~30 days, with low variation)
        if (avgInterval > 25 && avgInterval < 35 && intervalStd < 5) {
          recurring.push(group[0]); // Add one representative transaction
        }
      }
    });
    
    return recurring;
  }

  private calculateSpendingVolatility(transactions: any[]): number {
    if (transactions.length < 4) return 0;
    
    const monthlyTotals = new Map<string, number>();
    
    transactions.forEach(t => {
      const date = new Date(t.date || t.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyTotals.set(monthKey, (monthlyTotals.get(monthKey) || 0) + Math.abs(t.amount || 0));
    });
    
    const amounts = Array.from(monthlyTotals.values());
    if (amounts.length < 2) return 0;
    
    const mean = this.calculateMean(amounts);
    const std = this.calculateStandardDeviation(amounts);
    
    return mean === 0 ? 0 : std / mean; // Coefficient of variation
  }

  private generateRiskRecommendations(factors: RiskAssessment['factors'], overall: number): string[] {
    const recommendations: string[] = [];
    
    // High-priority recommendations based on worst factors
    const worstFactors = factors
      .filter(f => f.score > 60)
      .sort((a, b) => b.score - a.score);
    
    worstFactors.forEach(factor => {
      switch (factor.name) {
        case 'Income Stability':
          recommendations.push('Diversify income sources and build a larger emergency fund to mitigate income volatility');
          break;
        case 'Debt Burden':
          recommendations.push('Prioritize debt reduction using the avalanche or snowball method');
          break;
        case 'Emergency Preparedness':
          recommendations.push('Build emergency fund to 3-6 months of expenses as top priority');
          break;
        case 'Spending Consistency':
          recommendations.push('Create and stick to a detailed monthly budget to reduce spending volatility');
          break;
        case 'Credit Management':
          recommendations.push('Pay down credit card balances to reduce utilization below 30%');
          break;
      }
    });
    
    // Overall risk level recommendations
    if (overall > 70) {
      recommendations.push('Consider consulting with a financial advisor for comprehensive risk management');
    } else if (overall > 40) {
      recommendations.push('Focus on the top 2 risk factors to improve overall financial stability');
    } else {
      recommendations.push('Maintain current financial discipline and consider opportunities for growth');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const mlEngine = EnterpriseMachineLearningEngine.getInstance();