import React from 'react';
import { cn } from '@/lib/utils';

interface PlatformGaugeProps {
  value: number;
  max: number;
  label: string;
  accentColor: 'mint' | 'rose' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PlatformGauge: React.FC<PlatformGaugeProps> = ({
  value,
  max,
  label,
  accentColor,
  size = 'md',
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = size === 'sm' ? 50 : size === 'md' ? 75 : 100;
  const strokeWidth = size === 'sm' ? 8 : size === 'md' ? 10 : 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getAccentColor = () => {
    switch (accentColor) {
      case 'mint': return 'var(--color-mint)';
      case 'rose': return 'var(--color-rose)';
      case 'navy': return 'var(--color-navy)';
    }
  };

  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="var(--color-navy)"
            strokeOpacity="0.1"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          
          {/* Progress circle */}
          <circle
            className="gauge-needle transition-platform"
            stroke={getAccentColor()}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-navy">
            {Math.round(percentage)}%
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformGauge;