/**
 * SITI FRUITIES — Delivery Service Implementation
 *
 * Provides zone-based delivery fees from Supabase or fallback configuration.
 * (No hardcoded global free-delivery threshold).
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { IDeliveryService } from '@/types/services';
import type { DeliveryZone } from '@/types/domain';

const DEFAULT_ZONES: DeliveryZone[] = [
  { id: 'zone-1', name: 'OAU Campus (Hostels & Staff Quarters)', delivery_fee: 1000, display_order: 1 },
  { id: 'zone-2', name: 'Mayfair / Ibadan Road', delivery_fee: 1200, display_order: 2 },
  { id: 'zone-3', name: 'Lagere / Commercial Area', delivery_fee: 1500, display_order: 3 },
  { id: 'zone-4', name: 'Ede Road / Parakin', delivery_fee: 1800, display_order: 4 },
  { id: 'zone-5', name: 'Modakeke Area', delivery_fee: 2000, display_order: 5 },
  { id: 'zone-6', name: 'Store Pickup (Ile-Ife Store)', delivery_fee: 0, display_order: 6 },
];

export const deliveryService: IDeliveryService = {
  async getDeliveryZones(): Promise<DeliveryZone[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from<DeliveryZone>('delivery_zones')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
    return DEFAULT_ZONES;
  },
};
