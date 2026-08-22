/**
 * SITI FRUITIES — Order Service Implementation
 *
 * Handles order creation, snapshotted line items, human-readable order numbers,
 * status transitions, and payment confirmations.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { IOrderService, CreateOrderPayload } from '@/types/services';
import type { Order, OrderItem, OrderStatus } from '@/types/domain';

function generateClientOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SF-${dateStr}-${rand}`;
}

const LOCAL_ORDERS_KEY = 'siti_fruities_local_orders';

const getLocalOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalOrder = (order: Order) => {
  try {
    const orders = getLocalOrders();
    orders.unshift(order);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders.slice(0, 50)));
  } catch (err) {
    console.error('Failed to save local order:', err);
  }
};

export const orderService: IOrderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const orderId = crypto.randomUUID();
    const orderNumber = generateClientOrderNumber();
    const now = new Date().toISOString();

    const orderItems: OrderItem[] = payload.items.map((item) => ({
      id: crypto.randomUUID(),
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      selected_options: item.selected_options || [],
      line_total: item.unit_price * item.quantity,
    }));

    const order: Order = {
      id: orderId,
      order_number: orderNumber,
      user_id: payload.user_id,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_email: payload.customer_email,
      delivery_zone_id: payload.delivery_zone_id,
      delivery_zone_name: (payload as any).delivery_zone_name || 'Delivery Area',
      delivery_fee: payload.delivery_fee,
      delivery_address: payload.delivery_address,
      delivery_timing: payload.delivery_timing,
      scheduled_date: payload.scheduled_date,
      scheduled_time: payload.scheduled_time,
      subtotal: payload.subtotal,
      coupon_id: payload.coupon_id,
      coupon_code: payload.coupon_code,
      discount_amount: payload.discount_amount,
      total: payload.total,
      payment_status: 'pending',
      paystack_reference: null,
      order_status: 'pending_payment',
      order_notes: payload.order_notes,
      items: orderItems,
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured()) {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('create_authoritative_order', {
        p_payload: {
          user_id: payload.user_id,
          customer_name: payload.customer_name,
          customer_phone: payload.customer_phone,
          customer_email: payload.customer_email,
          delivery_zone_id: payload.delivery_zone_id,
          delivery_address: payload.delivery_address,
          delivery_timing: payload.delivery_timing,
          scheduled_date: payload.scheduled_date,
          scheduled_time: payload.scheduled_time,
          coupon_code: payload.coupon_code,
          order_notes: payload.order_notes,
          items: payload.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            selected_options: item.selected_options || [],
          })),
        },
      });

      if (rpcErr) {
        throw new Error(rpcErr.message || 'Server failed to create authoritative order');
      }

      if (rpcRes && rpcRes.success) {
        order.id = rpcRes.order_id;
        order.order_number = rpcRes.order_number;
        order.subtotal = Number(rpcRes.subtotal);
        order.delivery_fee = Number(rpcRes.delivery_fee);
        order.discount_amount = Number(rpcRes.discount_amount);
        order.total = Number(rpcRes.total);
      }
    }

    // Always keep a local copy for immediate client review
    saveLocalOrder(order);
    return order;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    if (isSupabaseConfigured()) {
      const { data: orderData, error } = await supabase
        .from<Order>('orders')
        .select('*')
        .or(`id.eq.${orderId},order_number.eq.${orderId}`)
        .maybeSingle();

      if (!error && orderData) {
        const { data: items } = await supabase
          .from<OrderItem>('order_items')
          .select('*')
          .eq('order_id', orderData.id);

        return { ...orderData, items: items || [] };
      }
    }

    const localOrders = getLocalOrders();
    return localOrders.find((o) => o.id === orderId || o.order_number === orderId) || null;
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    if (isSupabaseConfigured()) {
      const { data: orders, error } = await supabase
        .from<Order>('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && orders) {
        return orders;
      }
    }
    return getLocalOrders().filter((o) => o.user_id === userId);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase
        .from('orders')
        .update({ order_status: status })
        .or(`id.eq.${orderId},order_number.eq.${orderId}`);
    }

    const orders = getLocalOrders();
    const idx = orders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (idx !== -1) {
      orders[idx].order_status = status;
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    }
  },

  async attachPaymentReference(orderId: string, reference: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase
        .from('orders')
        .update({ paystack_reference: reference })
        .or(`id.eq.${orderId},order_number.eq.${orderId}`);
    }

    const orders = getLocalOrders();
    const idx = orders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (idx !== -1) {
      orders[idx].paystack_reference = reference;
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    }
  },

  async confirmPayment(orderId: string, paystackReference: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.rpc('confirm_order_payment', {
        p_order_id: orderId,
        p_paystack_ref: paystackReference,
      });
    }

    const orders = getLocalOrders();
    const idx = orders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (idx !== -1) {
      orders[idx].payment_status = 'paid';
      orders[idx].order_status = 'confirmed';
      orders[idx].paystack_reference = paystackReference;
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    }
  },
};
