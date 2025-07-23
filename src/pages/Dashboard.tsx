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
import { 
  DollarSign, 
  TrendingUp, 
  Target,
  ArrowRight 
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

  const getPulseStatus = (savings: number) => {
    if (savings < 0) return 'critical';
    if (savings < monthlyIncome * 0.1) return 'warning';
    if (savings < monthlyIncome * 0.2) return 'normal';
    return 'success';
  };

  const pulseStatus = getPulseStatus(monthlySavings);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.first_name || 'User'}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your financial health and progress.
        </p>
      </div>

      <PulseBar 
        status={pulseStatus} 
        message={
          pulseStatus === 'critical' ? 'Immediate attention needed for your finances' :
          pulseStatus === 'warning' ? 'Some areas need improvement' :
          pulseStatus === 'success' ? 'Your finances are on track!' :
          'Your financial health is stable'
        } 
      />

      <div className="w-full">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="health">Health Score</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="ai">AI Advisor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {!hasPlaidData && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Get Real-Time Financial Insights
                  </CardTitle>
                  <CardDescription>
                    Connect your bank accounts to unlock personalized financial health scoring and automated expense tracking.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PlaidLink onSuccess={() => window.location.reload()} />
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${monthlyIncome.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {hasPlaidData ? 'From bank data' : financialData?.has_variable_income ? 'Variable income' : 'Fixed income'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${monthlySavings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {monthlySavings > 0 ? 'On track' : 'Needs attention'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{goals.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {goals.filter(g => (g.current_amount / g.target_amount) * 100 >= 100).length} completed
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Financial Timeline</CardTitle>
                <CardDescription>Your financial journey over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TimelineChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking" className="space-y-6">
            <PlaidDashboard />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <FinancialHealthDashboard />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Financial Goals</h2>
                <p className="text-muted-foreground">Track your progress towards financial milestones</p>
              </div>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>

            <div className="grid gap-4">
              {goals.map((goal) => {
                const progress = (goal.current_amount / goal.target_amount) * 100;
                return (
                  <Card key={goal.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
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
                      <div className="space-y-2">
                        <Progress value={progress} className="w-full" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{Math.round(progress)}% complete</span>
                          {goal.target_date && (
                            <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {goals.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Start your financial journey by setting your first goal
                    </p>
                    <Button>
                      <Target className="w-4 h-4 mr-2" />
                      Create Your First Goal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex justify-center">
              <Button variant="outline">
                <ArrowRight className="w-4 h-4 mr-2" />
                Manage All Goals
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <AIFinancialChat />
          </TabsContent>
        </Tabs>
      </div>

      <QuickActionFab />
    </div>
  );
};