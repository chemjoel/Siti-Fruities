import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

export interface ProductOptionChoice {
  value: string;
  priceModifier?: number; // e.g. +1500 for large size
}

export interface ProductOption {
  name: string;
  choices: ProductOptionChoice[];
}

export interface Product {
  productId: string;
  name: string;
  description: string;
  basePrice: number;
  placeholderIcon: React.ComponentType<any>;
  placeholderGradient: string; // e.g. "from-orange-100 to-amber-100"
  options?: ProductOption[];
}

interface ProductCardProps {
  product: Product;
}

// Inline helper for formatting price
const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // Initialize options state with first choice of each option
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.options) {
      product.options.forEach((opt) => {
        if (opt.choices && opt.choices.length > 0) {
          initial[opt.name] = opt.choices[0].value;
        }
      });
    }
    return initial;
  });

  // Calculate current unit price based on selected options
  const calculateUnitPrice = () => {
    let price = product.basePrice;
    if (product.options) {
      product.options.forEach((opt) => {
        const selectedValue = selectedOptions[opt.name];
        const selectedChoice = opt.choices.find(c => c.value === selectedValue);
        if (selectedChoice && selectedChoice.priceModifier) {
          price += selectedChoice.priceModifier;
        }
      });
    }
    return price;
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = unitPrice * quantity;

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
      productId: product.productId,
      name: product.name,
      // We pass the Siti Fruities Logo as fallback thumbnail for cart list items
      image: '/assets/file_000000007ec48243992a1dcbe27b3dc6_1785361828173.png',
      price: unitPrice,
      quantity,
      options: formattedOptions,
    });
    
    // Reset quantity
    setQuantity(1);
  };

  const IconComponent = product.placeholderIcon;

  return (
    <div className="bg-card rounded-2xl shadow-md border border-card-border overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      
      {/* Polished Gradient Image Placeholder */}
      <div className={`relative aspect-[4/3] w-full bg-gradient-to-br ${product.placeholderGradient} flex flex-col items-center justify-center border-b border-card-border p-6 overflow-hidden shrink-0`}>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm group-hover:scale-105 transition-transform duration-300">
          <IconComponent className="w-10 h-10 stroke-[1.5] text-primary" />
        </div>
        <span className="text-[10px] font-bold tracking-widest text-primary/70 uppercase mt-4">Siti Fruities Fresh</span>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 gap-5">
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
          <div key={opt.name} className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Choose {opt.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {opt.choices.map((choice) => {
                const isSelected = selectedOptions[opt.name] === choice.value;
                const modifierText = choice.priceModifier 
                  ? ` (+${formatPrice(choice.priceModifier)})`
                  : '';
                return (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => handleOptionChange(opt.name, choice.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    {choice.value}{modifierText}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

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
