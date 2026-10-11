import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { X } from 'lucide-react';
import { useCart, CART_ACTIVITY_STORAGE_KEY, CART_COMPLETED_STORAGE_KEY, getCartSignature } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

const INACTIVITY_MS = 15 * 60 * 1000;
const DISMISSAL_MS = 24 * 60 * 60 * 1000;
const REMINDER_DELAY_MS = 3000;
const RECENT_ACTIVITY_MS = 15_000;
const SHOWN_THIS_VISIT_KEY = 'siti_fruities_cart_reminder_shown';
const ACTIVITY_THIS_VISIT_KEY = 'siti_fruities_cart_reminder_activity';
const DISMISSED_KEY = 'siti_fruities_cart_reminder_dismissed';
const reminderVisitStartedAt = Date.now();

interface CartReminderProps {
  blocked: boolean;
}

function hasRecentDismissal(signature: string, activityAt: number) {
  try {
    const stored = localStorage.getItem(DISMISSED_KEY);
    if (!stored) return false;
    const dismissal = JSON.parse(stored) as { signature?: string; activityAt?: number; dismissedAt?: number };
    if (
      dismissal.signature !== signature ||
      dismissal.activityAt !== activityAt ||
      !Number.isFinite(dismissal.dismissedAt) ||
      Date.now() - Number(dismissal.dismissedAt) >= DISMISSAL_MS
    ) {
      localStorage.removeItem(DISMISSED_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export default function CartReminder({ blocked }: CartReminderProps) {
  const { items, setIsCartOpen } = useCart();
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const signature = useMemo(() => getCartSignature(items), [items]);
  const activityObserved = useRef(false);
  const isAdminRoute = new URL(location, window.location.origin).pathname.startsWith('/admin');

  useEffect(() => {
    setIsVisible(false);
    const markActivity = () => {
      activityObserved.current = true;
      try {
        sessionStorage.setItem(ACTIVITY_THIS_VISIT_KEY, String(Date.now()));
      } catch {
        // Activity tracking is best-effort and must not affect browsing or checkout.
      }
    };
    const activityEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, markActivity, { passive: true }));

    let eligible = false;
    if (items.length > 0 && signature && !blocked && !isAdminRoute) {
      let activityAt: number;
      let completedSignature: string | null;
      let shownThisVisit: string | null;
      let activityThisVisit: number;
      try {
        activityAt = Number(localStorage.getItem(CART_ACTIVITY_STORAGE_KEY));
        completedSignature = localStorage.getItem(CART_COMPLETED_STORAGE_KEY);
        shownThisVisit = sessionStorage.getItem(SHOWN_THIS_VISIT_KEY);
        activityThisVisit = Number(sessionStorage.getItem(ACTIVITY_THIS_VISIT_KEY)) || 0;
      } catch {
        activityAt = 0;
        completedSignature = null;
        shownThisVisit = null;
        activityThisVisit = 0;
      }
      activityObserved.current = activityObserved.current || activityThisVisit >= reminderVisitStartedAt;
      activityObserved.current =
        activityObserved.current ||
        (activityThisVisit > 0 && Date.now() - activityThisVisit <= RECENT_ACTIVITY_MS);
      eligible =
        Number.isFinite(activityAt) &&
        Date.now() - activityAt >= INACTIVITY_MS &&
        completedSignature !== signature &&
        shownThisVisit !== `${signature}:${activityAt}` &&
        !hasRecentDismissal(signature, activityAt);
    }

    if (!eligible) {
      return () => {
        activityEvents.forEach((eventName) => window.removeEventListener(eventName, markActivity));
      };
    }

    const timeoutId = window.setTimeout(() => {
      if (activityObserved.current || document.visibilityState !== 'visible') return;
      let latestActivityAt: number;
      try {
        latestActivityAt = Number(localStorage.getItem(CART_ACTIVITY_STORAGE_KEY));
        if (
          !Number.isFinite(latestActivityAt) ||
          Date.now() - latestActivityAt < INACTIVITY_MS ||
          localStorage.getItem(CART_COMPLETED_STORAGE_KEY) === signature ||
          hasRecentDismissal(signature, latestActivityAt)
        ) {
          return;
        }
        sessionStorage.setItem(SHOWN_THIS_VISIT_KEY, `${signature}:${latestActivityAt}`);
      } catch {
        return;
      }
      setIsVisible(true);
    }, REMINDER_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, markActivity));
    };
  }, [blocked, items.length, signature, location, isAdminRoute]);

  const dismiss = () => {
    try {
      const activityAt = Number(localStorage.getItem(CART_ACTIVITY_STORAGE_KEY));
      localStorage.setItem(
        DISMISSED_KEY,
        JSON.stringify({ signature, activityAt, dismissedAt: Date.now() }),
      );
    } catch {
      // Dismissal is best-effort and must not affect cart or checkout.
    }
    setIsVisible(false);
  };

  if (!isVisible || items.length === 0 || blocked) return null;

  return (
    <aside
      role="status"
      aria-label="Saved cart reminder"
      className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:w-[min(24rem,calc(100vw-3rem))]"
    >
      <div className="rounded-2xl border border-primary/20 bg-card p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <p className="pr-2 text-sm font-semibold leading-relaxed text-foreground">
            You still have something delicious waiting in your cart!
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss cart reminder"
            className="-mr-1 -mt-1 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => {
              setIsVisible(false);
              setIsCartOpen(true);
            }}
          >
            View Cart
          </Button>
          <Button size="sm" variant="outline" onClick={dismiss}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </aside>
  );
}
