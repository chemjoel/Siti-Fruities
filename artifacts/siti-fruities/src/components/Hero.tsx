import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
const heroBgImg = '/assets/Screenshot_20260729-212635_1785360049633.jpg';
const parfaitImg = '/assets/Screenshot_20260729-212242_1785360049881.jpg';
const treatBoxImg = '/assets/Screenshot_20260729-212815_1785360013704.jpg';
const smoothieImg = '/assets/Screenshot_20260729-212748_1785360013740.jpg';

export default function Hero() {
  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90dvh] pt-24 md:pt-32 pb-16 overflow-hidden flex items-center">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 -z-20">
        <img
          src={heroBgImg}
          alt="Siti Fruities hero background"
          className="w-full h-full object-cover object-center"
        />
        {/* Layered gradient overlay: dark-left fade + overall warm tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1F0A]/85 via-[#0F1F0A]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F0A]/60 via-transparent to-[#0F1F0A]/20" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] -z-10 mix-blend-screen" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] -z-10 mix-blend-screen" />

      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Text Content */}
        <div className="flex-1 w-full max-w-2xl text-center lg:text-left z-10 pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6"
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
            <span className="text-primary relative">
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
            className="text-lg md:text-xl text-white/80 font-medium mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Healthy meals, smoothies, parfaits, fresh juices and beautifully curated healthy gift boxes made with premium ingredients in Ile-Ife.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
          >
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-white w-full sm:w-auto shadow-xl shadow-primary/40 hover:shadow-primary/60 transition-all hover:-translate-y-1"
              onClick={scrollToProducts}
            >
              Order Now
            </Button>
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg font-bold bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white hover:text-foreground w-full sm:w-auto transition-all"
              onClick={scrollToProducts}
            >
              Browse Menu
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm md:text-base font-semibold text-white"
          >
            {[
              "Fresh Daily", 
              "Premium Ingredients", 
              "Made To Order", 
              "Healthy Never Tasted This Good"
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-primary fill-primary/20" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating Images (Desktop only) */}
        <div className="flex-1 w-full relative h-[400px] lg:h-[600px] hidden md:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: -5 }}
            transition={{ duration: 1, delay: 0.2, type: 'spring' }}
            className="absolute top-10 right-10 lg:right-0 w-48 lg:w-64 h-48 lg:h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 z-20"
          >
            <img src={parfaitImg} alt="Exotic Parfait" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 8 }}
            transition={{ duration: 1, delay: 0.4, type: 'spring' }}
            className="absolute bottom-10 right-40 lg:right-24 w-56 lg:w-72 h-40 lg:h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 z-30"
          >
            <img src={treatBoxImg} alt="Deluxe Treat Box" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
            animate={{ opacity: 1, scale: 1, rotate: 12 }}
            transition={{ duration: 1, delay: 0.6, type: 'spring' }}
            className="absolute top-1/2 -left-4 lg:left-10 w-40 lg:w-48 h-56 lg:h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 z-10"
          >
            <img src={smoothieImg} alt="Nutty Choco Smoothie" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Mobile floating image */}
        <div className="w-full relative h-[260px] md:hidden mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 z-20"
          >
            <img src={parfaitImg} alt="Exotic Parfait" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
