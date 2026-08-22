/**
 * SITI FRUITIES — Product Service Implementation
 *
 * Fetches categories and products from Supabase with automatic fallback to
 * local catalogue data if Supabase is not yet configured.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { IProductService } from '@/types/services';
import type { Product, Category } from '@/types/domain';

// Default static fallback categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', slug: 'greek-yogurt-parfaits', name: 'Greek Yogurt & Parfaits', description: 'Our signature probiotic Greek yogurt and fruit-loaded exotic parfaits.', image_url: '/assets/IMG_8455_parfait_bowls.jpg', display_order: 1, is_active: true },
  { id: '2', slug: 'smoothies', name: 'Smoothies', description: 'Rich, thick and 100% natural fruit blends.', image_url: '/assets/Screenshot_20260729-212748_1785360049844.jpg', display_order: 2, is_active: true },
  { id: '3', slug: 'sandwiches-savoury', name: 'Sandwiches & Savoury', description: 'Fresh toasted sandwiches and mouth-watering cheesesteaks.', image_url: '/assets/IMG_1940_sandwich.jpg', display_order: 3, is_active: true },
  { id: '4', slug: 'milk-tea-drinks', name: 'Milk Tea & Drinks', description: 'Boba bubble teas, zobo infusions, and creamy tigernut drinks.', image_url: '/assets/IMG_2326_bubble_tea.jpg', display_order: 4, is_active: true },
  { id: '5', slug: 'cold-pressed-juices', name: 'Cold-Pressed Juices', description: 'Raw, unpasteurised 100% natural cold-pressed fruit juices.', image_url: '/assets/Screenshot_20260729-212547_1785360049844.jpg', display_order: 5, is_active: true },
  { id: '6', slug: 'fruits', name: 'Fresh Fruit Bowls & Salads', description: 'Crisp fresh handpicked fruits and tossed chicken salads.', image_url: '/assets/Screenshot_20260729-212635_1785360049844.jpg', display_order: 6, is_active: true },
  { id: '7', slug: 'treat-boxes', name: 'Treat Boxes', description: 'Carefully curated gift boxes packed with parfaits, juices & snacks.', image_url: '/assets/Screenshot_20260729-212815_1785360049844.jpg', display_order: 7, is_active: true },
  { id: '8', slug: 'combos', name: 'Combos', description: 'Value-packed meal pairings of sandwiches, cheesesteaks and drinks.', image_url: '/assets/IMG_1940_sandwich.jpg', display_order: 8, is_active: true },
  { id: '9', slug: 'fruit-hampers', name: 'Fruit Hampers', description: 'Luxury celebratory gift hampers for birthdays, events and holidays.', image_url: '/assets/Screenshot_20260729-213638_1785360049844.jpg', display_order: 9, is_active: true },
  { id: '10', slug: 'catering-events', name: 'Catering & Events', description: 'Bespoke high-volume catering packages for weddings, meetings & high tea.', image_url: '/assets/Screenshot_20260729-212242_1785360049881.jpg', display_order: 10, is_active: true },
];

// Default static fallback products
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'vvip-exotic-parfait',
    category_id: '1',
    name: 'VVIP Exotic Parfait',
    slug: 'vvip-exotic-parfait',
    description: 'Our luxurious signature creation layered with fresh Greek yogurt, rich fruits, cashew nuts, and crunchy granola.',
    ingredients: 'Greek Yogurt, Apple, Coconut, Grapes, Strawberries, Kiwi, Granola with rolled oats, Raisins, Cashew nuts',
    base_price: 8500,
    image_url: '/assets/IMG_8455_parfait_bowls.jpg',
    product_type: 'standard',
    is_available: true,
    is_featured: true,
    featured_order: 1,
    display_order: 1,
    options: [
      { name: 'Yogurt Type', choices: [{ value: 'Sweetened' }, { value: 'Unsweetened' }] },
      {
        name: 'Size',
        choices: [
          { value: 'Mini (330ml)', price_modifier: -2500 },
          { value: 'Medium (500ml)' },
          { value: 'Gbemidele (550ml)', price_modifier: 1500 },
          { value: 'Ay Bowl (1L)', price_modifier: 6500 },
          { value: 'Wonder Bowl (2L)', price_modifier: 20500 },
          { value: 'Twa Bowl (5L)', price_modifier: 56500 },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'vip-exotic-parfait',
    category_id: '1',
    name: 'VIP Exotic Parfait',
    slug: 'vip-exotic-parfait',
    description: 'The beloved classic parfait with sweet apples, coconut, crunchy cashew nuts, and probiotic yogurt.',
    ingredients: 'Greek Yogurt, Apple, Coconut, Grapes, Granola with rolled oats, Raisins, Cashew nuts',
    base_price: 8000,
    image_url: '/assets/IMG_6519_parfait_500ml.jpg',
    product_type: 'standard',
    is_available: true,
    is_featured: true,
    featured_order: 2,
    display_order: 2,
    options: [
      { name: 'Yogurt Type', choices: [{ value: 'Sweetened' }, { value: 'Unsweetened' }] },
      {
        name: 'Size',
        choices: [
          { value: 'Mini (330ml)', price_modifier: -3000 },
          { value: 'Medium (500ml)' },
          { value: 'Gbemidele (550ml)', price_modifier: 1000 },
          { value: 'Ay Bowl (1L)', price_modifier: 5500 },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'greek-yogurt',
    category_id: '1',
    name: 'Greek Yogurt',
    slug: 'greek-yogurt',
    description: '100% thick, creamy probiotic Greek yogurt. Rich in active cultures and pure wholesome goodness.',
    ingredients: 'Probiotic Greek Yogurt',
    base_price: 6500,
    image_url: '/assets/Screenshot_20260729-212331_1785360049844.jpg',
    product_type: 'standard',
    is_available: true,
    is_featured: true,
    featured_order: 3,
    display_order: 3,
    options: [
      { name: 'Yogurt Type', choices: [{ value: 'Sweetened' }, { value: 'Unsweetened' }] },
      {
        name: 'Size',
        choices: [
          { value: '330ml', price_modifier: -2000 },
          { value: '500ml' },
          { value: '1L', price_modifier: 5500 },
          { value: '2L', price_modifier: 17000 },
          { value: '5L', price_modifier: 49500 },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'chicken-sandwich',
    category_id: '3',
    name: 'Chicken Sandwich',
    slug: 'chicken-sandwich',
    description: '3 toasted slices of bread, crunchy cabbage, shredded carrot, in-house cream and seasoned shredded chicken.',
    ingredients: 'Bread, Chicken, Cabbage, Carrot, In-house Cream',
    base_price: 3000,
    image_url: '/assets/IMG_1940_sandwich.jpg',
    product_type: 'standard',
    is_available: true,
    is_featured: true,
    featured_order: 4,
    display_order: 1,
    options: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'whole-wheat-banana-bread',
    category_id: '3',
    name: 'Whole Wheat Banana Bread',
    slug: 'whole-wheat-banana-bread',
    description: 'Freshly baked moist, wholesome whole wheat banana bread packed with your choice of rich add-ins.',
    ingredients: 'Whole Wheat Flour, Ripe Banana, Butter, Brown Sugar, Eggs',
    base_price: 4500,
    image_url: '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
    product_type: 'standard',
    is_available: true,
    is_featured: true,
    featured_order: 5,
    display_order: 5,
    options: [
      { name: 'Add-in', choices: [{ value: 'Chocolate' }, { value: 'Raisins' }, { value: 'Coconut' }] },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'juicy-treatbox',
    category_id: '7',
    name: 'Juicy Treatbox',
    slug: 'juicy-treatbox',
    description: 'A luscious collection featuring our signature ginger-pineapple juice, fresh parfait, tigernut milk, banana bread, and sandwich pack.',
    ingredients: 'Juice, Parfait, Tigernut Drink, Banana Bread, Sandwich',
    base_price: 23500,
    image_url: '/assets/Screenshot_20260729-212815_1785360049844.jpg',
    product_type: 'bundle',
    is_available: true,
    is_featured: true,
    featured_order: 6,
    display_order: 1,
    options: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const productService: IProductService = {
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from<Category>('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
    return DEFAULT_CATEGORIES;
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    if (isSupabaseConfigured()) {
      // Find category first
      const { data: cat } = await supabase
        .from<Category>('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (cat) {
        const { data, error } = await supabase
          .from<Product>('products')
          .select('*')
          .eq('category_id', cat.id)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      }
    }

    const cat = DEFAULT_CATEGORIES.find((c) => c.slug === categorySlug);
    if (!cat) return [];
    return DEFAULT_PRODUCTS.filter((p) => p.category_id === cat.id);
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from<Product>('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) return data;
    }
    return DEFAULT_PRODUCTS.find((p) => p.id === id || p.slug === id) || null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from<Product>('products')
        .select('*')
        .eq('is_featured', true)
        .order('featured_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
    return DEFAULT_PRODUCTS.filter((p) => p.is_featured).sort((a, b) => (a.featured_order || 99) - (b.featured_order || 99));
  },

  async checkAvailability(productIds: string[]): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};

    if (isSupabaseConfigured() && productIds.length > 0) {
      const { data, error } = await supabase
        .from<{ id: string; slug: string; is_available: boolean }>('products')
        .select('id, slug, is_available');

      if (!error && data) {
        data.forEach((p) => {
          result[p.id] = p.is_available;
          result[p.slug] = p.is_available;
        });
      }
    }

    // Default to true for any item not explicitly found false
    productIds.forEach((id) => {
      if (result[id] === undefined) {
        const found = DEFAULT_PRODUCTS.find((p) => p.id === id || p.slug === id);
        result[id] = found ? found.is_available : true;
      }
    });

    return result;
  },
};
