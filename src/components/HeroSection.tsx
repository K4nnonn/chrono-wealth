import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, PlayCircle } from 'lucide-react'
import { Button } from './ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-4xl mx-auto">
          {/* Small tag above headline */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/50 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Financial Planning
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            See Your Financial Future
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              in 60 Seconds
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 50,000+ people using AI to build wealth, eliminate debt, and achieve financial freedom faster than ever before.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="gap-2">
              <Link to="/demo">
                <PlayCircle className="w-5 h-5" />
                Try Interactive Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/auth">
                Start Free Trial
              </Link>
            </Button>
          </div>

          {/* Trust indicators below buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              5-minute setup
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Cancel anytime
            </span>
          </div>
        </div>

        {/* Demo Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="bg-card rounded-xl shadow-2xl p-2 max-w-5xl mx-auto border">
            <div className="bg-gradient-to-br from-muted/50 to-muted rounded-lg p-6 min-h-[400px]">
              {/* Mini Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Financial Health Score</h3>
                  <p className="text-sm text-muted-foreground">Live dashboard preview</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">78</div>
                  <div className="text-xs text-muted-foreground">Good Health</div>
                </div>
              </div>
              
              {/* Mini Chart Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Net Worth</span>
                    <span className="text-green-500 text-sm">+12.5%</span>
                  </div>
                  <div className="text-xl font-bold">$156,429</div>
                  <div className="mt-2 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full w-3/4"></div>
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Monthly Savings</span>
                    <span className="text-green-500 text-sm">+8.2%</span>
                  </div>
                  <div className="text-xl font-bold">$2,340</div>
                  <div className="mt-2 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-secondary rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>
              
              {/* Mini Insights */}
              <div className="bg-background/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Latest Insight</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your emergency fund is well-positioned. Consider increasing retirement contributions by 2% to optimize tax benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection