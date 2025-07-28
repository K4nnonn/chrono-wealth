import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, Edit2, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface GoalPillProps {
  title: string;
  target: string;
  progress: number;
  deadline?: string;
  status: "active" | "paused" | "completed" | "missed";
  icon?: LucideIcon;
  onClick?: () => void;
  onEdit?: () => void;
  className?: string;
}

const statusConfig = {
  active: {
    color: "bg-primary",
    icon: Clock,
    textColor: "text-primary"
  },
  paused: {
    color: "bg-muted",
    icon: Clock,
    textColor: "text-muted-foreground"
  },
  completed: {
    color: "bg-accent-success",
    icon: CheckCircle2,
    textColor: "text-accent-success"
  },
  missed: {
    color: "bg-destructive",
    icon: AlertCircle,
    textColor: "text-destructive-foreground"
  }
};

const GoalPill = ({
  title,
  target,
  progress,
  deadline,
  status,
  icon: CustomIcon,
  onClick,
  onEdit,
  className
}: GoalPillProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const DisplayIcon = CustomIcon || StatusIcon;

  return (
    <div className={cn(
      "group relative bg-card border rounded-xl p-4 hover:shadow-card transition-all duration-300 cursor-pointer",
      status === "completed" && "bg-gradient-success",
      className
    )} onClick={onClick}>
      
      {/* Progress Ring Background */}
      <div className="absolute -top-2 -right-2 w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-muted/30"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
            className={config.textColor}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="space-y-3 pr-12">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            config.color
          )}>
            <DisplayIcon className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{title}</h3>
            <p className="text-xs text-muted-foreground">{target}</p>
          </div>
        </div>

        {/* Status Badge and Deadline */}
        <div className="flex items-center justify-between">
          <Badge variant={status === "active" ? "default" : "secondary"} className="text-xs">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          
          {deadline && (
            <span className="text-xs text-muted-foreground">{deadline}</span>
          )}
        </div>
      </div>

      {/* Edit Button */}
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

export default GoalPill;