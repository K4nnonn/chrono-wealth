import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface TimelineChartProps {
  data?: Array<{
    year: number;
    netWorth: number;
    income: number;
    expenses: number;
    confidence: number;
  }>;
  className?: string;
}

export const TimelineChart = ({ data, className = "" }: TimelineChartProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

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
        <AreaChart
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
          
          {/* Net worth line */}
          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
            name="Net Worth"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

function generateSampleData() {
  const currentYear = new Date().getFullYear();
  const data = [];
  
  for (let i = 0; i <= 30; i++) {
    const year = currentYear + i;
    const baseNetWorth = 50000 + (i * 15000) + (i * i * 800);
    const confidence = Math.max(20000, baseNetWorth * 0.15 * (1 - i / 50));
    
    data.push({
      year,
      netWorth: baseNetWorth,
      income: 75000 + (i * 2000),
      expenses: 45000 + (i * 1200),
      confidence,
    });
  }
  
  return data;
}