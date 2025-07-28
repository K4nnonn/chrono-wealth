-- Enhance plaid_data table structure for better data organization
ALTER TABLE public.plaid_data 
ADD COLUMN IF NOT EXISTS accounts JSONB,
ADD COLUMN IF NOT EXISTS transactions JSONB,
ADD COLUMN IF NOT EXISTS identity JSONB,
ADD COLUMN IF NOT EXISTS income JSONB,
ADD COLUMN IF NOT EXISTS assets JSONB,
ADD COLUMN IF NOT EXISTS liabilities JSONB,
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Enable RLS if not already enabled
ALTER TABLE public.plaid_data ENABLE ROW LEVEL SECURITY;

-- Create policies for plaid_data
DROP POLICY IF EXISTS "Users can manage their own plaid data" ON public.plaid_data;
CREATE POLICY "Users can manage their own plaid data" 
ON public.plaid_data 
FOR ALL 
USING (auth.uid()::text = user_id);

-- Create plaid_institutions table for storing institution data
CREATE TABLE IF NOT EXISTS public.plaid_institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  item_id TEXT NOT NULL,
  cursor TEXT, -- for transactions pagination
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.plaid_institutions ENABLE ROW LEVEL SECURITY;

-- Create policies for plaid_institutions
CREATE POLICY "Users can manage their own plaid institutions" 
ON public.plaid_institutions 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_plaid_institutions_updated_at
  BEFORE UPDATE ON public.plaid_institutions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plaid_data_user_id ON public.plaid_data(user_id);
CREATE INDEX IF NOT EXISTS idx_plaid_institutions_user_id ON public.plaid_institutions(user_id);
CREATE INDEX IF NOT EXISTS idx_plaid_institutions_item_id ON public.plaid_institutions(item_id);