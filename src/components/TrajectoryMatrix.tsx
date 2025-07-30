import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import { Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrajectoryMatrixProps {
  data: Array<{
    year: number;
    p10: number;
    p50: number;
    p90: number;
    userControl: number;
    events?: Array<{ year: number; event: string; impact: number; }>;
  }>;
  timeHorizon: 1 | 3 | 5 | 10;
  onTimeHorizonChange: (horizon: 1 | 3 | 5 | 10) => void;
  className?: string;
}

const generateSampleData = (horizon: number) => {
  const currentYear = new Date().getFullYear();
  const data = [];
  
  for (let i = 0; i <= horizon; i++) {
    const year = currentYear + i;
    const baseGrowth = 50000 + (i * 15000);
    const volatility = i * 2000;
    
    data.push({
      year,
      p10: baseGrowth - volatility * 1.5,
      p50: baseGrowth,
      p90: baseGrowth + volatility * 2,
      userControl: baseGrowth + (i * 5000), // User-controlled portion
      events: i === 2 ? [{ year, event: "Cancelled gym membership", impact: 1200 }] : undefined
    });
  }
  
  return data;
};

export const TrajectoryMatrix = ({ 
  timeHorizon = 5, 
  onTimeHorizonChange,
  className 
}: Partial<TrajectoryMatrixProps>) => {
  const [data] = useState(generateSampleData(timeHorizon));
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const timeHorizons = [
    { value: 1, label: "1Y" },
    { value: 3, label: "3Y" },
    { value: 5, label: "5Y" },
    { value: 10, label: "10Y" }
  ] as const;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trajectory Matrix
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Multi-scenario fan chart with behavioral markers
            </p>
          </div>
          
          {/* Time-Lens Dial */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
            {timeHorizons.map((horizon) => (
              <button
                key={horizon.value}
                onClick={() => onTimeHorizonChange?.(horizon.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                  timeHorizon === horizon.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {horizon.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* First-Glance Insight Banner */}
        <div className="flex items-start gap-3 p-3 bg-accent-teal/10 border border-accent-teal/20 rounded-lg">
          <Sparkles className="w-4 h-4 text-accent-teal flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">⚡ Changing grocery habits last quarter shaved 8 months off your 10-year goal.</p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="h-6 text-xs">
                Show math
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                Got it
              </Button>
            </div>
          </div>
        </div>

        {/* Fan Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="p90Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent-coral))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--accent-coral))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="p50Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="p10Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--muted))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="userControlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent-success))" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(var(--accent-success))" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              
              {/* 90th percentile (outer band) */}
              <Area
                type="monotone"
                dataKey="p90"
                stroke="hsl(var(--accent-coral))"
                fill="url(#p90Gradient)"
                strokeWidth={1}
                name="90th Percentile"
              />
              
              {/* 50th percentile (median) */}
              <Area
                type="monotone"
                dataKey="p50"
                stroke="hsl(var(--primary))"
                fill="url(#p50Gradient)"
                strokeWidth={2}
                name="50th Percentile"
              />
              
              {/* 10th percentile (inner band) */}
              <Area
                type="monotone"
                dataKey="p10"
                stroke="hsl(var(--muted))"
                fill="url(#p10Gradient)"
                strokeWidth={1}
                name="10th Percentile"
              />
              
              {/* User Control Band */}
              <Area
                type="monotone"
                dataKey="userControl"
                stroke="hsl(var(--accent-success))"
                fill="url(#userControlGradient)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Your Control"
              />
              
              {/* Behavioral Event Markers */}
              {data.map((point, index) => 
                point.events?.map((event, eventIndex) => (
                  <ReferenceLine
                    key={`${index}-${eventIndex}`}
                    x={event.year}
                    stroke="hsl(var(--warning))"
                    strokeDasharray="3 3"
                  />
                ))
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Behavioral Markers */}
        <div className="flex flex-wrap gap-2">
          {data.flatMap(point => 
            point.events?.map((event, index) => (
              <button
                key={`${point.year}-${index}`}
                onClick={() => setSelectedEvent(selectedEvent === event.event ? null : event.event)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200",
                  selectedEvent === event.event
                    ? "bg-warning text-warning-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <div className="w-2 h-2 rounded-full bg-warning" />
                {event.event}
              </button>
            )) || []
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-gradient-to-r from-accent-coral/60 to-accent-coral/20 rounded-sm" />
            <span>External Factors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-gradient-to-r from-primary/60 to-primary/20 rounded-sm" />
            <span>Expected Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-gradient-to-r from-accent-success/60 to-accent-success/20 rounded-sm border-dashed border" />
            <span>Your Control</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span>Behavior Shifts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};