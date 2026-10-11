-- SITI FRUITIES — First-Party Marketing Analytics
-- Run manually in Supabase Dashboard > SQL Editor. Do not run automatically.

CREATE TABLE IF NOT EXISTS public.marketing_events (
    event_id UUID PRIMARY KEY,
    visitor_id UUID NOT NULL,
    event_name TEXT NOT NULL CHECK (
        event_name IN ('page_view', 'product_view', 'add_to_cart', 'checkout_start', 'engagement')
    ),
    page_path TEXT NOT NULL CHECK (
        char_length(page_path) BETWEEN 1 AND 512
        AND left(page_path, 1) = '/'
        AND position('?' IN page_path) = 0
        AND position('#' IN page_path) = 0
    ),
    referrer_host TEXT CHECK (referrer_host IS NULL OR char_length(referrer_host) <= 253),
    utm_source TEXT CHECK (utm_source IS NULL OR char_length(utm_source) <= 100),
    utm_medium TEXT CHECK (utm_medium IS NULL OR char_length(utm_medium) <= 100),
    utm_campaign TEXT CHECK (utm_campaign IS NULL OR char_length(utm_campaign) <= 100),
    product_id TEXT CHECK (product_id IS NULL OR char_length(product_id) BETWEEN 1 AND 80),
    engagement_seconds SMALLINT CHECK (
        engagement_seconds IS NULL OR engagement_seconds BETWEEN 1 AND 30
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT marketing_events_payload_shape CHECK (
        (event_name IN ('product_view', 'add_to_cart') AND product_id IS NOT NULL)
        OR (event_name NOT IN ('product_view', 'add_to_cart') AND product_id IS NULL)
    ),
    CONSTRAINT marketing_events_engagement_shape CHECK (
        (event_name = 'engagement' AND engagement_seconds IS NOT NULL)
        OR (event_name <> 'engagement' AND engagement_seconds IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS marketing_events_created_name_idx
    ON public.marketing_events (created_at, event_name);
CREATE INDEX IF NOT EXISTS marketing_events_visitor_created_idx
    ON public.marketing_events (visitor_id, created_at);
CREATE INDEX IF NOT EXISTS marketing_events_page_created_idx
    ON public.marketing_events (page_path, created_at)
    WHERE event_name = 'page_view';

ALTER TABLE public.marketing_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view marketing analytics events" ON public.marketing_events;
CREATE POLICY "Admins can view marketing analytics events"
    ON public.marketing_events
    FOR SELECT TO authenticated
    USING (public.is_admin());

REVOKE ALL ON TABLE public.marketing_events FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.marketing_events TO authenticated;
GRANT INSERT ON TABLE public.marketing_events TO service_role;

CREATE OR REPLACE FUNCTION public.get_marketing_analytics(
    p_from TIMESTAMPTZ,
    p_to TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
    END IF;
    IF p_from IS NULL OR p_to IS NULL OR p_from >= p_to OR p_to > now() + interval '1 minute'
       OR p_to - p_from > interval '31 days' THEN
        RAISE EXCEPTION 'Invalid analytics date range' USING ERRCODE = '22023';
    END IF;

    SELECT jsonb_build_object(
        'page_views', (SELECT count(*) FROM public.marketing_events
            WHERE created_at >= p_from AND created_at < p_to AND event_name = 'page_view'),
        'unique_visitors', (SELECT count(DISTINCT visitor_id) FROM public.marketing_events
            WHERE created_at >= p_from AND created_at < p_to),
        'product_views', (SELECT count(*) FROM public.marketing_events
            WHERE created_at >= p_from AND created_at < p_to AND event_name = 'product_view'),
        'add_to_cart', (SELECT count(*) FROM public.marketing_events
            WHERE created_at >= p_from AND created_at < p_to AND event_name = 'add_to_cart'),
        'checkout_starts', (SELECT count(*) FROM public.marketing_events
            WHERE created_at >= p_from AND created_at < p_to AND event_name = 'checkout_start'),
        'estimated_engagement_seconds_per_view', COALESCE((
            SELECT round(sum(engagement_seconds)::numeric / NULLIF((
                SELECT count(*) FROM public.marketing_events
                WHERE created_at >= p_from AND created_at < p_to AND event_name = 'page_view'
            ), 0), 1)
            FROM public.marketing_events
            WHERE created_at >= p_from AND created_at < p_to AND event_name = 'engagement'
        ), 0),
        'paid_purchases', (SELECT count(*) FROM public.orders
            WHERE payment_status = 'paid' AND created_at >= p_from AND created_at < p_to),
        'paid_revenue', COALESCE((SELECT sum(total) FROM public.orders
            WHERE payment_status = 'paid' AND created_at >= p_from AND created_at < p_to), 0),
        'top_pages', COALESCE((
            SELECT jsonb_agg(to_jsonb(r)) FROM (
                SELECT page_path AS label, count(*) AS count
                FROM public.marketing_events
                WHERE created_at >= p_from AND created_at < p_to AND event_name = 'page_view'
                GROUP BY page_path ORDER BY count DESC, page_path LIMIT 10
            ) r
        ), '[]'::jsonb),
        'traffic_sources', COALESCE((
            SELECT jsonb_agg(to_jsonb(r)) FROM (
                SELECT COALESCE(NULLIF(utm_source, ''), NULLIF(referrer_host, ''), 'Direct') AS label,
                       count(*) AS count
                FROM public.marketing_events
                WHERE created_at >= p_from AND created_at < p_to AND event_name = 'page_view'
                GROUP BY 1 ORDER BY count DESC, label LIMIT 10
            ) r
        ), '[]'::jsonb),
        'referrers', COALESCE((
            SELECT jsonb_agg(to_jsonb(r)) FROM (
                SELECT COALESCE(NULLIF(referrer_host, ''), 'Direct / none') AS label,
                       count(*) AS count
                FROM public.marketing_events
                WHERE created_at >= p_from AND created_at < p_to AND event_name = 'page_view'
                GROUP BY 1 ORDER BY count DESC, label LIMIT 10
            ) r
        ), '[]'::jsonb),
        'utm_campaigns', COALESCE((
            SELECT jsonb_agg(to_jsonb(r)) FROM (
                SELECT COALESCE(NULLIF(utm_source, ''), '(not set)') AS source,
                       COALESCE(NULLIF(utm_medium, ''), '(not set)') AS medium,
                       COALESCE(NULLIF(utm_campaign, ''), '(not set)') AS campaign,
                       count(*) AS count
                FROM public.marketing_events
                WHERE created_at >= p_from AND created_at < p_to AND event_name = 'page_view'
                  AND (utm_source IS NOT NULL OR utm_medium IS NOT NULL OR utm_campaign IS NOT NULL)
                GROUP BY 1, 2, 3 ORDER BY count DESC, source, medium, campaign LIMIT 10
            ) r
        ), '[]'::jsonb),
        'product_rankings', COALESCE((
            SELECT jsonb_agg(to_jsonb(r)) FROM (
                SELECT product_id AS label, count(*) AS count
                FROM public.marketing_events
                WHERE created_at >= p_from AND created_at < p_to AND event_name = 'product_view'
                GROUP BY product_id ORDER BY count DESC, product_id LIMIT 10
            ) r
        ), '[]'::jsonb)
    ) INTO v_result;

    RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_marketing_analytics(TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_marketing_analytics(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
