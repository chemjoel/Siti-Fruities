import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StrawberryDecoration, 
  StrawberryHalfDecoration,
  KiwiSliceDecoration, 
  BlueberryDecoration, 
  MintLeafDecoration, 
  CashewDecoration, 
  MangoDecoration,
  GrapeClusterDecoration,
  WatermelonSliceDecoration,
  OrangeSliceDecoration,
  YoghurtSwirlDecoration,
} from './FruitAtmosphere';

// Real product images from SITI FRUITIES photography
const vvipParfaitImages = [
  '/assets/IMG_8455_parfait_bowls.jpg',
  '/assets/IMG_1639_parfait_1l.jpg',
  '/assets/IMG_8435_parfait_multi.jpg',
];

const vipParfaitImages = [
  '/assets/IMG_6519_parfait_500ml.jpg',
  '/assets/IMG_6519_parfait_side.jpg',
];

const greekYoghurtImages = [
  '/assets/Screenshot_20260729-212331_1785360049844.jpg',
  '/assets/IMG_8428_parfait_stack.jpg',
];

const customParfaitImages = [
  '/assets/IMG_8435_parfait_multi.jpg',
  '/assets/IMG_8428_parfait_stack.jpg',
];

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

interface ParfaitProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  desc: string;
  images: string[];
  basePrice: number;
  sizes: Record<string, number>;
  defaultSize: string;
}

const PARFAIT_PRODUCTS: ParfaitProduct[] = [
  {
    id: 'vvip-exotic-parfait',
    slug: 'vvip-exotic-parfait',
    name: 'VVIP Exotic Parfait',
    tagline: 'The Ultimate Creamy Feast',
    desc: 'Greek Yogurt, Apple, Coconut, Grapes, Strawberries, Kiwi, Granola, Raisins, Cashew nuts.',
    images: vvipParfaitImages,
    basePrice: 8500,
    sizes: {
      'Mini (330ml)': 6000,
      'Medium (500ml)': 8500,
      'Gbemidele (550ml)': 10000,
      'Ay Bowl (1L)': 15000,
      'Wonder Bowl (2L)': 29000
    },
    defaultSize: 'Medium (500ml)'
  },
  {
    id: 'vip-exotic-parfait',
    slug: 'vip-exotic-parfait',
    name: 'VIP Exotic Parfait',
    tagline: 'Classic Honeyed Delight',
    desc: 'Greek Yogurt, Apple, Coconut, Grapes, Granola with rolled oats, Raisins, Cashew nuts.',
    images: vipParfaitImages,
    basePrice: 8000,
    sizes: {
      'Mini (330ml)': 5000,
      'Medium (500ml)': 8000,
      'Gbemidele (550ml)': 9000,
      'Ay Bowl (1L)': 13500
    },
    defaultSize: 'Medium (500ml)'
  },
  {
    id: 'greek-yogurt',
    slug: 'greek-yogurt',
    name: 'Probiotic Greek Yogurt',
    tagline: '100% Raw Creamy Wholesomeness',
    desc: 'Thick, creamy, protein-packed probiotic Greek yogurt. No artificial additives.',
    images: greekYoghurtImages,
    basePrice: 6500,
    sizes: {
      '330ml': 4500,
      '500ml': 6500,
      '1L': 12000,
      '2L': 23500,
      '5L': 56000
    },
    defaultSize: '500ml'
  }
];

export default function SignatureParfaits() {
  const { addItem } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Custom options state for each product
  const [selections, setSelections] = useState<Record<string, { size: string; type: string; qty: number }>>({
    'vvip-exotic-parfait': { size: 'Medium (500ml)', type: 'Sweetened', qty: 1 },
    'vip-exotic-parfait': { size: 'Medium (500ml)', type: 'Sweetened', qty: 1 },
    'greek-yogurt': { size: '500ml', type: 'Sweetened', qty: 1 }
  });

  // Rotate individual card images gently every 4 seconds (1.0s transition duration)
  useEffect(() => {
    const imgTimer = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(imgTimer);
  }, []);

  // Automatic slow carousel advancement across cards (every 4.8s)
  useEffect(() => {
    if (isHovered) return;
    const scrollTimer = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeft >= maxScroll - 20) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 4800);

    return () => clearInterval(scrollTimer);
  }, [isHovered]);

  const handleUpdateSelection = (slug: string, field: 'size' | 'type' | 'qty', value: any) => {
    setSelections(prev => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [field]: value
      }
    }));
  };

  const handleAddToCart = (product: ParfaitProduct) => {
    const sel = selections[product.slug];
    const price = product.sizes[sel.size] || product.basePrice;
    
    addItem({
      productId: product.slug,
      name: product.name,
      image: product.images[0],
      price: price,
      quantity: sel.qty,
      options: [
        { name: 'Size', value: sel.size },
        { name: 'Yogurt Type', value: sel.type }
      ]
    });
    
    // Reset quantity
    handleUpdateSelection(product.slug, 'qty', 1);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="py-20 relative overflow-hidden bg-gradient-to-b from-secondary/5 via-white to-background border-y border-border/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Soft ambient lighting glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* ================================================================
          FRUIT & YOGHURT ATMOSPHERE — visible on ALL screen sizes
         ================================================================ */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">

        {/* ── TOP EDGE ── */}
        {/* Top-left: large strawberry half peering from corner */}
        <div className="absolute -top-4 -left-4 opacity-70" style={{ transform: 'rotate(-20deg)' }}>
          <StrawberryHalfDecoration size={88} />
        </div>
        {/* Top-centre-left: grape cluster */}
        <div className="absolute top-2 left-[20%] opacity-60" style={{ transform: 'rotate(10deg)' }}>
          <GrapeClusterDecoration size={66} />
        </div>
        {/* Top-right: orange slice */}
        <div className="absolute top-4 right-6 lg:right-16 opacity-75" style={{ transform: 'rotate(15deg)' }}>
          <OrangeSliceDecoration size={70} />
        </div>

        {/* ── LEFT SIDE ── */}
        {/* Upper-left: kiwi */}
        <div className="absolute top-[22%] -left-3 opacity-70" style={{ transform: 'rotate(-8deg)' }}>
          <KiwiSliceDecoration size={65} />
        </div>
        {/* Mid-left: yoghurt swirl */}
        <div className="absolute top-[42%] -left-6 opacity-55" style={{ transform: 'rotate(0deg)' }}>
          <YoghurtSwirlDecoration size={90} />
        </div>
        {/* Lower-left: mango */}
        <div className="absolute bottom-[20%] -left-2 opacity-75" style={{ transform: 'rotate(-12deg)' }}>
          <MangoDecoration size={62} />
        </div>

        {/* ── RIGHT SIDE ── */}
        {/* Upper-right: blueberries */}
        <div className="absolute top-[18%] -right-2 opacity-75" style={{ transform: 'rotate(12deg)' }}>
          <BlueberryDecoration size={62} />
        </div>
        {/* Mid-right: watermelon slice */}
        <div className="absolute top-[40%] -right-4 opacity-65" style={{ transform: 'rotate(20deg)' }}>
          <WatermelonSliceDecoration size={78} />
        </div>
        {/* Mid-right: cashew */}
        <div className="absolute top-[58%] right-4 lg:right-10 opacity-65 hidden sm:block" style={{ transform: 'rotate(-5deg)' }}>
          <CashewDecoration size={52} />
        </div>

        {/* ── BOTTOM EDGE ── */}
        {/* Bottom-right: strawberry */}
        <div className="absolute -bottom-4 -right-4 opacity-70" style={{ transform: 'rotate(18deg)' }}>
          <StrawberryDecoration size={78} />
        </div>
        {/* Bottom-centre: pineapple replaced with kiwi + mint cluster */}
        <div className="absolute bottom-0 left-[38%] opacity-55 hidden sm:block" style={{ transform: 'rotate(-8deg)' }}>
          <MintLeafDecoration size={56} />
        </div>
        {/* Bottom-left: grape */}
        <div className="absolute bottom-2 left-[12%] opacity-60" style={{ transform: 'rotate(5deg)' }}>
          <GrapeClusterDecoration size={60} />
        </div>

        {/* ── INTERIOR ACCENT (desktop only) ── */}
        <div className="absolute top-[65%] left-[20%] opacity-35 hidden lg:block" style={{ transform: 'rotate(-15deg)' }}>
          <OrangeSliceDecoration size={50} />
        </div>
        <div className="absolute top-[20%] right-[22%] opacity-30 hidden lg:block" style={{ transform: 'rotate(20deg)' }}>
          <WatermelonSliceDecoration size={52} />
        </div>
      </div>

      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-primary/10" />
              Siti Signature
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4 leading-tight">
              Signature Parfaits
            </h2>
            <p className="text-muted-foreground font-medium text-base sm:text-lg leading-relaxed">
              Creamy. Fruity. Loaded with goodness. Handcrafted with probiotic yogurt and fresh farm-picked ingredients.
            </p>
          </div>
          
          {/* Scroll Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={scrollLeft}
              className="w-11 h-11 rounded-full border-2 border-border bg-white hover:bg-muted text-foreground flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-11 h-11 rounded-full border-2 border-border bg-white hover:bg-muted text-foreground flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auto-advancing Horizontal Scroll Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PARFAIT_PRODUCTS.map((prod) => {
            const sel = selections[prod.slug];
            const currentPrice = prod.sizes[sel.size] || prod.basePrice;
            const currentImg = prod.images[activeImageIdx % prod.images.length] || prod.images[0];
            
            return (
              <div 
                key={prod.id}
                className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always"
              >
                <div className="bg-card rounded-3xl shadow-md border border-card-border overflow-hidden flex flex-col h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  
                  {/* Image container with automatic 1.0s crossfade between variations */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={currentImg}
                        src={currentImg} 
                        alt={prod.name} 
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0.6 }}
                        transition={{ duration: 1.0, ease: "easeInOut" }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </AnimatePresence>
                    
                    <div className="absolute top-3 left-3 bg-primary/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {prod.tagline}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm font-black text-foreground shadow-sm">
                      {formatPrice(currentPrice * sel.qty)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 md:p-6 flex flex-col flex-1 gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-foreground mb-1 group-hover:text-primary transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">
                        {prod.desc}
                      </p>
                    </div>

                    {/* Customize Options */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Yogurt Type</span>
                        <div className="flex gap-1 bg-muted p-0.5 rounded-lg border border-border">
                          {['Sweetened', 'Unsweetened'].map((type) => (
                            <button
                              key={type}
                              onClick={() => handleUpdateSelection(prod.slug, 'type', type)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                sel.type === type 
                                  ? 'bg-white text-foreground shadow-sm' 
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Select Size</span>
                        <select
                          value={sel.size}
                          onChange={(e) => handleUpdateSelection(prod.slug, 'size', e.target.value)}
                          className="bg-white border border-border rounded-lg text-xs font-bold px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                        >
                          {Object.entries(prod.sizes).map(([sz, price]) => (
                            <option key={sz} value={sz}>
                              {sz} (₦{price.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Footer / Cart Actions */}
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-border mt-auto">
                      {/* Qty Selector */}
                      <div className="flex items-center bg-muted rounded-full p-0.5 border border-border">
                        <button
                          type="button"
                          onClick={() => handleUpdateSelection(prod.slug, 'qty', Math.max(1, sel.qty - 1))}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-muted text-foreground transition-colors disabled:opacity-50"
                          disabled={sel.qty <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs">{sel.qty}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateSelection(prod.slug, 'qty', sel.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-muted text-foreground transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Button 
                        onClick={() => handleAddToCart(prod)}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-full font-bold h-9 text-xs transition-transform active:scale-95 shadow-md"
                      >
                        Add to Cart
                      </Button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {/* Custom Parfait Card */}
          <div className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always">
            <div className="bg-[#FFFDF9] rounded-3xl shadow-md border-2 border-dashed border-primary/30 overflow-hidden flex flex-col h-full justify-between p-6 hover:shadow-xl hover:border-primary transition-all duration-300">
              
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-6 h-6 fill-primary/15" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-foreground mb-2">
                    Build Your Own Parfait
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    Have it your way! Choose your base, pick sweet fresh fruits, and stack your favorite nuts and toppings.
                  </p>
                </div>
              </div>

              {/* Graphic preview */}
              <div className="relative h-28 my-2 overflow-hidden bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <img 
                  src={customParfaitImages[activeImageIdx % customParfaitImages.length]} 
                  alt="Custom Parfait ingredients" 
                  className="w-full h-full object-cover opacity-85 mix-blend-multiply transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent" />
              </div>

              <div className="pt-4">
                <a href="/greek-yogurt-parfaits">
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-full font-bold h-11 shadow-md"
                  >
                    Customize Now
                  </Button>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
