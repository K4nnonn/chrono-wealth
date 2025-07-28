import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface SimulationSliderProps {
  currentYear?: number;
  maxYear?: number;
  onYearChange?: (year: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  isPlaying?: boolean;
}

export const SimulationSlider = ({
  currentYear = 2024,
  maxYear = 2054,
  onYearChange,
  onPlay,
  onPause,
  onReset,
  isPlaying = false
}: SimulationSliderProps) => {
  const [year, setYear] = useState(currentYear);
  
  const handleYearChange = (value: number[]) => {
    const newYear = value[0];
    setYear(newYear);
    onYearChange?.(newYear);
  };

  const getQuarterMarks = () => {
    const marks = [];
    for (let y = currentYear; y <= maxYear; y += 5) {
      marks.push(y);
    }
    return marks;
  };

  return (
    <Card className="p-6 bg-background-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Timeline Explorer</h3>
          <div className="text-2xl font-bold text-primary">
            {year}
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Slider */}
          <div className="px-3">
            <Slider
              value={[year]}
              onValueChange={handleYearChange}
              max={maxYear}
              min={currentYear}
              step={1}
              className="w-full"
            />
          </div>

          {/* Year Markers */}
          <div className="flex justify-between text-xs text-muted-foreground px-3">
            {getQuarterMarks().map((mark) => (
              <span key={mark}>'{mark.toString().slice(-2)}</span>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            <Button
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              className="flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play
                </>
              )}
            </Button>
          </div>

          {/* Quick Jump Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "5Y", years: 5 },
              { label: "10Y", years: 10 },
              { label: "20Y", years: 20 },
              { label: "30Y", years: 30 }
            ].map((jump) => (
              <Button
                key={jump.label}
                variant="ghost"
                size="sm"
                onClick={() => handleYearChange([currentYear + jump.years])}
                className="text-xs"
              >
                {jump.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};