import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InsightData } from '@/lib/eventBus';

interface PlatformInsightMarqueeProps {
  insights: InsightData[];
  className?: string;
}

export const PlatformInsightMarquee: React.FC<PlatformInsightMarqueeProps> = ({
  insights,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Filter for top 2 most significant insights
  const topInsights = insights
    .sort((a, b) => b.significance - a.significance)
    .slice(0, 2);

  useEffect(() => {
    if (topInsights.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % topInsights.length);
        setIsAnimating(false);
      }, 200);
    }, 4000);

    return () => clearInterval(interval);
  }, [topInsights.length]);

  if (!topInsights.length) return null;

  const currentInsight = topInsights[currentIndex];

  const getInsightColor = () => {
    switch (currentInsight.polarity) {
      case 'positive': return 'text-mint';
      case 'negative': return 'text-rose';
      default: return 'text-navy';
    }
  };

  const getInsightIcon = () => {
    switch (currentInsight.polarity) {
      case 'positive': return '↗';
      case 'negative': return '↘';
      default: return '→';
    }
  };

  return (
    <div 
      className={cn(
        'w-full h-16 bg-background border-b border-border flex items-center justify-center px-6',
        'shadow-platform',
        className
      )}
      data-testid="insight-marquee"
    >
      <div className={cn(
        'flex items-center gap-3 transition-platform',
        isAnimating && 'opacity-50 transform translate-y-1'
      )}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-navy" />
          </div>
          <span className="text-xs font-medium text-navy/70 uppercase tracking-wide">
            Insight #{currentIndex + 1}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn('text-2xl', getInsightColor())}>
            {getInsightIcon()}
          </span>
          <span className="text-sm font-medium text-navy max-w-2xl truncate">
            {currentInsight.text}
          </span>
        </div>

        <button 
          className="flex items-center gap-1 text-xs text-navy/60 hover:text-navy transition-colors"
          onClick={() => {/* Handle explain click */}}
        >
          <span>Explain</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Progress dots */}
      {topInsights.length > 1 && (
        <div className="absolute right-6 flex gap-1">
          {topInsights.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                index === currentIndex ? 'bg-navy' : 'bg-navy/20'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlatformInsightMarquee;