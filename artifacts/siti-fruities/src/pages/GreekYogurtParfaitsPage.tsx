import React, { useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartPanel from '@/components/CartPanel';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  Info, 
  Layers, 
  Sparkles, 
  Apple,
  MessageCircle 
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { motion } from 'framer-motion';
import { enquiryService } from '@/services/enquiry.service';

// Helper for formatting currency
const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

export default function GreekYogurtParfaitsPage() {
  const { addItem } = useCart();

  // --- 1. GREEK YOGURT STATE ---
  const [yogurtType, setYogurtType] = useState<'Sweetened' | 'Unsweetened'>('Sweetened');
  const [yogurtSize, setYogurtSize] = useState<'330ml' | '500ml' | '1L' | '2L' | '5L'>('330ml');
  const [yogurtQty, setYogurtQty] = useState<number>(1);

  const yogurtPrices: Record<string, number> = {
    '330ml': 4500,
    '500ml': 6500,
    '1L': 12000,
    '2L': 23500,
    '5L': 56000
  };

  const yogurtUnitPrice = yogurtPrices[yogurtSize];
  const yogurtTotalPrice = yogurtUnitPrice * yogurtQty;

  const handleAddYogurt = () => {
    addItem({
      productId: 'greek-yogurt',
      name: `Greek Yogurt (${yogurtType})`,
      image: '/assets/Screenshot_20260729-212331_1785360049844.jpg',
      price: yogurtUnitPrice,
      quantity: yogurtQty,
      options: [
        { name: 'Yogurt Type', value: yogurtType },
        { name: 'Size', value: yogurtSize }
      ]
    });
    setYogurtQty(1);
  };

  // --- 2. VVIP PARFAIT STATE ---
  const [vvipYogurtType, setVvipYogurtType] = useState<'Sweetened' | 'Unsweetened'>('Sweetened');
  const [vvipSize, setVvipSize] = useState<'330ml' | '500ml' | '550ml' | '1L' | '2L' | '5L'>('500ml');
  const [vvipQty, setVvipQty] = useState<number>(1);

  const vvipBasePrices: Record<string, number> = {
    '330ml': 6000,
    '500ml': 8500,
    '550ml': 10000,
    '1L': 15000,
    '2L': 29000,
    '5L': 65000
  };

  const vvipUnitPrice = vvipBasePrices[vvipSize];
  const vvipTotalPrice = vvipUnitPrice * vvipQty;

  const handleAddVvip = () => {
    addItem({
      productId: 'vvip-exotic-parfait',
      name: 'VVIP Exotic Parfait',
      image: '/assets/IMG_8455_parfait_bowls.jpg',
      price: vvipUnitPrice,
      quantity: vvipQty,
      options: [
        { name: 'Yogurt Type', value: vvipYogurtType },
        { name: 'Size', value: vvipSize === '330ml' ? 'Mini (330ml)' : vvipSize === '500ml' ? 'Medium (500ml)' : vvipSize === '550ml' ? 'Gbemidele (550ml)' : vvipSize === '1L' ? 'Ay Bowl (1L)' : vvipSize === '2L' ? 'Wonder Bowl (2L)' : 'Twa Bowl (5L)' }
      ]
    });
    setVvipQty(1);
  };

  // --- 3. VIP PARFAIT STATE ---
  const [vipYogurtType, setVipYogurtType] = useState<'Sweetened' | 'Unsweetened'>('Sweetened');
  const [vipSize, setVipSize] = useState<'330ml' | '500ml' | '550ml' | '1L'>('500ml');
  const [vipQty, setVipQty] = useState<number>(1);

  const vipBasePrices: Record<string, number> = {
    '330ml': 5000,
    '500ml': 8000,
    '550ml': 9000,
    '1L': 13500
  };

  const vipUnitPrice = vipBasePrices[vipSize];
  const vipTotalPrice = vipUnitPrice * vipQty;

  const handleAddVip = () => {
    addItem({
      productId: 'vip-exotic-parfait',
      name: 'VIP Exotic Parfait',
      image: '/assets/IMG_6519_parfait_500ml.jpg',
      price: vipUnitPrice,
      quantity: vipQty,
      options: [
        { name: 'Yogurt Type', value: vipYogurtType },
        { name: 'Size', value: vipSize === '330ml' ? 'Mini (330ml)' : vipSize === '500ml' ? 'Medium (500ml)' : vipSize === '550ml' ? 'Gbemidele (550ml)' : 'Ay Bowl (1L)' }
      ]
    });
    setVipQty(1);
  };

  // --- 4. CUSTOM PARFAIT STATE ---
  const customSizeOptions = [
    { id: '330ml', label: 'Mini', volume: '330ml' },
    { id: '500ml', label: 'Medium', volume: '500ml' },
    { id: '550ml', label: 'Gbemidele', volume: '550ml' },
    { id: '1L', label: 'Ay Bowl', volume: '1 litre' },
    { id: '2L', label: 'Wonder Bowl', volume: '2 litres' },
    { id: '5L', label: 'Twa Bowl', volume: '5 litres' },
  ];

  const [customSize, setCustomSize] = useState<string>('500ml');
  const [customYogurtType, setCustomYogurtType] = useState<'Sweetened' | 'Unsweetened'>('Sweetened');
  const [customQty, setCustomQty] = useState<number>(1);

  const fruitOptions = ['Apple', 'Coconut', 'Grapes', 'Strawberries', 'Kiwi'];
  const [selectedFruits, setSelectedFruits] = useState<string[]>(['Apple', 'Grapes', 'Strawberries']);

  const toppingOptions = ['Granola with rolled oats', 'Raisins', 'Cashew nuts'];
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Granola with rolled oats', 'Cashew nuts']);

  const handleToggleFruit = (fruit: string) => {
    setSelectedFruits(prev => 
      prev.includes(fruit) ? prev.filter(f => f !== fruit) : [...prev, fruit]
    );
  };

  const handleToggleTopping = (topping: string) => {
    setSelectedToppings(prev => 
      prev.includes(topping) ? prev.filter(t => t !== topping) : [...prev, topping]
    );
  };

  const handleRequestQuote = () => {
    const sizeInfo = customSizeOptions.find(s => s.id === customSize) || { label: 'Medium', volume: '500ml' };
    const sizeStr = `${sizeInfo.label} — ${sizeInfo.volume}`;
    const fruitsStr = selectedFruits.length > 0 ? selectedFruits.join(', ') : 'None';
    const toppingsStr = selectedToppings.length > 0 ? selectedToppings.join(', ') : 'None';

    const message = `Hello SITI FRUITIES, I'd like to get a quote for a Custom Exotic Parfait.

Size: ${sizeStr}
Yogurt: ${customYogurtType} Greek Yogurt
Fruits: ${fruitsStr}
Toppings: ${toppingsStr}${customQty > 1 ? `\nQuantity: ${customQty}` : ''}

Please confirm the price and availability.`;

    // Store custom quote request for admin review
    enquiryService.submitCustomParfaitQuote({
      customer_name: null,
      customer_phone: null,
      size: sizeInfo.volume,
      size_label: sizeInfo.label,
      yogurt_type: customYogurtType,
      fruits: selectedFruits,
      toppings: selectedToppings,
      quantity: customQty,
    }).catch(console.error);

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2348120842962?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

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
              Exotic Parfaits & Greek Yogurt
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
              Fresh Greek Yogurt, fruits, nuts and crunchy toppings brought together in delicious combinations.
            </p>
          </div>
        </section>

        {/* --- 2. GREEK YOGURT SECTION --- */}
        <section id="greek-yogurt" className="py-16 bg-white border-b border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center">
              {/* Product Image Holder */}
              <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100/50 border border-border overflow-hidden relative group">
                <img 
                  src="/assets/Screenshot_20260729-212331_1785360049844.jpg" 
                  alt="Siti Fruities Greek Yogurt"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground shadow-sm">
                  100% Probiotic
                </span>
              </div>

              {/* Product Details & Selectors */}
              <div className="w-full md:w-1/2 space-y-6">
                <div>
                  <div className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                    Pure Yogurt
                  </div>
                  <h2 className="text-3xl font-bold font-serif text-foreground">Greek Yogurt</h2>
                  <p className="text-muted-foreground font-medium mt-2">
                    Highly rich in Probiotics, gut friendly and 100% healthy.
                  </p>
                </div>

                {/* Yogurt Type Choice */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Yogurt Type</label>
                  <div className="flex gap-2">
                    {['Sweetened', 'Unsweetened'].map(type => (
                      <button
                        key={type}
                        onClick={() => setYogurtType(type as any)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                          yogurtType === type
                            ? 'bg-primary border-primary text-white shadow-md'
                            : 'bg-white border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Yogurt Size Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Select Size</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(yogurtPrices).map(size => (
                      <button
                        key={size}
                        onClick={() => setYogurtSize(size as any)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          yogurtSize === size
                            ? 'bg-secondary border-secondary text-white shadow-sm'
                            : 'bg-white border-border text-foreground hover:border-secondary/50 hover:bg-secondary/5'
                        }`}
                      >
                        {size} — {formatPrice(yogurtPrices[size])}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity and Cart Addition */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Price</span>
                    <span className="text-2xl font-black text-primary leading-none mt-1">
                      {formatPrice(yogurtTotalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    {/* Qty Selector */}
                    <div className="flex items-center bg-muted rounded-full p-1 border border-border shrink-0">
                      <button 
                        onClick={() => setYogurtQty(Math.max(1, yogurtQty - 1))}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50"
                        disabled={yogurtQty <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-foreground">{yogurtQty}</span>
                      <button 
                        onClick={() => setYogurtQty(yogurtQty + 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <Button 
                      onClick={handleAddYogurt}
                      className="bg-secondary hover:bg-secondary/90 hover:shadow-md active:scale-95 text-white font-bold rounded-full h-11 px-6 text-sm transition-all flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Order</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. VVIP EXOTIC PARFAIT SECTION --- */}
        <section id="vvip-parfait" className="py-16 bg-[#FDFBF7] border-b border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="flex flex-col md:flex-row-reverse gap-8 lg:gap-12 items-center">
              {/* Product Image Holder */}
              <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl bg-gradient-to-br from-rose-50 to-pink-100/50 border border-border overflow-hidden relative group">
                <img 
                  src="/assets/IMG_8455_parfait_bowls.jpg" 
                  alt="Siti Fruities VVIP Exotic Parfait"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> Premium Selection
                </span>
              </div>

              {/* Product Details & Selectors */}
              <div className="w-full md:w-1/2 space-y-6">
                <div>
                  <div className="inline-block bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                    Premium Fruit Selection
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3">VVIP Exotic Parfait</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A luxurious medley of pure Greek Yogurt layered with apple, kiwi, strawberry, grapes, crunchy granola with rolled oats, raisins, and cashew nuts.
                  </p>
                </div>

                {/* Selectors */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Yogurt Base</label>
                    <div className="flex gap-3">
                      {(['Sweetened', 'Unsweetened'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setVvipYogurtType(t)}
                          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                            vvipYogurtType === t 
                              ? 'bg-secondary border-secondary text-white shadow-sm' 
                              : 'bg-white border-border text-foreground hover:border-secondary/40'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: '330ml', label: 'Mini (330ml)' },
                        { key: '500ml', label: 'Medium (500ml)' },
                        { key: '550ml', label: 'Gbemidele (550ml)' },
                        { key: '1L', label: 'Ay Bowl (1L)' },
                        { key: '2L', label: 'Wonder Bowl (2L)' },
                        { key: '5L', label: 'Twa Bowl (5L)' }
                      ].map((s) => (
                        <button
                          key={s.key}
                          onClick={() => setVvipSize(s.key as any)}
                          className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                            vvipSize === s.key 
                              ? 'bg-primary border-primary text-white shadow-sm' 
                              : 'bg-white border-border text-foreground hover:border-primary/40'
                          }`}
                        >
                          <div className="font-bold">{s.label}</div>
                          <div className="text-[10px] opacity-80">{formatPrice(vvipBasePrices[s.key])}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price and Cart Addition */}
                <div className="flex items-center justify-between pt-6 border-t border-border gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-primary">{formatPrice(vvipTotalPrice)}</span>
                    <span className="text-xs text-muted-foreground">Unit: {formatPrice(vvipUnitPrice)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-muted rounded-full p-1 border border-border">
                      <button 
                        onClick={() => setVvipQty(Math.max(1, vvipQty - 1))}
                        disabled={vvipQty <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{vvipQty}</span>
                      <button 
                        onClick={() => setVvipQty(vvipQty + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <Button 
                      onClick={handleAddVvip}
                      className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-bold shadow-md hover:shadow-lg transition-all h-11 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Order</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. VIP EXOTIC PARFAIT SECTION --- */}
        <section id="vip-parfait" className="py-16 bg-white border-b border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center">
              {/* Product Image Holder */}
              <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100/50 border border-border overflow-hidden relative group">
                <img 
                  src="/assets/IMG_6519_parfait_500ml.jpg" 
                  alt="Siti Fruities VIP Exotic Parfait"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground shadow-sm">
                  Classic Favorite
                </span>
              </div>

              {/* Product Details & Selectors */}
              <div className="w-full md:w-1/2 space-y-6">
                <div>
                  <div className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                    VIP Signature
                  </div>
                  <h2 className="text-3xl font-bold font-serif text-foreground">VIP Exotic Parfait</h2>
                  <p className="text-muted-foreground mt-2">
                    Our classic parfait layered with fresh apples, grapes, crunchy granola, raisins, and premium cashew nuts.
                  </p>
                </div>

                {/* Ingredients List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Ingredients Included</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Greek Yogurt', 'Apple', 'Coconut', 'Grapes', 'Granola with rolled oats', 'Raisins', 'Cashew nuts'].map((ing) => (
                      <span key={ing} className="px-2.5 py-1 bg-white border border-border/80 text-[11px] font-semibold rounded-lg text-foreground/80 flex items-center gap-1">
                        <Check className="w-3 h-3 text-secondary" /> {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Yogurt Choice */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Yogurt Base Choice</label>
                  <div className="flex gap-2">
                    {['Sweetened', 'Unsweetened'].map(type => (
                      <button
                        key={type}
                        onClick={() => setVipYogurtType(type as any)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                          vipYogurtType === type
                            ? 'bg-primary border-primary text-white shadow-md'
                            : 'bg-white border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Select Size & Volume</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries({
                      '330ml': 'Mini — 330ml',
                      '500ml': 'Medium — 500ml',
                      '550ml': 'Gbemidele — 550ml',
                      '1L': 'Ay Bowl — 1L'
                    }).map(([size, label]) => (
                      <button
                        key={size}
                        onClick={() => setVipSize(size as any)}
                        className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          vipSize === size
                            ? 'bg-secondary border-secondary text-white shadow-md'
                            : 'bg-white border-border text-foreground hover:border-secondary/50 hover:bg-secondary/5'
                        }`}
                      >
                        <span className="text-[10px] font-bold tracking-wide uppercase opacity-85">{size === '330ml' ? 'Mini' : size === '500ml' ? 'Medium' : size === '550ml' ? 'Gbemidele' : 'Ay Bowl'}</span>
                        <span className="text-xs font-semibold mt-0.5">{size}</span>
                        <span className="text-sm font-black mt-2">{formatPrice(vipBasePrices[size])}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total and Cart Button */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Price</span>
                    <span className="text-2xl font-black text-primary leading-none mt-1">
                      {formatPrice(vipTotalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    {/* Qty Selector */}
                    <div className="flex items-center bg-muted rounded-full p-1 border border-border shrink-0">
                      <button 
                        onClick={() => setVipQty(Math.max(1, vipQty - 1))}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50"
                        disabled={vipQty <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-foreground">{vipQty}</span>
                      <button 
                        onClick={() => setVipQty(vipQty + 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm text-foreground hover:text-primary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <Button 
                      onClick={handleAddVip}
                      className="bg-secondary hover:bg-secondary/90 hover:shadow-md active:scale-95 text-white font-bold rounded-full h-11 px-6 text-sm transition-all flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Order</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. CUSTOM EXOTIC PARFAIT SECTION --- */}
        <section id="custom-parfait" className="py-16 bg-[#FDFBF7] border-b border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="bg-card rounded-3xl border border-card-border p-6 md:p-10 shadow-lg space-y-8">
              
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                  <Layers className="w-3.5 h-3.5" /> Build Your Own
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Custom Exotic Parfait</h2>
                <p className="text-muted-foreground font-medium mt-2">
                  Select your size, yogurt base, and construct your own combination of fresh fruits and crunchy toppings.
                </p>
              </div>

              {/* Configurator Forms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-border">
                
                {/* Left Side: Selectors */}
                <div className="space-y-6">
                  {/* Size Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">1. Choose Size</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {customSizeOptions.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setCustomSize(item.id)}
                          className={`p-2.5 rounded-xl border text-left sm:text-center transition-all ${
                            customSize === item.id
                              ? 'bg-secondary border-secondary text-white shadow-sm font-bold'
                              : 'bg-white border-border text-foreground hover:border-secondary/50 hover:bg-secondary/5'
                          }`}
                        >
                          <span className="text-[10px] block opacity-85">{item.label}</span>
                          <span className="text-xs font-semibold">{item.volume}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Yogurt Base */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">2. Yogurt Base</label>
                    <div className="flex gap-2">
                      {['Sweetened', 'Unsweetened'].map(type => (
                        <button
                          key={type}
                          onClick={() => setCustomYogurtType(type as any)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                            customYogurtType === type
                              ? 'bg-primary border-primary text-white shadow-md'
                              : 'bg-white border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          {type} Greek Yogurt
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fruit Add-ins */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">3. Select Fruit Add-ins</label>
                    <div className="flex flex-wrap gap-2">
                      {fruitOptions.map((fruit) => {
                        const isSelected = selectedFruits.includes(fruit);
                        return (
                          <button
                            key={fruit}
                            onClick={() => handleToggleFruit(fruit)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-50 border-secondary text-secondary shadow-2xs font-bold'
                                : 'bg-white border-border text-foreground hover:border-secondary/50 hover:bg-secondary/5'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full flex items-center justify-center border transition-all ${
                              isSelected ? 'bg-secondary border-secondary' : 'bg-transparent border-border'
                            }`}>
                              {isSelected && <span className="w-1 h-1 bg-white rounded-full" />}
                            </span>
                            {fruit}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Crunchy Toppings */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">4. Crunchy Toppings</label>
                    <div className="flex flex-wrap gap-2">
                      {toppingOptions.map((topping) => {
                        const isSelected = selectedToppings.includes(topping);
                        return (
                          <button
                            key={topping}
                            onClick={() => handleToggleTopping(topping)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-50 border-secondary text-secondary shadow-2xs font-bold'
                                : 'bg-white border-border text-foreground hover:border-secondary/50 hover:bg-secondary/5'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full flex items-center justify-center border transition-all ${
                              isSelected ? 'bg-secondary border-secondary' : 'bg-transparent border-border'
                            }`}>
                              {isSelected && <span className="w-1 h-1 bg-white rounded-full" />}
                            </span>
                            {topping}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Side: Configuration Summary & Get Quote */}
                <div className="bg-muted/30 border border-border p-6 rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold font-serif text-foreground border-b border-border pb-2 flex items-center gap-2">
                      <span>🎨</span> Parfait Summary
                    </h3>
                    
                    <div className="space-y-3 text-sm text-foreground/90 font-medium">
                      <div className="flex justify-between items-center py-1 border-b border-border/50">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-bold text-foreground">
                          {customSizeOptions.find(s => s.id === customSize)?.label} — {customSizeOptions.find(s => s.id === customSize)?.volume}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-1 border-b border-border/50">
                        <span className="text-muted-foreground">Yogurt:</span>
                        <span className="text-primary font-bold">{customYogurtType} Greek Yogurt</span>
                      </div>

                      <div className="py-1 border-b border-border/50">
                        <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider block mb-1.5">Fruits:</span>
                        {selectedFruits.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedFruits.map(fruit => (
                              <span key={fruit} className="inline-flex items-center gap-1 bg-emerald-50 text-secondary border border-secondary/20 px-2 py-0.5 rounded-md text-xs font-semibold">
                                <Check className="w-3 h-3" /> {fruit}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None selected</span>
                        )}
                      </div>

                      <div className="py-1 border-b border-border/50">
                        <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider block mb-1.5">Toppings:</span>
                        {selectedToppings.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedToppings.map(topping => (
                              <span key={topping} className="inline-flex items-center gap-1 bg-emerald-50 text-secondary border border-secondary/20 px-2 py-0.5 rounded-md text-xs font-semibold">
                                <Check className="w-3 h-3" /> {topping}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None selected</span>
                        )}
                      </div>
                    </div>

                    {/* Custom Quote Notice */}
                    <div className="bg-secondary/5 border border-secondary/15 p-3.5 rounded-xl flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                        <strong>Custom order? Get a quote from SITI FRUITIES.</strong> Your custom combination will be priced based on your selections and ingredient quantities. Get a quote on WhatsApp.
                      </p>
                    </div>
                  </div>

                  {/* Quoting CTA Area */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center justify-between sm:flex-col sm:items-start">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</span>
                      <span className="text-lg sm:text-xl font-black text-primary leading-none sm:mt-1">
                        Quote Required
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Qty Selector */}
                      <div className="flex items-center bg-white rounded-full p-1 border border-border shadow-2xs shrink-0">
                        <button 
                          onClick={() => setCustomQty(Math.max(1, customQty - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors disabled:opacity-50"
                          disabled={customQty <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-sm text-foreground">{customQty}</span>
                        <button 
                          onClick={() => setCustomQty(customQty + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Button 
                        onClick={handleRequestQuote}
                        className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#1EBE5D] hover:shadow-md active:scale-95 text-white font-bold rounded-full h-11 px-6 text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <SiWhatsapp className="w-4 h-4" />
                        <span>Get a Quote</span>
                      </Button>
                    </div>
                  </div>

                </div>

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
