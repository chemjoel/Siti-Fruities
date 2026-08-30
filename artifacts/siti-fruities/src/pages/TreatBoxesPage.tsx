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

interface TreatBoxProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  contents: string[];
  options?: {
    name: string;
    choices: string[];
  }[];
}

const TREAT_BOX_PRODUCTS: TreatBoxProduct[] = [
  {
    id: 'juicy-treatbox',
    name: 'Juicy Treatbox',
    price: 23500,
    description: 'A luscious collection featuring our signature ginger-pineapple juice, fresh parfait, nourishing tigernut milk, banana bread, and a delicious sandwich.',
    contents: [
      '500ml PING Juice (Pineapple & Ginger)',
      '400ml Exotic Parfait',
      '50cl Tigernut Drink',
      'Whole Wheat Banana Bread',
      '1 pack of Yummy Sandwich'
    ]
  },
  {
    id: 'mini-treatbox',
    name: 'Mini Treatbox',
    price: 14000,
    description: 'A delightful personal selection featuring exotic parfait, a sandwich, and refreshing zobo drink.',
    contents: [
      '500ml bowl of Exotic Parfait',
      '1 pack of Sandwich',
      '1 bottle of cold Zobo'
    ]
  },
  {
    id: 'maxi-treatbox',
    name: 'Maxi Treatbox',
    price: 35000,
    description: 'A generous feast box featuring a rich variety of premium parfaits, yogurts, salad, drinks, and healthy granola.',
    contents: [
      'Gbemidele Parfait (550ml)',
      '500ml Greek Yoghurt',
      '1 pack of Exotic Fruit Salad',
      '50cl Tigernut Drink',
      '50cl Zobo Drink',
      '1 pack of Sandwich',
      'Granola'
    ]
  },
  {
    id: 'deluxe-treatbox',
    name: 'Deluxe Treatbox',
    price: 40000,
    description: 'Our ultimate wellness bundle packed with nutrient-rich meals, drinks, and healthy toppings perfect for gifting.',
    contents: [
      '1 bowl of Healthy Chicken Salad',
      '500ml Greek Yoghurt',
      'Gbemidele-sized Parfait (550ml)',
      '1 bowl of Exotic Fruit Salad',
      '50cl Tigernut Drink',
      '50cl Zobo Drink',
      '1 pouch of Granola'
    ]
  },
  {
    id: 'intentional-treatbox',
    name: 'Intentional Treatbox',
    price: 29500,
    description: 'Thoughtfully combined to feed your body with organic goodness, containing yogurt parfait, bread, juice, and more.',
    contents: [
      'Gbemidele Parfait',
      'Chicken & Egg Sandwich',
      'Exotic Fruit Bowl',
      'Whole Wheat Banana Bread',
      'PING Juice',
      'Zobo Drink'
    ]
  },
  {
    id: 'mini-treatbox-2',
    name: 'Mini Treatbox 2',
    price: 14500,
    description: 'A satisfying and energizing combination of parfait, traditional hibiscus flower tea, sandwich, and crunchy toppings.',
    contents: [
      '500ml Exotic Parfait',
      '35cl Hibiscus Drink (Zobo)',
      '1 pack of Sandwich',
      '1 pack of Toppings'
    ]
  },
  {
    id: 'mini-treatbox-3',
    name: 'Mini Treatbox 3',
    price: 17500,
    description: 'A wholesome breakfast or high tea box featuring banana breads, fresh juice, and creamy yogurt parfait.',
    contents: [
      '400ml Exotic Parfait',
      '2 Whole Wheat Banana Breads',
      '25cl Zobo Drink',
      '25cl Any Cold-Pressed Juice'
    ],
    options: [
      {
        name: 'Cold-Pressed Juice',
        choices: ['PING', 'SWEET GREEN', 'BEET THE HEAT']
      }
    ]
  },
  {
    id: 'juicy-treatbox-2',
    name: 'Juicy Treatbox 2',
    price: 23500,
    description: 'A gorgeous pairing curated for sharing, containing juices, fresh parfait, banana bread, and your choice of sandwich.',
    contents: [
      'PING Juice (Pineapple & Ginger)',
      '500ml Exotic Parfait',
      '50cl Zobo Drink',
      '2 Whole Wheat Banana Breads',
      '1 pack of Chicken/Beef Sandwich'
    ],
    options: [
      {
        name: 'Sandwich',
        choices: ['Chicken Sandwich', 'Beef Sandwich']
      }
    ]
  },
  {
    id: 'perfecto-treatbox',
    name: 'Perfecto Treatbox',
    price: 24000,
    description: 'The complete gourmet package featuring banana bread, chicken sandwich, zobo, PING juice, and a lovely note card.',
    contents: [
      '500ml Exotic Parfait',
      '1 pack of Yummy Chicken Sandwich',
      '2 Whole Wheat Banana Breads',
      '1 bottle of Fresh PING Juice',
      '1 bottle of cold Zobo',
      'Note card'
    ]
  }
];

function TreatBoxCard({ product }: { product: TreatBoxProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isContentsExpanded, setIsContentsExpanded] = useState(false);

  // Initialize options state with first choice of each option
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.options) {
      product.options.forEach((opt) => {
        if (opt.choices && opt.choices.length > 0) {
          initial[opt.name] = opt.choices[0];
        }
      });
    }
    return initial;
  });

  const totalPrice = product.price * quantity;

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAdd = () => {
    const formattedOptions = product.options
      ? Object.entries(selectedOptions).map(([name, value]) => ({ name, value }))
      : [];

    addItem({
      productId: product.id,
      name: product.name,
      // Fallback thumbnail pointing to the treat box cover asset
      image: '/assets/Screenshot_20260729-212815_1785360013704.jpg',
      price: product.price,
      quantity,
      options: formattedOptions,
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-md border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      
      {/* Polished Empty Branded Image Placeholder */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-purple-50 to-pink-100 border-pink-200/50 flex flex-col items-center justify-center border-b border-card-border p-6 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300">
          <Gift className="w-10 h-10 stroke-[1.5] text-primary" />
        </div>
        <span className="text-[10px] font-bold tracking-widest text-primary/70 uppercase mt-4">Siti Treat Boxes</span>
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

        {/* Dynamic Options Selectors */}
        {product.options && product.options.map((opt) => (
          <div key={opt.name} className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Choose {opt.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {opt.choices.map((choice) => {
                const isSelected = selectedOptions[opt.name] === choice;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => handleOptionChange(opt.name, choice)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
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
        ))}

        {/* What's inside expandable section */}
        <div className="border-t border-b border-border/50 py-1 my-1">
          <button
            type="button"
            onClick={() => setIsContentsExpanded(!isContentsExpanded)}
            className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            <span>What's inside</span>
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
            className="w-full bg-secondary hover:bg-secondary/90 hover:shadow-md active:scale-95 text-white font-bold rounded-full h-10 px-4 text-sm transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="truncate">Add to Order</span>
          </Button>
        </div>

      </div>
    </div>
  );
}

export default function TreatBoxesPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        {/* Banner Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-purple-800 to-pink-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm mb-6 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif mb-4 leading-tight">
              Treat Boxes
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Healthy, yummy and exotic treats thoughtfully packed together for gifting, celebrations, sharing or simply treating yourself.
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
                <span className="text-xs font-bold uppercase tracking-wider">Freshly Assembled Daily</span>
              </div>
            </div>

            {/* Grid for Treat Box Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {TREAT_BOX_PRODUCTS.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex"
                >
                  <TreatBoxCard product={product} />
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
