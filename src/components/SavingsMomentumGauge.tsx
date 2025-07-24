import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Sparkles } from 'lucide-react';

interface SavingsMomentumGaugeProps {
  momentum: number; // Current momentum value (-25 to +25)
  timeHorizon: number;
  className?: string;
}

export const SavingsMomentumGauge: React.FC<SavingsMomentumGaugeProps> = ({
  momentum,
  timeHorizon,
  className
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const size = 200;
    const margin = 20;
    const radius = (size - 2 * margin) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    // Create arc generator for gauge background
    const arc = d3.arc()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    // Background arc
    svg.append('path')
      .attr('d', arc as any)
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', '#E5E9F0')
      .attr('stroke', 'none');

    // Tick marks for scale
    const tickData = [-25, -12.5, 0, 12.5, 25];
    tickData.forEach(value => {
      const angle = (value / 25) * (Math.PI / 2);
      const x1 = centerX + (radius - 15) * Math.cos(angle);
      const y1 = centerY + (radius - 15) * Math.sin(angle);
      const x2 = centerX + (radius - 5) * Math.cos(angle);
      const y2 = centerY + (radius - 5) * Math.sin(angle);

      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#67728A')
        .attr('stroke-width', 1);
    });

    // Positive fill arc (mint) if momentum > 0
    if (momentum > 0) {
      const positiveArc = d3.arc()
        .innerRadius(radius - 10)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(Math.min(momentum / 25, 1) * (Math.PI / 2));

      svg.append('path')
        .attr('d', positiveArc as any)
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .attr('fill', '#2ED3A1')
        .attr('stroke', 'none');
    }

    // Needle
    const needleAngle = (momentum / 25) * (Math.PI / 2);
    const needleLength = radius - 20;
    const needleX = centerX + needleLength * Math.cos(needleAngle);
    const needleY = centerY + needleLength * Math.sin(needleAngle);

    svg.append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', needleX)
      .attr('y2', needleY)
      .attr('stroke', '#2ED3A1')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    // Center dot
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 4)
      .attr('fill', '#0E1D47');

  }, [momentum]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-accent-success" />
          Savings Momentum Gauge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-accent-success/10 border border-accent-success/20 rounded-lg">
          <Sparkles className="w-4 h-4 text-accent-success flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">⏱️ You save mostly in salary-deposit week—what if we automated transfers to the 1st?</p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="h-6 text-xs">Show math</Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs">Got it</Button>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <svg
            ref={svgRef}
            width={200}
            height={200}
            className="mx-auto mb-4"
            role="img"
            aria-label={`Savings momentum gauge showing ${momentum.toFixed(1)}% momentum`}
          />
          
          <div className="text-5xl font-bold text-accent-success mb-2">
            {Math.abs(momentum).toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">
            Current 30-day rate
          </div>
          <div className="mt-4 text-xs italic font-medium text-[#67728A]">
            Pattern: "Back-Half Saver" — surplus appears in last 10 days
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsMomentumGauge;