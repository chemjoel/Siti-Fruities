const META_PIXEL_ID = '1710972720635398';
const PURCHASE_SESSION_KEY_PREFIX = 'siti_fruities_meta_pixel_purchase:';

type MetaPixelEvent = 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
type MetaPixelEventData = Record<string, unknown>;

type MetaPixelFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: (...args: unknown[]) => void;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
  }
}

const trackedPurchases = new Set<string>();
let isInitialized = false;

function initializeMetaPixel() {
  if (isInitialized) return;

  let fbq = window.fbq;
  if (!fbq) {
    fbq = ((...args: unknown[]) => {
      if (fbq?.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq?.queue.push(args);
      }
    }) as MetaPixelFunction;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = fbq;
    window.fbq = window._fbq = fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  fbq('init', META_PIXEL_ID);
  isInitialized = true;
}

export function trackMetaEvent(event: MetaPixelEvent, data?: MetaPixelEventData): boolean {
  try {
    initializeMetaPixel();
    window.fbq?.('track', event, data);
    return Boolean(window.fbq);
  } catch (error) {
    console.error(`Failed to track Meta Pixel ${event} event:`, error);
    return false;
  }
}

export function trackMetaPurchaseOnce(orderId: string, value: number) {
  if (!Number.isFinite(value) || trackedPurchases.has(orderId)) return;

  const storageKey = `${PURCHASE_SESSION_KEY_PREFIX}${orderId}`;
  try {
    if (sessionStorage.getItem(storageKey)) {
      trackedPurchases.add(orderId);
      return;
    }
  } catch (error) {
    console.error('Failed to check Meta Pixel purchase deduplication:', error);
  }

  if (!trackMetaEvent('Purchase', { value, currency: 'NGN' })) return;

  trackedPurchases.add(orderId);
  try {
    sessionStorage.setItem(storageKey, '1');
  } catch (error) {
    console.error('Failed to save Meta Pixel purchase deduplication:', error);
  }
}
