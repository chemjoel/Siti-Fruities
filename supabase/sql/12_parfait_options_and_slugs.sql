-- =============================================================================
-- SQL 12 — Exotic Parfait: names, descriptions, Extra Granola, slug safety
-- Source: Siti Fruities parfait menu pamphlet. Prices and size options were
-- already correct and are NOT changed here. Safe to re-run.
-- =============================================================================

-- 1. Restore the original slugs if a dashboard rename regenerated them.
--    (Checkout looks products up by slug, so these must stay unchanged.)
UPDATE public.products SET slug = 'vvip-exotic-parfait' WHERE slug = 'exotic-parfait-vvip';
UPDATE public.products SET slug = 'vip-exotic-parfait'  WHERE slug = 'exotic-parfait-vip';

-- 2. Names, descriptions and ingredients
UPDATE public.products
SET name = 'Exotic Parfait - VVIP',
    description = 'A perfect layer of premium Greek yoghurt, apple, coconut, grapes, strawberries, kiwi and granola made with rolled oats, raisins and cashew nuts.',
    ingredients = 'Greek Yoghurt, Apple, Coconut, Grapes, Strawberries, Kiwi, Granola (rolled oats, raisins, cashew nuts)'
WHERE slug = 'vvip-exotic-parfait';

UPDATE public.products
SET name = 'Exotic Parfait - VIP',
    description = 'A perfect layer of premium Greek yoghurt, apple, coconut, grapes and granola made with rolled oats, raisins and cashew nuts. Made with all our ingredients except strawberries and kiwi.',
    ingredients = 'Greek Yoghurt, Apple, Coconut, Grapes, Granola (rolled oats, raisins, cashew nuts)'
WHERE slug = 'vip-exotic-parfait';

-- 3. Extra Granola Topping option (only added if not already there)
UPDATE public.products
SET options = options || '[{"name":"Extra Granola Topping","choices":[{"value":"None"},{"value":"30g","price_modifier":1000},{"value":"40g","price_modifier":1500},{"value":"45g","price_modifier":2000},{"value":"100g","price_modifier":4500}]}]'::jsonb
WHERE slug IN ('vvip-exotic-parfait', 'vip-exotic-parfait')
  AND NOT (options @> '[{"name":"Extra Granola Topping"}]'::jsonb);
