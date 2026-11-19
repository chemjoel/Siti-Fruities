import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHeroSlides } from '@/hooks/useSiteMedia';

const HERO_TAGLINE = 'The ORIGINAL Parfait Brand';
const HERO_WELCOME = 'Welcome to Siti Fruities. Fresh, healthy treats made with love in Ile-Ife.';

const HERO_PARFAIT_IMAGES = [
  '/assets/IMG_8455_parfait_bowls.jpg',
  '/assets/IMG_6519_parfait_500ml.jpg',
  '/assets/IMG_1639_parfait_1l.jpg',
  '/assets/IMG_8435_parfait_multi.jpg',
];

export default function Hero() {
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { data: heroSlides = [] } = useHeroSlides();

  useEffect(() => {
    if (isPaused || HERO_PARFAIT_IMAGES.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % HERO_PARFAIT_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="cream-wave-bottom relative isolate overflow-hidden bg-[#102719] px-4 pb-24 pt-28 text-white md:px-8 md:pt-32">
      <div className="pointer-events-none absolute -right-20 -top-20 z-0 h-64 w-64 rotate-12 rounded-[40%] bg-[#F4A340]/20 sm:h-80 sm:w-80" />

      <div className="container relative z-10 mx-auto max-w-5xl">
        <div
          className="relative mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border-4 border-white bg-white/10 shadow-2xl sm:aspect-[16/9]">
            {heroSlides[0] ? (
              <img
                src={heroSlides[0].image_url}
                alt={heroSlides[0].alt_text}
                loading="eager"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-white/10" />
            )}
          </div>

          <div className="absolute -bottom-5 right-0 z-20 w-[48%] max-w-[240px] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl sm:right-6">
            <div className="relative aspect-[4/3.4] overflow-hidden bg-[#102719]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentHeroIdx}
                  src={HERO_PARFAIT_IMAGES[currentHeroIdx]}
                  alt="Signature Parfait"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[9px] font-bold text-white shadow sm:left-3 sm:top-3 sm:text-[10px]">
                Signature Parfait
              </div>

              <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1">
                {HERO_PARFAIT_IMAGES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentHeroIdx(dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentHeroIdx === dotIdx ? 'w-4 bg-primary' : 'w-1.5 bg-white/70 hover:bg-white'
                    }`}
                    aria-label={`Show parfait photo ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            {HERO_TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {HERO_WELCOME}
          </p>
          <button
            type="button"
            onClick={scrollToProducts}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-bold text-white shadow-lg transition-colors hover:bg-primary/90 active:scale-95"
          >
            Order Parfait
          </button>
        </motion.div>
      </div>
    </section>
  );
}
