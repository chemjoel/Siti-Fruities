import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/useSiteMedia';

export default function Testimonials() {
  const { data: testimonials = [] } = useTestimonials();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(interval);
    };
  }, [emblaApi]);

  return (
    <section className="relative bg-background py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 font-serif text-4xl font-bold text-foreground md:text-5xl"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg font-medium text-muted-foreground"
          >
            Real reviews from real customers via WhatsApp
          </motion.p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="cursor-grab overflow-hidden active:cursor-grabbing" ref={emblaRef}>
            <div className="-ml-4 flex">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="min-w-0 flex-[0_0_85%] pl-4 md:flex-[0_0_50%] lg:flex-[0_0_40%]">
                  <div className="flex h-full items-center justify-center overflow-hidden rounded-[24px] border border-border bg-card p-3 shadow-xl">
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.alt_text}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className="h-[420px] max-h-[60vh] w-full rounded-xl object-contain sm:h-[480px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? 'w-8 bg-primary' : 'w-2.5 bg-border hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
