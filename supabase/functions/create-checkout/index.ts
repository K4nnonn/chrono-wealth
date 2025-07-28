import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Supabase edge function for creating a Stripe checkout session.
 *
 * This version supports multiple subscription tiers.  The client can pass
 * a JSON body with a `tier` property (e.g. `{ "tier": "Plus" }`).
 * The function looks up the corresponding Stripe price ID from
 * environment variables.  If no tier is provided or the value is not
 * recognised, it falls back to the Core plan.  The mapping is
 * intentionally defined via environment variables so new tiers can be
 * added without changing code.  See `src/config/tiers.json` in the
 * application for how tier names map to SKU identifiers.
 */

// Define CORS headers once for reuse
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper for structured logging
const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Build a map of tiers to Stripe price IDs from environment variables.
// When adding a new tier you must set the corresponding env var in
// Supabase.  An empty string will cause checkout creation to
// fail, so ensure all expected tiers are configured.
const buildPriceMap = () => {
  const corePrice = Deno.env.get("STRIPE_PRICE_CORE");
  const plusPrice = Deno.env.get("STRIPE_PRICE_PLUS"); 
  const proPrice = Deno.env.get("STRIPE_PRICE_PRO");
  
  logStep("Building price map", {
    corePrice: corePrice ? `${corePrice.substring(0, 10)}...` : "MISSING",
    plusPrice: plusPrice ? `${plusPrice.substring(0, 10)}...` : "MISSING",
    proPrice: proPrice ? `${proPrice.substring(0, 10)}...` : "MISSING"
  });
  
  return {
    Core: corePrice ?? "",
    Plus: plusPrice ?? "",
    Pro: proPrice ?? "",
  };
};

// Main handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  try {
    logStep("Function started");
    
    // Debug environment variables
    const corePrice = Deno.env.get("STRIPE_PRICE_CORE");
    const plusPrice = Deno.env.get("STRIPE_PRICE_PLUS");
    const proPrice = Deno.env.get("STRIPE_PRICE_PRO");
    logStep("Environment variables check", { 
      corePrice: corePrice ? "SET" : "MISSING",
      plusPrice: plusPrice ? "SET" : "MISSING", 
      proPrice: proPrice ? "SET" : "MISSING",
      stripeSecret: Deno.env.get("STRIPE_SECRET_KEY") ? "SET" : "MISSING"
    });

    // Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialise Stripe client
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Attempt to find existing customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("Creating new customer");
    }

    // Build the price map and determine requested tier from JSON body. Default to Core.
    const priceMap = buildPriceMap();
    let tier = "Core";
    try {
      const body = await req.json();
      if (
        body &&
        typeof body.tier === "string" &&
        priceMap[body.tier as keyof typeof priceMap]
      ) {
        tier = body.tier;
      }
    } catch (_) {
      // If parsing fails just use the default
    }
    logStep("Selected tier", { tier });
    const priceId = priceMap[tier];
    if (!priceId) {
      logStep("Available price map", priceMap);
      throw new Error(`Price ID for tier '${tier}' is not configured. Check environment variables.`);
    }

    // Create the checkout session using a preconfigured price ID
    const origin = req.headers.get("origin") || "https://www.flowsightfi.com";
    
    // Build session options - only use customer_update if we have an existing customer
    const sessionOptions: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
    };
    
    // Only add customer_update if we have an existing customer
    if (customerId) {
      sessionOptions.customer_update = {
        address: "auto",
      };
    }
    
    const session = await stripe.checkout.sessions.create(sessionOptions);

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});