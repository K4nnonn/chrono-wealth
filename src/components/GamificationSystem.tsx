import { useState, useEffect } from 'react'
import { Check, Star, Trophy, Target, TrendingUp, Zap, Award, Crown } from 'lucide-react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'

// Achievement System
interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

// Level Progress Component
export function LevelProgress() {
  const [level] = useState(3)
  const [currentXP] = useState(650)
  const [nextLevelXP] = useState(1000)
  
  const progressPercentage = (currentXP / nextLevelXP) * 100
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 card-lift">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Your Financial Journey</h3>
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          <span className="text-sm text-muted-foreground">Level</span>
          <span className="text-3xl font-bold text-purple-600 animate-counter-up">{level}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{currentXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
        <Progress value={progressPercentage} className="h-4" />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {nextLevelXP - currentXP} XP until Level {level + 1}
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Achievements</p>
          <p className="font-bold text-foreground">12/20</p>
        </div>
        <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Goals Met</p>
          <p className="font-bold text-foreground">7</p>
        </div>
        <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="font-bold text-foreground">24 days</p>
        </div>
      </div>
    </div>
  )
}

// Achievement Badge Component
export function AchievementBadge({ achievement }: { achievement: Achievement }) {
  return (
    <div className={`relative p-4 rounded-lg border-2 transition-all card-lift ${
      achievement.unlocked 
        ? 'bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 shadow-md' 
        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'
    }`}>
      {achievement.unlocked && (
        <div className="absolute -top-2 -right-2 success-celebration rounded-full p-1 animate-celebration-bounce">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={`text-2xl ${achievement.unlocked ? 'animate-scale-in' : ''}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-foreground">{achievement.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
          
          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mt-2">
              <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {achievement.progress}/{achievement.maxProgress}
              </p>
            </div>
          )}
          
          <p className="text-xs font-bold text-purple-600 mt-2">+{achievement.points} XP</p>
        </div>
      </div>
    </div>
  )
}

// Streak Counter Component
export function StreakCounter() {
  const [currentStreak, setCurrentStreak] = useState(24)
  const [bestStreak] = useState(47)
  
  useEffect(() => {
    // Simulate streak updates
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setCurrentStreak(prev => prev + 1)
      }
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-foreground">Savings Streak</span>
        </div>
        <span className="text-xs bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
          🔥 On Fire!
        </span>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-orange-600 animate-counter-up">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">days current</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-muted-foreground">{bestStreak}</p>
          <p className="text-xs text-muted-foreground">days best</p>
        </div>
      </div>
    </div>
  )
}

// Challenge Card Component
export function ChallengeCard() {
  const challenges = [
    {
      title: "Save $500 This Month",
      description: "Track your expenses and reduce spending by 15%",
      reward: 500,
      progress: 75,
      timeLeft: "12 days left",
      difficulty: "Medium"
    },
    {
      title: "Investment Diversification",
      description: "Spread investments across 5 different asset classes",
      reward: 750,
      progress: 40,
      timeLeft: "18 days left", 
      difficulty: "Hard"
    }
  ]
  
  return (
    <div className="space-y-4">
      {challenges.map((challenge, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 card-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  challenge.difficulty === 'Hard' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </div>
            <div className="text-right ml-4">
              <p className="text-lg font-bold text-green-600">+{challenge.reward} XP</p>
              <p className="text-xs text-muted-foreground">{challenge.timeLeft}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{challenge.progress}%</span>
            </div>
            <Progress value={challenge.progress} className="h-3" />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button size="sm" className="flex-1 premium-button">
              Track Progress
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

// XP Notification Component
export function XPNotification({ xp, reason }: { xp: number; reason: string }) {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (!isVisible) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-up">
      <div className="success-celebration text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <Star className="w-5 h-5 animate-celebration-bounce" />
        <div>
          <p className="font-semibold">+{xp} XP Earned!</p>
          <p className="text-xs opacity-90">{reason}</p>
        </div>
      </div>
    </div>
  )
}

// Main Gamification Dashboard
export function GamificationDashboard() {
  const sampleAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your profile setup',
      icon: '🏁',
      points: 100,
      unlocked: true
    },
    {
      id: '2',
      title: 'Budget Master',
      description: 'Create your first budget',
      icon: '📊',
      points: 200,
      unlocked: true
    },
    {
      id: '3',
      title: 'Savings Hero',
      description: 'Save $1,000 this month',
      icon: '💰',
      points: 300,
      unlocked: false,
      progress: 7,
      maxProgress: 10
    },
    {
      id: '4',
      title: 'Investment Pro',
      description: 'Make your first investment',
      icon: '📈',
      points: 500,
      unlocked: false
    }
  ]
  
  return (
    <div className="grid gap-6">
      <LevelProgress />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </h3>
          <div className="grid gap-3">
            {sampleAchievements.slice(0, 2).map(achievement => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Active Challenges
          </h3>
          <ChallengeCard />
        </div>
      </div>
      
      <StreakCounter />
    </div>
  )
}