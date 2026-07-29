import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Ban, Sunrise, ChefHat, Gift, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Sourced fresh daily, nothing frozen. We believe in the power of real food."
  },
  {
    icon: Ban,
    title: "No Artificial Additives",
    desc: "Pure, clean, whole food ingredients. No preservatives or hidden sugars."
  },
  {
    icon: Sunrise,
    title: "Prepared Daily",
    desc: "Made fresh every morning in our kitchen to ensure maximum nutrient retention."
  },
  {
    icon: ChefHat,
    title: "Premium Recipes",
    desc: "Crafted with love and expertise by our culinary team for perfect balance."
  },
  {
    icon: Gift,
    title: "Beautiful Packaging",
    desc: "Perfect for gifts and special occasions. Healthy food should look stunning."
  },
  {
    icon: Users,
    title: "For Everyone",
    desc: "Individuals, families, corporate events and parties. We cater to all."
  }
];

export default function WhySiti() {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Decorative bg elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[80px]" />
      
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-border hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-secondary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
