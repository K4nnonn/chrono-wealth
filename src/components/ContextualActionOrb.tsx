import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  Zap, 
  Target, 
  AlertTriangle, 
  Calculator,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  urgency?: 'high' | 'medium' | 'low';
  onClick: () => void;
}

interface ContextualActionOrbProps {
  onNewGoal?: () => void;
  onWhatIfScenario?: () => void;
  onCrisisDrill?: () => void;
  onAIChat?: () => void;
  className?: string;
}

export const ContextualActionOrb = ({
  onNewGoal,
  onWhatIfScenario,
  onCrisisDrill,
  onAIChat,
  className
}: ContextualActionOrbProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [scrollEnded, setScrollEnded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let scrollTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), 8000);
    };

    const handleScroll = () => {
      setScrollEnded(false);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setScrollEnded(true), 1000);
      resetIdleTimer();
    };

    const handleActivity = () => resetIdleTimer();

    // Initial setup
    resetIdleTimer();

    // Event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, []);

  useEffect(() => {
    setIsVisible(isIdle || scrollEnded);
  }, [isIdle, scrollEnded]);

  const actionOptions: ActionOption[] = [
    {
      id: 'goal',
      label: 'New Goal',
      description: 'Set a new financial milestone',
      icon: Target,
      urgency: 'medium',
      onClick: onNewGoal || (() => console.log('New goal'))
    },
    {
      id: 'whatif',
      label: 'What-If Scenario',
      description: 'Explore financial outcomes',
      icon: Calculator,
      urgency: 'low',
      onClick: onWhatIfScenario || (() => console.log('What-if scenario'))
    },
    {
      id: 'crisis',
      label: 'Crisis Drill',
      description: 'Test financial resilience',
      icon: AlertTriangle,
      urgency: 'high',
      onClick: onCrisisDrill || (() => console.log('Crisis drill'))
    },
    {
      id: 'ai',
      label: 'AI Chat',
      description: 'Get personalized advice',
      icon: MessageSquare,
      urgency: 'medium',
      onClick: onAIChat || (() => console.log('AI chat'))
    }
  ];

  const getUrgencyColor = (urgency: ActionOption['urgency']) => {
    switch (urgency) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-primary';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-50 transition-all duration-500",
      isVisible ? "animate-scale-in" : "animate-scale-out",
      className
    )}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className={cn(
              "rounded-full w-16 h-16 shadow-glow bg-gradient-primary hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)]",
              "animate-pulse hover:animate-none transition-all duration-300"
            )}
          >
            <Zap className="w-6 h-6" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          side="top" 
          className="w-72 p-2 bg-background-card/95 backdrop-blur-sm border-primary/20"
          sideOffset={10}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 border-b border-border/50">
              <h3 className="font-semibold text-sm">Simulate</h3>
              <p className="text-xs text-muted-foreground">
                Choose your next financial action
              </p>
            </div>
            
            {actionOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    option.onClick();
                    setOpen(false);
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted/50",
                    option.urgency === 'high' && "bg-destructive/10",
                    option.urgency === 'medium' && "bg-warning/10"
                  )}>
                    <Icon className={cn("w-4 h-4", getUrgencyColor(option.urgency))} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  
                  {option.urgency === 'high' && (
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};