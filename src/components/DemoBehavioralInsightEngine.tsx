import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  Pizza,
  Coffee,
  ShoppingCart,
  Smartphone,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Compelling demo patterns that showcase FlowSightFi's capabilities
const DEMO_PATTERNS = [
  {
    id: 'back_half_saver',
    type: 'positive',
    icon: TrendingUp,
    category: 'Savings',
    impact: 387,
    confidence: 96,
    description: '💰 You save 3.2× more during the final 5 days of your pay cycle.',
    actionSuggestion: "Auto-schedule transfers during high-surplus window?",
    formula: 'end_month_multiplier = 3.2 (detected pattern)',
    timePattern: 'Days 26-30 of month',
    streakData: 8
  },
  {
    id: 'weekend_rebounder',
    type: 'volatile',
    icon: Pizza,
    category: 'Dining',
    impact: -340,
    confidence: 94,
    description: '🍕 Weekend dining spikes cost 68% of your weekday savings.',
    actionSuggestion: 'Set weekend spending limits or meal prep Fridays.',
    formula: 'weekend_ratio = Σ(weekend_spend) / Σ(weekday_spend) = 2.1',
    timePattern: 'Friday 7pm - Sunday 11pm'
  },
  {
    id: 'midweek_impulse',
    type: 'volatile',
    icon: ShoppingCart,
    category: 'Shopping',
    impact: -156,
    confidence: 89,
    description: '🛒 42% of impulse purchases happen Wednesday 8-11pm.',
    actionSuggestion: 'Consider app blocks during vulnerable hours.',
    formula: 'impulse_cluster = Wed 20:00-23:00 (42% of monthly impulse)',
    timePattern: 'Wed 8pm - 11pm'
  },
  {
    id: 'subscription_optimizer',
    type: 'volatile',
    icon: Smartphone,
    category: 'Subscriptions',
    impact: -89,
    confidence: 91,
    description: '📱 3 unused subscriptions detected via spending entropy analysis.',
    actionSuggestion: 'Cancel unused services: Netflix, Adobe, Spotify Premium.',
    formula: 'subscription_entropy = 0.67 (3 dormant services detected)'
  },
  {
    id: 'coffee_champion',
    type: 'positive',
    icon: Coffee,
    category: 'Beverages',
    impact: 127,
    confidence: 93,
    description: '☕ Home brewing habit saves $127/month vs. previous café pattern.',
    actionSuggestion: 'Track this win to maintain the habit.',
    formula: 'behavior_shift_impact = $4.20/day × 30 days = $126',
    timePattern: 'Morning routine optimization',
    streakData: 6
  },
  {
    id: 'goal_accelerator',
    type: 'milestone',
    icon: Target,
    category: 'Goals',
    impact: 245,
    confidence: 97,
    description: '🎯 Current pace puts you 11 months ahead of your emergency fund goal.',
    actionSuggestion: 'Consider increasing target or setting stretch goal.',
    formula: 'goal_velocity = current_rate / target_rate = 1.83x',
    streakData: 12
  }
];

const iconMap = {
  positive: CheckCircle,
  volatile: AlertCircle,
  milestone: Target
};

export const DemoBehavioralInsightEngine = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', 'Savings', 'Dining', 'Shopping', 'Subscriptions', 'Beverages', 'Goals'];
  
  const filteredPatterns = selectedCategory === 'all' 
    ? DEMO_PATTERNS 
    : DEMO_PATTERNS.filter(pattern => pattern.category === selectedCategory);

  const getTrendIcon = (pattern: typeof DEMO_PATTERNS[0]) => {
    return iconMap[pattern.type as keyof typeof iconMap] || AlertCircle;
  };

  const getTypeColor = (pattern: typeof DEMO_PATTERNS[0]) => {
    switch (pattern.type) {
      case 'positive': return 'text-accent-success';
      case 'volatile': return 'text-destructive';
      case 'milestone': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getPatternTypeColor = (pattern: typeof DEMO_PATTERNS[0]) => {
    switch (pattern.type) {
      case 'positive': return "bg-accent-success/10";
      case 'volatile': return "bg-destructive/10";
      case 'milestone': return "bg-primary/10";
      default: return "bg-muted/10";
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-accent-success';
    if (impact < -100) return 'text-destructive';
    return 'text-amber-500';
  };

  // Calculate impressive summary stats
  const positiveImpact = DEMO_PATTERNS.filter(p => p.impact > 0).reduce((sum, p) => sum + p.impact, 0);
  const negativeImpact = Math.abs(DEMO_PATTERNS.filter(p => p.impact < 0).reduce((sum, p) => sum + p.impact, 0));
  const avgConfidence = Math.round(DEMO_PATTERNS.reduce((sum, p) => sum + p.confidence, 0) / DEMO_PATTERNS.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Behavioral Intelligence
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Demo Analysis
            </Badge>
          </h2>
          <p className="text-muted-foreground">
            AI detected {DEMO_PATTERNS.length} behavioral patterns with {avgConfidence}% average confidence
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex bg-muted/50 rounded-lg p-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-all capitalize",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Impressive Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-accent-success">
                +${positiveImpact}
              </p>
              <p className="text-xs text-muted-foreground">Monthly Optimization</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent-success" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-destructive">
                ${negativeImpact}
              </p>
              <p className="text-xs text-muted-foreground">Behavior Leakage</p>
            </div>
            <TrendingDown className="w-8 h-8 text-destructive" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {avgConfidence}%
              </p>
              <p className="text-xs text-muted-foreground">AI Confidence</p>
            </div>
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Demo Pattern Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPatterns.map((pattern) => {
          const TrendIcon = getTrendIcon(pattern);
          const PatternIcon = pattern.icon;
          
          return (
            <Card key={pattern.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", getPatternTypeColor(pattern))}>
                      <PatternIcon className={cn("w-5 h-5", getTypeColor(pattern))} />
                    </div>
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {pattern.id.replace(/_/g, ' ')}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {pattern.category}
                        </Badge>
                        <Badge 
                          variant={pattern.impact > 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          <TrendIcon className="w-3 h-3 mr-1" />
                          {pattern.confidence}% confident
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={cn("text-xl font-bold", getImpactColor(pattern.impact))}>
                      {pattern.impact > 0 ? '+' : ''}${pattern.impact}
                    </p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">{pattern.description}</p>
                  {pattern.timePattern && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{pattern.timePattern}</span>
                    </div>
                  )}
                  {pattern.streakData && (
                    <div className="flex items-center gap-2 text-xs">
                      <Target className="w-3 h-3 text-primary" />
                      <span>{pattern.streakData} week streak</span>
                      <Progress value={(pattern.streakData / 12) * 100} className="h-1 flex-1" />
                    </div>
                  )}
                </div>
                
                <div className="p-2 bg-muted/50 rounded text-xs font-mono">
                  {pattern.formula}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm font-medium text-primary">
                    {pattern.actionSuggestion}
                  </p>
                  <Button size="sm" variant="outline" className="h-7">
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Act
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Compelling Action Center */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent-teal/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-sm">Ready to unlock your financial potential?</p>
              <p className="text-xs text-muted-foreground">
                Implementing these AI insights could optimize your cash flow by ${positiveImpact + negativeImpact}/month.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                See Full Analysis
              </Button>
              <Button className="bg-gradient-primary hover:shadow-glow">
                <DollarSign className="w-4 h-4 mr-2" />
                Start Optimizing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};