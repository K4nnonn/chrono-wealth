import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { calcSavingsRate, calcMomentum, liquidityRunway } from '@/lib/metrics'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const horizon = Number(req.query.horizon) || 1  // years
  const userId = req.headers['x-user-id'] as string
  const supabase = createClient(process.env.VITE_SUPABASE_URL!,
                                process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // fetch daily_income / daily_expense / daily_balance aggregates
  // … compute all K-tiles …

  res.status(200).json({ /* exactly IDs H1…J1 */ })
}
