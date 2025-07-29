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
    title: "AI Budget Optimizer",
    description: "Analyze spending patterns and automatically create personalized budgets that adapt to your lifestyle and goals.",
    gradient: "bg-gradient-primary"
  },
  {
    icon: AlertTriangle,
    title: "Crisis Simulator", 
    description: "Model scenarios like job loss, unexpected expenses, or income changes to prepare emergency plans.",
    gradient: "bg-gradient-hero"
  },
  {
    icon: Target,
    title: "Smart Goal Tracker",
    description: "Visualize and track savings goals with AI-powered insights on the fastest path to achievement.",
    gradient: "bg-gradient-success"
  },
  {
    icon: Zap,
    title: "Smart Nudges",
    description: "Get behavioral insights like 'You'll exceed your budget in 12 days' or 'Your spending is trending up'.",
    gradient: "bg-gradient-forecast"
  },
  {
    icon: BarChart3,
    title: "Banking Aggregator",
    description: "Connect and sync real-time data from all your bank accounts for comprehensive expense tracking.",
    gradient: "bg-gradient-card"
  },
  {
    icon: MessageSquare,
    title: "AI Financial Copilot",
    description: "ChatGPT-like assistant for budgeting questions, savings strategies, and financial planning.",
    gradient: "bg-gradient-primary"
  }
];

const Features = () => {
  return (
    <section className="py-32 bg-gradient-card relative overflow-hidden">
      {/* Enterprise background effects */}
      <div className="absolute inset-0 bg-financial-pattern opacity-50"></div>
      <div className="absolute inset-0 bg-grid-enterprise opacity-20"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="text-center space-y-8 mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Enterprise Financial Intelligence Platform
          </div>
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
            Beyond Traditional
            <span className="block text-primary">Financial Management</span>
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Enterprise-grade AI that doesn't just track your money—it analyzes, optimizes, and transforms 
            your financial future through smart budgeting and expense management.
          </p>
        </div>

        {/* Enterprise Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="card-enterprise p-8 hover-enterprise group cursor-pointer animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="space-y-6">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-glow`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-success rounded-full animate-pulse"></div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  <div className="pt-2">
                    <span className="text-primary text-sm font-semibold group-hover:text-secondary-accent transition-colors">
                      Learn more →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Comparison Section */}
        <div className="card-premium p-12 lg:p-16 animate-scale-in">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h3 className="text-4xl lg:text-5xl font-bold text-foreground">
                Enterprise-Grade vs 
                <span className="block text-primary">Consumer Apps</span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See why financial professionals choose institutional-level intelligence over basic tracking
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 text-center max-w-6xl mx-auto">
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <div className="text-muted-foreground font-semibold text-lg mb-4">Traditional Apps</div>
                  <div className="text-sm text-muted-foreground space-y-3">
                    <div className="flex items-center gap-2"><span className="text-red-400">×</span> Track what you spent</div>
                    <div className="flex items-center gap-2"><span className="text-red-400">×</span> Show past transactions</div>
                    <div className="flex items-center gap-2"><span className="text-red-400">×</span> Basic budgeting</div>
                    <div className="flex items-center gap-2"><span className="text-red-400">×</span> Reactive alerts</div>
                    <div className="flex items-center gap-2"><span className="text-red-400">×</span> Manual data entry</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-px h-32 bg-border hidden md:block"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-primary text-white px-4 py-2 rounded-full text-xl font-bold shadow-glow">
                    VS
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gradient-card rounded-xl border border-primary/20">
                  <div className="font-semibold text-primary text-lg mb-4">FlowSightFi Enterprise</div>
                  <div className="text-sm space-y-3">
                    <div className="flex items-center gap-2"><span className="text-accent-success">✓</span> Predict spending patterns with AI</div>
                    <div className="flex items-center gap-2"><span className="text-accent-success">✓</span> Navigate financial scenarios</div>
                    <div className="flex items-center gap-2"><span className="text-accent-success">✓</span> Enterprise-grade budget optimization</div>
                    <div className="flex items-center gap-2"><span className="text-accent-success">✓</span> Proactive savings strategies</div>
                    <div className="flex items-center gap-2"><span className="text-accent-success">✓</span> Real-time expense tracking</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Button size="lg" className="h-16 px-12 text-xl bg-gradient-primary hover:shadow-glow hover-enterprise group">
                <Calendar className="w-6 h-6 mr-3" />
                Experience Enterprise Intelligence
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Join 100,000+ financial professionals • SOC 2 Compliant • Enterprise Security
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
