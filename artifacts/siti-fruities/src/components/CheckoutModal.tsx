import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SiWhatsapp } from 'react-icons/si';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

export default function CheckoutModal({ isOpen, onClose, subtotal, deliveryFee, total }: CheckoutModalProps) {
  const { items } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    date: '',
    time: '',
    instructions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    let orderItemsText = items.map(item => {
      let optText = item.options && item.options.length > 0 
        ? ` (${item.options.map(o => o.value).join(', ')})` 
        : '';
      return `• ${item.name}${optText} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
    }).join('\n');

    const message = `🛍️ *NEW ORDER — SITI FRUITIES*

👤 *Customer:* ${formData.name}
📍 *Delivery Address:* ${formData.address}
📅 *Delivery Date:* ${formData.date}
🕒 *Delivery Time:* ${formData.time}

*ORDER ITEMS:*
${orderItemsText}

💰 *Subtotal:* ${formatPrice(subtotal)}
🚚 *Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
💳 *TOTAL: ${formatPrice(total)}*

📝 *Special Instructions:* ${formData.instructions || 'None'}

_Sent from sitifruities.com_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2348120842962?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 rounded-3xl overflow-hidden border-border bg-card">
        <div className="bg-primary/5 p-6 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold text-foreground">Complete Order</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please provide delivery details to send your order via WhatsApp.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleCheckout} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-foreground">Full Name *</Label>
            <Input 
              id="name" 
              name="name" 
              required 
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              className="rounded-xl bg-white h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-bold text-foreground">Delivery Address (Ile-Ife) *</Label>
            <Textarea 
              id="address" 
              name="address" 
              required 
              value={formData.address}
              onChange={handleChange}
              placeholder="Full street address, landmarks..."
              className="rounded-xl bg-white resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-bold text-foreground">Delivery Date *</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                required 
                value={formData.date}
                onChange={handleChange}
                className="rounded-xl bg-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-bold text-foreground">Preferred Time *</Label>
              <Input 
                id="time" 
                name="time" 
                type="time" 
                required 
                value={formData.time}
                onChange={handleChange}
                className="rounded-xl bg-white h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm font-bold text-foreground">Special Instructions (Optional)</Label>
            <Textarea 
              id="instructions" 
              name="instructions" 
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Allergies, packaging requests..."
              className="rounded-xl bg-white resize-none"
            />
          </div>

          <div className="pt-4 mt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left w-full sm:w-auto">
              <div className="text-sm text-muted-foreground">Total to pay:</div>
              <div className="text-2xl font-black text-primary">{formatPrice(total)}</div>
            </div>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold h-14 rounded-xl px-8 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <SiWhatsapp className="w-5 h-5" />
              Send Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
