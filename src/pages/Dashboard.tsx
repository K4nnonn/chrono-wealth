import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignalStrip } from '@/components/SignalStrip';
import { PulseTile } from '@/components/PulseTile';
import { DualAxisTimeline } from '@/components/DualAxisTimeline';
import { MoneyMap } from '@/components/MoneyMap';
import { EnhancedTrajectoryMatrix } from '@/components/EnhancedTrajectoryMatrix';
import { BehavioralInsightEngine } from '@/components/BehavioralInsightEngine';
import { JourneyCard } from '@/components/JourneyCard';
import { ContextualActionOrb } from '@/components/ContextualActionOrb';
import { AIFinancialChat } from "@/components/AIFinancialChat";
import { FinancialHealthDashboard } from "@/components/FinancialHealthDashboard";
import { PlaidDashboard } from "@/components/PlaidDashboard";
import { PlaidLink } from "@/components/PlaidLink";
import { StatusCard } from "@/components/ui/enhanced-cards";
import { CallToActionSection } from "@/components/CallToActionSection";
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

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number | null;
  target_date: string | null;
  category: string | null;
}

export const Dashboard = () => {
  const { profile, financialData, hasPlaidData } = useProfile();
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
      if (import.meta.env.DEV) {
        console.error('Error fetching goals:', error);
      }
    }
  };

  // Calculate financial metrics
  const monthlyIncome = financialData?.annual_salary ? Math.round(financialData.annual_salary / 12) : 0;
  const monthlyExpenses = (financialData?.monthly_rent || 0) + (financialData?.monthly_subscriptions || 0);
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

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

  // Sample journey data for goals
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
          onClick: () => {
            // Signal action implementation
          }
        }}
        onDismiss={() => {
          // Signal dismiss implementation
        }}
        onSnooze={() => {
          // Signal snooze implementation
        }}
        onBookmark={() => {
          // Signal bookmark implementation
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto p-6 space-y-8">
          {/* Greeting Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                Hello, {new Date().getFullYear()} {profile?.first_name || 'User'}!
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
                    trendValue={hasPlaidData ? 'From bank data' : 'Manual input'}
                    confidence={hasPlaidData ? 95 : 60}
                    icon={DollarSign}
                    variant="default"
                  />

                  <PulseTile
                    title="Monthly Savings"
                    value={`$${monthlySavings.toLocaleString()}`}
                    trend={monthlySavings > 0 ? 'up' : 'down'}
                    trendValue={`${savingsRate.toFixed(1)}% savings rate`}
                    confidence={85}
                    icon={PiggyBank}
                    variant={monthlySavings > 0 ? 'success' : 'destructive'}
                  />

                  <PulseTile
                    title="Active Goals"
                    value={goals.length}
                    trend="up"
                    trendValue={`${goals.filter(g => ((g.current_amount || 0) / g.target_amount) * 100 >= 100).length} completed`}
                    icon={Target}
                    variant="default"
                  />

                  <PulseTile
                    title="Financial Health"
                    value={pulseStatus === 'success' ? 'Excellent' : pulseStatus === 'normal' ? 'Good' : pulseStatus === 'warning' ? 'Fair' : 'Needs Work'}
                    trend={pulseStatus === 'success' ? 'up' : 'stable'}
                    trendValue="AI Assessment"
                    confidence={78}
                    icon={Shield}
                    variant={pulseStatus === 'success' ? 'success' : pulseStatus === 'critical' ? 'destructive' : 'warning'}
                  />
                </div>

                {/* Enhanced Trajectory Matrix with Multi-Layer Forecasting */}
                <EnhancedTrajectoryMatrix />

                {/* Behavioral Intelligence Engine */}
                <BehavioralInsightEngine />

                {/* Dual-Axis Financial Timeline */}
                <DualAxisTimeline 
                  onTimeChange={(_year) => {
                    // Time change implementation
                  }}
                />

                {/* Money Flow Engine */}
                <MoneyMap 
                  totalIncome={monthlyIncome}
                  savingsRate={savingsRate}
                  flows={{
                    taxes: { category: "Taxes", amount: Math.round(monthlyIncome * 0.2), percentage: 20, change: 0 },
                    fixedCosts: [
                      { category: "Rent", amount: financialData?.monthly_rent || 0, percentage: 30, change: 0 },
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
                {/* Plaid Connection Prompt */}
                {!hasPlaidData && (
                  <StatusCard
                    title="Connect Your Bank Accounts"
                    description="Unlock real-time financial insights and automated expense tracking by connecting your bank accounts securely."
                    status="info"
                    action={{
                      label: "Connect Bank Account",
                      onClick: () => {
                        const plaidElement = document.querySelector('[data-plaid-link]') as HTMLElement;
                        plaidElement?.click();
                      }
                    }}
                    className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"
                  />
                )}

                <PlaidDashboard />
                <FinancialHealthDashboard />
                
                {/* Hidden PlaidLink for programmatic triggering */}
                <div className="hidden">
                  <PlaidLink onSuccess={() => window.location.reload()} data-plaid-link />
                </div>
              </TabsContent>

              {/* Strategies Tab - AI Simulations */}
              <TabsContent value="strategies" className="space-y-6 mt-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">AI Financial Advisor</h2>
                  </div>
                  <p className="text-muted-foreground">
                    Get personalized financial advice powered by advanced AI and real-time data analysis.
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
                  {goals.map((goal) => (
                    <JourneyCard
                      key={goal.id}
                      id={goal.id}
                      title={goal.name}
                      targetAmount={goal.target_amount}
                      currentAmount={goal.current_amount || 0}
                      targetDate={goal.target_date || new Date().toISOString()}
                      category={goal.category || 'General'}
                      riskLevel="medium"
                      milestones={sampleMilestones}
                      onActionPlan={(_goalId) => {
                        // Action plan implementation
                      }}
                    />
                  ))}

                  {goals.length === 0 && (
                    <div className="md:col-span-2">
                      <Card className="border-dashed border-2 border-muted hover:border-primary/50 transition-colors">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                          <Route className="w-16 h-16 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-semibold mb-2">No journeys yet</h3>
                          <p className="text-muted-foreground text-center mb-6 max-w-md">
                            Begin your financial story by creating your first journey. Each journey transforms a simple goal into a living narrative with milestones, insights, and AI-guided action plans.
                          </p>
                          <Button className="bg-gradient-primary hover:shadow-glow">
                            <Route className="w-4 h-4 mr-2" />
                            Start Your First Journey
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Call to Action Section */}
          <CallToActionSection />
        </div>

        {/* Contextual Action Orb */}
        <ContextualActionOrb 
          onNewGoal={() => {
            // New goal implementation
          }}
          onWhatIfScenario={() => {
            // What-if scenario implementation
          }}
          onCrisisDrill={() => {
            // Crisis drill implementation
          }}
          onAIChat={() => {
            // AI chat implementation
          }}
        />
      </div>
    </>
  );
};