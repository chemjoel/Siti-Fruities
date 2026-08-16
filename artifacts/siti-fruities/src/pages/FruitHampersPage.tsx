import React, { useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Gift, ArrowLeft, Clock, Plus, Minus, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper for formatting currency
const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

interface HamperProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  contents: string[];
}

const HAMPER_PRODUCTS: HamperProduct[] = [
  {
    id: 'deluxe-hamper',
    name: 'Deluxe Hamper',
    price: 70000,
    description: 'A premium gift hamper combining fresh fruits, Greek yoghurt, crunchy granola, nuts, treats and thoughtful finishing touches.',
    contents: [
      '1 whole Watermelon',
      '1 whole Pineapple',
      '1 litre Greek Yoghurt',
      'Carefully selected mixed nuts (500ml)',
      'Crunchy Granola (100g)',
      'Big red Apples',
      'Fresh Oranges',
      '1 pack of Blueberries',
      '1 pack of Strawberries',
      'Clementines',
      'Kiwi',
      'Exotic Biscuits',
      'Cookies',
      'Customised Gold Hamper Basket',
      'Note Card'
    ]
  },
  {
    id: 'exotic-fruit-hamper',
    name: 'Exotic Fruit Hamper',
    price: 55000,
    description: 'A colourful fruit-focused hamper filled with carefully selected fruits and presented as a thoughtful gift.',
    contents: [
      '1 Big Pineapple',
      '1 Big Watermelon',
      '5 Red Apples',
      '4 Clementines',
      '1 pack of Red Seedless Grapes',
      '1 pack of Strawberries',
      '2 Kiwis',
      '2 Oranges',
      '2 Lemons',
      'Luxury Hamper Basket',
      'Note Card'
    ]
  }
];

function HamperCard({ product }: { product: HamperProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isContentsExpanded, setIsContentsExpanded] = useState(false);

  const totalPrice = product.price * quantity;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      // Fallback thumbnail pointing to the fruit hamper cover asset
      image: '/assets/Screenshot_20260729-213638_1785360173839.jpg',
      price: product.price,
      quantity,
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-md border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      
      {/* Polished Empty Branded Image Placeholder */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200/50 flex flex-col items-center justify-center border-b border-card-border p-6 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300">
          <Gift className="w-10 h-10 stroke-[1.5] text-primary" />
        </div>
        <span className="text-[10px] font-bold tracking-widest text-primary/70 uppercase mt-4">Siti Fruit Hampers</span>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* What's included expandable section */}
        <div className="border-t border-b border-border/50 py-1 my-1">
          <button
            type="button"
            onClick={() => setIsContentsExpanded(!isContentsExpanded)}
            className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            <span>What's included</span>
            {isContentsExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          <AnimatePresence initial={false}>
            {isContentsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ul className="pt-2 pb-1 space-y-1.5">
                  {product.contents.map((item, idx) => (
                    <li key={idx} className="text-xs text-foreground/80 font-medium flex items-start gap-2">
                      <span className="text-secondary select-none font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Footer - Price, Quantity & Add to Cart */}
        <div className="mt-auto border-t border-border pt-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col w-full sm:w-auto">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Price</span>
            <span className="text-xl font-black text-primary leading-none mt-1">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:flex-1 justify-end">
            {/* Quantity Selector */}
            <div className="flex items-center bg-muted rounded-full p-1 border border-border shrink-0">
              <button 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:shadow-none"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-foreground">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAdd}
              className="flex-1 sm:flex-initial bg-secondary hover:bg-secondary/90 hover:shadow-md active:scale-95 text-white font-bold rounded-full h-10 px-5 text-sm transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Order</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function FruitHampersPage() {
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
              Fruit Hampers
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Thoughtfully arranged fruit hampers made for gifting, celebrations and special moments.
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
                <span className="text-xs font-bold uppercase tracking-wider">Arranged Fresh Daily</span>
              </div>
            </div>

            {/* Grid for Hamper Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto gap-6 md:gap-8">
              {HAMPER_PRODUCTS.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex animate-fade-in"
                >
                  <HamperCard product={product} />
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
