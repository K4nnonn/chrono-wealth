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
  className?: string;
}

export const FanChart: React.FC<FanChartProps> = ({
  data,
  width = 680,
  height = 280,
  className
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.p10.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([0, data.p10.length - 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([
        Math.min(...data.p10) * 0.95,
        Math.max(...data.p90) * 1.05
      ])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create area generator for P10-P90 band
    const area = d3.area<number>()
      .x((d, i) => xScale(i))
      .y0((d, i) => yScale(data.p10[i]))
      .y1((d, i) => yScale(data.p90[i]))
      .curve(d3.curveMonotoneX);

    // Add gradient definition
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'fan-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', 0).attr('y2', innerHeight);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'var(--color-navy)')
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'var(--color-mint)')
      .attr('stop-opacity', 0.6);

    // Draw P10-P90 band
    g.append('path')
      .datum(data.p50)
      .attr('class', 'fan-chart-gradient')
      .attr('fill', 'url(#fan-gradient)')
      .attr('stroke', 'none')
      .attr('d', area);

    // Draw median line (P50)
    const line = d3.line<number>()
      .x((d, i) => xScale(i))
      .y((d, i) => yScale(data.p50[i]))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data.p50)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-navy)')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d => `${d}Y`)
        .tickSize(-innerHeight)
      )
      .selectAll('line')
      .attr('stroke', 'var(--color-navy)')
      .attr('stroke-opacity', 0.1);

    g.append('g')
      .call(d3.axisLeft(yScale)
        .tickFormat(d3.format('$,.0f'))
        .tickSize(-innerWidth)
      )
      .selectAll('line')
      .attr('stroke', 'var(--color-navy)')
      .attr('stroke-opacity', 0.1);

    // Style axes text
    g.selectAll('.tick text')
      .attr('fill', 'var(--color-navy)')
      .attr('font-size', '12px')
      .attr('font-family', 'Inter');

  }, [data, width, height]);

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />
    </div>
  );
};

export default FanChart;