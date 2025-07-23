import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with financial forecasting",
    features: [
      "Connect up to 2 bank accounts",
      "Basic dashboard insights",
      "30-day forecast view",
      "Transaction categorization",
      "Mobile app access"
    ],
    cta: "Get Started Free",
    variant: "outline" as const,
    icon: Zap,
    gradient: "bg-gradient-card"
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "Advanced AI forecasting for serious financial planning",
    features: [
      "Everything in Free",
      "Unlimited account connections",
      "AI-powered forecasts",
      "Goal tracking & planning",
      "Smart nudges & alerts",
      "Crypto portfolio tracking",
      "Crisis scenario modeling",
      "Priority support"
    ],
    cta: "Start Pro Trial",
    variant: "default" as const,
    popular: true,
    icon: Sparkles,
    gradient: "bg-gradient-primary"
  },
  {
    name: "Max",
    price: "$19.99",
    period: "per month", 
    description: "Complete financial OS with AI copilot and advanced features",
    features: [
      "Everything in Pro",
      "AI Financial Copilot",
      "Advanced crisis simulator",
      "Scenario logging & tracking",
      "Custom forecast models",
      "Investment optimization",
      "Tax planning insights",
      "White-label access",
      "Dedicated account manager"
    ],
    cta: "Unlock Maximum",
    variant: "secondary" as const,
    icon: Crown,
    gradient: "bg-gradient-hero"
  }
];

const Pricing = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Choose Your Financial Future
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and upgrade as your financial planning needs grow. Every plan includes bank-level security and real-time data.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative p-8 hover:shadow-card transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white">
                  Most Popular
                </Badge>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${plan.gradient} flex items-center justify-center`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent-success" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button 
                  variant={plan.variant} 
                  size="lg" 
                  className={`w-full ${
                    plan.popular ? 'bg-gradient-primary hover:shadow-glow' : ''
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Enterprise Section */}
        <Card className="mt-16 p-8 lg:p-12 bg-gradient-card text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-foreground">
                Enterprise & White Label
              </h3>
              <p className="text-xl text-muted-foreground">
                Custom solutions for banks, fintechs, HR platforms, and financial advisors
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="font-medium text-foreground">White Label API</div>
                <div className="text-muted-foreground">Embed FlowSightFi's forecasting in your app</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">Custom Branding</div>
                <div className="text-muted-foreground">Full customization for your brand</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">Dedicated Support</div>
                <div className="text-muted-foreground">Priority integration assistance</div>
              </div>
            </div>

            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Contact Sales Team
            </Button>
          </div>
        </Card>

        {/* Trust Section */}
        <div className="mt-16 text-center space-y-6">
          <div className="text-sm text-muted-foreground">
            Trusted by thousands of users to forecast their financial future
          </div>
          
          <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-success rounded-full"></div>
              SOC2 Compliant
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-success rounded-full"></div>
              Bank-Level Encryption
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-success rounded-full"></div>
              GDPR Ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;