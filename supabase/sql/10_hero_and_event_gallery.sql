-- =============================================================================
-- SQL 10 — Hero Photo Slides + Event Gallery + Media Bucket
-- SITI FRUITIES — run in Supabase SQL Editor AFTER files 1–9
-- Safe to re-run (idempotent).
-- =============================================================================

-- 1. TABLES -------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL DEFAULT 'Siti Fruities parfait',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,              -- optional poster image for videos
    caption TEXT,
    event_name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON public.hero_slides (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_event_gallery_order ON public.event_gallery (is_active, display_order);


-- 2. updated_at TRIGGERS (uses handle_updated_at() from SQL 2) -----------------

DROP TRIGGER IF EXISTS set_hero_slides_updated_at ON public.hero_slides;
CREATE TRIGGER set_hero_slides_updated_at
    BEFORE UPDATE ON public.hero_slides
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_event_gallery_updated_at ON public.event_gallery;
CREATE TRIGGER set_event_gallery_updated_at
    BEFORE UPDATE ON public.event_gallery
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- 3. ROW LEVEL SECURITY -------------------------------------------------------

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active hero slides" ON public.hero_slides;
CREATE POLICY "Public can view active hero slides" ON public.hero_slides
    FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can manage hero slides" ON public.hero_slides;
CREATE POLICY "Admin can manage hero slides" ON public.hero_slides
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view active event gallery" ON public.event_gallery;
CREATE POLICY "Public can view active event gallery" ON public.event_gallery
    FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can manage event gallery" ON public.event_gallery;
CREATE POLICY "Admin can manage event gallery" ON public.event_gallery
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 4. STORAGE BUCKET: site-media (images + videos, public read) ----------------
-- 50 MB per file (Supabase free-plan ceiling). Compress event videos before upload.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'site-media', 'site-media', true, 52428800,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif',
          'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view site media" ON storage.objects;
CREATE POLICY "Public can view site media" ON storage.objects
    FOR SELECT USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "Admin can upload site media" ON storage.objects;
CREATE POLICY "Admin can upload site media" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can update site media" ON storage.objects;
CREATE POLICY "Admin can update site media" ON storage.objects
    FOR UPDATE USING (bucket_id = 'site-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can delete site media" ON storage.objects;
CREATE POLICY "Admin can delete site media" ON storage.objects
    FOR DELETE USING (bucket_id = 'site-media' AND public.is_admin());


-- 5. STARTER HERO SLIDES (existing parfait photos, so the hero never looks empty)
-- Only inserts if the table is empty. Replace later with the new Supabase URLs.

INSERT INTO public.hero_slides (image_url, alt_text, display_order)
SELECT v.image_url, v.alt_text, v.display_order
FROM (VALUES
    ('/assets/IMG_8455_parfait_bowls.jpg', 'VVIP Exotic Parfait bowls', 1),
    ('/assets/IMG_6519_parfait_500ml.jpg', 'Medium 500ml parfait cups', 2),
    ('/assets/IMG_1639_parfait_1l.jpg',    '1 litre Ay Bowl parfait',    3),
    ('/assets/IMG_8435_parfait_multi.jpg', 'Fresh daily parfait lineup', 4)
) AS v(image_url, alt_text, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.hero_slides);


-- 6. REAL MEDIA LINKS (uploaded to the site-media bucket) ----------------------
-- Replaces the starter hero rows and loads the event gallery. Safe to re-run.

-- Hero photo grid
DELETE FROM public.hero_slides;
INSERT INTO public.hero_slides (image_url, alt_text, display_order) VALUES
  ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES.1.jpg', 'Siti Fruities parfait', 1),
  ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES2.jpg', 'Siti Fruities parfait', 2),
  ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES5.jpg', 'Siti Fruities parfait', 3),
  ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES6.jpg', 'Siti Fruities parfait', 4),
  ('https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/hero/SITIFRUTIES8.jpg', 'Siti Fruities parfait', 5);

-- Event gallery
DELETE FROM public.event_gallery;
INSERT INTO public.event_gallery (media_type, media_url, thumbnail_url, caption, event_name, display_order) VALUES
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4728.jpg', NULL, NULL, NULL, 1),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0024.mp4', NULL, NULL, NULL, 2),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4732.jpg', NULL, NULL, NULL, 3),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0020.mp4', NULL, NULL, NULL, 4),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4734.jpg', NULL, NULL, NULL, 5),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0021.mp4', NULL, NULL, NULL, 6),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4735.jpg', NULL, NULL, NULL, 7),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0022.mp4', NULL, NULL, NULL, 8),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4736.jpg', NULL, NULL, NULL, 9),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0023.mp4', NULL, NULL, NULL, 10),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4741.jpg', NULL, NULL, NULL, 11),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0025.mp4', NULL, NULL, NULL, 12),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4743.jpg', NULL, NULL, NULL, 13),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0026.mp4', NULL, NULL, NULL, 14),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4782.jpg', NULL, NULL, NULL, 15),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0027.mp4', NULL, NULL, NULL, 16),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4873.jpg', NULL, NULL, NULL, 17),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0028.mp4', NULL, NULL, NULL, 18),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_4934.jpg', NULL, NULL, NULL, 19),
  ('video', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/VID-20261024-WA0029.mp4', NULL, NULL, NULL, 20),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_7621.JPEG', NULL, NULL, NULL, 21),
  ('image', 'https://ltkuakrkcjiktkwovhjq.supabase.co/storage/v1/object/public/site-media/events/IMG_9382.jpg', NULL, NULL, NULL, 22);
