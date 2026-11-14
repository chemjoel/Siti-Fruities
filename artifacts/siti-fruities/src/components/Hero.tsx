import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useHeroSlides } from '@/hooks/useSiteMedia';

const HERO_PARFAIT_IMAGES = [
  {
    src: '/assets/IMG_8455_parfait_bowls.jpg',
    title: 'VVIP Exotic Parfait Bowls',
    badge: '⭐ #1 Signature Parfait',
    desc: 'Layered with fresh kiwi, strawberries, grapes & Greek yogurt',
  },
  {
    src: '/assets/IMG_6519_parfait_500ml.jpg',
    title: 'Medium 500ml Parfait Cups',
    badge: '🥝 Fresh Farm Fruits',
    desc: 'Pure probiotic Greek yogurt with crunchy nut toppings',
  },
  {
    src: '/assets/IMG_1639_parfait_1l.jpg',
    title: '1 Litre Ay Bowl Parfait',
    badge: '✨ Loaded Feast',
    desc: 'Generous layers of premium fruits, raisins & honey',
  },
  {
    src: '/assets/IMG_8435_parfait_multi.jpg',
    title: 'Fresh Daily Parfait Lineup',
    badge: '🌿 100% Probiotic',
    desc: 'Handcrafted daily in our Ile-Ife kitchen',
  },
];

export default function Hero() {
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { data: heroSlides = [], isLoading } = useHeroSlides();
  const visibleHeroSlides = heroSlides.slice(0, 5);

  useEffect(() => {
    if (isPaused || HERO_PARFAIT_IMAGES.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % HERO_PARFAIT_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeParfait = HERO_PARFAIT_IMAGES[currentHeroIdx];

  return (
    <section className="cream-wave-bottom relative pt-24 md:pt-28 pb-16 overflow-hidden bg-[#f8f4ee]">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:items-center">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-2 md:grid-cols-4"
            >
              {isLoading && visibleHeroSlides.length === 0 ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className={`animate-pulse rounded-2xl bg-[#f0e5d8] ${index === 0 ? 'col-span-2 aspect-[1.7/1] md:col-span-2 md:row-span-2 md:aspect-auto' : 'aspect-square'}`}
                  />
                ))
              ) : (
                visibleHeroSlides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    className={`${index === 0 ? 'col-span-2 aspect-[1.7/1] md:col-span-2 md:row-span-2 md:aspect-auto' : 'aspect-square'} overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5`}
                  >
                    <img
                      src={slide.image_url}
                      alt={slide.alt_text}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>

          <div
            className="w-full max-w-[540px] mx-auto lg:mx-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-[28px] border-[3px] border-white bg-white shadow-[0_20px_60px_rgba(16,39,25,0.12)]"
            >
              <div className="relative aspect-[4/3.4] overflow-hidden bg-[#12240E]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHeroIdx}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 1.0, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <img
                      src={activeParfait.src}
                      alt={activeParfait.title}
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-lg sm:text-xs">
                      <Sparkles className="h-3.5 w-3.5 fill-white/20" />
                      <span>{activeParfait.badge}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-base font-bold leading-snug drop-shadow-md sm:text-lg">
                        {activeParfait.title}
                      </h3>
                      <p className="mt-1 max-w-[26rem] text-[11px] leading-relaxed text-white/90 drop-shadow sm:text-xs">
                        {activeParfait.desc}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-md">
                  {HERO_PARFAIT_IMAGES.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentHeroIdx(dotIdx)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentHeroIdx === dotIdx ? 'w-4 bg-primary' : 'w-1.5 bg-white/60 hover:bg-white'
                      }`}
                      aria-label={`Show parfait photo ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center border-t border-[#e7d9c6] bg-[#f6f0e8] px-4 py-3 text-center text-base font-bold tracking-tight text-[#102719] sm:text-xl">
                The Gold Standard for Parfait
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
