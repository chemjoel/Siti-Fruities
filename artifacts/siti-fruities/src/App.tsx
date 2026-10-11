import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import Home from '@/pages/Home';
import CategoryPlaceholder from '@/pages/CategoryPlaceholder';
import FruitsCategoryPage from '@/pages/FruitsCategoryPage';
import GreekYogurtParfaitsPage from '@/pages/GreekYogurtParfaitsPage';
import SmoothiesPage from '@/pages/SmoothiesPage';
import ColdPressedJuicesPage from '@/pages/ColdPressedJuicesPage';
import SandwichesSavouryPage from '@/pages/SandwichesSavouryPage';
import MilkTeaDrinksPage from '@/pages/MilkTeaDrinksPage';
import TreatBoxesPage from '@/pages/TreatBoxesPage';
import FruitHampersPage from '@/pages/FruitHampersPage';
import CombosPage from '@/pages/CombosPage';
import CateringEventsPage from '@/pages/CateringEventsPage';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import { CartProvider } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';
import CartReminder from '@/components/CartReminder';
import ScrollToTop from '@/components/ScrollToTop';
import { trackMetaEvent } from '@/lib/metaPixel';
import { trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';

const queryClient = new QueryClient();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function GoogleAnalyticsPageViewTracker() {
  const [location] = useLocation();
  const lastTrackedLocation = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedLocation.current === location) return;
    lastTrackedLocation.current = location;

    const pagePath = window.location.pathname;
    window.gtag?.('event', 'page_view', {
      page_path: pagePath,
      page_location: `${window.location.origin}${pagePath}`,
      page_title: document.title,
    });
  }, [location]);

  return null;
}

function FirstPartyAnalyticsTracker() {
  const [location] = useLocation();
  const lastTrackedLocation = useRef<string | null>(null);

  useEffect(() => {
    const pagePath = new URL(location, window.location.origin).pathname;
    if (pagePath === '/admin' || pagePath.startsWith('/admin/')) return;

    if (lastTrackedLocation.current !== pagePath) {
      lastTrackedLocation.current = pagePath;
      trackFirstPartyEvent('page_view', { pagePath });
    }

    let lastActivityAt = Date.now();
    let engagementSeconds = 0;
    const markActivity = () => {
      lastActivityAt = Date.now();
    };
    const flushEngagement = () => {
      if (engagementSeconds > 0) {
        trackFirstPartyEvent('engagement', {
          pagePath,
          engagementSeconds: Math.min(engagementSeconds, 30),
        });
        engagementSeconds = 0;
      }
    };
    const reportEngagement = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastActivityAt <= 30_000) {
        engagementSeconds += 15;
      }
      flushEngagement();
    };
    const activityEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, markActivity, { passive: true }));
    const intervalId = window.setInterval(reportEngagement, 15_000);
    document.addEventListener('visibilitychange', flushEngagement);
    window.addEventListener('pagehide', flushEngagement);

    return () => {
      window.clearInterval(intervalId);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, markActivity));
      document.removeEventListener('visibilitychange', flushEngagement);
      window.removeEventListener('pagehide', flushEngagement);
      flushEngagement();
    };
  }, [location]);

  return null;
}

function MetaPixelPageViewTracker() {
  const [location] = useLocation();

  useEffect(() => {
    trackMetaEvent('PageView');
  }, [location]);

  return null;
}

function CartReminderHost() {
  const { isCartOpen, isCheckoutActive } = useCart();
  return <CartReminder blocked={isCartOpen || isCheckoutActive} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/fruits" component={FruitsCategoryPage} />
      <Route path="/greek-yogurt-parfaits" component={GreekYogurtParfaitsPage} />
      <Route path="/smoothies" component={SmoothiesPage} />
      <Route path="/cold-pressed-juices" component={ColdPressedJuicesPage} />
      <Route path="/sandwiches-savoury" component={SandwichesSavouryPage} />
      <Route path="/milk-tea-drinks" component={MilkTeaDrinksPage} />
      <Route path="/treat-boxes" component={TreatBoxesPage} />
      <Route path="/fruit-hampers" component={FruitHampersPage} />
      <Route path="/combos" component={CombosPage} />
      <Route path="/catering-events" component={CateringEventsPage} />
      <Route path="/about" component={AboutUs} />
      <Route path="/contact" component={Contact} />
      <Route path="/:category" component={CategoryPlaceholder} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <GoogleAnalyticsPageViewTracker />
            <FirstPartyAnalyticsTracker />
            <MetaPixelPageViewTracker />
            <CartReminderHost />
            <ScrollToTop />
            <Router />
          </WouterRouter>
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
