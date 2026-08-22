import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import { AnimatePresence, motion } from 'framer-motion';

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

export default function CartPanel() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-background border-l border-border shadow-2xl">
          <SheetHeader className="p-6 border-b border-border bg-card">
            <SheetTitle className="text-2xl font-serif font-bold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              Your Cart
            </SheetTitle>
            <SheetDescription>
              Review your items before checkout.
            </SheetDescription>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-8 max-w-[250px]">
                Looks like you haven't added any healthy treats yet.
              </p>
              <Button 
                onClick={() => setIsCartOpen(false)}
                className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-8 h-12"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm relative group"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start pr-6">
                            <h4 className="font-bold text-sm leading-tight mb-1">{item.name}</h4>
                          </div>
                          
                          {item.options && item.options.length > 0 && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {item.options.map(o => o.value).join(' · ')}
                            </p>
                          )}
                          
                          <div className="mt-auto flex items-center justify-between">
                            <span className="font-black text-primary text-sm">
                              {formatPrice(item.price)}
                            </span>
                            
                            <div className="flex items-center bg-muted rounded-full p-0.5 border border-border">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-foreground hover:shadow-sm transition-all"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-foreground hover:shadow-sm transition-all"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeItem(item.id)}
                          className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <div className="p-6 bg-card border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold text-foreground text-base">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Delivery</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl shadow-lg text-lg"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsCartOpen(false)}
                    className="w-full font-semibold h-12 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        subtotal={subtotal}
      />
    </>
  );
}
