-- =============================================================================
-- SQL 7 — Additive hardcoded catalogue sync (Phase 1; review before execution)
-- =============================================================================
--
-- This file was generated from the checked-in storefront and SQL definitions.
-- It has NOT been executed and no live database was inspected. Existing rows
-- with the same slug are intentionally preserved, including admin edits.
--
-- Compatibility checks:
--   * categories.slug and products.slug are UNIQUE NOT NULL; therefore
--     ON CONFLICT (slug) DO NOTHING is supported by 1_extensions_tables.sql.
--   * Both tables generate UUID ids by default. Cart productIds below are
--     non-UUID slug strings; create_authoritative_order looks those up by exact 
--     products.slug, so keeping these slug values preserves the cart identity.
--   * Product options use [{name, choices:[{value, price_modifier?}]}].
--     The RPC matches option names and choice values exactly. Omitted modifiers
--     are treated as zero by the RPC and are supported by ProductOptionsBuilder.
--   * Products/categories are joined by category slug; a missing category
--     prevents the dependent product insert rather than creating a null link.
--
-- This is intentionally incomplete. See the omission notes after the inserts:
-- some source products have competing prices/categories, source prices cannot
-- be represented without deriving modifiers, or conflict with seeded options.

BEGIN;

-- Category records use the exact hardcoded home-card labels, descriptions,
-- images, and sequence from CategorySection.CATEGORIES. The fallback
-- DEFAULT_CATEGORIES marks all categories active; existing records are never
-- changed by this insert.
INSERT INTO public.categories
    (slug, name, description, image_url, display_order, is_active)
VALUES
    ('fruits', 'Fresh Fruits & Healthy Snacks',
     'Fresh seasonal fruit salad bowls, healthy chicken salad, and clean snacks.',
     '/assets/Screenshot_20260729-212635_1785360049633.jpg', 1, true),
    ('greek-yogurt-parfaits', 'Greek Yogurt & Parfaits',
     'Our signature layered Exotic Parfaits and 100% probiotic Greek Yogurt.',
     '/assets/IMG_8435_parfait_multi.jpg', 2, true),
    ('smoothies', 'Smoothies',
     'Rich, thick, and nutrient-dense smoothies made from fresh fruits and nuts.',
     '/assets/Screenshot_20260729-212748_1785360013740.jpg', 3, true),
    ('cold-pressed-juices', 'Cold-Pressed Juices',
     '100% raw, refreshing fruit juices cold-pressed with zero added sugar.',
     '/assets/Screenshot_20260729-212547_1785360049692.jpg', 4, true),
    ('sandwiches-savoury', 'Sandwiches & Savoury',
     'Freshly made Chicken, Beef, and Egg sandwiches with signature cream.',
     '/assets/IMG_1940_sandwich.jpg', 5, true),
    ('milk-tea-drinks', 'Milk Tea & Drinks',
     'Freshly brewed Milk Tea with chewy boba pearls, Zobo, and Tigernut drink.',
     '/assets/IMG_2364_bubble_tea_duo.jpg', 6, true),
    ('treat-boxes', 'Treat Boxes',
     'Curated combination packages featuring salad, yogurt, parfait, and bread.',
     '/assets/Screenshot_20260729-212815_1785360013704.jpg', 7, true),
    ('fruit-hampers', 'Fruit Hampers',
     'Beautifully arranged deluxe and exotic fresh fruit gift hampers.',
     '/assets/Screenshot_20260729-213638_1785360173839.jpg', 8, true),
    ('combos', 'Combos',
     'Specially paired healthy meal combinations at discounted prices.',
     NULL, 9, true),
    ('catering-events', 'Catering & Events',
     'Indoor, outdoor, and bulk food supply services customized for your events.',
     NULL, 10, true)
ON CONFLICT (slug) DO NOTHING;

-- Existing product rows, including same-slug seed records, remain untouched.
-- category_id is obtained only by matching the category slug.
INSERT INTO public.products
    (category_id, name, slug, description, ingredients, base_price,
     image_url, product_type, is_available, is_featured, featured_order,
     display_order, options)
SELECT
    c.id,
    p.name,
    p.slug,
    p.description,
    p.ingredients,
    p.base_price,
    p.image_url,
    p.product_type,
    true,
    false,
    NULL,
    p.display_order,
    p.options::jsonb
FROM (
    VALUES
    -- Greek Yogurt & Parfaits. These three definitions and price modifiers
    -- match the existing SQL seed and the dedicated parfait-page choices.
    ('greek-yogurt-parfaits', 'VVIP Exotic Parfait', 'vvip-exotic-parfait',
     'Our luxurious signature creation layered with fresh Greek yogurt, rich fruits, cashew nuts, and crunchy granola.',
     'Greek Yogurt, Apple, Coconut, Grapes, Strawberries, Kiwi, Granola with rolled oats, Raisins, Cashew nuts',
     8500::numeric, '/assets/IMG_8455_parfait_bowls.jpg', 'standard', 1,
     '[{"name":"Yogurt Type","choices":[{"value":"Sweetened"},{"value":"Unsweetened"}]},{"name":"Size","choices":[{"value":"Mini (330ml)","price_modifier":-2500},{"value":"Medium (500ml)"},{"value":"Gbemidele (550ml)","price_modifier":1500},{"value":"Ay Bowl (1L)","price_modifier":6500},{"value":"Wonder Bowl (2L)","price_modifier":20500},{"value":"Twa Bowl (5L)","price_modifier":56500}]}]'),
    ('greek-yogurt-parfaits', 'VIP Exotic Parfait', 'vip-exotic-parfait',
     'The beloved classic parfait with sweet apples, coconut, crunchy cashew nuts, and probiotic yogurt.',
     'Greek Yogurt, Apple, Coconut, Grapes, Granola with rolled oats, Raisins, Cashew nuts',
     8000::numeric, '/assets/IMG_6519_parfait_500ml.jpg', 'standard', 2,
     '[{"name":"Yogurt Type","choices":[{"value":"Sweetened"},{"value":"Unsweetened"}]},{"name":"Size","choices":[{"value":"Mini (330ml)","price_modifier":-3000},{"value":"Medium (500ml)"},{"value":"Gbemidele (550ml)","price_modifier":1000},{"value":"Ay Bowl (1L)","price_modifier":5500}]}]'),
    ('greek-yogurt-parfaits', 'Greek Yogurt', 'greek-yogurt',
     '100% thick, creamy probiotic Greek yogurt. Rich in active cultures and pure wholesome goodness.',
     'Probiotic Greek Yogurt',
     6500::numeric, '/assets/Screenshot_20260729-212331_1785360049844.jpg', 'standard', 3,
     '[{"name":"Yogurt Type","choices":[{"value":"Sweetened"},{"value":"Unsweetened"}]},{"name":"Size","choices":[{"value":"330ml","price_modifier":-2000},{"value":"500ml"},{"value":"1L","price_modifier":5500},{"value":"2L","price_modifier":17000},{"value":"5L","price_modifier":49500}]}]'),

    -- Sandwiches & Savoury. The choices below are the exact direct-page
    -- productIds, names, descriptions, prices, images, and option strings.
    ('sandwiches-savoury', 'Chicken Sandwich', 'chicken-sandwich',
     '3 sliced breads, cabbage, carrot, in-house cream and chicken.',
     NULL, 3000::numeric, '/assets/IMG_1940_sandwich.jpg', 'standard', 1, '[]'),
    ('sandwiches-savoury', 'Beef Sandwich', 'beef-sandwich',
     '3 sliced breads, cabbage, carrot, in-house cream and beef.',
     NULL, 3000::numeric, '/assets/IMG_1940_sandwich.jpg', 'standard', 2, '[]'),
    ('sandwiches-savoury', 'Chicken & Egg Sandwich', 'chicken-egg-sandwich',
     '3 sliced breads, cabbage, carrot, in-house cream, chicken and egg.',
     NULL, 5000::numeric, '/assets/IMG_1940_sandwich.jpg', 'standard', 3,
     '[{"name":"Egg Preparation","choices":[{"value":"Fried"},{"value":"Boiled"}]}]'),

    -- Smoothies. These base prices and price modifiers are explicit in
    -- SmoothiesPage.SMOOTHIE_PRODUCTS and are compatible with the RPC model.
    ('smoothies', 'Milk Mix', 'milk-mix',
     'Banana, evaporated milk and your choice of watermelon or pineapple.',
     NULL, 2000::numeric, NULL, 'standard', 1,
     '[{"name":"Size","choices":[{"value":"25cl"},{"value":"50cl","price_modifier":2000}]},{"name":"Fruit Choice","choices":[{"value":"Watermelon"},{"value":"Pineapple"}]}]'),
    ('smoothies', 'Yoghurt Mix', 'yoghurt-mix',
     'Banana, sweetened yoghurt and pineapple.',
     NULL, 2000::numeric, NULL, 'standard', 2,
     '[{"name":"Size","choices":[{"value":"25cl"},{"value":"50cl","price_modifier":2000}]}]'),
    ('smoothies', 'Nutty Chocolate', 'nutty-chocolate',
     'Banana, peanut butter, Greek yoghurt, watermelon and chocolate chips.',
     NULL, 2300::numeric, NULL, 'standard', 3,
     '[{"name":"Size","choices":[{"value":"25cl"},{"value":"50cl","price_modifier":2200}]}]'),
    ('smoothies', 'Ginger Blast', 'ginger-blast',
     'A delicious blend of banana, fresh ginger and pineapple.',
     NULL, 1800::numeric, NULL, 'standard', 4,
     '[{"name":"Size","choices":[{"value":"25cl"},{"value":"50cl","price_modifier":1700}]}]'),
    ('smoothies', 'Strawberry', 'strawberry-smoothie',
     'Fresh strawberries, grapes, apple, banana and your choice of watermelon or pineapple.',
     NULL, 2500::numeric, NULL, 'standard', 5,
     '[{"name":"Size","choices":[{"value":"25cl"},{"value":"50cl","price_modifier":2500}]},{"name":"Fruit Choice","choices":[{"value":"Watermelon"},{"value":"Pineapple"}]}]'),
    ('smoothies', 'Fruity', 'fruity-smoothie',
     'Apple, grapes, pineapple, watermelon and banana.',
     NULL, 1800::numeric, NULL, 'standard', 6,
     '[{"name":"Size","choices":[{"value":"25cl"},{"value":"50cl","price_modifier":1700}]}]'),
    ('smoothies', 'Healthy Green', 'healthy-green',
     'Banana, apple, pumpkin leaf, lemon juice and pineapple.',
     NULL, 2000::numeric, NULL, 'standard', 7,
     '[{"name":"Size","choices":[{"value":"25cl"},{"value":"50cl","price_modifier":2000}]}]'),

    -- Cold-Pressed Juices. PING is deliberately excluded because the
    -- CategoryPlaceholder source gives it a conflicting displayed price.
    ('cold-pressed-juices', 'SWEET GREEN', 'sweet-green',
     'Apple, orange, cucumber and lemon.',
     NULL, 4500::numeric, '/assets/Screenshot_20260729-212547_1785360049692.jpg',
     'standard', 1, '[{"name":"Size","choices":[{"value":"35cl"}]}]'),
    ('cold-pressed-juices', 'BEET THE HEAT', 'beet-the-heat',
     'Beetroot, carrot, watermelon and lemon.',
     NULL, 5000::numeric, '/assets/Screenshot_20260729-212547_1785360049692.jpg',
     'standard', 2, '[{"name":"Size","choices":[{"value":"35cl"}]}]'),

    -- Milk Tea & Drinks. The exact page price and cart-option structure is
    -- kept; no unprovided choices/modifiers are added.
    ('milk-tea-drinks', 'MATCHA MILK TEA', 'matcha-milk-tea',
     'Premium Matcha Flavor with Chewy Tapioca Pearls',
     NULL, 8500::numeric, '/assets/IMG_2326_bubble_tea.jpg', 'standard', 1, '[]'),
    ('milk-tea-drinks', 'TARO MILK TEA', 'taro-milk-tea',
     'Creamy Taro Flavored Tea, with chewy Tapioca Pearls',
     NULL, 8000::numeric, '/assets/IMG_2326_bubble_tea.jpg', 'standard', 2, '[]'),
    ('milk-tea-drinks', 'STRAWBERRY MILK TEA', 'strawberry-milk-tea',
     'Sweet Strawberry Delight Tea, with chewy Tapioca Pearls',
     NULL, 8500::numeric, '/assets/IMG_2364_bubble_tea_duo.jpg', 'standard', 3, '[]'),
    ('milk-tea-drinks', 'CHOCOLATE MILK TEA', 'chocolate-milk-tea',
     'Rich Chocolate Flavored Bubble Tea with chewy Tapioca Pearls',
     NULL, 8500::numeric, '/assets/IMG_2326_bubble_tea.jpg', 'standard', 4, '[]'),
    ('milk-tea-drinks', 'VANILLA MILK TEA', 'vanilla-milk-tea',
     'Smooth and Rich Vanilla Flavor with chewy Tapioca Pearls',
     NULL, 8000::numeric, '/assets/IMG_2326_bubble_tea.jpg', 'standard', 5, '[]'),
    ('milk-tea-drinks', 'CLASSIC MILK TEA', 'classic-milk-tea',
     'Our Signature Original Milk Tea with Chewy Tapioca Pearls',
     NULL, 7000::numeric, '/assets/IMG_2364_bubble_tea_duo.jpg', 'standard', 6, '[]'),
    ('milk-tea-drinks', 'Hibiscus Drink (Zobo)', 'hibiscus-drink-zobo',
     'Traditional refreshing hibiscus flower tea.',
     NULL, 1000::numeric, NULL, 'standard', 7,
     '[{"name":"Size","choices":[{"value":"25cl"},{"value":"50cl","price_modifier":1000}]}]'),

    -- Fresh Fruits & Healthy Snacks. Healthy Chicken Salad is excluded below
    -- because another hardcoded page uses the same slug with a different
    -- category and price.
    ('fruits', 'Exotic Fruit Salad Bowl', 'exotic-fruit-salad',
     'A beautifully arranged selection of handpicked fresh seasonal fruits (watermelon, pineapple, apples, grapes, oranges).',
     NULL, 3500::numeric, NULL, 'standard', 1,
     '[{"name":"Bowl Size","choices":[{"value":"Medium Bowl"},{"value":"Gbemidele Size","price_modifier":2000}]}]'),
    ('fruits', 'Fresh Fruit & Yogurt Combo', 'fruit-yogurt-combo',
     'Our freshly pressed yogurt served with selected fruit toppings. A perfect healthy midday pick-me-up.',
     NULL, 5000::numeric, NULL, 'standard', 2,
     '[{"name":"Yogurt Type","choices":[{"value":"Sweetened Greek Yogurt"},{"value":"Unsweetened Greek Yogurt"}]}]'),
    ('fruits', 'Crunchy Granola Snack Pack (100g)', 'crunchy-granola-snack',
     'Premium crunchy baked granola loaded with coconut flakes, raisins, and roasted cashew nuts.',
     NULL, 3500::numeric, NULL, 'standard', 3, '[]'),
    ('fruits', 'Custom Fruit Cup', 'custom-fruit-cup',
     'Customize your bowl with your choice of sweetened/unsweetened yogurt base and custom fresh sliced fruits.',
     NULL, 3000::numeric, NULL, 'standard', 4,
     '[{"name":"Serving Size","choices":[{"value":"Regular Cup"},{"value":"Deluxe Bowl","price_modifier":1500}]}]'),

    -- Treat Boxes. Contents remain display descriptions, not child order lines.
    ('treat-boxes', 'Juicy Treatbox', 'juicy-treatbox',
     'A luscious collection featuring our signature ginger-pineapple juice, fresh parfait, nourishing tigernut milk, banana bread, and a delicious sandwich.',
     NULL, 23500::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 1, '[]'),
    ('treat-boxes', 'Mini Treatbox', 'mini-treatbox',
     'A delightful personal selection featuring exotic parfait, a sandwich, and refreshing zobo drink.',
     NULL, 14000::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 2, '[]'),
    ('treat-boxes', 'Maxi Treatbox', 'maxi-treatbox',
     'A generous feast box featuring a rich variety of premium parfaits, yogurts, salad, drinks, and healthy granola.',
     NULL, 35000::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 3, '[]'),
    ('treat-boxes', 'Deluxe Treatbox', 'deluxe-treatbox',
     'Our ultimate wellness bundle packed with nutrient-rich meals, drinks, and healthy toppings perfect for gifting.',
     NULL, 40000::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 4, '[]'),
    ('treat-boxes', 'Intentional Treatbox', 'intentional-treatbox',
     'Thoughtfully combined to feed your body with organic goodness, containing yogurt parfait, bread, juice, and more.',
     NULL, 29500::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 5, '[]'),
    ('treat-boxes', 'Mini Treatbox 2', 'mini-treatbox-2',
     'A satisfying and energizing combination of parfait, traditional hibiscus flower tea, sandwich, and crunchy toppings.',
     NULL, 14500::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 6, '[]'),
    ('treat-boxes', 'Mini Treatbox 3', 'mini-treatbox-3',
     'A wholesome breakfast or high tea box featuring banana breads, fresh juice, and creamy yogurt parfait.',
     NULL, 17500::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 7,
     '[{"name":"Cold-Pressed Juice","choices":[{"value":"PING"},{"value":"SWEET GREEN"},{"value":"BEET THE HEAT"}]}]'),
    ('treat-boxes', 'Juicy Treatbox 2', 'juicy-treatbox-2',
     'A gorgeous pairing curated for sharing, containing juices, fresh parfait, banana bread, and your choice of sandwich.',
     NULL, 23500::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 8,
     '[{"name":"Sandwich","choices":[{"value":"Chicken Sandwich"},{"value":"Beef Sandwich"}]}]'),
    ('treat-boxes', 'Perfecto Treatbox', 'perfecto-treatbox',
     'The complete gourmet package featuring banana bread, chicken sandwich, zobo, PING juice, and a lovely note card.',
     NULL, 24000::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 9, '[]'),
    ('treat-boxes', 'Treat Box A', 'treat-box-a',
     'Curated gift & feast boxes combining your favourite SITI treats in one pack.',
     NULL, 15500::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 10, '[{"name":"Package","choices":[{"value":"A"}]}]'),
    ('treat-boxes', 'Treat Box B', 'treat-box-b',
     'Curated gift & feast boxes combining your favourite SITI treats in one pack.',
     NULL, 13000::numeric, '/assets/Screenshot_20260729-212815_1785360013704.jpg',
     'bundle', 11, '[{"name":"Package","choices":[{"value":"B"}]}]'),

    -- Fruit Hampers; page card image/price/description and bundle type.
    ('fruit-hampers', 'Deluxe Hamper', 'deluxe-hamper',
     'A premium gift hamper combining fresh fruits, Greek yoghurt, crunchy granola, nuts, treats and thoughtful finishing touches.',
     NULL, 70000::numeric, '/assets/Screenshot_20260729-213638_1785360173839.jpg',
     'bundle', 1, '[]'),
    ('fruit-hampers', 'Exotic Fruit Hamper', 'exotic-fruit-hamper',
     'A colourful fruit-focused hamper filled with carefully selected fruits and presented as a thoughtful gift.',
     NULL, 55000::numeric, '/assets/Screenshot_20260729-213638_1785360173839.jpg',
     'bundle', 2, '[]'),

    -- Combos. These choices are labels already sent by the UI. The RPC can
    -- validate them as ordinary string choices; selections do not become
    -- separate product lines and no price modifiers are asserted.
    ('combos', 'Cheesesteak + Smoothie', 'cheesesteak-smoothie',
     'Cheesesteak paired with a 50cl smoothie of your choice.',
     NULL, 16000::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 1,
     '[{"name":"Smoothie","choices":[{"value":"Milk Mix"},{"value":"Yoghurt Mix"},{"value":"Nutty Chocolate"},{"value":"So Creamy"},{"value":"Ginger Blast"},{"value":"Strawberry"},{"value":"Fruity"},{"value":"Healthy Green"}]}]'),
    ('combos', 'Cheesesteak + Cold Zobo', 'cheesesteak-cold-zobo',
     'A classic cheesesteak paired with a refreshing cold Zobo drink.',
     NULL, 15000::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 2, '[]'),
    ('combos', 'Tigernut Drink + Sandwich', 'tigernut-drink-sandwich',
     'Creamy Tigernut Drink (50cl) paired with your choice of sandwich.',
     NULL, 8000::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 3,
     '[{"name":"Sandwich","choices":[{"value":"Chicken Sandwich"},{"value":"Beef Sandwich"}]}]'),
    ('combos', 'Zobo Drink + Sandwich', 'zobo-drink-sandwich',
     'Traditional hibiscus tea paired with your choice of sandwich.',
     NULL, 5000::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 4,
     '[{"name":"Sandwich","choices":[{"value":"Chicken Sandwich"},{"value":"Beef Sandwich"}]}]'),
    ('combos', '550ml VVIP Parfait + Sandwich', 'vvip-parfait-sandwich',
     'A premium 550ml VVIP Parfait paired with your choice of sandwich.',
     NULL, 12900::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 5,
     '[{"name":"Sandwich","choices":[{"value":"Chicken Sandwich"},{"value":"Beef Sandwich"}]}]'),
    ('combos', 'Cheesesteak + Tigernut Drink', 'cheesesteak-tigernut-drink',
     'Cheesesteak paired with a rich, traditional Tigernut Drink (50cl).',
     NULL, 18000::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 6, '[]'),
    ('combos', 'Cheesesteak + PING Juice', 'cheesesteak-ping-juice',
     'Cheesesteak paired with our signature Pineapple & Ginger (PING) Cold-Pressed Juice (35cl).',
     NULL, 16000::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 7, '[]'),
    ('combos', 'Whole Wheat Banana Bread + Tigernut Drink', 'banana-bread-tigernut-drink',
     'A slice of wholesome Whole Wheat Banana Bread paired with Tigernut Drink.',
     NULL, 7000::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 8, '[]'),
    ('combos', 'Chicken / Beef Sandwich + PING Juice', 'sandwich-ping-juice',
     'Your choice of sandwich paired with refreshing PING Cold-Pressed Juice (35cl).',
     NULL, 6200::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 9,
     '[{"name":"Sandwich","choices":[{"value":"Chicken Sandwich"},{"value":"Beef Sandwich"}]}]'),
    ('combos', 'Whole Wheat Banana Bread + Cold Zobo', 'banana-bread-cold-zobo',
     'A slice of wholesome Whole Wheat Banana Bread paired with traditional cold Zobo.',
     NULL, 4000::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 10, '[]'),
    ('combos', '500ml Greek Yoghurt + Sandwich', 'greek-yoghurt-sandwich',
     'Rich and creamy Greek Yoghurt (500ml) paired with your choice of sandwich.',
     NULL, 9000::numeric, '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
     'bundle', 11,
     '[{"name":"Sandwich","choices":[{"value":"Chicken Sandwich"},{"value":"Beef Sandwich"}]}]'),

    -- Independent homepage VVIP offer: the UI sends this identifier and
    -- selection verbatim, so define that exact one-choice option group.
    ('greek-yogurt-parfaits', 'VVIP Exotic Parfait Bowl', 'vvip-parfait-featured',
     '1 Litre loaded bowl of fresh kiwi, strawberries, grapes, cashew nuts and thick yogurt.',
     NULL, 15000::numeric, '/assets/IMG_1639_parfait_1l.jpg', 'standard', 0,
     '[{"name":"Size","choices":[{"value":"1 Litre (Ay Bowl)"}]}]')
) AS p(category_slug, name, slug, description, ingredients, base_price,
       image_url, product_type, display_order, options)
JOIN public.categories AS c
  ON c.slug = p.category_slug
ON CONFLICT (slug) DO NOTHING;

COMMIT;

-- =============================================================================
-- Deliberately omitted / blocked pending a business or database decision
-- =============================================================================
--
-- 1. healthy-chicken-salad: FruitsCategoryPage uses category fruits and price
--    4,500, while SandwichesSavouryPage uses sandwiches-savoury and price
--    5,000, with different option names/values. One unique slug cannot safely
--    represent both without a decision.
--
-- 2. ping: ColdPressedJuicesPage shows 3,200, while CategoryPlaceholder shows
--    PING Juice at 2,500. No price has been chosen. Both other juice products
--    use the exact fixed prices from ColdPressedJuicesPage.
--
-- 3. so-creamy: the direct page sends base 2,500 and a 50cl modifier of 2,500;
--    the checked-in seed defines the same slug at base 2,500 with a 50cl
--    modifier of 2,000. This script must not overwrite the seeded definition.
--
-- 4. tigernut-drink: the direct page uses base 2,500 and modifier 2,500; the
--    seed uses base 1,200 and modifier 1,300. Existing slug and differing
--    prices prevent a safe insert/update decision.
--
-- 5. cheesesteak: the page offers Size Small/Medium with Medium +4,000, while
--    the seed offers Medium/Large with Large +4,000. Exact choice validation
--    would reject Small; no choice has been silently changed.
--
-- 6. Greek Yoghurt, Fresh Club Sandwich, and Whole Wheat Banana Bread homepage
--    cards (`greek-yoghurt`, `sandwich`, `banana-bread`) define prices by
--    selection but do not declare a database base_price/price_modifier
--    breakdown. The distinct IDs are syntactically valid slugs, but inserting
--    guessed baselines/modifiers would violate the migration constraints.
--
-- 7. Smallie Parfait uses slug smallie-parfait but submits option
--    Category=Events & Catering. The checked-in seed has that slug with an
--    empty options array; the RPC would reject that option. Changing the
--    existing row is explicitly out of scope, so it is not inserted here.
--
-- 8. The source provides a `Category: Events & Catering` choice for the
--    Smallie cart item; it is not included as a new product row for the reason
--    above. Existing seed slugs for VVIP/VIP/Greek Yogurt, Chicken/Beef/
--    Chicken & Egg Sandwich, Milk Mix/Yoghurt Mix/Nutty Chocolate, Matcha/
--    Taro/Classic Milk Tea, Hibiscus Drink, and the first two Treat Boxes use
--    ON CONFLICT DO NOTHING. Their current deployed definitions must be
--    checked before relying on them; this script never alters them.
--
-- 9. Custom Exotic Parfait (`quote-only`) is an enquiry/quote workflow, not a
--    hardcoded addItem() product. The placeholder CategoryPlaceholder page is
--    not a cart catalogue and has conflicting product names/prices (including
--    PING); it is not migrated as orderable product rows.
--
-- 10. Combo choices are represented as ordinary JSONB choice strings because
--     the RPC validates groups/values and computes a fixed combo base_price.
--     The RPC does not represent component-product relationships or enforce
--     that the selected sandwich/smoothie is independently available. Confirm
--     that fixed-price combos should remain one bundle line before execution.
--
-- Review status: additive SQL is prepared for rows whose page data fits the
-- current schema/RPC without altering existing records. Full catalogue sync
-- is blocked by the omissions above and the absence of live database state.
