import { useState, useMemo } from 'react';
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
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useFinancialForecasting } from '@/hooks/useFinancialForecasting';
import { FlowSightFiEngine, DetectedPattern } from '@/lib/flowsightfi-engine';
import { supabase } from '@/integrations/supabase/client';

const iconMap = {
  back_half_saver: TrendingUp,
  weekend_rebounder: Pizza,
  midweek_impulse: ShoppingCart,
  consistency_champion: Target,
  entropy_spike: AlertCircle
};

export const BehavioralInsightEngine = () => {
  const { currentMetrics } = useFinancialForecasting();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Fetch real transaction data from Supabase
  const { data: realTransactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(200);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Initialize FlowSightFi engine with real data
  const engine = useMemo(() => 
    new FlowSightFiEngine(realTransactions, currentMetrics.monthlyIncome, currentMetrics.monthlyExpenses),
    [realTransactions, currentMetrics]
  );

  // Detect real behavioral patterns using FlowSightFi engine
  const detectedPatterns = useMemo(() => 
    engine.detectBehavioralPatterns(),
    [engine]
  );

  const categories = ['all', ...new Set(detectedPatterns.map(p => p.category))];
  
  const filteredPatterns = selectedCategory === 'all' 
    ? detectedPatterns 
    : detectedPatterns.filter(pattern => pattern.category === selectedCategory);

  const getTrendIcon = (pattern: DetectedPattern) => {
    if (pattern.impact > 0) return CheckCircle;
    if (pattern.impact < -100) return AlertCircle;
    return Target;
  };

  const getTypeColor = (pattern: DetectedPattern) => {
    if (pattern.impact > 0) return 'text-accent-success';
    if (pattern.impact < -100) return 'text-destructive';
    return 'text-amber-500';
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-accent-success';
    if (impact < -100) return 'text-destructive';
    return 'text-amber-500';
  };

  const getPatternTypeColor = (pattern: DetectedPattern) => {
    if (pattern.impact > 0) return "bg-accent-success/10";
    if (pattern.impact < -100) return "bg-destructive/10";
    return "bg-amber-500/10";
  };

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
              Live Analysis
            </Badge>
          </h2>
          <p className="text-muted-foreground">
            {detectedPatterns.length > 0 
              ? `AI detected ${detectedPatterns.length} behavioral patterns from your transaction data`
              : "Analyzing your transaction patterns to reveal hidden financial behaviors..."
            }
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

      {/* Real-time Insight Summary Stats */}
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
              <p className="text-xs text-muted-foreground">Behavior Leakage</p>
            </div>
            <TrendingDown className="w-8 h-8 text-destructive" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {detectedPatterns.length > 0 
                  ? Math.round(detectedPatterns.reduce((sum, p) => sum + p.confidence, 0) / detectedPatterns.length)
                  : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
            </div>
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Real Detected Patterns */}
      {detectedPatterns.length === 0 ? (
        <Card className="p-8 text-center">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Financial Behavior</h3>
          <p className="text-muted-foreground">
            We're processing your transaction patterns to detect hidden behavioral trends. 
            This usually takes a few moments with real financial data.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPatterns.map((pattern, index) => {
            const TrendIcon = getTrendIcon(pattern);
            const PatternIcon = iconMap[pattern.type] || AlertCircle;
            
            return (
              <Card key={pattern.type + index} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", getPatternTypeColor(pattern))}>
                        <PatternIcon className={cn("w-5 h-5", getTypeColor(pattern))} />
                      </div>
                      <div>
                        <CardTitle className="text-lg capitalize">
                          {pattern.type.replace(/_/g, ' ')}
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
                        <Progress value={(pattern.streakData / 10) * 100} className="h-1 flex-1" />
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
      )}

      {/* Action Center */}
      {detectedPatterns.length > 0 && (
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
      )}
    </div>
  );
};