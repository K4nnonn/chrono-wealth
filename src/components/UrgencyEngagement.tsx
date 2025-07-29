import { useState, useEffect } from 'react'
import { Clock, Flame, Users, Zap, AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'

// Urgency Timer Component
export function UrgencyTimer() {
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 3600) // Reset after reaching 0
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }
  
  return (
    <div className="urgency-indicator text-white py-3 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <div className="relative z-10 flex items-center justify-center gap-4">
        <Clock className="w-5 h-5 animate-pulse" />
        <span className="font-medium">
          Limited Time: Save $240/year with annual billing - Offer ends in {formatTime(timeLeft)}
        </span>
        <Button variant="outline" size="sm" className="bg-white text-orange-600 border-white hover:bg-white/90 hover:scale-105 transition-all">
          Claim Offer
        </Button>
      </div>
    </div>
  )
}

// Limited Spots Component
export function LimitedSpots() {
  const [spots, setSpots] = useState(7)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && spots > 2) {
        setSpots(prev => prev - 1)
      }
    }, 30000) // Someone joins every 30 seconds
    return () => clearInterval(interval)
  }, [spots])
  
  return (
    <div className="exclusive-access text-white rounded-2xl p-6 card-lift">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-300" />
            Premium AI Advisor
          </h4>
          <p className="text-sm opacity-90">Personalized financial guidance</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold animate-counter-up">{spots}</p>
          <p className="text-sm opacity-90">spots left today</p>
        </div>
      </div>
      
      <div className="mb-4 bg-white/20 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-white to-orange-200 transition-all duration-500 animate-urgency-pulse"
          style={{ width: `${(spots / 10) * 100}%` }}
        />
      </div>
      
      <Button className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold">
        Reserve My Spot
      </Button>
    </div>
  )
}

// Social Proof Activity Feed
export function LiveActivityFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
  const activities = [
    { user: 'Sarah M.', action: 'saved $500 this month', time: '2 min ago', avatar: 1, achievement: '💰' },
    { user: 'Mike R.', action: 'reached emergency fund goal', time: '5 min ago', avatar: 2, achievement: '🎯' },
    { user: 'Jennifer L.', action: 'paid off credit card', time: '12 min ago', avatar: 3, achievement: '🎉' },
    { user: 'David K.', action: 'optimized investment portfolio', time: '18 min ago', avatar: 4, achievement: '📈' },
    { user: 'Lisa W.', action: 'automated savings plan', time: '25 min ago', avatar: 5, achievement: '⚡' }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % activities.length)
        setIsVisible(true)
      }, 300)
    }, 8000) // Change every 8 seconds
    
    return () => clearInterval(interval)
  }, [activities.length])
  
  const currentActivity = activities[currentIndex]
  
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 flex items-center gap-3 transition-all duration-300 card-lift ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {currentActivity.user.charAt(0)}
          </div>
          <span className="absolute -top-1 -right-1 text-lg animate-celebration-bounce">
            {currentActivity.achievement}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-semibold text-foreground">{currentActivity.user}</span>
            <span className="text-muted-foreground"> {currentActivity.action}</span>
          </p>
          <p className="text-xs text-muted-foreground">{currentActivity.time}</p>
        </div>
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="w-2 h-2 bg-white rounded-full"></span>
        </div>
      </div>
    </div>
  )
}

// Hot Deals Banner
export function HotDealsBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
      <div className="relative z-10 flex items-center justify-center gap-2 text-sm font-semibold">
        <Flame className="w-4 h-4" />
        <span>🔥 HOT DEAL: 50% OFF Premium Plans - Limited to first 100 users today!</span>
        <Flame className="w-4 h-4" />
      </div>
    </div>
  )
}

// Peak Usage Indicator
export function PeakUsageIndicator() {
  const [isHighTraffic, setIsHighTraffic] = useState(true)
  
  useEffect(() => {
    // Simulate peak hours
    const checkPeakTime = () => {
      const hour = new Date().getHours()
      setIsHighTraffic(hour >= 9 && hour <= 17) // Business hours
    }
    
    checkPeakTime()
    const interval = setInterval(checkPeakTime, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])
  
  if (!isHighTraffic) return null
  
  return (
    <div className="flex items-center justify-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
        High traffic detected - Join now to avoid delays
      </span>
      <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400 animate-pulse" />
    </div>
  )
}

// Performance Boost Badge
export function PerformanceBoostBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-glow">
      <Zap className="w-4 h-4 animate-pulse" />
      <span className="text-sm font-semibold">3x Faster Than Competitors</span>
    </div>
  )
}