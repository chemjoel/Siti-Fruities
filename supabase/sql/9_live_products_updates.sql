BEGIN;

-- Update the live catalog using product slugs from the supplied CSV.
-- This script deliberately does not modify categories, orders, or order items.

LOCK TABLE public.order_items IN SHARE ROW EXCLUSIVE MODE;

DO $$
DECLARE
    missing_slugs TEXT;
BEGIN
    SELECT string_agg(expected.slug, ', ' ORDER BY expected.slug)
    INTO missing_slugs
    FROM (
        VALUES
            ('healthy-chicken-salad'),
            ('fruit-yogurt-combo'),
            ('crunchy-granola-snack'),
            ('milk-mix'),
            ('yoghurt-mix'),
            ('nutty-chocolate'),
            ('ginger-blast'),
            ('so-creamy'),
            ('strawberry-smoothie'),
            ('fruity-smoothie'),
            ('healthy-green'),
            ('ping'),
            ('beet-the-heat'),
            ('chicken-sandwich'),
            ('beef-sandwich'),
            ('chicken-egg-sandwich'),
            ('sandwich'),
            ('matcha-milk-tea'),
            ('classic-milk-tea'),
            ('hibiscus-drink-zobo'),
            ('tigernut-drink'),
            ('juicy-treatbox'),
            ('mini-treatbox'),
            ('maxi-treatbox'),
            ('deluxe-treatbox'),
            ('intentional-treatbox'),
            ('mini-treatbox-2'),
            ('mini-treatbox-3'),
            ('juicy-treatbox-2'),
            ('perfecto-treatbox'),
            ('deluxe-hamper'),
            ('exotic-fruit-hamper'),
            ('cheesesteak-smoothie'),
            ('vvip-parfait-sandwich'),
            ('greek-yoghurt-sandwich'),
            ('sandwich-ping-juice')
    ) AS expected(slug)
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.products AS p
        WHERE p.slug = expected.slug
    );

    IF missing_slugs IS NOT NULL THEN
        RAISE EXCEPTION 'Required CSV product slugs are missing: %', missing_slugs;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.order_items AS oi
        JOIN public.products AS p ON p.id = oi.product_id
        WHERE p.slug IN (
            'sandwich',
            'fruit-yogurt-combo',
            'mini-treatbox-2',
            'mini-treatbox-3',
            'juicy-treatbox-2'
        )
    ) THEN
        RAISE EXCEPTION
            'A product marked for deletion is referenced by order_items; no changes were made.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM (VALUES
            ('cold-pressed-juices'),
            ('sandwiches-savoury'),
            ('fruit-hampers'),
            ('combos'),
            ('fruits')
        ) AS expected(slug)
        WHERE NOT EXISTS (
            SELECT 1
            FROM public.categories AS c
            WHERE c.slug = expected.slug
        )
    ) THEN
        RAISE EXCEPTION 'A required product category is missing; no changes were made.';
    END IF;
END;
$$;

-- A) Confirm each exact-slug match before deleting it.
SELECT id, slug, name, options
FROM public.products
WHERE slug = 'sandwich';

DELETE FROM public.products
WHERE slug = 'sandwich';

SELECT id, slug, name, options
FROM public.products
WHERE slug = 'fruit-yogurt-combo';

DELETE FROM public.products
WHERE slug = 'fruit-yogurt-combo';

SELECT id, slug, name, options
FROM public.products
WHERE slug = 'mini-treatbox-2';

DELETE FROM public.products
WHERE slug = 'mini-treatbox-2';

SELECT id, slug, name, options
FROM public.products
WHERE slug = 'mini-treatbox-3';

DELETE FROM public.products
WHERE slug = 'mini-treatbox-3';

SELECT id, slug, name, options
FROM public.products
WHERE slug = 'juicy-treatbox-2';

DELETE FROM public.products
WHERE slug = 'juicy-treatbox-2';

-- B) Price and size updates. The default size is the base price and has
-- an explicit zero modifier; option names and existing choice values remain.
UPDATE public.products
SET base_price = 2300,
    options = '[{"name":"Size","choices":[{"value":"25cl","price_modifier":0},{"value":"50cl","price_modifier":2200}]},{"name":"Fruit Choice","choices":[{"value":"Watermelon"},{"value":"Pineapple"}]}]'::jsonb
WHERE slug = 'milk-mix';

UPDATE public.products
SET base_price = 2300,
    options = '[{"name":"Size","choices":[{"value":"25cl","price_modifier":0},{"value":"50cl","price_modifier":2700}]}]'::jsonb
WHERE slug = 'yoghurt-mix';

UPDATE public.products
SET base_price = 2700,
    options = '[{"name":"Size","choices":[{"value":"25cl","price_modifier":0},{"value":"50cl","price_modifier":2800}]}]'::jsonb
WHERE slug = 'nutty-chocolate';

UPDATE public.products
SET base_price = 2700,
    options = '[{"name":"Size","choices":[{"value":"25cl","price_modifier":0},{"value":"50cl","price_modifier":2800}]}]'::jsonb
WHERE slug = 'so-creamy';

UPDATE public.products
SET base_price = 2000,
    options = '[{"name":"Size","choices":[{"value":"25cl","price_modifier":0},{"value":"50cl","price_modifier":2000}]}]'::jsonb
WHERE slug = 'ginger-blast';

UPDATE public.products
SET base_price = 2500,
    options = '[{"name":"Size","choices":[{"value":"25cl","price_modifier":0},{"value":"50cl","price_modifier":2500}]}]'::jsonb
WHERE slug = 'fruity-smoothie';

UPDATE public.products
SET base_price = 3000,
    options = '[{"name":"Size","choices":[{"value":"25cl","price_modifier":0},{"value":"50cl","price_modifier":3000}]},{"name":"Fruit Choice","choices":[{"value":"Watermelon"},{"value":"Pineapple"}]}]'::jsonb
WHERE slug = 'strawberry-smoothie';

UPDATE public.products
SET base_price = 2500,
    options = '[{"name":"Size","choices":[{"value":"25cl","price_modifier":0},{"value":"50cl","price_modifier":2500}]}]'::jsonb
WHERE slug = 'healthy-green';

UPDATE public.products
SET base_price = 3500
WHERE slug = 'ping';

UPDATE public.products
SET base_price = 9000
WHERE slug = 'classic-milk-tea';

UPDATE public.products
SET base_price = 1200,
    options = '[{"name":"Size","choices":[{"value":"25cl","price_modifier":0},{"value":"50cl","price_modifier":1300}]}]'::jsonb
WHERE slug = 'hibiscus-drink-zobo';

UPDATE public.products
SET base_price = 3500
WHERE slug = 'chicken-sandwich';

UPDATE public.products
SET base_price = 3500
WHERE slug = 'beef-sandwich';

UPDATE public.products
SET base_price = 5500
WHERE slug = 'chicken-egg-sandwich';

UPDATE public.products
SET base_price = 5000,
    options = '[{"name":"Size","choices":[{"value":"Single Serving","price_modifier":0},{"value":"Large Bowl","price_modifier":2500}]}]'::jsonb
WHERE slug = 'healthy-chicken-salad';

UPDATE public.products
SET base_price = 4500,
    options = '[{"name":"Size","choices":[{"value":"100g","price_modifier":0},{"value":"30g","price_modifier":-3500},{"value":"40g","price_modifier":-3000},{"value":"45g","price_modifier":-2500},{"value":"500g","price_modifier":16500}]}]'::jsonb
WHERE slug = 'crunchy-granola-snack';

UPDATE public.products
SET base_price = 16500
WHERE slug = 'mini-treatbox';

UPDATE public.products
SET base_price = 24500
WHERE slug = 'juicy-treatbox';

UPDATE public.products
SET name = 'Mazi Treatbox',
    base_price = 38000
WHERE slug = 'maxi-treatbox';

UPDATE public.products
SET base_price = 42000
WHERE slug = 'deluxe-treatbox';

UPDATE public.products
SET base_price = 32000
WHERE slug = 'intentional-treatbox';

UPDATE public.products
SET base_price = 17000
WHERE slug = 'cheesesteak-smoothie';

UPDATE public.products
SET base_price = 15000
WHERE slug = 'vvip-parfait-sandwich';

UPDATE public.products
SET base_price = 10000
WHERE slug = 'greek-yoghurt-sandwich';

UPDATE public.products
SET base_price = 6500
WHERE slug = 'sandwich-ping-juice';

-- D) Description and ingredient corrections.
UPDATE public.products
SET description = 'Oats, Peanut Butter, Greek Yoghurt, Banana, Cinnamon, Watermelon.',
    ingredients = 'Oats, Peanut Butter, Greek Yoghurt, Banana, Cinnamon, Watermelon'
WHERE slug = 'so-creamy';

UPDATE public.products
SET description = 'Beetroot, Watermelon and Carrot.',
    ingredients = 'Beetroot, Watermelon, Carrot'
WHERE slug = 'beet-the-heat';

UPDATE public.products
SET description = 'Tigernuts, Dates, Ginger and Coconut.',
    ingredients = 'Tigernuts, Dates, Ginger, Coconut'
WHERE slug = 'tigernut-drink';

UPDATE public.products
SET description = 'Hibiscus flower, Ginger, Pineapple, Cucumber, Orange and Sweetener.',
    ingredients = 'Hibiscus flower, Ginger, Pineapple, Cucumber, Orange, Sweetener'
WHERE slug = 'hibiscus-drink-zobo';

UPDATE public.products
SET description = 'Premium matcha flavour with chewy tapioca pearls.'
WHERE slug = 'matcha-milk-tea';

UPDATE public.products
SET description = 'Fresh lettuce, vegetables, fruit, and grilled chicken paired with our in-house salad cream.',
    ingredients = 'Lettuce, Carrot, Cucumber, Bell Peppers, Purple Cabbage, Red Grapes, Green Apple, Sweetcorn, Raisins, Grilled Chicken, Salad Cream'
WHERE slug = 'healthy-chicken-salad';

UPDATE public.products
SET description = '3 toasted slices of bread, crunchy cabbage, shredded carrot, in-house cream and seasoned grilled chicken.',
    ingredients = 'Bread, Grilled Chicken, Cabbage, Carrot, In-house Cream'
WHERE slug = 'chicken-sandwich';

UPDATE public.products
SET description = '3 toasted slices packed with shredded chicken, boiled or fried egg, cabbage, carrot, lettuce, and dressing.',
    ingredients = 'Bread, Chicken, Egg, Cabbage, Carrot, Lettuce, In-house Cream'
WHERE slug = 'chicken-egg-sandwich';

UPDATE public.products
SET ingredients = '500ml PING Juice (Pineapple & Ginger)
400ml Exotic Parfait
50cl Tigernut Drink
Whole Wheat Banana Bread
1 pack of Yummy Sandwich'
WHERE slug = 'juicy-treatbox';

UPDATE public.products
SET ingredients = '500ml Exotic Parfait
1 pack of Sandwich
1 bottle of cold Zobo'
WHERE slug = 'mini-treatbox';

UPDATE public.products
SET ingredients = '1 Big Pineapple
1 Big Watermelon
5 Red Apples
4 Clementines
1 pack of Red Seedless Grapes
1 pack of Strawberries
1 pack of Blueberries
2 Kiwis
2 Oranges
2 Lemons
Luxury Hamper Basket
Note Card'
WHERE slug = 'exotic-fruit-hamper';

-- C) New products. Category rows are looked up by their existing slugs.
INSERT INTO public.products
    (category_id, name, slug, description, ingredients, base_price,
     image_url, product_type, is_available, options)
SELECT
    c.id,
    v.name,
    v.slug,
    v.description,
    v.ingredients,
    v.base_price,
    NULL,
    'standard',
    true,
    v.options::jsonb
FROM (
    VALUES
        (
            'cold-pressed-juices',
            'Vitality Shot',
            'vitality-shot',
            'A concentrated 50ml shot of ginger, turmeric, lemon, carrot, orange and black pepper.',
            'Ginger, Turmeric, Lemon, Carrot, Orange, Black Pepper',
            1500::numeric,
            '[]'
        ),
        (
            'sandwiches-savoury',
            'Chicken and Beef Sandwich',
            'chicken-and-beef-sandwich',
            '3 sliced bread with cabbage, carrot and protein mixed with our in-house cream.',
            NULL,
            4000::numeric,
            '[]'
        ),
        (
            'fruit-hampers',
            'Ramadan Fruit Hamper',
            'ramadan-fruit-hamper',
            NULL,
            NULL,
            30000::numeric,
            '[]'
        ),
        (
            'combos',
            'Chicken/Beef Sandwich + Cold Zobo',
            'chicken-beef-sandwich-cold-zobo',
            'Your choice of chicken or beef sandwich paired with cold Zobo.',
            'Sandwich (your choice)
Cold Zobo',
            5000::numeric,
            '[{"name":"Choose your sandwich","choices":[{"value":"Chicken Sandwich","price_modifier":0},{"value":"Beef Sandwich","price_modifier":0}]}]'
        )
) AS v(category_slug, name, slug, description, ingredients, base_price, options)
JOIN public.categories AS c ON c.slug = v.category_slug
ON CONFLICT (slug) DO UPDATE
SET category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    ingredients = EXCLUDED.ingredients,
    base_price = EXCLUDED.base_price,
    product_type = EXCLUDED.product_type,
    is_available = EXCLUDED.is_available,
    options = EXCLUDED.options;

-- Verification: deleted products should return no rows.
SELECT id, slug, name
FROM public.products
WHERE slug IN (
    'sandwich',
    'fruit-yogurt-combo',
    'mini-treatbox-2',
    'mini-treatbox-3',
    'juicy-treatbox-2'
)
ORDER BY slug;

-- Verification: changed and newly inserted products.
SELECT slug, name, base_price, options, description, ingredients,
       is_available, image_url
FROM public.products
WHERE slug IN (
    'milk-mix',
    'yoghurt-mix',
    'nutty-chocolate',
    'so-creamy',
    'ginger-blast',
    'fruity-smoothie',
    'strawberry-smoothie',
    'healthy-green',
    'ping',
    'classic-milk-tea',
    'hibiscus-drink-zobo',
    'chicken-sandwich',
    'beef-sandwich',
    'chicken-egg-sandwich',
    'healthy-chicken-salad',
    'crunchy-granola-snack',
    'mini-treatbox',
    'juicy-treatbox',
    'maxi-treatbox',
    'deluxe-treatbox',
    'intentional-treatbox',
    'cheesesteak-smoothie',
    'vvip-parfait-sandwich',
    'greek-yoghurt-sandwich',
    'sandwich-ping-juice',
    'beet-the-heat',
    'tigernut-drink',
    'matcha-milk-tea',
    'exotic-fruit-hamper',
    'vitality-shot',
    'chicken-and-beef-sandwich',
    'ramadan-fruit-hamper',
    'chicken-beef-sandwich-cold-zobo'
)
ORDER BY slug;

-- Verification: requested leave-as-is products.
SELECT slug, name, base_price, options
FROM public.products
WHERE slug IN ('exotic-fruit-salad', 'custom-fruit-cup', 'banana-bread')
ORDER BY slug;

COMMIT;
