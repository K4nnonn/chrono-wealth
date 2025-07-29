import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { TrustBar } from "@/components/TrustBar";
import Features from "@/components/Features";
import { Dashboard as DashboardPreview } from "@/components/Dashboard";
import Pricing from "@/components/Pricing";
import { CallToActionSection } from "@/components/CallToActionSection";
import { EnhancedFooter } from "@/components/EnhancedFooter";
import { LoadingPage } from "@/components/LoadingPage";
import { LiveActivityFeed } from "@/components/UrgencyEngagement";
import { MoneyBackGuarantee } from "@/components/TrustSignals";
import { SimpleDemoModal } from "@/components/SimpleDemoModal";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    // Simulate initial load time and ensure critical components are ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Listen for demo modal trigger from hero section
    const handleDemoTrigger = () => {
      setIsDemoModalOpen(true);
    };

    // Add global event listener for demo modal
    window.addEventListener('openDemoModal', handleDemoTrigger);
    
    return () => {
      window.removeEventListener('openDemoModal', handleDemoTrigger);
    };
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
      
      {/* Trust & Psychology Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4">
          <MoneyBackGuarantee />
        </div>
      </section>
      
      <Pricing />
      <CallToActionSection />
      <EnhancedFooter />
      
      {/* Live Activity Feed */}
      <LiveActivityFeed />
      
      {/* Interactive Demo Modal */}
      <SimpleDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
