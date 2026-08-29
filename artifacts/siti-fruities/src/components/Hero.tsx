import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles } from 'lucide-react';

const heroBgImg = '/assets/Screenshot_20260729-212635_1785360049633.jpg';

// Strongest real SITI FRUITIES parfait photographs
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

const secondaryParfaitImg = '/assets/IMG_8428_parfait_stack.jpg';
const smoothieImg = '/assets/Screenshot_20260729-212748_1785360013740.jpg';

export default function Hero() {
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Subtle, slow automatic rotation of hero parfait photos (every 5.5s)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % HERO_PARFAIT_IMAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeParfait = HERO_PARFAIT_IMAGES[currentHeroIdx];

  return (
    <section className="relative min-h-[90dvh] pt-24 md:pt-32 pb-16 overflow-hidden flex items-center">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImg}
          alt="Siti Fruities hero background"
          className="w-full h-full object-cover object-center"
        />
        {/* Layered gradient overlay: dark-left fade + warm atmospheric tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1F0A]/90 via-[#0F1F0A]/60 to-[#0F1F0A]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F0A]/70 via-transparent to-[#0F1F0A]/30" />
      </div>

      {/* Atmospheric glowing food light blobs */}
      <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[130px] z-0 mix-blend-screen pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[150px] z-0 mix-blend-screen pointer-events-none" />

      {/* Floating subtle food accent particles */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {/* Floating strawberry particle */}
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, 8, 0], rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute top-20 left-[8%] w-8 h-8 opacity-40 hidden lg:block"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
            <path d="M12 2C11.5 2 7 6 7 11C7 16 9.5 22 12 22C14.5 22 17 16 17 11C17 6 12.5 2 12 2Z" fill="#EF4444" />
            <path d="M10.5 4.5C11 4 11.5 3 12 3C12.5 3 13 4 13.5 4.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* Floating mint leaf particle */}
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -10, 0], rotate: [0, -25, 0] }}
          transition={{ repeat: Infinity, duration: 8.5, ease: "easeInOut" }}
          className="absolute bottom-28 left-[45%] w-7 h-7 opacity-35 hidden lg:block"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
            <path d="M2 22C2 22 7 21 11 17C16 12 22 8 22 2C22 2 16 3 11 8C7 12 2 22 2 22Z" fill="#10B981" />
          </svg>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 relative z-10">
        
        {/* Text Content */}
        <div className="flex-1 w-full max-w-2xl text-center lg:text-left relative z-10 pt-6 lg:pt-0">
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

        {/* Desktop Showcase: Dynamic Rotating Hero Parfait Card & Accents */}
        <div 
          className="flex-1 w-full relative h-[420px] lg:h-[580px] hidden md:block"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Hero Parfait Showcase Card with Smooth Crossfade */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.9, delay: 0.2, type: 'spring' }}
            className="absolute top-6 right-6 lg:right-4 w-60 lg:w-80 h-64 lg:h-84 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/95 z-20 group bg-[#0F1F0A]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="w-full h-full relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroIdx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={activeParfait.src} 
                    alt={activeParfait.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  
                  {/* Floating Appetizing Badge */}
                  <div className="absolute top-3.5 left-3.5 bg-primary/95 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-white/20" />
                    <span>{activeParfait.badge}</span>
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-bold text-sm leading-tight drop-shadow">{activeParfait.title}</h4>
                    <p className="text-[11px] text-white/80 line-clamp-1 leading-snug">{activeParfait.desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Dots */}
              <div className="absolute bottom-2 right-3 z-30 flex items-center gap-1">
                {HERO_PARFAIT_IMAGES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentHeroIdx(dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentHeroIdx === dotIdx ? 'w-4 bg-primary' : 'w-1.5 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Show parfait ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
 
          {/* Secondary Floating Parfait Accent Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 7 }}
            transition={{ duration: 0.9, delay: 0.4, type: 'spring' }}
            className="absolute bottom-6 right-40 lg:right-28 w-52 lg:w-64 h-44 lg:h-52 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/95 z-30 group bg-[#0F1F0A]"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full h-full relative"
            >
              <img src={secondaryParfaitImg} alt="Siti Fruities Exotic Parfaits Range" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                Fresh Daily
              </div>
            </motion.div>
          </motion.div>
 
          {/* Secondary Floating Smoothie Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
            animate={{ opacity: 1, scale: 1, rotate: 12 }}
            transition={{ duration: 0.9, delay: 0.6, type: 'spring' }}
            className="absolute top-1/2 -left-2 lg:left-8 w-40 lg:w-48 h-52 lg:h-60 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/95 z-10 group bg-[#0F1F0A]"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="w-full h-full relative"
            >
              <img src={smoothieImg} alt="Nutty Choco Smoothie" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                Chilled Smoothies
              </div>
            </motion.div>
          </motion.div>
        </div>
 
        {/* Mobile Showcase: Rotating Parfait Card */}
        <div 
          className="w-full relative h-[270px] md:hidden mt-2"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/95 z-20 bg-[#0F1F0A]"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="w-full h-full relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroIdx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={activeParfait.src} 
                    alt={activeParfait.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-primary/95 text-white px-3 py-0.5 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{activeParfait.badge}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-bold text-xs leading-tight drop-shadow">{activeParfait.title}</h4>
                    <p className="text-[10px] text-white/80 line-clamp-1">{activeParfait.desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Mobile Dots */}
              <div className="absolute bottom-2 right-2.5 z-30 flex items-center gap-1">
                {HERO_PARFAIT_IMAGES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentHeroIdx(dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentHeroIdx === dotIdx ? 'w-3.5 bg-primary' : 'w-1.5 bg-white/60'
                    }`}
                    aria-label={`Slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
