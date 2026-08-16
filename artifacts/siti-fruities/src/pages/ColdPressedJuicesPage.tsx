import React, { useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { GlassWater, ArrowLeft, Clock, Plus, Minus, Info, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper for formatting currency
const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

interface JuiceProduct {
  id: string;
  name: string;
  ingredients: string[];
  description: string;
  size: string;
  price: number;
  placeholderGradient: string;
  iconColor: string;
}

const JUICE_PRODUCTS: JuiceProduct[] = [
  {
    id: 'ping',
    name: 'PING',
    ingredients: ['Pineapple', 'Ginger'],
    description: 'Pineapple and ginger.',
    size: '35cl',
    price: 3200,
    placeholderGradient: 'from-yellow-50 to-amber-100 border-amber-200/50',
    iconColor: 'text-amber-600'
  },
  {
    id: 'sweet-green',
    name: 'SWEET GREEN',
    ingredients: ['Apple', 'Orange', 'Cucumber', 'Lemon'],
    description: 'Apple, orange, cucumber and lemon.',
    size: '35cl',
    price: 4500,
    placeholderGradient: 'from-emerald-50 to-green-100 border-emerald-200/50',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'beet-the-heat',
    name: 'BEET THE HEAT',
    ingredients: ['Beetroot', 'Carrot', 'Watermelon', 'Lemon'],
    description: 'Beetroot, carrot, watermelon and lemon.',
    size: '35cl',
    price: 5000,
    placeholderGradient: 'from-red-50 to-rose-100 border-rose-200/50',
    iconColor: 'text-rose-600'
  }
];

function JuiceCard({ juice }: { juice: JuiceProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const totalPrice = juice.price * quantity;

  const handleAdd = () => {
    addItem({
      productId: juice.id,
      name: juice.name,
      // Fallback thumbnail pointing to the original cold pressed juices cover asset
      image: '/assets/Screenshot_20260729-212547_1785360049692.jpg',
      price: juice.price,
      quantity,
      options: [
        { name: 'Size', value: juice.size }
      ]
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-md border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      
      {/* Polished Empty Branded Image Placeholder */}
      <div className={`relative aspect-[4/3] w-full bg-gradient-to-br ${juice.placeholderGradient} flex flex-col items-center justify-center border-b border-card-border p-6 overflow-hidden shrink-0`}>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300">
          <GlassWater className={`w-10 h-10 stroke-[1.5] ${juice.iconColor}`} />
        </div>
        <span className={`text-[10px] font-bold tracking-widest uppercase mt-4 ${juice.iconColor}/70`}>Siti Juices Fresh</span>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
            {juice.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {juice.description}
          </p>
        </div>

        {/* Size Indicator */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Size</span>
          <span className="inline-block px-3.5 py-1.5 bg-muted text-foreground border border-border text-xs font-semibold rounded-full">
            {juice.size}
          </span>
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
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50"
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

export default function ColdPressedJuicesPage() {
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
              Cold-Pressed Juices
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Freshly pressed combinations of fruits, vegetables and spice — with no water or additives.
            </p>
          </div>
        </section>

        {/* Product Catalogue Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            
            {/* Informational Callout Banner */}
            <div className="mb-12 bg-emerald-50 border border-secondary/20 p-5 rounded-2xl flex items-start gap-3.5 max-w-3xl">
              <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                  Cold-pressed juices are made with fresh fruits, vegetables and spice. No water or additives added. All natural!
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12 pb-4 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold font-serif text-foreground">Catalogue Menu</h2>
                <p className="text-sm text-muted-foreground font-medium">Browse our selection and add to your order</p>
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20 shrink-0">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Cold-Pressed Fresh Daily</span>
              </div>
            </div>

            {/* Grid for Juice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {JUICE_PRODUCTS.map((juice, idx) => (
                <motion.div
                  key={juice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex"
                >
                  <JuiceCard juice={juice} />
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
