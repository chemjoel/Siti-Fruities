import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Tag, Check, Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import type { DeliveryZone, Coupon, Order } from '@/types/domain';
import { deliveryService } from '@/services/delivery.service';
import { couponService } from '@/services/coupon.service';
import { productService } from '@/services/product.service';
import { orderService } from '@/services/order.service';
import { payWithPaystack } from '@/lib/paystack';
import OrderConfirmationModal from './OrderConfirmationModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
}

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

export default function CheckoutModal({ isOpen, onClose, subtotal }: CheckoutModalProps) {
  const { items } = useCart();

  // Delivery Zones
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');

  // Form Fields (Exact Approved Order)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [timing, setTiming] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orderNotes, setOrderNotes] = useState('');

  // State Feedback
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const [availabilityErrors, setAvailabilityErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Completed Order Modal State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Load delivery zones on open
  useEffect(() => {
    if (isOpen) {
      deliveryService.getDeliveryZones().then((res) => {
        setZones(res);
        if (res.length > 0 && !selectedZoneId) {
          setSelectedZoneId(res[0].id);
        }
      });
      setAvailabilityErrors([]);
    }
  }, [isOpen]);

  const currentZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const deliveryFee = currentZone ? Number(currentZone.delivery_fee) : 0;

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discount_value) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.discount_value, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Handle Coupon Apply
  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const coupon = await couponService.validateCoupon(couponCodeInput.trim(), subtotal);
      if (coupon) {
        setAppliedCoupon(coupon);
        setCouponSuccess(`Coupon ${coupon.code} applied!`);
      } else {
        setAppliedCoupon(null);
        setCouponError('Invalid or expired coupon code.');
      }
    } catch {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  // Handle Order Submit & Payment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setAvailabilityErrors([]);

    try {
      // 1. Availability Re-check (S6 Approved Decision)
      const productIds = items.map((i) => i.productId);
      const availabilityMap = await productService.checkAvailability(productIds);

      const unavailableItems: string[] = [];
      items.forEach((item) => {
        if (availabilityMap[item.productId] === false) {
          unavailableItems.push(item.name);
        }
      });

      if (unavailableItems.length > 0) {
        setAvailabilityErrors(unavailableItems);
        setIsSubmitting(false);
        return;
      }

      // 2. Create Order in Pending Payment status
      const newOrder = await orderService.createOrder({
        user_id: null,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: null,
        delivery_zone_id: currentZone.id,
        delivery_fee: deliveryFee,
        delivery_address: address.trim(),
        delivery_timing: timing,
        scheduled_date: timing === 'scheduled' ? scheduledDate : null,
        scheduled_time: timing === 'scheduled' ? scheduledTime : null,
        subtotal,
        coupon_id: appliedCoupon ? appliedCoupon.id : null,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        discount_amount: discountAmount,
        total: finalTotal,
        order_notes: orderNotes.trim() || null,
        items: items.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          selected_options: item.options || [],
          line_total: item.price * item.quantity,
        })),
        ...( { delivery_zone_name: currentZone.name } as any ),
      });

      // 3. Initiate Paystack Payment
      await payWithPaystack({
        email: `${phone.replace(/\D/g, '') || 'customer'}@sitifruities.com`,
        amount: finalTotal,
        reference: newOrder.order_number,
        metadata: {
          order_id: newOrder.id,
          order_number: newOrder.order_number,
          customer_name: name,
          customer_phone: phone,
        },
        onSuccess: async (ref) => {
          // Confirm payment locally/server
          await orderService.confirmPayment(newOrder.id, ref);
          const confirmed = await orderService.getOrderById(newOrder.id);
          setCompletedOrder(confirmed || newOrder);
          setIsSubmitting(false);
          onClose();
          setIsConfirmationOpen(true);
        },
        onClose: () => {
          setIsSubmitting(false);
        },
      });
    } catch (err: any) {
      console.error('Order submission error:', err);
      alert('An error occurred while creating your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[540px] p-0 rounded-3xl border-border bg-card flex flex-col max-h-[90dvh] w-[calc(100vw-2rem)]">
          {/* Header */}
          <div className="shrink-0 bg-primary/5 p-6 border-b border-border rounded-t-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-foreground">
                Complete Order
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Provide your details to complete your order and pay securely.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            {/* Availability Error Banner */}
            {availabilityErrors.length > 0 && (
              <div className="m-6 mb-0 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Some items are currently unavailable:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 pt-1">
                  {availabilityErrors.map((item, idx) => (
                    <li key={idx} className="font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] pt-1 text-destructive/80">
                  Please update or remove these items from your cart before proceeding.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* 1. Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-foreground">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="rounded-xl bg-white h-12"
                />
              </div>

              {/* 2. Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-bold text-foreground">
                  Phone Number (WhatsApp) *
                </Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0812 345 6789"
                  className="rounded-xl bg-white h-12"
                />
              </div>

              {/* 3. Delivery Zone */}
              <div className="space-y-2">
                <Label htmlFor="zone" className="text-sm font-bold text-foreground flex justify-between">
                  <span>Delivery Zone *</span>
                  {currentZone && (
                    <span className="text-primary font-bold">
                      {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                    </span>
                  )}
                </Label>
                <select
                  id="zone"
                  required
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full h-12 rounded-xl bg-white border border-input px-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                >
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} — {zone.delivery_fee === 0 ? 'FREE' : formatPrice(zone.delivery_fee)}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Delivery Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-bold text-foreground">
                  Delivery Address / Landmark *
                </Label>
                <Textarea
                  id="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full street address, building name, hostel/room number..."
                  className="rounded-xl bg-white resize-none h-20"
                />
              </div>

              {/* 5. Delivery Timing */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-foreground">Delivery Timing *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTiming('asap')}
                    className={`p-3.5 rounded-xl border text-sm font-bold flex flex-col items-center justify-center transition-all ${
                      timing === 'asap'
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>⚡ ASAP</span>
                    <span className="text-[11px] font-normal opacity-85">Est. 30–45 mins</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTiming('scheduled')}
                    className={`p-3.5 rounded-xl border text-sm font-bold flex flex-col items-center justify-center transition-all ${
                      timing === 'scheduled'
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>📅 Schedule for Later</span>
                    <span className="text-[11px] font-normal opacity-85">Pick date & time</span>
                  </button>
                </div>
              </div>

              {/* 6 & 7. Conditional Date & Time for Scheduled */}
              {timing === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border border-border animate-in fade-in-50">
                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-xs font-bold text-foreground">
                      Delivery Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="rounded-xl bg-white h-11 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="time" className="text-xs font-bold text-foreground">
                      Preferred Time *
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      required
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="rounded-xl bg-white h-11 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* 8. Coupon Code */}
              <div className="space-y-2">
                <Label htmlFor="coupon" className="text-sm font-bold text-foreground">
                  Coupon Code (Optional)
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="coupon"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="e.g. SITI10"
                      className="rounded-xl bg-white pl-10 h-11 uppercase"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCodeInput.trim()}
                    variant="outline"
                    className="rounded-xl h-11 px-4 font-bold shrink-0"
                  >
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </Button>
                </div>
                {couponSuccess && (
                  <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {couponSuccess}
                  </p>
                )}
                {couponError && <p className="text-xs font-semibold text-destructive">{couponError}</p>}
              </div>

              {/* 9. Order Notes */}
              <div className="space-y-2">
                <Label htmlFor="orderNotes" className="text-sm font-bold text-foreground">
                  Order Notes (Optional)
                </Label>
                <Textarea
                  id="orderNotes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Allergies, delivery instructions, packaging notes..."
                  className="rounded-xl bg-white resize-none h-16"
                />
              </div>

              {/* Cost Breakdown & Pay Action */}
              <div className="pt-4 border-t border-border space-y-3">
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee ({currentZone?.name || 'Selected Area'}):</span>
                    <span className="font-semibold text-foreground">
                      {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>–{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-foreground">Total to Pay:</span>
                    <span className="text-2xl font-black text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base transition-transform hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Securing Order...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secured with Paystack & WhatsApp Confirmation</span>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        order={completedOrder}
      />
    </>
  );
}
