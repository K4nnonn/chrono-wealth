import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Info,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowData {
  category: string;
  amount: number;
  percentage: number;
  change: number; // Month over month change
  aiInsight?: string;
}

interface MoneyMapProps {
  totalIncome: number;
  flows: {
    taxes: FlowData;
    fixedCosts: FlowData[];
    discretionary: FlowData[];
    savings: FlowData;
  };
  savingsRate: number;
  className?: string;
}

const defaultData = {
  taxes: { category: "Taxes", amount: 1200, percentage: 20, change: 0 },
  fixedCosts: [
    { category: "Rent", amount: 1800, percentage: 30, change: 0 },
    { category: "Insurance", amount: 300, percentage: 5, change: -5 },
    { category: "Utilities", amount: 200, percentage: 3.3, change: 12 }
  ],
  discretionary: [
    { category: "Dining", amount: 400, percentage: 6.7, change: 12, aiInsight: "Dining out up 12% vs. last month; skip 3 meals → +$87/mo" },
    { category: "Entertainment", amount: 200, percentage: 3.3, change: -8 },
    { category: "Shopping", amount: 300, percentage: 5, change: 25, aiInsight: "Shopping spike detected; review recent purchases" }
  ],
  savings: { category: "Savings", amount: 1800, percentage: 30, change: 15 }
};

export const MoneyMap = ({ 
  totalIncome = 6000, 
  flows = defaultData, 
  savingsRate = 30,
  className 
}: MoneyMapProps) => {
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-destructive" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-accent-success" />;
    return null;
  };

  const getFlowHeight = (percentage: number) => {
    const minHeight = 20;
    const maxHeight = 60;
    return Math.max(minHeight, (percentage / 100) * maxHeight * 4);
  };

  const FlowBar = ({ flow, isHovered }: { flow: FlowData; isHovered: boolean }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative group cursor-pointer transition-all duration-300",
              isHovered && "scale-105"
            )}
            onMouseEnter={() => setHoveredFlow(flow.category)}
            onMouseLeave={() => setHoveredFlow(null)}
          >
            <div
              className={cn(
                "w-full rounded transition-all duration-300",
                flow.category === "Savings" ? "bg-accent-success" : 
                flow.category === "Taxes" ? "bg-destructive/70" :
                flow.category.includes("Rent") || flow.category.includes("Insurance") || flow.category.includes("Utilities") ? "bg-warning/70" :
                "bg-primary/70"
              )}
              style={{ height: `${getFlowHeight(flow.percentage)}px` }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {flow.percentage.toFixed(1)}%
            </div>
            
            {flow.change !== 0 && (
              <div className="absolute -top-1 -right-1 bg-background border border-border rounded-full p-1">
                {getChangeIcon(flow.change)}
              </div>
            )}
          </div>
        </TooltipTrigger>
        
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-medium">{flow.category}</div>
            <div className="text-sm">
              {formatCurrency(flow.amount)} ({flow.percentage.toFixed(1)}%)
            </div>
            {flow.change !== 0 && (
              <div className="text-xs text-muted-foreground">
                {flow.change > 0 ? '+' : ''}{flow.change}% vs last month
              </div>
            )}
            {flow.aiInsight && (
              <div className="text-xs text-accent-teal border-t border-border pt-1">
                💡 {flow.aiInsight}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <CardTitle>Money Flow Engine</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(totalIncome)}/month
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sankey-style Flow Visualization */}
        <div className="space-y-4">
          {/* Income Source */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right">
              <div className="text-lg font-bold">{formatCurrency(totalIncome)}</div>
              <div className="text-sm text-muted-foreground">Total Income</div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 h-16 bg-gradient-to-r from-primary/20 to-primary/5 rounded flex items-center justify-center text-primary font-medium">
              Monthly Inflow
            </div>
          </div>

          {/* Flow Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Taxes */}
            <div className="space-y-2">
              <FlowBar flow={flows.taxes} isHovered={hoveredFlow === flows.taxes.category} />
              <div className="text-center">
                <div className="text-sm font-medium">{flows.taxes.category}</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(flows.taxes.amount)}</div>
              </div>
            </div>

            {/* Fixed Costs */}
            <div className="space-y-2">
              <div className="space-y-1">
                {flows.fixedCosts.map((flow) => (
                  <FlowBar 
                    key={flow.category} 
                    flow={flow} 
                    isHovered={hoveredFlow === flow.category} 
                  />
                ))}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Fixed Costs</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(flows.fixedCosts.reduce((sum, f) => sum + f.amount, 0))}
                </div>
              </div>
            </div>

            {/* Discretionary */}
            <div className="space-y-2">
              <div className="space-y-1">
                {flows.discretionary.map((flow) => (
                  <FlowBar 
                    key={flow.category} 
                    flow={flow} 
                    isHovered={hoveredFlow === flow.category} 
                  />
                ))}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Discretionary</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(flows.discretionary.reduce((sum, f) => sum + f.amount, 0))}
                </div>
              </div>
            </div>

            {/* Savings */}
            <div className="space-y-2">
              <FlowBar flow={flows.savings} isHovered={hoveredFlow === flows.savings.category} />
              <div className="text-center">
                <div className="text-sm font-medium text-accent-success">{flows.savings.category}</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(flows.savings.amount)}</div>
              </div>
            </div>

            {/* Savings Rate Overlay */}
            <div className="space-y-2">
              <div className="relative h-16 bg-muted/20 rounded border-2 border-dashed border-accent-success/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-accent-success">{savingsRate}%</div>
                  <div className="text-xs text-muted-foreground">Rate</div>
                </div>
                <div 
                  className="absolute bottom-0 left-0 w-full bg-accent-success/20 rounded"
                  style={{ height: `${(savingsRate / 50) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights for Flagged Categories */}
        <div className="space-y-2">
          {flows.discretionary
            .filter(f => f.aiInsight)
            .map((flow) => (
              <div key={flow.category} className="flex items-start gap-3 p-3 bg-accent-teal/10 border border-accent-teal/20 rounded-lg">
                <Info className="w-4 h-4 text-accent-teal flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{flow.category} Insight</p>
                  <p className="text-xs text-muted-foreground mt-1">{flow.aiInsight}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Quick Action */}
        <div className="flex justify-center">
          <Button variant="outline" size="sm" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Optimize Cash Flow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};