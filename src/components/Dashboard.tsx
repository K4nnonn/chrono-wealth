import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignalStrip } from '@/components/SignalStrip';
import { PulseTile } from '@/components/PulseTile';
import { DualAxisTimeline } from '@/components/DualAxisTimeline';
import { MoneyMap } from '@/components/MoneyMap';
import { JourneyCard } from '@/components/JourneyCard';
import { ContextualActionOrb } from '@/components/ContextualActionOrb';
import { AIFinancialChat } from "@/components/AIFinancialChat";
import { 
  DollarSign, 
  TrendingUp, 
  Target,
  PiggyBank,
  Shield,
  Brain,
  Eye,
  Activity,
  Route,
  MessageSquare
} from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  category: string | null;
}

export const Dashboard = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  // Sample financial data for preview
  const monthlyIncome = 6000;
  const monthlyExpenses = 4200;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = (monthlySavings / monthlyIncome) * 100;

  const getPulseStatus = (savings: number) => {
    if (savings < 0) return 'critical';
    if (savings < monthlyIncome * 0.1) return 'warning';
    if (savings < monthlyIncome * 0.2) return 'normal';
    return 'success';
  };

  const pulseStatus = getPulseStatus(monthlySavings);

  const getStatusMessage = () => {
    switch (pulseStatus) {
      case 'critical':
        return 'Immediate attention needed - expenses exceed income';
      case 'warning':
        return 'Low savings rate detected - consider optimization';
      case 'success':
        return 'Excellent financial health - keep up the great work!';
      default:
        return 'Your financial health is stable with room for improvement';
    }
  };

  const getSignalUrgency = () => {
    switch (pulseStatus) {
      case 'critical':
        return 'critical' as const;
      case 'warning':
        return 'warning' as const;
      default:
        return 'advisory' as const;
    }
  };

  // Sample milestone data
  const sampleMilestones = [
    { id: '1', title: '3-Month Emergency Fund', amount: 15000, date: '2024-12-31', completed: true },
    { id: '2', title: '6-Month Emergency Fund', amount: 30000, date: '2025-06-30', completed: false },
    { id: '3', title: 'Full Emergency Fund', amount: 50000, date: '2025-12-31', completed: false }
  ];

  return (
    <>
      {/* Signal Strip - Persistent across top */}
      <SignalStrip 
        urgency={getSignalUrgency()}
        message={getStatusMessage()}
        action={{
          label: pulseStatus === 'critical' ? 'Fix Now' : 'Optimize',
          onClick: () => console.log('Signal action clicked')
        }}
        onDismiss={() => console.log('Signal dismissed')}
        onSnooze={() => console.log('Signal snoozed')}
        onBookmark={() => console.log('Signal bookmarked')}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto p-6 space-y-8">
          {/* Greeting Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                Hello, {new Date().getFullYear()} Financial Future!
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Your forward-looking financial command center.
            </p>
          </div>

          {/* Progressive Disclosure Tabs */}
          <div className="w-full">
            <Tabs defaultValue="vision" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-14 bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="vision" className="rounded-lg font-medium flex flex-col gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">Vision</span>
                </TabsTrigger>
                <TabsTrigger value="vitals" className="rounded-lg font-medium flex flex-col gap-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs">Vitals</span>
                </TabsTrigger>
                <TabsTrigger value="strategies" className="rounded-lg font-medium flex flex-col gap-1">
                  <Brain className="w-4 h-4" />
                  <span className="text-xs">Strategies</span>
                </TabsTrigger>
                <TabsTrigger value="journeys" className="rounded-lg font-medium flex flex-col gap-1">
                  <Route className="w-4 h-4" />
                  <span className="text-xs">Journeys</span>
                </TabsTrigger>
              </TabsList>

              {/* Vision Tab - Forward-Looking Projections */}
              <TabsContent value="vision" className="space-y-8 mt-8">
                {/* Dynamic Pulse Tiles */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <PulseTile
                    title="Monthly Income"
                    value={`$${monthlyIncome.toLocaleString()}`}
                    trend="stable"
                    trendValue="Projected growth"
                    confidence={95}
                    icon={DollarSign}
                    variant="default"
                  />

                  <PulseTile
                    title="Monthly Savings"
                    value={`$${monthlySavings.toLocaleString()}`}
                    trend="up"
                    trendValue={`${savingsRate.toFixed(1)}% savings rate`}
                    confidence={85}
                    icon={PiggyBank}
                    variant="success"
                  />

                  <PulseTile
                    title="Active Goals"
                    value={3}
                    trend="up"
                    trendValue="2 on track"
                    icon={Target}
                    variant="default"
                  />

                  <PulseTile
                    title="Financial Health"
                    value="Excellent"
                    trend="up"
                    trendValue="AI Assessment"
                    confidence={78}
                    icon={Shield}
                    variant="success"
                  />
                </div>

                {/* Dual-Axis Financial Timeline */}
                <DualAxisTimeline 
                  onTimeChange={(year) => console.log('Time changed to:', year)}
                />

                {/* Money Flow Engine */}
                <MoneyMap 
                  totalIncome={monthlyIncome}
                  savingsRate={savingsRate}
                  flows={{
                    taxes: { category: "Taxes", amount: Math.round(monthlyIncome * 0.2), percentage: 20, change: 0 },
                    fixedCosts: [
                      { category: "Rent", amount: 1800, percentage: 30, change: 0 },
                      { category: "Insurance", amount: 300, percentage: 5, change: -5 },
                      { category: "Utilities", amount: 200, percentage: 3.3, change: 12 }
                    ],
                    discretionary: [
                      { category: "Dining", amount: 400, percentage: 6.7, change: 12, aiInsight: "Dining out up 12% vs. last month; skip 3 meals → +$87/mo" },
                      { category: "Entertainment", amount: 200, percentage: 3.3, change: -8 },
                      { category: "Shopping", amount: 300, percentage: 5, change: 25, aiInsight: "Shopping spike detected; review recent purchases" }
                    ],
                    savings: { category: "Savings", amount: monthlySavings, percentage: savingsRate, change: 15 }
                  }}
                />
              </TabsContent>

              {/* Vitals Tab - Current Status */}
              <TabsContent value="vitals" className="space-y-6 mt-8">
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Financial Vitals</h3>
                  <p className="text-muted-foreground">
                    Real-time financial health monitoring coming soon.
                  </p>
                </div>
              </TabsContent>

              {/* Strategies Tab - AI Simulations */}
              <TabsContent value="strategies" className="space-y-6 mt-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">AI Financial Strategies</h2>
                  </div>
                  <p className="text-muted-foreground">
                    Explore what-if scenarios and get AI-powered financial recommendations.
                  </p>
                </div>
                <AIFinancialChat />
              </TabsContent>

              {/* Journeys Tab - Goal Narratives */}
              <TabsContent value="journeys" className="space-y-6 mt-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Financial Journeys</h2>
                    <p className="text-lg text-muted-foreground">Living narratives of your financial milestones</p>
                  </div>
                  <Button className="bg-gradient-primary hover:shadow-glow">
                    <Target className="w-4 h-4 mr-2" />
                    New Journey
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <JourneyCard
                    id="emergency-fund"
                    title="Emergency Fund"
                    targetAmount={50000}
                    currentAmount={35000}
                    targetDate="2025-12-31"
                    category="Safety Net"
                    riskLevel="low"
                    milestones={sampleMilestones}
                    onActionPlan={(goalId) => console.log('Action plan for goal:', goalId)}
                  />

                  <JourneyCard
                    id="house-down-payment"
                    title="House Down Payment"
                    targetAmount={80000}
                    currentAmount={25000}
                    targetDate="2026-06-30"
                    category="Real Estate"
                    riskLevel="medium"
                    milestones={sampleMilestones}
                    onActionPlan={(goalId) => console.log('Action plan for goal:', goalId)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Contextual Action Orb */}
        <ContextualActionOrb 
          onNewGoal={() => console.log('New goal from orb')}
          onWhatIfScenario={() => console.log('What-if scenario from orb')}
          onCrisisDrill={() => console.log('Crisis drill from orb')}
          onAIChat={() => console.log('AI chat from orb')}
        />
      </div>
    </>
  );
};

export default Dashboard;