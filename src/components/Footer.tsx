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
                <span className="text-2xl font-bold">FutureFund</span>
              </div>
              
              <p className="text-primary-foreground/80 leading-relaxed">
                The first predictive financial OS that helps you see what's coming, not just what's already happened.
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
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  AI Forecast Engine
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Crisis Simulator
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Goal Tracker
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Smart Nudges
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  AI Copilot
                </a>
              </div>
            </div>

            {/* Company Column */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Company</h3>
              <div className="space-y-3">
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Careers
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Press Kit
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Blog
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </a>
              </div>
            </div>

            {/* Resources Column */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Resources</h3>
              <div className="space-y-3">
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  API Documentation
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Financial Tools
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Security
                </a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Status Page
                </a>
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
              <a href="#" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <FileText className="w-4 h-4" />
                Terms of Service
              </a>
              <a href="#" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Shield className="w-4 h-4" />
                Privacy Policy
              </a>
              <a href="#" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Lock className="w-4 h-4" />
                Security
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-primary-foreground/60">
              © 2025 FutureFund. All rights reserved.
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
              FutureFund provides AI-powered financial forecasts and simulations for informational purposes only. 
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