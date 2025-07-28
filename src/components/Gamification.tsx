import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  Crown, 
  Shield, 
  TrendingUp,
  Calendar,
  Award,
  Flame,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface GameStats {
  level: number;
  totalPoints: number;
  pointsToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  achievementsUnlocked: number;
  totalAchievements: number;
}

// Achievement System Component
export const AchievementBadge: React.FC<{ achievement: Achievement; size?: 'sm' | 'md' | 'lg' }> = ({ 
  achievement, 
  size = 'md' 
}) => {
  const Icon = achievement.icon;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm', 
    lg: 'w-16 h-16 text-base'
  };

  const tierColors = {
    bronze: 'from-amber-600 to-amber-800 border-amber-500',
    silver: 'from-gray-400 to-gray-600 border-gray-400',
    gold: 'from-yellow-400 to-yellow-600 border-yellow-400',
    platinum: 'from-purple-400 to-purple-600 border-purple-400'
  };

  return (
    <div className={cn(
      "relative group cursor-pointer",
      !achievement.unlocked && "opacity-40 grayscale"
    )}>
      <div className={cn(
        "rounded-full bg-gradient-to-br border-2 flex items-center justify-center transition-all duration-300",
        sizeClasses[size],
        tierColors[achievement.tier],
        achievement.unlocked && "animate-pulse hover:scale-110 shadow-lg"
      )}>
        <Icon className={cn(
          "text-white",
          size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
        )} />
      </div>
      
      {achievement.unlocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
          <span className="text-white text-xs">✓</span>
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-background border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 min-w-max">
        <p className="font-semibold text-sm">{achievement.title}</p>
        <p className="text-xs text-muted-foreground">{achievement.description}</p>
        <p className="text-xs text-primary font-medium">{achievement.points} points</p>
        {achievement.progress !== undefined && (
          <div className="mt-2">
            <Progress value={(achievement.progress / (achievement.maxProgress || 1)) * 100} className="h-1" />
            <p className="text-xs text-muted-foreground mt-1">
              {achievement.progress}/{achievement.maxProgress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Streak Counter Component
export const StreakCounter: React.FC<{ streak: number; type: string }> = ({ streak, type }) => (
  <Card className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200 animate-confidence-glow">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
        <span className="text-2xl font-bold text-orange-600">{streak}</span>
      </div>
      <div>
        <p className="font-medium text-sm">{type} Streak</p>
        <p className="text-xs text-muted-foreground">Keep it going!</p>
      </div>
    </div>
  </Card>
);

// Level Progress Component
export const LevelProgress: React.FC<{ stats: GameStats }> = ({ stats }) => (
  <Card className="p-4 bg-gradient-wealth/10 animate-data-reveal">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Crown className="w-5 h-5 text-primary animate-bounce-subtle" />
        <span className="font-bold">Level {stats.level}</span>
      </div>
      <Badge variant="secondary" className="animate-pulse">
        {stats.totalPoints.toLocaleString()} XP
      </Badge>
    </div>
    <Progress 
      value={(stats.totalPoints / (stats.totalPoints + stats.pointsToNextLevel)) * 100} 
      className="h-3 mb-2" 
    />
    <p className="text-xs text-muted-foreground">
      {stats.pointsToNextLevel} XP to Level {stats.level + 1}
    </p>
  </Card>
);

// Challenge Card Component
export const ChallengeCard: React.FC<{
  title: string;
  description: string;
  reward: number;
  progress: number;
  maxProgress: number;
  timeLeft?: string;
}> = ({ title, description, reward, progress, maxProgress, timeLeft }) => (
  <Card className="p-4 hover-lift transition-smooth animate-insight-appear">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Badge variant="outline" className="ml-2">
        <Gift className="w-3 h-3 mr-1" />
        {reward} XP
      </Badge>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span>Progress</span>
        <span>{progress}/{maxProgress}</span>
      </div>
      <Progress value={(progress / maxProgress) * 100} className="h-2" />
      {timeLeft && (
        <p className="text-xs text-orange-600 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {timeLeft} remaining
        </p>
      )}
    </div>
  </Card>
);

// Sample achievements data
export const FINANCIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-login',
    title: 'Welcome Aboard!',
    description: 'Complete your first login',
    icon: Star,
    tier: 'bronze',
    points: 50,
    unlocked: true
  },
  {
    id: 'savings-streak-7',
    title: 'Savings Warrior',
    description: 'Save money for 7 days straight',
    icon: Shield,
    tier: 'silver',
    points: 200,
    unlocked: false,
    progress: 4,
    maxProgress: 7
  },
  {
    id: 'budget-master',
    title: 'Budget Master',
    description: 'Stay under budget for a full month',
    icon: Trophy,
    tier: 'gold',
    points: 500,
    unlocked: false,
    progress: 18,
    maxProgress: 30
  },
  {
    id: 'emergency-fund',
    title: 'Safety Net Hero',
    description: 'Build a 6-month emergency fund',
    icon: Crown,
    tier: 'platinum',
    points: 1000,
    unlocked: false,
    progress: 2,
    maxProgress: 6
  }
];

// Gamification Dashboard Component
export const GamificationDashboard: React.FC<{ stats: GameStats }> = ({ stats }) => (
  <div className="space-y-6 animate-chart-entry">
    {/* Level and XP */}
    <LevelProgress stats={stats} />
    
    {/* Streaks */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StreakCounter streak={stats.currentStreak} type="Savings" />
      <StreakCounter streak={stats.longestStreak} type="Best" />
    </div>
    
    {/* Achievements Grid */}
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        Achievements ({stats.achievementsUnlocked}/{stats.totalAchievements})
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {FINANCIAL_ACHIEVEMENTS.map(achievement => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </Card>
  </div>
);

// XP Notification Component
export const XPNotification: React.FC<{ points: number; reason: string; onClose: () => void }> = ({
  points,
  reason,
  onClose
}) => (
  <div className="fixed top-4 right-4 z-50 animate-achievement-celebration">
    <Card className="p-4 bg-gradient-success text-white border-0 shadow-elegant">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold">+{points} XP</p>
          <p className="text-sm opacity-90">{reason}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>×</Button>
      </div>
    </Card>
  </div>
);