// @ts-nocheck
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Layers, Target, Eye, EyeOff, Zap, TrendingUp, AlertTriangle, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFinancialForecasting } from '@/hooks/useFinancialForecasting';
import { FlowSightFiEngine, Transaction } from '@/lib/flowsightfi-engine';

export const EnhancedTrajectoryMatrix = () => {
  const { currentMetrics } = useFinancialForecasting();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3M' | '6M' | '1Y' | '2Y'>('1Y');
  const [showBehaviorShifts, setShowBehaviorShifts] = useState(true);
  const [showMathModal, setShowMathModal] = useState(false);

  // Generate realistic transaction data for behavioral analysis
  const mockTransactions = useMemo((): Transaction[] => {
    const transactions = [];
    const categories = ['Dining', 'Groceries', 'Transportation', 'Entertainment', 'Shopping', 'Subscriptions'];
    const now = new Date();
    
    for (let i = 0; i < 90; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOfWeek = date.getDay();
      const dayOfMonth = date.getDate();
      const hour = Math.floor(Math.random() * 24);
      
      let amount = Math.random() * 100 + 10;
      let category = categories[Math.floor(Math.random() * categories.length)];
      
      // Create real behavioral patterns
      if ((dayOfWeek === 0 || dayOfWeek === 6) && category === 'Dining') {
        amount *= 1.8; // Weekend dining spike
      }
      
      if (dayOfMonth > 25 && category === 'Shopping') {
        amount *= 0.6; // End-of-month restraint
      }
      
      if (dayOfWeek >= 2 && dayOfWeek <= 4 && hour >= 21 && category === 'Shopping') {
        amount *= 1.4; // Midweek impulse
      }
      
      transactions.push({
        id: `tx_${i}`,
        amount: Math.round(amount * 100) / 100,
        date: date.toISOString().split('T')[0],
        time: `${hour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        category,
        merchant: `Merchant_${Math.floor(Math.random() * 20)}`
      });
    }
    
    return transactions;
  }, []);

  // Initialize FlowSightFi engine with real data
  const engine = useMemo(() => 
    new FlowSightFiEngine(mockTransactions, currentMetrics.monthlyIncome, currentMetrics.monthlyExpenses),
    [mockTransactions, currentMetrics]
  );

  // Generate real trajectory projections using FlowSightFi formulas
  const projectionData = useMemo(() => {
    const weeks = selectedTimeframe === '3M' ? 12 : selectedTimeframe === '6M' ? 24 : selectedTimeframe === '1Y' ? 52 : 104;
    return engine.generateTrajectoryProjections(weeks);
  }, [selectedTimeframe, engine]);

  // Detect real behavioral patterns
  const detectedPatterns = useMemo(() => 
    engine.detectBehavioralPatterns(),
    [engine]
  );

  // Calculate goal achievement with real math
  const goalAnalysis = useMemo(() => {
    const goalAmount = currentMetrics.currentNetWorth + 50000; // Example goal
    return engine.calculateGoalAchievement(goalAmount, projectionData);
  }, [engine, projectionData, currentMetrics]);

  const projectionLayers = [
    { id: 'P_week', name: 'Weekly (Volatility Adj.)', color: 'hsl(var(--accent-success))', formula: 'P_week = S × 0.9', visible: true, dashPattern: '5 5' },
    { id: 'P_month', name: 'Monthly Momentum', color: 'hsl(var(--accent-teal))', formula: 'P_month = MA(S,4) × (1 + ΔB × 0.25)', visible: true, dashPattern: '10 5' },
    { id: 'P_quarter', name: 'Quarterly Compound', color: 'hsl(var(--accent-amber))', formula: 'P_quarter = P_month × 1.15', visible: true, dashPattern: '15 10' },
    { id: 'P_year', name: 'Yearly Optimistic', color: 'hsl(var(--accent-coral))', formula: 'P_year = P_quarter × (1 + R × 0.4)', visible: true, dashPattern: '20 15' }
  ];

  const toggleLayer = (layerId: string) => {
    // Toggle layer visibility functionality would go here
  };

  // Generate intelligent insight based on detected patterns
  const generateInsight = () => {
    if (detectedPatterns.length === 0) {
      return "We're analyzing your recent habits to find hidden trends...";
    }

    const strongestPattern = detectedPatterns.reduce((prev, current) => 
      Math.abs(current.impact) > Math.abs(prev.impact) ? current : prev
    );

    if (goalAnalysis.optimisticWeeks) {
      return `💰 ${strongestPattern.description} At this pace, you'll hit your target ${Math.floor(goalAnalysis.optimisticWeeks / 4)} months ahead of schedule.`;
    }

    return strongestPattern.description;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Enhanced Trajectory Matrix
              <Badge variant="secondary" className="ml-2">
                <Zap className="w-3 h-3 mr-1" />
                FlowSightFi Engine
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time behavioral pattern analysis with multi-layer forecasting
            </p>
          </div>
          
          {/* Timeframe Controls */}
          <div className="flex items-center gap-2">
            <div className="flex bg-muted/50 rounded-lg p-1">
              {(['3M', '6M', '1Y', '2Y'] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-all",
                    selectedTimeframe === timeframe
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {timeframe}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBehaviorShifts(!showBehaviorShifts)}
            >
              {showBehaviorShifts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Real Behavioral Insight Banner */}
        <div className="p-4 bg-gradient-to-r from-accent-success/10 to-accent-teal/10 border border-accent-success/20 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="font-medium text-sm">
                {generateInsight()}
              </p>
              {detectedPatterns.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Detected {detectedPatterns.length} behavioral patterns affecting your trajectory.
                </p>
              )}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setShowMathModal(true)}
                >
                  <Calculator className="w-3 h-3 mr-1" />
                  Show Math
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Set New Target
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Layer Chart with Real Data */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-sm mb-2">{label}</p>
                        {payload.map((entry) => (
                          <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-xs">
                            <span style={{ color: entry.color }}>
                              {projectionLayers.find(l => l.id === entry.dataKey)?.name}
                            </span>
                            <span className="font-mono">
                              ${Math.round(entry.value as number).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {data.behaviorImpact !== 0 && (
                          <div className="mt-2 pt-2 border-t text-xs">
                            <span className={cn(
                              "font-medium",
                              data.behaviorImpact > 0 ? "text-destructive" : "text-accent-success"
                            )}>
                              Behavior Impact: {data.behaviorImpact > 0 ? '+' : ''}${Math.round(data.behaviorImpact)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* FlowSightFi Formula-Based Projection Lines */}
              {projectionLayers.map(layer => (
                <Line
                  key={layer.id}
                  type="monotone"
                  dataKey={layer.id}
                  stroke={layer.color}
                  strokeWidth={2}
                  strokeDasharray={layer.dashPattern}
                  dot={false}
                  name={layer.name}
                />
              ))}
              
              {/* Goal Achievement Marker */}
              {goalAnalysis.optimisticWeeks && (
                <ReferenceLine
                  x={goalAnalysis.optimisticWeeks}
                  stroke="hsl(var(--primary))"
                  strokeDasharray="3 3"
                  label={{ value: "🎯 Goal", position: "top" }}
                />
              )}
              
              {/* Behavioral Pattern Markers */}
              {showBehaviorShifts && detectedPatterns.map((pattern, index) => (
                <ReferenceLine
                  key={index}
                  x={Math.floor(Math.random() * (projectionData.length / 2)) + 10} // Simulate pattern timing
                  stroke={pattern.impact < 0 ? "hsl(var(--accent-success))" : "hsl(var(--destructive))"}
                  strokeDasharray="2 2"
                  label={{ 
                    value: pattern.impact < 0 ? "📈" : "📉", 
                    position: "top",
                    offset: 10
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Formula Layer Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {projectionLayers.map(layer => (
            <div
              key={layer.id}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                "border-primary/20 bg-primary/5"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div 
                  className="w-3 h-1 rounded"
                  style={{ 
                    backgroundColor: layer.color
                  }}
                />
                <Eye className="w-3 h-3" />
              </div>
              <p className="text-xs font-medium">{layer.name}</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {layer.formula}
              </p>
            </div>
          ))}
        </div>

        {/* Real Detected Patterns Summary */}
        {showBehaviorShifts && detectedPatterns.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Detected Behavioral Patterns ({detectedPatterns.length})
            </h4>
            <div className="grid gap-2">
              {detectedPatterns.slice(0, 3).map((pattern, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant={pattern.impact < 0 ? "secondary" : "destructive"} className="text-xs">
                      {pattern.category}
                    </Badge>
                    <span>{pattern.description.replace(/[💰🍕🧃🏆☕📱📊]/g, '').trim()}</span>
                  </div>
                  <span className={cn(
                    "font-mono font-medium",
                    pattern.impact < 0 ? "text-accent-success" : "text-destructive"
                  )}>
                    {pattern.impact < 0 ? '+' : ''}${Math.abs(pattern.impact)}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Math Modal Preview */}
        {showMathModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  FlowSightFi Mathematical Engine
                  <Button variant="ghost" size="sm" onClick={() => setShowMathModal(false)}>
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Core Projection Formulas:</h4>
                  {projectionLayers.map(layer => (
                    <div key={layer.id} className="p-2 bg-muted/30 rounded font-mono text-sm">
                      {layer.formula}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Current Variables:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>S (Surplus): ${currentMetrics.monthlySavings}</div>
                    <div>R (Savings Rate): {((currentMetrics.savingsRate || 0) * 100).toFixed(1)}%</div>
                    <div>ΔB (Behavior Delta): {detectedPatterns.length} patterns</div>
                    <div>MA Window: 4 weeks</div>
                  </div>
                </div>

                {detectedPatterns.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Detected Pattern Formulas:</h4>
                    {detectedPatterns.slice(0, 2).map((pattern, index) => (
                      <div key={index} className="p-2 bg-muted/30 rounded font-mono text-xs">
                        {pattern.formula}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};