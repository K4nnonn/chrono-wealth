/* Supabase Edge Function – pulls Plaid + macro + writes daily_* tables */
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import plaid from 'https://esm.sh/plaid'

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!,
                                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  // 1. get users with active Plaid items
  const { data: institutions } = await supabase.from('plaid_institutions')
                                               .select('*')
                                               .eq('is_active', true)

  // 2. loop + sync balances / transactions
  // iterate through each active institution and refresh balances and transactions
  if (institutions && Array.isArray(institutions)) {
    for (const inst of institutions) {
      try {
        // initialise Plaid client using environment credentials
        const plaidClient = new plaid.PlaidApi(
          new plaid.Configuration({
            basePath: plaid.PlaidEnvironments[inst.env || 'production'],
            baseOptions: {
              headers: {
                'PLAID-CLIENT-ID': Deno.env.get('PLAID_CLIENT_ID')!,
                'PLAID-SECRET': Deno.env.get('PLAID_SECRET')!,
              },
            },
          }),
        )
        // fetch recent transactions for the past day
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 1)
        const endDate = new Date()
        const txResp = await plaidClient.transactionsGet({
          access_token: inst.access_token,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        })
        const transactions = txResp.data.transactions || []
        // aggregate income and expenses by positive/negative amounts
        let incomeSum = 0
        let expenseSum = 0
        transactions.forEach((tx: any) => {
          if (tx.amount < 0) incomeSum += Math.abs(tx.amount)
          else expenseSum += tx.amount
        })
        // insert into daily tables
        const day = endDate.toISOString().split('T')[0]
        await supabase.from('daily_income').insert({ user_id: inst.user_id, date: day, amount: incomeSum })
        await supabase.from('daily_expense').insert({ user_id: inst.user_id, date: day, amount: expenseSum })
        // fetch current balances
        const balResp = await plaidClient.accountsBalanceGet({ access_token: inst.access_token })
        const totalBalance = balResp.data.accounts?.reduce((sum: number, acc: any) => sum + (acc.balances.current ?? 0), 0) || 0
        await supabase.from('daily_balance').insert({ user_id: inst.user_id, date: day, balance: totalBalance })
      } catch (err) {
        console.error('Error syncing Plaid item', inst?.id, err)
      }
    }
  }

  // 3. pull macro feeds (CPI, Fed funds, unemployment) via public APIs
  try {
    // FRED API key should be stored in environment
    const fredKey = Deno.env.get('FRED_API_KEY')!
    const today = new Date().toISOString().split('T')[0]
    // helper to fetch latest value for a series
    const fetchSeries = async (series: string) => {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${fredKey}&file_type=json&limit=1&sort_order=desc`
      const resp = await fetch(url)
      const data = await resp.json()
      const obs = data.observations?.[0]
      return obs ? Number(obs.value) : null
    }
    const cpi = await fetchSeries('CPIAUCSL')
    const fedFunds = await fetchSeries('FEDFUNDS')
    const unemployment = await fetchSeries('UNRATE')
    await supabase.from('macro_rates').insert({ date: today, cpi, fed_funds: fedFunds, unemployment })
  } catch (err) {
    console.error('Error pulling macro rates', err)
  }

  return new Response('ok')
})