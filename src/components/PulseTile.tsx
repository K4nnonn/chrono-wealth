import { useState, useEffect } from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface PulseTileProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  confidence?: number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export const PulseTile = ({
  title,
  value,
  trend,
  trendValue,
  confidence,
  icon: Icon,
  variant = 'default',
  className
}: PulseTileProps) => {
  const [isShowingTrend, setIsShowingTrend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsShowingTrend(prev => !prev);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-accent-success/20 bg-accent-success/5 text-accent-success';
      case 'warning':
        return 'border-accent-warning/20 bg-accent-warning/5 text-accent-warning';
      case 'destructive':
        return 'border-destructive/20 bg-destructive/5 text-destructive';
      default:
        return 'border-primary/20 bg-primary/5 text-primary';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-accent-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-500 hover:shadow-glow cursor-pointer",
      getVariantStyles(),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="h-8 flex items-center">
              {isShowingTrend && trendValue ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  {getTrendIcon()}
                  <span className="text-sm font-medium">{trendValue}</span>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              )}
            </div>
            {confidence && (
              <div className="flex items-center gap-2">
                <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-current transition-all duration-300"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">±{100-confidence}%</span>
              </div>
            )}
          </div>
          <Icon className="w-8 h-8 opacity-80" />
        </div>
      </CardContent>
    </Card>
  );
};