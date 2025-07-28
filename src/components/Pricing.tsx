import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, TrendingUp, Shield, Brain, Target, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { user } = useAuth();
  const { subscribed, createCheckout, loading } = useSubscription();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/auth?mode=signup');
      return;
    }
    
    if (subscribed) {
      navigate('/dashboard');
      return;
    }
    
    createCheckout();
  };

  const features = [
    {
      icon: Brain,
      title: "AI Financial Advisor",
      description: "Get personalized insights powered by advanced AI"
    },
    {
      icon: TrendingUp,
      title: "Real-time Forecasting",
      description: "See your financial future with precise projections"
    },
    {
      icon: Shield,
      title: "Crisis Simulations",
      description: "Test your resilience against economic scenarios"
    },
    {
      icon: Target,
      title: "Smart Goal Tracking",
      description: "Set and achieve financial milestones"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your spending and saving patterns"
    },
    {
      icon: Zap,
      title: "Bank Integrations",
      description: "Securely connect all your financial accounts"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-primary">
            Choose Your Financial Future
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who've transformed their financial lives. 
            Professional-grade tools for serious financial planning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan - Deliberately Less Appealing */}
          <Card className="border border-muted/50 relative overflow-hidden opacity-90">
            <div className="absolute inset-0 bg-muted/10" />
            
            <CardHeader className="text-center relative">
              <div className="w-12 h-12 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl font-semibold text-muted-foreground">Basic</CardTitle>
              <CardDescription className="text-sm">
                Limited features for simple tracking
              </CardDescription>
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-muted-foreground">$3.99</span>
                  <div className="text-left">
                    <div className="text-muted-foreground text-sm">/month</div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 relative">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Basic budgeting tools</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Limited bank connections (2 accounts)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Basic expense tracking</span>
                </div>
                <div className="flex items-center gap-3 text-sm opacity-50">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  <span className="text-muted-foreground line-through">AI Financial Advisor</span>
                </div>
                <div className="flex items-center gap-3 text-sm opacity-50">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  <span className="text-muted-foreground line-through">Advanced Forecasting</span>
                </div>
                <div className="flex items-center gap-3 text-sm opacity-50">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  <span className="text-muted-foreground line-through">Crisis Simulations</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full text-muted-foreground border-muted" 
                  size="lg"
                >
                  Start Basic
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Limited functionality • No AI insights
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Plan - The Target Choice */}
          <Card className="border-2 border-primary/50 shadow-2xl hover:shadow-glow transition-all duration-300 relative overflow-hidden scale-105 z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-success/5" />
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-accent-success text-white border-0 px-6 py-2">
                <Crown className="w-4 h-4 mr-2" />
                MOST POPULAR • 89% CHOOSE THIS
              </Badge>
            </div>
            
            <CardHeader className="text-center relative pt-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent-success rounded-full flex items-center justify-center shadow-glow">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">Professional</CardTitle>
              <CardDescription className="text-lg">
                Complete financial intelligence platform
              </CardDescription>
              <div className="mt-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">$19.99</span>
                  <span className="text-5xl font-bold text-primary">$9.99</span>
                  <div className="text-left">
                    <div className="text-muted-foreground">/month</div>
                    <div className="text-sm text-accent-success font-medium">50% OFF Launch Price</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Only $0.33/day • Less than a coffee
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-accent-success flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <feature.icon className="w-4 h-4 text-primary" />
                        <span className="font-medium">{feature.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-accent-success flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4 text-primary" />
                      <span className="font-medium">Unlimited Everything</span>
                    </div>
                    <p className="text-sm text-muted-foreground">No limits on accounts, goals, or AI consultations</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={handleGetStarted}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-accent-success hover:shadow-glow text-white font-semibold"
                  size="lg"
                >
                  {loading ? (
                    <>Processing...</>
                  ) : user ? (
                    subscribed ? 'Upgrade Now' : 'Start 7-Day Free Trial'
                  ) : (
                    'Start Free Trial • No Credit Card'
                  )}
                </Button>
                <p className="text-sm text-center text-muted-foreground mt-3">
                  <span className="text-accent-success font-medium">Limited time:</span> 50% off for first 1000 users
                </p>
              </div>

              <div className="text-center text-sm text-muted-foreground space-y-1">
                <p>✓ 7-day free trial</p>
                <p>✓ Cancel anytime</p>
                <p>✓ 30-day money-back guarantee</p>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Plan - Anchoring Effect */}
          <Card className="border border-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-background" />
            
            <CardHeader className="text-center relative">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-accent-coral to-accent-warning rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">Enterprise</CardTitle>
              <CardDescription className="text-sm">
                For financial advisors & teams
              </CardDescription>
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold">$49.99</span>
                  <div className="text-left">
                    <div className="text-muted-foreground text-sm">/month</div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 relative">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Everything in Professional</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>White-label solution</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Client management dashboard</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>API access & integrations</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Priority support & training</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                >
                  Contact Sales
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Custom pricing • Volume discounts available
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Proof Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent-success/10 rounded-2xl p-8 max-w-4xl mx-auto border border-primary/20">
            <h3 className="text-2xl font-bold mb-6">Why 89% Choose Professional</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold">AI Saves 8+ Hours/Month</h4>
                <p className="text-muted-foreground text-sm">
                  Our AI handles complex analysis so you don't have to spend weekends on spreadsheets
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold">Average $2,847 Saved</h4>
                <p className="text-muted-foreground text-sm">
                  Users save 300x the subscription cost through optimized spending and goal achievement
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold">Enterprise Security</h4>
                <p className="text-muted-foreground text-sm">
                  Bank-level encryption trusted by 50,000+ users, including financial professionals
                </p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-accent-success/10 border border-accent-success/20 rounded-lg">
              <p className="text-sm text-accent-success font-medium">
                ⚡ Limited Time: First 1,000 users get 50% off Professional for life
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
