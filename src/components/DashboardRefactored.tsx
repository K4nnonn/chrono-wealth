import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlatformInsightMarquee } from '@/components/PlatformInsightMarquee';
import { PlatformMacroRibbon } from '@/components/PlatformMacroRibbon';
import { PlatformTrajectoryMatrix } from '@/components/PlatformTrajectoryMatrix';
import { SavingsMomentumGauge } from '@/components/SavingsMomentumGauge';
import { MoneyMapSeismograph } from '@/components/MoneyMapSeismograph';
import { ShowMathModal } from '@/components/ShowMathModal';
import { AIFinancialChat } from "@/components/AIFinancialChat";
import { 
  DollarSign, 
  Target,
  PiggyBank,
  Shield,
  Brain,
  Eye,
  Activity,
  Route
} from 'lucide-react';
import { InsightData, TimeHorizon, eventBus, EVENTS } from '@/lib/eventBus';

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

interface HeroTileProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'default' | 'mint' | 'rose' | 'cream';
  sentiment?: 'positive' | 'negative' | 'neutral';
}

const HeroTile: React.FC<HeroTileProps> = ({ label, value, icon: Icon, variant, sentiment }) => {
  const isNegative = sentiment === 'negative';
  
  return (
    <div 
      className={`
        w-60 h-25 p-7 rounded-xl shadow-platform
        ${isNegative ? 'bg-[#FBEAEA]' : 'bg-white'}
        flex flex-col justify-between
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div>
        <div className={`
          text-2xl font-bold mb-1
          ${sentiment === 'positive' ? 'text-mint' : 
            sentiment === 'negative' ? 'text-rose' : 'text-navy'}
        `}>
          {value}
        </div>
        <div className="text-xs font-medium text-[#67728A]">
          {label}
        </div>
      </div>
    </div>
  );
};

export const DashboardRefactored = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>(5);
  const [activeTab, setActiveTab] = useState('trajectory');
  const [showMathModal, setShowMathModal] = useState(false);
  const [macroAssumptions, setMacroAssumptions] = useState<MacroAssumptions>({
    cpi: 3.1,
    fedFunds: 4.75,
    marketReturn: 7.2,
    inflationAdjusted: true
  });

  useEffect(() => {
    fetchGoals();
    
    // Global event bus setup
    const handleTimePropagation = (horizon: TimeHorizon) => {
      setTimeHorizon(horizon);
    };

    eventBus.on(EVENTS.PROPAGATE_TIME, handleTimePropagation);
    
    return () => {
      eventBus.off(EVENTS.PROPAGATE_TIME, handleTimePropagation);
    };
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
  const savingsSentiment = monthlySavings >= 0 ? 'positive' : 'negative';

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

  const handleTimeHorizonChange = (horizon: TimeHorizon) => {
    setTimeHorizon(horizon);
    // Emit global propagation event
    eventBus.emit(EVENTS.PROPAGATE_TIME, horizon);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* H-1: Insight Marquee */}
      <PlatformInsightMarquee insights={insights} />
      
      {/* H-2: Macro Ribbon - Full width, center-aligned */}
      <div className="w-full bg-[#F7F9FB] border-b border-[#E5E9F0] py-1 px-3">
        <div className="text-center">
          <PlatformMacroRibbon 
            assumptions={macroAssumptions}
            onAdjust={setMacroAssumptions}
          />
        </div>
      </div>

      {/* 12-Column Grid Layout */}
      <div className="dashboard-grid">
        {/* Story-Driven Header */}
        <div className="col-span-12 text-center space-y-4 py-8">
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

        {/* Hero KPI Tiles - Columns 2-11 */}
        <div className="dashboard-hero-tiles">
          <div className="flex justify-between space-x-6">
            <HeroTile
              label="Monthly Income"
              value={`$${monthlyIncome.toLocaleString()}`}
              variant="default"
              icon={DollarSign}
              sentiment="neutral"
            />

            <HeroTile
              label="Savings Power"
              value={`$${monthlySavings.toLocaleString()}`}
              variant="mint"
              icon={PiggyBank}
              sentiment={savingsSentiment}
            />

            <HeroTile
              label="Goals Velocity"
              value={3}
              variant="default"
              icon={Target}
              sentiment="neutral"
            />

            <HeroTile
              label="Resilience Score"
              value="85/100"
              variant="cream"
              icon={Shield}
              sentiment="positive"
            />
          </div>
        </div>

        {/* Progressive Intelligence Tabs - Main Content */}
        <div className="dashboard-main-content">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList 
              className="grid w-full grid-cols-4 h-14 bg-muted/50 rounded-xl p-1"
              role="tablist"
            >
              <TabsTrigger 
                value="trajectory" 
                className="rounded-lg font-medium flex flex-col gap-1 text-xs uppercase tracking-wide tab-underline"
                role="tab"
                aria-selected={activeTab === 'trajectory'}
                tabIndex={0}
              >
                <Eye className="w-4 h-4" />
                <span>Trajectory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="momentum" 
                className="rounded-lg font-medium flex flex-col gap-1 text-xs uppercase tracking-wide tab-underline"
                role="tab"
                aria-selected={activeTab === 'momentum'}
                tabIndex={0}
              >
                <Activity className="w-4 h-4" />
                <span>Momentum</span>
              </TabsTrigger>
              <TabsTrigger 
                value="intelligence" 
                className="rounded-lg font-medium flex flex-col gap-1 text-xs uppercase tracking-wide tab-underline"
                role="tab"
                aria-selected={activeTab === 'intelligence'}
                tabIndex={0}
              >
                <Brain className="w-4 h-4" />
                <span>Intelligence</span>
              </TabsTrigger>
              <TabsTrigger 
                value="journeys" 
                className="rounded-lg font-medium flex flex-col gap-1 text-xs uppercase tracking-wide tab-underline"
                role="tab"
                aria-selected={activeTab === 'journeys'}
                tabIndex={0}
              >
                <Route className="w-4 h-4" />
                <span>Journeys</span>
              </TabsTrigger>
            </TabsList>

            {/* T-1: Trajectory Matrix Card */}
            <TabsContent value="trajectory" className="space-y-8 mt-8">
              {/* Full width trajectory matrix */}
              <PlatformTrajectoryMatrix 
                timeHorizon={timeHorizon}
                onTimeHorizonChange={handleTimeHorizonChange}
                onShowMath={() => setShowMathModal(true)}
              />

              {/* Two-column layout for large screens */}
              <div className="grid gap-8 lg:grid-cols-2">
                <SavingsMomentumGauge 
                  momentum={38.2}
                  timeHorizon={timeHorizon}
                />
                
                <MoneyMapSeismograph 
                  timeHorizon={timeHorizon}
                />
              </div>
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

      {/* Show Math Modal */}
      <ShowMathModal
        isOpen={showMathModal}
        onClose={() => setShowMathModal(false)}
        timeHorizon={timeHorizon}
      />
    </div>
  );
};

export default DashboardRefactored;
