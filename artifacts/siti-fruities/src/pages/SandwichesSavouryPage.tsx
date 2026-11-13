import React from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard, { Product } from '@/components/ProductCard';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductsByCategory } from '@/hooks/useCatalog';

export default function SandwichesSavouryPage() {
  const { data, isLoading, isError } = useProductsByCategory('sandwiches-savoury');
  const products: Product[] = (data ?? []).map((product) => ({
    productId: product.slug,
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    image: product.imageUrl ?? undefined,
    placeholderIcon: Sparkles,
    placeholderGradient: 'from-yellow-50 to-amber-100 border-yellow-200/50 text-amber-600',
    options: product.options.map((option) => ({
      name: option.name,
      choices: option.choices.map((choice) => ({
        value: choice.value,
        priceModifier: choice.priceModifier,
      })),
    })),
    isAvailable: product.isAvailable,
  }));
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
              Savoury & Salads
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Fresh, satisfying savoury options made for a quick meal, a healthy bite or something a little more filling.
            </p>
          </div>
        </section>

        {/* Product Catalogue Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            {isLoading && (
              <p className="mb-6 text-sm font-medium text-muted-foreground" role="status">
                Loading savoury products...
              </p>
            )}
            {isError && (
              <p className="mb-6 text-sm font-medium text-destructive" role="alert">
                Unable to load savoury products.
              </p>
            )}
            {!isLoading && !isError && products.length === 0 && (
              <p className="mb-6 text-sm font-medium text-muted-foreground">
                No products available right now.
              </p>
            )}
            
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Savoury & Salads</h2>
                  <p className="text-sm text-muted-foreground font-medium">Filling salads and hearty savoury bread loaves</p>
                </div>
              </div>

              {/* Grid for Savoury & Salads */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product, idx) => (
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
