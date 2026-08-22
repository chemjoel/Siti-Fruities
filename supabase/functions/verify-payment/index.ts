// Supabase Edge Function: verify-payment
// Server-side Paystack transaction verification fallback

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!paystackSecret || !supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { reference, order_id } = await req.json();

    if (!reference) {
      return new Response(JSON.stringify({ error: "Missing transaction reference" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Paystack verify endpoint securely
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data?.status !== "success") {
      return new Response(JSON.stringify({
        success: false,
        message: verifyData.data?.gateway_response || "Payment was not successful",
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const transaction = verifyData.data;
    const amountPaidKobo = transaction.amount;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up order
    let query = supabase.from("orders").select("id, total, payment_status, order_number");
    if (order_id) {
      query = query.eq("id", order_id);
    } else {
      query = query.or(`paystack_reference.eq.${reference},order_number.eq.${reference}`);
    }

    const { data: order, error: orderError } = await query.maybeSingle();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Amount match check
    const expectedKobo = Math.round(Number(order.total) * 100);
    if (amountPaidKobo < expectedKobo) {
      return new Response(JSON.stringify({ error: "Amount underpaid" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Confirm payment atomically
    const { data: result, error: confirmError } = await supabase.rpc("confirm_order_payment", {
      p_order_id: order.id,
      p_paystack_ref: reference,
    });

    if (confirmError) {
      return new Response(JSON.stringify({ error: "Failed to confirm order in database" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      order_number: order.order_number,
      message: "Payment successfully verified and confirmed",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
