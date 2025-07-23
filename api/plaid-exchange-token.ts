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
    const { public_token, user_id } = await req.json();

    if (!public_token || !user_id) {
      return NextResponse.json(
        { error: 'Public token and user ID are required' },
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

    // Exchange public token for access token
    const exchangeResponse = await fetch(`${plaidHost}/item/public_token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
      },
      body: JSON.stringify({
        public_token,
      }),
    });

    if (!exchangeResponse.ok) {
      const errorData = await exchangeResponse.text();
      console.error('Plaid exchange error:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange token' },
        { status: exchangeResponse.status, headers: corsHeaders }
      );
    }

    const { access_token, item_id } = await exchangeResponse.json();

    // Get institution info
    const itemResponse = await fetch(`${plaidHost}/item/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
      },
      body: JSON.stringify({
        access_token,
      }),
    });

    let institution_name = 'Unknown Institution';
    if (itemResponse.ok) {
      const itemData = await itemResponse.json();
      if (itemData.item?.institution_id) {
        const instResponse = await fetch(`${plaidHost}/institutions/get_by_id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
          },
          body: JSON.stringify({
            institution_id: itemData.item.institution_id,
            country_codes: ['US'],
          }),
        });

        if (instResponse.ok) {
          const instData = await instResponse.json();
          institution_name = instData.institution?.name || institution_name;
        }
      }
    }

    return NextResponse.json({
      access_token,
      item_id,
      institution_name,
      user_id,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error exchanging Plaid token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}