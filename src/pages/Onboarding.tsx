import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, DollarSign, Home, GraduationCap, Shield, ArrowRight, ArrowLeft } from "lucide-react";

const steps = [
  { title: "Income & Job Info", description: "Tell us about your income sources" },
  { title: "Monthly Expenses", description: "Your regular spending patterns" },
  { title: "Life Goals", description: "What are you working toward?" },
  { title: "Risk Profile", description: "How do you handle surprises?" },
  { title: "Preferences", description: "Customize your experience" }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    salary: "",
    employer: "",
    bonuses: false,
    rent: "",
    subscriptions: "",
    hasKids: false,
    goals: [] as string[],
    emergencyFund: 0,
    riskTolerance: 50,
    darkMode: true,
    notifications: true
  });
  
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FlowSightFi</span>
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">{steps[currentStep].title}</h1>
            <p className="text-white/70">{steps[currentStep].description}</p>
          </div>
          
          <Progress value={progress} className="w-full max-w-md mx-auto h-2" />
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
          
          {/* Step 1: Income & Job Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-white">Annual Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="$75,000"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employer" className="text-white">Employer (Optional)</Label>
                  <Input
                    id="employer"
                    placeholder="Company name"
                    value={formData.employer}
                    onChange={(e) => setFormData(prev => ({ ...prev, employer: e.target.value }))}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bonuses"
                    checked={formData.bonuses}
                    onChange={(e) => setFormData(prev => ({ ...prev, bonuses: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="bonuses" className="text-white">I receive bonuses or variable income</Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Monthly Expenses */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent" className="text-white">Monthly Rent/Mortgage</Label>
                  <Input
                    id="rent"
                    type="number"
                    placeholder="$2,200"
                    value={formData.rent}
                    onChange={(e) => setFormData(prev => ({ ...prev, rent: e.target.value }))}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subscriptions" className="text-white">Monthly Subscriptions</Label>
                  <Input
                    id="subscriptions"
                    type="number"
                    placeholder="$150"
                    value={formData.subscriptions}
                    onChange={(e) => setFormData(prev => ({ ...prev, subscriptions: e.target.value }))}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasKids"
                    checked={formData.hasKids}
                    onChange={(e) => setFormData(prev => ({ ...prev, hasKids: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="hasKids" className="text-white">I have children or dependents</Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Life Goals */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <p className="text-white/80 text-sm">Select all that apply:</p>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "house", label: "Buy a Home", icon: Home },
                  { id: "retirement", label: "Retirement", icon: Shield },
                  { id: "education", label: "Education", icon: GraduationCap },
                  { id: "emergency", label: "Emergency Fund", icon: Shield },
                  { id: "travel", label: "Travel", icon: DollarSign },
                  { id: "debt", label: "Pay Off Debt", icon: DollarSign }
                ].map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = formData.goals.includes(goal.id);
                  
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-lg border transition-all ${
                        isSelected 
                          ? "bg-white/20 border-white/50 text-white" 
                          : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{goal.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Risk Profile */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-white">How would you handle a surprise $1,000 expense?</Label>
                
                <div className="space-y-3">
                  {[
                    { value: 0, label: "I'd be in serious trouble", color: "text-red-300" },
                    { value: 25, label: "I'd need to use credit cards", color: "text-yellow-300" },
                    { value: 50, label: "I'd dip into savings", color: "text-blue-300" },
                    { value: 75, label: "I'd easily cover it", color: "text-green-300" },
                    { value: 100, label: "I wouldn't even notice", color: "text-green-200" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, emergencyFund: option.value }))}
                      className={`w-full p-3 text-left rounded-lg border transition-all ${
                        formData.emergencyFund === option.value
                          ? "bg-white/20 border-white/50"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <span className={option.color}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Dark Mode</Label>
                  <input
                    type="checkbox"
                    checked={formData.darkMode}
                    onChange={(e) => setFormData(prev => ({ ...prev, darkMode: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-white">Smart Notifications</Label>
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-lg">
                <h3 className="text-white font-semibold mb-2">You're all set!</h3>
                <p className="text-white/70 text-sm">
                  Ready to see your financial future? We'll generate your personalized timeline.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={prevStep} className="border-white/30 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}
            
            <Button onClick={nextStep} className="bg-white text-primary hover:bg-white/90">
              {currentStep === steps.length - 1 ? "Generate My Timeline" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Skip Option */}
        <div className="text-center">
          <Link to="/dashboard" className="text-white/60 text-sm hover:text-white hover:underline">
            Skip setup for now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;