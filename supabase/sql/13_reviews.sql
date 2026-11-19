-- =============================================================================
-- SQL 13 — Customer review screenshots (read from Supabase)
-- Run in the Supabase SQL Editor after files 1–10 (needs is_admin() and
-- handle_updated_at() from SQL 2). Safe to re-run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL DEFAULT 'Customer review on WhatsApp',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_order ON public.testimonials (is_active, display_order);

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active testimonials" ON public.testimonials;
CREATE POLICY "Public can view active testimonials" ON public.testimonials
    FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can manage testimonials" ON public.testimonials;
CREATE POLICY "Admin can manage testimonials" ON public.testimonials
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- The 8 new review screenshots (replaces any existing rows)
DELETE FROM public.testimonials;
INSERT INTO public.testimonials (image_url, alt_text, display_order) VALUES
    ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/reviews/IMG-20261118-WA0000.jpg', 'Customer review on WhatsApp', 1),
    ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/reviews/IMG-20261118-WA0001.jpg', 'Customer review on WhatsApp', 2),
    ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/reviews/IMG-20261118-WA0002.jpg', 'Customer review on WhatsApp', 3),
    ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/reviews/IMG-20261118-WA0003.jpg', 'Customer review on WhatsApp', 4),
    ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/reviews/IMG-20261118-WA0004.jpg', 'Customer review on WhatsApp', 5),
    ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/reviews/IMG-20261118-WA0005.jpg', 'Customer review on WhatsApp', 6),
    ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/reviews/IMG-20261118-WA0006.jpg', 'Customer review on WhatsApp', 7),
    ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/reviews/IMG-20261118-WA0007.jpg', 'Customer review on WhatsApp', 8);
