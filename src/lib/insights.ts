// Behavioral insight engine for FlowSightFi
import { FlowSightFiEngine, DetectedPattern } from './flowsightfi-engine';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
}

export type InsightType = 'nudge' | 'celebration' | 'alert';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  actions: string[];
  source: string;
}

/**
 * Generate insights based on behavioral patterns, goal progress and forecasts.
 * @param engine Instance of FlowSightFiEngine initialised with user transactions and budget data.
 * @param goals List of user-defined financial goals with progress info.
 */
export function generateInsights(engine: FlowSightFiEngine, goals: Goal[]): Insight[] {
  const insights: Insight[] = [];
  const now = new Date().toISOString();
  // 1. Insights from behavioral patterns
  const patterns: DetectedPattern[] = engine.detectBehavioralPatterns();
  patterns.forEach((pattern, idx) => {
    let type: InsightType = 'nudge';
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    if (pattern.type === 'entropy_spike' || pattern.type === 'weekend_rebounder' || pattern.type === 'midweek_impulse') {
      type = 'alert';
      priority = 'high';
    }
    insights.push({
      id: `pattern_${idx}`,
      type,
      title: `Pattern detected: ${pattern.type.replace(/_/g, ' ')}`,
      description: pattern.description,
      priority,
      timestamp: now,
      actions: [pattern.actionSuggestion],
      source: 'behavioral pattern'
    });
  });
  // 2. Insights from goal progress (celebrations)
  goals.forEach((goal, idx) => {
    const progress = goal.currentAmount / goal.targetAmount;
    if (progress >= 0.75 && progress < 1) {
      insights.push({
        id: `goal_progress_${idx}`,
        type: 'celebration',
        title: `Goal Milestone: ${goal.name}`,
        description: `You're ${Math.round(progress * 100)}% towards your goal of $${goal.targetAmount.toLocaleString()}. Keep it up!`,
        priority: 'medium',
        timestamp: now,
        actions: [`Contribute more to ${goal.name}`, 'View goal details'],
        source: 'goal progress'
      });
    } else if (progress >= 1) {
      insights.push({
        id: `goal_complete_${idx}`,
        type: 'celebration',
        title: `Goal Achieved: ${goal.name}`,
        description: `Congratulations! You reached your goal of $${goal.targetAmount.toLocaleString()}.`,
        priority: 'low',
        timestamp: now,
        actions: ['Set a new goal', 'Celebrate!'],
        source: 'goal progress'
      });
    }
  });
  // 3. Insights from forecasting (alerts for negative net worth)
  try {
    const forecast = engine.monteCarloNetWorthForecast(10000, 0.05, 0.15, 1, 100);
    const belowZero = forecast.find(v => v < 0);
    if (belowZero !== undefined) {
      insights.push({
        id: 'forecast_warning',
        type: 'alert',
        title: 'Potential Cash Shortfall',
        description: 'Your net worth projection dips below zero in the next year based on current spending patterns.',
        priority: 'urgent',
        timestamp: now,
        actions: ['Reduce discretionary spending', 'Increase income', 'Review budget'],
        source: 'forecast'
      });
    }
  } catch (e) {
    // ignore forecast errors
  }
  return insights;
}
