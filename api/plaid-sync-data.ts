import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { access_token, user_id } = await req.json();

    if (!access_token || !user_id) {
      return NextResponse.json(
        { error: 'Access token and user ID are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
    const PLAID_SECRET = process.env.PLAID_SECRET;
    const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      return NextResponse.json(
        { error: 'Plaid credentials not configured' },
        { status: 500, headers: corsHeaders }
      );
    }

    const plaidHost = PLAID_ENV === 'production' 
      ? 'https://production.plaid.com'
      : PLAID_ENV === 'development'
      ? 'https://development.plaid.com'
      : 'https://sandbox.plaid.com';

    const headers = {
      'Content-Type': 'application/json',
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    };

    // Fetch all data in parallel
    const [accountsRes, transactionsRes, identityRes, incomeRes, assetsRes] = await Promise.allSettled([
      fetch(`${plaidHost}/accounts/get`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ access_token }),
      }),
      
      fetch(`${plaidHost}/transactions/get`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          access_token,
          start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 90 days
          end_date: new Date().toISOString().split('T')[0],
          count: 500,
        }),
      }),
      
      fetch(`${plaidHost}/identity/get`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ access_token }),
      }),
      
      fetch(`${plaidHost}/income/verification/get`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ access_token }),
      }),
      
      fetch(`${plaidHost}/assets/report/get`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ access_token }),
      }),
    ]);

    // Process results
    const data: any = {};
    
    if (accountsRes.status === 'fulfilled' && accountsRes.value.ok) {
      data.accounts = await accountsRes.value.json();
    }
    
    if (transactionsRes.status === 'fulfilled' && transactionsRes.value.ok) {
      data.transactions = await transactionsRes.value.json();
    }
    
    if (identityRes.status === 'fulfilled' && identityRes.value.ok) {
      data.identity = await identityRes.value.json();
    }
    
    // Income and assets might not be available for all accounts
    if (incomeRes.status === 'fulfilled' && incomeRes.value.ok) {
      try {
        data.income = await incomeRes.value.json();
      } catch (e) {
        console.log('Income data not available');
      }
    }
    
    if (assetsRes.status === 'fulfilled' && assetsRes.value.ok) {
      try {
        data.assets = await assetsRes.value.json();
      } catch (e) {
        console.log('Assets data not available');
      }
    }

    // Calculate financial metrics
    const accounts = data.accounts?.accounts || [];
    const transactions = data.transactions?.transactions || [];
    
    // Calculate net worth
    const totalAssets = accounts
      .filter((acc: any) => ['depository', 'investment'].includes(acc.type))
      .reduce((sum: number, acc: any) => sum + (acc.balances?.current || 0), 0);
    
    const totalLiabilities = accounts
      .filter((acc: any) => ['credit', 'loan'].includes(acc.type))
      .reduce((sum: number, acc: any) => sum + Math.abs(acc.balances?.current || 0), 0);
    
    const netWorth = totalAssets - totalLiabilities;
    
    // Calculate monthly income/expenses from transactions
    const last30Days = transactions.filter((t: any) => 
      new Date(t.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    
    const monthlyIncome = last30Days
      .filter((t: any) => t.amount < 0) // Negative amounts are income in Plaid
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);
    
    const monthlyExpenses = last30Days
      .filter((t: any) => t.amount > 0) // Positive amounts are expenses
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    return NextResponse.json({
      ...data,
      computed_metrics: {
        net_worth: netWorth,
        total_assets: totalAssets,
        total_liabilities: totalLiabilities,
        monthly_income: monthlyIncome,
        monthly_expenses: monthlyExpenses,
        monthly_savings: monthlyIncome - monthlyExpenses,
      },
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error syncing Plaid data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}