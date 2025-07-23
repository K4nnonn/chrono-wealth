import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  DollarSign,
  Shield,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  icon?: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
  trend?: 'up' | 'down' | 'stable';
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  confidence,
  icon: Icon = DollarSign,
  variant = 'default',
  className,
  trend,
  subtitle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-gradient-to-br from-success/5 to-success/10 hover:from-success/10 hover:to-success/15';
      case 'warning':
        return 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10 hover:from-warning/10 hover:to-warning/15';
      case 'destructive':
        return 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10 hover:from-destructive/10 hover:to-destructive/15';
      default:
        return 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15';
    }
  };

  const getChangeStyles = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpRight className="w-3 h-3" />;
    if (trend === 'down') return <ArrowDownRight className="w-3 h-3" />;
    return null;
  };

  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-card hover-lift border',
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {confidence && (
            <Badge variant="outline" className="text-xs px-2">
              {confidence}% confidence
            </Badge>
          )}
          <Icon className={cn(
            "h-4 w-4",
            variant === 'success' ? 'text-success' :
            variant === 'warning' ? 'text-warning' :
            variant === 'destructive' ? 'text-destructive' :
            'text-primary'
          )} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {getTrendIcon()}
          </div>
          
          {(change || subtitle) && (
            <div className="flex items-center justify-between">
              {change && (
                <p className={cn("text-xs flex items-center gap-1", getChangeStyles())}>
                  {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                  {changeType === 'negative' && <TrendingDown className="w-3 h-3" />}
                  {change}
                </p>
              )}
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface StatusCardProps {
  title: string;
  description: string;
  status: 'healthy' | 'warning' | 'critical' | 'info';
  progress?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  description,
  status,
  progress,
  action,
  className,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          icon: CheckCircle,
          variant: 'success' as const,
          iconColor: 'text-success',
          bgColor: 'bg-success/10 border-success/20',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          variant: 'warning' as const,
          iconColor: 'text-warning',
          bgColor: 'bg-warning/10 border-warning/20',
        };
      case 'critical':
        return {
          icon: AlertTriangle,
          variant: 'destructive' as const,
          iconColor: 'text-destructive',
          bgColor: 'bg-destructive/10 border-destructive/20',
        };
      default:
        return {
          icon: Info,
          variant: 'default' as const,
          iconColor: 'text-primary',
          bgColor: 'bg-primary/10 border-primary/20',
        };
    }
  };

  const { icon: Icon, variant, iconColor, bgColor } = getStatusConfig();

  return (
    <Card className={cn('border transition-all duration-300 hover:shadow-card', bgColor, className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn('p-2 rounded-lg bg-background/50', iconColor)}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="space-y-1 flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      {(progress !== undefined || action) && (
        <CardContent className="pt-0">
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {action && (
            <div className="mt-4">
              <Button
                variant={variant === 'default' ? 'default' : 'outline'}
                size="sm"
                onClick={action.onClick}
                className="w-full"
              >
                {action.label}
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  isComingSoon?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  features,
  isComingSoon = false,
  onClick,
  className,
}) => {
  return (
    <Card className={cn(
      'transition-all duration-300 border hover:shadow-elegant cursor-pointer group',
      'hover:border-primary/30 hover-lift',
      isComingSoon && 'opacity-75',
      className
    )} onClick={onClick}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-primary shadow-glow group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {title}
              {isComingSoon && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Coming Soon
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

interface InsightCardProps {
  title: string;
  insight: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  insight,
  impact,
  category,
  action,
  className,
}) => {
  const getImpactConfig = () => {
    switch (impact) {
      case 'high':
        return {
          color: 'text-destructive',
          bg: 'bg-destructive/10',
          border: 'border-destructive/20',
          badge: 'destructive' as const,
        };
      case 'medium':
        return {
          color: 'text-warning',
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          badge: 'secondary' as const,
        };
      default:
        return {
          color: 'text-success',
          bg: 'bg-success/10',
          border: 'border-success/20',
          badge: 'outline' as const,
        };
    }
  };

  const { color, bg, border, badge } = getImpactConfig();

  return (
    <Card className={cn('border transition-all duration-300 hover:shadow-card', border, bg, className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={badge} className="text-xs">
                {impact.toUpperCase()} IMPACT
              </Badge>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-xs text-muted-foreground">{category}</span>
            </div>
          </div>
          <Zap className={cn('w-4 h-4', color)} />
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{insight}</p>
        
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="w-full"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};