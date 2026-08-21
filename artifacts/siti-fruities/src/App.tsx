import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
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
import { CartProvider } from '@/context/CartContext';
import ScrollToTop from '@/components/ScrollToTop';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
