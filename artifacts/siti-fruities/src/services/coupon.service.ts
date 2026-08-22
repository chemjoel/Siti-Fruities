/**
 * SITI FRUITIES — Coupon Service Implementation
 *
 * Validates coupons server-side via Supabase RPC or local fallback rules.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { ICouponService } from '@/types/services';
import type { Coupon } from '@/types/domain';

export const couponService: ICouponService = {
  async validateCoupon(code: string, orderSubtotal: number): Promise<Coupon | null> {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return null;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.rpc('validate_and_apply_coupon', {
        p_code: trimmed,
        p_subtotal: orderSubtotal,
      });

      if (!error && data && data.is_valid) {
        return {
          id: data.coupon_id,
          code: data.coupon_code,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          is_active: true,
          expires_at: null,
          minimum_order_amount: null,
          usage_limit: null,
          used_count: 0,
          created_at: new Date().toISOString(),
        };
      }
      return null;
    }

    // Local fallback validation
    if (trimmed === 'SITI10') {
      if (orderSubtotal < 5000) return null;
      return {
        id: 'coupon-siti10',
        code: 'SITI10',
        discount_type: 'percentage',
        discount_value: 10,
        is_active: true,
        expires_at: null,
        minimum_order_amount: 5000,
        usage_limit: 500,
        used_count: 0,
        created_at: new Date().toISOString(),
      };
    }

    if (trimmed === 'WELCOME500') {
      if (orderSubtotal < 3000) return null;
      return {
        id: 'coupon-welcome500',
        code: 'WELCOME500',
        discount_type: 'fixed_amount',
        discount_value: 500,
        is_active: true,
        expires_at: null,
        minimum_order_amount: 3000,
        usage_limit: 1000,
        used_count: 0,
        created_at: new Date().toISOString(),
      };
    }

    if (trimmed === 'VIPFRESH') {
      if (orderSubtotal < 10000) return null;
      return {
        id: 'coupon-vipfresh',
        code: 'VIPFRESH',
        discount_type: 'percentage',
        discount_value: 15,
        is_active: true,
        expires_at: null,
        minimum_order_amount: 10000,
        usage_limit: 200,
        used_count: 0,
        created_at: new Date().toISOString(),
      };
    }

    return null;
  },
};
