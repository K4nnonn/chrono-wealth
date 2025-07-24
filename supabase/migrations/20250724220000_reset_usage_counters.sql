-- Migration to reset usage counters (sets sim_runs to zero for all users)
UPDATE public.usage_counters
SET sim_runs = 0;
