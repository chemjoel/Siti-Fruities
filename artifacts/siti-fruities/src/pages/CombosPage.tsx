import React, { useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Clock, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper for formatting currency
const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

interface ComboProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  includedItems: string[];
  requiresSmoothie?: boolean;
  requiresSandwich?: boolean;
}

const COMBO_PRODUCTS: ComboProduct[] = [
  {
    id: 'cheesesteak-smoothie',
    name: 'Cheesesteak + Smoothie',
    price: 16000,
    description: 'Cheesesteak paired with a 50cl smoothie of your choice.',
    includedItems: ['Cheesesteak', '50cl Smoothie (Your Choice)'],
    requiresSmoothie: true
  },
  {
    id: 'cheesesteak-cold-zobo',
    name: 'Cheesesteak + Cold Zobo',
    price: 15000,
    description: 'A classic cheesesteak paired with a refreshing cold Zobo drink.',
    includedItems: ['Cheesesteak', 'Cold Zobo (50cl)']
  },
  {
    id: 'tigernut-drink-sandwich',
    name: 'Tigernut Drink + Sandwich',
    price: 8000,
    description: 'Creamy Tigernut Drink (50cl) paired with your choice of sandwich.',
    includedItems: ['Tigernut Drink (50cl)', 'Sandwich (Your Choice)'],
    requiresSandwich: true
  },
  {
    id: 'zobo-drink-sandwich',
    name: 'Zobo Drink + Sandwich',
    price: 5000,
    description: 'Traditional hibiscus tea paired with your choice of sandwich.',
    includedItems: ['Zobo Drink', 'Sandwich (Your Choice)'],
    requiresSandwich: true
  },
  {
    id: 'vvip-parfait-sandwich',
    name: '550ml VVIP Parfait + Sandwich',
    price: 12900,
    description: 'A premium 550ml VVIP Parfait paired with your choice of sandwich.',
    includedItems: ['VVIP Parfait (550ml)', 'Sandwich (Your Choice)'],
    requiresSandwich: true
  },
  {
    id: 'cheesesteak-tigernut-drink',
    name: 'Cheesesteak + Tigernut Drink',
    price: 18000,
    description: 'Cheesesteak paired with a rich, traditional Tigernut Drink (50cl).',
    includedItems: ['Cheesesteak', 'Tigernut Drink (50cl)']
  },
  {
    id: 'cheesesteak-ping-juice',
    name: 'Cheesesteak + PING Juice',
    price: 16000,
    description: 'Cheesesteak paired with our signature Pineapple & Ginger (PING) Cold-Pressed Juice (35cl).',
    includedItems: ['Cheesesteak', 'PING Cold-Pressed Juice (35cl)']
  },
  {
    id: 'banana-bread-tigernut-drink',
    name: 'Whole Wheat Banana Bread + Tigernut Drink',
    price: 7000,
    description: 'A slice of wholesome Whole Wheat Banana Bread paired with Tigernut Drink.',
    includedItems: ['Whole Wheat Banana Bread', 'Tigernut Drink']
  },
  {
    id: 'sandwich-ping-juice',
    name: 'Chicken / Beef Sandwich + PING Juice',
    price: 6200,
    description: 'Your choice of sandwich paired with refreshing PING Cold-Pressed Juice (35cl).',
    includedItems: ['Sandwich (Your Choice)', 'PING Juice (35cl)'],
    requiresSandwich: true
  },
  {
    id: 'banana-bread-cold-zobo',
    name: 'Whole Wheat Banana Bread + Cold Zobo',
    price: 4000,
    description: 'A slice of wholesome Whole Wheat Banana Bread paired with traditional cold Zobo.',
    includedItems: ['Whole Wheat Banana Bread', 'Cold Zobo']
  },
  {
    id: 'greek-yoghurt-sandwich',
    name: '500ml Greek Yoghurt + Sandwich',
    price: 9000,
    description: 'Rich and creamy Greek Yoghurt (500ml) paired with your choice of sandwich.',
    includedItems: ['Greek Yoghurt (500ml)', 'Sandwich (Your Choice)'],
    requiresSandwich: true
  }
];

const SMOOTHIE_CHOICES = [
  'Milk Mix',
  'Yoghurt Mix',
  'Nutty Chocolate',
  'So Creamy',
  'Ginger Blast',
  'Strawberry',
  'Fruity',
  'Healthy Green'
];

const SANDWICH_CHOICES = [
  'Chicken Sandwich',
  'Beef Sandwich'
];

function ComboCard({ product }: { product: ComboProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSmoothie, setSelectedSmoothie] = useState('');
  const [selectedSandwich, setSelectedSandwich] = useState('');

  const totalPrice = product.price * quantity;

  // Determine if required selections have been made
  const isSelectionMissing = 
    (product.requiresSmoothie && !selectedSmoothie) || 
    (product.requiresSandwich && !selectedSandwich);

  const handleAdd = () => {
    if (isSelectionMissing) return;

    const formattedOptions = [];
    if (product.requiresSmoothie && selectedSmoothie) {
      formattedOptions.push({ name: 'Smoothie', value: selectedSmoothie });
    }
    if (product.requiresSandwich && selectedSandwich) {
      formattedOptions.push({ name: 'Sandwich', value: selectedSandwich });
    }

    addItem({
      productId: product.id,
      name: product.name,
      // Fallback logo asset for combinations card thumbnail in cart
      image: '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
      price: product.price,
      quantity,
      options: formattedOptions,
    });

    // Reset selectors
    setSelectedSmoothie('');
    setSelectedSandwich('');
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-md border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      
      {/* Polished Empty Branded Image Placeholder */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-amber-50 to-orange-100 border-orange-200/50 flex flex-col items-center justify-center border-b border-card-border p-6 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-10 h-10 stroke-[1.5] text-primary" />
        </div>
        <span className="text-[10px] font-bold tracking-widest text-primary/70 uppercase mt-4">Siti Combos</span>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Included Items List */}
          <div className="bg-muted/40 rounded-xl p-3 border border-border/40">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Includes</span>
            <ul className="space-y-1">
              {product.includedItems.map((item, idx) => (
                <li key={idx} className="text-xs text-foreground/80 font-medium flex items-center gap-1.5">
                  <span className="text-primary font-bold text-[10px]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic Smoothie Option Selector */}
        {product.requiresSmoothie && (
          <div className="space-y-2 pt-2 border-t border-border/40">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Choose your 50cl Smoothie
            </label>
            <select
              value={selectedSmoothie}
              onChange={(e) => setSelectedSmoothie(e.target.value)}
              className="w-full bg-white border border-border hover:border-primary/50 text-foreground text-sm font-semibold rounded-xl p-2.5 outline-none transition-all cursor-pointer"
            >
              <option value="" disabled>Select smoothie...</option>
              {SMOOTHIE_CHOICES.map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Sandwich Option Selector */}
        {product.requiresSandwich && (
          <div className="space-y-2 pt-2 border-t border-border/40">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Choose your sandwich
            </label>
            <div className="flex flex-wrap gap-2">
              {SANDWICH_CHOICES.map((choice) => {
                const isSelected = selectedSandwich === choice;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setSelectedSandwich(choice)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Card Footer - Price, Quantity & Add to Cart */}
        <div className="mt-auto border-t border-border pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Price</span>
              <span className="text-xl font-black text-primary leading-tight mt-0.5">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center bg-muted rounded-full p-0.5 border border-border shrink-0">
              <button 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:shadow-none"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-bold text-xs text-foreground">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Order Button */}
          <Button 
            onClick={handleAdd}
            disabled={isSelectionMissing}
            className={`w-full bg-secondary hover:bg-secondary/90 hover:shadow-md active:scale-95 text-white font-bold rounded-full h-10 px-4 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="truncate">Add to Order</span>
          </Button>
        </div>

      </div>
    </div>
  );
}

export default function CombosPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        {/* Banner Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-4 leading-tight">
              Combos
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Good things come together. Choose from our ready-made food and drink combinations.
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
                <span className="text-xs font-bold uppercase tracking-wider">Combinations Packaged Daily</span>
              </div>
            </div>

            {/* Grid for Combo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {COMBO_PRODUCTS.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex"
                >
                  <ComboCard product={product} />
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
