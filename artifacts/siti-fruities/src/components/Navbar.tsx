import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import logoImg from '@assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Healthy Smoothies', href: '#products-section' },
  { name: 'Cold Pressed Juice', href: '#products-section' },
  { name: 'Greek Yoghurt', href: '#products-section' },
  { name: 'Parfaits', href: '#products-section' },
  { name: 'Sandwiches', href: '#products-section' },
  { name: 'Healthy Treat Boxes', href: '#products-section' },
  { name: 'Fruit Hampers', href: '#products-section' },
  { name: 'Combos', href: '#products-section' },
  { name: 'Catering', href: '#products-section' },
  { name: 'About Us', href: '#footer' },
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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
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
              <button className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-black/5">
                <Menu className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-l-0 bg-background/95 backdrop-blur-xl">
              <SheetHeader className="p-6 border-b border-border/50 text-left">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <img src={logoImg} alt="Siti Fruities" className="h-10 w-auto object-contain" />
              </SheetHeader>
              <div className="flex flex-col py-6 px-4 overflow-y-auto h-[calc(100vh-80px)]">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="py-4 px-4 text-lg font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
