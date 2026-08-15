import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard, { Product } from '@/components/ProductCard';
import { Apple, Leaf, Cookie, Sparkles, ShoppingBag, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const FRUITS_PRODUCTS: Product[] = [
  {
    productId: 'healthy-chicken-salad',
    name: 'Healthy Chicken Salad',
    description: 'Fresh crisp shredded chicken breast paired with seasonal cabbage, carrot, and SITI FRUITIES in-house salad dressing.',
    basePrice: 4500,
    placeholderIcon: Leaf,
    placeholderGradient: 'from-emerald-50 to-teal-100 border-emerald-200/50 text-emerald-600',
    options: [
      {
        name: 'Size',
        choices: [
          { value: 'Single Serving' },
          { value: 'Large Bowl', priceModifier: 1500 }
        ]
      }
    ]
  },
  {
    productId: 'exotic-fruit-salad',
    name: 'Exotic Fruit Salad Bowl',
    description: 'A beautifully arranged selection of handpicked fresh seasonal fruits (watermelon, pineapple, apples, grapes, oranges).',
    basePrice: 3500,
    placeholderIcon: Apple,
    placeholderGradient: 'from-orange-50 to-amber-100 border-orange-200/50 text-orange-600',
    options: [
      {
        name: 'Bowl Size',
        choices: [
          { value: 'Medium Bowl' },
          { value: 'Gbemidele Size', priceModifier: 2000 }
        ]
      }
    ]
  },
  {
    productId: 'fruit-yogurt-combo',
    name: 'Fresh Fruit & Yogurt Combo',
    description: 'Our freshly pressed yogurt served with selected fruit toppings. A perfect healthy midday pick-me-up.',
    basePrice: 5000,
    placeholderIcon: Sparkles,
    placeholderGradient: 'from-pink-50 to-rose-100 border-pink-200/50 text-rose-600',
    options: [
      {
        name: 'Yogurt Type',
        choices: [
          { value: 'Sweetened Greek Yogurt' },
          { value: 'Unsweetened Greek Yogurt' }
        ]
      }
    ]
  },
  {
    productId: 'crunchy-granola-snack',
    name: 'Crunchy Granola Snack Pack (100g)',
    description: 'Premium crunchy baked granola loaded with coconut flakes, raisins, and roasted cashew nuts.',
    basePrice: 3500,
    placeholderIcon: Cookie,
    placeholderGradient: 'from-yellow-50 to-amber-100 border-yellow-200/50 text-amber-600'
  },
  {
    productId: 'custom-fruit-cup',
    name: 'Custom Fruit Cup',
    description: 'Customize your bowl with your choice of sweetened/unsweetened yogurt base and custom fresh sliced fruits.',
    basePrice: 3000,
    placeholderIcon: ShoppingBag,
    placeholderGradient: 'from-sky-50 to-indigo-100 border-sky-200/50 text-indigo-600',
    options: [
      {
        name: 'Serving Size',
        choices: [
          { value: 'Regular Cup' },
          { value: 'Deluxe Bowl', priceModifier: 1500 }
        ]
      }
    ]
  }
];

export default function FruitsCategoryPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        {/* Banner Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-emerald-800 to-green-900 text-white overflow-hidden">
          {/* Subtle overlay styling */}
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-4 leading-tight">
              Fresh Fruits & Healthy Snacks
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Fresh seasonal fruit salad bowls, premium healthy chicken salad, and organic toppings prepared clean and fresh daily.
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
                <span className="text-xs font-bold uppercase tracking-wider">Freshly Prepared Daily</span>
              </div>
            </div>

            {/* Responsive grid matching homepage design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {FRUITS_PRODUCTS.map((product, idx) => (
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
