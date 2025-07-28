// @ts-nocheck
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Settings, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextRibbonProps {
  assumptions: {
    cpi: number;
    fedFunds: number;
    marketReturn: number;
    inflationAdjusted: boolean;
  };
  onAdjust?: (newAssumptions: any) => void;
  className?: string;
}

export const ContextRibbon = ({ 
  assumptions, 
  onAdjust,
  className 
}: ContextRibbonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "bg-muted/30 border-y border-border/30 transition-all duration-300",
      isExpanded && "bg-muted/50",
      className
    )}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Model assumes CPI {assumptions.cpi}%, Fed Funds {assumptions.fedFunds}%, 
              Market Return {assumptions.marketReturn}%
              {assumptions.inflationAdjusted && " (inflation-adjusted)"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Updated 2h ago
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs h-6 px-2"
            >
              <Settings className="w-3 h-3 mr-1" />
              Adjust
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="pb-4 pt-2 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground">CPI (%)</label>
                <input 
                  type="number" 
                  value={assumptions.cpi} 
                  className="w-full px-2 py-1 rounded border bg-background text-foreground"
                  step="0.1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Fed Funds (%)</label>
                <input 
                  type="number" 
                  value={assumptions.fedFunds} 
                  className="w-full px-2 py-1 rounded border bg-background text-foreground"
                  step="0.1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Market Return (%)</label>
                <input 
                  type="number" 
                  value={assumptions.marketReturn} 
                  className="w-full px-2 py-1 rounded border bg-background text-foreground"
                  step="0.1"
                />
              </div>
              <div className="flex items-end">
                <Button size="sm" className="w-full h-7 text-xs">
                  Update Model
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};