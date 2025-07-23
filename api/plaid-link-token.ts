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
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
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

    const response = await fetch(`${plaidHost}/link/token/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
      },
      body: JSON.stringify({
        client_name: 'FlowSightFi',
        country_codes: ['US'],
        language: 'en',
        user: {
          client_user_id: user_id,
        },
        products: ['assets', 'transactions', 'identity', 'income'],
        account_filters: {
          depository: {
            account_subtypes: ['checking', 'savings', 'money_market', 'cd'],
          },
          investment: {
            account_subtypes: ['401k', '403b', 'ira', 'roth_ira', 'brokerage'],
          },
          credit: {
            account_subtypes: ['credit_card'],
          },
          loan: {
            account_subtypes: ['student', 'mortgage', 'auto', 'personal'],
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Plaid API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create link token' },
        { status: response.status, headers: corsHeaders }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { headers: corsHeaders });

  } catch (error) {
    console.error('Error creating Plaid link token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}