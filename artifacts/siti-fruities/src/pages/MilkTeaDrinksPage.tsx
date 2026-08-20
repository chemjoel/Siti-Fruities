import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard, { Product } from '@/components/ProductCard';
import { Coffee, GlassWater, Milk, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const MILK_TEA_PRODUCTS: Product[] = [
  {
    productId: 'matcha-milk-tea',
    name: 'MATCHA MILK TEA',
    description: 'Premium Matcha Flavor with Chewy Tapioca Pearls',
    basePrice: 8500,
    image: '/assets/IMG_2326_bubble_tea.jpg',
    placeholderIcon: Coffee,
    placeholderGradient: 'from-emerald-50 to-teal-100 border-emerald-200/50 text-emerald-600'
  },
  {
    productId: 'taro-milk-tea',
    name: 'TARO MILK TEA',
    description: 'Creamy Taro Flavored Tea, with chewy Tapioca Pearls',
    basePrice: 8000,
    image: '/assets/IMG_2326_bubble_tea.jpg',
    placeholderIcon: Coffee,
    placeholderGradient: 'from-purple-50 to-indigo-100 border-indigo-200/50 text-indigo-600'
  },
  {
    productId: 'strawberry-milk-tea',
    name: 'STRAWBERRY MILK TEA',
    description: 'Sweet Strawberry Delight Tea, with chewy Tapioca Pearls',
    basePrice: 8500,
    image: '/assets/IMG_2364_bubble_tea_duo.jpg',
    placeholderIcon: Coffee,
    placeholderGradient: 'from-pink-50 to-rose-100 border-rose-200/50 text-rose-600'
  },
  {
    productId: 'chocolate-milk-tea',
    name: 'CHOCOLATE MILK TEA',
    description: 'Rich Chocolate Flavored Bubble Tea with chewy Tapioca Pearls',
    basePrice: 8500,
    image: '/assets/IMG_2326_bubble_tea.jpg',
    placeholderIcon: Coffee,
    placeholderGradient: 'from-[#E6CCB2]/40 to-[#B08968]/30 border-[#B08968]/20 text-[#6F4E37]'
  },
  {
    productId: 'vanilla-milk-tea',
    name: 'VANILLA MILK TEA',
    description: 'Smooth and Rich Vanilla Flavor with chewy Tapioca Pearls',
    basePrice: 8000,
    image: '/assets/IMG_2326_bubble_tea.jpg',
    placeholderIcon: Coffee,
    placeholderGradient: 'from-[#FEF3C7] to-[#FDE68A]/80 border-[#FDE68A]/40 text-[#D97706]'
  },
  {
    productId: 'classic-milk-tea',
    name: 'CLASSIC MILK TEA',
    description: 'Our Signature Original Milk Tea with Chewy Tapioca Pearls',
    basePrice: 7000,
    image: '/assets/IMG_2364_bubble_tea_duo.jpg',
    placeholderIcon: Coffee,
    placeholderGradient: 'from-amber-50 to-orange-100 border-orange-200/50 text-orange-600'
  }
];

const OTHER_DRINKS_PRODUCTS: Product[] = [
  {
    productId: 'hibiscus-drink-zobo',
    name: 'Hibiscus Drink (Zobo)',
    description: 'Traditional refreshing hibiscus flower tea.',
    basePrice: 1000,
    placeholderIcon: GlassWater,
    placeholderGradient: 'from-red-50 to-rose-100 border-red-200/50 text-red-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 1000 }
        ]
      }
    ]
  },
  {
    productId: 'tigernut-drink',
    name: 'Tigernut Drink',
    description: 'Traditional freshly pressed tigernut milk infused with coconut, dates and ginger.',
    basePrice: 2500,
    placeholderIcon: Milk,
    placeholderGradient: 'from-yellow-50 to-amber-100 border-yellow-200/50 text-amber-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: '25cl' },
          { value: '50cl', priceModifier: 2500 }
        ]
      }
    ]
  }
];

export default function MilkTeaDrinksPage() {
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
              Milk Tea & Drinks
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Explore SITI FRUITIES' refreshing drinks, from creamy milk teas to familiar Nigerian favourites.
            </p>
          </div>
        </section>

        {/* Product Catalogue Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            
            {/* Section A: Milk Tea */}
            <div className="mb-16">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Milk Tea</h2>
                  <p className="text-sm text-muted-foreground font-medium">Creamy bubble teas served with chewy tapioca pearls</p>
                </div>
                <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20 shrink-0">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Chewy Boba Pearls</span>
                </div>
              </div>

              {/* Grid for Milk Tea */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {MILK_TEA_PRODUCTS.map((product, idx) => (
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

            {/* Section B: Other Drinks */}
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Other Drinks</h2>
                  <p className="text-sm text-muted-foreground font-medium">Refreshing local and traditional specialties</p>
                </div>
              </div>

              {/* Grid for Other Drinks */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {OTHER_DRINKS_PRODUCTS.map((product, idx) => (
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
