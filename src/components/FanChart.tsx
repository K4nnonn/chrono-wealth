import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface FanChartProps {
  data: {
    p10: number[];
    p50: number[];
    p90: number[];
  };
  width?: number;
  height?: number;
  showConfidenceBand?: boolean;
  className?: string;
}

export const FanChart: React.FC<FanChartProps> = ({
  data,
  width = 640,
  height = 280,
  showConfidenceBand = true,
  className
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.p10.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Margins for 640x280 chart block
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, data.p10.length - 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([
        Math.min(...data.p10) * 0.95,
        Math.max(...data.p90) * 1.05
      ])
      .range([innerHeight, 0]);

    // Create defs for gradients and patterns
    const defs = svg.append('defs');

    // Fan gradient (mint #2ED3A1 28% → 10%)
    const fanGradient = defs.append('linearGradient')
      .attr('id', 'fan-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    fanGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#2ED3A1')
      .attr('stop-opacity', 0.28);

    fanGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#2ED3A1')
      .attr('stop-opacity', 0.10);

    // Hatch pattern for user-controlled variance (45° white hatch, 6px spacing, 15% opacity)
    const hatchPattern = defs.append('pattern')
      .attr('id', 'hatch-pattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 6)
      .attr('height', 6)
      .attr('patternTransform', 'rotate(45)');

    hatchPattern.append('rect')
      .attr('width', 6)
      .attr('height', 6)
      .attr('fill', 'transparent');

    hatchPattern.append('line')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', 0).attr('y2', 6)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('opacity', 0.15);

    // Fade-out mask on band edges (first & last 30px)
    const fadeGradient = defs.append('linearGradient')
      .attr('id', 'fade-gradient')
      .attr('x1', '0%').attr('x2', '100%');

    const fadePixels = 30;
    const fadePercentStart = (fadePixels / innerWidth) * 100;
    const fadePercentEnd = 100 - fadePercentStart;

    fadeGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-opacity', 0);

    fadeGradient.append('stop')
      .attr('offset', `${fadePercentStart}%`)
      .attr('stop-opacity', 1);

    fadeGradient.append('stop')
      .attr('offset', `${fadePercentEnd}%`)
      .attr('stop-opacity', 1);

    fadeGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-opacity', 0);

    // Create fade mask
    defs.append('mask')
      .attr('id', 'fade-mask')
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'url(#fade-gradient)');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid lines (4% opacity, z-index below fan fill)
    const yTicks = yScale.ticks(6);
    const xTicks = d3.range(0, data.p10.length, Math.ceil(data.p10.length / 5));
    
    yTicks.forEach(tick => {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(tick))
        .attr('y2', yScale(tick))
        .attr('stroke', 'rgba(0,0,0,0.04)')
        .attr('stroke-width', 1);
    });

    xTicks.forEach(tick => {
      g.append('line')
        .attr('x1', xScale(tick))
        .attr('x2', xScale(tick))
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', 'rgba(0,0,0,0.04)')
        .attr('stroke-width', 1);
    });

    // Create area generators with non-linear curvature (compounding)
    const fanArea = d3.area<number>()
      .x((d, i) => xScale(i))
      .y0((d, i) => yScale(data.p10[i]))
      .y1((d, i) => yScale(data.p90[i]))
      .curve(d3.curveCardinal.tension(0.2)); // Non-linear curvature

    // Draw P10-P90 fan band with fade mask
    const fanBand = g.append('path')
      .datum(data.p50)
      .attr('class', 'fanBand')
      .attr('fill', 'url(#fan-gradient)')
      .attr('mask', 'url(#fade-mask)')
      .attr('stroke', 'none')
      .attr('d', fanArea)
      .style('opacity', showConfidenceBand ? 1 : 0);

    // Hatched inner band (25% width around median for user-controlled variance)
    const behaviorArea = d3.area<number>()
      .x((d, i) => xScale(i))
      .y0((d, i) => {
        const range = data.p90[i] - data.p10[i];
        return yScale(data.p50[i] - range * 0.125); // 25% of range / 2
      })
      .y1((d, i) => {
        const range = data.p90[i] - data.p10[i];
        return yScale(data.p50[i] + range * 0.125); // 25% of range / 2
      })
      .curve(d3.curveCardinal.tension(0.2));

    const hatchBand = g.append('path')
      .datum(data.p50)
      .attr('class', 'hatchBand')
      .attr('fill', 'url(#hatch-pattern)')
      .attr('stroke', 'none')
      .attr('d', behaviorArea)
      .style('opacity', showConfidenceBand ? 1 : 0);

    // Draw median line (P50) - navy (#0E1D47) 2px
    const line = d3.line<number>()
      .x((d, i) => xScale(i))
      .y((d, i) => yScale(data.p50[i]))
      .curve(d3.curveCardinal.tension(0.2)); // Non-linear curvature for compounding

    const medianPath = g.append('path')
      .datum(data.p50)
      .attr('fill', 'none')
      .attr('stroke', '#0E1D47')
      .attr('stroke-width', 2)
      .attr('d', line);

    // X-axis with custom labels
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`);

    xTicks.forEach(tick => {
      xAxis.append('text')
        .attr('x', xScale(tick))
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Inter')
        .attr('font-size', '12px')
        .attr('font-weight', '400')
        .attr('fill', '#67728A')
        .text(tick === 0 ? 'Now' : `${Math.ceil(tick / 12)}Y`);
    });

    // Y-axis with nice increments
    const yAxis = g.append('g');
    
    yTicks.forEach(tick => {
      // Tick lines extending inward only
      yAxis.append('line')
        .attr('x1', 0)
        .attr('x2', 3)
        .attr('y1', yScale(tick))
        .attr('y2', yScale(tick))
        .attr('stroke', '#67728A')
        .attr('stroke-width', 1);

      // Tick labels
      yAxis.append('text')
        .attr('x', -10)
        .attr('y', yScale(tick))
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('font-family', 'Inter')
        .attr('font-size', '12px')
        .attr('font-weight', '400')
        .attr('fill', '#67728A')
        .text(d3.format('$,.0f')(tick));
    });

    // Animation: fan band clipPath height 0→100% over 600ms ease-out-cubic
    fanBand
      .style('clip-path', 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)')
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .style('clip-path', 'polygon(0 100%, 100% 100%, 100% 0%, 0 0%)');

    hatchBand
      .style('clip-path', 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)')
      .transition()
      .delay(200)
      .duration(600)
      .ease(d3.easeCubicOut)
      .style('clip-path', 'polygon(0 100%, 100% 100%, 100% 0%, 0 0%)');

    // Animate median line drawing with stroke-dasharray
    const totalLength = medianPath.node()?.getTotalLength() || 0;
    medianPath
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .delay(400)
      .duration(800)
      .ease(d3.easeQuadOut)
      .attr('stroke-dashoffset', 0);

  }, [data, width, height, showConfidenceBand]);

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
        role="img"
        aria-label={`Fan chart of projected net worth from $${data.p50[0]?.toLocaleString() || '50k'} today to median $${data.p50[data.p50.length - 1]?.toLocaleString() || '85k'} in ${Math.ceil((data.p50.length - 1) / 12)} years, inner band shows impact of personal habits, outer band includes market factors.`}
      />
    </div>
  );
};

export default FanChart;