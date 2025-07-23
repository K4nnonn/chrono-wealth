import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Calendar,
  DollarSign,
  PiggyBank,
  CreditCard,
  Wallet
} from "lucide-react";

const Dashboard = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Your Financial Future, Visualized
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See exactly where your money is headed with AI-powered forecasts that adapt to your spending patterns and life changes.
          </p>
        </div>

        {/* Demo Dashboard */}
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-success">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-foreground/70">Net Worth Forecast</p>
                  <p className="text-2xl font-bold text-accent-foreground">$52,340</p>
                  <div className="flex items-center gap-1 text-xs text-accent-success">
                    <TrendingUp className="w-3 h-3" />
                    +12.5% from last month
                  </div>
                </div>
                <PiggyBank className="w-8 h-8 text-accent-success" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Savings</p>
                  <p className="text-2xl font-bold text-foreground">$1,247</p>
                  <div className="flex items-center gap-1 text-xs text-accent-success">
                    <TrendingUp className="w-3 h-3" />
                    On track for goals
                  </div>
                </div>
                <Wallet className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bills Due Soon</p>
                  <p className="text-2xl font-bold text-foreground">$2,156</p>
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <Calendar className="w-3 h-3" />
                    3 bills in 5 days
                  </div>
                </div>
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6 bg-destructive/5 border-destructive/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-destructive-foreground/70">Risk Alert</p>
                  <p className="text-2xl font-bold text-destructive-foreground">Low Buffer</p>
                  <div className="flex items-center gap-1 text-xs text-destructive-foreground">
                    <AlertCircle className="w-3 h-3" />
                    12 days left
                  </div>
                </div>
                <AlertCircle className="w-8 h-8 text-destructive-foreground" />
              </div>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Forecast Chart */}
            <Card className="lg:col-span-2 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">6-Month Cash Flow Forecast</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    AI Powered
                  </Badge>
                </div>
                
                {/* Mock Chart */}
                <div className="h-64 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto" />
                    <p className="text-muted-foreground">Interactive forecast chart</p>
                    <p className="text-sm text-muted-foreground">Hover to see detailed predictions</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Next Month</p>
                    <p className="text-lg font-semibold text-accent-success">+$1,840</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">3 Months</p>
                    <p className="text-lg font-semibold text-accent-success">+$4,920</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">6 Months</p>
                    <p className="text-lg font-semibold text-accent-success">+$8,760</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-foreground">AI Insights</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg border border-accent-success/20">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-success rounded-full mt-2"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-accent-foreground">Optimization Opportunity</p>
                      <p className="text-xs text-accent-foreground/80">You could save $340/month by switching to a high-yield savings account.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-primary">Goal Progress</p>
                      <p className="text-xs text-muted-foreground">You're 2 months ahead of your vacation savings goal!</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-orange-700">Bill Reminder</p>
                      <p className="text-xs text-orange-600">Netflix subscription renews in 3 days ($15.99)</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-primary">
                Ask AI About My Finances
              </Button>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Goals */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Financial Goals</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Emergency Fund</span>
                    <span className="text-sm text-muted-foreground">$4,200 / $6,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-success w-[70%] rounded-full"></div>
                  </div>
                  <p className="text-xs text-accent-success">On track to complete by March 2025</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Vacation Fund</span>
                    <span className="text-sm text-muted-foreground">$1,800 / $3,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary w-[60%] rounded-full"></div>
                  </div>
                  <p className="text-xs text-primary">2 months ahead of schedule!</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">New Car Down Payment</span>
                    <span className="text-sm text-muted-foreground">$850 / $5,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-forecast w-[17%] rounded-full"></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Estimated completion: December 2025</p>
                </div>
              </div>
            </Card>

            {/* Scenario Simulator */}
            <Card className="p-6 bg-gradient-card">
              <h3 className="text-xl font-semibold text-foreground mb-4">Crisis Simulator</h3>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Model different scenarios to see how they'd impact your financial future.
                </p>
                
                <div className="grid gap-3">
                  <Button variant="outline" size="sm" className="justify-start">
                    🚨 What if I lose my job?
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    📈 What if I get a 20% raise?
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    🏠 What if I move to a cheaper city?
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    💡 Custom scenario...
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-2">Last simulation:</p>
                  <p className="text-sm font-medium text-foreground">"20% salary increase"</p>
                  <p className="text-xs text-accent-success">Result: $47K additional savings over 2 years</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
            Try Interactive Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;