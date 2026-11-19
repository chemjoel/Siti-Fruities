-- =============================================================================
-- SQL 11 — Remove 4 unused products (applied to production)
-- Yoghurt Mix Smoothie, Chicken and Beef Sandwich, Custom Exotic Parfait,
-- Custom Fruit Cup. Matched by exact slug so the two Chicken/Beef combo
-- products (sandwich-ping-juice, chicken-beef-sandwich-cold-zobo) are kept.
--
-- Run AFTER SQL 1-9. Do NOT re-run SQL 5, 7 or 9 afterwards: they would
-- re-create these products. Past orders are safe: order_items keeps
-- product_name and sets product_id to NULL on delete.
-- =============================================================================

DELETE FROM public.products
WHERE slug IN (
  'yoghurt-mix',
  'chicken-and-beef-sandwich',
  'custom-exotic-parfait',
  'custom-fruit-cup'
)
RETURNING id, name, slug;
