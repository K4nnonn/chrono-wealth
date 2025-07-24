import React, { useState, useMemo } from 'react';
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
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFinancialForecasting } from '@/hooks/useFinancialForecasting';

interface BehavioralPattern {
  id: string;
  title: string;
  type: 'positive' | 'volatile' | 'milestone';
  icon: React.ComponentType<any>;
  category: string;
  impact: number;
  confidence: number;
  description: string;
  actionSuggestion: string;
  formula?: string;
  streak?: number;
  timePattern?: string;
}

interface InsightCard {
  pattern: BehavioralPattern;
  metric: {
    current: number;
    target?: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
  };
}

export const BehavioralInsightEngine = () => {
  const { currentMetrics } = useFinancialForecasting();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Simulate behavioral pattern detection using entropy and clustering
  const detectedPatterns: BehavioralPattern[] = useMemo(() => [
    {
      id: 'back-half-saver',
      title: 'Back-Half Saver',
      type: 'positive',
      icon: TrendingUp,
      category: 'Savings',
      impact: 287,
      confidence: 94,
      description: '💰 You save 3× more during the final 5 days of your pay cycle.',
      actionSuggestion: "Let's auto-schedule transfers then?",
      streak: 6,
      timePattern: 'Days 26-30 of month'
    },
    {
      id: 'weekend-rebounder',
      title: 'Weekend Rebounder',
      type: 'volatile',
      icon: Pizza,
      category: 'Dining',
      impact: -227,
      confidence: 87,
      description: '🍕 43% of weekday gains are lost to weekend dining.',
      actionSuggestion: 'Want to add a weekend limit?',
      formula: 'entropy(weekend_spend) = 0.73 (high volatility)'
    },
    {
      id: 'midweek-impulse',
      title: 'Midweek Drift',
      type: 'volatile',
      icon: ShoppingCart,
      category: 'Shopping',
      impact: -89,
      confidence: 82,
      description: '🧃 You impulse spend most between Wed 9pm–Thu 11am.',
      actionSuggestion: 'Consider blocking certain apps or stores.',
      timePattern: 'Wed 9pm - Thu 11am'
    },
    {
      id: 'consistency-milestone',
      title: 'Consistency Champion',
      type: 'milestone',
      icon: Target,
      category: 'Savings',
      impact: 450,
      confidence: 96,
      description: "🏆 You've saved consistently for 6 weeks. Longest streak: 9.",
      actionSuggestion: 'Reward yourself with a small celebration!',
      streak: 6
    },
    {
      id: 'coffee-optimizer',
      title: 'Morning Ritual Optimizer',
      type: 'positive',
      icon: Coffee,
      category: 'Beverages',
      impact: 78,
      confidence: 91,
      description: '☕ Switching to home brewing saved $78 this month.',
      actionSuggestion: 'Track this win to maintain the habit.',
      streak: 4
    },
    {
      id: 'subscription-bloat',
      title: 'Silent Subscription Creep',
      type: 'volatile',
      icon: Smartphone,
      category: 'Subscriptions',
      impact: -134,
      confidence: 89,
      description: '📱 Subscription costs increased 32% without conscious decisions.',
      actionSuggestion: 'Review and cancel unused services.',
      formula: 'variance(monthly_subs) = +$43 vs baseline'
    }
  ], []);

  const generateInsightCards = (): InsightCard[] => {
    return detectedPatterns.map(pattern => ({
      pattern,
      metric: {
        current: Math.abs(pattern.impact),
        target: pattern.type === 'positive' ? pattern.impact * 1.2 : Math.abs(pattern.impact) * 0.5,
        unit: pattern.category === 'Savings' ? '$/month saved' : '$/month impact',
        trend: pattern.impact > 0 ? 'up' : pattern.impact < 0 ? 'down' : 'stable'
      }
    }));
  };

  const insightCards = generateInsightCards();
  const categories = ['all', ...new Set(detectedPatterns.map(p => p.category))];
  
  const filteredCards = selectedCategory === 'all' 
    ? insightCards 
    : insightCards.filter(card => card.pattern.category === selectedCategory);

  const getTrendIcon = (type: BehavioralPattern['type']) => {
    switch (type) {
      case 'positive': return CheckCircle;
      case 'volatile': return AlertCircle;
      case 'milestone': return Target;
      default: return Brain;
    }
  };

  const getTypeColor = (type: BehavioralPattern['type']) => {
    switch (type) {
      case 'positive': return 'text-accent-success';
      case 'volatile': return 'text-destructive';
      case 'milestone': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-accent-success';
    if (impact < -100) return 'text-destructive';
    return 'text-amber-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Behavioral Intelligence
          </h2>
          <p className="text-muted-foreground">
            AI-powered pattern recognition reveals your hidden financial habits
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

      {/* Insight Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-accent-success">
                +${detectedPatterns.filter(p => p.impact > 0).reduce((sum, p) => sum + p.impact, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Positive Patterns</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent-success" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-destructive">
                ${Math.abs(detectedPatterns.filter(p => p.impact < 0).reduce((sum, p) => sum + p.impact, 0))}
              </p>
              <p className="text-xs text-muted-foreground">Leakage Detected</p>
            </div>
            <TrendingDown className="w-8 h-8 text-destructive" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {Math.round(detectedPatterns.reduce((sum, p) => sum + p.confidence, 0) / detectedPatterns.length)}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
            </div>
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredCards.map(({ pattern, metric }) => {
          const TrendIcon = getTrendIcon(pattern.type);
          const PatternIcon = pattern.icon;
          
          return (
            <Card key={pattern.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      pattern.type === 'positive' ? "bg-accent-success/10" : 
                      pattern.type === 'volatile' ? "bg-destructive/10" : "bg-primary/10"
                    )}>
                      <PatternIcon className={cn("w-5 h-5", getTypeColor(pattern.type))} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{pattern.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {pattern.category}
                        </Badge>
                        <Badge 
                          variant={pattern.type === 'positive' ? 'default' : pattern.type === 'volatile' ? 'destructive' : 'secondary'}
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
                  {pattern.streak && (
                    <div className="flex items-center gap-2 text-xs">
                      <Target className="w-3 h-3 text-primary" />
                      <span>{pattern.streak} week streak</span>
                      <Progress value={(pattern.streak / 10) * 100} className="h-1 flex-1" />
                    </div>
                  )}
                </div>
                
                {pattern.formula && (
                  <div className="p-2 bg-muted/50 rounded text-xs font-mono">
                    {pattern.formula}
                  </div>
                )}
                
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

      {/* Action Center */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent-teal/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-sm">Ready to optimize your behavior?</p>
              <p className="text-xs text-muted-foreground">
                Implementing these insights could improve your monthly cash flow by ${Math.abs(detectedPatterns.reduce((sum, p) => sum + p.impact, 0))}.
              </p>
            </div>
            <Button className="bg-gradient-primary hover:shadow-glow">
              Create Action Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};