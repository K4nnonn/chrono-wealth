import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Supabase edge function for checking a user's Stripe subscription.
 *
 * This revised version dynamically maps Stripe price IDs to
 * human‑friendly tier names.  The mapping is derived from
 * environment variables so you can adjust pricing without code changes.
 *
 * On invocation the function authenticates the caller, looks up the
 * corresponding Stripe customer, checks whether they have an active
 * subscription and determines the tier based on the price ID of their
 * subscription item.  It then upserts the record into the
 * `subscribers` table (with row level security enabled) and returns
 * the subscription status to the client.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Build a price ID → tier name mapping from environment variables
const priceTierMap: Record<string, string> = {};
{
  const core = Deno.env.get("STRIPE_PRICE_CORE");
  if (core) priceTierMap[core] = "Core";
  const plus = Deno.env.get("STRIPE_PRICE_PLUS");
  if (plus) priceTierMap[plus] = "Plus";
  const pro = Deno.env.get("STRIPE_PRICE_PRO");
  if (pro) priceTierMap[pro] = "Pro";
  const advisory = Deno.env.get("STRIPE_PRICE_ADVISORY");
  if (advisory) priceTierMap[advisory] = "Advisory";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    // Use the service role key here so we can upsert into RLS‑protected tables
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      // No customer means no subscription
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert(
        {
          email: user.email,
          user_id: user.id,
          stripe_customer_id: null,
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      );
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier: string | null = null;
    let subscriptionEnd: string | null = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", {
        subscriptionId: subscription.id,
        endDate: subscriptionEnd,
      });
      // Determine price ID from first subscription item
      if (subscription.items.data.length > 0) {
        const priceId = subscription.items.data[0].price?.id;
        if (priceId && priceTierMap[priceId]) {
          subscriptionTier = priceTierMap[priceId];
        } else {
          logStep("Unknown price ID", { priceId });
          subscriptionTier = null;
        }
      }
    } else {
      logStep("No active subscription found");
    }

    await supabaseClient.from("subscribers").upsert(
      {
        email: user.email,
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    );
    logStep("Updated database with subscription info", {
      subscribed: hasActiveSub,
      subscriptionTier,
    });

    return new Response(
      JSON.stringify({
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});