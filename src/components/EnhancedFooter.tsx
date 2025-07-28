// @ts-nocheck
import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Lock, CreditCard, FileText } from 'lucide-react'

export function EnhancedFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card text-muted-foreground border-t border-border">
      {/* Trust Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-foreground">Bank-Level Security</p>
                <p className="text-sm text-muted-foreground">256-bit encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-foreground">Privacy First</p>
                <p className="text-sm text-muted-foreground">Your data stays yours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-secondary" />
              <div>
                <p className="font-medium text-foreground">PCI Compliant</p>
                <p className="text-sm text-muted-foreground">Secure payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-medium text-foreground">SOC 2 Certified</p>
                <p className="text-sm text-muted-foreground">Annual audits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-xl text-foreground mb-4">FlowSight Fi</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              AI-powered financial planning that helps you see your financial future and build wealth faster than ever before.
            </p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} FlowSight Fi. All rights reserved.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:support@flowsightfi.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="mailto:security@flowsightfi.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 max-w-7xl py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for your financial future
            </p>
            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                🔒 Your data is encrypted and secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default EnhancedFooter