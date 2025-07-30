import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { Auth } from "@/pages/Auth";
import Index from "./pages/Index";
import { Dashboard } from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Planner from "./pages/Planner";
import Simulate from "./pages/Simulate";
import Crisis from "./pages/Crisis";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Pricing from "./pages/Pricing";
import Demo from "./pages/Demo";
import Onboarding from "./pages/Onboarding";
import { Health } from "./pages/Health";
import NotFound from "./pages/NotFound";

function App() {
  const { user } = useAuth();

  // Initialize enterprise monitoring
  useEffect(() => {
    // Basic error tracking setup
    const handleError = (error: ErrorEvent) => {
      if (import.meta.env.DEV) {
        console.error('Application error:', error);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [user]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Navigation />
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/goals" element={
                <ProtectedRoute>
                  <Navigation />
                  <Goals />
                </ProtectedRoute>
              } />
              
              <Route path="/insights" element={
                <ProtectedRoute>
                  <Navigation />
                  <Insights />
                </ProtectedRoute>
              } />
              
              <Route path="/planner" element={
                <ProtectedRoute>
                  <Navigation />
                  <Planner />
                </ProtectedRoute>
              } />
              
              <Route path="/simulate" element={
                <ProtectedRoute>
                  <Navigation />
                  <Simulate />
                </ProtectedRoute>
              } />
              
              <Route path="/crisis" element={
                <ProtectedRoute>
                  <Navigation />
                  <Crisis />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Navigation />
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/help" element={
                <ProtectedRoute>
                  <Navigation />
                  <Help />
                </ProtectedRoute>
              } />
              
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Navigation />
                  <Onboarding />
                </ProtectedRoute>
              } />
              
              {/* Health monitoring route */}
              <Route path="/health" element={
                <ProtectedRoute>
                  <Navigation />
                  <Health />
                </ProtectedRoute>
              } />
              
              {/* Legacy /app route redirect to dashboard */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <Toaster />
            <Sonner />
          </div>
        </TooltipProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;