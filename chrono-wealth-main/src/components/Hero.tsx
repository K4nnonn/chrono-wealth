import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Brain, Users, BadgeCheck, ShieldCheck } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";

/**
 * The Hero component renders the top section of the landing page.  It has been
 * updated to better follow the psychological design guidelines.
 */
const Hero = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const navigate = useNavigate();

  const handleGetAccess = () => {
    setShowEmailModal(true);
  };

  const handleSignUp = () => {
    setShowEmailModal(false);
    navigate('/auth?mode=signup');
  };

  return (
    <>
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSignUp={handleSignUp}
        title="Get Early Access"
        description="Join FlowSightFi and start seeing your financial future today."
      />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-glow rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-success rounded-full blur-3xl opacity-15 animate-pulse delay-1000"></div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-slate-900 text-white border border-slate-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  <Brain className="w-4 h-4" />
                  {/* Updated value proposition */}
                  The only AI that catches financial mistakes before you make them
                </div>

                {/* New headline acknowledging user pain */}
                <h2 className="text-2xl lg:text-3xl font-semibold text-primary max-w-xl">
                  Tired of losing sleep over money decisions?
                </h2>

                {/* Existing product name */}
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Flow<span className="text-transparent bg-gradient-to-r from-primary-glow to-accent bg-clip-text">Sight</span>Fi
                </h1>

                {/* Refined tagline emphasising clarity over chaos */}
                <p className="text-xl lg:text-2xl text-white/80 max-w-xl">
                  Finally, an AI that turns financial chaos into clear action plans.
                </p>

                {/* Updated supporting description */}
                <p className="text-lg text-white/70 max-w-2xl">
                  Increase your net worth by an average of $47,000 in the first year. Our AI‑powered forecasting shows you exactly how to get there across all your financial streams.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* Primary CTA emphasises risk‑free analysis */}
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-glow group"
                  onClick={handleGetAccess}
                >
                  Get My Risk‑Free Financial Analysis
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                {/* Secondary CTA converted to subtle text link */}
                <Button
                  variant="link"
                  size="lg"
                  className="text-white underline hover:text-accent transition-colors px-0"
                  onClick={() => {
                    /* TODO: implement demo link or modal invocation. */
                  }}
                >
                  Watch 2‑Minute Demo
                </Button>
              </div>

              {/* Trust Indicators and social proof */}
              <div className="flex flex-col gap-4 mt-6">
                {/* Base trust indicators */}
                <div className="flex items-center gap-6 justify-center lg:justify-start text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Bank‑level Security
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    AI‑Powered Forecasts
                  </div>
                </div>
                {/* Added social proof and credibility badges */}
                <div className="flex flex-col sm:flex-row items-center gap-4 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Join 12,847 people who've transformed their finances</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    <span>Built by former Goldman Sachs quantitative analysts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Bank‑level security + human oversight on every AI recommendation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content – Dashboard Preview (unchanged) */}
            <div className="relative">
              <div className="relative z-10">
                <Card className="p-6 bg-gradient-card shadow-glow border-white/20">
                  <img
                    src={heroDashboard}
                    alt="FlowSightFi Dashboard Preview"
                    className="w-full h-auto rounded-lg shadow-card"
                  />
                </Card>

                {/* Floating Stats Cards */}
                <Card className="absolute -top-4 -left-4 p-4 bg-gradient-success shadow-card">
                  <div className="text-accent-success text-sm font-medium">Net Worth Forecast</div>
                  <div className="text-2xl font-bold text-accent-foreground">+$12,450</div>
                  <div className="text-xs text-accent-foreground/70">↗ Next 6 months</div>
                </Card>

                <Card className="absolute -bottom-4 -right-4 p-4 bg-white shadow-card">
                  <div className="text-primary text-sm font-medium">Bills Alert</div>
                  <div className="text-2xl font-bold text-foreground">3 days</div>
                  <div className="text-xs text-muted-foreground">Until rent payment</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Brain, Users, BadgeCheck, ShieldCheck } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";

/**
 * The Hero component renders the top section of the landing page.  It has been
 * updated to better follow the psychological design guidelines.
 */
const Hero = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const navigate = useNavigate();

  const handleGetAccess = () => {
    setShowEmailModal(true);
  };

  const handleSignUp = () => {
    setShowEmailModal(false);
    navigate('/auth?mode=signup');
  };

  return (
    <>
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSignUp={handleSignUp}
        title="Get Early Access"
        description="Join FlowSightFi and start seeing your financial future today."
      />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-glow rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-success rounded-full blur-3xl opacity-15 animate-pulse delay-1000"></div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-slate-900 text-white border border-slate-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  <Brain className="w-4 h-4" />
                  {/* Updated value proposition */}
                  The only AI that catches financial mistakes before you make them
                </div>

                {/* New headline acknowledging user pain */}
                <h2 className="text-2xl lg:text-3xl font-semibold text-primary max-w-xl">
                  Tired of losing sleep over money decisions?
                </h2>

                {/* Existing product name */}
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Flow<span className="text-transparent bg-gradient-to-r from-primary-glow to-accent bg-clip-text">Sight</span>Fi
                </h1>

                {/* Refined tagline emphasising clarity over chaos */}
                <p className="text-xl lg:text-2xl text-white/80 max-w-xl">
                  Finally, an AI that turns financial chaos into clear action plans.
                </p>

                {/* Updated supporting description */}
                <p className="text-lg text-white/70 max-w-2xl">
                  Increase your net worth by an average of $47,000 in the first year. Our AI‑powered forecasting shows you exactly how to get there across all your financial streams.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* Primary CTA emphasises risk‑free analysis */}
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-glow group"
                  onClick={handleGetAccess}
                >
                  Get My Risk‑Free Financial Analysis
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                {/* Secondary CTA converted to subtle text link */}
                <Button
                  variant="link"
                  size="lg"
                  className="text-white underline hover:text-accent transition-colors px-0"
                  onClick={() => {
                    /* TODO: implement demo link or modal invocation. */
                  }}
                >
                  Watch 2‑Minute Demo
                </Button>
              </div>

              {/* Trust Indicators and social proof */}
              <div className="flex flex-col gap-4 mt-6">
                {/* Base trust indicators */}
                <div className="flex items-center gap-6 justify-center lg:justify-start text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Bank‑level Security
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    AI‑Powered Forecasts
                  </div>
                </div>
                {/* Added social proof and credibility badges */}
                <div className="flex flex-col sm:flex-row items-center gap-4 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Join 12,847 people who've transformed their finances</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    <span>Built by former Goldman Sachs quantitative analysts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Bank‑level security + human oversight on every AI recommendation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content – Dashboard Preview (unchanged) */}
            <div className="relative">
              <div className="relative z-10">
                <Card className="p-6 bg-gradient-card shadow-glow border-white/20">
                  <img
                    src={heroDashboard}
                    alt="FlowSightFi Dashboard Preview"
                    className="w-full h-auto rounded-lg shadow-card"
                  />
                </Card>

                {/* Floating Stats Cards */}
                <Card className="absolute -top-4 -left-4 p-4 bg-gradient-success shadow-card">
                  <div className="text-accent-success text-sm font-medium">Net Worth Forecast</div>
                  <div className="text-2xl font-bold text-accent-foreground">+$12,450</div>
                  <div className="text-xs text-accent-foreground/70">↗ Next 6 months</div>
                </Card>

                <Card className="absolute -bottom-4 -right-4 p-4 bg-white shadow-card">
                  <div className="text-primary text-sm font-medium">Bills Alert</div>
                  <div className="text-2xl font-bold text-foreground">3 days</div>
                  <div class="text-xs text-muted-foreground">Until rent payment</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Brain } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";

const Hero = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const navigate = useNavigate();

  const handleGetAccess = () => {
    setShowEmailModal(true);
  };

  const handleSignUp = () => {
    setShowEmailModal(false);
    navigate('/auth?mode=signup');
  };

  return (
    <>
      <EmailCaptureModal 
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSignUp={handleSignUp}
        title="Get Early Access"
        description="Join FlowSightFi and start seeing your financial future today."
      />
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-glow rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-success rounded-full blur-3xl opacity-15 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-slate-900 text-white border border-slate-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                <Brain className="w-4 h-4" />
                AI-Powered Financial Foresight
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Flow<span className="text-transparent bg-gradient-to-r from-primary-glow to-accent bg-clip-text">Sight</span>Fi
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/80 max-w-xl">
                See Your Financial Future—Clearly, Confidently, Calmly.
              </p>
              
              <p className="text-lg text-white/70 max-w-2xl">
                Navigate your financial journey with AI-powered forecasting that flows with your life. Track, simulate, and optimize across all your financial streams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-glow group"
                onClick={handleGetAccess}
              >
                Get Early Access
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary/30 text-foreground hover:bg-primary/10 bg-background/80 backdrop-blur-sm">
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 justify-center lg:justify-start text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Bank-level Security
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                AI-Powered Forecasts
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative z-10">
              <Card className="p-6 bg-gradient-card shadow-glow border-white/20">
                <img 
                  src={heroDashboard} 
                  alt="FlowSightFi Dashboard Preview" 
                  className="w-full h-auto rounded-lg shadow-card"
                />
              </Card>
              
              {/* Floating Stats Cards */}
              <Card className="absolute -top-4 -left-4 p-4 bg-gradient-success shadow-card">
                <div className="text-accent-success text-sm font-medium">Net Worth Forecast</div>
                <div className="text-2xl font-bold text-accent-foreground">+$12,450</div>
                <div className="text-xs text-accent-foreground/70">↗ Next 6 months</div>
              </Card>
              
              <Card className="absolute -bottom-4 -right-4 p-4 bg-white shadow-card">
                <div className="text-primary text-sm font-medium">Bills Alert</div>
                <div className="text-2xl font-bold text-foreground">3 days</div>
                <div className="text-xs text-muted-foreground">Until rent payment</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
