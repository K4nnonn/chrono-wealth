import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Target, Bot, AlertTriangle, TrendingUp, X } from "lucide-react";

interface QuickActionFabProps {
  onSimulate?: () => void;
  onAddGoal?: () => void;
  onOpenAI?: () => void;
  onCrisisMode?: () => void;
  className?: string;
}

export const QuickActionFab = ({
  onSimulate,
  onAddGoal,
  onOpenAI,
  onCrisisMode,
  className
}: QuickActionFabProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: TrendingUp,
      label: "Simulate",
      onClick: onSimulate,
      className: "bg-primary hover:bg-primary/90"
    },
    {
      icon: Target,
      label: "Add Goal",
      onClick: onAddGoal,
      className: "bg-accent hover:bg-accent/90"
    },
    {
      icon: Bot,
      label: "AI Assistant",
      onClick: onOpenAI,
      className: "bg-accent-success hover:bg-accent-success/90"
    },
    {
      icon: AlertTriangle,
      label: "Crisis Mode",
      onClick: onCrisisMode,
      className: "bg-warning hover:bg-warning/90"
    }
  ];

  return (
    <div className={cn("fixed bottom-6 right-6 flex flex-col-reverse items-end gap-3", className)}>
      {/* Action buttons */}
      {isOpen && (
        <div className="flex flex-col-reverse gap-3 animate-fade-in">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={action.label} className="flex items-center gap-3">
                <div className="bg-background-card border border-border rounded-lg px-3 py-2 shadow-lg">
                  <span className="text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                </div>
                <Button
                  size="lg"
                  className={cn(
                    "rounded-full w-14 h-14 shadow-glow",
                    action.className
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                >
                  <Icon className="w-6 h-6" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          "rounded-full w-16 h-16 shadow-glow transition-transform",
          isOpen ? "rotate-45 bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};