import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, 
  TrendingDown,
  Briefcase,
  Heart,
  Home,
  DollarSign,
  Zap,
  Shield,
  RotateCcw,
  Play,
  Save
} from "lucide-react";

const crisisScenarios = [
  {
    id: "job-loss",
    title: "Job Loss",
    description: "Simulate unemployment period",
    icon: Briefcase,
    active: false,
    severity: "high",
    duration: 4, // months
    impact: -65 // percentage impact
  },
  {
    id: "emergency-expense",
    title: "Emergency Expense",
    description: "Unexpected large cost",
    icon: Heart,
    active: false,
    severity: "medium", 
    amount: 8500,
    impact: -25
  },
  {
    id: "market-crash",
    title: "Market Crash",
    description: "Investment portfolio decline",
    icon: TrendingDown,
    active: true,
    severity: "high",
    decline: 30, // percentage
    impact: -40
  },
  {
    id: "inflation-spike",
    title: "Inflation Spike",
    description: "Increased living costs",
    icon: DollarSign,
    active: false,
    severity: "medium",
    increase: 15, // percentage
    impact: -20
  },
  {
    id: "housing-crisis",
    title: "Housing Crisis",
    description: "Rent increase or mortgage issue",
    icon: Home,
    active: false,
    severity: "medium",
    increase: 25, // percentage
    impact: -30
  }
];

const Crisis = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <h1 className="text-3xl font-bold text-foreground">
                Crisis Simulator
              </h1>
            </div>
            <p className="text-muted-foreground">
              Test your financial resilience against various life events and market conditions
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Impact Visualization */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Current Impact Overview */}
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Active Crisis Impact
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset All
                    </Button>
                    <Button size="sm" className="bg-destructive text-destructive-foreground">
                      <Save className="w-4 h-4 mr-2" />
                      Save Scenario
                    </Button>
                  </div>
                </div>
                
                {/* Impact Metrics */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-destructive">-40%</div>
                    <div className="text-sm text-muted-foreground">Net Worth Impact</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-destructive">8 months</div>
                    <div className="text-sm text-muted-foreground">Recovery Time</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-destructive">$18,400</div>
                    <div className="text-sm text-muted-foreground">Estimated Loss</div>
                  </div>
                </div>

                {/* Recovery Actions */}
                <div className="bg-background rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent-success" />
                    AI Recovery Suggestions
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-accent-success/10">
                      <span className="text-sm">Use emergency fund ($6,800)</span>
                      <Button size="sm" variant="outline">Apply</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-accent-success/10">
                      <span className="text-sm">Pause non-essential spending</span>
                      <Button size="sm" variant="outline">Apply</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-accent-success/10">
                      <span className="text-sm">Delay house down payment by 6 months</span>
                      <Button size="sm" variant="outline">Apply</Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Crisis Timeline */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Crisis Timeline Impact</h2>
                
                {/* Timeline Chart Placeholder */}
                <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center space-y-4">
                    <TrendingDown className="w-16 h-16 text-destructive mx-auto" />
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Financial Impact Over Time</h3>
                      <p className="text-muted-foreground">
                        See how crises affect your financial trajectory
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
                      <div className="text-center">
                        <div className="w-3 h-3 bg-destructive rounded-full mx-auto mb-1"></div>
                        <div>Crisis Impact</div>
                      </div>
                      <div className="text-center">
                        <div className="w-3 h-3 bg-accent rounded-full mx-auto mb-1"></div>
                        <div>Recovery Phase</div>
                      </div>
                      <div className="text-center">
                        <div className="w-3 h-3 bg-accent-success rounded-full mx-auto mb-1"></div>
                        <div>Back on Track</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Timeline shows impact over 24 months with recovery strategies
                  </div>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Animate Timeline
                  </Button>
                </div>
              </Card>
            </div>

            {/* Crisis Controls */}
            <div className="space-y-6">
              
              {/* Crisis Toggles */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Crisis Scenarios</h3>
                
                <div className="space-y-4">
                  {crisisScenarios.map((crisis) => {
                    const Icon = crisis.icon;
                    const severityColor = {
                      high: "text-destructive",
                      medium: "text-accent",
                      low: "text-accent-success"
                    }[crisis.severity];
                    
                    return (
                      <div key={crisis.id} className={`p-4 rounded-lg border transition-all ${
                        crisis.active ? 'border-destructive bg-destructive/5' : 'border-border'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              crisis.active ? 'bg-destructive' : 'bg-muted'
                            }`}>
                              <Icon className={`w-4 h-4 ${crisis.active ? 'text-white' : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                              <div className="font-medium">{crisis.title}</div>
                              <div className="text-xs text-muted-foreground">{crisis.description}</div>
                            </div>
                          </div>
                          <Switch checked={crisis.active} />
                        </div>
                        
                        {crisis.active && (
                          <div className="mt-3 space-y-3">
                            {crisis.duration && (
                              <div className="space-y-2">
                                <Label className="text-xs">Duration: {crisis.duration} months</Label>
                                <Slider
                                  defaultValue={[crisis.duration]}
                                  max={12}
                                  min={1}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            )}
                            
                            {crisis.amount && (
                              <div className="space-y-2">
                                <Label className="text-xs">Amount: ${crisis.amount.toLocaleString()}</Label>
                                <Slider
                                  defaultValue={[crisis.amount / 100]}
                                  max={500}
                                  min={10}
                                  step={5}
                                  className="w-full"
                                />
                              </div>
                            )}
                            
                            {crisis.decline && (
                              <div className="space-y-2">
                                <Label className="text-xs">Market Decline: {crisis.decline}%</Label>
                                <Slider
                                  defaultValue={[crisis.decline]}
                                  max={50}
                                  min={5}
                                  step={5}
                                  className="w-full"
                                />
                              </div>
                            )}
                            
                            {crisis.increase && (
                              <div className="space-y-2">
                                <Label className="text-xs">Cost Increase: {crisis.increase}%</Label>
                                <Slider
                                  defaultValue={[crisis.increase]}
                                  max={50}
                                  min={5}
                                  step={5}
                                  className="w-full"
                                />
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3 text-xs">
                          <Badge variant={crisis.severity === 'high' ? 'destructive' : 'outline'}>
                            {crisis.severity} impact
                          </Badge>
                          <span className={severityColor}>
                            {crisis.impact}% net worth
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Quick Presets */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Presets</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    📉 2008-Style Recession
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    🦠 Pandemic Impact
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    🏠 Housing Market Crash
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    💼 Tech Layoff Wave
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    🔥 Natural Disaster
                  </Button>
                </div>
              </Card>

              {/* Resilience Score */}
              <Card className="p-6 bg-gradient-success">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-success" />
                    <h3 className="font-semibold text-accent-foreground">Resilience Score</h3>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-foreground">7.2/10</div>
                    <div className="text-sm text-accent-foreground/80">Strong Financial Resilience</div>
                  </div>
                  
                  <div className="text-sm text-accent-foreground/80">
                    Your emergency fund and diversified income provide good protection against most crises.
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-accent-success/30 text-accent-foreground hover:bg-accent-success/10"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Improve Score
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crisis;