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
  // … (trimmed for brevity) …

  // 3. pull macro feeds (CPI, Fed funds, unemployment) via public APIs
  // … write into macro_rates …

  return new Response('ok')
})