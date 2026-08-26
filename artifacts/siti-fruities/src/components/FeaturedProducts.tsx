import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Minus, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

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
    'Chicken Sandwich': 3000,
    'Beef Sandwich': 3000,
    'Chicken & Egg': 5000
  };

  const handleAdd = () => {
    const opts = [{ name: 'Type', value: type }];
    if (type.includes('Egg')) {
      opts.push({ name: 'Egg', value: eggOption });
    }
    addItem({
      productId: 'sandwich',
      name: 'Sandwich',
      image: sandwichImg,
      price: typePrices[type],
      quantity,
      options: opts
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={sandwichImg} alt="Sandwich" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">Signature Sandwich</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">Made with fresh bread, cabbage, carrot, premium protein and SITI FRUITIES in-house cream.</p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Protein</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {Object.entries(typePrices).map(([s, p]) => (
                <option key={s} value={s}>{s} — {formatPrice(p)}</option>
              ))}
            </select>
          </div>
          
          {type.includes('Egg') && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Egg Preparation</label>
              <PillToggle options={['Boiled', 'Fried']} selected={eggOption} onChange={setEggOption} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-black text-foreground">{formatPrice(typePrices[type] * quantity)}</span>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          </div>
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
  const [flavour, setFlavour] = useState('Chocolate');
  
  const price = 2500;

  const handleAdd = () => {
    addItem({
      productId: 'banana-bread',
      name: 'Whole Wheat Banana Bread',
      image: bananaBreadImg,
      price,
      quantity,
      options: [{ name: 'Flavour', value: flavour }]
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={bananaBreadImg} alt="Banana Bread" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-foreground shadow-sm">
          {formatPrice(price)}
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">Whole Wheat Banana Bread</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">Healthy whole wheat banana bread baked fresh with premium ingredients.</p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Flavour Mix-in</label>
            <PillToggle options={['Chocolate', 'Raisin', 'Coconut']} selected={flavour} onChange={setFlavour} />
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
  const price = 36500;

  const handleAdd = () => {
    addItem({
      productId: 'treat-box',
      name: 'Deluxe Healthy Treat Box',
      image: treatBoxImg,
      price,
      quantity
    });
    setQuantity(1);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={treatBoxImg} alt="Treat Box" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
          <span>🎁</span> Beautiful Gift
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">Deluxe Healthy Treat Box</h3>
          <div className="text-lg font-black text-primary">{formatPrice(price)}</div>
        </div>

        <div className="flex-1 bg-muted/50 rounded-xl p-4">
          <ul className="space-y-2 text-sm text-foreground/80 font-medium">
            <li className="flex items-start gap-2"><span className="text-secondary">🌿</span> Healthy Chicken Salad</li>
            <li className="flex items-start gap-2"><span className="text-secondary">🌿</span> 500ml Greek Yoghurt</li>
            <li className="flex items-start gap-2"><span className="text-secondary">🌿</span> 550ml Exotic Parfait</li>
            <li className="flex items-start gap-2"><span className="text-secondary">🌿</span> Exotic Fruit Salad</li>
            <li className="flex items-start gap-2"><span className="text-secondary">🌿</span> 50cl Tigernut & Zobo</li>
            <li className="flex items-start gap-2"><span className="text-secondary">🌿</span> Granola</li>
          </ul>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 gap-4">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all h-11">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

function ParfaitCard() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [sweetness, setSweetness] = useState('Sweetened');
  const [size, setSize] = useState('550ml');
  
  const sizePrices: Record<string, number> = {
    '330ml': 5000,
    '500ml': 8000,
    '550ml': 9000,
    '1L': 13500
  };

  const handleAdd = () => {
    addItem({
      productId: 'parfait',
      name: 'Exotic Parfait',
      image: parfaitImg,
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
    <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 ring-2 ring-primary/20">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={parfaitImg} alt="Exotic Parfait" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          ⭐ #1 Signature Product
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-foreground shadow-sm">
          From {formatPrice(5000)}
        </div>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-5">
        <div>
          <h3 className="text-xl font-bold font-serif mb-2">Exotic Parfait</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            Greek Yogurt, Apple, Coconut, Grapes, Granola with rolled oats, Cashew nuts, Kiwi, Strawberry, Raisins
          </p>
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

function CateringCard() {
  const { addItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('Indoor Catering');
  
  // State for catering items
  const [items, setItems] = useState({
    Parfait: 0,
    Sandwiches: 0,
    Smoothies: 0,
    Juice: 0,
    Yoghurt: 0,
    FruitSalad: 0,
    BananaBread: 0
  });

  const prices = {
    Parfait: 9000,
    Sandwiches: 3000,
    Smoothies: 3500,
    Juice: 2500,
    Yoghurt: 6500,
    FruitSalad: 3500,
    BananaBread: 2500
  };

  const labels = {
    Parfait: "Exotic Parfait",
    Sandwiches: "Chicken & Egg Sandwiches",
    Smoothies: "Healthy Smoothies",
    Juice: "Cold Pressed Juice",
    Yoghurt: "Greek Yoghurt (500ml)",
    FruitSalad: "Exotic Fruit Salad",
    BananaBread: "Banana Bread Loaves"
  };

  const estimatedTotal = Object.entries(items).reduce(
    (acc, [key, qty]) => acc + (prices[key as keyof typeof prices] * qty), 0
  );

  const handleUpdateItem = (key: keyof typeof items, delta: number) => {
    setItems(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  const handleAddToCart = () => {
    if (estimatedTotal === 0) return;
    
    // Add individual items to cart or add as one big catering bundle?
    // The prompt says "Add everything to cart". Adding as one bundle with details makes sense.
    
    const details = Object.entries(items)
      .filter(([_, qty]) => qty > 0)
      .map(([key, qty]) => `${qty}x ${labels[key as keyof typeof labels]}`)
      .join(', ');

    addItem({
      productId: `catering-${Date.now()}`,
      name: `Event Catering (${type})`,
      image: cateringImg,
      price: estimatedTotal,
      quantity: 1,
      options: [{ name: 'Includes', value: details }]
    });

    setIsOpen(false);
    // Reset
    setItems({ Parfait: 0, Sandwiches: 0, Smoothies: 0, Juice: 0, Yoghurt: 0, FruitSalad: 0, BananaBread: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card rounded-2xl shadow-lg border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img src={cateringImg} alt="Event Catering" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </div>
        <div className="p-5 md:p-6 flex flex-col flex-1 items-center justify-center text-center gap-4">
          <h3 className="text-2xl font-bold font-serif">Event Catering</h3>
          <p className="text-sm text-muted-foreground mb-4">Indoor, outdoor, and bulk food supply for your special events. Customise your menu.</p>
          
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-white rounded-full font-bold h-12">
              Configure Catering
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl p-0">
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold font-serif">Configure Catering Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="space-y-4">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                Choose Event Type
              </h4>
              <PillToggle 
                options={['Indoor Catering', 'Outdoor Catering', 'Bulk Food Supply']} 
                selected={type} 
                onChange={setType} 
              />
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                Select Items & Quantities
              </h4>
              
              <div className="bg-muted/30 rounded-2xl p-4 border border-border space-y-4">
                {(Object.keys(items) as Array<keyof typeof items>).map(key => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{labels[key]}</div>
                      <div className="text-xs text-muted-foreground">{formatPrice(prices[key])} ea</div>
                    </div>
                    <div className="flex items-center bg-white rounded-full p-1 border border-border shadow-sm">
                      <button onClick={() => handleUpdateItem(key, -1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{items[key]}</span>
                      <button onClick={() => handleUpdateItem(key, 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Submit */}
            <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-secondary uppercase tracking-wider mb-1">Estimated Total</div>
                <div className="text-3xl font-black text-primary">{formatPrice(estimatedTotal)}</div>
              </div>
              <Button 
                onClick={handleAddToCart}
                disabled={estimatedTotal === 0}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 font-bold shadow-lg disabled:opacity-50"
              >
                Continue to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN SECTION EXPORT --- //

import { productService } from '@/services/product.service';
import type { Product as DomainProduct } from '@/types/domain';

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<DomainProduct[]>([]);

  useEffect(() => {
    productService.getFeaturedProducts().then(setFeaturedProducts).catch(console.error);
  }, []);

  // Map known slugs to their rich components
  const renderCardForSlug = (slug: string) => {
    switch (slug) {
      case 'vvip-exotic-parfait':
      case 'vip-exotic-parfait':
      case 'parfait':
        return <ParfaitCard key="parfait" />;
      case 'greek-yogurt':
        return <GreekYoghurtCard key="greek-yogurt" />;
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <section className="py-20 bg-background relative border-t border-border/20">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header with Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4"
            >
              Our Favourites
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground font-medium"
            >
              Crafted fresh, every single day with premium ingredients and zero artificial additives.
            </motion.p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border-2 border-border bg-white hover:bg-muted text-foreground flex items-center justify-center transition-colors shadow-sm"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border-2 border-border bg-white hover:bg-muted text-foreground flex items-center justify-center transition-colors shadow-sm"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Swipeable & Scrollable Horizontal Carousel */}
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
