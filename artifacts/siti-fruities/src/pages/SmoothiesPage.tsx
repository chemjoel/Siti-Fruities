import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard, { Product } from '@/components/ProductCard';
import { Milk, GlassWater, Sparkles, Apple, Leaf, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const SMOOTHIE_PRODUCTS: Product[] = [
  {
    productId: 'milk-mix',
    name: 'Milk Mix',
    description: 'Banana, evaporated milk and your choice of watermelon or pineapple.',
    basePrice: 2000,
    placeholderIcon: Milk,
    placeholderGradient: 'from-orange-50 to-amber-100 border-orange-200/50 text-orange-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 2000 }
        ]
      },
      {
        name: 'Fruit Choice',
        choices: [
          { value: 'Watermelon' },
          { value: 'Pineapple' }
        ]
      }
    ]
  },
  {
    productId: 'yoghurt-mix',
    name: 'Yoghurt Mix',
    description: 'Banana, sweetened yoghurt and pineapple.',
    basePrice: 2000,
    placeholderIcon: GlassWater,
    placeholderGradient: 'from-emerald-50 to-teal-100 border-emerald-200/50 text-emerald-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 2000 }
        ]
      }
    ]
  },
  {
    productId: 'nutty-chocolate',
    name: 'Nutty Chocolate',
    description: 'Banana, peanut butter, Greek yoghurt, watermelon and chocolate chips.',
    basePrice: 2300,
    placeholderIcon: Sparkles,
    placeholderGradient: 'from-yellow-50 to-amber-100 border-yellow-200/50 text-amber-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 2200 }
        ]
      }
    ]
  },
  {
    productId: 'so-creamy',
    name: 'So Creamy',
    description: 'Dates, peanut butter, Greek yoghurt, banana, cinnamon and watermelon.',
    basePrice: 2500,
    placeholderIcon: GlassWater,
    placeholderGradient: 'from-pink-50 to-rose-100 border-pink-200/50 text-rose-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 2500 }
        ]
      }
    ]
  },
  {
    productId: 'ginger-blast',
    name: 'Ginger Blast',
    description: 'A delicious blend of banana, fresh ginger and pineapple.',
    basePrice: 1800,
    placeholderIcon: Sparkles,
    placeholderGradient: 'from-orange-50 to-amber-100 border-orange-200/50 text-orange-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 1700 }
        ]
      }
    ]
  },
  {
    productId: 'strawberry-smoothie',
    name: 'Strawberry',
    description: 'Fresh strawberries, grapes, apple, banana and your choice of watermelon or pineapple.',
    basePrice: 2500,
    placeholderIcon: GlassWater,
    placeholderGradient: 'from-red-50 to-pink-100 border-red-200/50 text-red-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 2500 }
        ]
      },
      {
        name: 'Fruit Choice',
        choices: [
          { value: 'Watermelon' },
          { value: 'Pineapple' }
        ]
      }
    ]
  },
  {
    productId: 'fruity-smoothie',
    name: 'Fruity',
    description: 'Apple, grapes, pineapple, watermelon and banana.',
    basePrice: 1800,
    placeholderIcon: Apple,
    placeholderGradient: 'from-yellow-50 to-amber-100 border-yellow-200/50 text-amber-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 1700 }
        ]
      }
    ]
  },
  {
    productId: 'healthy-green',
    name: 'Healthy Green',
    description: 'Banana, apple, pumpkin leaf, lemon juice and pineapple.',
    basePrice: 2000,
    placeholderIcon: Leaf,
    placeholderGradient: 'from-emerald-50 to-green-100 border-emerald-200/50 text-emerald-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 2000 }
        ]
      }
    ]
  }
];

export default function SmoothiesPage() {
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
              Fresh Smoothies
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Freshly blended combinations made with fruits, yoghurt and carefully selected ingredients.
            </p>
          </div>
        </section>

        {/* Product Catalogue Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12 pb-4 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold font-serif text-foreground">Catalogue Menu</h2>
                <p className="text-sm text-muted-foreground font-medium">Browse our selection and add to your order</p>
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20 shrink-0">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Freshly Blended Daily</span>
              </div>
            </div>

            {/* Responsive grid matching homepage design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {SMOOTHIE_PRODUCTS.map((product, idx) => (
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
        </section>
      </main>

      <Footer />
      <CartPanel />
      <WhatsAppButton />
    </div>
  );
}
