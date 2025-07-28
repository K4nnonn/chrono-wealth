// @ts-nocheck
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

    // Create gradient definition for the area
    const defs = svg.append('defs');
    const gradient = defs.append('radialGradient')
      .attr('id', 'radarGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '70%');

    // Calculate average score for gradient coloring
    const avgScore = Object.values(data).reduce((sum, score) => sum + score, 0) / Object.values(data).length;
    
    if (avgScore >= 0.8) {
      gradient.append('stop').attr('offset', '0%').attr('stop-color', 'hsl(var(--accent-success))').attr('stop-opacity', 0.6);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', 'hsl(var(--accent-teal))').attr('stop-opacity', 0.1);
    } else if (avgScore >= 0.6) {
      gradient.append('stop').attr('offset', '0%').attr('stop-color', 'hsl(var(--primary))').attr('stop-opacity', 0.5);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', 'hsl(var(--primary-glow))').attr('stop-opacity', 0.1);
    } else if (avgScore >= 0.4) {
      gradient.append('stop').attr('offset', '0%').attr('stop-color', 'hsl(var(--accent-warning))').attr('stop-opacity', 0.4);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', 'hsl(var(--accent-warning))').attr('stop-opacity', 0.1);
    } else {
      gradient.append('stop').attr('offset', '0%').attr('stop-color', 'hsl(var(--accent-destructive))').attr('stop-opacity', 0.4);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', 'hsl(var(--accent-destructive))').attr('stop-opacity', 0.1);
    }

    // Draw the filled area with enhanced styling
    const path = svg
      .append('path')
      .datum(dataPoints as [number, number][])
      .attr('d', line)
      .attr('fill', 'url(#radarGradient)')
      .attr('stroke', avgScore >= 0.8 ? 'hsl(var(--accent-success))' : 
                     avgScore >= 0.6 ? 'hsl(var(--primary))' :
                     avgScore >= 0.4 ? 'hsl(var(--accent-warning))' : 'hsl(var(--accent-destructive))')
      .attr('stroke-width', 3)
      .attr('class', 'data-area')
      .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))');

    // Draw data points
    const pointsGroup = svg.append('g').attr('class', 'data-points');

    axes.forEach((axis, i) => {
      const value = data[axis.key as keyof FHSSSubScores];
      const x = centerX + Math.cos(axis.angle - Math.PI / 2) * radiusScale(value);
      const y = centerY + Math.sin(axis.angle - Math.PI / 2) * radiusScale(value);

      // Enhanced data point circle with psychological indicators
      const pointColor = value >= 0.8 ? 'hsl(var(--accent-success))' :
                         value >= 0.6 ? 'hsl(var(--primary))' :
                         value >= 0.4 ? 'hsl(var(--accent-warning))' : 'hsl(var(--accent-destructive))';
      
      // Outer glow ring for high-performing metrics
      if (value >= 0.7) {
        pointsGroup
          .append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 12)
          .attr('fill', 'none')
          .attr('stroke', pointColor)
          .attr('stroke-width', 1)
          .attr('opacity', 0.3)
          .style('animation', 'pulse 2s ease-in-out infinite');
      }
      
      pointsGroup
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 7)
        .attr('fill', pointColor)
        .attr('stroke', 'hsl(var(--background))')
        .attr('stroke-width', 3)
        .style('cursor', 'pointer')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))')
        .on('mouseenter', function() {
          d3.select(this).transition().duration(200).attr('r', 10);
          
          // Enhanced tooltip with better psychology
          const tooltip = svg
            .append('g')
            .attr('class', 'tooltip')
            .attr('transform', `translate(${x}, ${y - 35})`);

          const tooltipBg = tooltip
            .append('rect')
            .attr('x', -45)
            .attr('y', -25)
            .attr('width', 90)
            .attr('height', 30)
            .attr('rx', 8)
            .attr('fill', 'hsl(var(--background))')
            .attr('stroke', pointColor)
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))');

          tooltip
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('y', -15)
            .attr('fill', 'hsl(var(--foreground))')
            .attr('font-size', '12px')
            .attr('font-weight', 600)
            .text(axis.name);

          tooltip
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('y', -2)
            .attr('fill', pointColor)
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text(`${Math.round(value * 100)}%`);
        })
        .on('mouseleave', function() {
          d3.select(this).transition().duration(200).attr('r', 7);
          svg.select('.tooltip').remove();
        });
    });

    // Enhanced center score with psychological design
    const averageScore = Object.values(data).reduce((sum, score) => sum + score, 0) / Object.values(data).length;
    const centerColor = avgScore >= 0.8 ? 'hsl(var(--accent-success))' :
                       avgScore >= 0.6 ? 'hsl(var(--primary))' :
                       avgScore >= 0.4 ? 'hsl(var(--accent-warning))' : 'hsl(var(--accent-destructive))';
    
    // Outer glow ring for center
    svg
      .append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 30)
      .attr('fill', 'none')
      .attr('stroke', centerColor)
      .attr('stroke-width', 1)
      .attr('opacity', 0.2)
      .style('animation', 'pulse 3s ease-in-out infinite');
    
    // Main center circle with gradient
    const centerGradient = defs.append('radialGradient')
      .attr('id', 'centerGradient')
      .attr('cx', '50%')
      .attr('cy', '30%')
      .attr('r', '70%');
    
    centerGradient.append('stop').attr('offset', '0%').attr('stop-color', 'hsl(var(--background))').attr('stop-opacity', 1);
    centerGradient.append('stop').attr('offset', '100%').attr('stop-color', centerColor).attr('stop-opacity', 0.1);
    
    svg
      .append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 24)
      .attr('fill', 'url(#centerGradient)')
      .attr('stroke', centerColor)
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))');

    // Center score text with enhanced styling
    svg
      .append('text')
      .attr('x', centerX)
      .attr('y', centerY - 3)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', centerColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .style('text-shadow', '0 1px 3px rgba(0,0,0,0.1)')
      .text(`${Math.round(averageScore * 100)}`);

    svg
      .append('text')
      .attr('x', centerX)
      .attr('y', centerY + 10)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('font-size', '9px')
      .attr('font-weight', 500)
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