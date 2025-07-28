import { useState, useEffect, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { computeWhatIf, FinancialProfile } from '@/lib/fhss-calculator';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WhatIfSliderProps {
  metric: keyof FinancialProfile;
  label: string;
  baseProfile: FinancialProfile;
  onScoreChange?: (newScore: number, impact: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export const WhatIfSlider = ({
  metric,
  label,
  baseProfile,
  onScoreChange,
  min = 0,
  max = 10000,
  step = 50,
  formatValue = (value: number) => `$${value.toLocaleString()}`,
  className = ''
}: WhatIfSliderProps) => {
  const baseValue = baseProfile[metric] as number;
  const [currentValue, setCurrentValue] = useState(baseValue);
  
  // Debounced calculation to avoid excessive computation
  const [debouncedValue, setDebouncedValue] = useState(baseValue);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(currentValue);
    }, 250);
    
    return () => clearTimeout(timer);
  }, [currentValue]);
  
  // Calculate impact when debounced value changes
  const { modified, impact } = useMemo(() => {
    if (debouncedValue === baseValue) {
      return { 
        modified: { fhss: 0, subScores: {}, confidence: 0, ci95: [0, 0], segment: '', recommendations: [], criticalIssues: [] }, 
        impact: 0 
      };
    }
    
    const changes = { [metric]: debouncedValue };
    return computeWhatIf(baseProfile, changes);
  }, [baseProfile, metric, debouncedValue, baseValue]);
  
  useEffect(() => {
    if (onScoreChange && debouncedValue !== baseValue) {
      onScoreChange(modified.fhss, impact);
    }
  }, [modified.fhss, impact, onScoreChange, debouncedValue, baseValue]);
  
  const handleValueChange = (newValue: number[]) => {
    setCurrentValue(newValue[0]);
  };
  
  const resetToBase = () => {
    setCurrentValue(baseValue);
  };
  
  const getImpactIcon = () => {
    if (Math.abs(impact) < 0.01) return <Minus className="w-4 h-4" />;
    return impact > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };
  
  const getImpactColor = () => {
    if (Math.abs(impact) < 0.01) return 'text-muted-foreground';
    return impact > 0 ? 'text-accent-success' : 'text-destructive';
  };
  
  const getImpactBadgeVariant = () => {
    if (Math.abs(impact) < 0.01) return 'secondary';
    return impact > 0 ? 'default' : 'destructive';
  };

  return (
    <Card className={`p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {currentValue !== baseValue && (
          <button
            onClick={resetToBase}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        <Slider
          value={[currentValue]}
          onValueChange={handleValueChange}
          max={max}
          min={min}
          step={step}
          className="w-full"
        />
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">
            {formatValue(currentValue)}
          </div>
          
          {debouncedValue !== baseValue && (
            <Badge 
              variant={getImpactBadgeVariant()}
              className="flex items-center gap-1"
            >
              <span className={getImpactColor()}>
                {getImpactIcon()}
              </span>
              <span>
                {impact > 0 ? '+' : ''}{(impact * 100).toFixed(1)}%
              </span>
            </Badge>
          )}
        </div>
        
        {debouncedValue !== baseValue && (
          <div className="text-xs text-muted-foreground">
            Change from baseline: {formatValue(currentValue - baseValue)}
          </div>
        )}
      </div>
    </Card>
  );
};