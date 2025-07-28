import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Inline metrics functions for Edge Function compatibility
const calcSavingsRate = (income: number, expense: number) =>
  income === 0 ? -1 : (income - expense) / income

const calcMomentum = (sr30: number, sr90: number) => sr30 - sr90

const liquidityRunway = (balance: number, adr90: number) =>
  adr90 === 0 ? 999 : balance / adr90

function randn(rand: () => number) {
  return Math.sqrt(-2 * Math.log(rand())) * Math.cos(2 * Math.PI * rand())
}

function quantileSorted(sorted: number[], q: number): number {
  const index = q * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index % 1
  
  if (upper >= sorted.length) return sorted[sorted.length - 1]
  if (lower < 0) return sorted[0]
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

function monteCarloFan(
  startNW: number,
  surplusμ: number,
  surplusσ: number,
  rμ: number,
  rσ: number,
  days: number,
  paths = 1000,
  rand: () => number = Math.random
): number[][] {
  const results: number[][] = Array.from({ length: days }, () => [])
  for (let p = 0; p < paths; p++) {
    let nw = startNW
    for (let d = 0; d < days; d++) {
      const S = surplusμ + surplusσ * randn(rand)
      const r = rμ / 252 + (rσ / Math.sqrt(252)) * randn(rand)
      nw = (nw + S) * (1 + r)
      results[d].push(nw)
    }
  }
  return results.map(dayArr => {
    const sorted = dayArr.slice().sort((a, b) => a - b)
    return [
      quantileSorted(sorted, 0.10),
      quantileSorted(sorted, 0.50),
      quantileSorted(sorted, 0.90),
    ]
  })
}

function resilienceScore(
  runwayPercentile: number,
  savingsRatePercentile: number,
  netWorthVolatility: number,
  benchmarkVolatility: number
): number {
  const volTerm = benchmarkVolatility === 0 ? 0 : 1 - netWorthVolatility / benchmarkVolatility
  const score = 0.4 * runwayPercentile + 0.3 * savingsRatePercentile + 0.3 * volTerm
  const scaled = score * 100
  return Math.max(0, Math.min(100, scaled))
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url)
    const horizon = Number(url.searchParams.get('horizon')) || 1  // years
    const userId = req.headers.get('x-user-id') as string
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // fetch daily_income / daily_expense / daily_balance aggregates and compute metrics
    const today = new Date()
    const start30 = new Date()
    start30.setDate(today.getDate() - 29)
    const start90 = new Date()
    start90.setDate(today.getDate() - 89)

    // helper to sum amounts from a table since Supabase JS does not support SQL aggregate yet
    async function sumTable(table: string, fromDate: Date) {
      const { data, error } = await supabase
        .from(table)
        .select('amount')
        .eq('user_id', userId)
        .gte('date', fromDate.toISOString().split('T')[0])
      if (error) throw error
      return data?.reduce((sum, row: any) => sum + (row.amount ?? 0), 0) ?? 0
    }

    let monthlyIncome = 0
    let monthlyExpense = 0
    let balance = 0
    try {
      const income30 = await sumTable('daily_income', start30)
      const expense30 = await sumTable('daily_expense', start30)
      monthlyIncome = income30
      monthlyExpense = expense30
      const { data: balances } = await supabase
        .from('daily_balance')
        .select('balance')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1)
      balance = balances?.[0]?.balance ?? 0
    } catch (err) {
      console.error('Error aggregating financial data', err)
    }
    const monthlySavings = monthlyIncome - monthlyExpense

    // compute savings rates for momentum: 30-day and 90-day
    let sr30 = 0
    let sr90 = 0
    try {
      const income90 = await sumTable('daily_income', start90)
      const expense90 = await sumTable('daily_expense', start90)
      sr30 = calcSavingsRate(monthlyIncome, monthlyExpense)
      sr90 = calcSavingsRate(income90, expense90)
    } catch (err) {
      console.error('Error computing savings rates', err)
    }
    const momentum = calcMomentum(sr30, sr90)

    // liquidity runway in days
    const averageDailyExpense = monthlyExpense / 30 || 0
    const runway = liquidityRunway(balance, averageDailyExpense)

    // resilience score (use percentiles approximated from current ratios)
    const runwayPercentile = Math.min(1, runway / 365)
    const savingsRatePercentile = Math.min(1, sr30)
    const netWorthVolatility = 0.2 // placeholder
    const benchmarkVolatility = 0.15 // placeholder
    const resilience = resilienceScore(
      runwayPercentile,
      savingsRatePercentile,
      netWorthVolatility,
      benchmarkVolatility,
    )

    // Monte Carlo fan chart
    const surplusMean = (monthlyIncome - monthlyExpense) / 30
    const surplusStd = Math.abs(surplusMean) * 0.25
    const rMean = 0.05
    const rStd = 0.1
    const days = horizon * 365
    const fanData = monteCarloFan(balance, surplusMean, surplusStd, rMean, rStd, days, 1000)

    // fetch goals for K3 and J1
    const { data: goals } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    const goalCount = goals?.length ?? 0
    const lights = [goalCount > 0, monthlySavings > 0, resilience > 50]
    const journeyBand =
      goals?.map((g: any) => ({ id: g.id, name: g.name, progress: g.current_amount / g.target_amount })) ?? []

    // macro ribbon H2
    let macroRibbon = ''
    try {
      const { data: macro } = await supabase
        .from('macro_rates')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
      if (macro && macro.length) {
        const m = macro[0] as any
        macroRibbon = `CPI ${m.cpi?.toFixed(1)} | Fed ${m.fed_funds?.toFixed(2)}% | Unemp ${m.unemployment?.toFixed(1)}%`
      }
    } catch (err) {
      console.error('Error loading macro rates', err)
    }
    
    const insight = monthlySavings > 0 ? 'You're saving more than you spend—great job!' : 'Your expenses exceed your income.'
    
    return new Response(JSON.stringify({
      H1: insight,
      H2: macroRibbon,
      K1: monthlyIncome,
      K2: monthlySavings,
      K3: { goals: goalCount, lights },
      K4: resilience,
      T1: fanData,
      M1: { momentum, archetype: momentum > 0 ? 'Improver' : 'Stable' },
      M2: {},
      L1: runway,
      J1: journeyBand,
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    })
  }
})