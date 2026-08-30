import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Minus, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  StrawberryDecoration, 
  KiwiSliceDecoration, 
  BlueberryDecoration, 
  MintLeafDecoration, 
  CashewDecoration, 
  MangoDecoration 
} from './FruitAtmosphere';

// Assets
const greekYoghurtImg = '/assets/Screenshot_20260729-212331_1785360049844.jpg';
const sandwichImg = '/assets/IMG_1940_sandwich.jpg';
const bananaBreadImg = '/assets/IMG_7131_banana_bread_tray.jpg';
const cateringImg = '/assets/Screenshot_20260729-212642_1785360049574.jpg';
const treatBoxImg = '/assets/Screenshot_20260729-212815_1785360013704.jpg';
const parfaitImg = '/assets/IMG_1639_parfait_1l.jpg';

// Helper for formatting currency
const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

// --- SUB-COMPONENTS --- //

function QuantitySelector({ quantity, setQuantity }: { quantity: number, setQuantity: (q: number) => void }) {
  return (
    <div className="flex items-center bg-muted rounded-full p-1 border border-border">
      <button 
        type="button"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:shadow-none"
        disabled={quantity <= 1}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center font-bold text-sm">{quantity}</span>
      <button 
        type="button"
        onClick={() => setQuantity(quantity + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function PillToggle({ options, selected, onChange }: { options: string[], selected: string, onChange: (val: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
            selected === opt 
              ? 'bg-primary border-primary text-white shadow-md' 
              : 'bg-white border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// --- PRODUCT CARD COMPONENTS --- //

function GreekYoghurtCard() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [sweetness, setSweetness] = useState('Sweetened');
  const [size, setSize] = useState('330ml');
  
  const sizePrices: Record<string, number> = {
    '330ml': 4500,
    '500ml': 6500,
    '1L': 12000,
    '2L': 23500,
    '5L': 56000
  };

  const handleAdd = () => {
    addItem({
      productId: 'greek-yoghurt',
      name: 'Greek Yoghurt',
      image: greekYoghurtImg,
      price: sizePrices[size],
      quantity,
      options: [
        { name: 'Size', value: size },
        { name: 'Type', value: sweetness }
      ]
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={greekYoghurtImg} alt="Greek Yoghurt" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-foreground shadow-sm">
          From {formatPrice(4500)}
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">Greek Yoghurt</h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['Rich in Probiotics', 'Gut Friendly', '100% Healthy'].map(chip => (
              <span key={chip} className="text-[10px] uppercase tracking-wider font-bold bg-secondary/10 text-secondary px-2 py-1 rounded-full">{chip}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Type</label>
            <PillToggle options={['Sweetened', 'Unsweetened']} selected={sweetness} onChange={setSweetness} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Size & Price</label>
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {Object.entries(sizePrices).map(([s, p]) => (
                <option key={s} value={s}>{s} — {formatPrice(p)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border gap-4">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all h-11">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

function SandwichCard() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState('Chicken & Egg');
  const [eggOption, setEggOption] = useState('Fried');
  
  const typePrices: Record<string, number> = {
    'Chicken & Egg': 4000,
    'Beef & Egg': 4000,
    'Egg Sandwich': 3000
  };

  const handleAdd = () => {
    addItem({
      productId: 'sandwich',
      name: 'Fresh Club Sandwich',
      image: sandwichImg,
      price: typePrices[type],
      quantity,
      options: [
        { name: 'Type', value: type },
        { name: 'Egg Option', value: eggOption }
      ]
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={sandwichImg} alt="Sandwiches" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-foreground shadow-sm">
          {formatPrice(typePrices[type])}
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">Fresh Club Sandwich</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Fresh bread layered with protein, egg, vegetables and special creamy sauce.
          </p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Sandwich Type</label>
            <div className="flex flex-col gap-2">
              {Object.keys(typePrices).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all border flex justify-between items-center ${
                    type === t 
                      ? 'bg-primary/5 border-primary text-primary' 
                      : 'bg-white border-border text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span>{t}</span>
                  <span className="font-mono text-muted-foreground">{formatPrice(typePrices[t])}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Egg Preparation</label>
            <PillToggle options={['Fried', 'Boiled']} selected={eggOption} onChange={setEggOption} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border gap-4">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all h-11">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

function BananaBreadCard() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Loaf');
  const [addIn, setAddIn] = useState('Chocolate');

  const sizePrices: Record<string, number> = {
    'Slice': 1500,
    'Mini Loaf': 3500,
    'Loaf': 6500
  };

  const handleAdd = () => {
    addItem({
      productId: 'banana-bread',
      name: 'Whole Wheat Banana Bread',
      image: bananaBreadImg,
      price: sizePrices[size],
      quantity,
      options: [
        { name: 'Size', value: size },
        { name: 'Add-In', value: addIn }
      ]
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={bananaBreadImg} alt="Banana Bread" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-foreground shadow-sm">
          {formatPrice(sizePrices[size])}
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">Whole Wheat Banana Bread</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            100% Whole wheat, naturally sweetened with ripe bananas. Moist and wholesome.
          </p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Size</label>
            <PillToggle options={['Slice', 'Mini Loaf', 'Loaf']} selected={size} onChange={setSize} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Flavour / Add-in</label>
            <PillToggle options={['Chocolate', 'Raisins', 'Coconut']} selected={addIn} onChange={setAddIn} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border gap-4">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all h-11">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

function TreatBoxCard() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedBox, setSelectedBox] = useState<'A' | 'B'>('A');

  const boxDetails = {
    A: {
      name: 'Treat Box A',
      price: 15500,
      items: ['Healthy Chicken Salad', '500ml Greek Yoghurt', '500ml Parfait', 'Loaf of Banana Bread']
    },
    B: {
      name: 'Treat Box B',
      price: 13000,
      items: ['Healthy Chicken Salad', '500ml Greek Yoghurt', '330ml Parfait', 'Loaf of Banana Bread']
    }
  };

  const handleAdd = () => {
    addItem({
      productId: `treat-box-${selectedBox.toLowerCase()}`,
      name: boxDetails[selectedBox].name,
      image: treatBoxImg,
      price: boxDetails[selectedBox].price,
      quantity,
      options: [{ name: 'Package', value: selectedBox }]
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={treatBoxImg} alt="Treat Box" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-foreground shadow-sm">
          {formatPrice(boxDetails[selectedBox].price)}
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">Juicy Treat Box</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Curated gift & feast boxes combining your favourite SITI treats in one pack.
          </p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Select Package</label>
            <div className="grid grid-cols-2 gap-2">
              {(['A', 'B'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBox(b)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedBox === b 
                      ? 'bg-primary border-primary text-white shadow-md' 
                      : 'bg-white border-border text-foreground hover:bg-muted/50'
                  }`}
                >
                  <div>Treat Box {b}</div>
                  <div className={`text-[10px] font-mono mt-0.5 ${selectedBox === b ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {formatPrice(boxDetails[b].price)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl p-3 border border-border">
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1.5">Includes:</span>
            <ul className="text-xs space-y-1 text-foreground">
              {boxDetails[selectedBox].items.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border gap-4">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all h-11">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

function CateringCard() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(2); // Minimum 2

  const handleAdd = () => {
    addItem({
      productId: 'smallie-parfait',
      name: 'Smallie Parfait (Events Cup)',
      image: cateringImg,
      price: 4000,
      quantity,
      options: [{ name: 'Category', value: 'Events & Catering' }]
    });
    setQuantity(2);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={cateringImg} alt="Events & Catering" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-foreground shadow-sm">
          {formatPrice(4000)} / cup
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">Smallie Parfait (Events)</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            330ml cup layered with Greek yogurt, fruit and crunchy granola. Minimum 2 cups order.
          </p>
        </div>

        <div className="space-y-3 flex-1">
          <div className="bg-sky-50 border border-sky-200/60 rounded-xl p-3 text-sky-900 text-xs leading-relaxed font-medium">
            Planning a bigger gathering? We cater for office meetings, birthdays, weddings, and parties.
          </div>
          <Link href="/catering-events" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
            <span>Explore full catering options →</span>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border gap-4">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all h-11">
            Add ({formatPrice(4000 * quantity)})
          </Button>
        </div>
      </div>
    </div>
  );
}

function ParfaitCard() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem({
      productId: 'vvip-parfait-featured',
      name: 'VVIP Exotic Parfait Bowl',
      image: parfaitImg,
      price: 15000,
      quantity,
      options: [{ name: 'Size', value: '1 Litre (Ay Bowl)' }]
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={parfaitImg} alt="VVIP Exotic Parfait" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-foreground shadow-sm">
          {formatPrice(15000)}
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">VVIP Ay Bowl Parfait</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            1 Litre loaded bowl of fresh kiwi, strawberries, grapes, cashew nuts and thick yogurt.
          </p>
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap gap-1.5">
            {['1 Litre Bowl', 'Exotic Fruits', 'Cashew Nuts', 'Probiotic Base'].map(chip => (
              <span key={chip} className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">{chip}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border gap-4">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all h-11">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN FEATURED PRODUCTS COMPONENT --- //

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll the Featured Products carousel smoothly
  useEffect(() => {
    if (isHovered) return;

    const scrollTimer = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeft >= maxScroll - 20) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 4500);

    return () => clearInterval(scrollTimer);
  }, [isHovered]);

  const renderCardForSlug = (slug: string) => {
    switch (slug) {
      case 'vvip-exotic-parfait':
      case 'parfait':
        return <ParfaitCard key="parfait" />;
      case 'greek-yogurt':
      case 'greek-yoghurt':
        return <GreekYoghurtCard key="yoghurt" />;
      case 'chicken-sandwich':
      case 'sandwich':
        return <SandwichCard key="sandwich" />;
      case 'whole-wheat-banana-bread':
      case 'banana-bread':
        return <BananaBreadCard key="banana-bread" />;
      case 'juicy-treatbox':
      case 'treatbox':
        return <TreatBoxCard key="treatbox" />;
      case 'smallie-parfait':
      case 'catering':
        return <CateringCard key="catering" />;
      default:
        return null;
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="py-20 bg-background relative border-t border-border/20 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Soft ambient food fresh glow */}
      <div className="absolute top-1/3 -left-36 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 -right-36 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Clearly visible background decorative fruit elements in outer margins */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Top-Right: Fresh Strawberry */}
        <div className="absolute top-12 right-4 lg:right-12 opacity-80 hidden md:block">
          <StrawberryDecoration size={56} />
        </div>
        {/* Bottom-Left: Golden Mango */}
        <div className="absolute bottom-16 left-4 lg:left-12 opacity-80 hidden md:block">
          <MangoDecoration size={54} />
        </div>
        {/* Top-Left: Kiwi Slice */}
        <div className="absolute top-14 left-4 lg:left-10 opacity-75 hidden md:block">
          <KiwiSliceDecoration size={58} />
        </div>
        {/* Bottom-Right: Blueberries */}
        <div className="absolute bottom-12 right-6 lg:right-16 opacity-80 hidden md:block">
          <BlueberryDecoration size={52} />
        </div>
        {/* Middle-Left: Cashew Nut */}
        <div className="absolute top-1/2 left-2 lg:left-8 -translate-y-1/2 opacity-70 hidden xl:block">
          <CashewDecoration size={46} />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header with Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4 leading-tight"
            >
              Our Favourites
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed"
            >
              Crafted fresh, every single day with premium ingredients and zero artificial additives.
            </motion.p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={scrollLeft}
              className="w-11 h-11 rounded-full border-2 border-border bg-white hover:bg-muted text-foreground flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-11 h-11 rounded-full border-2 border-border bg-white hover:bg-muted text-foreground flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auto-advancing Swipeable & Scrollable Horizontal Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredProducts.length > 0 ? (
            featuredProducts.map((p) => (
              <div key={p.id} className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always">
                {renderCardForSlug(p.slug) || <ParfaitCard />}
              </div>
            ))
          ) : (
            <>
              <div className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always"><ParfaitCard /></div>
              <div className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always"><GreekYoghurtCard /></div>
              <div className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always"><SandwichCard /></div>
              <div className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always"><BananaBreadCard /></div>
              <div className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always"><TreatBoxCard /></div>
              <div className="w-[290px] sm:w-[350px] shrink-0 snap-start snap-always"><CateringCard /></div>
            </>
          )}
        </div>

        {/* View All Products CTA */}
        <div className="flex justify-center mt-10">
          <Link href="/greek-yogurt-parfaits">
            <Button 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-bold px-8 h-12 text-sm transition-all shadow-md active:scale-95"
            >
              View All Products
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
