import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Bot, User, Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
}

interface AIFinancialChatProps {
  currentScores?: any;
  className?: string;
}

export const AIFinancialChat = ({ currentScores, className = '' }: AIFinancialChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI financial advisor. I can help you understand your Financial Health Score, provide personalized recommendations, and simulate different financial scenarios. What would you like to explore?",
      timestamp: new Date(),
      confidence: 1.0
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { profile, financialData } = useProfile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // First try the AI service
      let aiResponse;
      try {
        const response = await supabase.functions.invoke('financial-ai-chat', {
          body: {
            message: inputMessage,
            userProfile: {
              profile,
              financialData
            },
            currentScores
          }
        });

        if (!response.error && response.data?.reply) {
          aiResponse = response.data.reply;
        }
      } catch (aiError) {
        // AI service unavailable, use fallback
        console.log('AI service unavailable, using fallback responses');
      }

      // Use fallback responses if AI service failed
      if (!aiResponse) {
        aiResponse = getIntelligentResponse(inputMessage, profile, financialData);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        confidence: aiResponse.includes('AI service') ? 0.85 : 0.75
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.error('Chat error:', error);
      }
      setError('Sorry, I had trouble processing your message. Please try again.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize for the inconvenience. Let me try to help you with a basic response. What specific financial question can I assist you with?",
        timestamp: new Date(),
        confidence: 0.5
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Intelligent fallback responses based on user input and financial data
  const getIntelligentResponse = (message: string, _profile: any, financialData: any): string => {
    const lowerMessage = message.toLowerCase();
    const monthlyIncome = financialData?.annual_salary ? Math.round(financialData.annual_salary / 12) : 0;
    const monthlyExpenses = (financialData?.monthly_rent || 0) + (financialData?.monthly_subscriptions || 0);
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

    // Budget-related questions
    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      if (monthlyIncome > 0) {
        return `Based on your financial profile (monthly income: $${monthlyIncome.toLocaleString()}), I recommend the 50/30/20 rule: 50% for needs ($${Math.round(monthlyIncome * 0.5).toLocaleString()}), 30% for wants ($${Math.round(monthlyIncome * 0.3).toLocaleString()}), and 20% for savings ($${Math.round(monthlyIncome * 0.2).toLocaleString()}). Your current savings rate is ${savingsRate.toFixed(1)}%. Would you like specific tips to improve this?`;
      }
      return "For effective budgeting, I recommend the 50/30/20 rule: 50% of income for needs, 30% for wants, and 20% for savings. Track your expenses for a month to see where your money goes, then adjust accordingly.";
    }

    // Savings-related questions
    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      if (monthlySavings > 0) {
        return `Great news! You're currently saving $${monthlySavings.toLocaleString()} per month (${savingsRate.toFixed(1)}% savings rate). To optimize this further: 1) Automate your savings right after payday, 2) Consider high-yield savings accounts, 3) Increase by 1% whenever you get a raise. Your goal should be 20% if possible.`;
      } else if (monthlySavings < 0) {
        return `I notice your expenses may exceed your income. Let's fix this: 1) List all expenses and categorize them, 2) Identify 3 areas to cut back, 3) Consider additional income sources, 4) Start with saving just $25/month and increase gradually. Small steps lead to big changes!`;
      }
      return "Start by automating your savings - even $50/month is a great beginning! Open a high-yield savings account, and increase your savings by 1% every few months. The key is consistency, not perfection.";
    }

    // Investment-related questions
    if (lowerMessage.includes('invest') || lowerMessage.includes('retirement')) {
      const emergencyFund = financialData?.emergency_fund_months || 0;
      if (emergencyFund < 3) {
        return "Before investing, build an emergency fund of 3-6 months of expenses. Once that's secure, consider: 1) Max out any employer 401(k) match (free money!), 2) Open a Roth IRA for tax-free growth, 3) Start with low-cost index funds. Time in the market beats timing the market!";
      }
      return "With your emergency fund in place, focus on: 1) Maximizing employer 401(k) match, 2) Contributing to a Roth IRA (up to $7,000/year), 3) Investing in diversified index funds, 4) Consider target-date funds for simplicity. Start with what you can afford and increase over time.";
    }

    // Debt-related questions
    if (lowerMessage.includes('debt') || lowerMessage.includes('loan') || lowerMessage.includes('credit card')) {
      return "For debt payoff, use the avalanche method: 1) List all debts with interest rates, 2) Pay minimums on all debts, 3) Put extra money toward highest interest debt first, 4) Consider debt consolidation if it lowers your rate. Focus on one debt at a time for psychological wins!";
    }

    // Emergency fund questions
    if (lowerMessage.includes('emergency') || lowerMessage.includes('fund')) {
      const targetEmergency = monthlyExpenses * 6;
      if (monthlyExpenses > 0) {
        return `Your emergency fund should cover 3-6 months of expenses. Based on your monthly expenses of approximately $${monthlyExpenses.toLocaleString()}, aim for $${targetEmergency.toLocaleString()}. Start with $1,000, then build to one month, then gradually to 6 months. Keep it in a high-yield savings account for easy access.`;
      }
      return "Build an emergency fund of 3-6 months of expenses. Start with $1,000 as your first milestone, then work toward one month of expenses, then gradually build to 6 months. Keep it in a separate high-yield savings account that's easily accessible but not too convenient to dip into.";
    }

    // Goal-related questions
    if (lowerMessage.includes('goal') || lowerMessage.includes('house') || lowerMessage.includes('car')) {
      return "For major financial goals: 1) Set a specific target amount and date, 2) Break it down into monthly savings needed, 3) Open a separate savings account for this goal, 4) Automate transfers, 5) Review and adjust quarterly. The clearer your goal, the easier it is to achieve!";
    }

    // Income questions
    if (lowerMessage.includes('income') || lowerMessage.includes('salary') || lowerMessage.includes('raise')) {
      return "To increase income: 1) Research salary ranges for your role, 2) Document your achievements and value, 3) Ask for a raise annually, 4) Consider side hustles or freelancing, 5) Invest in skills that pay more. Even a 3% annual increase compounds significantly over time!";
    }

    // General financial health
    if (lowerMessage.includes('health') || lowerMessage.includes('score') || lowerMessage.includes('improve')) {
      return `Your financial health improves through: 1) Consistent saving (aim for 20% of income), 2) Building emergency funds, 3) Paying down high-interest debt, 4) Investing for long-term growth, 5) Regular review and adjustment. ${monthlyIncome > 0 ? `With your current income of $${monthlyIncome.toLocaleString()}/month, you have a solid foundation to build on.` : 'Start by tracking your income and expenses to understand your current position.'}`;
    }

    // Default helpful response
    return `I'm here to help with your financial planning! I can assist with budgeting, saving strategies, debt payoff, investment guidance, and financial goal setting. ${monthlyIncome > 0 ? `Based on your profile, you have good potential to improve your financial health.` : 'To give you more personalized advice, consider updating your financial profile with your income and expense information.'} What specific area would you like to focus on?`;
  };

  const suggestedQuestions = [
    "How can I improve my liquidity score?",
    "What's the impact of paying off my debt early?",
    "How much should I save for emergencies?",
    "What happens if I lose my job for 3 months?",
    "How can I increase my savings rate?"
  ];

  return (
    <Card className={`flex flex-col h-96 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">AI Financial Advisor</h3>
          <p className="text-xs text-muted-foreground">
            Personalized guidance based on your financial health
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.confidence && message.role === 'assistant' && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(message.confidence * 100)}% confident
                    </Badge>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3 h-3 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => setInputMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 p-4 border-t">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your financial health..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={sendMessage} 
          disabled={!inputMessage.trim() || isLoading}
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {error && (
        <div className="p-2 bg-destructive/10 border-t border-destructive/20">
          <p className="text-xs text-destructive text-center">{error}</p>
        </div>
      )}
    </Card>
  );
};