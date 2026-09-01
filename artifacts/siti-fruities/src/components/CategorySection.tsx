import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowRight,
  Sparkles,
  Utensils
} from 'lucide-react';
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

// Import Assets
const smoothieImg = '/assets/Screenshot_20260729-212748_1785360013740.jpg';
const juiceImg = '/assets/Screenshot_20260729-212547_1785360049692.jpg';
const parfaitCategoryImg = '/assets/IMG_8435_parfait_multi.jpg';
const sandwichImg = '/assets/IMG_1940_sandwich.jpg';
const bobaTeaImg = '/assets/IMG_2364_bubble_tea_duo.jpg';
const treatBoxImg = '/assets/Screenshot_20260729-212815_1785360013704.jpg';
const hamperImg = '/assets/Screenshot_20260729-213638_1785360173839.jpg';
const freshFruitsImg = '/assets/Screenshot_20260729-212635_1785360049633.jpg';

interface CategoryItem {
  name: string;
  desc: string;
  img: string;
  href: string;
  icon?: React.ComponentType<any>;
  gradient?: string;
}

const CATEGORIES: CategoryItem[] = [
  { 
    name: 'Fresh Fruits & Healthy Snacks', 
    desc: 'Fresh seasonal fruit salad bowls, healthy chicken salad, and clean snacks.', 
    img: freshFruitsImg, 
    href: '/fruits' 
  },
  { 
    name: 'Greek Yogurt & Parfaits', 
    desc: 'Our signature layered Exotic Parfaits and 100% probiotic Greek Yogurt.', 
    img: parfaitCategoryImg, 
    href: '/greek-yogurt-parfaits' 
  },
  { 
    name: 'Smoothies', 
    desc: 'Rich, thick, and nutrient-dense smoothies made from fresh fruits and nuts.', 
    img: smoothieImg, 
    href: '/smoothies' 
  },
  { 
    name: 'Cold-Pressed Juices', 
    desc: '100% raw, refreshing fruit juices cold-pressed with zero added sugar.', 
    img: juiceImg, 
    href: '/cold-pressed-juices' 
  },
  { 
    name: 'Sandwiches & Savoury', 
    desc: 'Freshly made Chicken, Beef, and Egg sandwiches with signature cream.', 
    img: sandwichImg, 
    href: '/sandwiches-savoury' 
  },
  { 
    name: 'Milk Tea & Drinks', 
    desc: 'Freshly brewed Milk Tea with chewy boba pearls, Zobo, and Tigernut drink.', 
    img: bobaTeaImg, 
    href: '/milk-tea-drinks',
  },
  { 
    name: 'Treat Boxes', 
    desc: 'Curated combination packages featuring salad, yogurt, parfait, and bread.', 
    img: treatBoxImg, 
    href: '/treat-boxes' 
  },
  { 
    name: 'Fruit Hampers', 
    desc: 'Beautifully arranged deluxe and exotic fresh fruit gift hampers.', 
    img: hamperImg, 
    href: '/fruit-hampers' 
  },
  { 
    name: 'Combos', 
    desc: 'Specially paired healthy meal combinations at discounted prices.', 
    img: '', 
    href: '/combos',
    icon: Sparkles,
    gradient: 'from-[#FEF3C7] to-[#FDE68A]/80 border-[#FDE68A]/40 text-[#D97706]'
  },
  { 
    name: 'Catering & Events', 
    desc: 'Indoor, outdoor, and bulk food supply services customized for your events.', 
    img: '', 
    href: '/catering-events',
    icon: Utensils,
    gradient: 'from-[#E0F2FE] to-[#BAE6FD]/80 border-[#BAE6FD]/40 text-[#0284C7]'
  }
];

export default function CategorySection() {
  const ref = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [isPaused, setIsPaused] = useState(false);

  // Automatic gentle advancement for horizontal carousel on mobile/tablet screens
  useEffect(() => {
    if (isPaused) return;

    const autoScrollTimer = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        // Only run auto-scroll if container is horizontally scrollable
        if (scrollWidth > clientWidth) {
          const maxScroll = scrollWidth - clientWidth;
          if (scrollLeft >= maxScroll - 15) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
          }
        }
      }
    }, 4500);

    return () => clearInterval(autoScrollTimer);
  }, [isPaused]);

  return (
    <section 
      className="py-24 bg-background relative overflow-hidden" 
      ref={ref}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Subtle appetizing ambient lighting accent */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-amber-500/8 rounded-full blur-[120px] pointer-events-none" />

      {/* ================================================================
          FRUIT & YOGHURT ATMOSPHERE — visible on ALL screen sizes
         ================================================================ */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">

        {/* ── TOP EDGE ── */}
        {/* Top-left: pineapple slice */}
        <div className="absolute -top-3 -left-3 opacity-70" style={{ transform: 'rotate(-15deg)' }}>
          <PineappleSliceDecoration size={82} />
        </div>
        {/* Top-centre: grape cluster */}
        <div className="absolute top-4 left-[28%] opacity-55" style={{ transform: 'rotate(8deg)' }}>
          <GrapeClusterDecoration size={58} />
        </div>
        {/* Top-right: orange slice */}
        <div className="absolute -top-2 right-8 lg:right-20 opacity-72" style={{ transform: 'rotate(20deg)' }}>
          <OrangeSliceDecoration size={72} />
        </div>

        {/* ── LEFT SIDE ── */}
        {/* Upper-left: blueberries */}
        <div className="absolute top-[20%] -left-2 opacity-78" style={{ transform: 'rotate(-10deg)' }}>
          <BlueberryDecoration size={64} />
        </div>
        {/* Mid-left: yoghurt swirl */}
        <div className="absolute top-[45%] -left-8 opacity-50" style={{ transform: 'rotate(0deg)' }}>
          <YoghurtSwirlDecoration size={96} />
        </div>
        {/* Lower-left: kiwi */}
        <div className="absolute bottom-[18%] -left-3 opacity-72" style={{ transform: 'rotate(-5deg)' }}>
          <KiwiSliceDecoration size={68} />
        </div>

        {/* ── RIGHT SIDE ── */}
        {/* Upper-right: mango */}
        <div className="absolute top-[16%] -right-2 opacity-75" style={{ transform: 'rotate(14deg)' }}>
          <MangoDecoration size={64} />
        </div>
        {/* Mid-right: watermelon */}
        <div className="absolute top-[42%] -right-5 opacity-65" style={{ transform: 'rotate(22deg)' }}>
          <WatermelonSliceDecoration size={80} />
        </div>
        {/* Lower-right: cashew */}
        <div className="absolute bottom-[22%] right-2 lg:right-8 opacity-65 hidden sm:block" style={{ transform: 'rotate(-8deg)' }}>
          <CashewDecoration size={54} />
        </div>

        {/* ── BOTTOM EDGE ── */}
        {/* Bottom-left: strawberry half */}
        <div className="absolute -bottom-4 -left-4 opacity-68" style={{ transform: 'rotate(15deg)' }}>
          <StrawberryHalfDecoration size={84} />
        </div>
        {/* Bottom-centre: mint */}
        <div className="absolute bottom-1 left-[42%] opacity-55 hidden sm:block" style={{ transform: 'rotate(-10deg)' }}>
          <MintLeafDecoration size={58} />
        </div>
        {/* Bottom-right: grape */}
        <div className="absolute -bottom-2 right-[14%] opacity-58" style={{ transform: 'rotate(-5deg)' }}>
          <GrapeClusterDecoration size={62} />
        </div>

        {/* ── INTERIOR ACCENTS (desktop only) ── */}
        <div className="absolute top-[28%] left-[18%] opacity-28 hidden xl:block" style={{ transform: 'rotate(25deg)' }}>
          <StrawberryDecoration size={46} />
        </div>
        <div className="absolute top-[60%] right-[20%] opacity-28 hidden xl:block" style={{ transform: 'rotate(-18deg)' }}>
          <OrangeSliceDecoration size={44} />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3"
          >
            Fresh Menu
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4 leading-tight"
          >
            Browse Our Catalogue
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground font-medium text-base sm:text-lg leading-relaxed"
          >
            Select a category to explore our freshly prepared menu items and customize your order.
          </motion.p>
        </div>

        {/* Responsive Grid on Desktop / Smooth Auto-advancing Carousel on Mobile */}
        <div 
          ref={scrollContainerRef}
          className="flex md:grid overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 gap-6 md:gap-8 pt-4 md:grid-cols-3 lg:grid-cols-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              className="group w-[260px] md:w-auto shrink-0 snap-start snap-always"
            >
              <Link href={category.href}>
                <div className="bg-card hover:bg-white rounded-3xl border border-card-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer hover:-translate-y-1">
                  
                  {/* Card Header Image / Placeholder */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted w-full shrink-0">
                    {category.img ? (
                      <img
                        src={category.img}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${category.gradient} flex items-center justify-center border-b`}>
                        {category.icon && (
                          <category.icon className="w-12 h-12 stroke-[1.5]" />
                        )}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
                        {category.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary border-t border-border pt-4 mt-auto">
                      <span>Explore Menu</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
