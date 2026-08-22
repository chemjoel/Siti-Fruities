import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Check, MessageCircle, ShoppingBag, MapPin, Clock } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import type { Order } from '@/types/domain';
import { whatsAppService } from '@/services/whatsapp.service';
import { useCart } from '@/context/CartContext';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

export default function OrderConfirmationModal({ isOpen, onClose, order }: OrderConfirmationModalProps) {
  const { clearCart } = useCart();
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppRedirect = () => {
    const waUrl = whatsAppService.buildOrderMessage({
      order_reference: order.order_number,
      customer_name: order.customer_name,
      items: order.items.map((i) => ({
        name: i.product_name,
        options: i.selected_options.map((o) => o.value).join(', '),
        quantity: i.quantity,
        unit_price: i.unit_price,
        line_total: i.line_total,
      })),
      subtotal: order.subtotal,
      discount_amount: order.discount_amount,
      delivery_fee: order.delivery_fee,
      total: order.total,
      delivery_zone: order.delivery_zone_name,
      delivery_address: order.delivery_address,
      delivery_timing: order.delivery_timing,
      scheduled_date: order.scheduled_date,
      scheduled_time: order.scheduled_time,
      order_notes: order.order_notes,
      coupon_code: order.coupon_code,
    });

    window.open(waUrl, '_blank');
  };

  const handleDone = () => {
    clearCart();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDone()}>
      <DialogContent className="sm:max-w-[520px] p-0 rounded-3xl border-border bg-card flex flex-col max-h-[92dvh] w-[calc(100vw-2rem)] overflow-hidden">
        {/* Header with celebratory icon */}
        <div className="bg-emerald-600 text-white p-6 sm:p-8 text-center shrink-0">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-serif font-black mb-1 text-white">
            Order Confirmed!
          </DialogTitle>
          <DialogDescription className="text-white/90 text-sm font-medium">
            Thank you for ordering with SITI FRUITIES.
          </DialogDescription>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
          {/* Order Reference Box */}
          <div className="bg-muted/60 p-4 rounded-2xl border border-border flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Order Reference
              </span>
              <span className="text-lg sm:text-xl font-black text-primary font-mono tracking-tight">
                {order.order_number}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="rounded-xl h-9 px-3 gap-1.5 text-xs font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          {/* Delivery & Timing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-background border border-border flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground block">{order.delivery_zone_name}</span>
                <span className="text-muted-foreground line-clamp-2">{order.delivery_address}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-background border border-border flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground block">
                  {order.delivery_timing === 'asap' ? 'ASAP Delivery' : 'Scheduled Delivery'}
                </span>
                <span className="text-muted-foreground">
                  {order.delivery_timing === 'asap'
                    ? 'Est. 30–45 mins'
                    : `${order.scheduled_date} at ${order.scheduled_time}`}
                </span>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-2 border-t border-border pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Items Ordered ({order.items.length})
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs py-1">
                  <span className="text-foreground font-medium">
                    {item.product_name} × {item.quantity}
                    {item.selected_options.length > 0 && (
                      <span className="text-muted-foreground block text-[11px]">
                        {item.selected_options.map((o) => o.value).join(' · ')}
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-foreground">{formatPrice(item.line_total)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Box */}
          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount ({order.coupon_code})</span>
                <span>–{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>{order.delivery_fee === 0 ? 'FREE' : formatPrice(order.delivery_fee)}</span>
            </div>
            <div className="h-px bg-border my-1" />
            <div className="flex justify-between text-base font-black text-primary">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-card border-t border-border space-y-3 shrink-0">
          <Button
            onClick={handleWhatsAppRedirect}
            className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold h-14 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base transition-transform hover:scale-[1.02]"
          >
            <SiWhatsapp className="w-5 h-5" />
            Send Confirmation to WhatsApp
          </Button>

          <Button
            variant="ghost"
            onClick={handleDone}
            className="w-full font-semibold h-11 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
