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
import NotFound from '@/pages/not-found';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const slug = category ?? '';
  const { data: categories, isLoading: areCategoriesLoading } = useCategories();
  const categoryData = categories?.find((item) => item.slug === slug && item.is_active);

  if (areCategoriesLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
        <Navbar />
        <main className="flex-1 w-full pt-20" role="status" aria-label="Loading category">
          <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-800 to-green-900">
            <div className="container mx-auto px-4 md:px-8">
              <div className="h-9 w-36 mb-6 rounded-full bg-white/20 animate-pulse" />
              <div className="h-12 w-3/4 max-w-xl rounded-lg bg-white/20 animate-pulse mb-4" />
              <div className="h-6 w-2/3 max-w-lg rounded-lg bg-white/15 animate-pulse" />
            </div>
          </section>
          <section className="py-20">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-96 rounded-2xl bg-muted animate-pulse" />
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

  if (!categoryData) {
    return <NotFound />;
  }

  return <CategoryContent category={categoryData} slug={slug} />;
}

function CategoryContent({
  category,
  slug,
}: {
  category: {
    name: string;
    description: string;
    image_url: string | null;
  };
  slug: string;
}) {
  const { data, isLoading, isError } = useProductsByCategory(slug);
  const products: Product[] = (data ?? []).map((product) => ({
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

  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-emerald-800 to-green-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
              <div className="min-w-0 flex-1">
                {category.name && (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-4 leading-tight">
                    {category.name}
                  </h1>
                )}
                {category.description && (
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>
              {category.image_url && (
                <div className="w-full md:w-72 lg:w-80 shrink-0">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full aspect-[4/3] object-cover rounded-2xl border border-white/20 shadow-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

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

            {isLoading && (
              <p className="mb-6 text-sm font-medium text-muted-foreground" role="status">
                Loading {category.name}...
              </p>
            )}
            {isError && (
              <p className="mb-6 text-sm font-medium text-destructive" role="alert">
                Unable to load {category.name}.
              </p>
            )}
            {!isLoading && !isError && products.length === 0 && (
              <p className="mb-6 text-sm font-medium text-muted-foreground">
                No items available right now
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
