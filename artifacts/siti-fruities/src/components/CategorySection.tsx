import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowRight,
  Sparkles,
  Utensils
} from 'lucide-react';

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
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle background decorative fruit elements (outer edges, low-opacity, behind content) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Top-left: Mango piece & Blueberry */}
        <div className="absolute top-12 left-4 lg:left-8 opacity-20 hidden md:block">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="22" height="22" rx="6" fill="#F59E0B" />
            <path d="M12 12C16 10 22 14 26 12" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="36" cy="30" r="8" fill="#1E40AF" />
            <circle cx="34" cy="28" r="2" fill="#60A5FA" opacity="0.6" />
            <circle cx="28" cy="36" r="6" fill="#1D4ED8" />
          </svg>
        </div>

        {/* Bottom-right: Cashew nut & Mint leaf */}
        <div className="absolute bottom-16 right-4 lg:right-8 opacity-20 hidden md:block">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 18C16 12 24 10 30 14C36 18 36 28 32 34C28 40 18 38 16 32C14 26 20 22 24 24" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M30 36C38 32 44 24 44 14C34 14 26 20 22 28" fill="#10B981" opacity="0.8" />
          </svg>
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
