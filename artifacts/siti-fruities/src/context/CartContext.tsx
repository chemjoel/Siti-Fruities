import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { trackMetaEvent } from '@/lib/metaPixel';
import { trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';

export type CartItemOption = {
  name: string;
  value: string;
};

export type CartItem = {
  id: string; // usually a combination of product name + options to make it unique
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  options?: CartItemOption[];
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  markCartOrderCompleted: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isCheckoutActive: boolean;
  setCheckoutActive: (isActive: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'siti_fruities_cart';
export const CART_ACTIVITY_STORAGE_KEY = 'siti_fruities_cart_activity_at';
export const CART_COMPLETED_STORAGE_KEY = 'siti_fruities_completed_cart_signature';

export function getCartSignature(items: CartItem[]) {
  try {
    return JSON.stringify(
      items
        .map((item) => [item.id, item.price, item.quantity])
        .sort(([leftId], [rightId]) => String(leftId).localeCompare(String(rightId))),
    );
  } catch {
    return '';
  }
}

const getInitialCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load cart from storage:', err);
    return [];
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutActive, setCheckoutActive] = useState(false);
  const previousCartSignature = useRef<string | null>(null);

  // Sync with localStorage
  React.useEffect(() => {
    const signature = getCartSignature(items);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }

    try {
      if (items.length === 0) {
        localStorage.removeItem(CART_ACTIVITY_STORAGE_KEY);
        localStorage.removeItem(CART_COMPLETED_STORAGE_KEY);
      } else if (previousCartSignature.current === null) {
        if (!localStorage.getItem(CART_ACTIVITY_STORAGE_KEY)) {
          localStorage.setItem(CART_ACTIVITY_STORAGE_KEY, String(Date.now()));
        }
      } else if (signature !== previousCartSignature.current) {
        const previousActivityAt = Number(localStorage.getItem(CART_ACTIVITY_STORAGE_KEY)) || 0;
        localStorage.setItem(CART_ACTIVITY_STORAGE_KEY, String(Math.max(Date.now(), previousActivityAt + 1)));
        localStorage.removeItem(CART_COMPLETED_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to update cart reminder storage:', err);
    }

    previousCartSignature.current = signature;
  }, [items]);

  const markCartOrderCompleted = useCallback(() => {
    try {
      localStorage.setItem(CART_COMPLETED_STORAGE_KEY, getCartSignature(items));
    } catch (err) {
      console.error('Failed to update completed cart reminder state:', err);
    }
  }, [items]);

  const addItem = useCallback((newItem: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      // Create a deterministic ID based on productId and selected options
      const optionsStr = newItem.options 
        ? newItem.options.map(o => `${o.name}:${o.value}`).sort().join('|')
        : 'no-opts';
      const id = `${newItem.productId}-${optionsStr}`;
      
      const existingItem = prev.find((item) => item.id === id);
      
      if (existingItem) {
        return prev.map((item) => 
          item.id === id 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      return [...prev, { ...newItem, id }];
    });

    trackMetaEvent('AddToCart', {
      content_ids: [newItem.productId],
      content_type: 'product',
      value: newItem.price * newItem.quantity,
      currency: 'NGN',
    });
    trackFirstPartyEvent('add_to_cart', { productId: newItem.productId });
    
    // Automatically open cart when adding
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => 
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0),
  [items]);

  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
  [items]);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        markCartOrderCompleted,
        totalItems, 
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutActive,
        setCheckoutActive,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
