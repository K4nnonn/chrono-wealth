import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Dashboard as DashboardPreview } from "@/components/Dashboard";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <DashboardPreview />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
