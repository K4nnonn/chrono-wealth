import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Financial advisor function definitions for OpenAI
const functions = [
  {
    name: "explain_score_component",
    description: "Explain what a specific financial health score component means and how to improve it",
    parameters: {
      type: "object",
      properties: {
        component: {
          type: "string",
          enum: ["liquidity", "debt", "savings", "incomeStability", "expensePredictability", "growth"],
          description: "The financial health component to explain"
        },
        currentScore: {
          type: "number",
          description: "The user's current score for this component (0-1)"
        }
      },
      required: ["component", "currentScore"]
    }
  },
  {
    name: "recommend_action",
    description: "Provide specific actionable recommendations to improve financial health",
    parameters: {
      type: "object",
      properties: {
        dimension: {
          type: "string",
          description: "The financial dimension that needs improvement"
        },
        currentValue: {
          type: "number",
          description: "Current value in this dimension"
        },
        targetValue: {
          type: "number",
          description: "Recommended target value"
        },
        timeframe: {
          type: "string",
          description: "Suggested timeframe to achieve the target"
        }
      },
      required: ["dimension", "currentValue", "targetValue", "timeframe"]
    }
  },
  {
    name: "simulate_scenario",
    description: "Simulate what-if scenarios for financial planning",
    parameters: {
      type: "object",
      properties: {
        scenario: {
          type: "string",
          description: "The scenario to simulate (e.g., 'job loss', 'salary increase', 'debt payoff')"
        },
        changes: {
          type: "object",
          description: "The financial changes to simulate"
        },
        duration: {
          type: "string",
          description: "How long the scenario lasts"
        }
      },
      required: ["scenario", "changes"]
    }
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, userProfile, currentScores } = await req.json();

    // System prompt with financial context
    const systemPrompt = `You are FlowSightFi's AI financial advisor. You provide personalized, actionable financial guidance based on users' Financial Health Scorecard Score (FHSS) and profile data.

Your role:
- Explain financial concepts clearly and without judgment
- Provide specific, actionable recommendations
- Help users understand their financial health scores
- Simulate scenarios and their impacts
- Always be encouraging and supportive

User Context:
${userProfile ? `Financial Profile: ${JSON.stringify(userProfile, null, 2)}` : 'No profile data available'}
${currentScores ? `Current Scores: ${JSON.stringify(currentScores, null, 2)}` : 'No score data available'}

Guidelines:
- Keep responses concise but comprehensive
- Always provide specific next steps
- Reference their actual financial data when available
- Use encouraging, non-judgmental language
- Include confidence levels when making projections
- Suggest realistic timeframes for improvements`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        functions: functions,
        function_call: "auto",
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    let reply = data.choices[0].message;
    let functionResult = null;

    // Handle function calls
    if (reply.function_call) {
      const functionName = reply.function_call.name;
      const functionArgs = JSON.parse(reply.function_call.arguments);
      
      // Process function calls (simplified for demo)
      switch (functionName) {
        case 'explain_score_component':
          functionResult = {
            type: 'explanation',
            component: functionArgs.component,
            guidance: generateComponentGuidance(functionArgs.component, functionArgs.currentScore)
          };
          break;
        case 'recommend_action':
          functionResult = {
            type: 'recommendation',
            action: generateActionPlan(functionArgs)
          };
          break;
        case 'simulate_scenario':
          functionResult = {
            type: 'simulation',
            scenario: functionArgs.scenario,
            impact: 'Simulation would be calculated here based on user data'
          };
          break;
      }

      // Get final response after function call
      const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
            reply,
            { 
              role: 'function', 
              name: functionName, 
              content: JSON.stringify(functionResult) 
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      const followUpData = await followUpResponse.json();
      reply = followUpData.choices[0].message;
    }

    return new Response(JSON.stringify({ 
      reply: reply.content, 
      functionResult,
      confidence: 0.85 // Could be calculated based on data completeness
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in financial-ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: "I'm having trouble processing your request right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateComponentGuidance(component: string, score: number): string {
  const guidance: Record<string, string> = {
    liquidity: `Your liquidity score of ${Math.round(score * 100)}% indicates ${score > 0.7 ? 'strong' : score > 0.4 ? 'moderate' : 'weak'} emergency preparedness. ${score < 0.5 ? 'Focus on building 3-6 months of expenses in savings.' : 'Good job maintaining liquid savings!'}`,
    debt: `Your debt health score of ${Math.round(score * 100)}% shows ${score > 0.7 ? 'excellent' : score > 0.4 ? 'manageable' : 'concerning'} debt levels. ${score < 0.5 ? 'Consider debt consolidation or accelerated payments.' : 'Keep up the disciplined debt management.'}`,
    savings: `Your savings rate score of ${Math.round(score * 100)}% reflects ${score > 0.7 ? 'excellent' : score > 0.4 ? 'moderate' : 'low'} savings habits. ${score < 0.5 ? 'Try to save at least 10-15% of income.' : 'Great work on consistent saving!'}`,
    incomeStability: `Your income stability score of ${Math.round(score * 100)}% indicates ${score > 0.7 ? 'very stable' : score > 0.4 ? 'moderately stable' : 'unstable'} income. ${score < 0.5 ? 'Consider diversifying income sources or building larger emergency reserves.' : 'Your stable income is a strong foundation.'}`,
    expensePredictability: `Your expense control score of ${Math.round(score * 100)}% shows ${score > 0.7 ? 'excellent' : score > 0.4 ? 'good' : 'poor'} expense management. ${score < 0.5 ? 'Track expenses and identify areas to reduce variable spending.' : 'You have good control over your spending.'}`,
    growth: `Your growth potential score of ${Math.round(score * 100)}% reflects ${score > 0.7 ? 'strong' : score > 0.4 ? 'moderate' : 'limited'} wealth building. ${score < 0.5 ? 'Focus on retirement contributions and investment accounts.' : 'Excellent progress on long-term wealth building!'}`
  };
  
  return guidance[component] || 'Financial component analysis not available.';
}

function generateActionPlan(args: any): string {
  return `Action Plan: Improve ${args.dimension} from ${args.currentValue} to ${args.targetValue} over ${args.timeframe}. Start with small, consistent steps and track progress monthly.`;
}