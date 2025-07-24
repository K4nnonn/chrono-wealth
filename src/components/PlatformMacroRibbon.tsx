import React, { useState } from 'react';
import { Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MacroAssumptions {
  cpi: number;
  fedFunds: number;
  marketReturn: number;
  inflationAdjusted: boolean;
}

interface PlatformMacroRibbonProps {
  assumptions: MacroAssumptions;
  onAdjust: (assumptions: MacroAssumptions) => void;
  className?: string;
}

export const PlatformMacroRibbon: React.FC<PlatformMacroRibbonProps> = ({
  assumptions,
  onAdjust,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempAssumptions, setTempAssumptions] = useState(assumptions);

  const handleSave = () => {
    onAdjust(tempAssumptions);
    setIsOpen(false);
  };

  const lastUpdated = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className={cn(
        'w-full h-10 bg-navy/5 border-b border-navy/10 flex items-center justify-between px-6',
        'text-xs text-navy/80',
        className
      )}
      data-testid="macro-ribbon"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span className="font-medium">Model assumes:</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span>CPI {assumptions.cpi}%</span>
          <span>Fed Funds {assumptions.fedFunds}%</span>
          <span>Market Return {assumptions.marketReturn}%</span>
          {assumptions.inflationAdjusted && (
            <span className="text-mint font-medium">(inflation-adjusted)</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-navy/60">
          Updated {lastUpdated}
        </span>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-navy/60 hover:text-navy"
            >
              <Settings className="w-3 h-3 mr-1" />
              Adjust
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-navy mb-3">Macro Assumptions</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpi" className="text-xs">CPI (%)</Label>
                  <Input
                    id="cpi"
                    type="number"
                    step="0.1"
                    value={tempAssumptions.cpi}
                    onChange={(e) => setTempAssumptions(prev => ({
                      ...prev,
                      cpi: parseFloat(e.target.value)
                    }))}
                    className="h-8"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fedFunds" className="text-xs">Fed Funds (%)</Label>
                  <Input
                    id="fedFunds"
                    type="number"
                    step="0.25"
                    value={tempAssumptions.fedFunds}
                    onChange={(e) => setTempAssumptions(prev => ({
                      ...prev,
                      fedFunds: parseFloat(e.target.value)
                    }))}
                    className="h-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="marketReturn" className="text-xs">Market Return (%)</Label>
                <Input
                  id="marketReturn"
                  type="number"
                  step="0.1"
                  value={tempAssumptions.marketReturn}
                  onChange={(e) => setTempAssumptions(prev => ({
                    ...prev,
                    marketReturn: parseFloat(e.target.value)
                  }))}
                  className="h-8"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inflationAdjusted"
                  checked={tempAssumptions.inflationAdjusted}
                  onChange={(e) => setTempAssumptions(prev => ({
                    ...prev,
                    inflationAdjusted: e.target.checked
                  }))}
                  className="rounded border-navy/20"
                />
                <Label htmlFor="inflationAdjusted" className="text-xs">
                  Inflation-adjusted returns
                </Label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 h-8"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex-1 h-8 bg-navy hover:bg-navy/90"
                >
                  Update Model
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PlatformMacroRibbon;