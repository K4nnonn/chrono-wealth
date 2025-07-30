import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { Layers, Eye, EyeOff, Zap, TrendingUp, AlertTriangle, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo data specifically for landing page showcase
const DEMO_PROJECTION_DATA = [
  { week: 0, date: 'Jan 1', P_week: 45000, P_month: 47000, P_quarter: 52000, P_year: 58000, behaviorImpact: 0 },
  { week: 4, date: 'Jan 29', P_week: 46800, P_month: 49200, P_quarter: 55600, P_year: 63200, behaviorImpact: -120 },
  { week: 8, date: 'Feb 26', P_week: 48600, P_month: 51400, P_quarter: 59200, P_year: 68400, behaviorImpact: 340 },
  { week: 12, date: 'Mar 26', P_week: 50400, P_month: 53600, P_quarter: 62800, P_year: 73600, behaviorImpact: -87 },
  { week: 16, date: 'Apr 23', P_week: 52200, P_month: 55800, P_quarter: 66400, P_year: 78800, behaviorImpact: 0 },
  { week: 20, date: 'May 21', P_week: 54000, P_month: 58000, P_quarter: 70000, P_year: 84000, behaviorImpact: 245 },
  { week: 24, date: 'Jun 18', P_week: 55800, P_month: 60200, P_quarter: 73600, P_year: 89200, behaviorImpact: -156 },
  { week: 28, date: 'Jul 16', P_week: 57600, P_month: 62400, P_quarter: 77200, P_year: 94400, behaviorImpact: 0 },
  { week: 32, date: 'Aug 13', P_week: 59400, P_month: 64600, P_quarter: 80800, P_year: 99600, behaviorImpact: 412 },
  { week: 36, date: 'Sep 10', P_week: 61200, P_month: 66800, P_quarter: 84400, P_year: 104800, behaviorImpact: 0 },
  { week: 40, date: 'Oct 8', P_week: 63000, P_month: 69000, P_quarter: 88000, P_year: 110000, behaviorImpact: -278 },
  { week: 44, date: 'Nov 5', P_week: 64800, P_month: 71200, P_quarter: 91600, P_year: 115200, behaviorImpact: 0 },
  { week: 48, date: 'Dec 3', P_week: 66600, P_month: 73400, P_quarter: 95200, P_year: 120400, behaviorImpact: 189 },
  { week: 52, date: 'Dec 31', P_week: 68400, P_month: 75600, P_quarter: 98800, P_year: 125600, behaviorImpact: 0 }
];

const DEMO_PATTERNS = [
  {
    id: 'weekend_rebounder',
    week: 8,
    category: 'Dining',
    impact: -340,
    description: 'Weekend dining spikes detected - optimize for +$340/mo savings'
  },
  {
    id: 'end_month_saver',
    week: 20,
    category: 'Shopping',
    impact: 245,
    description: 'Strong end-of-month discipline - leverage this pattern'
  },
  {
    id: 'subscription_creep',
    week: 32,
    category: 'Subscriptions',
    impact: -156,
    description: 'Subscription growth detected - review unused services'
  }
];

export const DemoTrajectoryMatrix = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3M' | '6M' | '1Y' | '2Y'>('1Y');
  const [showBehaviorShifts, setShowBehaviorShifts] = useState(true);
  const [showMathModal, setShowMathModal] = useState(false);

  const projectionLayers = [
    { id: 'P_week', name: 'Weekly (Volatility Adj.)', color: 'hsl(var(--accent-success))', formula: 'Proprietary Algorithm', visible: true, dashPattern: '5 5' },
    { id: 'P_month', name: 'Monthly Momentum', color: 'hsl(var(--accent-teal))', formula: 'AI-Powered Projection', visible: true, dashPattern: '10 5' },
    { id: 'P_quarter', name: 'Quarterly Compound', color: 'hsl(var(--accent-amber))', formula: 'Advanced Forecasting', visible: true, dashPattern: '15 10' },
    { id: 'P_year', name: 'Yearly Optimistic', color: 'hsl(var(--accent-coral))', formula: 'Machine Learning Model', visible: true, dashPattern: '20 15' }
  ];

  const goalWeek = 45; // Demo goal achievement at week 45

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
              AI-powered behavioral forecasting with multi-layer projections
            </p>
          </div>
          
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
        {/* Compelling Demo Insight */}
        <div className="p-4 bg-gradient-to-r from-accent-success/10 to-accent-teal/10 border border-accent-success/20 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="font-medium text-sm">
                💰 Your weekend dining pattern costs $340/month. Optimizing this could help you hit your savings goal 14 months ahead of schedule.
              </p>
              <p className="text-xs text-muted-foreground">
                AI detected 3 behavioral patterns with 94% confidence from your transaction data.
              </p>
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
                  Set Optimization Target
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Chart with Impressive Projections */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DEMO_PROJECTION_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              
              {/* Multi-layer Projections */}
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
              <ReferenceLine
                x={goalWeek}
                stroke="hsl(var(--primary))"
                strokeDasharray="3 3"
                label={{ value: "🎯 Goal", position: "top" }}
              />
              
              {/* Behavioral Pattern Markers */}
              {showBehaviorShifts && DEMO_PATTERNS.map((pattern, index) => (
                <ReferenceLine
                  key={index}
                  x={pattern.week}
                  stroke={pattern.impact < 0 ? "hsl(var(--destructive))" : "hsl(var(--accent-success))"}
                  strokeDasharray="2 2"
                  label={{ 
                    value: pattern.impact < 0 ? "📉" : "📈", 
                    position: "top",
                    offset: 10
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Formula Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {projectionLayers.map(layer => (
            <div
              key={layer.id}
              className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-left transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <div 
                  className="w-3 h-1 rounded"
                  style={{ backgroundColor: layer.color }}
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

        {/* Demo Behavioral Patterns */}
        {showBehaviorShifts && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Detected Behavioral Patterns (Demo Data)
            </h4>
            <div className="grid gap-2">
              {DEMO_PATTERNS.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant={pattern.impact < 0 ? "destructive" : "secondary"} className="text-xs">
                      Week {pattern.week}
                    </Badge>
                    <span>{pattern.description}</span>
                  </div>
                  <span className={cn(
                    "font-mono font-medium",
                    pattern.impact < 0 ? "text-destructive" : "text-accent-success"
                  )}>
                    {pattern.impact < 0 ? '' : '+'}${Math.abs(pattern.impact)}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Math Modal */}
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
                  <h4 className="font-medium">Demo Variables:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>S (Monthly Surplus): $3,200</div>
                    <div>R (Savings Rate): 28.5%</div>
                    <div>ΔB (Behavior Delta): -2.3%</div>
                    <div>MA Window: 4 weeks</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Pattern Detection Formulas:</h4>
                  <div className="p-2 bg-muted/30 rounded font-mono text-xs">
                    weekend_ratio = Σ(weekend_spend) / Σ(weekday_spend) = 1.8
                  </div>
                  <div className="p-2 bg-muted/30 rounded font-mono text-xs">
                    entropy = σ/μ = 0.73 (high volatility detected)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};