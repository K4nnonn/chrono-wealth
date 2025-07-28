import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  AreaChart, 
  BarChart, 
  LineChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';

interface EnhancedChartProps {
  data: any[];
  type: 'area' | 'line' | 'bar' | 'composed';
  height?: number;
  className?: string;
  config: {
    xKey: string;
    series: Array<{
      key: string;
      color: string;
      type?: 'area' | 'line' | 'bar';
      gradient?: boolean;
      strokeWidth?: number;
      opacity?: number;
      name?: string;
    }>;
  };
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  psychologyMode?: 'confidence' | 'growth' | 'warning' | 'success' | 'neutral';
}

export const EnhancedChart: React.FC<EnhancedChartProps> = ({
  data,
  type,
  height = 300,
  className,
  config,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  psychologyMode = 'neutral'
}) => {
  const containerClassName = cn(
    "animate-chart-entry transition-smooth",
    {
      'animate-confidence-glow': psychologyMode === 'confidence',
      'animate-wealth-pulse': psychologyMode === 'success',
      'animate-growth-surge': psychologyMode === 'growth',
    },
    className
  );

  const getGradientId = (seriesKey: string) => `gradient-${seriesKey}`;

  const renderGradients = () => (
    <defs>
      {config.series
        .filter(series => series.gradient)
        .map(series => (
          <linearGradient
            key={getGradientId(series.key)}
            id={getGradientId(series.key)}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={series.color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={series.color} stopOpacity={0.1} />
          </linearGradient>
        ))}
    </defs>
  );

  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  const axisProps = {
    axisLine: false,
    tickLine: false,
    tick: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' },
  };

  const tooltipProps = {
    contentStyle: {
      backgroundColor: 'hsl(var(--background))',
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      animation: 'insight-appear 0.3s ease-out',
    },
    cursor: { strokeDasharray: '3 3', stroke: 'hsl(var(--primary))' },
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {renderGradients()}
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
            <XAxis dataKey={config.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend />}
            {config.series.map(series => (
              <Area
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={series.color}
                strokeWidth={series.strokeWidth || 2}
                fill={series.gradient ? `url(#${getGradientId(series.key)})` : series.color}
                fillOpacity={series.opacity || 0.6}
                name={series.name || series.key}
              />
            ))}
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
            <XAxis dataKey={config.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend />}
            {config.series.map(series => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={series.color}
                strokeWidth={series.strokeWidth || 2}
                dot={{ fill: series.color, strokeWidth: 2, r: 4 }}
                name={series.name || series.key}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
            <XAxis dataKey={config.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend />}
            {config.series.map(series => (
              <Bar
                key={series.key}
                dataKey={series.key}
                fill={series.color}
                opacity={series.opacity || 0.8}
                radius={[4, 4, 0, 0]}
                name={series.name || series.key}
              />
            ))}
          </BarChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {renderGradients()}
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
            <XAxis dataKey={config.xKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend />}
            {config.series.map(series => {
              switch (series.type) {
                case 'area':
                  return (
                    <Area
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      stroke={series.color}
                      strokeWidth={series.strokeWidth || 2}
                      fill={series.gradient ? `url(#${getGradientId(series.key)})` : series.color}
                      fillOpacity={series.opacity || 0.6}
                      name={series.name || series.key}
                    />
                  );
                case 'line':
                  return (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      stroke={series.color}
                      strokeWidth={series.strokeWidth || 2}
                      dot={{ fill: series.color, strokeWidth: 2, r: 4 }}
                      name={series.name || series.key}
                    />
                  );
                case 'bar':
                default:
                  return (
                    <Bar
                      key={series.key}
                      dataKey={series.key}
                      fill={series.color}
                      opacity={series.opacity || 0.8}
                      radius={[4, 4, 0, 0]}
                      name={series.name || series.key}
                    />
                  );
              }
            })}
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className={containerClassName}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

// Psychology-based color schemes for different financial contexts
export const FINANCIAL_COLOR_SCHEMES = {
  positive: {
    primary: 'hsl(var(--accent-success))',
    secondary: 'hsl(var(--accent-teal))',
    accent: 'hsl(var(--primary-glow))',
  },
  neutral: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--primary-glow))',
    accent: 'hsl(var(--accent-teal))',
  },
  warning: {
    primary: 'hsl(var(--accent-warning))',
    secondary: 'hsl(45 100% 65%)',
    accent: 'hsl(var(--accent-coral))',
  },
  negative: {
    primary: 'hsl(var(--accent-destructive))',
    secondary: 'hsl(0 90% 65%)',
    accent: 'hsl(var(--accent-warning))',
  },
};

// Predefined configurations for common financial charts
export const CHART_CONFIGS = {
  netWorthProjection: {
    xKey: 'period',
    series: [
      {
        key: 'netWorth',
        color: FINANCIAL_COLOR_SCHEMES.positive.primary,
        type: 'area' as const,
        gradient: true,
        strokeWidth: 3,
        name: 'Net Worth',
      },
      {
        key: 'targetGoal',
        color: FINANCIAL_COLOR_SCHEMES.neutral.secondary,
        type: 'line' as const,
        strokeWidth: 2,
        name: 'Target Goal',
      },
    ],
  },
  incomeExpenses: {
    xKey: 'month',
    series: [
      {
        key: 'income',
        color: FINANCIAL_COLOR_SCHEMES.positive.primary,
        type: 'area' as const,
        gradient: true,
        name: 'Income',
      },
      {
        key: 'expenses',
        color: FINANCIAL_COLOR_SCHEMES.warning.primary,
        type: 'area' as const,
        gradient: true,
        name: 'Expenses',
      },
      {
        key: 'savings',
        color: FINANCIAL_COLOR_SCHEMES.positive.accent,
        type: 'bar' as const,
        opacity: 0.7,
        name: 'Savings',
      },
    ],
  },
  savingsRate: {
    xKey: 'month',
    series: [
      {
        key: 'rate',
        color: FINANCIAL_COLOR_SCHEMES.positive.primary,
        type: 'bar' as const,
        name: 'Savings Rate',
      },
    ],
  },
};