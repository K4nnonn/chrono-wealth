import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * Supabase edge function to handle Stripe webhooks.
 *
 * This handler listens for subscription‑related events and keeps the
 * `subscribers` table in sync.  It supports multiple tiers by
 * mapping Stripe price IDs to tier names via environment variables.
 * Events handled:
 *   - customer.subscription.created / updated: upsert the subscriber
 *     with the current tier and period end date.
 *   - customer.subscription.deleted: mark the subscriber as unsubscribed.
 *
 * Note: For security, configure the `STRIPE_WEBHOOK_SECRET` variable in
 * your Supabase/Vercel environment.  Without a valid signature this
 * function will reject the request.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Build price ID → tier mapping
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
  // Respond to CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

  try {
    logStep("Received webhook");
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Missing Stripe signature header");
    }
    const rawBody = await req.text();
    // Construct the event using Stripe's helper.  Throws if signature invalid.
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
    logStep("Webhook parsed", { type: event.type });

    // Helper to upsert subscriber record
    const upsertSubscriber = async (
      email: string,
      userId: string | null,
      customerId: string | null,
      subscribed: boolean,
      tier: string | null,
      endDate: string | null,
    ) => {
      await supabaseClient.from("subscribers").upsert(
        {
          email,
          user_id: userId,
          stripe_customer_id: customerId,
          subscribed,
          subscription_tier: tier,
          subscription_end: endDate,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      );
    };

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const end = new Date(subscription.current_period_end * 1000).toISOString();
        // Determine tier from price ID of first item
        let tier: string | null = null;
        if (subscription.items.data.length > 0) {
          const priceId = subscription.items.data[0].price?.id;
          if (priceId && priceTierMap[priceId]) {
            tier = priceTierMap[priceId];
          }
        }
        // Look up email/user_id via Supabase (subscribers table stores by email).  If we cannot find
        // the record we still update based on the customer ID only.
        const { data, error } = await supabaseClient
          .from("subscribers")
          .select("email, user_id")
          .eq("stripe_customer_id", customerId)
          .limit(1)
          .maybeSingle();
        if (error) {
          throw error;
        }
        await upsertSubscriber(
          data?.email ?? "unknown@example.com",
          data?.user_id ?? null,
          customerId,
          true,
          tier,
          end,
        );
        logStep("Subscription created/updated", { customerId, tier, end });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        // Upsert unsubscribed state
        const { data, error } = await supabaseClient
          .from("subscribers")
          .select("email, user_id")
          .eq("stripe_customer_id", customerId)
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        await upsertSubscriber(
          data?.email ?? "unknown@example.com",
          data?.user_id ?? null,
          customerId,
          false,
          null,
          null,
        );
        logStep("Subscription deleted", { customerId });
        break;
      }
      default:
        // Ignore unhandled events
        logStep("Unhandled event", { type: event.type });
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message });
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});