// Supabase Edge Function: paystack-webhook
// Secure, idempotent Paystack webhook handler with HMAC SHA512 signature verification.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

async function verifyHmacSha512(secret: string, body: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign", "verify"]
  );
  const signatureBytes = new Uint8Array(
    signature.match(/[\da-f]{2}/gi)?.map((h) => parseInt(h, 16)) || []
  );
  return await crypto.subtle.verify("HMAC", key, signatureBytes, encoder.encode(body));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!paystackSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error("Missing required server environment variables.");
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const signature = req.headers.get("x-paystack-signature");
    const rawBody = await req.text();

    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing signature header" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isValid = await verifyHmacSha512(paystackSecret, rawBody, signature);
    if (!isValid) {
      console.warn("Unauthorized webhook attempt: invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = JSON.parse(rawBody);

    // Handle successful charge
    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;
      const amountPaidKobo = data.amount; // in Kobo

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Find order by paystack_reference or metadata order_id or order_number
      let query = supabase.from("orders").select("id, total, payment_status, order_number");

      if (data.metadata?.order_id) {
        query = query.eq("id", data.metadata.order_id);
      } else if (reference) {
        query = query.or(`paystack_reference.eq.${reference},order_number.eq.${reference}`);
      }

      const { data: order, error: orderError } = await query.maybeSingle();

      if (orderError || !order) {
        console.error("Order lookup failed for reference:", reference, orderError);
        return new Response(JSON.stringify({ received: true, warning: "Order not found" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check amount matching (order.total in Naira * 100 = kobo)
      const expectedKobo = Math.round(Number(order.total) * 100);
      if (amountPaidKobo < expectedKobo) {
        console.error(`Amount mismatch for order ${order.order_number}: expected ${expectedKobo} kobo, got ${amountPaidKobo} kobo`);
        return new Response(JSON.stringify({ received: true, error: "Amount underpaid" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Execute atomic confirmation RPC
      const { data: result, error: confirmError } = await supabase.rpc("confirm_order_payment", {
        p_order_id: order.id,
        p_paystack_ref: reference,
      });

      if (confirmError) {
        console.error("Payment confirmation RPC error:", confirmError);
        return new Response(JSON.stringify({ error: "Failed to confirm order" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Payment confirmed for Order: ${order.order_number}, Ref: ${reference}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
