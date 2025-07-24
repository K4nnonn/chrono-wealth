import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Calendar } from 'lucide-react';
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
    <Card className={cn('shadow-platform', className)} data-testid="trajectory-matrix">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-navy">
            <Eye className="w-5 h-5" />
            Trajectory Matrix
          </CardTitle>
          
          {/* Time-Lens Dial */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-navy/60">Horizon:</span>
            <div className="flex rounded-lg bg-muted p-1">
              {([1, 3, 5, 10] as TimeHorizon[]).map((horizon) => (
                <Button
                  key={horizon}
                  variant={timeHorizon === horizon ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    'h-6 px-3 text-xs transition-platform',
                    timeHorizon === horizon && 'bg-navy text-white shadow-none'
                  )}
                  onClick={() => handleHorizonChange(horizon)}
                >
                  {horizon}Y
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Insight Banner */}
        <div className="flex items-start gap-3 p-3 bg-mint/10 border border-mint/20 rounded-lg">
          <TrendingUp className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-navy">
              ⚡ Changing grocery habits last quarter shaved 8 months off your {timeHorizon}-year goal.
            </p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="h-6 text-xs">
                Show math
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                Got it
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Multi-Scenario Bands */}
        <div className="relative">
          <FanChart
            data={fanChartData}
            width={920}
            height={400}
            className="w-full"
          />
          
          {/* Behavioral Markers */}
          {behavioralMarkers
            .filter(marker => marker.month <= timeHorizon * 12)
            .map((marker, index) => (
              <div
                key={index}
                className="absolute top-4"
                style={{ left: `${getMarkerPosition(marker.month)}%` }}
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">
                    ✦
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 p-2 bg-navy text-white text-xs rounded shadow-lg">
                    <div className="font-medium">{marker.event}</div>
                    <div className="text-navy/70">
                      Impact: {marker.impact > 0 ? '+' : ''}{(marker.impact * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Confidence Ribbon Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setShowConfidenceBand(!showConfidenceBand)}
          >
            <Calendar className="w-3 h-3 mr-1" />
            {showConfidenceBand ? 'Hide' : 'Show'} Confidence Band
          </Button>
          
          {showConfidenceBand && (
            <div className="text-xs text-navy/60">
              Inner band shows variance from user-controlled actions only
            </div>
          )}
        </div>

        {/* Scenario Outcomes */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-rose/10 border border-rose/20 rounded-lg">
            <div className="text-xs text-rose/70 font-medium">Conservative (P10)</div>
            <div className="text-lg font-bold text-rose">
              ${probabilities.p10.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center p-3 bg-navy/10 border border-navy/20 rounded-lg">
            <div className="text-xs text-navy/70 font-medium">Expected (P50)</div>
            <div className="text-lg font-bold text-navy">
              ${probabilities.p50.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center p-3 bg-mint/10 border border-mint/20 rounded-lg">
            <div className="text-xs text-mint/70 font-medium">Optimistic (P90)</div>
            <div className="text-lg font-bold text-mint">
              ${probabilities.p90.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformTrajectoryMatrix;