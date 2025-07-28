import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadarChart } from '@/components/RadarChart';
import { WhatIfSlider } from '@/components/WhatIfSlider';
import { TimelineChart } from '@/components/TimelineChart';
import { computeFHSS, FinancialProfile, FHSSResponse } from '@/lib/fhss-calculator';
import { useProfile } from '@/hooks/useProfile';
import { TrendingUp, AlertTriangle, CheckCircle, Target, Lightbulb, Trophy, Zap } from 'lucide-react';
import { GamificationDashboard, AchievementBadge, FINANCIAL_ACHIEVEMENTS } from '@/components/Gamification';

export const FinancialHealthDashboard = () => {
  const { profile, financialData } = useProfile();
  const [currentScore, setCurrentScore] = useState<FHSSResponse | null>(null);
  const [baseProfile, setBaseProfile] = useState<FinancialProfile | null>(null);
  
  // Mock gamification stats - would come from backend
  const gameStats = {
    level: 7,
    totalPoints: 2840,
    pointsToNextLevel: 660,
    currentStreak: 12,
    longestStreak: 23,
    achievementsUnlocked: 8,
    totalAchievements: 15
  };
  useEffect(() => {
    if (profile && financialData) {
      const profileData: FinancialProfile = {
        monthlyIncome: (financialData.annual_salary || 0) / 12,
        incomeStability: 7, // Default, could be collected in onboarding
        incomeSourceCount: 1, // Default
        monthlyExpenses: (financialData.monthly_rent || 0) + (financialData.monthly_subscriptions || 0),
        essentialExpenses: financialData.monthly_rent || 0,
        discretionaryExpenses: financialData.monthly_subscriptions || 0,
        totalDebt: 0, // Would need to be collected
        monthlyDebtPayments: 0, // Would need to be collected
        creditUtilization: 0.3, // Default estimate
        liquidSavings: Math.max(0, ((financialData.annual_salary || 0) / 12) * 2), // Estimate
        investmentAccounts: 0, // Would need to be collected
        retirementAccounts: 0, // Would need to be collected
        age: 30, // Default, could be collected
        location: 'US',
        dependents: financialData.has_dependents ? 1 : 0
      };
      
      setBaseProfile(profileData);
      const score = computeFHSS(profileData);
      setCurrentScore(score);
    }
  }, [profile, financialData]);
  
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-accent-success';
    if (score >= 0.6) return 'text-warning';
    if (score >= 0.4) return 'text-accent';
    return 'text-destructive';
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Needs Improvement';
  };
  
  const getScoreBadgeVariant = (score: number) => {
    if (score >= 0.8) return 'default';
    if (score >= 0.6) return 'secondary';
    return 'destructive';
  };

  if (!currentScore || !baseProfile) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="w-24 h-24 bg-muted rounded-full mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-3 bg-muted rounded w-1/3 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Header - Psychologically Enhanced */}
      <Card className="p-6 bg-gradient-card hover-lift transition-smooth overflow-hidden relative">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${
            currentScore.fhss >= 0.8 ? 'bg-gradient-wealth' :
            currentScore.fhss >= 0.6 ? 'bg-gradient-confidence' :
            currentScore.fhss >= 0.4 ? 'bg-gradient-warning' : 'bg-gradient-danger'
          } animate-wealth-pulse`} />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-2 animate-data-reveal">
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Financial Health Score
            </h2>
            <p className="text-muted-foreground">
              Comprehensive analysis of your financial wellness
            </p>
            {/* Psychological Insight */}
            <div className="flex items-center gap-2 text-xs text-primary animate-insight-appear" style={{animationDelay: '0.3s'}}>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>
                {currentScore.fhss >= 0.8 ? "You're in excellent financial health! 🌟" :
                 currentScore.fhss >= 0.6 ? "You're on a solid financial path! 📈" :
                 currentScore.fhss >= 0.4 ? "Good progress, room to grow! 💪" :
                 "Let's build your financial strength! 🚀"}
              </span>
            </div>
          </div>
          
          <div className="text-center animate-chart-entry">
            {/* Enhanced Score Display */}
            <div className={`relative ${
              currentScore.fhss >= 0.8 ? 'animate-achievement-celebration' :
              currentScore.fhss >= 0.6 ? 'animate-confidence-glow' :
              'animate-growth-surge'
            }`}>
              <div className={`text-5xl font-bold ${getScoreColor(currentScore.fhss)} drop-shadow-sm`}>
                {Math.round(currentScore.fhss * 100)}
              </div>
              {/* Score Ring Animation */}
              <div className="absolute inset-0 -m-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted opacity-20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${currentScore.fhss * 283} 283`}
                    strokeLinecap="round"
                    className={getScoreColor(currentScore.fhss)}
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%',
                      transition: 'stroke-dasharray 1.5s ease-out'
                    }}
                  />
                </svg>
              </div>
            </div>
            <Badge 
              variant={getScoreBadgeVariant(currentScore.fhss)}
              className="mt-3 animate-bounce-subtle shadow-lg"
            >
              {getScoreLabel(currentScore.fhss)}
            </Badge>
            <div className="text-xs text-muted-foreground mt-2 opacity-80">
              {Math.round(currentScore.confidence * 100)}% confidence
            </div>
          </div>
        </div>
        
        {/* Confidence Interval */}
        <div className="mt-4 p-3 bg-background/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Score Range (95% confidence):</span>
            <span className="font-medium">
              {Math.round(currentScore.ci95[0] * 100)} - {Math.round(currentScore.ci95[1] * 100)}
            </span>
          </div>
        </div>
      </Card>

      {/* Gamification Section */}
      <GamificationDashboard stats={gameStats} />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="simulation">What-If</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
              <RadarChart 
                data={currentScore.subScores} 
                width={350} 
                height={350}
                className="flex justify-center"
              />
            </Card>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Financial Segment</div>
                    <div className="text-sm text-muted-foreground">{currentScore.segment}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-accent" />
                  <div>
                    <div className="font-medium">Top Priority</div>
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(currentScore.subScores)
                        .sort(([,a], [,b]) => a - b)[0][0]
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-success" />
                  <div>
                    <div className="font-medium">Strongest Area</div>
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(currentScore.subScores)
                        .sort(([,a], [,b]) => b - a)[0][0]
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Timeline Projection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Financial Projection</h3>
            <TimelineChart className="h-64" />
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(currentScore.subScores).map(([key, score]) => (
              <Card key={key} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </h4>
                    <Badge variant={getScoreBadgeVariant(score)}>
                      {Math.round(score * 100)}%
                    </Badge>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        score >= 0.8 ? 'bg-accent-success' :
                        score >= 0.6 ? 'bg-warning' :
                        score >= 0.4 ? 'bg-accent' : 'bg-destructive'
                      }`}
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {getScoreLabel(score)} - {
                      score >= 0.8 ? 'Keep up the great work!' :
                      score >= 0.6 ? 'Room for some improvement' :
                      score >= 0.4 ? 'Focus area for improvement' :
                      'Immediate attention needed'
                    }
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Adjust Your Financial Picture</h3>
              
              <WhatIfSlider
                metric="monthlyIncome"
                label="Monthly Income"
                baseProfile={baseProfile}
                min={1000}
                max={20000}
                step={100}
                formatValue={(value) => `$${value.toLocaleString()}`}
              />
              
              <WhatIfSlider
                metric="liquidSavings"
                label="Emergency Fund"
                baseProfile={baseProfile}
                min={0}
                max={50000}
                step={500}
                formatValue={(value) => `$${value.toLocaleString()}`}
              />
              
              <WhatIfSlider
                metric="monthlyExpenses"
                label="Monthly Expenses"
                baseProfile={baseProfile}
                min={500}
                max={15000}
                step={100}
                formatValue={(value) => `$${value.toLocaleString()}`}
              />
              
              <WhatIfSlider
                metric="totalDebt"
                label="Total Debt"
                baseProfile={baseProfile}
                min={0}
                max={100000}
                step={1000}
                formatValue={(value) => `$${value.toLocaleString()}`}
              />
            </div>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Live Score Impact</h4>
              <RadarChart 
                data={currentScore.subScores} 
                width={300} 
                height={300}
                className="flex justify-center"
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Critical Issues */}
          {currentScore.criticalIssues.length > 0 && (
            <Card className="p-6 border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-semibold text-destructive">Critical Issues</h3>
              </div>
              <div className="space-y-3">
                {currentScore.criticalIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">{issue}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
            </div>
            <div className="space-y-4">
              {currentScore.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="space-y-2">
                    <p className="text-sm">{recommendation}</p>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Peer Comparison */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">How You Compare</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your Score</span>
                <span className="font-semibold">{Math.round(currentScore.fhss * 100)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{currentScore.segment} Average</span>
                <span className="font-semibold">67</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">National Average</span>
                <span className="font-semibold">58</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};