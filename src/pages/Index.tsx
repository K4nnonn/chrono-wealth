import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { TrustBar } from "@/components/TrustBar";
import Features from "@/components/Features";
import { Dashboard as DashboardPreview } from "@/components/Dashboard";
import Pricing from "@/components/Pricing";
import { CallToActionSection } from "@/components/CallToActionSection";
import { EnhancedFooter } from "@/components/EnhancedFooter";
import { LoadingPage } from "@/components/LoadingPage";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load time and ensure critical components are ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage message="Initializing Enterprise Financial Intelligence..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      <HeroSection />
      <TrustBar />
      <Features />
      <DashboardPreview />
      <Pricing />
      <CallToActionSection />
      <EnhancedFooter />
    </div>
  );
};

export default Index;
