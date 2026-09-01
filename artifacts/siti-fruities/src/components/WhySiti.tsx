import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Ban, Sunrise, ChefHat, Gift, Users } from 'lucide-react';
import { 
  StrawberryDecoration, 
  StrawberryHalfDecoration,
  MintLeafDecoration, 
  KiwiSliceDecoration,
  BlueberryDecoration,
  MangoDecoration,
  GrapeClusterDecoration,
  WatermelonSliceDecoration,
  OrangeSliceDecoration,
  PineappleSliceDecoration,
  YoghurtSwirlDecoration,
} from './FruitAtmosphere';

const parfaitImg = '/assets/Screenshot_20260729-212242_1785360049881.jpg';
const yoghurtImg = '/assets/Screenshot_20260729-212331_1785360049844.jpg';
const chefImg = '/assets/Screenshot_20260729-212642_1785360049574.jpg';
const cateringEventImg = '/assets/Screenshot_20260729-212635_1785360049633.jpg';
const treatBoxImg = '/assets/Screenshot_20260729-212815_1785360013704.jpg';
const hamperImg = '/assets/Screenshot_20260729-213638_1785360173839.jpg';

const FEATURES = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Sourced fresh daily, nothing frozen. We believe in the power of real food.",
    img: parfaitImg,
  },
  {
    icon: Ban,
    title: "No Artificial Additives",
    desc: "Pure, clean, whole food ingredients. No preservatives or hidden sugars.",
    img: yoghurtImg,
  },
  {
    icon: Sunrise,
    title: "Prepared Daily",
    desc: "Made fresh every morning in our kitchen to ensure maximum nutrient retention.",
    img: chefImg,
  },
  {
    icon: ChefHat,
    title: "Premium Recipes",
    desc: "Crafted with love and expertise by our culinary team for perfect balance.",
    img: cateringEventImg,
  },
  {
    icon: Gift,
    title: "Beautiful Packaging",
    desc: "Perfect for gifts and special occasions. Healthy food should look stunning.",
    img: treatBoxImg,
  },
  {
    icon: Users,
    title: "For Everyone",
    desc: "Individuals, families, corporate events and parties. We cater to all.",
    img: hamperImg,
  }
];

export default function WhySiti() {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[80px]" />
      
      {/* ================================================================
          FRUIT & YOGHURT ATMOSPHERE — visible on ALL screen sizes
         ================================================================ */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">

        {/* ── TOP EDGE ── */}
        <div className="absolute -top-3 -left-3 opacity-65" style={{ transform: 'rotate(-18deg)' }}>
          <OrangeSliceDecoration size={80} />
        </div>
        <div className="absolute top-4 left-[26%] opacity-52" style={{ transform: 'rotate(6deg)' }}>
          <WatermelonSliceDecoration size={66} />
        </div>
        <div className="absolute -top-4 right-6 lg:right-16 opacity-68" style={{ transform: 'rotate(14deg)' }}>
          <GrapeClusterDecoration size={78} />
        </div>

        {/* ── LEFT SIDE ── */}
        <div className="absolute top-[18%] -left-3 opacity-70" style={{ transform: 'rotate(-6deg)' }}>
          <PineappleSliceDecoration size={70} />
        </div>
        <div className="absolute top-[44%] -left-8 opacity-48" style={{ transform: 'rotate(0deg)' }}>
          <YoghurtSwirlDecoration size={96} />
        </div>
        <div className="absolute bottom-[16%] -left-3 opacity-72" style={{ transform: 'rotate(-10deg)' }}>
          <KiwiSliceDecoration size={68} />
        </div>

        {/* ── RIGHT SIDE ── */}
        <div className="absolute top-[20%] -right-2 opacity-73" style={{ transform: 'rotate(10deg)' }}>
          <BlueberryDecoration size={64} />
        </div>
        <div className="absolute top-[42%] -right-4 opacity-63" style={{ transform: 'rotate(22deg)' }}>
          <StrawberryHalfDecoration size={82} />
        </div>
        <div className="absolute bottom-[22%] right-3 lg:right-10 opacity-60 hidden sm:block" style={{ transform: 'rotate(-8deg)' }}>
          <MangoDecoration size={60} />
        </div>

        {/* ── BOTTOM EDGE ── */}
        <div className="absolute -bottom-4 -right-3 opacity-68" style={{ transform: 'rotate(15deg)' }}>
          <StrawberryDecoration size={78} />
        </div>
        <div className="absolute bottom-1 left-[40%] opacity-52 hidden sm:block" style={{ transform: 'rotate(-8deg)' }}>
          <MintLeafDecoration size={56} />
        </div>
        <div className="absolute -bottom-2 left-[12%] opacity-58" style={{ transform: 'rotate(4deg)' }}>
          <GrapeClusterDecoration size={64} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4"
          >
            Why Choose Us?
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-secondary mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-default h-64 md:h-72"
            >
              {/* Background image */}
              <img
                src={feature.img}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient overlay — dark at bottom, lighter at top */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/85 transition-all duration-300" />

              {/* Content anchored to bottom */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                {/* Icon badge */}
                <div className="w-11 h-11 bg-primary/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:bg-primary transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1.5 leading-snug">{feature.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
