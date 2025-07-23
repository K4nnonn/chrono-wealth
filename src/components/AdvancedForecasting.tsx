import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useFinancialForecasting } from '@/hooks/useFinancialForecasting';
import { formatCurrency } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  DollarSign,
  Calculator,
  Zap,
  Shield,
  Calendar
} from 'lucide-react';

export const AdvancedForecasting: React.FC = () => {
  const { 
    analyzeScenario, 
    generateForecastInsights, 
    calculateWhatIfScenario,
    currentMetrics 
  } = useFinancialForecasting();

  const [whatIfInputs, setWhatIfInputs] = useState({
    incomeChange: 0,
    expenseChange: 0,
    additionalSavings: 0
  });

  const [activeScenario, setActiveScenario] = useState<'current' | 'optimistic' | 'conservative' | 'crisis'>('current');

  // Generate all scenarios
  const currentScenario = analyzeScenario('current');
  const optimisticScenario = analyzeScenario('optimistic');
  const conservativeScenario = analyzeScenario('conservative');
  const crisisScenario = analyzeScenario('crisis');

  const insights = generateForecastInsights();
  const whatIfResult = calculateWhatIfScenario(whatIfInputs);

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'optimistic': return '#22C55E';
      case 'conservative': return '#F59E0B';
      case 'crisis': return '#EF4444';
      default: return '#5665FF';
    }
  };

  const scenarioData = [
    { name: 'Current', data: currentScenario, color: '#5665FF' },
    { name: 'Optimistic', data: optimisticScenario, color: '#22C55E' },
    { name: 'Conservative', data: conservativeScenario, color: '#F59E0B' },
    { name: 'Crisis', data: crisisScenario, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Current Financial Pulse */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Financial Pulse - Current State
          </CardTitle>
          <CardDescription>Real-time analysis of your financial position</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{formatCurrency(currentMetrics.monthlyIncome)}</p>
              <p className="text-sm text-muted-foreground">Monthly Income</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{formatCurrency(currentMetrics.monthlyExpenses)}</p>
              <p className="text-sm text-muted-foreground">Monthly Expenses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{formatCurrency(currentMetrics.monthlySavings)}</p>
              <p className="text-sm text-muted-foreground">Monthly Savings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{(currentMetrics.savingsRate * 100).toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Savings Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="projections" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projections">Future Projections</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
          <TabsTrigger value="whatif">What-If Calculator</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="projections" className="space-y-6">
          {/* Net Worth Projection Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Net Worth Projection - Next 24 Months</CardTitle>
              <CardDescription>
                Track how your wealth will grow under different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Net Worth']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    
                    {scenarioData.map((scenario) => (
                      <Line
                        key={scenario.name}
                        dataKey="netWorth"
                        data={scenario.data.projections}
                        stroke={scenario.color}
                        strokeWidth={scenario.name === 'Current' ? 3 : 2}
                        strokeDasharray={scenario.name === 'Current' ? '0' : '5,5'}
                        dot={false}
                        name={scenario.name}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                {scenarioData.map((scenario) => (
                  <div key={scenario.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: scenario.color }}
                    />
                    <span className="text-sm font-medium">{scenario.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(scenario.data.summary.finalNetWorth)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Cash Flow Projection */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cash Flow Trends</CardTitle>
              <CardDescription>Income vs Expenses over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentScenario.projections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stackId="1"
                      stroke="#22C55E"
                      fill="#22C55E"
                      fillOpacity={0.6}
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="2"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.6}
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Scenario Comparison */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {scenarioData.map((scenario) => (
              <Card 
                key={scenario.name}
                className={`cursor-pointer transition-all duration-300 ${
                  activeScenario === scenario.name.toLowerCase() 
                    ? 'ring-2 ring-primary shadow-glow' 
                    : 'hover:shadow-card'
                }`}
                onClick={() => setActiveScenario(scenario.name.toLowerCase() as any)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {scenario.name}
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: scenario.color, color: scenario.color }}
                    >
                      {scenario.name === 'Current' ? 'Active' : 'Projection'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Final Net Worth</p>
                    <p className="text-xl font-bold" style={{ color: scenario.color }}>
                      {formatCurrency(scenario.data.summary.finalNetWorth)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Goal Achievement</p>
                    <p className="font-semibold">
                      {scenario.data.summary.goalAchievementMonths > 24 
                        ? '>24 months' 
                        : `${scenario.data.summary.goalAchievementMonths} months`
                      }
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <Progress value={scenario.data.summary.riskScore} className="flex-1" />
                      <span className="text-sm font-medium">{scenario.data.summary.riskScore.toFixed(0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Scenario Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Deep Dive: {activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)}</CardTitle>
              <CardDescription>Detailed month-by-month breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioData.find(s => s.name.toLowerCase() === activeScenario)?.data.projections.slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="savings" fill={getScenarioColor(activeScenario)} name="Monthly Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatif" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                What-If Calculator
              </CardTitle>
              <CardDescription>
                See how changes to your finances would impact your future
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="income-change">Monthly Income Change</Label>
                  <Input
                    id="income-change"
                    type="number"
                    placeholder="0"
                    value={whatIfInputs.incomeChange || ''}
                    onChange={(e) => setWhatIfInputs(prev => ({
                      ...prev,
                      incomeChange: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expense-change">Monthly Expense Change</Label>
                  <Input
                    id="expense-change"
                    type="number"
                    placeholder="0"
                    value={whatIfInputs.expenseChange || ''}
                    onChange={(e) => setWhatIfInputs(prev => ({
                      ...prev,
                      expenseChange: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additional-savings">Additional Monthly Savings</Label>
                  <Input
                    id="additional-savings"
                    type="number"
                    placeholder="0"
                    value={whatIfInputs.additionalSavings || ''}
                    onChange={(e) => setWhatIfInputs(prev => ({
                      ...prev,
                      additionalSavings: Number(e.target.value)
                    }))}
                  />
                </div>
              </div>

              {/* What-If Results */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 bg-gradient-card rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{formatCurrency(whatIfResult.newMonthlySavings)}</p>
                  <p className="text-sm text-muted-foreground">New Monthly Savings</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {whatIfResult.improvementVsCurrent > 0 ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : whatIfResult.improvementVsCurrent < 0 ? (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    ) : null}
                    <span className="text-xs">
                      {whatIfResult.improvementVsCurrent > 0 ? '+' : ''}
                      {formatCurrency(whatIfResult.improvementVsCurrent)}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold">{(whatIfResult.newSavingsRate * 100).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">New Savings Rate</p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{formatCurrency(whatIfResult.futureNetWorth)}</p>
                  <p className="text-sm text-muted-foreground">Net Worth (1 Year)</p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold text-warning">
                    {typeof whatIfResult.monthsToGoal === 'string' 
                      ? whatIfResult.monthsToGoal 
                      : `${whatIfResult.monthsToGoal}mo`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">To $100k Goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {insight.includes('🚨') && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      {insight.includes('💪') && <Target className="w-4 h-4 text-success" />}
                      {insight.includes('👍') && <TrendingUp className="w-4 h-4 text-primary" />}
                      {insight.includes('⚠️') && <AlertTriangle className="w-4 h-4 text-warning" />}
                      {insight.includes('🎯') && <Target className="w-4 h-4 text-primary" />}
                      {insight.includes('🛡️') && <Shield className="w-4 h-4 text-primary" />}
                      {insight.includes('📈') && <TrendingUp className="w-4 h-4 text-success" />}
                    </div>
                    <p className="text-sm leading-relaxed">{insight}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recommended Actions
              </CardTitle>
              <CardDescription>Prioritized steps to improve your financial trajectory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentMetrics.savingsRate < 0.1 && (
                  <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <div>
                      <p className="font-medium">Increase Savings Rate</p>
                      <p className="text-sm text-muted-foreground">
                        Target saving 10-20% of income for financial stability
                      </p>
                    </div>
                  </div>
                )}
                
                {currentScenario.summary.emergencyFundCoverage < 1 && (
                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Build Emergency Fund</p>
                      <p className="text-sm text-muted-foreground">
                        Aim for 6 months of expenses in emergency savings
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium">Optimize Investment Strategy</p>
                    <p className="text-sm text-muted-foreground">
                      Consider diversified portfolio for long-term growth
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};