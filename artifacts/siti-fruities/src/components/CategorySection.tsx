import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Coffee, 
  GlassWater, 
  Milk, 
  ArrowRight,
  Sparkles,
  Utensils
} from 'lucide-react';

// Import Assets
const smoothieImg = '/assets/Screenshot_20260729-212748_1785360013740.jpg';
const juiceImg = '/assets/Screenshot_20260729-212547_1785360049692.jpg';
const yoghurtImg = '/assets/Screenshot_20260729-212331_1785360049844.jpg';
const parfaitImg = '/assets/Screenshot_20260729-212242_1785360049881.jpg';
const sandwichImg = '/assets/Screenshot_20260729-212433_1785360049771.jpg';
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
    desc: 'Probiotic Greek yogurt (sweetened or unsweetened) and premium layered parfaits.', 
    img: yoghurtImg, 
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
    desc: 'Freshly brewed Milk Tea, Zobo, Tigernut Drink, and other refreshing beverages.', 
    img: '', 
    href: '/milk-tea-drinks',
    icon: GlassWater,
    gradient: 'from-[#FEE2E2] to-[#FCA5A5]/80 border-[#FCA5A5]/40 text-[#DC2626]'
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
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <section className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
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
            className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4"
          >
            Browse Our Catalogue
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground font-medium text-lg"
          >
            Select a category to explore our freshly prepared menu items and customize your order.
          </motion.p>
        </div>

        {/* Responsive Grid for Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pt-4">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group"
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
