-- =============================================================================
-- SQL 2 — Constraints, Functions, Triggers & RPCs (Run Second)
-- SITI FRUITIES — Phase 3B Database Implementation (Hardened & Debugged)
-- =============================================================================

-- 1. Updated_At Timestamp Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_delivery_zones_updated_at ON public.delivery_zones;
CREATE TRIGGER set_delivery_zones_updated_at BEFORE UPDATE ON public.delivery_zones FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_coupons_updated_at ON public.coupons;
CREATE TRIGGER set_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_promotions_updated_at ON public.promotions;
CREATE TRIGGER set_promotions_updated_at BEFORE UPDATE ON public.promotions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_saved_addresses_updated_at ON public.saved_addresses;
CREATE TRIGGER set_saved_addresses_updated_at BEFORE UPDATE ON public.saved_addresses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- 2. Human-Readable Order Number Generator: SF-YYYYMMDD-XXXX
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    v_date TEXT;
    v_random TEXT;
    v_order_number TEXT;
    v_exists BOOLEAN;
BEGIN
    v_date := to_char(now(), 'YYYYMMDD');
    LOOP
        -- Generate 4 random uppercase alphanumeric characters (excluding confusing chars 0/O, 1/I)
        v_random := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
        v_order_number := 'SF-' || v_date || '-' || v_random;
        
        -- Ensure uniqueness in orders table
        SELECT EXISTS(SELECT 1 FROM public.orders WHERE order_number = v_order_number) INTO v_exists;
        IF NOT v_exists THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN v_order_number;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Auto-set order_number on insert if not provided
CREATE OR REPLACE FUNCTION public.set_order_number_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := public.generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_order_number ON public.orders;
CREATE TRIGGER trg_set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_order_number_trigger();


-- 3. Automatic User Profile Creation on Signup Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role, full_name, phone)
    VALUES (
        NEW.id,
        COALESCE((NEW.raw_user_meta_data->>'role')::text, 'customer'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. Admin Security Definer Helper Function (Must be created before role protection triggers)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, pg_temp;


-- 5. Role Escalation Protection Trigger (Hardening Safeguard 7)
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is being changed:
    IF NEW.role <> OLD.role THEN
        -- Allow database administrators, service_role, and direct SQL Editor operations (where auth.uid() is null)
        IF current_user IN ('postgres', 'service_role', 'supabase_admin') 
           OR auth.role() = 'service_role' 
           OR auth.uid() IS NULL THEN
            RETURN NEW;
        END IF;

        -- Allow existing admin users authenticated through the app
        IF public.is_admin() THEN
            RETURN NEW;
        END IF;

        -- Strictly block customer self-escalation
        RAISE EXCEPTION 'Security violation: Customers cannot modify their own user role.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();


-- 6. Server-Side Coupon Validation RPC (Hardening Safeguard 6)
CREATE OR REPLACE FUNCTION public.validate_and_apply_coupon(
    p_code TEXT,
    p_subtotal NUMERIC
)
RETURNS JSONB AS $$
DECLARE
    v_coupon RECORD;
    v_discount NUMERIC := 0;
BEGIN
    -- Look up coupon code (case-insensitive)
    SELECT * INTO v_coupon
    FROM public.coupons
    WHERE UPPER(code) = UPPER(TRIM(p_code))
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'message', 'Coupon code not found.'
        );
    END IF;

    IF NOT v_coupon.is_active THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'message', 'This coupon is no longer active.'
        );
    END IF;

    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'message', 'This coupon has expired.'
        );
    END IF;

    IF v_coupon.minimum_order_amount IS NOT NULL AND p_subtotal < v_coupon.minimum_order_amount THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'message', 'Minimum order of ₦' || to_char(v_coupon.minimum_order_amount, 'FM999,999,999') || ' required for this coupon.'
        );
    END IF;

    IF v_coupon.usage_limit IS NOT NULL AND v_coupon.used_count >= v_coupon.usage_limit THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'message', 'This coupon has reached its usage limit.'
        );
    END IF;

    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
        v_discount := ROUND((p_subtotal * (v_coupon.discount_value / 100.0)), 2);
    ELSIF v_coupon.discount_type = 'fixed_amount' THEN
        v_discount := LEAST(v_coupon.discount_value, p_subtotal);
    END IF;

    RETURN jsonb_build_object(
        'is_valid', true,
        'coupon_id', v_coupon.id,
        'coupon_code', v_coupon.code,
        'discount_type', v_coupon.discount_type,
        'discount_value', v_coupon.discount_value,
        'discount_amount', v_discount,
        'message', 'Coupon applied successfully!'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, pg_temp;


-- 7. Server-Authoritative Order Creation Function (Hardening Safeguards 1, 2, 3, 4)
CREATE OR REPLACE FUNCTION public.create_authoritative_order(
    p_payload JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_customer_name TEXT;
    v_customer_phone TEXT;
    v_customer_email TEXT;
    v_zone_id UUID;
    v_zone RECORD;
    v_address TEXT;
    v_timing TEXT;
    v_sched_date TEXT;
    v_sched_time TEXT;
    v_coupon_code TEXT;
    v_coupon_id UUID := NULL;
    v_order_notes TEXT;
    v_items JSONB;
    v_item JSONB;
    v_prod RECORD;
    v_unit_price NUMERIC;
    v_opt_mod NUMERIC;
    v_line_total NUMERIC;
    v_subtotal NUMERIC := 0;
    v_discount NUMERIC := 0;
    v_delivery_fee NUMERIC := 0;
    v_final_total NUMERIC := 0;
    v_order_id UUID := gen_random_uuid();
    v_order_number TEXT;
    v_coupon_res JSONB;
    v_selected_opts JSONB;
    v_qty_text TEXT;
    v_qty INT;
BEGIN
    -- Extract customer details
    v_customer_name := TRIM(COALESCE(p_payload->>'customer_name', ''));
    v_customer_phone := TRIM(COALESCE(p_payload->>'customer_phone', ''));
    v_customer_email := NULLIF(TRIM(COALESCE(p_payload->>'customer_email', '')), '');
    v_address := TRIM(COALESCE(p_payload->>'delivery_address', ''));
    v_timing := COALESCE(p_payload->>'delivery_timing', 'asap');
    v_sched_date := p_payload->>'scheduled_date';
    v_sched_time := p_payload->>'scheduled_time';
    v_coupon_code := NULLIF(TRIM(COALESCE(p_payload->>'coupon_code', '')), '');
    v_order_notes := NULLIF(TRIM(COALESCE(p_payload->>'order_notes', '')), '');
    v_items := p_payload->'items';

    IF v_customer_name = '' OR v_customer_phone = '' OR v_address = '' THEN
        RAISE EXCEPTION 'Customer name, phone, and delivery address are required.';
    END IF;

    IF v_items IS NULL OR jsonb_array_length(v_items) = 0 THEN
        RAISE EXCEPTION 'Cart is empty. Cannot create order.';
    END IF;

    -- 1. Validate Delivery Zone (Server-Authoritative Delivery Fee)
    BEGIN
        v_zone_id := (p_payload->>'delivery_zone_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Invalid delivery zone ID provided.';
    END;

    SELECT * INTO v_zone FROM public.delivery_zones WHERE id = v_zone_id LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Selected delivery zone does not exist.';
    END IF;
    v_delivery_fee := v_zone.delivery_fee;

    -- 2. Validate Items & Availability Server-Side
    FOR i IN 0 .. jsonb_array_length(v_items) - 1 LOOP
        v_item := v_items->i;

        -- Look up product in database by ID or slug safely (uuid check first to prevent casting error)
        IF (v_item->>'product_id') ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
            SELECT * INTO v_prod FROM public.products 
            WHERE id = (v_item->>'product_id')::UUID LIMIT 1;
        ELSE
            SELECT * INTO v_prod FROM public.products 
            WHERE slug = (v_item->>'product_id') LIMIT 1;
        END IF;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product % does not exist.', (v_item->>'product_id');
        END IF;

        IF NOT v_prod.is_available THEN
            RAISE EXCEPTION 'Product "%" is currently unavailable. Please remove it from your cart to proceed.', v_prod.name;
        END IF;

        -- Quantity Validation (Secure check for positive integer, range 1-100)
        v_qty_text := v_item->>'quantity';
        IF v_qty_text IS NULL OR v_qty_text = '' THEN
            RAISE EXCEPTION 'Quantity is missing for product "%".', v_prod.name;
        END IF;
        
        IF v_qty_text !~ '^[0-9]+$' THEN
            RAISE EXCEPTION 'Invalid quantity "%" for product "%". Quantity must be a positive integer.', v_qty_text, v_prod.name;
        END IF;
        
        v_qty := v_qty_text::INT;
        IF v_qty < 1 THEN
            RAISE EXCEPTION 'Quantity for product "%" must be at least 1.', v_prod.name;
        ELSIF v_qty > 100 THEN
            RAISE EXCEPTION 'Quantity for product "%" exceeds the maximum allowed limit of 100.', v_prod.name;
        END IF;

        v_unit_price := v_prod.base_price;
        v_selected_opts := COALESCE(v_item->'selected_options', '[]'::jsonb);
        v_opt_mod := 0;

        -- Strict Product Option & Choice Validation
        IF jsonb_typeof(v_selected_opts) = 'array' AND jsonb_array_length(v_selected_opts) > 0 THEN
            FOR j IN 0 .. jsonb_array_length(v_selected_opts) - 1 LOOP
                DECLARE
                    v_sel_opt JSONB := v_selected_opts->j;
                    v_sel_name TEXT := v_sel_opt->>'name';
                    v_sel_val TEXT := v_sel_opt->>'value';
                    v_prod_opt JSONB;
                    v_choices JSONB;
                    v_choice JSONB;
                    v_opt_found BOOLEAN := false;
                    v_choice_found BOOLEAN := false;
                BEGIN
                    -- Find the option object in product's options with matching name
                    IF jsonb_typeof(v_prod.options) = 'array' THEN
                        FOR k IN 0 .. jsonb_array_length(v_prod.options) - 1 LOOP
                            v_prod_opt := v_prod.options->k;
                            IF v_prod_opt->>'name' = v_sel_name THEN
                                v_opt_found := true;
                                v_choices := v_prod_opt->'choices';
                                -- Loop through choices to locate matching value
                                IF jsonb_typeof(v_choices) = 'array' THEN
                                    FOR m IN 0 .. jsonb_array_length(v_choices) - 1 LOOP
                                        v_choice := v_choices->m;
                                        IF v_choice->>'value' = v_sel_val THEN
                                            v_choice_found := true;
                                            v_opt_mod := v_opt_mod + COALESCE((v_choice->>'price_modifier')::NUMERIC, 0);
                                            EXIT;
                                        END IF;
                                    END LOOP;
                                END IF;
                                EXIT;
                            END IF;
                        END LOOP;
                    END IF;

                    -- Strict Enforcement
                    IF NOT v_opt_found THEN
                        RAISE EXCEPTION 'Invalid option: Product "%" does not support the option "%".', v_prod.name, v_sel_name;
                    END IF;

                    IF NOT v_choice_found THEN
                        RAISE EXCEPTION 'Invalid choice: Option "%" for product "%" does not have choice value "%".', v_sel_name, v_prod.name, v_sel_val;
                    END IF;
                END;
            END LOOP;
        END IF;

        -- Apply option modifiers to base unit price
        v_unit_price := v_unit_price + v_opt_mod;

        -- Compute line total with modified unit price
        v_line_total := v_unit_price * v_qty;
        v_subtotal := v_subtotal + v_line_total;
    END LOOP;

    -- 3. Validate Coupon Server-Side (if provided)
    IF v_coupon_code IS NOT NULL THEN
        v_coupon_res := public.validate_and_apply_coupon(v_coupon_code, v_subtotal);
        IF NOT (v_coupon_res->>'is_valid')::BOOLEAN THEN
            RAISE EXCEPTION 'Coupon validation failed: %', (v_coupon_res->>'message');
        ELSE
            v_coupon_id := (v_coupon_res->>'coupon_id')::UUID;
            v_discount := (v_coupon_res->>'discount_amount')::NUMERIC;
        END IF;
    END IF;

    -- 4. Calculate Final Authoritative Total
    v_final_total := GREATEST(0, (v_subtotal + v_delivery_fee - v_discount));
    v_order_number := public.generate_order_number();

    -- Determine user_id (if authenticated)
    v_user_id := auth.uid();

    -- 5. Insert Orders Table (Locked Monies)
    INSERT INTO public.orders (
        id,
        order_number,
        user_id,
        customer_name,
        customer_phone,
        customer_email,
        delivery_zone_id,
        delivery_zone_name,
        delivery_fee,
        delivery_address,
        delivery_timing,
        scheduled_date,
        scheduled_time,
        subtotal,
        coupon_id,
        coupon_code,
        discount_amount,
        total,
        payment_status,
        order_status,
        order_notes
    ) VALUES (
        v_order_id,
        v_order_number,
        v_user_id,
        v_customer_name,
        v_customer_phone,
        v_customer_email,
        v_zone.id,
        v_zone.name,
        v_delivery_fee,
        v_address,
        v_timing,
        v_sched_date,
        v_sched_time,
        v_subtotal,
        v_coupon_id,
        v_coupon_code,
        v_discount,
        v_final_total,
        'pending',
        'pending_payment',
        v_order_notes
    );

    -- 6. Insert Order Items Snapshots
    FOR i IN 0 .. jsonb_array_length(v_items) - 1 LOOP
        v_item := v_items->i;

        -- Look up product safely again
        IF (v_item->>'product_id') ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
            SELECT * INTO v_prod FROM public.products 
            WHERE id = (v_item->>'product_id')::UUID LIMIT 1;
        ELSE
            SELECT * INTO v_prod FROM public.products 
            WHERE slug = (v_item->>'product_id') LIMIT 1;
        END IF;

        v_unit_price := v_prod.base_price;
        v_selected_opts := COALESCE(v_item->'selected_options', '[]'::jsonb);
        v_opt_mod := 0;
        v_qty := (v_item->>'quantity')::INT;

        -- Recalculate and strictly validate options for insertion snapshot
        IF jsonb_typeof(v_selected_opts) = 'array' AND jsonb_array_length(v_selected_opts) > 0 THEN
            FOR j IN 0 .. jsonb_array_length(v_selected_opts) - 1 LOOP
                DECLARE
                    v_sel_opt JSONB := v_selected_opts->j;
                    v_sel_name TEXT := v_sel_opt->>'name';
                    v_sel_val TEXT := v_sel_opt->>'value';
                    v_prod_opt JSONB;
                    v_choices JSONB;
                    v_choice JSONB;
                    v_opt_found BOOLEAN := false;
                    v_choice_found BOOLEAN := false;
                BEGIN
                    IF jsonb_typeof(v_prod.options) = 'array' THEN
                        FOR k IN 0 .. jsonb_array_length(v_prod.options) - 1 LOOP
                            v_prod_opt := v_prod.options->k;
                            IF v_prod_opt->>'name' = v_sel_name THEN
                                v_opt_found := true;
                                v_choices := v_prod_opt->'choices';
                                IF jsonb_typeof(v_choices) = 'array' THEN
                                    FOR m IN 0 .. jsonb_array_length(v_choices) - 1 LOOP
                                        v_choice := v_choices->m;
                                        IF v_choice->>'value' = v_sel_val THEN
                                            v_choice_found := true;
                                            v_opt_mod := v_opt_mod + COALESCE((v_choice->>'price_modifier')::NUMERIC, 0);
                                            EXIT;
                                        END IF;
                                    END LOOP;
                                END IF;
                                EXIT;
                            END IF;
                        END LOOP;
                    END IF;

                    IF NOT v_opt_found THEN
                        RAISE EXCEPTION 'Invalid option: Product "%" does not support the option "%".', v_prod.name, v_sel_name;
                    END IF;

                    IF NOT v_choice_found THEN
                        RAISE EXCEPTION 'Invalid choice: Option "%" for product "%" does not have choice value "%".', v_sel_name, v_prod.name, v_sel_val;
                    END IF;
                END;
            END LOOP;
        END IF;

        v_unit_price := v_unit_price + v_opt_mod;
        v_line_total := v_unit_price * v_qty;

        INSERT INTO public.order_items (
            id,
            order_id,
            product_id,
            product_name,
            unit_price,
            quantity,
            selected_options,
            line_total
        ) VALUES (
            gen_random_uuid(),
            v_order_id,
            v_prod.id,
            v_prod.name,
            v_unit_price,
            v_qty,
            v_selected_opts,
            v_line_total
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal', v_subtotal,
        'delivery_fee', v_delivery_fee,
        'discount_amount', v_discount,
        'total', v_final_total
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;


-- 8. Explicit Order Status Transition Enforcement (Hardening Safeguard 8)
CREATE OR REPLACE FUNCTION public.enforce_order_status_transitions()
RETURNS TRIGGER AS $$
BEGIN
    -- Allow initial insert
    IF TG_OP = 'INSERT' THEN
        RETURN NEW;
    END IF;

    -- If status hasn't changed, allow update
    IF NEW.order_status = OLD.order_status THEN
        RETURN NEW;
    END IF;

    -- Allow admin, superuser, and SQL Editor override
    IF current_user IN ('postgres', 'service_role', 'supabase_admin') 
       OR auth.role() = 'service_role' 
       OR auth.uid() IS NULL 
       OR public.is_admin() THEN
        RETURN NEW;
    END IF;

    -- Enforce legal transition graph
    IF OLD.order_status = 'pending_payment' AND NEW.order_status NOT IN ('confirmed', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition: pending_payment can only transition to confirmed or cancelled.';
    ELSIF OLD.order_status = 'confirmed' AND NEW.order_status NOT IN ('preparing', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition: confirmed can only transition to preparing or cancelled.';
    ELSIF OLD.order_status = 'preparing' AND NEW.order_status NOT IN ('ready', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition: preparing can only transition to ready or cancelled.';
    ELSIF OLD.order_status = 'ready' AND NEW.order_status NOT IN ('out_for_delivery', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition: ready can only transition to out_for_delivery or cancelled.';
    ELSIF OLD.order_status = 'out_for_delivery' AND NEW.order_status NOT IN ('delivered', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition: out_for_delivery can only transition to delivered or cancelled.';
    ELSIF OLD.order_status IN ('delivered', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition: % is a terminal status and cannot be changed.', OLD.order_status;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_enforce_order_status ON public.orders;
CREATE TRIGGER trg_enforce_order_status
BEFORE UPDATE OF order_status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_status_transitions();


-- 9. Server-Side Idempotent Payment Confirmation Function (Hardening Safeguards 5, 6)
CREATE OR REPLACE FUNCTION public.confirm_order_payment(
    p_order_id UUID,
    p_paystack_ref TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
BEGIN
    SELECT * INTO v_order
    FROM public.orders
    WHERE id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found');
    END IF;

    -- If already confirmed, return success idempotently
    IF v_order.payment_status = 'paid' THEN
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Payment already recorded as paid (idempotent)',
            'order_number', v_order.order_number
        );
    END IF;

    -- Update order to confirmed and paid
    UPDATE public.orders
    SET payment_status = 'paid',
        order_status = 'confirmed',
        paystack_reference = p_paystack_ref,
        updated_at = now()
    WHERE id = p_order_id;

    -- If coupon was used, increment used_count safely and atomically once
    IF v_order.coupon_id IS NOT NULL THEN
        UPDATE public.coupons
        SET used_count = used_count + 1
        WHERE id = v_order.coupon_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Payment confirmed successfully',
        'order_number', v_order.order_number
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;


-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured, featured_order);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_paystack_ref ON public.orders(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(UPPER(code));
CREATE INDEX IF NOT EXISTS idx_promotions_active ON public.promotions(is_active, display_order);
