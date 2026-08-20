import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
const logoImg = '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png';
import { motion, AnimatePresence } from 'framer-motion';

const MAIN_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact / Get in Touch', href: '/contact' },
];

const SHOP_LINKS = [
  { name: 'Fresh Fruits & Healthy Snacks', href: '/fruits' },
  { name: 'Greek Yogurt & Parfaits', href: '/greek-yogurt-parfaits' },
  { name: 'Smoothies', href: '/smoothies' },
  { name: 'Cold-Pressed Juices', href: '/cold-pressed-juices' },
  { name: 'Sandwiches & Savoury', href: '/sandwiches-savoury' },
  { name: 'Milk Tea & Drinks', href: '/milk-tea-drinks' },
  { name: 'Treat Boxes', href: '/treat-boxes' },
  { name: 'Fruit Hampers', href: '/fruit-hampers' },
  { name: 'Combos', href: '/combos' },
  { name: 'Events & Catering', href: '/catering-events' },
];

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#') || href.startsWith('#')) {
      const targetId = href.includes('#') ? '#' + href.split('#')[1] : href;
      if (window.location.pathname === '/') {
        e.preventDefault();
        const el = document.querySelector(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center z-50">
          <img 
            src={logoImg} 
            alt="Siti Fruities Logo" 
            className="h-9 md:h-12 w-auto object-contain transition-transform hover:scale-105" 
          />
        </Link>

        {/* Desktop Nav (Hidden on mobile, just showing icons) */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-black/5">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-foreground/80 hover:text-primary transition-colors relative rounded-full hover:bg-black/5"
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-[10px] md:text-xs font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-sm"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile Menu Toggle */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button 
                aria-label="Open Navigation Menu"
                className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-black/5"
              >
                <Menu className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[85vw] max-w-[360px] sm:w-[400px] h-[100dvh] max-h-[100dvh] flex flex-col p-0 gap-0 border-l border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <SheetHeader className="shrink-0 p-5 md:p-6 pr-14 border-b border-border/50 text-left flex flex-row items-center justify-between">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <img src={logoImg} alt="Siti Fruities" className="h-9 md:h-10 w-auto object-contain" />
              </SheetHeader>
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y py-4 px-2 space-y-6">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 px-4 mb-2">
                    Main
                  </div>
                  <div className="space-y-0.5">
                    {MAIN_LINKS.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link
                          href={link.href}
                          onClick={(e) => handleNavClick(e as any, link.href)}
                          className="py-2.5 px-4 text-base font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all block cursor-pointer"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 px-4 mb-2">
                    Our Menu / Shop
                  </div>
                  <div className="space-y-0.5 pb-12">
                    {SHOP_LINKS.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (MAIN_LINKS.length + i) * 0.03 }}
                      >
                        <Link
                          href={link.href}
                          onClick={(e) => handleNavClick(e as any, link.href)}
                          className="py-2.5 px-4 text-base font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all block cursor-pointer"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
