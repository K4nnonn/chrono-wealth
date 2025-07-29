import React from 'react'
import { Shield, Lock, Users, CheckCircle } from 'lucide-react'

// Type definitions for TypeScript
interface TrustItemProps {
  icon: React.ElementType
  text: string
  subtext?: string
}

// Individual trust item component
const TrustItem: React.FC<TrustItemProps> = ({ icon: Icon, text, subtext }) => {
  return (
    <div className="flex items-center gap-2 group">
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{text}</span>
        {subtext && (
          <span className="text-xs text-muted-foreground">{subtext}</span>
        )}
      </div>
    </div>
  )
}

// Main TrustBar component
export function TrustBar() {
  // Trust items data - updated for Phase 1
  const trustItems = [
    {
      icon: Shield,
      text: "Encrypted Data",
      subtext: "Bank-level security"
    },
    {
      icon: Lock,
      text: "Privacy First",
      subtext: "Never sold or shared"
    },
    {
      icon: CheckCircle,
      text: "AI Accurate",
      subtext: "90%+ prediction rate"
    },
    {
      icon: Users,
      text: "Trusted by Many",
      subtext: "Growing community"
    }
  ]

  return (
    <section className="w-full bg-muted/50 border-y border-border py-4">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Mobile: Scrollable horizontal */}
        <div className="lg:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 pb-2">
            {trustItems.map((item, index) => (
              <div key={index} className="flex-shrink-0">
                <TrustItem {...item} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop: Grid layout - updated for 4 items */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8 lg:justify-center">
          {trustItems.map((item, index) => (
            <TrustItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBar