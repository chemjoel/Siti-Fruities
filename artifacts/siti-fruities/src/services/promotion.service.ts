/**
 * SITI FRUITIES — Promotion Service Implementation
 *
 * Fetches active promotional banners for the homepage.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { IPromotionService } from '@/types/services';
import type { Promotion } from '@/types/domain';

const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Fresh Parfait Day Special',
    description: 'Experience our signature VVIP & VIP Exotic Parfaits made with fresh probiotic Greek yogurt, crisp fruit layers & crunchy nut toppings.',
    flyer_url: '/assets/IMG_8455_parfait_bowls.jpg',
    cta_label: 'Order Signature Parfait',
    cta_link: '/greek-yogurt-parfaits',
    is_active: true,
    display_order: 1,
    starts_at: null,
    ends_at: null,
    created_at: new Date().toISOString(),
  },
];

export const promotionService: IPromotionService = {
  async getActivePromotions(): Promise<Promotion[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from<Promotion>('promotions')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const now = new Date();
        return data.filter((p) => {
          if (p.starts_at && new Date(p.starts_at) > now) return false;
          if (p.ends_at && new Date(p.ends_at) < now) return false;
          return true;
        });
      }
    }
    return DEFAULT_PROMOTIONS;
  },
};
