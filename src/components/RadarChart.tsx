import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FHSSSubScores } from '@/lib/fhss-calculator';

interface RadarChartProps {
  data: FHSSSubScores;
  width?: number;
  height?: number;
  className?: string;
}

export const RadarChart = ({ data, width = 300, height = 300, className = '' }: RadarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    const centerX = width / 2;
    const centerY = height / 2;

    // Prepare data
    const axes = [
      { name: 'Liquidity', key: 'liquidity', angle: 0 },
      { name: 'Debt Health', key: 'debt', angle: Math.PI / 3 },
      { name: 'Savings Rate', key: 'savings', angle: (2 * Math.PI) / 3 },
      { name: 'Income Stability', key: 'incomeStability', angle: Math.PI },
      { name: 'Expense Control', key: 'expensePredictability', angle: (4 * Math.PI) / 3 },
      { name: 'Growth Potential', key: 'growth', angle: (5 * Math.PI) / 3 }
    ];

    // Create scales
    const radiusScale = d3.scaleLinear().domain([0, 1]).range([0, radius]);

    // Draw concentric circles (grid)
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    const gridGroup = svg.append('g').attr('class', 'grid');

    gridLevels.forEach((level, i) => {
      gridGroup
        .append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radiusScale(level))
        .attr('fill', 'none')
        .attr('stroke', 'hsl(var(--border))')
        .attr('stroke-width', i === gridLevels.length - 1 ? 2 : 1)
        .attr('opacity', 0.3);

      // Add level labels
      if (level > 0) {
        gridGroup
          .append('text')
          .attr('x', centerX + 5)
          .attr('y', centerY - radiusScale(level) + 4)
          .attr('fill', 'hsl(var(--muted-foreground))')
          .attr('font-size', '12px')
          .attr('font-weight', 300)
          .text(`${Math.round(level * 100)}%`);
      }
    });

    // Draw axis lines and labels
    const axisGroup = svg.append('g').attr('class', 'axes');

    axes.forEach((axis) => {
      const x = centerX + Math.cos(axis.angle - Math.PI / 2) * radius;
      const y = centerY + Math.sin(axis.angle - Math.PI / 2) * radius;

      // Axis line
      axisGroup
        .append('line')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'hsl(var(--border))')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);

      // Axis label
      const labelX = centerX + Math.cos(axis.angle - Math.PI / 2) * (radius + 25);
      const labelY = centerY + Math.sin(axis.angle - Math.PI / 2) * (radius + 25);

      axisGroup
        .append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', 'hsl(var(--foreground))')
        .attr('font-size', '14px')
        .attr('font-weight', 500)
        .text(axis.name);
    });

    // Create the data polygon
    const dataPoints = axes.map((axis) => {
      const value = data[axis.key as keyof FHSSSubScores];
      const x = centerX + Math.cos(axis.angle - Math.PI / 2) * radiusScale(value);
      const y = centerY + Math.sin(axis.angle - Math.PI / 2) * radiusScale(value);
      return [x, y];
    });

    // Close the polygon
    dataPoints.push(dataPoints[0]);

    const line = d3.line().curve(d3.curveLinearClosed);

    // Draw the filled area
    svg
      .append('path')
      .datum(dataPoints as [number, number][])
      .attr('d', line)
      .attr('fill', 'hsl(var(--primary))')
      .attr('fill-opacity', 0.2)
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 2)
      .attr('class', 'data-area');

    // Draw data points
    const pointsGroup = svg.append('g').attr('class', 'data-points');

    axes.forEach((axis, i) => {
      const value = data[axis.key as keyof FHSSSubScores];
      const x = centerX + Math.cos(axis.angle - Math.PI / 2) * radiusScale(value);
      const y = centerY + Math.sin(axis.angle - Math.PI / 2) * radiusScale(value);

      // Data point circle
      pointsGroup
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 6)
        .attr('fill', 'hsl(var(--primary))')
        .attr('stroke', 'hsl(var(--background))')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function() {
          d3.select(this).transition().duration(200).attr('r', 8);
          
          // Show tooltip
          const tooltip = svg
            .append('g')
            .attr('class', 'tooltip')
            .attr('transform', `translate(${x}, ${y - 20})`);

          const rect = tooltip
            .append('rect')
            .attr('x', -30)
            .attr('y', -15)
            .attr('width', 60)
            .attr('height', 20)
            .attr('rx', 4)
            .attr('fill', 'hsl(var(--background-card))')
            .attr('stroke', 'hsl(var(--border))');

          tooltip
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('fill', 'hsl(var(--foreground))')
            .attr('font-size', '12px')
            .attr('font-weight', 500)
            .text(`${Math.round(value * 100)}%`);
        })
        .on('mouseleave', function() {
          d3.select(this).transition().duration(200).attr('r', 6);
          svg.select('.tooltip').remove();
        });
    });

    // Add center score
    const averageScore = Object.values(data).reduce((sum, score) => sum + score, 0) / Object.values(data).length;
    
    svg
      .append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 20)
      .attr('fill', 'hsl(var(--background-card))')
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 2);

    svg
      .append('text')
      .attr('x', centerX)
      .attr('y', centerY - 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'hsl(var(--primary))')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(`${Math.round(averageScore * 100)}`);

    svg
      .append('text')
      .attr('x', centerX)
      .attr('y', centerY + 8)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('font-size', '10px')
      .text('FHSS');

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