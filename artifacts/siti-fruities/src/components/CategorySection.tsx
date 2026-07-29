import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
const smoothieImg = '/assets/Screenshot_20260729-212748_1785360013740.jpg';
const juiceImg = '/assets/Screenshot_20260729-212547_1785360049692.jpg';
const yoghurtImg = '/assets/Screenshot_20260729-212331_1785360049844.jpg';
const parfaitImg = '/assets/Screenshot_20260729-212242_1785360049881.jpg';
const sandwichImg = '/assets/Screenshot_20260729-212433_1785360049771.jpg';
const treatBoxImg = '/assets/Screenshot_20260729-212815_1785360013704.jpg';
const hamperImg = '/assets/Screenshot_20260729-213638_1785360173839.jpg';
const cateringEventImg = '/assets/Screenshot_20260729-212635_1785360049633.jpg';
const chefImg = '/assets/Screenshot_20260729-212642_1785360049574.jpg';

const CATEGORIES = [
  { name: 'Healthy Smoothies', img: smoothieImg },
  { name: 'Cold Pressed Juice', img: juiceImg },
  { name: 'Greek Yoghurt', img: yoghurtImg },
  { name: 'Parfaits', img: parfaitImg },
  { name: 'Sandwiches', img: sandwichImg },
  { name: 'Healthy Treat Boxes', img: treatBoxImg },
  { name: 'Fruit Hampers', img: hamperImg },
  { name: 'Combos', img: cateringEventImg },
  { name: 'Catering', img: chefImg },
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
              transition={{ duration: 0.5, delay: index * 0.06 }}
              onClick={scrollToProducts}
              className="flex-shrink-0 snap-start group"
            >
              <div className="w-[110px] md:w-[140px] flex flex-col items-center gap-3">
                {/* Square image tile with zoom on hover */}
                <div className="w-[90px] h-[90px] md:w-[112px] md:h-[112px] rounded-3xl overflow-hidden shadow-md border-2 border-transparent group-hover:border-primary/50 group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="text-sm md:text-base font-semibold text-center text-foreground/80 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
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
