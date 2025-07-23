import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Target,
  Zap,
  Filter,
  Calendar,
  ArrowRight
} from "lucide-react";

const insights = [
  {
    id: 1,
    type: "opportunity",
    title: "Optimize Your 401k Contribution",
    description: "Increasing your 401k by 2% would save you $1,200 in taxes this year and accelerate retirement by 8 months.",
    impact: "+$12,400",
    timeframe: "This year",
    priority: "high",
    timestamp: "2 hours ago",
    actions: [
      "Increase 401k to 15%",
      "See tax impact",
      "Update timeline"
    ]
  },
  {
    id: 2,
    type: "risk",
    title: "Cash Flow Alert",
    description: "Your checking account may dip below $500 in 12 days due to upcoming rent payment and subscription renewals.",
    impact: "-$340",
    timeframe: "12 days",
    priority: "urgent",
    timestamp: "1 hour ago",
    actions: [
      "Transfer from savings",
      "Delay non-essential purchases",
      "Review subscriptions"
    ]
  },
  {
    id: 3,
    type: "achievement",
    title: "Emergency Fund Milestone",
    description: "Congratulations! You've reached 75% of your emergency fund goal. You're ahead of schedule by 2 months.",
    impact: "+$7,500",
    timeframe: "Achieved",
    priority: "medium",
    timestamp: "Yesterday",
    actions: [
      "Celebrate progress",
      "Adjust goal timeline",
      "Plan next milestone"
    ]
  },
  {
    id: 4,
    type: "optimization",
    title: "Subscription Audit Opportunity",
    description: "You're spending $180/month on subscriptions. Canceling unused services could save $540 annually.",
    impact: "+$540",
    timeframe: "Annual",
    priority: "medium",
    timestamp: "2 days ago",
    actions: [
      "Review all subscriptions",
      "Cancel unused services",
      "Redirect savings to goals"
    ]
  },
  {
    id: 5,
    type: "forecast",
    title: "Investment Rebalancing Suggestion",
    description: "Your portfolio is overweight in tech stocks. Rebalancing could reduce risk while maintaining growth potential.",
    impact: "Risk reduction",
    timeframe: "Next quarter",
    priority: "medium",
    timestamp: "3 days ago",
    actions: [
      "Review portfolio allocation",
      "Rebalance investments",
      "Set up auto-rebalancing"
    ]
  }
];

const Insights = () => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity": return TrendingUp;
      case "risk": return AlertTriangle;
      case "achievement": return CheckCircle2;
      case "optimization": return Zap;
      case "forecast": return Target;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === "urgent") return "border-destructive bg-destructive/5";
    if (type === "achievement") return "border-accent-success bg-accent-success/5";
    if (type === "opportunity") return "border-primary bg-primary/5";
    return "border-border";
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return <Badge variant="destructive">Urgent</Badge>;
      case "high": return <Badge className="bg-accent text-accent-foreground">High</Badge>;
      case "medium": return <Badge variant="outline">Medium</Badge>;
      default: return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Financial Insights
              </h1>
              <p className="text-muted-foreground">
                AI-powered insights and recommendations for your financial journey
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Last 7 days
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Insights Feed */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Insights List */}
              <div className="space-y-4">
                {insights.map((insight) => {
                  const Icon = getInsightIcon(insight.type);
                  
                  return (
                    <Card key={insight.id} className={`p-6 hover:shadow-card transition-all cursor-pointer ${
                      getInsightColor(insight.type, insight.priority)
                    }`}>
                      <div className="space-y-4">
                        
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              insight.priority === "urgent" ? "bg-destructive" :
                              insight.type === "achievement" ? "bg-accent-success" :
                              insight.type === "opportunity" ? "bg-primary" : "bg-muted"
                            }`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{insight.title}</h3>
                                {getPriorityBadge(insight.priority)}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {insight.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <div className={`font-semibold ${
                              insight.impact.startsWith('+') ? 'text-accent-success' : 
                              insight.impact.startsWith('-') ? 'text-destructive' : 'text-foreground'
                            }`}>
                              {insight.impact}
                            </div>
                            <div className="text-xs text-muted-foreground">{insight.timeframe}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {insight.actions.map((action, index) => (
                            <Button 
                              key={index}
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                            >
                              {action}
                            </Button>
                          ))}
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {insight.timestamp}
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Details
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Load More */}
              <div className="text-center">
                <Button variant="outline">
                  Load More Insights
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Insights Summary */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Insights Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="text-sm">Urgent</span>
                    </div>
                    <Badge variant="destructive">1</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm">Opportunities</span>
                    </div>
                    <Badge className="bg-primary">2</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent-success" />
                      <span className="text-sm">Achievements</span>
                    </div>
                    <Badge className="bg-accent-success">1</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-sm">Optimizations</span>
                    </div>
                    <Badge className="bg-accent">3</Badge>
                  </div>
                </div>
              </Card>

              {/* Potential Impact */}
              <Card className="p-6 bg-gradient-success">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-accent-success" />
                    <h3 className="font-semibold text-accent-foreground">Potential Impact</h3>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-foreground">+$18,640</div>
                    <div className="text-sm text-accent-foreground/80">Annual improvement if you act on all insights</div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-accent-success/30 text-accent-foreground hover:bg-accent-success/10"
                  >
                    Apply All Suggestions
                  </Button>
                </div>
              </Card>

              {/* Insight Categories */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Categories</h3>
                
                <div className="space-y-2">
                  <button className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Saving Opportunities</span>
                      <Badge variant="outline">3</Badge>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Investment Advice</span>
                      <Badge variant="outline">2</Badge>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Goal Progress</span>
                      <Badge variant="outline">4</Badge>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Risk Alerts</span>
                      <Badge variant="outline">1</Badge>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tax Optimization</span>
                      <Badge variant="outline">2</Badge>
                    </div>
                  </button>
                </div>
              </Card>

              {/* Notification Settings */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Notification Settings</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Urgent alerts</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily insights</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly summary</span>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Achievement celebrations</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
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

export default Insights;