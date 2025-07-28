import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Activity,
  Shield
} from "lucide-react";

interface PulseBarProps {
  status: 'normal' | 'warning' | 'critical' | 'success';
  message: string;
  className?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export const PulseBar = ({ status, message, className, actionLabel, onActionClick }: PulseBarProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'critical':
        return {
          icon: AlertTriangle,
          bgClass: 'bg-gradient-to-r from-destructive/20 via-destructive/15 to-destructive/20',
          borderClass: 'border-destructive/30',
          textClass: 'text-destructive',
          pulseClass: 'pulse-bar-glow',
          badgeVariant: 'destructive' as const,
          badgeText: 'URGENT',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgClass: 'bg-gradient-to-r from-warning/20 via-warning/15 to-warning/20',
          borderClass: 'border-warning/30',
          textClass: 'text-warning',
          pulseClass: 'animate-pulse',
          badgeVariant: 'secondary' as const,
          badgeText: 'ATTENTION',
        };
      case 'success':
        return {
          icon: CheckCircle,
          bgClass: 'bg-gradient-to-r from-success/20 via-success/15 to-success/20',
          borderClass: 'border-success/30',
          textClass: 'text-success',
          pulseClass: '',
          badgeVariant: 'outline' as const,
          badgeText: 'EXCELLENT',
        };
      default:
        return {
          icon: Activity,
          bgClass: 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20',
          borderClass: 'border-primary/30',
          textClass: 'text-primary',
          pulseClass: '',
          badgeVariant: 'outline' as const,
          badgeText: 'STABLE',
        };
    }
  };

  const { 
    icon: Icon, 
    bgClass, 
    borderClass, 
    textClass, 
    pulseClass,
    badgeVariant,
    badgeText 
  } = getStatusConfig();

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-4 transition-all duration-500",
      bgClass,
      borderClass,
      pulseClass,
      className
    )}>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-110",
            status === 'critical' ? 'bg-destructive/20' :
            status === 'warning' ? 'bg-warning/20' :
            status === 'success' ? 'bg-success/20' :
            'bg-primary/20'
          )}>
            <Icon className={cn("h-5 w-5", textClass)} />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className={cn("font-semibold tracking-tight", textClass)}>
                Financial Pulse
              </h3>
              <Badge variant={badgeVariant} className="text-xs font-medium">
                <Shield className="w-3 h-3 mr-1" />
                {badgeText}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          {actionLabel && onActionClick && (
            <Button
              variant={status === 'critical' ? 'destructive' : 'outline'}
              size="sm"
              onClick={onActionClick}
              className="transition-all duration-300 hover:scale-105"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};