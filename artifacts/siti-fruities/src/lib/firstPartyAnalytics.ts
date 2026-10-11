import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type FirstPartyEventName =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'checkout_start'
  | 'engagement';

interface FirstPartyEvent {
  event_id: string;
  visitor_id: string;
  event_name: FirstPartyEventName;
  page_path: string;
  referrer_host: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  product_id: string | null;
  engagement_seconds: number | null;
}

const VISITOR_ID_KEY = 'siti_fruities_analytics_visitor';
const QUEUE_KEY = 'siti_fruities_analytics_queue';
const ATTRIBUTION_KEY = 'siti_fruities_analytics_attribution';
const MAX_QUEUE_LENGTH = 100;
const BATCH_SIZE = 20;

let flushTimer: number | undefined;
let isFlushing = false;
let flushRetryAttempt = 0;

function trackingAllowed() {
  return isSupabaseConfigured()
    && navigator.doNotTrack !== '1'
    && !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
}

function getVisitorId(): string | null {
  try {
    const stored = localStorage.getItem(VISITOR_ID_KEY);
    if (stored && /^[0-9a-f-]{36}$/i.test(stored)) return stored;
    const visitorId = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
    return visitorId;
  } catch (error) {
    console.warn('First-party analytics is unavailable because browser storage could not be accessed.', error);
    return null;
  }
}

function getPagePath(path?: string): string {
  const candidate = path || window.location.pathname;
  try {
    const pathname = new URL(candidate, window.location.origin).pathname;
    return pathname.startsWith('/') && !pathname.startsWith('//') ? pathname.slice(0, 512) : '/';
  } catch {
    return '/';
  }
}

function sanitizeAttributionValue(value: string | null): string | null {
  if (!value) return null;
  const sanitized = value.trim().replace(/[^\p{L}\p{N} ._~+-]/gu, '').slice(0, 100);
  return sanitized || null;
}

function getAttribution() {
  let attribution = {
    referrer_host: null as string | null,
    utm_source: null as string | null,
    utm_medium: null as string | null,
    utm_campaign: null as string | null,
  };

  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (stored) attribution = { ...attribution, ...JSON.parse(stored) };

    const query = new URLSearchParams(window.location.search);
    const source = sanitizeAttributionValue(query.get('utm_source'));
    const medium = sanitizeAttributionValue(query.get('utm_medium'));
    const campaign = sanitizeAttributionValue(query.get('utm_campaign'));
    if (source || medium || campaign) {
      attribution.utm_source = source || attribution.utm_source;
      attribution.utm_medium = medium || attribution.utm_medium;
      attribution.utm_campaign = campaign || attribution.utm_campaign;
    }

    if (!attribution.referrer_host && document.referrer) {
      const referrer = new URL(document.referrer);
      if (referrer.hostname !== window.location.hostname) {
        attribution.referrer_host = referrer.hostname.slice(0, 253);
      }
    }

    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch (error) {
    console.warn('First-party analytics attribution could not be stored.', error);
  }

  return attribution;
}

function readQueue(): FirstPartyEvent[] {
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed as FirstPartyEvent[] : [];
  } catch (error) {
    console.warn('First-party analytics queue could not be read.', error);
    return [];
  }
}

function writeQueue(events: FirstPartyEvent[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(events.slice(-MAX_QUEUE_LENGTH)));
  } catch (error) {
    console.warn('First-party analytics queue could not be saved.', error);
  }
}

async function flushQueue() {
  if (isFlushing || !trackingAllowed()) return;
  const pending = readQueue();
  if (pending.length === 0) return;

  isFlushing = true;
  const batch = pending.slice(0, BATCH_SIZE);
  try {
    const { error } = await supabase.functions.invoke('track-analytics', {
      body: { events: batch },
    });
    if (error) {
      flushRetryAttempt += 1;
      console.warn('First-party analytics delivery failed; events will be retried later.', error);
      return;
    }
    flushRetryAttempt = 0;
    const delivered = new Set(batch.map((event) => event.event_id));
    writeQueue(readQueue().filter((event) => !delivered.has(event.event_id)));
  } catch (error) {
    flushRetryAttempt += 1;
    console.warn('First-party analytics delivery failed; events will be retried later.', error);
  } finally {
    isFlushing = false;
    if (readQueue().length > 0) {
      scheduleFlush(Math.min(60_000, 1000 * (2 ** flushRetryAttempt)));
    }
  }
}

function scheduleFlush(delay = 1000) {
  if (flushTimer !== undefined) window.clearTimeout(flushTimer);
  flushTimer = window.setTimeout(() => {
    flushTimer = undefined;
    void flushQueue();
  }, delay);
}

export function trackFirstPartyEvent(
  eventName: FirstPartyEventName,
  options: { pagePath?: string; productId?: string; engagementSeconds?: number } = {},
) {
  try {
    if (!trackingAllowed()) return;
    const pagePath = getPagePath(options.pagePath);
    if (pagePath === '/admin' || pagePath.startsWith('/admin/')) return;

    const visitorId = getVisitorId();
    if (!visitorId) return;
    const attribution = getAttribution();
    const event: FirstPartyEvent = {
      event_id: crypto.randomUUID(),
      visitor_id: visitorId,
      event_name: eventName,
      page_path: pagePath,
      ...attribution,
      product_id: options.productId?.slice(0, 80) || null,
      engagement_seconds: options.engagementSeconds ?? null,
    };

    writeQueue([...readQueue(), event]);
    scheduleFlush();
  } catch (error) {
    console.warn('First-party analytics event could not be queued.', error);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => void flushQueue());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flushQueue();
  });
  void flushQueue();
}
