import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InsightData } from '@/lib/eventBus';

interface PlatformTileProps {
  id: string;
  label: string;
  value: string | number;
  variant: 'default' | 'mint' | 'rose' | 'cream';
  icon?: LucideIcon;
  subtitle?: string;
  insight?: InsightData;
  onShowMath?: () => void;
  onAcknowledgeInsight?: () => void;
  lastUpdated?: string;
  className?: string;
  children?: React.ReactNode;
}

export const PlatformTile: React.FC<PlatformTileProps> = ({
  id,
  label,
  value,
  variant,
  icon: Icon,
  subtitle,
  insight,
  onShowMath,
  onAcknowledgeInsight,
  lastUpdated,
  className,
  children
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'mint':
        return {
          background: 'bg-mint/10',
          border: 'border-mint/30',
          text: 'text-mint',
          insightBg: 'bg-mint'
        };
      case 'rose':
        return {
          background: 'bg-rose/10',
          border: 'border-rose/30',
          text: 'text-rose',
          insightBg: 'bg-rose'
        };
      case 'cream':
        return {
          background: 'bg-cream',
          border: 'border-cream',
          text: 'text-navy',
          insightBg: 'bg-navy'
        };
      default:
        return {
          background: 'bg-background',
          border: 'border-border',
          text: 'text-navy',
          insightBg: 'bg-navy'
        };
    }
  };

  const styles = getVariantStyles();
  const isStale = lastUpdated && new Date(lastUpdated) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  return (
    <Card 
      className={cn(
        'relative transition-platform shadow-platform',
        styles.background,
        styles.border,
        isStale && 'opacity-75',
        className
      )}
      data-testid={`platform-tile-${id}`}
    >
      {/* Insight Banner */}
      {insight && !insight.acknowledged && (
        <div className={cn(
          'absolute -top-2 left-4 right-4 h-8 rounded-md flex items-center justify-between px-3 text-white text-xs font-medium',
          insight.polarity === 'positive' ? 'bg-mint' : insight.polarity === 'negative' ? 'bg-rose' : 'bg-navy'
        )}>
          <span className="truncate">{insight.text}</span>
          <div className="flex gap-1 ml-2">
            {onShowMath && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-2 text-xs text-white hover:bg-white/20"
                onClick={onShowMath}
              >
                Show math
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs text-white hover:bg-white/20"
              onClick={onAcknowledgeInsight}
            >
              Got it
            </Button>
          </div>
        </div>
      )}

      <CardHeader className={cn('pb-3', insight && !insight.acknowledged && 'pt-8')}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn('text-sm font-medium', styles.text)}>
            {label}
          </CardTitle>
          {Icon && (
            <div className={cn(
              'p-2 rounded-lg',
              styles.background === 'bg-cream' ? 'bg-white/50' : 'bg-muted/50'
            )}>
              <Icon className={cn('w-4 h-4', styles.text)} />
            </div>
          )}
        </div>
        {isStale && (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-muted-foreground/50" />
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className={cn('text-2xl font-bold tracking-tight', styles.text)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {subtitle && (
            <div className="text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}

          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformTile;