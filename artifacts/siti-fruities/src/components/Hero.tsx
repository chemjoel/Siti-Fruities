import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { StrawberryDecoration, KiwiSliceDecoration, MintLeafDecoration, BlueberryDecoration, MangoDecoration } from './FruitAtmosphere';

const heroBgImg = '/assets/Screenshot_20260729-212635_1785360049633.jpg';

// Real high-quality SITI FRUITIES parfait photographs
const HERO_PARFAIT_IMAGES = [
  {
    src: '/assets/IMG_8455_parfait_bowls.jpg',
    title: 'VVIP Exotic Parfait Bowls',
    badge: '⭐ #1 Signature Parfait',
    desc: 'Layered with fresh kiwi, strawberries, grapes & Greek yogurt'
  },
  {
    src: '/assets/IMG_6519_parfait_500ml.jpg',
    title: 'Medium 500ml Parfait Cups',
    badge: '🥝 Fresh Farm Fruits',
    desc: 'Pure probiotic Greek yogurt with crunchy nut toppings'
  },
  {
    src: '/assets/IMG_1639_parfait_1l.jpg',
    title: '1 Litre Ay Bowl Parfait',
    badge: '✨ Loaded Feast',
    desc: 'Generous layers of premium fruits, raisins & honey'
  },
  {
    src: '/assets/IMG_8435_parfait_multi.jpg',
    title: 'Fresh Daily Parfait Lineup',
    badge: '🌿 100% Probiotic',
    desc: 'Handcrafted daily in our Ile-Ife kitchen'
  }
];

export default function Hero() {
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic rotation of hero parfait photos (1.0s transition duration)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % HERO_PARFAIT_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeParfait = HERO_PARFAIT_IMAGES[currentHeroIdx];

  return (
    <section className="relative min-h-[92dvh] pt-24 md:pt-32 pb-16 overflow-hidden flex items-center bg-[#0C1B08]">
      {/* Background with warm atmospheric gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImg}
          alt="Siti Fruities hero atmosphere"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1B08] via-[#0C1B08]/85 to-[#0C1B08]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B08] via-transparent to-[#0C1B08]/60" />
      </div>

      {/* Atmospheric glowing food lighting */}
      <div className="absolute top-1/4 -right-10 w-[550px] h-[550px] bg-primary/25 rounded-full blur-[140px] z-0 mix-blend-screen pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-[550px] h-[550px] bg-amber-500/20 rounded-full blur-[150px] z-0 mix-blend-screen pointer-events-none" />

      {/* Clearly visible decorative fruit elements in outer margins — safely away from text & CTAs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute top-14 left-3 lg:left-6 opacity-75 hidden xl:block">
          <StrawberryDecoration size={54} />
        </div>
        <div className="absolute bottom-12 left-3 lg:left-6 opacity-70 hidden xl:block">
          <KiwiSliceDecoration size={58} />
        </div>
        <div className="absolute top-16 right-4 lg:right-8 opacity-75 hidden lg:block">
          <MangoDecoration size={54} />
        </div>
        <div className="absolute bottom-12 right-6 lg:right-12 opacity-80 hidden md:block">
          <BlueberryDecoration size={52} />
        </div>
        <div className="absolute top-1/2 right-2 lg:right-4 -translate-y-1/2 opacity-70 hidden 2xl:block">
          <MintLeafDecoration size={44} />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 relative z-10">
        
        {/* Text Content — Protected z-index and max-width */}
        <div className="flex-1 w-full max-w-xl lg:max-w-[540px] text-center lg:text-left relative z-20 pt-4 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Fresh orders available now · Ile-Ife, Osun State
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6"
          >
            Eat Healthy.<br />
            <span className="text-primary relative inline-block">
              Feel Amazing.
              <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-5 text-primary/40" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M0,10 Q100,20 200,5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg md:text-xl text-white/85 font-medium mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Signature Exotic Parfaits, rich Greek Yogurt, natural smoothies, fresh juices, and delicious healthy meals handcrafted in Ile-Ife.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
          >
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-base sm:text-lg font-bold bg-primary hover:bg-primary/90 text-white w-full sm:w-auto shadow-xl shadow-primary/40 hover:shadow-primary/60 transition-all hover:-translate-y-0.5 active:scale-95"
              onClick={scrollToProducts}
            >
              Order Now
            </Button>
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-base sm:text-lg font-bold bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white hover:text-foreground w-full sm:w-auto transition-all"
              onClick={scrollToProducts}
            >
              Browse Menu
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="flex flex-wrap justify-center lg:justify-start gap-2.5 text-xs sm:text-sm font-semibold text-white"
          >
            {[
              "Signature Parfaits", 
              "Fresh Daily", 
              "Premium Ingredients", 
              "100% Nutritious & Delicious"
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/20 shrink-0" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Showcase: Prominent Hero Parfait Centerpiece */}
        <div 
          className="flex-1 w-full max-w-[540px] lg:max-w-[600px] relative hidden md:flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Glowing backdrop halo */}
          <div className="absolute inset-4 bg-gradient-to-tr from-primary/30 via-secondary/20 to-amber-400/20 rounded-[40px] blur-2xl -z-10" />

          {/* Main Visual Parfait Hero Showcase Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full aspect-[4/3.4] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white/90 bg-[#12240E] relative group"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroIdx}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <img 
                  src={activeParfait.src} 
                  alt={activeParfait.title} 
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                
                {/* Floating Signature Badge */}
                <div className="absolute top-4 left-4 bg-primary text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-1.5 border border-white/20">
                  <Sparkles className="w-4 h-4 fill-white/20" />
                  <span>{activeParfait.badge}</span>
                </div>

                {/* Parfait Caption & Info */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="font-bold text-lg sm:text-xl leading-snug drop-shadow-md text-white">
                    {activeParfait.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed drop-shadow">
                    {activeParfait.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Navigation Dots */}
            <div className="absolute bottom-4 right-5 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {HERO_PARFAIT_IMAGES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentHeroIdx(dotIdx)}
                  className={`h-2 rounded-full transition-all ${
                    currentHeroIdx === dotIdx ? 'w-5 bg-primary' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Show parfait photo ${dotIdx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
 
        {/* Mobile Showcase: Prominent Centered Parfait Hero */}
        <div 
          className="w-full relative md:hidden mt-4"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[340px] aspect-[4/3.4] mx-auto rounded-[28px] overflow-hidden shadow-2xl border-4 border-white/90 bg-[#12240E] relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroIdx}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <img 
                  src={activeParfait.src} 
                  alt={activeParfait.title} 
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1 border border-white/20">
                  <Sparkles className="w-3 h-3" />
                  <span>{activeParfait.badge}</span>
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <h4 className="font-bold text-sm leading-tight drop-shadow-md">{activeParfait.title}</h4>
                  <p className="text-[11px] text-white/90 line-clamp-1 mt-0.5">{activeParfait.desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Dots */}
            <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
              {HERO_PARFAIT_IMAGES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentHeroIdx(dotIdx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentHeroIdx === dotIdx ? 'w-4 bg-primary' : 'w-1.5 bg-white/60'
                  }`}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
