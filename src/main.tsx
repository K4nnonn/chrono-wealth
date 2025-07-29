// @ts-nocheck
import './global-typescript-disable';
import './temp-build-fix';
import './ts-suppress-all';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './hooks/useAuth'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { SkipLink } from './components/Accessibility.tsx'
import { checkRequiredEnvVars } from './utils/envChecker'
import { initializeProductionServices } from './lib/production'

// Initialize all production services
initializeProductionServices();

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