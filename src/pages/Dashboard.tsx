import React, { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PulseBar } from '@/components/PulseBar';
import { TimelineChart } from "@/components/TimelineChart";
import { QuickActionFab } from "@/components/QuickActionFab";
import { AIFinancialChat } from "@/components/AIFinancialChat";
import { FinancialHealthDashboard } from "@/components/FinancialHealthDashboard";
import { PlaidDashboard } from "@/components/PlaidDashboard";
import { PlaidLink } from "@/components/PlaidLink";
import { MetricCard, StatusCard, InsightCard } from "@/components/ui/enhanced-cards";
import { CallToActionSection } from "@/components/CallToActionSection";
import { 
  DollarSign, 
  TrendingUp, 
  Target,
  ArrowRight,
  Sparkles,
  BarChart3,
  PiggyBank,
  Shield,
  Brain,
  Zap,
  CreditCard,
  AlertTriangle
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
      console.error('Error fetching goals:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                Welcome back, {profile?.first_name || 'User'}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Here's your comprehensive financial overview and AI-powered insights.
            </p>
          </div>

          <PulseBar 
            status={pulseStatus} 
            message={getStatusMessage()}
            actionLabel={pulseStatus === 'critical' ? 'Fix Now' : 'Optimize'}
            onActionClick={() => {
              // Navigate to appropriate action based on status
              console.log('Action clicked for status:', pulseStatus);
            }}
          />
        </div>

        {/* Main Dashboard */}
        <div className="w-full">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/50 rounded-xl p-1">
              <TabsTrigger value="overview" className="rounded-lg font-medium">Overview</TabsTrigger>
              <TabsTrigger value="banking" className="rounded-lg font-medium">Banking</TabsTrigger>
              <TabsTrigger value="health" className="rounded-lg font-medium">Health Score</TabsTrigger>
              <TabsTrigger value="goals" className="rounded-lg font-medium">Goals</TabsTrigger>
              <TabsTrigger value="ai" className="rounded-lg font-medium">AI Advisor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-8">
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

              {/* Key Metrics Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Monthly Income"
                  value={`$${monthlyIncome.toLocaleString()}`}
                  change={hasPlaidData ? 'From bank data' : 'Manual input'}
                  changeType="neutral"
                  confidence={hasPlaidData ? 95 : 60}
                  icon={DollarSign}
                  variant="default"
                  trend="stable"
                />

                <MetricCard
                  title="Monthly Savings"
                  value={`$${monthlySavings.toLocaleString()}`}
                  change={`${savingsRate.toFixed(1)}% savings rate`}
                  changeType={monthlySavings > 0 ? 'positive' : 'negative'}
                  confidence={85}
                  icon={PiggyBank}
                  variant={monthlySavings > 0 ? 'success' : 'destructive'}
                  trend={monthlySavings > 0 ? 'up' : 'down'}
                />

                <MetricCard
                  title="Active Goals"
                  value={goals.length}
                  change={`${goals.filter(g => (g.current_amount / g.target_amount) * 100 >= 100).length} completed`}
                  changeType="positive"
                  icon={Target}
                  variant="default"
                  subtitle="Financial milestones"
                />

                <MetricCard
                  title="Financial Health"
                  value={pulseStatus === 'success' ? 'Excellent' : pulseStatus === 'normal' ? 'Good' : pulseStatus === 'warning' ? 'Fair' : 'Needs Work'}
                  confidence={78}
                  icon={Shield}
                  variant={pulseStatus === 'success' ? 'success' : pulseStatus === 'critical' ? 'destructive' : 'warning'}
                  subtitle="AI Assessment"
                />
              </div>

              {/* Insights Section */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-card bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Financial Timeline
                    </CardTitle>
                    <CardDescription>Your financial journey over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <TimelineChart />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <InsightCard
                    title="Emergency Fund Optimization"
                    insight="Based on your spending patterns, increasing your emergency fund by $200/month would reach the recommended 6-month coverage 4 months earlier."
                    impact="medium"
                    category="Savings Strategy"
                    action={{
                      label: "Optimize Savings",
                      onClick: () => console.log('Optimize savings clicked')
                    }}
                  />

                  <InsightCard
                    title="Debt Consolidation Opportunity"
                    insight="Consolidating your high-interest debts could save you $150/month in interest payments."
                    impact="high"
                    category="Debt Management"
                    action={{
                      label: "Learn More",
                      onClick: () => console.log('Debt consolidation clicked')
                    }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-3">
                <StatusCard
                  title="Run Crisis Simulation"
                  description="Test your financial resilience against various economic scenarios."
                  status="info"
                  action={{
                    label: "Start Simulation",
                    onClick: () => console.log('Crisis simulation clicked')
                  }}
                />

                <StatusCard
                  title="Set New Goal"
                  description="Define your next financial milestone and track your progress."
                  status="healthy"
                  action={{
                    label: "Create Goal",
                    onClick: () => console.log('Create goal clicked')
                  }}
                />

                <StatusCard
                  title="AI Financial Review"
                  description="Get personalized recommendations from our AI advisor."
                  status="info"
                  action={{
                    label: "Get Insights",
                    onClick: () => console.log('AI review clicked')
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="banking" className="space-y-6 mt-8">
              <PlaidDashboard />
              {/* Hidden PlaidLink for programmatic triggering */}
              <div className="hidden">
                <PlaidLink onSuccess={() => window.location.reload()} data-plaid-link />
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-6 mt-8">
              <FinancialHealthDashboard />
            </TabsContent>

            <TabsContent value="goals" className="space-y-6 mt-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Financial Goals</h2>
                  <p className="text-lg text-muted-foreground">Track your progress towards financial milestones</p>
                </div>
                <Button className="bg-gradient-primary hover:shadow-glow">
                  <Target className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>

              <div className="grid gap-6">
                {goals.map((goal) => {
                  const progress = (goal.current_amount / goal.target_amount) * 100;
                  return (
                    <Card key={goal.id} className="border-0 shadow-card hover-lift transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl">{goal.name}</CardTitle>
                            {goal.target_date && (
                              <p className="text-sm text-muted-foreground">
                                Target: {new Date(goal.target_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              ${goal.current_amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              of ${goal.target_amount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Progress value={progress} className="h-3" />
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{Math.round(progress)}% complete</span>
                            <span className="text-muted-foreground">
                              ${(goal.target_amount - goal.current_amount).toLocaleString()} remaining
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {goals.length === 0 && (
                  <Card className="border-dashed border-2 border-muted hover:border-primary/50 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <Target className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
                      <p className="text-muted-foreground text-center mb-6 max-w-md">
                        Start your financial journey by setting your first goal. Whether it's an emergency fund, 
                        vacation, or home down payment, we'll help you track your progress.
                      </p>
                      <Button className="bg-gradient-primary hover:shadow-glow">
                        <Target className="w-4 h-4 mr-2" />
                        Create Your First Goal
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6 mt-8">
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
          </Tabs>
        </div>

        {/* Call to Action Section */}
        <CallToActionSection />

        <QuickActionFab />
      </div>
    </div>
  );
};