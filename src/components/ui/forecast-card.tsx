import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ForecastCardProps {
  title: string;
  value: string;
  confidence?: number;
  change?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles = {
  default: "bg-gradient-card border-border",
  success: "bg-gradient-success border-accent-success/20",
  warning: "bg-gradient-forecast border-accent/30",
  danger: "bg-destructive/10 border-destructive/30"
};

const ForecastCard = ({
  title,
  value,
  confidence,
  change,
  icon: Icon,
  variant = "default",
  className
}: ForecastCardProps) => {
  return (
    <Card className={cn(
      "p-6 hover:shadow-card transition-all duration-300 group cursor-pointer",
      variantStyles[variant],
      className
    )}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          {change && (
            <span className={cn(
              "font-medium",
              change.startsWith("+") ? "text-accent-success" : "text-muted-foreground"
            )}>
              {change}
            </span>
          )}
          
          {confidence && (
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{confidence}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ForecastCard;