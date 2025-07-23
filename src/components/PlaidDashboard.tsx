import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePlaidData } from '@/hooks/usePlaidData';
import { PlaidLink } from './PlaidLink';
import { 
  Banknote, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Building2,
  Unlink
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const PlaidDashboard: React.FC = () => {
  const { plaidData, institutions, loading, error, syncData, disconnectInstitution } = usePlaidData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Banking Data</CardTitle>
          <CardDescription>Loading your financial information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Banking Data</CardTitle>
          <CardDescription>Error loading financial data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  if (!plaidData || institutions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Bank</CardTitle>
          <CardDescription>
            Link your bank accounts to get real-time financial insights and personalized recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-muted-foreground">
              No bank accounts connected yet. Connect your accounts to see:
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Real-time account balances</li>
              <li>• Transaction history and categorization</li>
              <li>• Automatic expense tracking</li>
              <li>• Personalized financial health score</li>
            </ul>
            <PlaidLink 
              onSuccess={() => window.location.reload()} 
              className="w-full max-w-sm mx-auto" 
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = plaidData.computed_metrics;
  const accounts = plaidData.accounts || [];

  return (
    <div className="space-y-6">
      {/* Connected Institutions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Connected Banks</CardTitle>
            <CardDescription>Manage your connected financial institutions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={syncData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Data
            </Button>
            <PlaidLink onSuccess={() => window.location.reload()} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {institutions.map((institution) => (
              <div key={institution.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{institution.institution_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Connected • Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => disconnectInstitution(institution.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.net_worth)}</div>
              <p className="text-xs text-muted-foreground">
                Assets: {formatCurrency(metrics.total_assets)} | 
                Liabilities: {formatCurrency(metrics.total_liabilities)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.monthly_income)}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(metrics.monthly_expenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Savings: {formatCurrency(metrics.monthly_savings)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>All your connected accounts at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.account_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {account.type === 'depository' ? (
                    <Banknote className="w-5 h-5 text-green-600" />
                  ) : account.type === 'credit' ? (
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  )}
                  <div>
                    <h4 className="font-medium">{account.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {account.official_name || account.subtype} • ****{account.mask}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(account.balances.current || 0)}
                  </div>
                  {account.balances.available && (
                    <div className="text-sm text-muted-foreground">
                      Available: {formatCurrency(account.balances.available)}
                    </div>
                  )}
                  <Badge variant={account.type === 'credit' ? 'destructive' : 'secondary'} className="mt-1">
                    {account.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};