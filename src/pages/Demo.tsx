import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  TrendingUp, 
  PiggyBank,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Wallet,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Demo data - NEVER connect to real database
const DEMO_DATA = {
  netWorth: 45750,
  monthlyIncome: 5500,
  monthlyExpenses: 3200,
  savingsRate: 41.8,
  debtTotal: 12500,
  investments: 23400,
  emergencyFund: 8500,
  financialScore: 78,
  projectedNetWorth: {
    oneYear: 72000,
    fiveYears: 285000,
    tenYears: 650000
  }
}

export default function Demo() {
  const [activeTab, setActiveTab] = useState('overview')
  const [animatedScore, setAnimatedScore] = useState(0)
  const [showInsight, setShowInsight] = useState(false)

  // Animate financial score on load
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore(prev => {
          if (prev >= DEMO_DATA.financialScore) {
            clearInterval(interval)
            return DEMO_DATA.financialScore
          }
          return prev + 1
        })
      }, 20)
    }, 500)

    const insightTimer = setTimeout(() => {
      setShowInsight(true)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearTimeout(insightTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Mode Banner with Urgency */}
      <div className="urgency-indicator text-white py-3 px-4 text-center font-medium relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative z-10">
          <AlertCircle className="inline-block w-4 h-4 mr-2" />
          🎯 LIVE DEMO: This shows how FlowSight transforms YOUR finances in 60 seconds!
          <Link to="/auth" className="underline ml-2 font-semibold hover:text-white/80">
            Get your real analysis →
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-bold text-xl">
              FlowSight Fi
            </Link>
            <Button asChild>
              <Link to="/auth">
                Get Real Analysis
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-7xl py-8">
        {/* Welcome Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to Your Financial Dashboard
            </h1>
            <p className="text-muted-foreground font-medium text-base">
              Here's your AI-powered financial analysis based on typical data for a 32-year-old professional.
            </p>
          </CardContent>
        </Card>

        {/* Financial Score Card */}
        <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground mb-6">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium opacity-90 mb-2">
                  Your Financial Health Score
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{animatedScore}</span>
                  <span className="text-2xl opacity-80">/ 100</span>
                </div>
                <p className="mt-2 opacity-80">
                  Better than 73% of people your age
                </p>
              </div>
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-primary-foreground/20 flex items-center justify-center">
                  <TrendingUp className="w-12 h-12" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insight */}
        {showInsight && (
          <Card className="bg-secondary/10 border-secondary mb-6 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground mb-2 text-lg">
                    AI Insight: You could save $450/month
                  </h3>
                  <p className="text-foreground/80 leading-relaxed font-medium">
                    Based on your spending patterns, we've identified 3 subscriptions you rarely use 
                    and 2 areas where you're overpaying. Fixing these could boost your savings rate to 50%.
                  </p>
                  <button className="mt-3 text-secondary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    See detailed recommendations
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Card className="mb-6">
          <div className="border-b border-border">
            <div className="flex gap-1 p-1">
              {['overview', 'cashflow', 'goals', 'spending'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <CardContent className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Net Worth Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Net Worth</h3>
                      <Wallet className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      ${DEMO_DATA.netWorth.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      +12.5% from last year
                    </p>
                  </CardContent>
                </Card>

                {/* Monthly Savings Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Monthly Savings</h3>
                      <PiggyBank className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      ${(DEMO_DATA.monthlyIncome - DEMO_DATA.monthlyExpenses).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {DEMO_DATA.savingsRate}% savings rate
                    </p>
                  </CardContent>
                </Card>

                {/* Debt Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Debt</h3>
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      ${DEMO_DATA.debtTotal.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-600 mt-1">
                      Payoff in 18 months
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'cashflow' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Monthly Income</h3>
                    <div className="bg-green-500/10 rounded-lg p-4">
                      <p className="text-3xl font-bold text-green-600">
                        ${DEMO_DATA.monthlyIncome.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Monthly Expenses</h3>
                    <div className="bg-red-500/10 rounded-lg p-4">
                      <p className="text-3xl font-bold text-red-600">
                        ${DEMO_DATA.monthlyExpenses.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-primary/10 rounded-lg p-6 text-center">
                  <p className="text-sm text-primary mb-2">Monthly Surplus</p>
                  <p className="text-4xl font-bold text-primary">
                    ${(DEMO_DATA.monthlyIncome - DEMO_DATA.monthlyExpenses).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Your Financial Future</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">1 Year</p>
                        <p className="text-2xl font-bold text-foreground">
                          ${DEMO_DATA.projectedNetWorth.oneYear.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">5 Years</p>
                        <p className="text-2xl font-bold text-foreground">
                          ${DEMO_DATA.projectedNetWorth.fiveYears.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">10 Years</p>
                        <p className="text-2xl font-bold text-foreground">
                          ${DEMO_DATA.projectedNetWorth.tenYears.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'spending' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-foreground mb-4">Spending Behavior Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-orange-50 dark:bg-orange-900/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Top Spending Category</h4>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">Dining Out</p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">$680/month • 38% over budget</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Spending Trend</h4>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">Decreasing</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">-12% vs last month</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-4">Recent Spending Insights</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Subscription Services</span>
                      <span className="font-semibold">$127/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Groceries</span>
                      <span className="font-semibold">$450/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Transportation</span>
                      <span className="font-semibold">$320/month</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to See Your Real Financial Future?
            </h2>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              This demo shows just a fraction of what FlowSight Fi can do. 
              Get your personalized analysis and start building wealth today.
            </p>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/auth">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <p className="mt-4 text-sm opacity-80">
              No credit card required • 5-minute setup
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}