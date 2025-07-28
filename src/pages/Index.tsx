import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { HeroSection } from "@/components/HeroSection";
import { TrustBar } from "@/components/TrustBar";
import Features from "@/components/Features";
import { Dashboard as DashboardPreview } from "@/components/Dashboard";
import Pricing from "@/components/Pricing";
import { EnhancedFooter } from "@/components/EnhancedFooter";

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustBar />
      <Features />
      <DashboardPreview />
      <Pricing />
      <EnhancedFooter />
    </div>
  );
};

export default Index;
