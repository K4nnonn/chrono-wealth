import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  AlertTriangle, 
  Target, 
  MessageSquare, 
  Zap,
  Calendar,
  BarChart3,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Forecast Engine",
    description: "Project future balances, net worth, and savings paths using advanced AI simulations based on your spending patterns.",
    gradient: "bg-gradient-primary"
  },
  {
    icon: AlertTriangle,
    title: "Crisis Simulator", 
    description: "Model 'what if' scenarios like job loss, market crashes, or unexpected expenses to prepare for anything.",
    gradient: "bg-gradient-hero"
  },
  {
    icon: Target,
    title: "Smart Goal Tracker",
    description: "Visualize and track your financial goals with AI-powered insights on the fastest path to achievement.",
    gradient: "bg-gradient-success"
  },
  {
    icon: Zap,
    title: "Smart Nudges",
    description: "Get behavioral insights like 'You'll run out of funds in 12 days' or 'Your income is trending down'.",
    gradient: "bg-gradient-forecast"
  },
  {
    icon: BarChart3,
    title: "Banking & Crypto Aggregator",
    description: "Connect and sync real-time data from all your accounts including crypto wallets and investments.",
    gradient: "bg-gradient-card"
  },
  {
    icon: MessageSquare,
    title: "AI Financial Copilot",
    description: "ChatGPT-like assistant for personal finance questions and scenario planning.",
    gradient: "bg-gradient-primary"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Financial Clarity That Flows
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Navigate your financial streams with confidence. FlowSightFi reveals where your money flows and how to guide it toward your goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-card transition-all duration-300 group cursor-pointer">
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Section */}
        <Card className="p-8 lg:p-12 bg-gradient-card">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-foreground">
              Beyond Traditional Finance Apps
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-muted-foreground font-medium">Traditional Apps</div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div>Track what you spent</div>
                  <div>Show past transactions</div>
                  <div>Basic budgeting</div>
                  <div>Reactive alerts</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="w-px h-20 bg-border hidden md:block"></div>
                <div className="text-2xl font-bold text-primary mx-4">VS</div>
                <div className="w-px h-20 bg-border hidden md:block"></div>
              </div>
              
              <div className="space-y-3">
                <div className="font-medium text-primary">FlowSightFi</div>
                <div className="text-sm space-y-2">
                  <div className="text-accent-success">Predict financial flows</div>
                  <div className="text-accent-success">Navigate future scenarios</div>
                  <div className="text-accent-success">AI-powered navigation</div>
                  <div className="text-accent-success">Calm, clear insights</div>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-gradient-primary hover:shadow-glow group">
              <Calendar className="w-4 h-4 mr-2" />
              See Your Financial Future
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Features;
