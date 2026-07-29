import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import rev1 from '@assets/Screenshot_20260729-213453_1785360013623.jpg';
import rev2 from '@assets/Screenshot_20260729-213507_1785360013666.jpg';
import rev3 from '@assets/Screenshot_20260729-213514_1785360013577.jpg';
import rev4 from '@assets/Screenshot_20260729-213549_1785360013494.jpg';

const REVIEWS = [
  { img: rev1, name: "Aisha T.", type: "Breakthrough feeling" },
  { img: rev2, name: "Olu B.", type: "Repeat Customer" },
  { img: rev3, name: "Grace O.", type: "Birthday Order" },
  { img: rev4, name: "Chidi N.", type: "Yoghurt Fan" },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    
    // Auto scroll setup
    const interval = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 4000);

    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(interval);
    };
  }, [emblaApi]);

  return (
    <section className="py-24 bg-[#FAFAF7] relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground font-medium"
          >
            Real reviews from real customers via WhatsApp
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-4">
              {REVIEWS.map((review, i) => (
                <div key={i} className="flex-[0_0_85%] md:flex-[0_0_50%] lg:flex-[0_0_40%] pl-4 min-w-0">
                  <div className="bg-[#202C33] rounded-[24px] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-full">
                    {/* Fake WhatsApp Header */}
                    <div className="bg-[#202C33] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                      <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-lg">
                        {review.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm">{review.name}</div>
                        <div className="flex items-center gap-1 text-white/60 text-xs">
                          <CheckCircle className="w-3 h-3 text-secondary fill-secondary/20" />
                          Verified Customer
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className="w-3.5 h-3.5 text-accent fill-accent" />
                        ))}
                      </div>
                    </div>
                    
                    {/* The actual screenshot */}
                    <div className="p-4 bg-[#0B141A] flex-1 flex items-center justify-center relative">
                      {/* Chat bg pattern subtle hint */}
                      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://i.pinimg.com/originals/8f/ba/cb/8fbacbd464e996966eb9d4a6b7a9c21e.jpg')] bg-repeat z-0" />
                      
                      <div className="relative z-10 w-full rounded-xl overflow-hidden shadow-lg border border-white/5">
                        <img 
                          src={review.img} 
                          alt="Customer Review" 
                          className="w-full h-auto object-cover max-h-[400px] object-top"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? 'bg-primary w-8' : 'bg-border hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
