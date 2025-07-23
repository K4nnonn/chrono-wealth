// Vercel Edge Function for AI Financial Chat
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { message, userProfile, currentScores } = await req.json();
    const openAIApiKey = process.env.OPENAI_API_KEY;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Financial advisor function definitions
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
            dimension: { type: "string", description: "The financial dimension that needs improvement" },
            currentValue: { type: "number", description: "Current value in this dimension" },
            targetValue: { type: "number", description: "Recommended target value" },
            timeframe: { type: "string", description: "Suggested timeframe to achieve the target" }
          },
          required: ["dimension", "currentValue", "targetValue", "timeframe"]
        }
      }
    ];

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

    return NextResponse.json({ 
      reply: reply.content || "I'd be happy to help with your financial questions!", 
      confidence: 0.85 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Error in financial-ai-chat:', error);
    return NextResponse.json({ 
      error: error.message,
      reply: "I'm having trouble processing your request right now. Please try again in a moment."
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}