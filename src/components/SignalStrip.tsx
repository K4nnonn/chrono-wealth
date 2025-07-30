import { useState } from "react";
import { X, Clock, Bookmark, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SignalStripProps {
  urgency: 'advisory' | 'warning' | 'critical';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  onSnooze?: () => void;
  onBookmark?: () => void;
}

export const SignalStrip = ({ 
  urgency, 
  message, 
  action, 
  onDismiss: _onDismiss, 
  onSnooze, 
  onBookmark 
}: SignalStripProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getUrgencyStyles = () => {
    switch (urgency) {
      case 'critical':
        return 'bg-destructive/10 border-destructive/20 text-destructive-foreground';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning-foreground';
      case 'advisory':
        return 'bg-primary/10 border-primary/20 text-primary-foreground';
      default:
        return 'bg-muted/10 border-muted/20 text-muted-foreground';
    }
  };

  const getIcon = () => {
    switch (urgency) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warning':
        return <Info className="w-4 h-4" />;
      case 'advisory':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  if (isCollapsed) {
    return (
      <div className={cn(
        "border-b p-2 transition-all duration-300 cursor-pointer",
        getUrgencyStyles()
      )} onClick={() => setIsCollapsed(false)}>
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-sm font-medium">Signal Strip (click to expand)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "border-b p-4 transition-all duration-300",
      getUrgencyStyles()
    )}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {getIcon()}
            <div className="flex-1">
              <p className="font-medium text-sm leading-relaxed">{message}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {action && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={action.onClick}
                className="border-current text-current hover:bg-current/10"
              >
                {action.label}
              </Button>
            )}
            
            {onBookmark && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onBookmark}
                className="text-current hover:bg-current/10"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            )}
            
            {onSnooze && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onSnooze}
                className="text-current hover:bg-current/10"
              >
                <Clock className="w-4 h-4" />
                <span className="text-xs ml-1">7d</span>
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsCollapsed(true)}
              className="text-current hover:bg-current/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};