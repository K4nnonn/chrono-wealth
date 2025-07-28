import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart } from 'recharts';
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

  // Generate all scenarios
  const currentScenario = analyzeScenario('current');
  const optimisticScenario = analyzeScenario('optimistic');
  const conservativeScenario = analyzeScenario('conservative');
  const crisisScenario = analyzeScenario('crisis');

  // Create sophisticated dashboard data
  const savingsRateData = [
    { month: 'Jan', rate: 15 }, { month: 'Feb', rate: 18 }, { month: 'Mar', rate: 22 },
    { month: 'Apr', rate: 25 }, { month: 'May', rate: 28 }, { month: 'Jun', rate: 24 }
  ];

  const expenseBreakdown = [
    { name: 'Housing', value: 35, color: '#5665FF' },
    { name: 'Food', value: 15, color: '#22C55E' },
    { name: 'Transport', value: 12, color: '#F59E0B' },
    { name: 'Entertainment', value: 8, color: '#EF4444' },
    { name: 'Other', value: 30, color: '#8B5CF6' }
  ];

  const monthlyGrowthData = currentScenario.projections.slice(0, 12).map(proj => ({
    month: proj.month,
    income: proj.income,
    expenses: proj.expenses,
    savings: proj.savings,
    netWorth: proj.netWorth
  }));

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 rounded-2xl animate-chart-entry">
      {/* Psychological Header with Confidence Indicator */}
      <div className="flex items-center justify-between mb-8 animate-data-reveal">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Advanced Financial Forecasting
          </h2>
          <p className="text-muted-foreground mt-2">AI-powered insights into your financial future</p>
        </div>
        <div className="flex items-center gap-3 bg-gradient-confidence px-4 py-2 rounded-full animate-confidence-glow">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white font-medium text-sm">94% Confidence</span>
        </div>
      </div>
      
      {/* Top Metrics Row - Enhanced with Psychology */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 hover-lift transition-smooth animate-data-reveal overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium flex items-center gap-2">
                  Monthly Income
                  <TrendingUp className="w-4 h-4 animate-growth-surge" />
                </p>
                <p className="text-3xl font-bold animate-data-reveal" style={{animationDelay: '0.2s'}}>
                  {formatCurrency(currentMetrics.monthlyIncome)}
                </p>
                <p className="text-blue-200 text-xs flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  +12% from last month
                </p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center animate-float backdrop-blur-sm">
                <DollarSign className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-wealth text-white border-0 hover-lift transition-smooth animate-data-reveal overflow-hidden relative" style={{animationDelay: '0.1s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium flex items-center gap-2">
                  Monthly Savings
                  <Shield className="w-4 h-4 animate-confidence-glow" />
                </p>
                <p className="text-3xl font-bold animate-data-reveal animate-wealth-pulse" style={{animationDelay: '0.3s'}}>
                  {formatCurrency(currentMetrics.monthlySavings)}
                </p>
                <p className="text-emerald-200 text-xs flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                  {(currentMetrics.savingsRate * 100).toFixed(1)}% savings rate
                </p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center animate-float backdrop-blur-sm" style={{animationDelay: '0.2s'}}>
                <TrendingUp className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 hover-lift transition-smooth animate-data-reveal overflow-hidden relative" style={{animationDelay: '0.2s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium flex items-center gap-2">
                  Net Worth
                  <Zap className="w-4 h-4 animate-pulse" />
                </p>
                <p className="text-3xl font-bold animate-data-reveal" style={{animationDelay: '0.4s'}}>
                  {formatCurrency(currentMetrics.currentNetWorth)}
                </p>
                <p className="text-purple-200 text-xs flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  +8.2% this year
                </p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center animate-float backdrop-blur-sm" style={{animationDelay: '0.3s'}}>
                <Target className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 hover-lift transition-smooth animate-data-reveal overflow-hidden relative" style={{animationDelay: '0.3s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium flex items-center gap-2">
                  Goal Progress
                  <Calculator className="w-4 h-4 animate-bounce-subtle" />
                </p>
                <p className="text-3xl font-bold animate-data-reveal animate-achievement-celebration" style={{animationDelay: '0.5s'}}>
                  67%
                </p>
                <p className="text-orange-200 text-xs flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  45 days to milestone
                </p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center animate-float backdrop-blur-sm" style={{animationDelay: '0.4s'}}>
                <Calendar className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Financial Timeline */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Timeline
            </CardTitle>
            <CardDescription>Your projected financial future</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyGrowthData}>
                  <defs>
                    <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5665FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#5665FF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value)]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="netWorth"
                    stroke="#5665FF"
                    strokeWidth={3}
                    fill="url(#netWorthGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
                  />
                  <Bar dataKey="savings" fill="#8B5CF6" opacity={0.6} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Savings Rate Trend</CardTitle>
            <CardDescription>Monthly improvement tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={savingsRateData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Savings Rate']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="rate" fill="#5665FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Expense Breakdown Donut */}
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Expenses']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid - Multi-chart Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cash Flow Analysis */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Cash Flow</CardTitle>
            <CardDescription>Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyGrowthData.slice(0, 6)}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#22C55E"
                    fill="url(#incomeGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="#EF4444"
                    fill="url(#expenseGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Comparison */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Scenario Analysis</CardTitle>
            <CardDescription>Future projections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentScenario.projections.slice(0, 12)}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Line
                    type="monotone"
                    dataKey="netWorth"
                    stroke="#5665FF"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="emergencyFund"
                    stroke="#22C55E"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Goal Achievement Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Goal Achievement</CardTitle>
            <CardDescription>Progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[120px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="50%" outerRadius="90%" data={[{ value: 67, fill: '#5665FF' }]}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#5665FF" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="text-center -mt-16">
                <p className="text-2xl font-bold text-primary">67%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-success">$67k</p>
                <p className="text-xs text-muted-foreground">Current</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">$100k</p>
                <p className="text-xs text-muted-foreground">Target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action Panel */}
      <Card className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Recommendations</h3>
              <p className="text-blue-100">Based on your financial patterns, we recommend increasing your emergency fund by $200/month</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">Learn More</Button>
              <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                Start Optimization
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};