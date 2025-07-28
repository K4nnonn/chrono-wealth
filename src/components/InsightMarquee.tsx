import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Activity, 
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Clock,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightMarqueeProps {
  insights: Array<{
    id: string;
    text: string;
    significance: number;
    icon: React.ElementType;
  }>;
}

export const InsightMarquee = ({ insights }: InsightMarqueeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [insights.length]);

  const currentInsight = insights[currentIndex];
  if (!currentInsight) return null;

  const Icon = currentInsight.icon;

  return (
    <div className="bg-gradient-to-r from-accent-teal/10 via-primary/5 to-accent-coral/10 border-y border-border/50 py-3">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-accent-teal animate-pulse" />
              <Badge variant="outline" className="text-xs font-medium">
                Insight #{currentIndex + 1}
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground animate-fade-in">
              {currentInsight.text}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {insights.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    index === currentIndex 
                      ? "bg-primary scale-125" 
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Explain
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};