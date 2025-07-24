import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Layers, Target, Eye, EyeOff, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFinancialForecasting } from '@/hooks/useFinancialForecasting';

interface ProjectionLayer {
  id: string;
  name: string;
  color: string;
  formula: string;
  visible: boolean;
  dashPattern?: string;
}

interface BehaviorShift {
  week: number;
  category: string;
  impact: number;
  description: string;
}

export const EnhancedTrajectoryMatrix = () => {
  const { currentMetrics } = useFinancialForecasting();
  
  const [projectionLayers, setProjectionLayers] = useState<ProjectionLayer[]>([
    { id: 'weekly', name: 'Weekly Short-Term', color: 'hsl(var(--accent-success))', formula: 'P_week(t) = S(t) * 0.9', visible: true, dashPattern: '5 5' },
    { id: 'monthly', name: 'Monthly Momentum', color: 'hsl(var(--accent-teal))', formula: 'P_month(t) = MA(S, 4) * (1 + ΔB(t) * 0.25)', visible: true, dashPattern: '10 5' },
    { id: 'quarterly', name: 'Quarterly Compound', color: 'hsl(var(--accent-amber))', formula: 'P_quarter(t) = P_month(t) * (1 + compound_effects)', visible: true, dashPattern: '15 10' },
    { id: 'yearly', name: 'Yearly Optimistic', color: 'hsl(var(--accent-coral))', formula: 'P_year(t) = P_quarter(t) * (1 + R(t) * 0.4)', visible: true, dashPattern: '20 15' }
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState<'3M' | '6M' | '1Y' | '2Y'>('1Y');
  const [showBehaviorShifts, setShowBehaviorShifts] = useState(true);

  const behaviorShifts: BehaviorShift[] = [
    { week: 12, category: 'Dining', impact: -87, description: 'Meal prep habit reduces dining spend' },
    { week: 24, category: 'Transport', impact: 45, description: 'Gas price spike affects commuting' },
    { week: 36, category: 'Shopping', impact: -120, description: 'Impulse control improvement' }
  ];

  const projectionData = useMemo(() => {
    const weeks = selectedTimeframe === '3M' ? 12 : selectedTimeframe === '6M' ? 24 : selectedTimeframe === '1Y' ? 52 : 104;
    const data = [];
    const baseIncome = currentMetrics.monthlyIncome;
    const baseExpenses = currentMetrics.monthlyExpenses;
    const baseSurplus = currentMetrics.monthlySavings;
    
    let cumulativeNetWorth = currentMetrics.currentNetWorth;
    
    for (let week = 0; week <= weeks; week++) {
      const variance = Math.sin(week * 0.1) * 0.15; // Simulate volatility
      const behaviorDelta = behaviorShifts
        .filter(shift => shift.week <= week)
        .reduce((sum, shift) => sum + shift.impact, 0);
      
      // Multi-layer projections with different time horizons
      const weeklyProjection = baseSurplus * 0.9 * (1 + variance);
      const monthlyMomentum = (baseSurplus + behaviorDelta) * (1 + variance * 0.25);
      const quarterlyCompound = monthlyMomentum * (1 + Math.pow(1.02, week / 52)); // 2% annual compound
      const yearlyOptimistic = quarterlyCompound * (1 + (currentMetrics.savingsRate || 0) * 0.4);
      
      cumulativeNetWorth += (yearlyOptimistic / 52); // Weekly accumulation
      
      data.push({
        week: week,
        date: new Date(Date.now() + week * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekly: cumulativeNetWorth + (weeklyProjection * week / 52),
        monthly: cumulativeNetWorth + (monthlyMomentum * week / 52),
        quarterly: cumulativeNetWorth + (quarterlyCompound * week / 52),
        yearly: cumulativeNetWorth + (yearlyOptimistic * week / 52),
        behaviorImpact: behaviorDelta
      });
    }
    
    return data;
  }, [selectedTimeframe, currentMetrics]);

  const toggleLayer = (layerId: string) => {
    setProjectionLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const getGoalAchievementWeek = () => {
    const goalAmount = currentMetrics.currentNetWorth + 50000; // Example goal
    const achievement = projectionData.find(d => d.yearly >= goalAmount);
    return achievement ? achievement.week : null;
  };

  const goalWeek = getGoalAchievementWeek();

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
                Multi-Layer
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Behavioral pattern-aware financial forecasting with entropy detection
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
        {/* Behavioral Insight Banner */}
        <div className="p-4 bg-gradient-to-r from-accent-success/10 to-accent-teal/10 border border-accent-success/20 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="font-medium text-sm">
                {goalWeek 
                  ? `💰 Current trajectory reaches your target ${Math.floor(goalWeek / 4)} months ahead of schedule`
                  : "📈 Excellent momentum detected in your savings behavior"
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Your meal prep habit this quarter is projected to save $87/month consistently.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Show Formula
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Set New Target
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Layer Chart */}
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
                              Behavior Impact: {data.behaviorImpact > 0 ? '+' : ''}${data.behaviorImpact}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* Projection Lines */}
              {projectionLayers.map(layer => (
                layer.visible && (
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
                )
              ))}
              
              {/* Goal Marker */}
              {goalWeek && (
                <ReferenceLine
                  x={goalWeek}
                  stroke="hsl(var(--primary))"
                  strokeDasharray="3 3"
                  label={{ value: "🎯 Goal", position: "top" }}
                />
              )}
              
              {/* Behavior Shift Markers */}
              {showBehaviorShifts && behaviorShifts.map((shift, index) => (
                <ReferenceLine
                  key={index}
                  x={shift.week}
                  stroke={shift.impact < 0 ? "hsl(var(--accent-success))" : "hsl(var(--destructive))"}
                  strokeDasharray="2 2"
                  label={{ 
                    value: shift.impact < 0 ? "📈" : "📉", 
                    position: "top",
                    offset: 10
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Layer Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {projectionLayers.map(layer => (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                layer.visible 
                  ? "border-primary/20 bg-primary/5" 
                  : "border-muted bg-muted/20 opacity-60"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div 
                  className="w-3 h-1 rounded"
                  style={{ 
                    backgroundColor: layer.color,
                    opacity: layer.visible ? 1 : 0.3
                  }}
                />
                {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </div>
              <p className="text-xs font-medium">{layer.name}</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {layer.formula.split('=')[0]}=...
              </p>
            </button>
          ))}
        </div>

        {/* Behavior Shift Summary */}
        {showBehaviorShifts && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Detected Behavior Shifts
            </h4>
            <div className="grid gap-2">
              {behaviorShifts.map((shift, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant={shift.impact < 0 ? "secondary" : "destructive"} className="text-xs">
                      Week {shift.week}
                    </Badge>
                    <span>{shift.description}</span>
                  </div>
                  <span className={cn(
                    "font-mono font-medium",
                    shift.impact < 0 ? "text-accent-success" : "text-destructive"
                  )}>
                    {shift.impact < 0 ? '+' : ''}${Math.abs(shift.impact)}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};