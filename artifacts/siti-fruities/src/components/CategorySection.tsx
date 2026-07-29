import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CATEGORIES = [
  { name: 'Healthy Smoothies', icon: '🥤' },
  { name: 'Cold Pressed Juice', icon: '🍊' },
  { name: 'Greek Yoghurt', icon: '🥛' },
  { name: 'Parfaits', icon: '🍓' },
  { name: 'Sandwiches', icon: '🥪' },
  { name: 'Healthy Treat Boxes', icon: '🎁' },
  { name: 'Fruit Hampers', icon: '🧺' },
  { name: 'Combos', icon: '🌟' },
  { name: 'Catering', icon: '🍽️' },
];

export default function CategorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-2">Shop by Category</h2>
          <p className="text-muted-foreground font-medium">Find exactly what you're craving</p>
        </div>

        <div className="flex overflow-x-auto pb-8 pt-4 -mx-4 px-4 md:mx-0 md:px-0 gap-4 md:gap-6 snap-x snap-mandatory hide-scrollbar">
          {CATEGORIES.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={scrollToProducts}
              className="flex-shrink-0 snap-start group"
            >
              <div className="w-[110px] md:w-[140px] flex flex-col items-center gap-4">
                <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-3xl bg-card border border-border shadow-sm flex items-center justify-center text-4xl md:text-5xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-primary/30 group-hover:bg-primary/5">
                  {category.icon}
                </div>
                <span className="text-sm md:text-base font-semibold text-center text-foreground/80 group-hover:text-primary transition-colors line-clamp-2">
                  {category.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
