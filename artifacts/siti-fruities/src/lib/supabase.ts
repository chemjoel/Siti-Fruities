/**
 * SITI FRUITIES — Supabase Browser Client
 *
 * Lightweight, zero-dependency, type-safe client that connects to Supabase
 * REST API, Storage, and Auth endpoints natively in the browser.
 *
 * It uses standard environment variables:
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_ANON_KEY
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const AUTH_STORAGE_KEY = 'siti_fruities_supabase_auth';

export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: SupabaseUser;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
};

// --- Storage Helper ---
const getStoredSession = (): SupabaseSession | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const setStoredSession = (session: SupabaseSession | null) => {
  try {
    if (session) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to update auth storage:', err);
  }
};

// --- Query Builder ---
class QueryBuilder<T = any> {
  private table: string;
  private method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET';
  private headers: Record<string, string> = {};
  private queryParams: URLSearchParams = new URLSearchParams();
  private bodyPayload: any = null;
  private isSingle = false;
  private isMaybeSingle = false;

  constructor(table: string) {
    this.table = table;
    const session = getStoredSession();
    const token = session?.access_token || SUPABASE_ANON_KEY;

    this.headers = {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      Prefer: 'return=representation',
    };
  }

  select(columns = '*'): this {
    this.method = 'GET';
    this.queryParams.set('select', columns);
    return this;
  }

  insert(values: any | any[]): this {
    this.method = 'POST';
    this.bodyPayload = values;
    return this;
  }

  update(values: any): this {
    this.method = 'PATCH';
    this.bodyPayload = values;
    return this;
  }

  delete(): this {
    this.method = 'DELETE';
    return this;
  }

  eq(column: string, value: any): this {
    this.queryParams.set(column, `eq.${value}`);
    return this;
  }

  or(filters: string): this {
    this.queryParams.set('or', `(${filters})`);
    return this;
  }

  order(column: string, options: { ascending?: boolean; nullsFirst?: boolean } = {}): this {
    const dir = options.ascending === false ? 'desc' : 'asc';
    const nulls = options.nullsFirst ? '.nullsfirst' : '';
    this.queryParams.append('order', `${column}.${dir}${nulls}`);
    return this;
  }

  limit(count: number): this {
    this.queryParams.set('limit', count.toString());
    return this;
  }

  single(): Promise<{ data: T | null; error: Error | null }> {
    this.isSingle = true;
    this.headers['Accept'] = 'application/vnd.pgrst.object+json';
    return this.execute();
  }

  maybeSingle(): Promise<{ data: T | null; error: Error | null }> {
    this.isMaybeSingle = true;
    return this.execute();
  }

  async then(resolve: (result: { data: T | null; error: Error | null }) => void) {
    const result = await this.execute();
    resolve(result);
  }

  private async execute(): Promise<{ data: T | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    try {
      const queryString = this.queryParams.toString();
      const url = `${SUPABASE_URL}/rest/v1/${this.table}${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, {
        method: this.method,
        headers: this.headers,
        body: this.bodyPayload ? JSON.stringify(this.bodyPayload) : undefined,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ message: res.statusText }));
        return { data: null, error: new Error(errJson.message || errJson.error || `HTTP ${res.status}`) };
      }

      // 204 No Content
      if (res.status === 204) {
        return { data: null, error: null };
      }

      const json = await res.json();
      if (this.isMaybeSingle && Array.isArray(json)) {
        return { data: json[0] || null, error: null };
      }

      return { data: json, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }
}

// --- Supabase Client Object ---
export const supabase = {
  from<T = any>(table: string): QueryBuilder<T> {
    return new QueryBuilder<T>(table);
  },

  async rpc<T = any>(functionName: string, params: Record<string, any> = {}): Promise<{ data: T | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    try {
      const session = getStoredSession();
      const token = session?.access_token || SUPABASE_ANON_KEY;

      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ message: res.statusText }));
        return { data: null, error: new Error(errJson.message || errJson.error || `HTTP ${res.status}`) };
      }

      const json = await res.json();
      return { data: json, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  storage: {
    from(bucket: string) {
      return {
        getPublicUrl(path: string) {
          const cleanPath = path.replace(/^\//, '');
          return {
            data: {
              publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`,
            },
          };
        },

        async upload(path: string, file: File | Blob): Promise<{ data: any; error: Error | null }> {
          if (!isSupabaseConfigured()) {
            return { data: null, error: new Error('Supabase is not configured') };
          }
          const session = getStoredSession();
          const token = session?.access_token || SUPABASE_ANON_KEY;
          const cleanPath = path.replace(/^\//, '');

          try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${cleanPath}`, {
              method: 'POST',
              headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${token}`,
                'x-upsert': 'true',
              },
              body: formData,
            });

            if (!res.ok) {
              const err = await res.json().catch(() => ({ message: res.statusText }));
              return { data: null, error: new Error(err.message || 'Upload failed') };
            }

            const data = await res.json();
            return { data, error: null };
          } catch (err: any) {
            return { data: null, error: err };
          }
        },
      };
    },
  },

  auth: {
    async getSession(): Promise<{ data: { session: SupabaseSession | null }; error: Error | null }> {
      const session = getStoredSession();
      return { data: { session }, error: null };
    },

    async getUser(): Promise<{ data: { user: SupabaseUser | null }; error: Error | null }> {
      const session = getStoredSession();
      return { data: { user: session?.user || null }, error: null };
    },

    async signInWithPassword({ email, password }: { email: string; password: string }): Promise<{ data: { user: SupabaseUser | null; session: SupabaseSession | null }; error: Error | null }> {
      if (!isSupabaseConfigured()) {
        return { data: { user: null, session: null }, error: new Error('Supabase is not configured') };
      }

      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ email, password }),
        });

        const json = await res.json();
        if (!res.ok) {
          return { data: { user: null, session: null }, error: new Error(json.error_description || json.msg || json.message || 'Invalid credentials') };
        }

        const session: SupabaseSession = {
          access_token: json.access_token,
          refresh_token: json.refresh_token,
          expires_at: json.expires_at,
          user: json.user,
        };

        setStoredSession(session);
        return { data: { user: session.user, session }, error: null };
      } catch (err: any) {
        return { data: { user: null, session: null }, error: err };
      }
    },

    async signUp({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, any> } }): Promise<{ data: { user: SupabaseUser | null; session: SupabaseSession | null }; error: Error | null }> {
      if (!isSupabaseConfigured()) {
        return { data: { user: null, session: null }, error: new Error('Supabase is not configured') };
      }

      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ email, password, data: options?.data }),
        });

        const json = await res.json();
        if (!res.ok) {
          return { data: { user: null, session: null }, error: new Error(json.error_description || json.msg || json.message || 'Signup failed') };
        }

        let session: SupabaseSession | null = null;
        if (json.access_token) {
          session = {
            access_token: json.access_token,
            refresh_token: json.refresh_token,
            user: json.user,
          };
          setStoredSession(session);
        }

        return { data: { user: json.user || json, session }, error: null };
      } catch (err: any) {
        return { data: { user: null, session: null }, error: err };
      }
    },

    async signOut(): Promise<{ error: Error | null }> {
      setStoredSession(null);
      return { error: null };
    },

    onAuthStateChange(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: SupabaseSession | null) => void) {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === AUTH_STORAGE_KEY) {
          const session = getStoredSession();
          callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
        }
      };
      window.addEventListener('storage', handleStorage);
      return {
        data: {
          subscription: {
            unsubscribe: () => window.removeEventListener('storage', handleStorage),
          },
        },
      };
    },
  },
};
