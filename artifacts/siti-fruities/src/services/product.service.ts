/**
 * SITI FRUITIES — Product Service Implementation
 *
 * Fetches categories and products from Supabase.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { IProductService } from '@/types/services';
import type { Product, Category } from '@/types/domain';

export const productService: IProductService = {
  async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

    const { data, error } = await supabase
      .from<Category[]>('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

    const { data: category, error: categoryError } = await supabase
      .from<Category>('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (categoryError) throw new Error(categoryError.message);
    if (!category) return [];

    const { data, error } = await supabase
      .from<Product[]>('products')
      .select('*')
      .eq('category_id', category.id)
      .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getProductById(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

    const { data, error } = await supabase
      .from<Product>('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

    const { data, error } = await supabase
      .from<Product[]>('products')
      .select('*')
      .eq('is_featured', true)
      .order('featured_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async checkAvailability(productIds: string[]): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};

    if (isSupabaseConfigured() && productIds.length > 0) {
      try {
        const { data, error } = await supabase
          .from<{ id: string; slug: string; is_available: boolean }[]>('products')
          .select('id, slug, is_available');

        if (!error && data) {
          data.forEach((p) => {
            result[p.id] = p.is_available;
            result[p.slug] = p.is_available;
          });
        }
      } catch (error) {
        console.error('Failed to check product availability:', error);
      }
    }

    // Unknown availability remains permissive; order creation revalidates it.
    productIds.forEach((id) => {
      if (result[id] === undefined) {
        result[id] = true;
      }
    });

    return result;
  },
};
