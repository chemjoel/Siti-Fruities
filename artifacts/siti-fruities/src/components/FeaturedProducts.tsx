import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { useFeaturedProducts } from '@/hooks/useCatalog';
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
  PineappleSliceDecoration,
  YoghurtSwirlDecoration,
} from './FruitAtmosphere';

export default function FeaturedProducts() {
  const { data: featuredProducts, isLoading, isError } = useFeaturedProducts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const scrollTimer = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeft >= maxScroll - 20) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 4500);

    return () => clearInterval(scrollTimer);
  }, [isHovered]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  if (!isLoading && (isError || !featuredProducts?.length)) {
    return null;
  }

  return (
    <section
      className="py-20 bg-background relative border-t border-border/20 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Soft ambient food fresh glow */}
      <div className="absolute top-1/3 -left-36 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 -right-36 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ================================================================
          FRUIT & YOGHURT ATMOSPHERE — visible on ALL screen sizes
         ================================================================ */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* ── TOP EDGE ── */}
        {/* Top-left: grape cluster peering from corner */}
        <div className="absolute -top-3 -left-3 opacity-68" style={{ transform: 'rotate(-12deg)' }}>
          <GrapeClusterDecoration size={80} />
        </div>
        {/* Top-centre: watermelon slice */}
        <div className="absolute top-3 left-[30%] opacity-55" style={{ transform: 'rotate(10deg)' }}>
          <WatermelonSliceDecoration size={62} />
        </div>
        {/* Top-right: strawberry half */}
        <div className="absolute -top-4 right-6 lg:right-16 opacity-70" style={{ transform: 'rotate(18deg)' }}>
          <StrawberryHalfDecoration size={84} />
        </div>

        {/* ── LEFT SIDE ── */}
        {/* Upper-left: kiwi */}
        <div className="absolute top-[22%] -left-3 opacity-72" style={{ transform: 'rotate(-8deg)' }}>
          <KiwiSliceDecoration size={66} />
        </div>
        {/* Mid-left: yoghurt swirl */}
        <div className="absolute top-[44%] -left-6 opacity-50" style={{ transform: 'rotate(0deg)' }}>
          <YoghurtSwirlDecoration size={92} />
        </div>
        {/* Lower-left: mango */}
        <div className="absolute bottom-[18%] -left-2 opacity-76" style={{ transform: 'rotate(-14deg)' }}>
          <MangoDecoration size={64} />
        </div>

        {/* ── RIGHT SIDE ── */}
        {/* Upper-right: orange slice */}
        <div className="absolute top-[16%] -right-2 opacity-75" style={{ transform: 'rotate(12deg)' }}>
          <OrangeSliceDecoration size={66} />
        </div>
        {/* Mid-right: pineapple slice */}
        <div className="absolute top-[40%] -right-5 opacity-63" style={{ transform: 'rotate(20deg)' }}>
          <PineappleSliceDecoration size={76} />
        </div>
        {/* Lower-right: blueberries */}
        <div className="absolute bottom-[20%] right-2 lg:right-8 opacity-72" style={{ transform: 'rotate(-6deg)' }}>
          <BlueberryDecoration size={60} />
        </div>

        {/* ── BOTTOM EDGE ── */}
        {/* Bottom-right: cashew */}
        <div className="absolute -bottom-2 -right-2 opacity-65" style={{ transform: 'rotate(10deg)' }}>
          <CashewDecoration size={64} />
        </div>
        {/* Bottom-centre: mint leaf */}
        <div className="absolute bottom-2 left-[40%] opacity-52 hidden sm:block" style={{ transform: 'rotate(-6deg)' }}>
          <MintLeafDecoration size={58} />
        </div>
        {/* Bottom-left: strawberry */}
        <div className="absolute bottom-4 left-[14%] opacity-60" style={{ transform: 'rotate(8deg)' }}>
          <StrawberryDecoration size={62} />
        </div>

        {/* ── INTERIOR ACCENTS (desktop only) ── */}
        <div className="absolute top-[70%] left-[22%] opacity-28 hidden xl:block" style={{ transform: 'rotate(-20deg)' }}>
          <GrapeClusterDecoration size={48} />
        </div>
        <div className="absolute top-[18%] right-[24%] opacity-25 hidden xl:block" style={{ transform: 'rotate(15deg)' }}>
          <KiwiSliceDecoration size={44} />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header with Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4 leading-tight"
            >
              Our Favourites
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed"
            >
              Crafted fresh, every single day with premium ingredients and zero artificial additives.
            </motion.p>
          </div>

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

        {/* Auto-advancing Swipeable & Scrollable Horizontal Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always">
                <div className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-md">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-4 p-6">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full rounded-full" />
                  </div>
                </div>
              </div>
            ))
            : featuredProducts?.map((product) => (
              <div key={product.id} className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always">
                <ProductCard
                  product={{
                    productId: product.id,
                    name: product.name,
                    description: product.description,
                    basePrice: product.basePrice,
                    image: product.imageUrl ?? undefined,
                    placeholderIcon: Package,
                    placeholderGradient: 'from-orange-100 to-amber-100',
                    options: product.options,
                    isAvailable: product.isAvailable,
                  }}
                />
              </div>
            ))}
        </div>

        {/* View All Products CTA */}
        <div className="flex justify-center mt-10">
          <Link href="/greek-yogurt-parfaits">
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-bold px-8 h-12 text-sm transition-all shadow-md active:scale-95"
            >
              View All Products
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
