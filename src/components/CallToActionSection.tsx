import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Lightbulb,
  ArrowRight,
  Clock,
  CheckCircle,
  Zap,
  Shield,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CTASection {
  type: 'primary' | 'secondary' | 'demo';
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  icon: React.ElementType;
  features?: string[];
  badge?: string;
}

export const CallToActionSection: React.FC = () => {
  const { toast } = useToast();

  const ctaSections: CTASection[] = [
    {
      type: 'primary',
      title: 'Start Your Financial Journey',
      description: 'Get personalized AI insights and start building your financial future today.',
      buttonText: 'Join Private Beta',
      onClick: () => {
        toast({
          title: "Beta Access Request",
          description: "Opening email client...",
        });
        window.location.href = 'mailto:hello@flowsightfi.com?subject=Private Beta Access Request';
      },
      icon: Zap,
      features: ['AI-powered financial health scoring', 'Real-time bank connectivity', 'Crisis simulation tools'],
      badge: 'Limited Access'
    },
    {
      type: 'demo',
      title: 'See FlowSightFi in Action',
      description: 'Book a personalized 20-minute demo to see how our AI can transform your financial planning.',
      buttonText: 'Book Demo',
      onClick: () => {
        toast({
          title: "Opening Demo Scheduler",
          description: "Taking you to our calendar...",
        });
        window.open('https://calendly.com/flowsightfi-demo', '_blank');
      },
      icon: Brain,
      features: ['Live dashboard walkthrough', 'Custom scenario planning', 'Implementation roadmap'],
    },
    {
      type: 'secondary',
      title: 'For Financial Advisors',
      description: 'Powerful tools to enhance client relationships and provide data-driven recommendations.',
      buttonText: 'Download API Guide',
      onClick: () => {
        toast({
          title: "Download Starting",
          description: "API guide will be downloaded shortly...",
        });
        // Create a download link for a PDF (placeholder)
        const link = document.createElement('a');
        link.href = '/api/financial-advisor-guide.pdf';
        link.download = 'flowsightfi-api-guide.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      icon: Users,
      features: ['White-label solutions', 'Client portfolio management', 'Compliance-ready reporting'],
      badge: 'Professional'
    }
  ];
  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Target className="w-3 h-3 mr-1" />
            Ready to Transform Your Finances?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Path Forward
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're an individual looking to improve your financial health or a professional 
            seeking advanced tools, we have the right solution for you.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {ctaSections.map((cta, index) => (
            <Card 
              key={index} 
              className={cn(
                'relative overflow-hidden border transition-all duration-300 hover:shadow-elegant hover-lift cursor-pointer group',
                cta.type === 'primary' && 'border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10',
                cta.type === 'demo' && 'border-accent-teal/30 bg-gradient-to-br from-accent-teal/5 to-accent-teal/10',
                cta.type === 'secondary' && 'border-accent-coral/30 bg-gradient-to-br from-accent-coral/5 to-accent-coral/10'
              )}
              onClick={cta.onClick}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px_16px]" />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    'p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300',
                    cta.type === 'primary' && 'bg-gradient-primary',
                    cta.type === 'demo' && 'bg-gradient-to-br from-accent-teal to-accent-teal/80',
                    cta.type === 'secondary' && 'bg-gradient-to-br from-accent-coral to-accent-coral/80'
                  )}>
                    <cta.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {cta.badge && (
                    <Badge variant="outline" className="text-xs">
                      {cta.badge}
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl mb-2">{cta.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {cta.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-4">
                {cta.features && (
                  <ul className="space-y-2">
                    {cta.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Button 
                  className={cn(
                    'w-full group-hover:scale-105 transition-transform duration-300',
                    cta.type === 'primary' && 'bg-gradient-primary hover:shadow-glow',
                    cta.type === 'demo' && 'bg-accent-teal hover:bg-accent-teal/90',
                    cta.type === 'secondary' && 'bg-accent-coral hover:bg-accent-coral/90'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    cta.onClick();
                  }}
                >
                  {cta.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="border rounded-xl p-6 bg-gradient-card">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <Shield className="w-8 h-8 text-primary mx-auto" />
              <h4 className="font-semibold">Bank-Level Security</h4>
              <p className="text-sm text-muted-foreground">256-bit encryption & SOC 2 compliance</p>
            </div>
            
            <div className="space-y-2">
              <CheckCircle className="w-8 h-8 text-success mx-auto" />
              <h4 className="font-semibold">GDPR Compliant</h4>
              <p className="text-sm text-muted-foreground">Your data privacy is our priority</p>
            </div>
            
            <div className="space-y-2">
              <TrendingUp className="w-8 h-8 text-accent-teal mx-auto" />
              <h4 className="font-semibold">Proven Results</h4>
              <p className="text-sm text-muted-foreground">94% user improvement in financial health</p>
            </div>
            
            <div className="space-y-2">
              <Clock className="w-8 h-8 text-accent-coral mx-auto" />
              <h4 className="font-semibold">24/7 Support</h4>
              <p className="text-sm text-muted-foreground">Always here when you need us</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 p-4 bg-gradient-primary rounded-xl shadow-glow">
            <Lightbulb className="w-5 h-5 text-white" />
            <div className="text-white">
              <p className="font-semibold">Ready to get started?</p>
              <p className="text-sm opacity-90">Join thousands improving their financial future</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Getting Started",
                  description: "Opening email client...",
                });
                window.location.href = 'mailto:hello@flowsightfi.com?subject=Getting Started';
              }}
              className="hover:scale-105 transition-transform"
            >
              Get Started
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};