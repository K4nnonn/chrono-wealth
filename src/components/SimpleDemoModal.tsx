import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Calculator, TrendingUp, DollarSign, Brain, ArrowRight, Target } from 'lucide-react'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SimpleDemoModal({ isOpen, onClose }: DemoModalProps) {
  const [income, setIncome] = useState(5000)
  const [bills, setBills] = useState(2800)
  const [crypto, setCrypto] = useState(500)
  const [showResults, setShowResults] = useState(false)

  // Calculate 90-day projection
  const calculate90DayProjection = () => {
    const monthlyNet = income - bills
    const cryptoGrowth = crypto * 1.05 // 5% growth assumption
    const projection = (monthlyNet * 3) + cryptoGrowth
    return {
      currentBalance: 8500, // Mock current balance
      projectedBalance: 8500 + projection,
      monthlySavings: monthlyNet,
      cryptoValue: cryptoGrowth,
      savingsRate: ((monthlyNet / income) * 100).toFixed(1)
    }
  }

  const results = calculate90DayProjection()

  const handleSimulate = () => {
    setShowResults(true)
  }

  const handleGetStarted = () => {
    onClose()
    // Navigate to auth or signup
    window.location.href = '/auth'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Brain className="w-6 h-6 text-primary" />
            90-Day Money Preview
            <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
              DEMO
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Your Financial Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="income">Monthly Income</Label>
                  <Input
                    id="income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="bills">Monthly Bills</Label>
                  <Input
                    id="bills"
                    type="number"
                    value={bills}
                    onChange={(e) => setBills(Number(e.target.value))}
                    className="text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="crypto">Crypto Holdings</Label>
                  <Input
                    id="crypto"
                    type="number"
                    value={crypto}
                    onChange={(e) => setCrypto(Number(e.target.value))}
                    className="text-lg"
                  />
                </div>
              </div>
              <Button 
                onClick={handleSimulate} 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                See My 90-Day Forecast
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {showResults && (
            <div className="space-y-6 animate-fade-in">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 dark:bg-green-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          In 90 Days You'll Have
                        </p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                          ${results.projectedBalance.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          ${(results.projectedBalance - 8500).toLocaleString()} more than today
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          Monthly Savings
                        </p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          ${results.monthlySavings.toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {results.savingsRate}% savings rate
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                          Crypto Growth
                        </p>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                          ${results.cryptoValue.toLocaleString()}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          5% growth projection
                        </p>
                      </div>
                      <Brain className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Your 90-Day Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Today', amount: 8500, percentage: 0 },
                      { label: 'Month 1', amount: 8500 + results.monthlySavings, percentage: 33 },
                      { label: 'Month 2', amount: 8500 + (results.monthlySavings * 2), percentage: 67 },
                      { label: 'Day 90', amount: results.projectedBalance, percentage: 100 }
                    ].map((milestone) => (
                      <div key={milestone.label} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-foreground min-w-[80px]">{milestone.label}</span>
                          <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${milestone.percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-lg font-bold text-foreground min-w-[120px] text-right">
                          ${milestone.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Insights (Demo)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <p className="font-medium text-foreground">💡 Smart Observation</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your {results.savingsRate}% savings rate is {parseFloat(results.savingsRate) > 20 ? 'excellent' : 'above average'}. 
                      {parseFloat(results.savingsRate) > 20 ? ' You\'re on track for early retirement!' : ' Consider automating investments to optimize growth.'}
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <p className="font-medium text-foreground">🎯 Opportunity</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {crypto > 1000 
                        ? 'Your crypto allocation suggests high risk tolerance. Consider diversifying into index funds.'
                        : 'You could increase your crypto allocation for higher growth potential.'}
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <p className="font-medium text-foreground">⚡ Quick Win</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Setting up automatic transfers could save you $50-200/month in decision fatigue and forgotten transfers.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <div className="text-center space-y-4 p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg">
                <h3 className="text-xl font-bold text-foreground">
                  See Your Real Financial Future
                </h3>
                <p className="text-muted-foreground">
                  This is just a demo with sample calculations. Connect your real accounts for personalized 90-day forecasts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600" onClick={handleGetStarted}>
                    Get My Real Forecast
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={onClose}>
                    Close Demo
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SimpleDemoModal