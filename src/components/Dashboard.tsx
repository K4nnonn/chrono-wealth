import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InsightMarquee } from '@/components/InsightMarquee';
import { AnimatedKPITile } from '@/components/AnimatedKPITile';
import { ContextRibbon } from '@/components/ContextRibbon';
import { EnhancedTrajectoryMatrix } from '@/components/EnhancedTrajectoryMatrix';
import { BehavioralInsightEngine } from '@/components/BehavioralInsightEngine';
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
  const [timeHorizon, setTimeHorizon] = useState<1 | 3 | 5 | 10>(5);
  const [macroAssumptions, setMacroAssumptions] = useState({
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

  // Advanced insight detection (simulated)
  const insights = [
    {
      id: "weekend-spending",
      text: "Weekend spending +32% vs weekdays — dining accounts for 67% of variance",
      significance: 0.89,
      icon: TrendingUp
    },
    {
      id: "grocery-optimization", 
      text: "Switching grocery stores last month saved $127 — projected annual impact: $1,524",
      significance: 0.76,
      icon: Sparkles
    },
    {
      id: "automation-opportunity",
      text: "You save mostly in salary-deposit week — automating transfers could smooth volatility",
      significance: 0.82,
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header Insight Marquee */}
      <InsightMarquee insights={insights} />
      
      {/* Context Ribbon */}
      <ContextRibbon 
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

        {/* Hero Quad Tiles - Animated KPIs */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <AnimatedKPITile
            title="Monthly Income"
            pastValue={6200}
            currentValue={monthlyIncome}
            nextMilestone={7500}
            icon={DollarSign}
            variant="default"
            lastUpdated="2024-07-23T10:30:00Z"
          />

          <AnimatedKPITile
            title="Savings Power"
            pastValue={2100}
            currentValue={monthlySavings}
            nextMilestone={3000}
            icon={PiggyBank}
            variant="success"
            lastUpdated="2024-07-23T10:30:00Z"
          />

          <AnimatedKPITile
            title="Goals Velocity"
            pastValue={2}
            currentValue={3}
            nextMilestone={5}
            unit=""
            icon={Target}
            variant="default"
            lastUpdated="2024-07-22T15:45:00Z"
          />

          <AnimatedKPITile
            title="Resilience Score"
            pastValue={72}
            currentValue={85}
            nextMilestone={95}
            unit="/100"
            icon={Shield}
            variant="success"
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

            {/* Trajectory Tab - Sophisticated Analytics */}
            <TabsContent value="trajectory" className="space-y-8 mt-8">
              <EnhancedTrajectoryMatrix />
              <BehavioralInsightEngine />
              <div className="grid gap-6 md:grid-cols-2">
                {/* Savings Momentum Gauge */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-accent-success" />
                      Savings Momentum Gauge
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-accent-success/10 border border-accent-success/20 rounded-lg">
                      <Sparkles className="w-4 h-4 text-accent-success flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">⏱️ You save mostly in salary-deposit week—what if we automated transfers to the 1st?</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-6 text-xs">Show math</Button>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">Got it</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-accent-success mb-2">38.2%</div>
                      <div className="text-sm text-muted-foreground">Current 30-day rate</div>
                      <div className="mt-4 text-xs text-muted-foreground">
                        Pattern: "Back-Half Saver" — surplus appears in last 10 days
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Money Map Seismograph */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-accent-coral" />
                      Money Map Seismograph
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-accent-coral/10 border border-accent-coral/20 rounded-lg">
                      <Sparkles className="w-4 h-4 text-accent-coral flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">🍔 Weekend dining wipes out 43% of weekday discipline.</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-6 text-xs">Show impact</Button>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">Got it</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center py-8">
                      <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-accent-coral/20" />
                        <div className="absolute inset-2 rounded-full border-4 border-accent-coral/40 animate-pulse" />
                        <div className="absolute inset-4 rounded-full border-4 border-accent-coral animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-sm font-bold">Dining</div>
                            <div className="text-xs text-muted-foreground">High Volatility</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other tabs with sophisticated content */}
            <TabsContent value="momentum" className="space-y-6 mt-8">
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Behavioral Momentum Analytics</h3>
                <p className="text-muted-foreground">
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
                <p className="text-muted-foreground">
                  AI-powered insights that understand the 'why' behind every financial pattern.
                </p>
              </div>
              <AIFinancialChat />
            </TabsContent>

            <TabsContent value="journeys" className="space-y-6 mt-8">
              <div className="text-center py-12">
                <Route className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Financial Journeys</h3>
                <p className="text-muted-foreground">
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