import { useState } from "react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from "recharts";

interface TimelineChartProps {
  data?: Array<{
    year: number;
    netWorth: number;
    income: number;
    expenses: number;
    confidence: number;
    weekProjection?: number;
    monthProjection?: number;
    quarterProjection?: number;
    yearProjection?: number;
  }>;
  className?: string;
}

export const TimelineChart = ({ data, className = "" }: TimelineChartProps) => {
  const [_selectedYear, setSelectedYear] = useState<number | null>(null);

  // Generate sample data if none provided
  const chartData = data || generateSampleData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatYear = (year: number) => {
    return `'${year.toString().slice(-2)}`;
  };

  return (
    <div className={`w-full h-96 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onMouseMove={(e) => {
            if (e && e.activeLabel) {
              setSelectedYear(Number(e.activeLabel));
            }
          }}
          onMouseLeave={() => setSelectedYear(null)}
        >
          <defs>
            <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="year" 
            tickFormatter={formatYear}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-foreground font-medium">Year {label}</p>
                    <div className="space-y-1 mt-2">
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm">
                          <span style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value as number)}
                          </span>
                        </p>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        "If you continued budgeting like this..."
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          
          {/* Confidence band */}
          <Area
            type="monotone"
            dataKey="confidence"
            stroke="none"
            fill="url(#confidenceGradient)"
            name="Confidence Range"
          />
          
          {/* Main Net Worth line */}
          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
            name="Net Worth"
          />
          
          {/* 1-Week Projection */}
          <Line
            type="monotone"
            dataKey="weekProjection"
            stroke="hsl(var(--accent-success))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="1-Week Trend"
          />
          
          {/* 1-Month Projection */}
          <Line
            type="monotone"
            dataKey="monthProjection"
            stroke="hsl(var(--accent-teal))"
            strokeWidth={2}
            strokeDasharray="8 4"
            dot={false}
            name="1-Month Trend"
          />
          
          {/* 3-Month Projection */}
          <Line
            type="monotone"
            dataKey="quarterProjection"
            stroke="hsl(var(--accent-warning))"
            strokeWidth={2}
            strokeDasharray="12 6"
            dot={false}
            name="3-Month Trend"
          />
          
          {/* 1-Year Projection */}
          <Line
            type="monotone"
            dataKey="yearProjection"
            stroke="hsl(var(--accent-coral))"
            strokeWidth={2}
            strokeDasharray="15 8"
            dot={false}
            name="1-Year Trend"
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-primary"></div>
          <span>Current Trajectory</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-accent-success border-dashed border-t"></div>
          <span>1-Week Trend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-accent-teal border-dashed border-t"></div>
          <span>1-Month Trend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-accent-warning border-dashed border-t"></div>
          <span>3-Month Trend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-accent-coral border-dashed border-t"></div>
          <span>1-Year Trend</span>
        </div>
      </div>
    </div>
  );
};

function generateSampleData() {
  const currentYear = new Date().getFullYear();
  const data = [];
  
  // Current spending behavior (simulated)
  const currentMonthlySavings = 1250; // $1,250 monthly surplus
  // const currentSavingsRate = 0.235; // 23.5% savings rate (placeholder for future use)
  
  for (let i = 0; i <= 30; i++) {
    const year = currentYear + i;
    const baseNetWorth = 50000 + (i * 15000) + (i * i * 800);
    const confidence = Math.max(20000, baseNetWorth * 0.15 * (1 - i / 50));
    
    // Calculate different projection scenarios based on current behavior
    const weeklyTrend = baseNetWorth + (currentMonthlySavings * 12 * i * 0.9); // 10% less optimistic
    const monthlyTrend = baseNetWorth + (currentMonthlySavings * 12 * i * 1.1); // 10% more optimistic
    const quarterlyTrend = baseNetWorth + (currentMonthlySavings * 12 * i * 1.15); // Account for compound growth
    const yearlyTrend = baseNetWorth + (currentMonthlySavings * 12 * i * 1.25); // Best case sustained behavior
    
    data.push({
      year,
      netWorth: baseNetWorth,
      income: 75000 + (i * 2000),
      expenses: 45000 + (i * 1200),
      confidence,
      weekProjection: i < 5 ? weeklyTrend : null, // Only show short-term for first few years
      monthProjection: i < 10 ? monthlyTrend : null,
      quarterProjection: i < 15 ? quarterlyTrend : null,
      yearProjection: yearlyTrend,
    });
  }
  
  return data;
}