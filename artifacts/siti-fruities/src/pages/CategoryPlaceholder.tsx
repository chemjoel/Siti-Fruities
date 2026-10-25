import React from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard, { type Product } from '@/components/ProductCard';
import { useCategories, useProductsByCategory } from '@/hooks/useCatalog';

export default function CategoryPlaceholder() {
  const { category } = useParams<{ category: string }>();
  const slug = category ?? '';
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories();
  const {
    data: productsData,
    isLoading: areProductsLoading,
    isError: areProductsError,
  } = useProductsByCategory(slug);
  const categoryData = categories?.find((item) => item.slug === slug && item.is_active);
  const isLoading = isCategoriesLoading || areProductsLoading;
  const isError = isCategoriesError || areProductsError;
  const products: Product[] = (productsData ?? []).map((product) => ({
    productId: product.slug,
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    image: product.imageUrl ?? undefined,
    placeholderIcon: Sparkles,
    placeholderGradient: 'from-emerald-50 to-green-100 border-emerald-200/50 text-emerald-600',
    options: product.options.map((option) => ({
      name: option.name,
      choices: option.choices.map((choice) => ({
        value: choice.value,
        priceModifier: choice.priceModifier,
      })),
    })),
    isAvailable: product.isAvailable,
  }));
  const title = categoryData?.name ?? slug.split('-').map((word) => (
    word.charAt(0).toUpperCase() + word.slice(1)
  )).join(' ');

  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-emerald-800 to-green-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-4 leading-tight">
              {title || 'Category'}
            </h1>
            {categoryData?.description && (
              <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
                {categoryData.description}
              </p>
            )}
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-4 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold font-serif text-foreground">Catalog Menu</h2>
                <p className="text-sm text-muted-foreground font-medium">Explore what is available in this category</p>
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Ordering Available Now</span>
              </div>
            </div>

            {isLoading && (
              <p className="mb-6 text-sm font-medium text-muted-foreground" role="status">
                Loading category...
              </p>
            )}
            {isError && (
              <p className="mb-6 text-sm font-medium text-destructive" role="alert">
                Unable to load this category.
              </p>
            )}
            {!isLoading && !isError && !categoryData && (
              <p className="mb-6 text-sm font-medium text-muted-foreground">
                Category not found.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
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
