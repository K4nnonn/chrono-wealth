-- Create usage_counters table for tracking simulation runs per user and period
CREATE TABLE IF NOT EXISTS public.usage_counters (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    period TEXT NOT NULL,
    sim_runs INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, period)
);

-- Row Level Security for usage_counters
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view their own usage counters" ON public.usage_counters
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "users can update their own usage counters" ON public.usage_counters
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "users can insert their own usage counters" ON public.usage_counters
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to decrement quota; returns true if under cap and increments, else false
CREATE OR REPLACE FUNCTION public.fn_decrement_quota(
    p_user uuid,
    p_cap integer,
    p_period text DEFAULT to_char(now(), 'YYYY-MM')
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
    current_runs integer;
BEGIN
    -- ensure row exists
    INSERT INTO public.usage_counters (user_id, period, sim_runs)
    VALUES (p_user, p_period, 0)
    ON CONFLICT (user_id, period) DO NOTHING;

    SELECT sim_runs INTO current_runs FROM public.usage_counters
    WHERE user_id = p_user AND period = p_period;

    IF current_runs < p_cap THEN
        UPDATE public.usage_counters
        SET sim_runs = sim_runs + 1
        WHERE user_id = p_user AND period = p_period;
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$;

-- Policy for financial_goals limiting Core users to 1 goal
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "core users: 1 goal max" ON public.financial_goals
    FOR INSERT
    USING (
        (SELECT subscription_tier FROM public.subscribers s WHERE s.user_id = auth.uid()) <> 'Core'
        OR (SELECT COUNT(*) FROM public.financial_goals g WHERE g.user_id = auth.uid()) < 1
    );
