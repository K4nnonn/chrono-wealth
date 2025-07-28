// @ts-nocheck
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Target } from "lucide-react";

interface TimelineData {
  year: number;
  baseline: number;
  aspirational: number;
  confidence: number;
}

interface DualAxisTimelineProps {
  data?: TimelineData[];
  onTimeChange?: (year: number) => void;
  className?: string;
}

const generateSampleData = (): TimelineData[] => {
  const currentYear = new Date().getFullYear();
  const data = [];
  
  for (let i = 0; i <= 10; i++) {
    const year = currentYear + i;
    const baseline = 50000 + (i * 12000) + (i * i * 500);
    const aspirational = baseline * (1 + 0.15 * i); // 15% yearly growth scenario
    const confidence = Math.max(10000, baseline * 0.1 * (1 - i / 20));
    
    data.push({
      year,
      baseline,
      aspirational,
      confidence
    });
  }
  
  return data;
};

export const DualAxisTimeline = ({ 
  data, 
  onTimeChange,
  className = ""
}: DualAxisTimelineProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [timelineData] = useState(data || generateSampleData());
  
  const currentYearIndex = timelineData.findIndex(d => d.year === selectedYear);
  const selectedData = timelineData[currentYearIndex] || timelineData[0];

  const handleYearChange = (value: number[]) => {
    const newYear = value[0];
    setSelectedYear(newYear);
    onTimeChange?.(newYear);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatYear = (year: number) => `'${year.toString().slice(-2)}`;

  const minYear = timelineData[0]?.year || new Date().getFullYear();
  const maxYear = timelineData[timelineData.length - 1]?.year || new Date().getFullYear() + 10;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle>Financial Vision Timeline</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Viewing: {selectedYear}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics for Selected Year */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Baseline Projection</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(selectedData.baseline)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Aspirational Scenario</p>
            <p className="text-xl font-bold text-accent-success">{formatCurrency(selectedData.aspirational)}</p>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="aspirationalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent-success))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--accent-success))" stopOpacity={0.05}/>
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
              
              {/* Confidence band for baseline */}
              <Area
                type="monotone"
                dataKey="confidence"
                stroke="none"
                fill="url(#baselineGradient)"
                name="Confidence Range"
              />
              
              {/* Baseline projection (solid line) */}
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                name="Baseline Projection"
              />
              
              {/* Aspirational scenario (dashed area) */}
              <Area
                type="monotone"
                dataKey="aspirational"
                stroke="hsl(var(--accent-success))"
                strokeWidth={2}
                strokeDasharray="8 4"
                fill="url(#aspirationalGradient)"
                name="Aspirational Scenario"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Time Scrubber */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{minYear}</span>
            <span className="font-medium">Drag to explore timeline</span>
            <span>{maxYear}</span>
          </div>
          <Slider
            value={[selectedYear]}
            onValueChange={handleYearChange}
            min={minYear}
            max={maxYear}
            step={1}
            className="w-full"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary"></div>
            <span>Reality Track</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-accent-success border-dashed border-t"></div>
            <span>Vision Scenario</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-primary/20 rounded-sm"></div>
            <span>Confidence Band</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};