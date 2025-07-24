import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShowMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeHorizon: number;
}

export const ShowMathModal: React.FC<ShowMathModalProps> = ({
  isOpen,
  onClose,
  timeHorizon
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Mathematical Foundation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Monte Carlo Equation */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Monte Carlo Simulation Formula</h3>
            <div className="bg-white p-3 rounded border font-mono text-sm">
              <div className="mb-2">
                NW<sub>t+1</sub> = NW<sub>t</sub> × (1 + r<sub>t</sub>) + S<sub>t</sub>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Where:
                <br />• NW<sub>t</sub> = Net worth at time t
                <br />• r<sub>t</sub> ~ N(μ<sub>r</sub>, σ<sub>r</sub>) = Daily return
                <br />• S<sub>t</sub> ~ N(μ<sub>s</sub>, σ<sub>s</sub>) = Daily surplus
              </div>
            </div>
          </div>

          {/* Variable Table */}
          <div>
            <h3 className="font-semibold mb-3">Current Variable Values</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-gray-300 p-2 text-left">Symbol</th>
                    <th className="border border-gray-300 p-2 text-left">Value</th>
                    <th className="border border-gray-300 p-2 text-left">Source</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">μ<sub>s</sub></td>
                    <td className="border border-gray-300 p-2">$85</td>
                    <td className="border border-gray-300 p-2">30-day mean surplus</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">σ<sub>s</sub></td>
                    <td className="border border-gray-300 p-2">$70</td>
                    <td className="border border-gray-300 p-2">30-day std. dev.</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">μ<sub>r</sub></td>
                    <td className="border border-gray-300 p-2">0.0286%</td>
                    <td className="border border-gray-300 p-2">Daily return (7.2% annual ÷ 252)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">σ<sub>r</sub></td>
                    <td className="border border-gray-300 p-2">0.945%</td>
                    <td className="border border-gray-300 p-2">Daily volatility (15% annual / √252)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">NW<sub>0</sub></td>
                    <td className="border border-gray-300 p-2">$50,000</td>
                    <td className="border border-gray-300 p-2">Starting net worth</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">T</td>
                    <td className="border border-gray-300 p-2">{timeHorizon * 365} days</td>
                    <td className="border border-gray-300 p-2">{timeHorizon} year horizon</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">N</td>
                    <td className="border border-gray-300 p-2">5,000</td>
                    <td className="border border-gray-300 p-2">Monte Carlo paths</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Percentile Calculation */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Percentile Calculation</h3>
            <div className="bg-white p-3 rounded border font-mono text-sm">
              <div className="mb-2">
                P<sub>k</sub>(t) = percentile(k, [NW<sub>1</sub>(t), NW<sub>2</sub>(t), ..., NW<sub>N</sub>(t)])
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Where k ∈ &#123;10, 50, 90&#125; for conservative, expected, and optimistic scenarios
              </div>
            </div>
          </div>

          {/* Behavioral Impact */}
          <div className="bg-accent-success/10 p-4 rounded-lg border border-accent-success/20">
            <h3 className="font-semibold mb-3 text-accent-success">Behavioral Impact Model</h3>
            <p className="text-sm text-muted-foreground">
              The hatched inner band represents variance attributable to user-controlled factors:
              spending discipline, savings automation, and habit consistency. This typically accounts 
              for 25% of total variance in the first 2 years, decreasing as market factors dominate 
              in longer horizons.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowMathModal;