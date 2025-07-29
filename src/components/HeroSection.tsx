import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, PlayCircle } from 'lucide-react'
import { Button } from './ui/button'
import { FloatingSecurityBadge, LiveUserCounter } from './TrustSignals'
import { UrgencyTimer } from './UrgencyEngagement'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
      {/* Trust Signals */}
      <FloatingSecurityBadge />
      <LiveUserCounter />
      
      {/* Urgency Banner */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <UrgencyTimer />
      </div>
      
      {/* Enterprise Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Premium gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-enterprise-glow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-accent/20 rounded-full blur-3xl animate-enterprise-glow" style={{animationDelay: '1.5s'}}></div>
        
        {/* Financial pattern overlay */}
        <div className="absolute inset-0 bg-financial-pattern"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-enterprise opacity-30"></div>
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-5xl mx-auto animate-slide-up">
          {/* Premium status indicator */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold px-6 py-3 rounded-full mb-8 shadow-glow">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400/60 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 shadow-glow"></span>
            </span>
            Enterprise-Grade AI Financial Intelligence
            <span className="ml-2 px-2 py-1 bg-green-400/20 text-green-300 text-xs rounded-full font-bold">LIVE</span>
          </div>

          {/* Hero headline with updated messaging */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.9] tracking-tight">
            <span className="block text-white mb-2 drop-shadow-lg">See 90 Days Ahead</span>
            <span className="block text-white mb-4 drop-shadow-lg">of Your Money</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl font-medium text-white/90 drop-shadow-md">
              AI simulations for income, bills, crypto—minus the judgment
            </span>
          </h1>

          {/* Updated value proposition */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-md">
            See exactly where your money will be in 90 days. <span className="text-white font-semibold">No guesswork, no spreadsheets</span>—just clear AI insights 
            that help you make confident financial decisions without the complexity.
          </p>

          {/* Updated CTA Section */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-scale-in" style={{animationDelay: '0.3s'}}>
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg bg-gradient-primary hover:shadow-glow hover-enterprise border-0 group"
              onClick={() => window.dispatchEvent(new Event('openDemoModal'))}
            >
              <PlayCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Try Simulation
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/5 hover-enterprise group">
              <Link to="/auth">
                <span className="mr-3">✨</span>
                Get Started
                <span className="ml-3 opacity-60 group-hover:opacity-100 transition-opacity">Free</span>
              </Link>
            </Button>
          </div>

          {/* Trust text below buttons */}
          <div className="text-center mb-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <p className="text-white/80 text-lg font-medium">
              🔒 Secure • 🤖 AI-Powered • 👀 Free Preview
            </p>
          </div>

          {/* Premium trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium text-white/80">Enterprise Security</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium text-white/80">60-Second Setup</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium text-white/80">SOC 2 Compliant</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium text-white/80">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Enterprise Dashboard Preview */}
        <div className="mt-20 relative animate-slide-up" style={{animationDelay: '0.9s'}}>
          <div className="relative max-w-7xl mx-auto">
            {/* Premium frame with depth */}
            <div className="relative card-premium rounded-2xl p-3 hover-enterprise">
              <div className="bg-gradient-card rounded-xl p-8 min-h-[600px] relative overflow-hidden border border-primary/10">
                {/* Enterprise background effects */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-wealth animate-enterprise-glow" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-gradient-confidence animate-enterprise-glow" style={{animationDelay: '2s'}} />
                </div>
                
                {/* Premium dashboard header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-accent-success animate-pulse" />
                      <h3 className="text-2xl font-bold text-foreground">Enterprise Financial Intelligence</h3>
                    </div>
                    <p className="text-muted-foreground">Real-time AI-powered wealth optimization platform</p>
                  </div>
                  <div className="text-center card-enterprise p-4 rounded-xl">
                    <div className="text-4xl font-bold text-gradient-wealth mb-1">94</div>
                    <div className="text-sm text-muted-foreground font-medium">Financial Health Score</div>
                    <div className="text-xs text-accent-success">+12% vs last quarter</div>
                  </div>
                </div>
              
                {/* Enterprise KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card-enterprise p-6 hover-enterprise group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-muted-foreground tracking-wide">TOTAL SAVINGS</span>
                      <div className="flex items-center gap-2">
                        <span className="text-accent-success text-sm font-bold">+24.7%</span>
                        <div className="w-6 h-6 bg-gradient-wealth rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="text-xs">💎</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-3">$2,847,392</div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-gradient-wealth rounded-full w-4/5 transition-all duration-1000"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Target: $3.2M by Q4 2025</p>
                  </div>
                  
                  <div className="card-enterprise p-6 hover-enterprise group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-muted-foreground tracking-wide">MONTHLY CASH FLOW</span>
                      <div className="flex items-center gap-2">
                        <span className="text-accent-success text-sm font-bold">+18.3%</span>
                        <div className="w-6 h-6 bg-gradient-confidence rounded-full flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse">
                          <span className="text-xs">🚀</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-3">$24,780</div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-gradient-confidence rounded-full w-3/5 transition-all duration-1000"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">43-day improvement streak</p>
                  </div>

                  <div className="card-enterprise p-6 hover-enterprise group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-muted-foreground tracking-wide">AI OPTIMIZATION</span>
                      <div className="flex items-center gap-2">
                        <span className="text-primary text-sm font-bold">Level 12</span>
                        <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="text-xs">🧠</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-3">$127K</div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-gradient-primary rounded-full w-5/6 transition-all duration-1000"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Saved through AI recommendations</p>
                  </div>
                </div>
              
                {/* Enterprise Insights Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card-enterprise p-6 hover-enterprise">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground tracking-wide">AI BUDGET INSIGHTS</span>
                        <div className="w-8 h-8 bg-gradient-forecast rounded-lg flex items-center justify-center">
                          <span className="text-sm">📊</span>
                        </div>
                      </div>
                      <span className="text-xs text-accent-info font-medium px-2 py-1 bg-accent-info/10 rounded-full">LIVE</span>
                    </div>
                    <p className="text-sm text-foreground font-medium mb-2">
                      Spending pattern analysis: You can save 15% by optimizing subscriptions
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      AI recommends consolidating streaming services and switching grocery stores. Potential monthly savings: $340
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs hover-enterprise">View Savings Plan</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Remind Later</Button>
                    </div>
                  </div>
                  
                  <div className="card-enterprise p-6 hover-enterprise">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground tracking-wide">BEHAVIORAL PATTERN</span>
                        <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center animate-pulse">
                          <span className="text-sm">🎯</span>
                        </div>
                      </div>
                      <span className="text-xs text-accent-success font-medium px-2 py-1 bg-accent-success/10 rounded-full">OPTIMIZED</span>
                    </div>
                    <p className="text-sm text-foreground font-medium mb-2">
                      Spending discipline improved 340% in Q4 vs Q3
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Weekend optimization saved $3,247 last month. AI suggests automating grocery delivery to maintain momentum.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs hover-enterprise">Setup Automation</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">View Trends</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Premium depth indicator */}
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-primary rounded-full shadow-glow"></div>
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-gradient-wealth rounded-full shadow-glow"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection