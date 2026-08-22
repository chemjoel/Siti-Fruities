-- =============================================================================
-- SQL 5 — Complete Seed Data (Run Fifth)
-- SITI FRUITIES — Phase 3B Database Implementation
-- =============================================================================

-- 1. Seed Categories
INSERT INTO public.categories (slug, name, description, image_url, display_order)
VALUES
    ('greek-yogurt-parfaits', 'Greek Yogurt & Parfaits', 'Our signature probiotic Greek yogurt and fruit-loaded exotic parfaits.', '/assets/IMG_8455_parfait_bowls.jpg', 1),
    ('smoothies', 'Smoothies', 'Rich, thick and 100% natural fruit blends.', '/assets/Screenshot_20260729-212748_1785360049844.jpg', 2),
    ('sandwiches-savoury', 'Sandwiches & Savoury', 'Fresh toasted sandwiches and mouth-watering cheesesteaks.', '/assets/IMG_1940_sandwich.jpg', 3),
    ('milk-tea-drinks', 'Milk Tea & Drinks', 'Boba bubble teas, zobo infusions, and creamy tigernut drinks.', '/assets/IMG_2326_bubble_tea.jpg', 4),
    ('cold-pressed-juices', 'Cold-Pressed Juices', 'Raw, unpasteurised 100% natural cold-pressed fruit juices.', '/assets/Screenshot_20260729-212547_1785360049844.jpg', 5),
    ('fruits', 'Fresh Fruit Bowls & Salads', 'Crisp fresh handpicked fruits and tossed chicken salads.', '/assets/Screenshot_20260729-212635_1785360049844.jpg', 6),
    ('treat-boxes', 'Treat Boxes', 'Carefully curated gift boxes packed with parfaits, juices & snacks.', '/assets/Screenshot_20260729-212815_1785360049844.jpg', 7),
    ('combos', 'Combos', 'Value-packed meal pairings of sandwiches, cheesesteaks and drinks.', '/assets/IMG_1940_sandwich.jpg', 8),
    ('fruit-hampers', 'Fruit Hampers', 'Luxury celebratory gift hampers for birthdays, events and holidays.', '/assets/Screenshot_20260729-213638_1785360049844.jpg', 9),
    ('catering-events', 'Catering & Events', 'Bespoke high-volume catering packages for weddings, meetings & high tea.', '/assets/Screenshot_20260729-212242_1785360049881.jpg', 10)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order;


-- 2. Seed Delivery Zones
INSERT INTO public.delivery_zones (name, delivery_fee, display_order)
VALUES
    ('OAU Campus (Hostels & Staff Quarters)', 1000, 1),
    ('Mayfair / Ibadan Road', 1200, 2),
    ('Lagere / Commercial Area', 1500, 3),
    ('Ede Road / Parakin', 1800, 4),
    ('Modakeke Area', 2000, 5),
    ('Store Pickup (Ile-Ife Store)', 0, 6)
ON CONFLICT DO NOTHING;


-- 3. Seed Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, is_active, minimum_order_amount, usage_limit)
VALUES
    ('SITI10', 'percentage', 10, true, 5000, 500),
    ('WELCOME500', 'fixed_amount', 500, true, 3000, 1000),
    ('VIPFRESH', 'percentage', 15, true, 10000, 200)
ON CONFLICT (code) DO NOTHING;


-- 4. Seed Promotions
INSERT INTO public.promotions (title, description, flyer_url, cta_label, cta_link, is_active, display_order)
VALUES
    (
        'Fresh Parfait Day Special',
        'Experience our award-winning VVIP & VIP Exotic Parfaits made with fresh probiotic Greek yogurt, crisp fruit layers & crunchy nut toppings.',
        '/assets/IMG_8455_parfait_bowls.jpg',
        'Order Signature Parfait',
        '/greek-yogurt-parfaits',
        true,
        1
    )
ON CONFLICT DO NOTHING;


-- 5. Seed Core Products
DO $$
DECLARE
    v_parfait_cat UUID;
    v_smoothie_cat UUID;
    v_sandwich_cat UUID;
    v_milktea_cat UUID;
    v_juice_cat UUID;
    v_fruit_cat UUID;
    v_treatbox_cat UUID;
    v_combo_cat UUID;
    v_hamper_cat UUID;
    v_catering_cat UUID;
BEGIN
    SELECT id INTO v_parfait_cat FROM public.categories WHERE slug = 'greek-yogurt-parfaits';
    SELECT id INTO v_smoothie_cat FROM public.categories WHERE slug = 'smoothies';
    SELECT id INTO v_sandwich_cat FROM public.categories WHERE slug = 'sandwiches-savoury';
    SELECT id INTO v_milktea_cat FROM public.categories WHERE slug = 'milk-tea-drinks';
    SELECT id INTO v_juice_cat FROM public.categories WHERE slug = 'cold-pressed-juices';
    SELECT id INTO v_fruit_cat FROM public.categories WHERE slug = 'fruits';
    SELECT id INTO v_treatbox_cat FROM public.categories WHERE slug = 'treat-boxes';
    SELECT id INTO v_combo_cat FROM public.categories WHERE slug = 'combos';
    SELECT id INTO v_hamper_cat FROM public.categories WHERE slug = 'fruit-hampers';
    SELECT id INTO v_catering_cat FROM public.categories WHERE slug = 'catering-events';

    -- A. Parfaits & Yogurt (Priority Featured Products 1 & 2)
    INSERT INTO public.products (category_id, name, slug, description, ingredients, base_price, image_url, product_type, is_available, is_featured, featured_order, display_order, options)
    VALUES
    (
        v_parfait_cat,
        'VVIP Exotic Parfait',
        'vvip-exotic-parfait',
        'Our luxurious signature creation layered with fresh Greek yogurt, rich fruits, cashew nuts, and crunchy granola.',
        'Greek Yogurt, Apple, Coconut, Grapes, Strawberries, Kiwi, Granola with rolled oats, Raisins, Cashew nuts',
        8500,
        '/assets/IMG_8455_parfait_bowls.jpg',
        'standard',
        true,
        true,
        1,
        1,
        '[
            {"name": "Yogurt Type", "choices": [{"value": "Sweetened"}, {"value": "Unsweetened"}]},
            {"name": "Size", "choices": [
                {"value": "Mini (330ml)", "price_modifier": -2500},
                {"value": "Medium (500ml)"},
                {"value": "Gbemidele (550ml)", "price_modifier": 1500},
                {"value": "Ay Bowl (1L)", "price_modifier": 6500},
                {"value": "Wonder Bowl (2L)", "price_modifier": 20500},
                {"value": "Twa Bowl (5L)", "price_modifier": 56500}
            ]}
        ]'::jsonb
    ),
    (
        v_parfait_cat,
        'VIP Exotic Parfait',
        'vip-exotic-parfait',
        'The beloved classic parfait with sweet apples, coconut, crunchy cashew nuts, and probiotic yogurt.',
        'Greek Yogurt, Apple, Coconut, Grapes, Granola with rolled oats, Raisins, Cashew nuts',
        8000,
        '/assets/IMG_6519_parfait_500ml.jpg',
        'standard',
        true,
        true,
        2,
        2,
        '[
            {"name": "Yogurt Type", "choices": [{"value": "Sweetened"}, {"value": "Unsweetened"}]},
            {"name": "Size", "choices": [
                {"value": "Mini (330ml)", "price_modifier": -3000},
                {"value": "Medium (500ml)"},
                {"value": "Gbemidele (550ml)", "price_modifier": 1000},
                {"value": "Ay Bowl (1L)", "price_modifier": 5500}
            ]}
        ]'::jsonb
    ),
    (
        v_parfait_cat,
        'Greek Yogurt',
        'greek-yogurt',
        '100% thick, creamy probiotic Greek yogurt. Rich in active cultures and pure wholesome goodness.',
        'Probiotic Greek Yogurt',
        6500,
        '/assets/Screenshot_20260729-212331_1785360049844.jpg',
        'standard',
        true,
        true,
        3,
        3,
        '[
            {"name": "Yogurt Type", "choices": [{"value": "Sweetened"}, {"value": "Unsweetened"}]},
            {"name": "Size", "choices": [
                {"value": "330ml", "price_modifier": -2000},
                {"value": "500ml"},
                {"value": "1L", "price_modifier": 5500},
                {"value": "2L", "price_modifier": 17000},
                {"value": "5L", "price_modifier": 49500}
            ]}
        ]'::jsonb
    ),
    (
        v_parfait_cat,
        'Custom Exotic Parfait',
        'custom-exotic-parfait',
        'Build your dream parfait bowl! Choose your yogurt style, favorite fruits, and crunch toppings.',
        'Custom selections',
        0,
        '/assets/IMG_8435_parfait_group.jpg',
        'quote-only',
        true,
        false,
        null,
        4,
        '[]'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        ingredients = EXCLUDED.ingredients,
        base_price = EXCLUDED.base_price,
        image_url = EXCLUDED.image_url,
        is_featured = EXCLUDED.is_featured,
        featured_order = EXCLUDED.featured_order,
        options = EXCLUDED.options;

    -- B. Sandwiches
    INSERT INTO public.products (category_id, name, slug, description, ingredients, base_price, image_url, product_type, is_available, is_featured, featured_order, display_order, options)
    VALUES
    (
        v_sandwich_cat,
        'Chicken Sandwich',
        'chicken-sandwich',
        '3 toasted slices of bread, crunchy cabbage, shredded carrot, in-house cream and seasoned shredded chicken.',
        'Bread, Chicken, Cabbage, Carrot, In-house Cream',
        3000,
        '/assets/IMG_1940_sandwich.jpg',
        'standard',
        true,
        true,
        4,
        1,
        '[]'::jsonb
    ),
    (
        v_sandwich_cat,
        'Beef Sandwich',
        'beef-sandwich',
        '3 toasted slices of bread, shredded carrot, fresh cabbage, savoury beef strips and in-house sauce.',
        'Bread, Beef, Cabbage, Carrot, In-house Cream',
        3000,
        '/assets/IMG_1940_sandwich.jpg',
        'standard',
        true,
        false,
        null,
        2,
        '[]'::jsonb
    ),
    (
        v_sandwich_cat,
        'Chicken & Egg Sandwich',
        'chicken-egg-sandwich',
        '3 toasted slices packed with shredded chicken, boiled or fried egg, cabbage, carrot, and dressing.',
        'Bread, Chicken, Egg, Cabbage, Carrot, In-house Cream',
        5000,
        '/assets/IMG_1940_sandwich.jpg',
        'standard',
        true,
        false,
        null,
        3,
        '[
            {"name": "Egg Preparation", "choices": [{"value": "Fried"}, {"value": "Boiled"}]}
        ]'::jsonb
    ),
    (
        v_sandwich_cat,
        'Cheesesteak',
        'cheesesteak',
        'A loaf of bread loaded with mozzarella cheese, stir-fried beef and bell peppers topped with our special bread sauce.',
        'Bread Loaf, Mozzarella Cheese, Beef, Bell Peppers, Bread Sauce',
        9000,
        '/assets/IMG_1940_sandwich.jpg',
        'standard',
        true,
        false,
        null,
        4,
        '[
            {"name": "Size", "choices": [{"value": "Medium"}, {"value": "Large", "price_modifier": 4000}]}
        ]'::jsonb
    ),
    (
        v_sandwich_cat,
        'Whole Wheat Banana Bread',
        'whole-wheat-banana-bread',
        'Freshly baked moist, wholesome whole wheat banana bread packed with your choice of rich add-ins.',
        'Whole Wheat Flour, Ripe Banana, Butter, Brown Sugar, Eggs',
        4500,
        '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
        'standard',
        true,
        true,
        5,
        5,
        '[
            {"name": "Add-in", "choices": [{"value": "Chocolate"}, {"value": "Raisins"}, {"value": "Coconut"}]}
        ]'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        base_price = EXCLUDED.base_price,
        image_url = EXCLUDED.image_url,
        is_featured = EXCLUDED.is_featured,
        featured_order = EXCLUDED.featured_order,
        options = EXCLUDED.options;

    -- C. Smoothies
    INSERT INTO public.products (category_id, name, slug, description, base_price, image_url, product_type, is_available, display_order, options)
    VALUES
    (
        v_smoothie_cat,
        'Milk Mix Smoothie',
        'milk-mix',
        'Banana, evaporated milk and your choice of sweet watermelon or zesty pineapple.',
        2000,
        '/assets/Screenshot_20260729-212748_1785360049844.jpg',
        'standard',
        true,
        1,
        '[
            {"name": "Size", "choices": [{"value": "25cl"}, {"value": "50cl", "price_modifier": 2000}]},
            {"name": "Fruit Choice", "choices": [{"value": "Watermelon"}, {"value": "Pineapple"}]}
        ]'::jsonb
    ),
    (
        v_smoothie_cat,
        'Yoghurt Mix Smoothie',
        'yoghurt-mix',
        'Banana, sweetened Greek yoghurt and ripe tropical pineapple.',
        2000,
        '/assets/Screenshot_20260729-212748_1785360049844.jpg',
        'standard',
        true,
        2,
        '[
            {"name": "Size", "choices": [{"value": "25cl"}, {"value": "50cl", "price_modifier": 2000}]}
        ]'::jsonb
    ),
    (
        v_smoothie_cat,
        'Nutty Chocolate Smoothie',
        'nutty-chocolate',
        'Banana, peanut butter, Greek yoghurt, watermelon and dark chocolate chips.',
        2300,
        '/assets/Screenshot_20260729-212748_1785360049844.jpg',
        'standard',
        true,
        3,
        '[
            {"name": "Size", "choices": [{"value": "25cl"}, {"value": "50cl", "price_modifier": 2200}]}
        ]'::jsonb
    ),
    (
        v_smoothie_cat,
        'So Creamy Smoothie',
        'so-creamy',
        'Dates, peanut butter, Greek yoghurt, banana, cinnamon and watermelon.',
        2500,
        '/assets/Screenshot_20260729-212748_1785360049844.jpg',
        'standard',
        true,
        4,
        '[
            {"name": "Size", "choices": [{"value": "25cl"}, {"value": "50cl", "price_modifier": 2000}]}
        ]'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        base_price = EXCLUDED.base_price,
        options = EXCLUDED.options;

    -- D. Bubble Milk Teas & Drinks
    INSERT INTO public.products (category_id, name, slug, description, base_price, image_url, product_type, is_available, display_order, options)
    VALUES
    (
        v_milktea_cat,
        'Matcha Milk Tea',
        'matcha-milk-tea',
        'Premium Matcha Flavor with chewy brown sugar Tapioca Pearls.',
        8500,
        '/assets/IMG_2326_bubble_tea.jpg',
        'standard',
        true,
        1,
        '[]'::jsonb
    ),
    (
        v_milktea_cat,
        'Taro Milk Tea',
        'taro-milk-tea',
        'Creamy Taro Flavored Milk Tea with chewy Tapioca Pearls.',
        8000,
        '/assets/IMG_2326_bubble_tea.jpg',
        'standard',
        true,
        2,
        '[]'::jsonb
    ),
    (
        v_milktea_cat,
        'Classic Milk Tea',
        'classic-milk-tea',
        'Our signature original milk tea recipe with chewy Tapioca Pearls.',
        7000,
        '/assets/IMG_2364_bubble_tea_duo.jpg',
        'standard',
        true,
        3,
        '[]'::jsonb
    ),
    (
        v_milktea_cat,
        'Hibiscus Drink (Zobo)',
        'hibiscus-drink-zobo',
        'Traditional refreshing hibiscus flower brew infused with cloves, pineapple & ginger.',
        1000,
        '/assets/IMG_5834_zobo.jpg',
        'standard',
        true,
        4,
        '[
            {"name": "Size", "choices": [{"value": "25cl"}, {"value": "50cl", "price_modifier": 1000}]}
        ]'::jsonb
    ),
    (
        v_milktea_cat,
        'Tigernut Drink',
        'tigernut-drink',
        'Creamy dairy-free tiger nut blend infused with dates and ginger.',
        1200,
        '/assets/Screenshot_20260729-212748_1785360049844.jpg',
        'standard',
        true,
        5,
        '[
            {"name": "Size", "choices": [{"value": "25cl"}, {"value": "50cl", "price_modifier": 1300}]}
        ]'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        base_price = EXCLUDED.base_price,
        image_url = EXCLUDED.image_url,
        options = EXCLUDED.options;

    -- E. Treat Boxes & Catering
    INSERT INTO public.products (category_id, name, slug, description, base_price, image_url, product_type, is_available, is_featured, featured_order, display_order, options)
    VALUES
    (
        v_treatbox_cat,
        'Juicy Treatbox',
        'juicy-treatbox',
        'A luscious collection featuring our signature ginger-pineapple juice, fresh parfait, tigernut milk, banana bread, and sandwich pack.',
        23500,
        '/assets/Screenshot_20260729-212815_1785360049844.jpg',
        'bundle',
        true,
        true,
        6,
        1,
        '[]'::jsonb
    ),
    (
        v_treatbox_cat,
        'Mini Treatbox',
        'mini-treatbox',
        'A delightful personal selection featuring exotic parfait, a sandwich, and cold zobo drink.',
        14000,
        '/assets/Screenshot_20260729-212815_1785360049844.jpg',
        'bundle',
        true,
        false,
        null,
        2,
        '[]'::jsonb
    ),
    (
        v_catering_cat,
        'Smallie Parfait (Min 2 Cups)',
        'smallie-parfait',
        'Perfect 330ml cup size for high-tea, office brunches, and birthday celebrations.',
        4000,
        '/assets/Screenshot_20260729-212242_1785360049881.jpg',
        'standard',
        true,
        false,
        null,
        1,
        '[]'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        base_price = EXCLUDED.base_price,
        image_url = EXCLUDED.image_url,
        is_featured = EXCLUDED.is_featured,
        featured_order = EXCLUDED.featured_order;

END $$;
