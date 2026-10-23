# SITI FRUITIES — Catalogue Inventory (Phase 0)

**Scope:** Read-only inventory of the checked-in application and SQL definitions. No live Supabase query was made, so SQL below describes the repository's declared schema/seed behavior, not proof of the currently deployed database contents. Prices and labels are copied from source; they are not recommendations or confirmations of current commercial pricing.

**Evidence convention:** “Verified” means present in the cited source. “Unresolved” identifies something that cannot be established from repository code alone.

## 1. Catalogue sources and category behavior

The storefront does not consistently read its product/category records from Supabase:

- `src/components/CategorySection.tsx` renders a hardcoded home-page list and image assets.
- `src/components/Navbar.tsx` has a separate hardcoded `SHOP_LINKS` list.
- The routed pages in `src/App.tsx` use page-local product arrays and prices; the products shown there are not loaded from `productService`.
- `src/services/product.service.ts` separately defines `DEFAULT_CATEGORIES` and `DEFAULT_PRODUCTS`. Its methods query Supabase first when configured, but fall back to these arrays when the query errors or returns no rows.
- `src/pages/CategoryPlaceholder.tsx` has a third static catalogue. The specific product routes in `App.tsx` precede its `/:category` catch-all route, so these are not the normal catalogues for the routed category pages. Its cards are “Stage 2 Product” WhatsApp links, not cart products.
- `supabase/sql/5_seed_data.sql` seeds ten categories with the same names/slugs/order as `DEFAULT_CATEGORIES`, but the homepage category order, labels, image assets, and descriptions are not wholly the same.

### Hardcoded/storefront categories

`CategorySection.CATEGORIES` is the home display order below. Order is the array order (1-based); the fallback/seed order column is shown separately. Its `href` is the route identifier used by the page, not a database category ID.

| Name | Route/slug | `DEFAULT_CATEGORIES` id; fallback/seed display order | Home-card description and image source | Fallback/seed description and image source |
|---|---|---|---|---|
| Fresh Fruits & Healthy Snacks | `/fruits` (`fruits`) | `6`; 6 | “Fresh seasonal fruit salad bowls, healthy chicken salad, and clean snacks.” `/assets/Screenshot_20260729-212635_1785360049633.jpg` | “Crisp fresh handpicked fruits and tossed chicken salads.” `/assets/Screenshot_20260729-212635_1785360049844.jpg` |
| Greek Yogurt & Parfaits | `/greek-yogurt-parfaits` (`greek-yogurt-parfaits`) | `1`; 1 | “Our signature layered Exotic Parfaits and 100% probiotic Greek Yogurt.” `/assets/IMG_8435_parfait_multi.jpg` | “Our signature probiotic Greek yogurt and fruit-loaded exotic parfaits.” `/assets/IMG_8455_parfait_bowls.jpg` |
| Smoothies | `/smoothies` (`smoothies`) | `2`; 2 | “Rich, thick, and nutrient-dense smoothies made from fresh fruits and nuts.” `/assets/Screenshot_20260729-212748_1785360013740.jpg` | “Rich, thick and 100% natural fruit blends.” `/assets/Screenshot_20260729-212748_1785360049844.jpg` |
| Cold-Pressed Juices | `/cold-pressed-juices` (`cold-pressed-juices`) | `5`; 5 | “100% raw, refreshing fruit juices cold-pressed with zero added sugar.” `/assets/Screenshot_20260729-212547_1785360049692.jpg` | “Raw, unpasteurised 100% natural cold-pressed fruit juices.” `/assets/Screenshot_20260729-212547_1785360049844.jpg` |
| Sandwiches & Savoury | `/sandwiches-savoury` (`sandwiches-savoury`) | `3`; 3 | “Freshly made Chicken, Beef, and Egg sandwiches with signature cream.” `/assets/IMG_1940_sandwich.jpg` | “Fresh toasted sandwiches and mouth-watering cheesesteaks.” `/assets/IMG_1940_sandwich.jpg` |
| Milk Tea & Drinks | `/milk-tea-drinks` (`milk-tea-drinks`) | `4`; 4 | “Freshly brewed Milk Tea with chewy boba pearls, Zobo, and Tigernut drink.” `/assets/IMG_2364_bubble_tea_duo.jpg` | “Boba bubble teas, zobo infusions, and creamy tigernut drinks.” `/assets/IMG_2326_bubble_tea.jpg` |
| Treat Boxes | `/treat-boxes` (`treat-boxes`) | `7`; 7 | “Curated combination packages featuring salad, yogurt, parfait, and bread.” `/assets/Screenshot_20260729-212815_1785360013704.jpg` | “Carefully curated gift boxes packed with parfaits, juices & snacks.” `/assets/Screenshot_20260729-212815_1785360049844.jpg` |
| Fruit Hampers | `/fruit-hampers` (`fruit-hampers`) | `9`; 9 | “Beautifully arranged deluxe and exotic fresh fruit gift hampers.” `/assets/Screenshot_20260729-213638_1785360173839.jpg` | “Luxury celebratory gift hampers for birthdays, events and holidays.” `/assets/Screenshot_20260729-213638_1785360049844.jpg` |
| Combos | `/combos` (`combos`) | `8`; 8 | “Specially paired healthy meal combinations at discounted prices.” No image (`img: ''`); icon/gradient artwork instead. | “Value-packed meal pairings of sandwiches, cheesesteaks and drinks.” `/assets/IMG_1940_sandwich.jpg` |
| Catering & Events | `/catering-events` (`catering-events`) | `10`; 10 | “Indoor, outdoor, and bulk food supply services customized for your events.” No image (`img: ''`); icon/gradient artwork instead. | “Bespoke high-volume catering packages for weddings, meetings & high tea.” `/assets/Screenshot_20260729-212242_1785360049881.jpg` |

The home-card descriptions and sources above are from `src/components/CategorySection.tsx`; fallback/seed fields are from `src/services/product.service.ts` (`DEFAULT_CATEGORIES`) and `supabase/sql/5_seed_data.sql`. In `Navbar.SHOP_LINKS`, the displayed link labels are the ten category names above except “Greek Yogurt & Parfaits” is listed after fruits; these links do not load category metadata.

`CategorySection` always renders its own array. It does not use database `is_active`, name, slug, image, or display order. The page routes in `App.tsx` are also explicit and do not derive from category records. The home ordering differs from database `display_order` (fruits first, then Greek yogurt; DB order starts with Greek yogurt). Combo and Catering use decorative icon/gradient cards instead of image files.

All ten `DEFAULT_CATEGORIES` entries set `is_active: true`; this is fallback metadata, not evidence of deployed visibility. `CategorySection` and `Navbar` render their hardcoded entries without checking any active flag.

### Category admin edit capability

`src/pages/admin/AdminDashboardPage.tsx` implements `handleSaveCategory`, `toggleCategoryActive`, and `handleDeleteCategory`. The category form edits **name, slug, description, image URL, display order, and active status**; `ImageUpload` provides category image upload. Create/update/delete calls target the `categories` table when Supabase is configured. Thus editing name, slug, image, or active status is already supported in the admin model. However, the home category cards, navigation labels/routes, and routed page content remain hardcoded, so these admin edits do not automatically change those surfaces. `is_active` is not consulted by those hardcoded surfaces.

## 2. Hardcoded cart catalogue

The following records come from page-local arrays/components, not the admin-loaded product list. Prices are NGN. For `ProductCard` entries, selected `priceModifier` is added to the stated base price and the resulting unit price is sent to `addItem()`. Where a page does not declare an image, its card uses an icon/gradient and its cart thumbnail uses the generic branded fallback `/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png`.

For the dedicated page tables below, “category” means the page/category route where the array is rendered; those arrays do not carry a `category_id` field. Featured homepage cards likewise do not set a category field. Their actual database category assignment, if any, must be checked against live rows.

### `src/pages/SmoothiesPage.tsx` (`SMOOTHIE_PRODUCTS`)

Card artwork is icon/gradient only; no product image path is set on these entries.

| `productId` | Name | Description | Base price | Options and exact choices |
|---|---|---|---:|---|
| `milk-mix` | Milk Mix | Banana, evaporated milk and your choice of watermelon or pineapple. | 2,000 | Size: `25cl` (+0), `50cl` (+2,000); Fruit Choice: `Watermelon`, `Pineapple` |
| `yoghurt-mix` | Yoghurt Mix | Banana, sweetened yoghurt and pineapple. | 2,000 | Size: `25cl` (+0), `50cl` (+2,000) |
| `nutty-chocolate` | Nutty Chocolate | Banana, peanut butter, Greek yoghurt, watermelon and chocolate chips. | 2,300 | Size: `25cl` (+0), `50cl` (+2,200) |
| `so-creamy` | So Creamy | Dates, peanut butter, Greek yoghurt, banana, cinnamon and watermelon. | 2,500 | Size: `25cl` (+0), `50cl` (+2,500) |
| `ginger-blast` | Ginger Blast | A delicious blend of banana, fresh ginger and pineapple. | 1,800 | Size: `25cl` (+0), `50cl` (+1,700) |
| `strawberry-smoothie` | Strawberry | Fresh strawberries, grapes, apple, banana and your choice of watermelon or pineapple. | 2,500 | Size: `25cl` (+0), `50cl` (+2,500); Fruit Choice: `Watermelon`, `Pineapple` |
| `fruity-smoothie` | Fruity | Apple, grapes, pineapple, watermelon and banana. | 1,800 | Size: `25cl` (+0), `50cl` (+1,700) |
| `healthy-green` | Healthy Green | Banana, apple, pumpkin leaf, lemon juice and pineapple. | 2,000 | Size: `25cl` (+0), `50cl` (+2,000) |

### `src/pages/SandwichesSavouryPage.tsx` (`SANDWICH_PRODUCTS`, `SAVOURY_PRODUCTS`)

| `productId` | Name | Description | Base price | Image | Options |
|---|---|---|---:|---|---|
| `chicken-sandwich` | Chicken Sandwich | 3 sliced breads, cabbage, carrot, in-house cream and chicken. | 3,000 | `/assets/IMG_1940_sandwich.jpg` | None |
| `beef-sandwich` | Beef Sandwich | 3 sliced breads, cabbage, carrot, in-house cream and beef. | 3,000 | `/assets/IMG_1940_sandwich.jpg` | None |
| `chicken-egg-sandwich` | Chicken & Egg Sandwich | 3 sliced breads, cabbage, carrot, in-house cream, chicken and egg. | 5,000 | `/assets/IMG_1940_sandwich.jpg` | Egg Preparation: `Fried`, `Boiled` |
| `cheesesteak` | Cheesesteak | A loaf of bread, mozzarella cheese, stir-fried beef and bell peppers topped with our in-house bread sauce. | 9,000 | No card image configured; generic cart thumbnail. | Size: `Small` (+0), `Medium` (+4,000) |
| `healthy-chicken-salad` | Healthy Chicken Salad | Lettuce, carrot, cucumber, bell peppers, purple cabbage, red grapes, green apple, sweetcorn, raisins, grilled chicken and salad cream. | 5,000 | No card image configured; generic cart thumbnail. | Size: `300ml` (+0), `400ml` (+2,500) |

### `src/pages/MilkTeaDrinksPage.tsx` (`MILK_TEA_PRODUCTS`, `OTHER_DRINKS_PRODUCTS`)

| `productId` | Name | Description | Base price | Image | Options |
|---|---|---|---:|---|---|
| `matcha-milk-tea` | MATCHA MILK TEA | Premium Matcha Flavor with Chewy Tapioca Pearls | 8,500 | `/assets/IMG_2326_bubble_tea.jpg` | None |
| `taro-milk-tea` | TARO MILK TEA | Creamy Taro Flavored Tea, with chewy Tapioca Pearls | 8,000 | `/assets/IMG_2326_bubble_tea.jpg` | None |
| `strawberry-milk-tea` | STRAWBERRY MILK TEA | Sweet Strawberry Delight Tea, with chewy Tapioca Pearls | 8,500 | `/assets/IMG_2364_bubble_tea_duo.jpg` | None |
| `chocolate-milk-tea` | CHOCOLATE MILK TEA | Rich Chocolate Flavored Bubble Tea with chewy Tapioca Pearls | 8,500 | `/assets/IMG_2326_bubble_tea.jpg` | None |
| `vanilla-milk-tea` | VANILLA MILK TEA | Smooth and Rich Vanilla Flavor with chewy Tapioca Pearls | 8,000 | `/assets/IMG_2326_bubble_tea.jpg` | None |
| `classic-milk-tea` | CLASSIC MILK TEA | Our Signature Original Milk Tea with Chewy Tapioca Pearls | 7,000 | `/assets/IMG_2364_bubble_tea_duo.jpg` | None |
| `hibiscus-drink-zobo` | Hibiscus Drink (Zobo) | Traditional refreshing hibiscus flower tea. | 1,000 | No card image configured; generic cart thumbnail. | Size: `25cl` (+0), `50cl` (+1,000) |
| `tigernut-drink` | Tigernut Drink | Traditional freshly pressed tigernut milk infused with coconut, dates and ginger. | 2,500 | No card image configured; generic cart thumbnail. | Size: `25cl` (+0), `50cl` (+2,500) |

### `src/pages/FruitsCategoryPage.tsx` (`FRUITS_PRODUCTS`)

All entries use icon/gradient card art; no product image is set.

| `productId` | Name | Description | Base price | Options |
|---|---|---|---:|---|
| `healthy-chicken-salad` | Healthy Chicken Salad | Fresh crisp shredded chicken breast paired with seasonal cabbage, carrot, and SITI FRUITIES in-house salad dressing. | 4,500 | Size: `Single Serving` (+0), `Large Bowl` (+1,500) |
| `exotic-fruit-salad` | Exotic Fruit Salad Bowl | A beautifully arranged selection of handpicked fresh seasonal fruits (watermelon, pineapple, apples, grapes, oranges). | 3,500 | Bowl Size: `Medium Bowl` (+0), `Gbemidele Size` (+2,000) |
| `fruit-yogurt-combo` | Fresh Fruit & Yogurt Combo | Our freshly pressed yogurt served with selected fruit toppings. A perfect healthy midday pick-me-up. | 5,000 | Yogurt Type: `Sweetened Greek Yogurt`, `Unsweetened Greek Yogurt` |
| `crunchy-granola-snack` | Crunchy Granola Snack Pack (100g) | Premium crunchy baked granola loaded with coconut flakes, raisins, and roasted cashew nuts. | 3,500 | None |
| `custom-fruit-cup` | Custom Fruit Cup | Customize your bowl with your choice of sweetened/unsweetened yogurt base and custom fresh sliced fruits. | 3,000 | Serving Size: `Regular Cup` (+0), `Deluxe Bowl` (+1,500) |

### `src/pages/ColdPressedJuicesPage.tsx` (`JUICE_PRODUCTS`)

| Cart `productId` (`juice.id`) | Name | Description / ingredients | Displayed unit price | Displayed size | Image |
|---|---|---|---:|---|---|
| `ping` | PING | Pineapple and ginger. | 3,200 | `35cl` | No card image; cart uses `/assets/Screenshot_20260729-212547_1785360049692.jpg` |
| `sweet-green` | SWEET GREEN | Apple, orange, cucumber and lemon. | 4,500 | `35cl` | Same cart fallback |
| `beet-the-heat` | BEET THE HEAT | Beetroot, carrot, watermelon and lemon. | 5,000 | `35cl` | Same cart fallback |

`handleAdd()` sends a single option `{ name: 'Size', value: '35cl' }` for each juice; there are no selectable juice options on this page.

### `src/pages/GreekYogurtParfaitsPage.tsx`

This route has its own price maps and sends the selected full unit price as `price`.

| `productId` | Name | Description | Displayed prices by size | Cart options | Image |
|---|---|---|---|---|---|
| `greek-yogurt` | `Greek Yogurt (${yogurtType})` (the selected type is interpolated into the cart name) | “Highly rich in Probiotics, gut friendly and 100% healthy.” | `330ml` 4,500; `500ml` 6,500; `1L` 12,000; `2L` 23,500; `5L` 56,000 | Yogurt Type: `Sweetened`, `Unsweetened`; Size is the exact selected size string. | `/assets/Screenshot_20260729-212331_1785360049844.jpg` |
| `vvip-exotic-parfait` | VVIP Exotic Parfait | “A luxurious medley of pure Greek Yogurt layered with apple, kiwi, strawberry, grapes, crunchy granola with rolled oats, raisins, and cashew nuts.” | `330ml` 6,000; `500ml` 8,500; `550ml` 10,000; `1L` 15,000; `2L` 29,000; `5L` 65,000 | Yogurt Type: `Sweetened`, `Unsweetened`; Size values: `Mini (330ml)`, `Medium (500ml)`, `Gbemidele (550ml)`, `Ay Bowl (1L)`, `Wonder Bowl (2L)`, `Twa Bowl (5L)` (mapped from selected size). | `/assets/IMG_8455_parfait_bowls.jpg` |
| `vip-exotic-parfait` | VIP Exotic Parfait | “Our classic parfait layered with fresh apples, grapes, crunchy granola, raisins, and premium cashew nuts.” | `330ml` 5,000; `500ml` 8,000; `550ml` 9,000; `1L` 13,500 | Yogurt Type: `Sweetened`, `Unsweetened`; Size values: `Mini (330ml)`, `Medium (500ml)`, `Gbemidele (550ml)`, `Ay Bowl (1L)`. | `/assets/IMG_6519_parfait_500ml.jpg` |

The two parfait descriptions above are rendered on the page; fallback/seed descriptions and ingredients are separately present in `DEFAULT_PRODUCTS` and the SQL seed. For the VVIP/VIP product IDs and option labels, see the server compatibility section below.

### `src/pages/TreatBoxesPage.tsx` (`TREAT_BOX_PRODUCTS`)

Cards show a decorative gift placeholder. `handleAdd()` uses the shared treat-box cover image `/assets/Screenshot_20260729-212815_1785360013704.jpg`; its only selectable choices are included below. The contents listed by each box are hardcoded but do not become separate cart lines.

| `productId` | Name | Description | Price | Options |
|---|---|---|---:|---|
| `juicy-treatbox` | Juicy Treatbox | A luscious collection featuring our signature ginger-pineapple juice, fresh parfait, nourishing tigernut milk, banana bread, and a delicious sandwich. | 23,500 | None |
| `mini-treatbox` | Mini Treatbox | A delightful personal selection featuring exotic parfait, a sandwich, and refreshing zobo drink. | 14,000 | None |
| `maxi-treatbox` | Maxi Treatbox | A generous feast box featuring a rich variety of premium parfaits, yogurts, salad, drinks, and healthy granola. | 35,000 | None |
| `deluxe-treatbox` | Deluxe Treatbox | Our ultimate wellness bundle packed with nutrient-rich meals, drinks, and healthy toppings perfect for gifting. | 40,000 | None |
| `intentional-treatbox` | Intentional Treatbox | Thoughtfully combined to feed your body with organic goodness, containing yogurt parfait, bread, juice, and more. | 29,500 | None |
| `mini-treatbox-2` | Mini Treatbox 2 | A satisfying and energizing combination of parfait, traditional hibiscus flower tea, sandwich, and crunchy toppings. | 14,500 | None |
| `mini-treatbox-3` | Mini Treatbox 3 | A wholesome breakfast or high tea box featuring banana breads, fresh juice, and creamy yogurt parfait. | 17,500 | Cold-Pressed Juice: `PING`, `SWEET GREEN`, `BEET THE HEAT` |
| `juicy-treatbox-2` | Juicy Treatbox 2 | A gorgeous pairing curated for sharing, containing juices, fresh parfait, banana bread, and your choice of sandwich. | 23,500 | Sandwich: `Chicken Sandwich`, `Beef Sandwich` |
| `perfecto-treatbox` | Perfecto Treatbox | The complete gourmet package featuring banana bread, chicken sandwich, zobo, PING juice, and a lovely note card. | 24,000 | None |

For the first selection of each configured choice, `TreatBoxCard` initializes the state to that value. The chosen values are sent as `{ name, value }`; no option-specific price modifier is applied.

### `src/pages/FruitHampersPage.tsx` (`HAMPER_PRODUCTS`)

Cards use a decorative hamper placeholder; `handleAdd()` uses `/assets/Screenshot_20260729-213638_1785360173839.jpg` as the cart image. No additional choices/options are offered.

| `productId` | Name | Description | Price |
|---|---|---|---:|
| `deluxe-hamper` | Deluxe Hamper | A premium gift hamper combining fresh fruits, Greek yoghurt, crunchy granola, nuts, treats and thoughtful finishing touches. | 70,000 |
| `exotic-fruit-hamper` | Exotic Fruit Hamper | A colourful fruit-focused hamper filled with carefully selected fruits and presented as a thoughtful gift. | 55,000 |

The long contents lists are static display content; the page does not allow editing hamper contents or selecting variants, and those contents are not serialized as cart options.

### `src/pages/CombosPage.tsx` (`COMBO_PRODUCTS`)

Every combo uses the same branded cart image `/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png`. Choice selections are flat cart options (not nested component products). `requiresSmoothie` / `requiresSandwich` govern whether the customer must select before adding.

| `productId` | Name | Description | Price | Selection represented in cart |
|---|---|---|---:|---|
| `cheesesteak-smoothie` | Cheesesteak + Smoothie | Cheesesteak paired with a 50cl smoothie of your choice. | 16,000 | Required `Smoothie`: `Milk Mix`, `Yoghurt Mix`, `Nutty Chocolate`, `So Creamy`, `Ginger Blast`, `Strawberry`, `Fruity`, `Healthy Green` |
| `cheesesteak-cold-zobo` | Cheesesteak + Cold Zobo | A classic cheesesteak paired with a refreshing cold Zobo drink. | 15,000 | None |
| `tigernut-drink-sandwich` | Tigernut Drink + Sandwich | Creamy Tigernut Drink (50cl) paired with your choice of sandwich. | 8,000 | Required `Sandwich`: `Chicken Sandwich`, `Beef Sandwich` |
| `zobo-drink-sandwich` | Zobo Drink + Sandwich | Traditional hibiscus tea paired with your choice of sandwich. | 5,000 | Required `Sandwich`: `Chicken Sandwich`, `Beef Sandwich` |
| `vvip-parfait-sandwich` | 550ml VVIP Parfait + Sandwich | A premium 550ml VVIP Parfait paired with your choice of sandwich. | 12,900 | Required `Sandwich`: `Chicken Sandwich`, `Beef Sandwich` |
| `cheesesteak-tigernut-drink` | Cheesesteak + Tigernut Drink | Cheesesteak paired with a rich, traditional Tigernut Drink (50cl). | 18,000 | None |
| `cheesesteak-ping-juice` | Cheesesteak + PING Juice | Cheesesteak paired with our signature Pineapple & Ginger (PING) Cold-Pressed Juice (35cl). | 16,000 | None |
| `banana-bread-tigernut-drink` | Whole Wheat Banana Bread + Tigernut Drink | A slice of wholesome Whole Wheat Banana Bread paired with Tigernut Drink. | 7,000 | None |
| `sandwich-ping-juice` | Chicken / Beef Sandwich + PING Juice | Your choice of sandwich paired with refreshing PING Cold-Pressed Juice (35cl). | 6,200 | Required `Sandwich`: `Chicken Sandwich`, `Beef Sandwich` |
| `banana-bread-cold-zobo` | Whole Wheat Banana Bread + Cold Zobo | A slice of wholesome Whole Wheat Banana Bread paired with traditional cold Zobo. | 4,000 | None |
| `greek-yoghurt-sandwich` | 500ml Greek Yoghurt + Sandwich | Rich and creamy Greek Yoghurt (500ml) paired with your choice of sandwich. | 9,000 | Required `Sandwich`: `Chicken Sandwich`, `Beef Sandwich` |

### Homepage-only `addItem()` products (`src/components/FeaturedProducts.tsx`)

`FeaturedProducts` initializes `featuredProducts` to `[]`. It contains a slug-based `renderCardForSlug()` branch, but no code in the file populates that state or calls `getFeaturedProducts()`. As checked in, it renders the hardcoded six-card default list, so the following records are the active homepage cart cards; the slug branch is dormant unless some future code populates the state. Their identifiers and selections are not all the same as the dedicated category page records.

| Cart `productId` | Cart name | Description / contents | Price logic | Options sent |
|---|---|---|---|---|
| `greek-yoghurt` | Greek Yoghurt | Greek yoghurt; card labels it rich in probiotics, gut friendly, and 100% healthy. | 330ml 4,500; 500ml 6,500; 1L 12,000; 2L 23,500; 5L 56,000 | `Size` (those size strings), `Type`: `Sweetened` / `Unsweetened` |
| `sandwich` | Fresh Club Sandwich | Fresh bread layered with protein, egg, vegetables and special creamy sauce. | `Chicken & Egg` 4,000; `Beef & Egg` 4,000; `Egg Sandwich` 3,000 | `Type` (selected sandwich type), `Egg Option`: `Fried` / `Boiled` |
| `banana-bread` | Whole Wheat Banana Bread | Card copy: 100% whole wheat, naturally sweetened with ripe bananas; moist and wholesome. | `Slice` 1,500; `Mini Loaf` 3,500; `Loaf` 6,500 | `Size` (those values), `Add-In`: `Chocolate` / `Raisins` / `Coconut` |
| `treat-box-a` / `treat-box-b` | Treat Box A / Treat Box B | Both contain Healthy Chicken Salad, 500ml Greek Yoghurt, parfait, and loaf of Banana Bread; A has 500ml parfait, B 330ml. | A 15,500; B 13,000 | `Package`: `A` or `B` |
| `smallie-parfait` | Smallie Parfait (Events Cup) | 330ml cup layered with Greek yogurt, fruit and crunchy granola; stated minimum order is 2 cups. | 4,000/cup; quantity starts/resets at 2 | `Category`: `Events & Catering` |
| `vvip-parfait-featured` | VVIP Exotic Parfait Bowl | 1 Litre loaded bowl of fresh kiwi, strawberries, grapes, cashew nuts and thick yogurt. | Fixed 15,000 | `Size`: `1 Litre (Ay Bowl)` |

Images in these cards are `greekYoghurtImg` `/assets/Screenshot_20260729-212331_1785360049844.jpg`, `sandwichImg` `/assets/IMG_1940_sandwich.jpg`, `bananaBreadImg` `/assets/IMG_7131_banana_bread_tray.jpg`, `treatBoxImg` `/assets/Screenshot_20260729-212815_1785360013704.jpg`, `cateringImg` `/assets/Screenshot_20260729-212642_1785360049574.jpg`, and `parfaitImg` `/assets/IMG_1639_parfait_1l.jpg`, respectively.

### Homepage signature cards (`src/components/SignatureParfaits.tsx`)

These overlap the dedicated parfait route, but are a separate hardcoded cart source. `handleAddToCart()` uses `product.slug` as `productId`, computes full price from the selected `sizes` map, and sends `Size` and `Yogurt Type`.

| `productId` | Name | Description | Available displayed sizes/prices |
|---|---|---|---|
| `vvip-exotic-parfait` | VVIP Exotic Parfait | Greek Yogurt, Apple, Coconut, Grapes, Strawberries, Kiwi, Granola, Raisins, Cashew nuts. | `Mini (330ml)` 6,000; `Medium (500ml)` 8,500; `Gbemidele (550ml)` 10,000; `Ay Bowl (1L)` 15,000; `Wonder Bowl (2L)` 29,000 |
| `vip-exotic-parfait` | VIP Exotic Parfait | Greek Yogurt, Apple, Coconut, Grapes, Granola with rolled oats, Raisins, Cashew nuts. | `Mini (330ml)` 5,000; `Medium (500ml)` 8,000; `Gbemidele (550ml)` 9,000; `Ay Bowl (1L)` 13,500 |
| `greek-yogurt` | Probiotic Greek Yogurt | Thick, creamy, protein-packed probiotic Greek yogurt; no artificial additives. | `330ml` 4,500; `500ml` 6,500; `1L` 12,000; `2L` 23,500; `5L` 56,000 |

`SignatureParfaits` offers `Sweetened` and `Unsweetened` for all three. It does not offer the VVIP 5L option that is present on `GreekYogurtParfaitsPage`.

### Catering route cart item (`src/pages/CateringEventsPage.tsx`)

`handleAddParfait()` separately adds `productId: 'smallie-parfait'`, name `Smallie Parfait`, price 4,000, quantity minimum 2, image `/assets/Screenshot_20260729-212242_1785360049881.jpg`, and option `Category: Catering & Events`. The page's catering enquiry form is a separate WhatsApp/database enquiry path, not a priced cart catalogue; its menu-interest list includes Smallie Parfait, Exotic Parfaits, Greek Yoghurt, Smoothies, Cold-Pressed Juices, Sandwiches, Healthy Chicken Salad, Fruit Bowls, Zobo, Tigernut Drink, Whole Wheat Banana Bread, Treat Boxes, and Other.

## 3. Other hardcoded placeholder catalogue

`src/pages/CategoryPlaceholder.tsx` contains a separate `CATEGORY_MAP` with no product IDs, structured option groups, or cart actions. It renders names, descriptions, prices, optional contents/features, and a WhatsApp order link. The application routes the named categories to specific pages before this catch-all, so these are fallback/demo entries rather than the normal routed catalogue. They are nevertheless hardcoded price claims and can be reached for unmatched route paths that correspond to a map key.

| Map category | Hardcoded product name — description — displayed price |
|---|---|
| fruits | Exotic Fruit Salad Bowl — A freshly cut selection of seasonal local and exotic fruits. — ₦3,500; Healthy Chicken Salad — Fresh crisp vegetables, shredded chicken, and healthy light dressing. — ₦4,500; Fresh Fruit Bowl (Gbemidele Size) — Generous serving of nutrient-rich seasonal fruits. — ₦5,500 |
| greek-yogurt-parfaits | Greek Yogurt - Sweetened — Naturally sweetened, creamy probiotic yogurt. — From ₦4,500; Greek Yogurt - Unsweetened — Rich, tart, unsweetened Greek yogurt. Perfect for gut health. — From ₦4,500; VIP Parfait (500ml) — Greek yogurt layered with apple, banana, grapes, coconut, granola, and cashew nuts. — ₦8,000; VVIP Parfait (550ml) — Premium tier parfait with extra toppings including kiwi, strawberries, and rolled oats. — ₦9,000; Smallie Parfait (330ml) — Perfect size for events and quick healthy snacks (Minimum order: 2 cups). — ₦4,500 |
| smoothies | Nutty Choco Smoothie — Rich cocoa, banana, peanut butter, and plant milk blend. — ₦3,500; Avocado Green Smoothie — Creamy avocado, spinach, banana, and apple juice. — ₦4,000; Tropical Sunshine Smoothie — Mango, pineapple, banana, and coconut water. — ₦3,500 |
| cold-pressed-juices | PING Juice (35cl) — Our signature blend of Pineapple and Ginger. Super refreshing. — ₦2,500; Pure Orange Juice — Freshly squeezed premium oranges with no added sugar. — ₦2,500 |
| sandwiches-savoury | Chicken & Egg Sandwich — Premium shredded chicken breast with fried or boiled egg and crisp vegetables. — ₦5,000; Chicken Sandwich — Tasty shredded chicken breast with crisp veggies and special sauce. — ₦3,000; Beef Sandwich — Juicy stir-fried beef slices with crisp veggies and special sauce. — ₦3,000 |
| milk-tea-drinks | Classic Milk Tea — Our signature original milk tea recipe with chewy black tapioca pearls. — ₦9,000; Vanilla Milk Tea — Smooth, fragrant vanilla-infused milk tea with chewy black tapioca pearls. — ₦8,000; Zobo Drink (50cl) — Traditional hibiscus flower tea infused with cloves and ginger. — ₦1,500; Fresh Tiger Nut Drink (50cl) — Raw tiger nut beverage infused with coconut, dates, and ginger. — ₦2,500; Tiger Nut & Coconut Blend (1L) — Thicker, ultra-creamy traditional tiger nut drink. — ₦4,500; Strawberry Cream Milkshake (500ml) — Made with fresh strawberries, healthy dairy, and honey. — ₦4,500; Vanilla Bean Milkshake (500ml) — Classic vanilla bean milkshake topped with crushed nuts. — ₦4,000; Double Chocolate Milkshake (500ml) — Rich dark cocoa milkshake sweetened with dates. — ₦4,500 |
| treat-boxes | Deluxe Treatbox — The ultimate healthy feast box. — ₦35,000; Intentional Treatbox — Perfect balance of protein and sweetness. — ₦29,500; Mini Treatbox 2 — Quick healthy picnic box. — ₦14,500; Mini Treatbox 3 — Great for breakfast or high tea. — ₦17,500; Juicy Treatbox 2 — Curated for two to share. — ₦23,500; Perfecto Treatbox — Complete gift set with a custom note card. — ₦24,000. Each also has a separate static `features`/contents list in `CATEGORY_MAP`. |
| fruit-hampers | Deluxe Hamper — The ultimate luxury fruit and wellness gift. — ₦70,000; Exotic Fruit Hamper — Vibrant, handpicked fresh fruit basket. — ₦55,000. Each also has static contents/features. |
| combos | Sandwich & Smoothie Combo — A freshly prepared Chicken or Beef Sandwich paired with any regular smoothie of your choice. — ₦6,000; Parfait & Salad Combo — A 500ml Exotic Parfait coupled with our signature Healthy Chicken Salad Bowl. — ₦12,500; Fruit Bowl & Greek Yogurt Combo — An Exotic Fruit Salad Bowl combined with a 500ml sweetened or unsweetened Greek Yogurt. — ₦7,500 |
| catering-events | Corporate Brunch Package — Assorted finger-sandwiches, fresh fruit cups, and mini yogurt parfaits (Serves 10-15). — ₦50,000; Celebration Dessert Table — Premium fruit salad carvings, assorted parfaits, and whole wheat banana bread loaves (Serves 25-30). — ₦120,000; Deluxe Event Catering Service — Fully staffed on-site custom smoothie bar and freshly made parfait cups for weddings or major events. — ₦250,000 |

These prices and product names do not establish current availability or database records.

## 4. Database compatibility and admin model

### Schema declared in repository SQL

`supabase/sql/1_extensions_tables.sql` defines:

- `public.categories`: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`, unique non-null `slug`, non-null `name`, `description TEXT DEFAULT ''`, nullable `image_url`, `display_order INT NOT NULL DEFAULT 0`, `is_active BOOLEAN NOT NULL DEFAULT true`, and created/updated timestamps.
- `public.products`: UUID primary key; nullable `category_id` foreign-key to categories with `ON DELETE SET NULL`; non-null `name` and unique non-null `slug`; description default empty; nullable ingredients; `base_price NUMERIC(12,2) NOT NULL DEFAULT 0`; nullable `image_url`; `product_type` constrained to `standard`, `quote-only`, `enquiry-only`, or `bundle`; `is_available`, `is_featured`, nullable `featured_order`, `display_order`; and non-null `options JSONB DEFAULT '[]'`.
- The product schema has no relational variant/choice tables and no SQL constraint enforcing a JSON option schema. Option names, values, and modifiers live in JSONB.
- `supabase/sql/3_row_level_security.sql` permits public reads of products, but public category reads only where `is_active = true` (or admin); admin policies permit category/product management.
- `supabase/sql/5_seed_data.sql` seeds the ten category slugs and an initial, partial product set. It includes VVIP/VIP parfaits, Greek Yogurt, Custom Exotic Parfait (`quote-only`), sandwich and cheesesteak records, Whole Wheat Banana Bread, four smoothies, three milk teas plus two other drinks, two treat boxes, and Smallie Parfait. It does **not** seed the full page-local catalogue shown above (for example all combos, hampers, juice varieties, fruit products, and several smoothie/milk-tea variants are absent from this seed file).

`src/types/domain.ts` mirrors these records with `Category`, `Product`, `ProductOption`, and `ProductOptionChoice`. Category slugs are a TypeScript union of the ten identifiers. `ProductOptionChoice.price_modifier` is optional; its documented meaning is additive to base price.

### How order lookup, option checking, and price calculation work

`src/services/order.service.ts` calls `supabase.rpc('create_authoritative_order', { p_payload })` in `orderService.createOrder()`. It sends `product_id` as the cart's `productId`, quantity, and `selected_options`; it does not send the UI's product slug separately or translate client IDs to database IDs.

`supabase/sql/2_constraints_functions_triggers.sql`, `public.create_authoritative_order(p_payload)`:

1. Treats UUID-shaped `product_id` values as product UUIDs; all other values are looked up as exact `products.slug`.
2. Rejects a missing product and rejects `is_available = false`.
3. Validates quantity as an integer from 1 through 100.
4. Starts unit price at the database row's `base_price`. For each supplied selected option it requires an exact option `name` and exact choice `value` in that product's `options` JSONB. A missing/invalid group or choice raises an exception. Each matching choice's numeric `price_modifier` is summed.
5. Computes server unit price as `base_price + sum(price_modifier)`, then line total as unit price times quantity and subtotal as the sum of line totals. The client-submitted `price`, `line_total`, and subtotal are not authoritative.
6. Revalidates options and recomputes amounts when inserting `order_items`, snapshots database `product_id`, database product name, recomputed unit price, quantity, and `selected_options`.
7. Looks up delivery fee in `delivery_zones` and validates/applies coupon through `validate_and_apply_coupon`; final total is subtotal plus server delivery fee minus discount, floored at zero.

Only the supplied option selections are checked: this function does not require every configured option group to be present. Conversely, a UI selection that is not configured under the exact option name/value in the matched database product is rejected. The function shown checks product availability but does not enforce `product_type` (for example, it does not itself prevent an available `quote-only` item from being submitted as a cart line).

`src/context/CartContext.tsx` creates the cart row `id` as `${productId}-${sorted name:value option pairs}`; without options the suffix is `no-opts`. That cart `id` is a local uniqueness key, **not** the database product ID. `CheckoutModal` sends `item.productId` to `orderService`, and cart unit prices drive the client subtotal/preview before the server RPC returns authoritative totals. `orderService.createOrder()` updates order totals from RPC output but the frontend still has independent item snapshots assembled from the cart.

### Existing admin editing

`AdminDashboardPage.handleSaveProduct()` and the product form can edit/set: category assignment, name, slug, description, ingredients, base price, image URL, product type, availability, featured status/order, display order, and JSON product option groups/choices/price modifiers. `ProductOptionsBuilder` supports adding/removing groups and choices, editing names/values/modifiers, and quick presets for size, yogurt type, flavours, and toppings. `ImageUpload` uploads product/category images. Availability and featured status have separate toggle handlers.

Admin edits are useful for the database-backed model but do not update literals in the page components, `CategorySection`, `Navbar`, `FeaturedProducts`' custom card implementations, `SignatureParfaits`, `CombosPage`, or the other hardcoded pages. `FeaturedProducts` has no call that loads its featured-product state, so the admin's featured flag/order does not currently select or reorder those static cards. Updating database rows alone therefore does not reconcile these page-local prices, IDs, labels, or choice sets. The category form's active-status field is saved, but the hardcoded storefront surfaces do not consume it.

### Verified hardcoded/database mismatches with order impact

These are source-to-source differences; whether the same records exist in the deployed database is unresolved.

- **Cart IDs must resolve to a DB row or exact slug.** `ping`, `sweet-green`, `beet-the-heat`, all `*-hamper` IDs, all combo IDs, several smoothie/milk-tea IDs, and most Treat Box IDs have no corresponding row in the checked-in seed SQL. `checkAvailability()` defaults unknown IDs to available, so absence may not be surfaced until the authoritative order RPC rejects the product.
- **Fallback category IDs are not UUIDs.** `DEFAULT_CATEGORIES` uses string IDs `'1'`–`'10'` while the SQL category key is UUID. If admin category loading falls back while connected to Supabase, a product form can inherit/select a non-UUID category ID; this would not be a valid `products.category_id` value if saved.
- **Greek yoghurt feature card:** sends `greek-yoghurt` (database seed slug is `greek-yogurt`) and option name `Type` (database option name is `Yogurt Type`). Both identifier and option mismatch the seed.
- **Featured sandwich:** sends `productId: 'sandwich'` with options `Type` and `Egg Option`; seed records use product slugs such as `chicken-sandwich` / `chicken-egg-sandwich`, and the seeded chicken-egg option is `Egg Preparation`.
- **Featured banana bread:** sends `productId: 'banana-bread'`, has a selectable `Size` option and sends `Add-In`; seed slug is `whole-wheat-banana-bread`, it has only `Add-in` (case-sensitive mismatch), and the seed option set has no Size group.
- **Featured Treat Box A/B:** sends `treat-box-a` / `treat-box-b` with `Package`; no matching product/option records are present in the seed.
- **Smallie Parfait:** both `FeaturedProducts.CateringCard` and `CateringEventsPage.handleAddParfait()` send `Category: Events & Catering`. The seeded `smallie-parfait` has `options: []`; the RPC rejects the supplied option name. The page calls also use quantity >=2, which is within the RPC maximum.
- **Featured VVIP bowl:** sends `vvip-parfait-featured` and Size value `1 Litre (Ay Bowl)`; the seed slug is `vvip-exotic-parfait` and its size choice is `Ay Bowl (1L)`.
- **Cheesesteak:** the product page sends choices `Small` and `Medium`, whereas the seed option allows `Medium` and `Large`. The `Small` choice is rejected; the Medium label is valid but the page interprets it as +4,000 while the seed treats Medium as the base-price choice.
- **Smoothie So Creamy:** page 50cl modifier is +2,500; seed modifier is +2,000.
- **Tigernut Drink:** page base is 2,500 and its 50cl modifier is +2,500; seed base is 1,200 and 50cl modifier +1,300. Thus the client shows 2,500/5,000 while the seeded server calculation is 1,200/2,500 for 25cl/50cl.
- **The three juice products, salad/fruit products, non-seeded smoothie and milk-tea variants, combos, and hampers** have no matching records in the inspected seed SQL. A separate deployed/admin-created record could change that conclusion; no live DB was queried.
- **Pricing model differences:** selected page-level prices are often hardcoded full prices, while database options represent base plus deltas. Any difference between the page calculation and database `base_price`/`price_modifier` is overridden at order creation, which can make the checkout total differ from the price shown/cart subtotal or fail if options do not validate.
- **Cart identity:** same conceptual item can appear under different product IDs or option names across home/page sources; since cart de-duplication uses productId and selections, they can create separate cart rows and serialize incompatible identifiers/options.

## 5. Special selection logic

- **Treat Box sizes/choices:** despite the phrase “sizes” in the page-specific request, `TreatBoxesPage` offers two non-priced choices only: cold-pressed juice for Mini Treatbox 3 and sandwich for Juicy Treatbox 2. The selected value is appended as one `{name,value}` cart option; the box remains a single fixed-price line with static contents. Featured `Treat Box A/B` is a different, separate implementation with a `Package` choice, distinct product IDs and different prices.
- **Fruit hampers:** no customer choice logic exists. The two hamper products are fixed-price, contents are descriptive text only, and no contents/options are sent to cart.
- **Parfait size and yogurt selection:** `GreekYogurtParfaitsPage` and `SignatureParfaits` compute a full price from local size maps and send size/yogurt type options. The Custom Exotic Parfait model also exists in the SQL seed as `quote-only` at base price 0 with no product options; `CustomParfaitQuote` in `src/types/domain.ts` records size, size label, yogurt type, fruit array, toppings array, and quantity. `enquiryService.submitCustomParfaitQuote()` and `whatsAppService.buildCustomParfaitMessage()` exist, but repository search found no UI caller/builder for them. **Unresolved:** confirm whether a custom parfait builder is intended to be active in another deployment or is currently absent.
- **Combo smoothie/sandwich selections:** `CombosPage.ComboCard` requires a selection for the products flagged `requiresSmoothie` or `requiresSandwich`, then serializes it as `{ name: 'Smoothie' | 'Sandwich', value: selected label }`. It does not add the selected smoothie/sandwich as a second product line; the combo's fixed price is the cart unit price.
- **Other page-level variants:** `ProductCard` serializes each selected option group as `{name,value}` and includes option price modifiers in client unit price. Juice cards attach `Size: 35cl` despite having no interactive size selector. Treat box/hampers/combo cards use generic placeholder/cart images; contents aren't product relationships or child order items.
- **Catering minimum:** `CateringEventsPage` and featured Smallie card initialize/reset quantity to 2, but server order validation only imposes 1–100 and does not encode that two-item minimum. Product option schema also does not encode a minimum.
- **Parfait special-card duplication:** `FeaturedProducts` has a fixed VVIP Ay Bowl card priced 15,000 and a separate dedicated route card for VVIP 1L; these share the product concept but use different `productId` / option value representations.

## 6. Fallback catalogue behavior

`src/services/product.service.ts` exports `productService` and privately defines:

- **`DEFAULT_CATEGORIES`**: ten static category rows (string IDs `'1'` through `'10'`, slug/name/description/image/display order, all `is_active: true`). Their fields and seed counterparts are itemized in the category table above.
- **`DEFAULT_PRODUCTS`**: six static product rows; all have `is_available: true`. IDs and slugs are the same strings in this fallback. Entries 1–5 are `standard`, except Juicy Treatbox is `bundle`.
  - `vvip-exotic-parfait`, category id `'1'`, VVIP Exotic Parfait. Description: “Our luxurious signature creation layered with fresh Greek yogurt, rich fruits, cashew nuts, and crunchy granola.” Ingredients: Greek Yogurt, Apple, Coconut, Grapes, Strawberries, Kiwi, Granola with rolled oats, Raisins, Cashew nuts. Base 8,500; featured/order rank 1; image `/assets/IMG_8455_parfait_bowls.jpg`; `Yogurt Type` Sweetened/Unsweetened; Size `Mini (330ml)` −2,500, `Medium (500ml)` 0, `Gbemidele (550ml)` +1,500, `Ay Bowl (1L)` +6,500, `Wonder Bowl (2L)` +20,500, `Twa Bowl (5L)` +56,500.
  - `vip-exotic-parfait`, category id `'1'`, VIP Exotic Parfait. Description: “The beloved classic parfait with sweet apples, coconut, crunchy cashew nuts, and probiotic yogurt.” Ingredients: Greek Yogurt, Apple, Coconut, Grapes, Granola with rolled oats, Raisins, Cashew nuts. Base 8,000; featured/order rank 2; image `/assets/IMG_6519_parfait_500ml.jpg`; same yogurt choices; Size `Mini (330ml)` −3,000, `Medium (500ml)` 0, `Gbemidele (550ml)` +1,000, `Ay Bowl (1L)` +5,500.
  - `greek-yogurt`, category id `'1'`, Greek Yogurt. Description: “100% thick, creamy probiotic Greek yogurt. Rich in active cultures and pure wholesome goodness.” Ingredients: Probiotic Greek Yogurt. Base 6,500; featured/order rank 3; image `/assets/Screenshot_20260729-212331_1785360049844.jpg`; `Yogurt Type` Sweetened/Unsweetened; Size `330ml` −2,000, `500ml` 0, `1L` +5,500, `2L` +17,000, `5L` +49,500.
  - `chicken-sandwich`, category id `'3'`, Chicken Sandwich. Description: “3 toasted slices of bread, crunchy cabbage, shredded carrot, in-house cream and seasoned shredded chicken.” Ingredients: Bread, Chicken, Cabbage, Carrot, In-house Cream. Base 3,000; featured/order rank 4; image `/assets/IMG_1940_sandwich.jpg`; no options.
  - `whole-wheat-banana-bread`, category id `'3'`, Whole Wheat Banana Bread. Description: “Freshly baked moist, wholesome whole wheat banana bread packed with your choice of rich add-ins.” Ingredients: Whole Wheat Flour, Ripe Banana, Butter, Brown Sugar, Eggs. Base 4,500; featured/order rank 5; image `/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png`; `Add-in` Chocolate/Raisins/Coconut, no price modifiers.
  - `juicy-treatbox`, category id `'7'`, Juicy Treatbox. Description: “A luscious collection featuring our signature ginger-pineapple juice, fresh parfait, tigernut milk, banana bread, and sandwich pack.” Ingredients field: Juice, Parfait, Tigernut Drink, Banana Bread, Sandwich. Base 23,500; featured/order rank 6; image `/assets/Screenshot_20260729-212815_1785360049844.jpg`; no options.

`getCategories()` returns DB rows if its query succeeds with at least one row, otherwise `DEFAULT_CATEGORIES`. `getProductsByCategory()` looks up a category by slug and returns DB products only when the product query succeeds with at least one row; otherwise it filters the six fallback products by fallback category ID. `getProductById()` falls back by matching id or slug. `getFeaturedProducts()` falls back to the featured subset of `DEFAULT_PRODUCTS` when the database result is missing/empty. `checkAvailability()` merges database `id` and `slug` states, then uses fallback product availability; an ID unknown to both defaults to `true`.

The fallback therefore can show stale names, prices, options, images, and availability when Supabase is unconfigured, a query fails, or the relevant query yields no rows. It is not a “database empty only” fallback for every method: query errors also lead to static values. In contrast, the directly routed hardcoded product pages do not call these product-query methods and continue rendering their own local data. The admin's `loadData()` also falls back to featured products only if its Supabase product list is empty, not to a complete admin catalogue.

## 7. Final summary

### Hardcoded categories and products

- **Categories:** Fresh Fruits & Healthy Snacks (`fruits`), Greek Yogurt & Parfaits (`greek-yogurt-parfaits`), Smoothies (`smoothies`), Cold-Pressed Juices (`cold-pressed-juices`), Sandwiches & Savoury (`sandwiches-savoury`), Milk Tea & Drinks (`milk-tea-drinks`), Treat Boxes (`treat-boxes`), Fruit Hampers (`fruit-hampers`), Combos (`combos`), Catering & Events (`catering-events`). Home sequence and metadata differ from fallback/seed order and sources, as detailed above.
- **Page-local products:** Smoothies (8); Sandwiches & Savoury (5); Milk Tea & Drinks (8); Fresh Fruits & Healthy Snacks (5); Cold-Pressed Juices (3); Greek Yogurt & Parfaits (3); Treat Boxes (9); Fruit Hampers (2); Combos (11); plus independent homepage cards for Greek Yoghurt, Fresh Club Sandwich, Whole Wheat Banana Bread, Treat Box A/B, Smallie Parfait, and VVIP Exotic Parfait Bowl. Separate homepage signature parfait cards repeat VVIP, VIP, and Greek Yogurt.
- **Other hardcoded catalogue content:** `CategoryPlaceholder.CATEGORY_MAP` has additional, non-cart WhatsApp placeholder products under the ten categories, enumerated above. It is distinct from live page-local cart products and from SQL seed rows.

### Existing database/admin capabilities that can be reused

- Categories support name/slug/description/image/display order/active-state editing, plus activation and deletion, through `AdminDashboardPage`.
- Products support category, slug, descriptive fields, base price, image, product type, availability, featured/display order, and configurable options/choice modifiers through `handleSaveProduct` and `ProductOptionsBuilder`.
- SQL already defines unique category/product slugs, product-category foreign key, JSONB options, product availability/type, public product reads, active-category RLS, and admin management policies.
- The order RPC already resolves products by UUID or slug and authoritatively validates product availability, quantity, submitted option/choice names and values, price modifiers, delivery fee, coupon, and final total.

### Potential checkout/cart compatibility risks

- Page-local client IDs must match a database UUID or exact product slug; there is no slug normalization/translation at checkout.
- Several currently seeded products/choices do not cover the hardcoded page catalogue, and selected option names and values are matched case-sensitively by the RPC.
- Incompatible hardcoded IDs/options produce an order-creation error; compatible IDs with differing client/server price configuration can produce an authoritative amount different from the amount displayed in the cart.
- Availability checks default unknown client IDs to available, so missing product records may not be caught until `create_authoritative_order`.
- A local cart persists `productId` and options in browser storage; catalogue changes can leave old selections in saved carts which are then validated against current DB options.
- Treat box contents, combo components, hamper contents, and catering selections are descriptive/local data, not normalized child line items or database variant relationships.
- Category admin active state/name/slug/image changes do not reconfigure the hardcoded navigation/category cards or product routes.
- The seeded Smallie Parfait has no options, while both cart entry points add a `Category` option, which the RPC rejects against that seeded row.

### Unresolved before any SQL generation

1. What is the actual deployed Supabase schema and the live product/category rows (IDs, slugs, prices, options, active/available state)? The repo SQL is not deployed-state evidence.
2. Which catalogue source is the business-authoritative one for each item: current routed pages, `DEFAULT_PRODUCTS`, `CategoryPlaceholder`, existing seed SQL, or admin-created records?
3. Confirm intended product IDs/slugs for hardcoded items, especially juice, fruits, combos, hampers, Treat Boxes, `greek-yoghurt`, `sandwich`, `banana-bread`, `smallie-parfait`, and `vvip-parfait-featured`.
4. Confirm authoritative sizes, names, choice values, option-group names, descriptions, images, prices, and modifier basis across the duplicated Greek Yogurt/parfait and category sources.
5. Confirm whether Combo selections should remain labels on one fixed-price product or become separate related products, and whether the base combo price includes all selected variants.
6. Confirm whether Treat Box/hamper contents are fixed or selectable, whether those contents need order-line representation, and exact box/hamper variants/prices.
7. Confirm whether Smallie Parfait has a minimum quantity of two at checkout, and whether its `Category` option is intended or should be absent/configured.
8. Confirm whether the custom parfait quote builder should exist in the storefront. Schema/types/services support quote data, but no active builder UI caller was found in the inspected application.
9. Confirm whether inactive categories should disappear from home navigation and whether admin category edits are expected to update storefront routes/content.
10. Confirm whether `CategoryPlaceholder` listings/prices are obsolete content to exclude from a canonical catalogue, rather than another source to migrate.

No SQL was generated or executed. No application source, existing SQL, database data, checkout behavior, or configuration was changed for this inventory.
