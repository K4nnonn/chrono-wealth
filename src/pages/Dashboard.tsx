import Navigation from "@/components/Navigation";
import ForecastCard from "@/components/ui/forecast-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  CreditCard,
  Brain,
  Target,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Zap
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          
          {/* AI Pulse Bar */}
          <div className="mb-6">
            <Card className="p-4 bg-gradient-flow">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold">Financial Pulse: Stable</div>
                    <div className="text-sm text-white/80">Last updated 3 minutes ago</div>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  All Clear
                </Badge>
              </div>
            </Card>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, Alex
            </h1>
            <p className="text-muted-foreground">
              Your financial journey is trending positive. Here's what's flowing.
            </p>
          </div>

          {/* Forecast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ForecastCard
              title="Net Worth"
              value="$47,850"
              change="+$2,340"
              confidence={87}
              icon={TrendingUp}
              variant="success"
            />
            
            <ForecastCard
              title="Monthly Cash Flow"
              value="$1,240"
              change="+$180"
              confidence={92}
              icon={DollarSign}
              variant="default"
            />
            
            <ForecastCard
              title="Savings Rate"
              value="22%"
              change="+3%"
              confidence={78}
              icon={PiggyBank}
              variant="success"
            />
            
            <ForecastCard
              title="Debt Payoff"
              value="18 months"
              change="-2 months"
              confidence={85}
              icon={CreditCard}
              variant="warning"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Forecast Timeline */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Financial Forecast</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      6 Months
                    </Button>
                    <Button variant="outline" size="sm">1 Year</Button>
                    <Button variant="outline" size="sm">5 Years</Button>
                  </div>
                </div>
                
                {/* Placeholder Chart */}
                <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="font-semibold text-foreground">Interactive Forecast Chart</h3>
                    <p className="text-muted-foreground text-sm">
                      Your financial timeline with confidence bands and milestones
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Confidence bands show 85% likelihood range
                  </div>
                  <Button size="sm" className="bg-gradient-primary">
                    <Brain className="w-4 h-4 mr-2" />
                    Simulate Changes
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Add New Goal
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="w-4 h-4 mr-2" />
                    Run Simulation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Crisis Test
                  </Button>
                </div>
              </Card>

              {/* Goals Progress */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Active Goals</h3>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Emergency Fund</span>
                      <span>$4,200 / $10,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent-success h-2 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>House Down Payment</span>
                      <span>$18,500 / $60,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "31%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Vacation Fund</span>
                      <span>$2,800 / $5,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "56%" }}></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* AI Insights */}
              <Card className="p-6 bg-gradient-success">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-accent-success" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-accent-foreground">Smart Insight</h4>
                    <p className="text-sm text-accent-foreground/80">
                      Moving $200 more per month to your emergency fund would reach your goal 4 months earlier.
                    </p>
                    <Button size="sm" variant="outline" className="border-accent-success/30 text-accent-foreground hover:bg-accent-success/10">
                      Apply This Change
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;