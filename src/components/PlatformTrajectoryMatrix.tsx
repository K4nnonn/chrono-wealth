import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Calendar, EyeOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FanChart from './FanChart';
import { runMonteCarloSimulation } from '@/lib/financialCalculations';
import { TimeHorizon, eventBus, EVENTS } from '@/lib/eventBus';
import { cn } from '@/lib/utils';

interface BehavioralMarker {
  month: number;
  event: string;
  impact: number;
}

interface PlatformTrajectoryMatrixProps {
  timeHorizon: TimeHorizon;
  onTimeHorizonChange: (horizon: TimeHorizon) => void;
  className?: string;
}

export const PlatformTrajectoryMatrix: React.FC<PlatformTrajectoryMatrixProps> = ({
  timeHorizon,
  onTimeHorizonChange,
  className
}) => {
  const [fanChartData, setFanChartData] = useState<{
    p10: number[];
    p50: number[];
    p90: number[];
  }>({ p10: [], p50: [], p90: [] });

  const [showConfidenceBand, setShowConfidenceBand] = useState(false);
  const [behavioralMarkers] = useState<BehavioralMarker[]>([
    { month: 6, event: 'Cancelled gym membership', impact: 0.02 },
    { month: 18, event: 'Started meal prep habit', impact: 0.15 },
    { month: 30, event: 'Switched to high-yield savings', impact: 0.08 }
  ]);

  // Sample financial parameters
  const initialValue = 50000;
  const monthlyContribution = 2600;
  const expectedReturn = 0.07;
  const volatility = 0.15;

  useEffect(() => {
    // Listen for time propagation events
    const handleTimePropagation = (horizon: TimeHorizon) => {
      onTimeHorizonChange(horizon);
    };

    eventBus.on(EVENTS.PROPAGATE_TIME, handleTimePropagation);
    return () => eventBus.off(EVENTS.PROPAGATE_TIME, handleTimePropagation);
  }, [onTimeHorizonChange]);

  useEffect(() => {
    // Recalculate Monte Carlo simulation when horizon changes
    const months = timeHorizon * 12;
    const simulation = runMonteCarloSimulation(
      initialValue,
      monthlyContribution,
      expectedReturn,
      volatility,
      months,
      5000
    );
    setFanChartData(simulation);
  }, [timeHorizon]);

  const handleHorizonChange = (horizon: TimeHorizon) => {
    onTimeHorizonChange(horizon);
    // Emit global time propagation event
    eventBus.emit(EVENTS.PROPAGATE_TIME, horizon);
  };

  const getMarkerPosition = (month: number) => {
    const totalMonths = timeHorizon * 12;
    return (month / totalMonths) * 100;
  };

  const probabilities = {
    p10: Math.round(fanChartData.p10[fanChartData.p10.length - 1] || 0),
    p50: Math.round(fanChartData.p50[fanChartData.p50.length - 1] || 0),
    p90: Math.round(fanChartData.p90[fanChartData.p90.length - 1] || 0)
  };

  return (
    <TooltipProvider>
      <Card 
        className={cn(
          'w-full max-w-[720px] bg-white rounded-xl p-7 shadow-[0_0_12px_rgba(0,0,0,0.04)]',
          className
        )} 
        data-testid="trajectory-matrix"
      >
        {/* Headline Row */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[22px] font-bold text-navy leading-none">
            Trajectory Matrix
          </h3>
          
          {/* Horizon Selector - Segmented Pills */}
          <div className="flex bg-[#F0F4F7] rounded-lg p-1" role="tablist">
            {([1, 3, 5, 10] as TimeHorizon[]).map((horizon) => (
              <button
                key={horizon}
                role="tab"
                aria-selected={timeHorizon === horizon}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-md transition-all duration-200',
                  timeHorizon === horizon 
                    ? 'bg-navy text-white' 
                    : 'hover:bg-[#D8E1E8] text-navy'
                )}
                onClick={() => handleHorizonChange(horizon)}
              >
                {horizon}Y
              </button>
            ))}
          </div>
        </div>

        {/* Insight Banner - mint 20% opacity */}
        <div className="flex items-start gap-3 p-3 mb-5 rounded-l-xl rounded-r border-l-4 border-mint h-10 items-center" style={{background: '#2ED3A133'}}>
          <span className="text-xl flex-shrink-0">⚡</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy">
              Changing grocery habits last quarter shaved 8 months off your {timeHorizon}-year goal.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-6 text-xs px-2">
              Show math
            </Button>
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
              Got it
            </Button>
          </div>
        </div>

        {/* Chart Block */}
        <div className="relative mb-5">
          <div className="flex justify-center">
            <FanChart
              data={fanChartData}
              width={640}
              height={280}
              showConfidenceBand={showConfidenceBand}
              className="chart-block"
            />
          </div>
          
          {/* Behavioral Markers */}
          {behavioralMarkers
            .filter(marker => marker.month <= timeHorizon * 12)
            .map((marker, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="absolute top-4 w-6 h-6 rounded-full bg-[#001B82] text-white flex items-center justify-center text-xs font-bold shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-navy"
                      style={{ left: `${getMarkerPosition(marker.month)}%`, transform: 'translateX(-50%)', width: '24px', height: '24px' }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          // Tooltip will show on focus
                        }
                      }}
                    >
                      ✦
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="w-[200px] bg-navy text-white p-3 rounded shadow-[0_4px_8px_rgba(0,0,0,0.15)] relative"
                    sideOffset={8}
                  >
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-navy rotate-45"></div>
                    <div className="font-bold text-xs mb-1" style={{fontWeight: 600}}>{marker.event}</div>
                    <div className="text-xs">Impact: {marker.impact > 0 ? '+' : ''}{(marker.impact * 100).toFixed(1)}%</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

          {/* Micro-copy Caption */}
          <div className="absolute bottom-2 right-2 text-xs italic text-[#67728A]">
            Hatched zone = change you control
          </div>
        </div>

        {/* Confidence Band Toggle */}
        <div className="flex items-center justify-between mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-7 h-7 rounded-full bg-[#F0F4F7] hover:bg-[#D8E1E8] flex items-center justify-center transition-colors"
                  onClick={() => {
                    setShowConfidenceBand(!showConfidenceBand);
                    // Toggle band opacity only, keep median line visible
                    const fanBands = document.querySelectorAll('.fanBand, .hatchBand');
                    fanBands.forEach(band => {
                      (band as HTMLElement).style.opacity = showConfidenceBand ? '0' : '1';
                    });
                  }}
                  role="button"
                  aria-pressed={showConfidenceBand}
                >
                  {showConfidenceBand ? (
                    <Eye className="w-4 h-4 text-navy" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-navy" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show/Hide Variance Bands</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {showConfidenceBand && (
            <div className="text-xs text-navy/60" role="status" aria-live="polite">
              Inner band shows variance from user-controlled actions only
            </div>
          )}
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            className="text-center p-3 bg-[#FAFAFC] border border-[#E5E9F0] rounded-lg cursor-pointer transition-all hover:shadow-md group"
            onMouseEnter={() => {/* Highlight P10 band */}}
            onMouseLeave={() => {/* Remove highlight */}}
          >
            <div className="text-sm font-normal text-[#67728A] mb-1">Conservative (P10)</div>
            <div className="text-2xl font-bold text-[#F86C6B]">
              ${probabilities.p10.toLocaleString()}
            </div>
          </div>
          
          <div 
            className="text-center p-3 bg-[#FAFAFC] border border-[#E5E9F0] rounded-lg cursor-pointer transition-all hover:shadow-md group"
            onMouseEnter={() => {/* Highlight P50 line */}}
            onMouseLeave={() => {/* Remove highlight */}}
          >
            <div className="text-sm font-normal text-[#67728A] mb-1">Expected (P50)</div>
            <div className="text-2xl font-bold text-navy">
              ${probabilities.p50.toLocaleString()}
            </div>
          </div>
          
          <div 
            className="text-center p-3 bg-[#FAFAFC] border border-[#E5E9F0] rounded-lg cursor-pointer transition-all hover:shadow-md group"
            onMouseEnter={() => {/* Highlight P90 band */}}
            onMouseLeave={() => {/* Remove highlight */}}
          >
            <div className="text-sm font-normal text-[#67728A] mb-1">Optimistic (P90)</div>
            <div className="text-2xl font-bold text-mint">
              ${probabilities.p90.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default PlatformTrajectoryMatrix;