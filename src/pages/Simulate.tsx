import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  TrendingUp, 
  Zap,
  Save,
  RotateCcw,
  Play
} from "lucide-react";

const Simulate = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Simulation Center
            </h1>
            <p className="text-muted-foreground">
              Explore different scenarios and see how they impact your financial future
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Timeline & Chart */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Timeline Controls */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Timeline Scrubber</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-gradient-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Scenario
                    </Button>
                  </div>
                </div>
                
                {/* Timeline Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>2025</span>
                    <span className="font-medium text-foreground">Currently viewing: June 2027</span>
                    <span>2035</span>
                  </div>
                  
                  <Slider
                    defaultValue={[25]}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span>Today</span>
                    <span>•</span>
                    <span>1Y</span>
                    <span>•</span>
                    <span>5Y</span>
                    <span>•</span>
                    <span>10Y</span>
                  </div>
                </div>
              </Card>

              {/* Interactive Chart */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Financial Flow Visualization</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">87% Confidence</Badge>
                    <Badge className="bg-gradient-success text-white">Stable Path</Badge>
                  </div>
                </div>
                
                {/* Chart Placeholder */}
                <div className="h-80 bg-gradient-card rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <TrendingUp className="w-16 h-16 text-primary mx-auto" />
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Interactive Cash Flow Chart</h3>
                      <p className="text-muted-foreground">
                        Real-time updates as you adjust scenarios
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
                      <div className="text-center">
                        <div className="w-3 h-3 bg-primary rounded-full mx-auto mb-1"></div>
                        <div>Net Worth</div>
                      </div>
                      <div className="text-center">
                        <div className="w-3 h-3 bg-accent-success rounded-full mx-auto mb-1"></div>
                        <div>Savings</div>
                      </div>
                      <div className="text-center">
                        <div className="w-3 h-3 bg-accent rounded-full mx-auto mb-1"></div>
                        <div>Goals</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Controls */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Show confidence bands</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Goal milestones</span>
                    </label>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Brain className="w-4 h-4 mr-2" />
                    Ask AI About This
                  </Button>
                </div>
              </Card>
            </div>

            {/* Scenario Controls */}
            <div className="space-y-6">
              
              {/* Current Scenario */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Current Scenario</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Scenario Name</span>
                    <Input 
                      defaultValue="Base Timeline" 
                      className="w-32 h-8 text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Created</span>
                    <span className="text-muted-foreground">Today, 2:34 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Confidence</span>
                    <Badge variant="outline">87%</Badge>
                  </div>
                </div>
              </Card>

              {/* Life Events */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Life Events</h3>
                <div className="space-y-4">
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Income Change</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="Amount" 
                        className="h-8"
                      />
                      <Input 
                        type="date" 
                        className="h-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Major Purchase</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="House, Car, etc." 
                        className="h-8"
                      />
                      <Input 
                        type="number" 
                        placeholder="$"
                        className="h-8 w-20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Investment Return Rate</Label>
                    <Slider
                      defaultValue={[7]}
                      max={15}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>7%</span>
                      <span>15%</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-primary">
                    <Zap className="w-4 h-4 mr-2" />
                    Apply Changes
                  </Button>
                </div>
              </Card>

              {/* Quick Scenarios */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Scenarios</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    💼 Get a 20% raise
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    🏠 Buy a house next year
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    📈 Invest $500 more monthly
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    💍 Plan for marriage
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    👶 Add a child
                  </Button>
                </div>
              </Card>

              {/* Saved Scenarios */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Saved Scenarios</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">Conservative Path</span>
                    <Button variant="ghost" size="sm">Load</Button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">Aggressive Growth</span>
                    <Button variant="ghost" size="sm">Load</Button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">Early Retirement</span>
                    <Button variant="ghost" size="sm">Load</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulate;