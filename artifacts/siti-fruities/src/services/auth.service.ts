/**
 * SITI FRUITIES — Authentication & Authorization Service
 *
 * Provides customer and administrator authentication via Supabase Auth
 * and profile role checking.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { UserProfile } from '@/types/domain';

const DEMO_ADMIN_KEY = 'siti_fruities_demo_admin_active';

export const authService = {
  async getSession() {
    return supabase.auth.getSession();
  },

  async getUser() {
    return supabase.auth.getUser();
  },

  async signIn(email: string, password: string): Promise<{ success: boolean; error: string | null; profile?: UserProfile | null }> {
    // 1. If Supabase is configured, use real auth
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return { success: false, error: error?.message || 'Login failed' };
      }

      const { data: profile } = await supabase
        .from<UserProfile>('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      return { success: true, error: null, profile };
    }

    // 2. Demo Admin Fallback for offline/preview testing
    if (email.toLowerCase().trim() === 'admin@sitifruities.com' && password === 'admin123') {
      localStorage.setItem(DEMO_ADMIN_KEY, 'true');
      return {
        success: true,
        error: null,
        profile: {
          id: 'demo-admin-id',
          role: 'admin',
          full_name: 'Siti Fruities Admin',
          phone: '+2348120842962',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }

    return { success: false, error: 'Invalid email or password. (Demo Admin: admin@sitifruities.com / admin123)' };
  },

  async signOut(): Promise<void> {
    localStorage.removeItem(DEMO_ADMIN_KEY);
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  },

  async isAdmin(): Promise<boolean> {
    if (localStorage.getItem(DEMO_ADMIN_KEY) === 'true') {
      return true;
    }

    if (!isSupabaseConfigured()) {
      return false;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from<UserProfile>('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return profile?.role === 'admin';
  },

  async getProfile(): Promise<UserProfile | null> {
    if (localStorage.getItem(DEMO_ADMIN_KEY) === 'true') {
      return {
        id: 'demo-admin-id',
        role: 'admin',
        full_name: 'Siti Fruities Admin',
        phone: '+2348120842962',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    if (!isSupabaseConfigured()) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from<UserProfile>('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return profile;
  },
};
