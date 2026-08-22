/**
 * SITI FRUITIES — Enquiry Service Implementation
 *
 * Stores Catering & Events enquiries and Custom Parfait quote requests
 * for administrator review in the Admin Dashboard.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { IEnquiryService } from '@/types/services';
import type { CateringEnquiry, CustomParfaitQuote } from '@/types/domain';

const LOCAL_CATERING_KEY = 'siti_fruities_local_catering';
const LOCAL_PARFAIT_KEY = 'siti_fruities_local_parfait_quotes';

export const enquiryService: IEnquiryService = {
  async submitCateringEnquiry(enquiry: Omit<CateringEnquiry, 'id' | 'created_at'>): Promise<CateringEnquiry> {
    const fullEnquiry: CateringEnquiry = {
      ...enquiry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      await supabase.from('catering_enquiries').insert({
        id: fullEnquiry.id,
        customer_name: fullEnquiry.customer_name,
        customer_phone: fullEnquiry.customer_phone,
        customer_email: fullEnquiry.customer_email,
        event_type: fullEnquiry.event_type,
        guest_count: fullEnquiry.guest_count,
        event_date: fullEnquiry.event_date,
        menu_interests: fullEnquiry.menu_interests,
        event_details: fullEnquiry.event_details,
      });
    }

    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_CATERING_KEY) || '[]');
      stored.unshift(fullEnquiry);
      localStorage.setItem(LOCAL_CATERING_KEY, JSON.stringify(stored.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }

    return fullEnquiry;
  },

  async submitCustomParfaitQuote(quote: Omit<CustomParfaitQuote, 'id' | 'created_at'>): Promise<CustomParfaitQuote> {
    const fullQuote: CustomParfaitQuote = {
      ...quote,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      await supabase.from('custom_parfait_quotes').insert({
        id: fullQuote.id,
        customer_name: fullQuote.customer_name,
        customer_phone: fullQuote.customer_phone,
        size: fullQuote.size,
        size_label: fullQuote.size_label,
        yogurt_type: fullQuote.yogurt_type,
        fruits: fullQuote.fruits,
        toppings: fullQuote.toppings,
        quantity: fullQuote.quantity,
      });
    }

    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_PARFAIT_KEY) || '[]');
      stored.unshift(fullQuote);
      localStorage.setItem(LOCAL_PARFAIT_KEY, JSON.stringify(stored.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }

    return fullQuote;
  },
};
