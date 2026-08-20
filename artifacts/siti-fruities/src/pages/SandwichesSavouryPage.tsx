import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard, { Product } from '@/components/ProductCard';
import { Sparkles, Leaf, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const SANDWICH_PRODUCTS: Product[] = [
  {
    productId: 'chicken-sandwich',
    name: 'Chicken Sandwich',
    description: '3 sliced breads, cabbage, carrot, in-house cream and chicken.',
    basePrice: 3000,
    image: '/assets/IMG_1940_sandwich.jpg',
    placeholderIcon: Sparkles,
    placeholderGradient: 'from-yellow-50 to-amber-100 border-yellow-200/50 text-amber-600'
  },
  {
    productId: 'beef-sandwich',
    name: 'Beef Sandwich',
    description: '3 sliced breads, cabbage, carrot, in-house cream and beef.',
    basePrice: 3000,
    image: '/assets/IMG_1940_sandwich.jpg',
    placeholderIcon: Sparkles,
    placeholderGradient: 'from-amber-50 to-orange-100 border-orange-200/50 text-orange-600'
  },
  {
    productId: 'chicken-egg-sandwich',
    name: 'Chicken & Egg Sandwich',
    description: '3 sliced breads, cabbage, carrot, in-house cream, chicken and egg.',
    basePrice: 5000,
    image: '/assets/IMG_1940_sandwich.jpg',
    placeholderIcon: Sparkles,
    placeholderGradient: 'from-orange-50 to-red-100 border-orange-200/50 text-red-600',
    options: [
      {
        name: 'Egg Preparation',
        choices: [
          { value: 'Fried' },
          { value: 'Boiled' }
        ]
      }
    ]
  }
];

const SAVOURY_PRODUCTS: Product[] = [
  {
    productId: 'cheesesteak',
    name: 'Cheesesteak',
    description: 'A loaf of bread, mozzarella cheese, stir-fried beef and bell peppers topped with our in-house bread sauce.',
    basePrice: 9000,
    placeholderIcon: Sparkles,
    placeholderGradient: 'from-red-50 to-pink-100 border-red-200/50 text-red-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: 'Small' },
          { value: 'Medium', priceModifier: 4000 }
        ]
      }
    ]
  },
  {
    productId: 'healthy-chicken-salad',
    name: 'Healthy Chicken Salad',
    description: 'Lettuce, carrot, cucumber, bell peppers, purple cabbage, red grapes, green apple, sweetcorn, raisins, grilled chicken and salad cream.',
    basePrice: 5000,
    placeholderIcon: Leaf,
    placeholderGradient: 'from-emerald-50 to-green-100 border-emerald-200/50 text-emerald-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '300ml' },
          { value: '400ml', priceModifier: 2500 }
        ]
      }
    ]
  }
];

export default function SandwichesSavouryPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        {/* Banner Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-emerald-800 to-green-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-4 leading-tight">
              Sandwiches & Savoury
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Fresh, satisfying savoury options made for a quick meal, a healthy bite or something a little more filling.
            </p>
          </div>
        </section>

        {/* Product Catalogue Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            
            {/* Section A: Sandwiches */}
            <div className="mb-16">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Sandwiches</h2>
                  <p className="text-sm text-muted-foreground font-medium">Freshly made signature sandwiches on sliced bread</p>
                </div>
                <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20 shrink-0">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Freshly Assembled Daily</span>
                </div>
              </div>

              {/* Grid for Sandwiches */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {SANDWICH_PRODUCTS.map((product, idx) => (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Section B: Savoury & Salads */}
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Savoury & Salads</h2>
                  <p className="text-sm text-muted-foreground font-medium">Filling salads and hearty savoury bread loaves</p>
                </div>
              </div>

              {/* Grid for Savoury & Salads */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {SAVOURY_PRODUCTS.map((product, idx) => (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
      <CartPanel />
      <WhatsAppButton />
    </div>
  );
}
