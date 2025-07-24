export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string; // ISO date format
  category?: string; // optional spending category to link transactions
}

export interface Transaction {
  id: string;
  date: string; // ISO date format
  amount: number;
  category: string;
}

export interface GoalProgress {
  goalId: string;
  amountSaved: number;
  percentage: number;
  remaining: number;
  projectedCompletionDate?: string;
}

/**
 * Link a goal to transactional data to compute progress toward the goal.
 * If the goal specifies a category, only transactions from that category are considered.
 * Positive amounts increase savings while negative amounts decrease it.
 * The projected completion date is estimated based on average savings per day.
 */
export function linkGoalToData(goal: Goal, transactions: Transaction[]): GoalProgress {
  // Filter transactions by category if provided
  const relevant = goal.category
    ? transactions.filter((t) => t.category === goal.category)
    : transactions;
  // Compute net saved amount by summing all transaction amounts
  const amountSaved = relevant.reduce((sum, t) => sum + t.amount, 0);
  const percentage = goal.targetAmount > 0 ? Math.min(1, amountSaved / goal.targetAmount) : 0;
  const remaining = Math.max(0, goal.targetAmount - amountSaved);

  // Estimate projected completion date using average daily savings
  let projectedCompletionDate: string | undefined;
  if (amountSaved > 0 && amountSaved < goal.targetAmount && relevant.length > 1) {
    const sorted = relevant.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstDate = new Date(sorted[0].date);
    const lastDate = new Date(sorted[sorted.length - 1].date);
    const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 0) {
      const avgPerDay = amountSaved / daysDiff;
      if (avgPerDay > 0) {
        const daysRemaining = remaining / avgPerDay;
        const projectedDate = new Date(lastDate.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
        projectedCompletionDate = projectedDate.toISOString();
      }
    }
  }

  return {
    goalId: goal.id,
    amountSaved,
    percentage,
    remaining,
    projectedCompletionDate,
  };
}
