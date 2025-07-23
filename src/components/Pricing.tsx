import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, TrendingUp, Shield, Brain, Target, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { user } = useAuth();
  const { subscribed, subscription_tier, createCheckout, loading } = useSubscription();
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
          <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get access to all premium features with our comprehensive Starter plan. 
            No hidden fees, no complex tiers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-primary text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">Starter Plan</CardTitle>
              <CardDescription className="text-lg">
                Everything you need for comprehensive financial planning
              </CardDescription>
              <div className="mt-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-bold">$5.99</span>
                  <div className="text-left">
                    <div className="text-muted-foreground">/month</div>
                    <div className="text-sm text-muted-foreground">billed monthly</div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
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
              </div>

              <div className="pt-6">
                {subscribed && subscription_tier === 'Starter' ? (
                  <div className="text-center space-y-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      ✓ Currently Active
                    </Badge>
                    <Button 
                      onClick={() => navigate('/dashboard')} 
                      className="w-full" 
                      size="lg"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleGetStarted}
                    disabled={loading}
                    className="w-full bg-gradient-primary hover:shadow-glow"
                    size="lg"
                  >
                    {loading ? (
                      <>Loading...</>
                    ) : user ? (
                      subscribed ? 'Go to Dashboard' : 'Start Free Trial'
                    ) : (
                      'Get Started Now'
                    )}
                  </Button>
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>✓ Cancel anytime</p>
                <p>✓ 30-day money-back guarantee</p>
                <p>✓ Secure payments by Stripe</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Why Choose Chrono-Wealth?</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold">AI-Powered Intelligence</h4>
              <p className="text-muted-foreground">
                Our advanced AI analyzes your finances and provides personalized recommendations
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold">Bank-Level Security</h4>
              <p className="text-muted-foreground">
                Your data is protected with enterprise-grade encryption and security
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold">Proven Results</h4>
              <p className="text-muted-foreground">
                Users improve their financial health by an average of 40% in 6 months
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;