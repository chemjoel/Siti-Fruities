// Public, validated first-party event ingestion. Database writes use service-role
// credentials on the server; browser clients have no direct INSERT permission.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const allowedNames = new Set([
  "page_view",
  "product_view",
  "add_to_cart",
  "checkout_start",
  "engagement",
]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const rateLimits = new Map<string, { minute: number; minuteCount: number; day: number; dayCount: number }>();
const MAX_BODY_BYTES = 16_384;
const MAX_BATCH_SIZE = 20;

interface ValidAnalyticsEvent {
  event_id: string;
  visitor_id: string;
  event_name: string;
  page_path: string;
  referrer_host: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  product_id: string | null;
  engagement_seconds: number | null;
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function normalizeShortText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/[^\p{L}\p{N} ._~+-]/gu, "").slice(0, 100);
  return normalized || null;
}

function normalizeHost(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 253) return null;
  const host = value.trim().toLowerCase();
  if (!host || !/^[a-z0-9.-]+$/.test(host) || host.startsWith(".") || host.endsWith(".")) return null;
  return host;
}

function consumeRateLimit(visitorId: string, count: number): boolean {
  const now = Date.now();
  const minute = Math.floor(now / 60_000);
  const day = Math.floor(now / 86_400_000);
  const previous = rateLimits.get(visitorId);
  const current = {
    minute,
    minuteCount: (previous?.minute === minute ? previous.minuteCount : 0) + count,
    day,
    dayCount: (previous?.day === day ? previous.dayCount : 0) + count,
  };

  if (current.minuteCount > 60 || current.dayCount > 500) return false;
  rateLimits.set(visitorId, current);
  if (rateLimits.size > 5_000) {
    for (const [key, limit] of rateLimits) {
      if (limit.day < day) rateLimits.delete(key);
      if (rateLimits.size <= 4_000) break;
    }
  }
  return true;
}

function normalizeEvent(event: Record<string, unknown>): ValidAnalyticsEvent | null {
  const eventName = event.event_name;
  if (typeof eventName !== "string" || !allowedNames.has(eventName)) return null;
  if (typeof event.event_id !== "string" || !uuidPattern.test(event.event_id)) return null;
  if (typeof event.visitor_id !== "string" || !uuidPattern.test(event.visitor_id)) return null;
  if (typeof event.page_path !== "string" || event.page_path.length > 512
      || !event.page_path.startsWith("/") || event.page_path.startsWith("//")
      || event.page_path.includes("?") || event.page_path.includes("#")
      || /[\u0000-\u001f]/.test(event.page_path)) return null;

  const productId = event.product_id;
  if (eventName === "product_view" || eventName === "add_to_cart") {
    if (typeof productId !== "string" || !/^[A-Za-z0-9:_-]{1,80}$/.test(productId)) return null;
  } else if (productId !== null) {
    return null;
  }

  let engagementSeconds: number | null = null;
  if (eventName === "engagement") {
    if (!Number.isInteger(event.engagement_seconds)
        || Number(event.engagement_seconds) < 1 || Number(event.engagement_seconds) > 30) return null;
    engagementSeconds = Number(event.engagement_seconds);
  } else if (event.engagement_seconds !== null) {
    return null;
  }

  return {
    event_id: event.event_id,
    visitor_id: event.visitor_id,
    event_name: eventName,
    page_path: event.page_path,
    referrer_host: normalizeHost(event.referrer_host),
    utm_source: normalizeShortText(event.utm_source),
    utm_medium: normalizeShortText(event.utm_medium),
    utm_campaign: normalizeShortText(event.utm_campaign),
    product_id: typeof productId === "string" ? productId : null,
    engagement_seconds: engagementSeconds,
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = (Deno.env.get("ANALYTICS_ALLOWED_ORIGINS") || "")
    .split(",").map((value) => value.trim()).filter(Boolean);

  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response(JSON.stringify({ error: "Origin is not allowed" }), { status: 403 });
  }

  const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });

  try {
    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: "Request too large" }), { status: 413, headers });
    }

    const body = JSON.parse(rawBody);
    if (!Array.isArray(body?.events) || body.events.length < 1 || body.events.length > MAX_BATCH_SIZE) {
      return new Response(JSON.stringify({ error: "Invalid event batch" }), { status: 400, headers });
    }

    const events: (ValidAnalyticsEvent | null)[] = body.events.map((event: unknown) =>
      event && typeof event === "object" ? normalizeEvent(event as Record<string, unknown>) : null
    );
    if (events.some((event: unknown) => event === null)) {
      return new Response(JSON.stringify({ error: "Invalid event payload" }), { status: 400, headers });
    }

    const typedEvents = events.filter((event): event is ValidAnalyticsEvent => event !== null);
    const byVisitor = new Map<string, number>();
    for (const event of typedEvents) {
      byVisitor.set(event.visitor_id, (byVisitor.get(event.visitor_id) || 0) + 1);
    }
    for (const [visitorId, count] of byVisitor) {
      if (!consumeRateLimit(visitorId, count)) {
        return new Response(JSON.stringify({ error: "Event rate limit exceeded" }), { status: 429, headers });
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing analytics ingestion server configuration.");
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), { status: 500, headers });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { error } = await supabase
      .from("marketing_events")
      .upsert(typedEvents, { onConflict: "event_id", ignoreDuplicates: true });
    if (error) {
      console.error("Analytics event insert failed:", error.message);
      return new Response(JSON.stringify({ error: "Event storage failed" }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ accepted: true }), { status: 200, headers });
  } catch (error) {
    console.error("Analytics ingestion request failed:", error instanceof Error ? error.message : "Unknown error");
    return new Response(JSON.stringify({ error: "Invalid analytics request" }), { status: 400, headers });
  }
});
