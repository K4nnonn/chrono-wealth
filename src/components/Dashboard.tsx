import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlatformInsightMarquee } from '@/components/PlatformInsightMarquee';
import { PlatformMacroRibbon } from '@/components/PlatformMacroRibbon';
import { PlatformTrajectoryMatrix } from '@/components/PlatformTrajectoryMatrix';
import { PlatformTile } from '@/components/PlatformTile';
import { PlatformGauge } from '@/components/PlatformGauge';
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
  Zap,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { InsightData, TimeHorizon } from '@/lib/eventBus';
import { 
  calculateMonthlyIncome,
  calculateSavingsRate,
  calculateGoalsVelocity,
  calculateResilienceScore,
  calculateLiquidityRunway
} from '@/lib/financialCalculations';

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  category: string | null;
}

interface MacroAssumptions {
  cpi: number;
  fedFunds: number;
  marketReturn: number;
  inflationAdjusted: boolean;
}

export const Dashboard = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>(5);
  const [macroAssumptions, setMacroAssumptions] = useState<MacroAssumptions>({
    cpi: 3.1,
    fedFunds: 4.75,
    marketReturn: 7.2,
    inflationAdjusted: true
  });

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

  // Sample financial data for sophisticated preview
  const monthlyIncome = 6800;
  const monthlyExpenses = 4200;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = (monthlySavings / monthlyIncome) * 100;

  // Platform insights with exact significance calculation
  const insights: InsightData[] = [
    {
      id: "weekend-spending",
      text: "Weekend spending +32% vs weekdays — dining accounts for 67% of variance",
      significance: 0.89,
      polarity: 'negative'
    },
    {
      id: "grocery-optimization", 
      text: "Switching grocery stores last month saved $127 — projected annual impact: $1,524",
      significance: 0.76,
      polarity: 'positive'
    },
    {
      id: "automation-opportunity",
      text: "You save mostly in salary-deposit week — automating transfers could smooth volatility",
      significance: 0.82,
      polarity: 'neutral'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* H-1: Insight Marquee */}
      <PlatformInsightMarquee insights={insights} />
      
      {/* H-2: Macro Ribbon */}
      <PlatformMacroRibbon 
        assumptions={macroAssumptions}
        onAdjust={setMacroAssumptions}
      />

      <div className="container mx-auto p-6 space-y-8">
        {/* Story-Driven Header */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              Financial Intelligence Platform
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Where every data point tells a story, every pattern reveals opportunity, 
            and every decision shapes your financial future.
          </p>
        </div>

        {/* K-1, K-2, K-3, K-4: Hero Quad Tiles */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PlatformTile
            id="K-1"
            label="Monthly Income"
            value={`$${monthlyIncome.toLocaleString()}`}
            variant="default"
            icon={DollarSign}
            subtitle="Current"
            lastUpdated="2024-07-23T10:30:00Z"
          />

          <PlatformTile
            id="K-2"
            label="Savings Power"
            value={`$${monthlySavings.toLocaleString()}`}
            variant="mint"
            icon={PiggyBank}
            subtitle="Current"
            lastUpdated="2024-07-23T10:30:00Z"
          />

          <PlatformTile
            id="K-3"
            label="Goals Velocity"
            value={3}
            variant="default"
            icon={Target}
            subtitle="Current"
            lastUpdated="2024-07-22T15:45:00Z"
          />

          <PlatformTile
            id="K-4"
            label="Resilience Score"
            value="85/100"
            variant="cream"
            icon={Shield}
            subtitle="Current"
            lastUpdated="2024-07-23T08:15:00Z"
          />
        </div>

        {/* Progressive Intelligence Tabs */}
        <div className="w-full">
          <Tabs defaultValue="trajectory" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-14 bg-muted/50 rounded-xl p-1">
              <TabsTrigger value="trajectory" className="rounded-lg font-medium flex flex-col gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs">Trajectory</span>
              </TabsTrigger>
              <TabsTrigger value="momentum" className="rounded-lg font-medium flex flex-col gap-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs">Momentum</span>
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="rounded-lg font-medium flex flex-col gap-1">
                <Brain className="w-4 h-4" />
                <span className="text-xs">Intelligence</span>
              </TabsTrigger>
              <TabsTrigger value="journeys" className="rounded-lg font-medium flex flex-col gap-1">
                <Route className="w-4 h-4" />
                <span className="text-xs">Journeys</span>
              </TabsTrigger>
            </TabsList>

            {/* T-1: Trajectory Matrix Card */}
            <TabsContent value="trajectory" className="space-y-8 mt-8">
              <PlatformTrajectoryMatrix 
                timeHorizon={timeHorizon}
                onTimeHorizonChange={setTimeHorizon}
                className="w-full"
              />
            </TabsContent>

            {/* Other tabs with sophisticated content */}
            <TabsContent value="momentum" className="space-y-6 mt-8">
               <div className="text-center py-12">
                 <Activity className="w-16 h-16 mx-auto mb-4" />
                 <h3 className="text-xl font-semibold mb-2">Behavioral Momentum Analytics</h3>
                 <p>
                   Advanced pattern recognition and habit tracking coming in this sophisticated view.
                 </p>
               </div>
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-6 mt-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Financial Intelligence Engine</h2>
                </div>
                 <p>
                   AI-powered insights that understand the 'why' behind every financial pattern.
                 </p>
              </div>
              <AIFinancialChat />
            </TabsContent>

            <TabsContent value="journeys" className="space-y-6 mt-8">
               <div className="text-center py-12">
                 <Route className="w-16 h-16 mx-auto mb-4" />
                 <h3 className="text-xl font-semibold mb-2">Financial Journeys</h3>
                 <p>
                   Narrative-driven goal tracking with predictive stress analysis and milestone rewards.
                 </p>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;