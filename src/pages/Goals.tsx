import Navigation from "@/components/Navigation";
import GoalPill from "@/components/ui/goal-pill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus, 
  Home, 
  GraduationCap, 
  Shield, 
  Plane,
  Car,
  PiggyBank,
  TrendingUp,
  Calendar
} from "lucide-react";

const goals = [
  {
    id: 1,
    title: "Emergency Fund",
    target: "$10,000",
    progress: 42,
    deadline: "Dec 2025",
    status: "active" as const,
    icon: Shield
  },
  {
    id: 2,
    title: "House Down Payment",
    target: "$60,000",
    progress: 31,
    deadline: "Sep 2026",
    status: "active" as const,
    icon: Home
  },
  {
    id: 3,
    title: "Vacation Fund",
    target: "$5,000",
    progress: 78,
    deadline: "Jun 2025",
    status: "active" as const,
    icon: Plane
  },
  {
    id: 4,
    title: "New Car",
    target: "$25,000",
    progress: 15,
    deadline: "Mar 2026",
    status: "paused" as const,
    icon: Car
  },
  {
    id: 5,
    title: "Retirement Boost",
    target: "$100,000",
    progress: 100,
    deadline: "Completed",
    status: "completed" as const,
    icon: PiggyBank
  }
];

const Goals = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Financial Goals
              </h1>
              <p className="text-muted-foreground">
                Track your progress and see how goals impact your financial timeline
              </p>
            </div>
            
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Goals Grid */}
            <div className="lg:col-span-2">
              
              {/* Active Goals */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Active Goals
                  </h2>
                  <Badge variant="outline">{goals.filter(g => g.status === 'active').length} Active</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {goals.filter(goal => goal.status === 'active').map((goal) => (
                    <GoalPill
                      key={goal.id}
                      title={goal.title}
                      target={goal.target}
                      progress={goal.progress}
                      deadline={goal.deadline}
                      status={goal.status}
                      icon={goal.icon}
                      onClick={() => console.log('View goal:', goal.id)}
                      onEdit={() => console.log('Edit goal:', goal.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Other Goals */}
              <div className="space-y-6">
                
                {/* Completed */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-accent-success">Completed Goals</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {goals.filter(goal => goal.status === 'completed').map((goal) => (
                      <GoalPill
                        key={goal.id}
                        title={goal.title}
                        target={goal.target}
                        progress={goal.progress}
                        deadline={goal.deadline}
                        status={goal.status}
                        icon={goal.icon}
                        onClick={() => console.log('View goal:', goal.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Paused */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Paused Goals</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {goals.filter(goal => goal.status === 'paused').map((goal) => (
                      <GoalPill
                        key={goal.id}
                        title={goal.title}
                        target={goal.target}
                        progress={goal.progress}
                        deadline={goal.deadline}
                        status={goal.status}
                        icon={goal.icon}
                        onClick={() => console.log('View goal:', goal.id)}
                        onEdit={() => console.log('Edit goal:', goal.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Goal Overview */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Goal Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Goals</span>
                    <Badge variant="outline">{goals.length}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Goals</span>
                    <Badge className="bg-primary">{goals.filter(g => g.status === 'active').length}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <Badge className="bg-accent-success">{goals.filter(g => g.status === 'completed').length}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Target</span>
                    <span className="font-semibold">$200,000</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Progress</span>
                    <span className="font-semibold">$67,400</span>
                  </div>
                </div>
              </Card>

              {/* Goal Templates */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Start Templates</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Emergency Fund (3-6 months)
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Home className="w-4 h-4 mr-2" />
                    House Down Payment (20%)
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Education Fund
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <PiggyBank className="w-4 h-4 mr-2" />
                    Retirement Savings
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Plane className="w-4 h-4 mr-2" />
                    Dream Vacation
                  </Button>
                </div>
              </Card>

              {/* Goal Impact */}
              <Card className="p-6 bg-gradient-success">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent-success" />
                    <h3 className="font-semibold text-accent-foreground">Goal Impact</h3>
                  </div>
                  
                  <p className="text-sm text-accent-foreground/80">
                    Your current goals will improve your net worth by <strong>$85,000</strong> over the next 3 years.
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-accent-success/30 text-accent-foreground hover:bg-accent-success/10"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Timeline
                  </Button>
                </div>
              </Card>

              {/* Smart Suggestions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Smart Suggestions</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="font-medium mb-1">Optimize Emergency Fund</div>
                    <div className="text-muted-foreground">
                      Increase by $100/month to reach your goal 3 months earlier
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="font-medium mb-1">Bundle Savings</div>
                    <div className="text-muted-foreground">
                      Combine car and vacation funds for better interest rates
                    </div>
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

export default Goals;
