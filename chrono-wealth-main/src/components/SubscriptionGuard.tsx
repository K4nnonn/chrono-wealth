import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Loader2, Crown, CreditCard } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const { user } = useAuth();
  const { subscribed, loading, createCheckout } = useSubscription();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (!subscribed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="space-y-2">
              <Crown className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Premium Feature</h2>
              <p className="text-muted-foreground">
                This feature is available with the Chrono-Wealth Starter plan
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Starter Plan - $5.99/month</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AI-powered financial insights</li>
                  <li>• Bank account connections</li>
                  <li>• Financial health scoring</li>
                  <li>• Goal tracking & forecasting</li>
                  <li>• Crisis simulations</li>
                  <li>• Unlimited AI advisor chat</li>
                </ul>
              </div>

              <Button onClick={createCheckout} className="w-full" size="lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Subscribe Now
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};