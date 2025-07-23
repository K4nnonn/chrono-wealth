import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineChart } from "@/components/TimelineChart";
import { PulseBar } from "@/components/PulseBar";
import { QuickActionFab } from "@/components/QuickActionFab";
import { FinancialHealthDashboard } from "@/components/FinancialHealthDashboard";
import { AIFinancialChat } from "@/components/AIFinancialChat";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, Target, Calendar } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, financialData } = useProfile();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const monthlyIncome = financialData?.annual_salary ? (financialData.annual_salary / 12) : 0;
  const monthlyExpenses = (financialData?.monthly_rent || 0) + (financialData?.monthly_subscriptions || 0);
  const monthlySavings = monthlyIncome - monthlyExpenses;

  const getPulseStatus = () => {
    if (monthlySavings < 0) return { status: 'critical' as const, message: 'Cash flow negative - immediate attention needed' };
    if (monthlySavings < 500) return { status: 'warning' as const, message: 'Low savings rate - consider optimizing expenses' };
    if (monthlySavings > 2000) return { status: 'success' as const, message: 'Excellent financial health - on track for all goals' };
    return { status: 'normal' as const, message: 'Stable financial position - room for optimization' };
  };

  return (
    <div className="min-h-screen bg-background">
      <PulseBar {...getPulseStatus()} />

      <Tabs defaultValue="overview" className="container mx-auto p-6">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health-score">Health Score</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="ai-advisor">AI Advisor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}
            </h1>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-background-card rounded-lg border">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">${monthlyIncome.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Monthly Income</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-background-card rounded-lg border">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">${monthlySavings.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Monthly Savings</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-background-card rounded-lg border">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{goals.length}</div>
                  <div className="text-sm text-muted-foreground">Active Goals</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-background-card rounded-lg border">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">45 days</div>
                  <div className="text-sm text-muted-foreground">Next Milestone</div>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-6 bg-background-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Financial Timeline</h2>
                <p className="text-muted-foreground">Your projected financial future</p>
              </div>
            </div>
            <TimelineChart />
          </Card>
        </TabsContent>

        <TabsContent value="health-score">
          <FinancialHealthDashboard />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Financial Goals</h2>
            <Button onClick={() => navigate('/goals')}>Manage All</Button>
          </div>
          
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 bg-background-card rounded-lg border">
                  <div className="space-y-2">
                    <h3 className="font-medium">{goal.name}</h3>
                    <div className="flex justify-between text-sm">
                      <span>${goal.current_amount.toLocaleString()}</span>
                      <span>${goal.target_amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((goal.current_amount / goal.target_amount) * 100)}% complete
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-background-card">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-4">Set your first financial goal</p>
              <Button onClick={() => navigate('/goals')}>Add Your First Goal</Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-advisor">
          <AIFinancialChat className="max-w-4xl mx-auto" />
        </TabsContent>
      </Tabs>

      <QuickActionFab
        onSimulate={() => navigate('/simulate')}
        onAddGoal={() => navigate('/goals')}
        onOpenAI={() => navigate('/planner')}
        onCrisisMode={() => navigate('/crisis')}
      />
    </div>
  );
};

export default Dashboard;