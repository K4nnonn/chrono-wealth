import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Brain,
  Mail,
  Twitter,
  Linkedin,
  Github,
  Shield,
  FileText,
  Lock
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-forecast rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">FlowSightFi</span>
              </div>
              
              <p className="text-primary-foreground/80 leading-relaxed">
                Navigate your financial future with clarity and confidence through AI-powered insights that flow with your life.
              </p>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-primary-foreground/60 hover:text-primary-foreground">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-primary-foreground/60 hover:text-primary-foreground">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-primary-foreground/60 hover:text-primary-foreground">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-primary-foreground/60 hover:text-primary-foreground">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Product</h3>
              <div className="space-y-3">
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  AI Forecast Engine
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Crisis Simulator
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Goal Tracker
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Smart Nudges
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  AI Copilot
                </button>
              </div>
            </div>

            {/* Company Column */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Company</h3>
              <div className="space-y-3">
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  About Us
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Careers
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Press Kit
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Blog
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Contact
                </button>
              </div>
            </div>

            {/* Resources Column */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Resources</h3>
              <div className="space-y-3">
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Help Center
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  API Documentation
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Financial Tools
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Security
                </button>
                <button className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                  Status Page
                </button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-primary-foreground/20" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="/terms" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <FileText className="w-4 h-4" />
                Terms of Service
              </a>
              <a href="/privacy" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Shield className="w-4 h-4" />
                Privacy Policy
              </a>
              <button className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Lock className="w-4 h-4" />
                Security
              </button>
            </div>

            {/* Copyright */}
            <div className="text-sm text-primary-foreground/60">
              © 2025 FlowSightFi. All rights reserved.
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-primary-foreground/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-success rounded-full"></div>
              SOC2 Type II Compliant
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-success rounded-full"></div>
              GDPR Ready
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-success rounded-full"></div>
              Bank-Level Encryption
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-success rounded-full"></div>
              PCI DSS Compliant
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-center text-xs text-primary-foreground/40 max-w-4xl mx-auto">
            <p>
              FlowSightFi provides AI-powered financial forecasts and simulations for informational purposes only. 
              All projections are estimates based on historical data and should not be considered financial advice. 
              Past performance does not guarantee future results. Please consult with a qualified financial advisor 
              for personalized financial planning.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;