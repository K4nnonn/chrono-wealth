import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIFinancialChat } from "@/components/AIFinancialChat";
import { 
  Brain,
  TrendingUp,
  Target,
  AlertTriangle,
  Lightbulb,
  Clock,
  Mic
} from "lucide-react";

// Sample chat history data structure (commented out for now)
/*
const _chatHistory = [
  {
    id: 1,
    type: "user" as const,
    message: "What happens if I retire at 58 instead of 65?",
    timestamp: "2:34 PM"
  },
  {
    id: 2,
    type: "ai" as const,
    message: "Great question! Retiring 7 years earlier would require some adjustments. Based on your current savings rate and goals, here's what I found:",
    timestamp: "2:34 PM",
    suggestions: [
      "You'd need to increase savings by $850/month",
      "Consider maxing out your 401k contributions",
      "Your emergency fund should be larger (12 months vs 6)"
    ]
  },
  {
    id: 3,
    type: "user" as const,
    message: "How can I afford a $300k house by 2028?",
    timestamp: "2:28 PM"
  },
  {
    id: 4,
    type: "ai" as const,
    message: "For a $300k house by 2028, you'll need about $60k down payment. Here's a path that works with your timeline:",
    timestamp: "2:29 PM",
    insights: [
      { icon: Target, text: "Save $1,200/month for down payment", color: "text-primary" },
      { icon: TrendingUp, text: "Your current trajectory gets you to $52k", color: "text-accent-success" },
      { icon: AlertTriangle, text: "Consider reducing vacation budget by $200/month", color: "text-accent" }
    ]
  }
];
*/

const quickPrompts = [
  "What happens if I lose my job for 3 months?",
  "How much should I save for retirement?",
  "When can I afford a new car?",
  "What if the market crashes next year?",
  "How do I pay off debt faster?",
  "Should I invest or save for a house?"
];

const Planner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AI Financial Planner
            </h1>
            <p className="text-muted-foreground">
              Chat with your AI assistant to explore scenarios and get personalized insights
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Chat Interface - Now using functional AIFinancialChat */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">FlowSight AI Financial Planner</h2>
                  <Badge className="bg-accent-success/20 text-accent-success">Live</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  Chat with your AI assistant to explore financial scenarios and get personalized insights.
                </p>
              </div>
              
              <AIFinancialChat className="h-[600px]" />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Prompts */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Questions</h3>
                <div className="space-y-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-2 rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </Card>

              {/* AI Capabilities */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">What I Can Help With</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Scenario Planning</div>
                      <div className="text-muted-foreground text-xs">Explore "what if" situations</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Target className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Goal Optimization</div>
                      <div className="text-muted-foreground text-xs">Find faster paths to your goals</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Risk Assessment</div>
                      <div className="text-muted-foreground text-xs">Identify potential problems early</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Smart Suggestions</div>
                      <div className="text-muted-foreground text-xs">Personalized recommendations</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Insights */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Insights</h3>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-success">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-accent-success" />
                      <span className="text-xs font-medium text-accent-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm text-accent-foreground/80">
                      Increasing your 401k by 2% would save you $12k in taxes
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-medium">Yesterday</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your vacation fund is ahead of schedule by 3 months
                    </p>
                  </div>
                </div>
              </Card>

              {/* Voice Settings */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Voice Assistant</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mic className="w-4 h-4 mr-2" />
                    Hold to Speak
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    Tip: You can speak naturally like "Show me what happens if I save more"
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

export default Planner;