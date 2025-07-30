-- Create user_transactions table for real transaction data
CREATE TABLE public.user_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  category TEXT NOT NULL,
  merchant TEXT,
  description TEXT,
  account_id TEXT,
  transaction_type TEXT DEFAULT 'debit',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own transactions" 
ON public.user_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.user_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.user_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.user_transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_transactions_updated_at
BEFORE UPDATE ON public.user_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_transactions_user_id ON public.user_transactions(user_id);
CREATE INDEX idx_user_transactions_date ON public.user_transactions(date DESC);
CREATE INDEX idx_user_transactions_category ON public.user_transactions(category);