import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './hooks/useAuth'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { SkipLink } from './components/Accessibility.tsx'
import { checkRequiredEnvVars } from './utils/envChecker'
import { initializeProductionServices } from './lib/production'
import { performanceManager } from './lib/enterprise-performance'
import { mlEngine } from './lib/enterprise-ml-engine'
import { enterpriseSecurity } from './lib/enterprise-security'

// Initialize all enterprise production services
initializeProductionServices();

// Initialize enterprise systems with real monitoring
performanceManager.recordMetric({
  name: 'system_initialization', 
  value: performance.now(),
  timestamp: new Date(),
  category: 'memory'
});

// Pre-warm enterprise engines
mlEngine;
enterpriseSecurity.performSecurityScan();

// Check environment variables on startup
checkRequiredEnvVars();

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

createRoot(container).render(
  <ErrorBoundary>
    <SkipLink href="#main-content">Skip to main content</SkipLink>
    <div id="main-content">
      <AuthProvider>
        <App />
      </AuthProvider>
    </div>
  </ErrorBoundary>
);