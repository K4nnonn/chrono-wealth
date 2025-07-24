import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpendingCategory {
  name: string;
  amount: number;
  cv: number; // Coefficient of variation (σ/μ)
}

interface MoneyMapSeismographProps {
  timeHorizon: number;
  className?: string;
}

export const MoneyMapSeismograph: React.FC<MoneyMapSeismographProps> = ({
  timeHorizon,
  className
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<SpendingCategory | null>(null);

  // Mock spending data with volatility
  const spendingData: SpendingCategory[] = [
    { name: 'Dining', amount: 850, cv: 1.67 }, // High volatility
    { name: 'Groceries', amount: 650, cv: 0.85 }, // Low volatility
    { name: 'Transport', amount: 450, cv: 1.45 }, // High volatility
    { name: 'Utilities', amount: 320, cv: 0.35 }, // Very low volatility
    { name: 'Entertainment', amount: 280, cv: 1.89 }, // Very high volatility
    { name: 'Shopping', amount: 520, cv: 1.12 }, // Medium volatility
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const size = 250;
    const margin = 25;
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = (size - 2 * margin) / 2;

    // Income node at center
    const incomeNode = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    incomeNode.append('circle')
      .attr('r', 15)
      .attr('fill', '#11234A')
      .attr('stroke', '#2ED3A1')
      .attr('stroke-width', 2);

    incomeNode.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', 'white')
      .text('Income');

    // Position categories around circle
    const angleStep = (2 * Math.PI) / spendingData.length;
    const totalAmount = d3.sum(spendingData, d => d.amount);

    spendingData.forEach((category, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const radius = maxRadius * 0.7; // Fixed radius for categories
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Node size based on amount
      const nodeRadius = 8 + (category.amount / totalAmount) * 20;
      
      // Category node
      const categoryNode = svg.append('g')
        .attr('transform', `translate(${x}, ${y})`)
        .style('cursor', 'pointer')
        .on('click', () => setSelectedCategory(category));

      // Pulse animation for high volatility categories (CV > 1.25)
      const shouldPulse = category.cv > 1.25;
      
      categoryNode.append('circle')
        .attr('r', nodeRadius)
        .attr('fill', shouldPulse ? 'var(--c-rose)' : 'var(--c-mint)')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .classed('pulse-ring', shouldPulse);

      // Flow line from center to category - proportional thickness
      const lineThickness = (category.amount / totalAmount) * 12 + 2;
      
      svg.append('line')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', shouldPulse ? 'var(--c-rose)' : 'var(--c-mint)')
        .attr('stroke-width', lineThickness)
        .attr('opacity', 0.6)
        .attr('stroke-dasharray', shouldPulse ? '5,5' : 'none')
        .classed('pulse-line', shouldPulse);

      // Category label
      categoryNode.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', '8px')
        .attr('font-weight', '600')
        .attr('fill', 'white')
        .text(category.name.substring(0, 4));

      // Amount label below
      svg.append('text')
        .attr('x', x)
        .attr('y', y + nodeRadius + 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-weight', '500')
        .attr('fill', '#67728A')
        .text(`$${category.amount}`);
    });

    // Add pulse animation styles
    const style = document.createElement('style');
    style.textContent = `
      .pulse-ring {
        animation: pulse-ring 2s infinite;
      }
      .pulse-line {
        animation: pulse-line 2s infinite;
      }
      @keyframes pulse-ring {
        0%, 100% { r: ${8 + (spendingData[0].amount / totalAmount) * 20}; opacity: 1; }
        50% { r: ${12 + (spendingData[0].amount / totalAmount) * 20}; opacity: 0.7; }
      }
      @keyframes pulse-line {
        0%, 100% { stroke-dashoffset: 0; }
        50% { stroke-dashoffset: 10; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [timeHorizon]);

  const highestVolatilityCategory = spendingData.reduce((prev, current) => 
    prev.cv > current.cv ? prev : current
  );

  return (
    <TooltipProvider>
      <Card className="w-full h-full">
        <CardHeader style={{padding: '28px 28px 16px 28px'}}>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-accent-coral" />
            Money Map Seismograph
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" style={{padding: '0 28px 28px 28px'}}>
          <div className="flex items-start gap-3 p-3 bg-accent-coral/10 border border-accent-coral/20 rounded-lg">
            <Sparkles className="w-4 h-4 text-accent-coral flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">🍔 Weekend dining wipes out 43% of weekday discipline.</p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="h-6 text-xs">Show impact</Button>
                <Button variant="ghost" size="sm" className="h-6 text-xs">Got it</Button>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <svg
              ref={svgRef}
              width={250}
              height={250}
              className="mx-auto mb-4"
              role="img"
              aria-label="Money flow seismograph showing spending categories and volatility"
            />
            
            <div className="text-center">
              <div className="text-sm font-bold" style={{color: 'var(--c-rose)'}}>
                {highestVolatilityCategory.name}
              </div>
              <div className="text-xs text-muted-foreground">
                High Volatility
              </div>
            </div>
          </div>

          {selectedCategory && (
            <Tooltip open={true}>
              <TooltipContent className="bg-navy text-white p-3 rounded shadow-lg">
                <div className="font-bold text-xs mb-1">
                  {selectedCategory.name} volatility costs you ≈ ${Math.round(selectedCategory.amount * selectedCategory.cv * 0.15)}/mo in predictability buffer
                </div>
                <div className="text-xs">
                  CV: {selectedCategory.cv.toFixed(2)} | Amount: ${selectedCategory.amount}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default MoneyMapSeismograph;