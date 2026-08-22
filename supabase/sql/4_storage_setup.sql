-- =============================================================================
-- SQL 4 — Supabase Storage Buckets & Policies (Run Fourth)
-- SITI FRUITIES — Phase 3B Database Implementation
-- =============================================================================

-- 1. Create Public Storage Buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('promo-flyers', 'promo-flyers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;


-- 2. Storage Policies for product-images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin can upload product images" ON storage.objects;
CREATE POLICY "Admin can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can update product images" ON storage.objects;
CREATE POLICY "Admin can update product images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can delete product images" ON storage.objects;
CREATE POLICY "Admin can delete product images" ON storage.objects
    FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin());


-- 3. Storage Policies for promo-flyers
DROP POLICY IF EXISTS "Public can view promo flyers" ON storage.objects;
CREATE POLICY "Public can view promo flyers" ON storage.objects
    FOR SELECT USING (bucket_id = 'promo-flyers');

DROP POLICY IF EXISTS "Admin can upload promo flyers" ON storage.objects;
CREATE POLICY "Admin can upload promo flyers" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'promo-flyers' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can update promo flyers" ON storage.objects;
CREATE POLICY "Admin can update promo flyers" ON storage.objects
    FOR UPDATE USING (bucket_id = 'promo-flyers' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can delete promo flyers" ON storage.objects;
CREATE POLICY "Admin can delete promo flyers" ON storage.objects
    FOR DELETE USING (bucket_id = 'promo-flyers' AND public.is_admin());
