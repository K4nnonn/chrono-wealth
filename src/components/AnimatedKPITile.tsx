import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedKPITileProps {
  title: string;
  pastValue: number;
  currentValue: number;
  nextMilestone: number;
  unit?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  lastUpdated?: string;
  className?: string;
}

export const AnimatedKPITile = ({
  title,
  pastValue,
  currentValue,
  nextMilestone,
  unit = "$",
  icon: Icon,
  variant = 'default',
  lastUpdated,
  className
}: AnimatedKPITileProps) => {
  const [displayValue, setDisplayValue] = useState(pastValue);
  const [phase, setPhase] = useState<'past' | 'current' | 'milestone'>('past');

  useEffect(() => {
    const sequence = async () => {
      // Start with past value
      setPhase('past');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Animate to current
      setPhase('current');
      animateNumber(pastValue, currentValue, 1000);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Show milestone briefly
      setPhase('milestone');
      animateNumber(currentValue, nextMilestone, 800);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return to current
      setPhase('current');
      animateNumber(nextMilestone, currentValue, 600);
    };

    sequence();
  }, [pastValue, currentValue, nextMilestone]);

  const animateNumber = (from: number, to: number, duration: number) => {
    const startTime = Date.now();
    const difference = to - from;

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = from + (difference * easeOutCubic);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    requestAnimationFrame(updateValue);
  };

  const formatValue = (value: number) => {
    if (unit === "$") {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return `${Math.round(value)}${unit}`;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-accent-success/20 bg-accent-success/5';
      case 'warning':
        return 'border-accent-warning/20 bg-accent-warning/5';
      case 'destructive':
        return 'border-destructive/20 bg-destructive/5';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'past':
        return 'Last Month';
      case 'milestone':
        return 'Next Goal';
      default:
        return 'Current';
    }
  };

  const isStale = lastUpdated && 
    new Date().getTime() - new Date(lastUpdated).getTime() > 3 * 24 * 60 * 60 * 1000;

  return (
    <Card className={cn(
      "transition-all duration-500 hover:shadow-glow cursor-pointer",
      getVariantStyles(),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <span className="text-xs text-muted-foreground/70">
                • {getPhaseLabel()}
              </span>
            </div>
            
            <div className="relative">
              <p className={cn(
                "text-3xl font-bold transition-all duration-300",
                phase === 'milestone' && "text-accent-success scale-105"
              )}>
                {formatValue(displayValue)}
              </p>
              
              {/* Recency Halo */}
              <div className={cn(
                "absolute -inset-2 rounded-full transition-all duration-1000",
                isStale 
                  ? "bg-muted/20 animate-pulse" 
                  : "bg-current/10 animate-pulse"
              )} />
            </div>

            {/* Progress dots */}
            <div className="flex gap-1">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                phase === 'past' ? "bg-current" : "bg-muted-foreground/30"
              )} />
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                phase === 'current' ? "bg-current" : "bg-muted-foreground/30"
              )} />
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                phase === 'milestone' ? "bg-accent-success" : "bg-muted-foreground/30"
              )} />
            </div>
          </div>
          
          <Icon className={cn(
            "w-8 h-8 transition-all duration-300",
            phase === 'milestone' && "text-accent-success scale-110"
          )} />
        </div>
      </CardContent>
    </Card>
  );
};