import { cn } from "@/lib/utils";

interface PulseBarProps {
  status: 'normal' | 'warning' | 'critical' | 'success';
  message: string;
  className?: string;
}

export const PulseBar = ({ status, message, className }: PulseBarProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'critical':
        return 'bg-destructive/20 border-destructive/30 text-destructive';
      case 'warning':
        return 'bg-warning/20 border-warning/30 text-warning';
      case 'success':
        return 'bg-accent-success/20 border-accent-success/30 text-accent-success';
      default:
        return 'bg-primary/20 border-primary/30 text-primary';
    }
  };

  const getPulseStyles = () => {
    switch (status) {
      case 'critical':
        return 'animate-pulse';
      case 'warning':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  return (
    <div className={cn(
      "w-full h-12 flex items-center justify-center border-b backdrop-blur-sm",
      "transition-all duration-500",
      getStatusStyles(),
      getPulseStyles(),
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full",
              status === 'critical' ? 'bg-destructive' :
              status === 'warning' ? 'bg-warning' :
              status === 'success' ? 'bg-accent-success' : 'bg-primary',
              status === 'critical' || status === 'warning' ? 'animate-pulse' : ''
            )} />
            <span className="text-sm font-medium">{message}</span>
          </div>
          
          <div className="text-xs opacity-70">
            Last updated: just now
          </div>
        </div>
      </div>
    </div>
  );
};