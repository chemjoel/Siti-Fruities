-- Align existing categories with the current homepage category cards.
-- Values are from CategorySection.CATEGORIES; image_url and other fields are untouched.
-- UPDATE WHERE slug only; no inserts or deletes.

UPDATE public.categories
SET display_order = 1,
    name = 'Fresh Fruits & Healthy Snacks',
    description = 'Fresh seasonal fruit salad bowls, healthy chicken salad, and clean snacks.'
WHERE slug = 'fruits';

UPDATE public.categories
SET display_order = 2,
    name = 'Greek Yogurt & Parfaits',
    description = 'Our signature layered Exotic Parfaits and 100% probiotic Greek Yogurt.'
WHERE slug = 'greek-yogurt-parfaits';

UPDATE public.categories
SET display_order = 3,
    name = 'Smoothies',
    description = 'Rich, thick, and nutrient-dense smoothies made from fresh fruits and nuts.'
WHERE slug = 'smoothies';

UPDATE public.categories
SET display_order = 4,
    name = 'Cold-Pressed Juices',
    description = '100% raw, refreshing fruit juices cold-pressed with zero added sugar.'
WHERE slug = 'cold-pressed-juices';

UPDATE public.categories
SET display_order = 5,
    name = 'Sandwiches & Savoury',
    description = 'Freshly made Chicken, Beef, and Egg sandwiches with signature cream.'
WHERE slug = 'sandwiches-savoury';

UPDATE public.categories
SET display_order = 6,
    name = 'Milk Tea & Drinks',
    description = 'Freshly brewed Milk Tea with chewy boba pearls, Zobo, and Tigernut drink.'
WHERE slug = 'milk-tea-drinks';

UPDATE public.categories
SET display_order = 7,
    name = 'Treat Boxes',
    description = 'Curated combination packages featuring salad, yogurt, parfait, and bread.'
WHERE slug = 'treat-boxes';

UPDATE public.categories
SET display_order = 8,
    name = 'Fruit Hampers',
    description = 'Beautifully arranged deluxe and exotic fresh fruit gift hampers.'
WHERE slug = 'fruit-hampers';

UPDATE public.categories
SET display_order = 9,
    name = 'Combos',
    description = 'Specially paired healthy meal combinations at discounted prices.'
WHERE slug = 'combos';

UPDATE public.categories
SET display_order = 10,
    name = 'Catering & Events',
    description = 'Indoor, outdoor, and bulk food supply services customized for your events.'
WHERE slug = 'catering-events';
