import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Dashboard from "@/components/Dashboard";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Dashboard />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
