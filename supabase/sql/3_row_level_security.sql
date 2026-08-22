-- =============================================================================
-- SQL 3 — Row Level Security (RLS) & Access Policies (Run Third)
-- SITI FRUITIES — Phase 3B Database Implementation
-- =============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_parfait_quotes ENABLE ROW LEVEL SECURITY;


-- 2. Categories Policies
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;
CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 3. Products Policies
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
CREATE POLICY "Admin can manage products" ON public.products
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 4. Delivery Zones Policies
DROP POLICY IF EXISTS "Public can view delivery zones" ON public.delivery_zones;
CREATE POLICY "Public can view delivery zones" ON public.delivery_zones
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage delivery zones" ON public.delivery_zones;
CREATE POLICY "Admin can manage delivery zones" ON public.delivery_zones
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 5. Promotions Policies
DROP POLICY IF EXISTS "Public can view active promotions" ON public.promotions;
CREATE POLICY "Public can view active promotions" ON public.promotions
    FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can manage promotions" ON public.promotions;
CREATE POLICY "Admin can manage promotions" ON public.promotions
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 6. Coupons Policies (Direct table access restricted; public uses validate_and_apply_coupon RPC)
DROP POLICY IF EXISTS "Admin can manage coupons" ON public.coupons;
CREATE POLICY "Admin can manage coupons" ON public.coupons
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can read coupons for checkout verification" ON public.coupons;
CREATE POLICY "Public can read coupons for checkout verification" ON public.coupons
    FOR SELECT USING (is_active = true);


-- 7. Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND role = 'customer');

DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.profiles;
CREATE POLICY "Admin can manage all profiles" ON public.profiles
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 8. Saved Addresses Policies
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.saved_addresses;
CREATE POLICY "Users can manage their own addresses" ON public.saved_addresses
    FOR ALL USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());


-- 9. Orders Policies
DROP POLICY IF EXISTS "Anyone can create orders (guest or user)" ON public.orders;
CREATE POLICY "Anyone can create orders (guest or user)" ON public.orders
    FOR INSERT WITH CHECK (
        user_id IS NULL OR user_id = auth.uid() OR public.is_admin()
    );

DROP POLICY IF EXISTS "Users can view their own orders; admin views all" ON public.orders;
CREATE POLICY "Users can view their own orders; admin views all" ON public.orders
    FOR SELECT USING (
        (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR public.is_admin()
    );

DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
CREATE POLICY "Admin can update orders" ON public.orders
    FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 10. Order Items Policies
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view items of their orders; admin views all" ON public.order_items;
CREATE POLICY "Users can view items of their orders; admin views all" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND ((auth.uid() IS NOT NULL AND o.user_id = auth.uid()) OR public.is_admin())
        )
    );


-- 11. Catering Enquiries Policies
DROP POLICY IF EXISTS "Anyone can submit catering enquiry" ON public.catering_enquiries;
CREATE POLICY "Anyone can submit catering enquiry" ON public.catering_enquiries
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view and manage catering enquiries" ON public.catering_enquiries;
CREATE POLICY "Admin can view and manage catering enquiries" ON public.catering_enquiries
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 12. Custom Parfait Quotes Policies
DROP POLICY IF EXISTS "Anyone can submit custom parfait quote" ON public.custom_parfait_quotes;
CREATE POLICY "Anyone can submit custom parfait quote" ON public.custom_parfait_quotes
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view and manage custom parfait quotes" ON public.custom_parfait_quotes;
CREATE POLICY "Admin can view and manage custom parfait quotes" ON public.custom_parfait_quotes
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
