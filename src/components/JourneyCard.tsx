import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  ChevronRight,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  title: string;
  amount: number;
  date: string;
  completed: boolean;
}

interface JourneyCardProps {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  milestones: Milestone[];
  onActionPlan?: (goalId: string) => void;
  className?: string;
}

export const JourneyCard = ({
  id,
  title,
  targetAmount,
  currentAmount,
  targetDate,
  category,
  riskLevel,
  milestones,
  onActionPlan,
  className
}: JourneyCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progress = (currentAmount / targetAmount) * 100;
  const remainingAmount = targetAmount - currentAmount;
  const remainingDays = Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low':
        return 'text-accent-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBg = () => {
    switch (riskLevel) {
      case 'low':
        return 'bg-accent-success/10 border-accent-success/20';
      case 'medium':
        return 'bg-warning/10 border-warning/20';
      case 'high':
        return 'bg-destructive/10 border-destructive/20';
      default:
        return 'bg-muted/10 border-muted/20';
    }
  };

  const completedMilestones = milestones.filter(m => m.completed).length;
  const nextMilestone = milestones.find(m => !m.completed);

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-glow cursor-pointer",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
          
          {/* Risk Dial */}
          <div className={cn(
            "w-12 h-12 rounded-full border-2 flex items-center justify-center",
            getRiskBg()
          )}>
            <div className={cn("w-2 h-2 rounded-full", getRiskColor().replace('text-', 'bg-'))} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">
              ${currentAmount.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              of ${targetAmount.toLocaleString()}
            </span>
          </div>
          
          <Progress value={progress} className="h-3" />
          
          <div className="flex justify-between text-sm">
            <span className="font-medium">{Math.round(progress)}% complete</span>
            <span className="text-muted-foreground">
              ${remainingAmount.toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Target Date</p>
              <p className="text-xs text-muted-foreground">
                {new Date(targetDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">
              {remainingDays > 0 ? `${remainingDays} days` : 'Overdue'}
            </p>
            <p className="text-xs text-muted-foreground">
              {remainingDays > 0 ? 'remaining' : 'past due'}
            </p>
          </div>
        </div>

        {/* Milestone Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Milestones</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-auto p-1"
            >
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                isExpanded && "rotate-90"
              )} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {completedMilestones} of {milestones.length} completed
            </span>
            {nextMilestone && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="font-medium">
                  Next: ${nextMilestone.amount.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Expanded Milestones */}
        {isExpanded && (
          <div className="space-y-2 animate-fade-in">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded border",
                  milestone.completed 
                    ? "bg-accent-success/5 border-accent-success/20" 
                    : "bg-muted/10 border-muted/20"
                )}
              >
                {milestone.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-accent-success flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    milestone.completed ? "text-accent-success" : "text-foreground"
                  )}>
                    {milestone.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${milestone.amount.toLocaleString()} • {new Date(milestone.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => onActionPlan?.(id)}
          className="w-full bg-gradient-primary hover:shadow-glow"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          AI Action Plan
        </Button>
      </CardContent>
    </Card>
  );
};