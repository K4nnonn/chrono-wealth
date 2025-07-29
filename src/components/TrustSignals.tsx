import { useState, useEffect } from 'react'
import { Shield, Lock, CheckCircle, Star } from 'lucide-react'

// Floating Security Badge Component
export function FloatingSecurityBadge() {
  return (
    <div className="absolute top-4 right-4 animate-float z-10">
      <div className="trust-badge backdrop-blur-md rounded-full p-3 border border-white/20 shadow-glow">
        <Shield className="w-6 h-6 text-white" />
        <span className="absolute -top-2 -right-2 success-celebration text-xs px-2 py-1 rounded-full text-black font-bold">
          SECURE
        </span>
      </div>
    </div>
  )
}

// Live User Counter Component
export function LiveUserCounter() {
  const [activeUsers, setActiveUsers] = useState(2847)
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time user activity
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 15000) // Update every 15 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-500 animate-scale-in" 
                 style={{animationDelay: `${i * 0.1}s`}}>
              <span className="sr-only">User avatar</span>
            </div>
          ))}
        </div>
        <span className="text-sm font-medium text-white">
          <span className="animate-counter-up text-green-300 font-bold">{activeUsers.toLocaleString()}</span> active now
        </span>
      </div>
    </div>
  )
}

// Trust Indicators Component
export function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: "Enterprise Security",
      subtitle: "Bank-level encryption",
      color: "text-green-400"
    },
    {
      icon: CheckCircle,
      title: "60-Second Setup", 
      subtitle: "Quick & painless",
      color: "text-blue-400"
    },
    {
      icon: Lock,
      title: "SOC 2 Compliant",
      subtitle: "Audited annually",
      color: "text-purple-400"
    },
    {
      icon: Star,
      title: "24/7 Support",
      subtitle: "Always here to help", 
      color: "text-yellow-400"
    }
  ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center animate-slide-in-up">
      {indicators.map((indicator, index) => (
        <div key={index} className="flex flex-col items-center gap-2 group">
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform">
            <indicator.icon className={`w-6 h-6 ${indicator.color}`} />
          </div>
          <div>
            <span className="text-sm font-semibold text-white block">{indicator.title}</span>
            <span className="text-xs text-white/70">{indicator.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Money-Back Guarantee Component
export function MoneyBackGuarantee() {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl p-8 text-center max-w-2xl mx-auto card-lift">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full mb-4 animate-trust-glow">
        <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-green-900 dark:text-green-100">30-Day Money-Back Guarantee</h3>
      <p className="text-green-700 dark:text-green-300 mb-4">
        Try FlowSight Fi risk-free. If you don't save at least 10x your subscription cost 
        in the first 30 days, we'll refund every penny. No questions asked.
      </p>
      <div className="flex items-center justify-center gap-4 text-sm text-green-600 dark:text-green-400">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          No hidden fees
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Cancel anytime
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Export your data
        </span>
      </div>
    </div>
  )
}

// Success Statistics Component
export function SuccessStatistics() {
  const stats = [
    { value: 18500000, prefix: '$', suffix: '+', label: 'Saved by our users', color: 'text-green-500' },
    { value: 52847, prefix: '', suffix: '+', label: 'Active users', color: 'text-blue-500' },
    { value: 94, prefix: '', suffix: '%', label: 'Success rate', color: 'text-purple-500' },
    { value: 7, prefix: '', suffix: ' years', label: 'Trusted experience', color: 'text-orange-500' }
  ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center group">
          <div className={`text-3xl font-bold ${stat.color} mb-1 animate-counter-up group-hover:scale-110 transition-transform`}>
            {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
          </div>
          <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

// Trust Badge Collection
export function TrustBadges() {
  const badges = [
    { name: 'FDIC Insured', image: '🏛️', desc: 'Up to $250,000' },
    { name: 'SOC 2 Certified', image: '🔒', desc: 'Audited security' },
    { name: 'Bank-Level Security', image: '🛡️', desc: '256-bit encryption' },
    { name: '99.9% Uptime', image: '⚡', desc: 'Always available' }
  ]
  
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {badges.map((badge, index) => (
        <div key={index} className="flex flex-col items-center group cursor-pointer card-lift">
          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
            <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center relative z-10 border border-white/20">
              <span className="text-2xl">{badge.image}</span>
            </div>
          </div>
          <p className="text-xs mt-2 font-medium text-center">
            <span className="block text-foreground">{badge.name}</span>
            <span className="text-muted-foreground">{badge.desc}</span>
          </p>
        </div>
      ))}
    </div>
  )
}