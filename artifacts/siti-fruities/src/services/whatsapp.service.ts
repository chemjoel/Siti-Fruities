/**
 * SITI FRUITIES — WhatsApp Service Implementation
 *
 * Pure utility — no data-source dependency.
 * Builds pre-filled WhatsApp message URLs for all flows.
 *
 * Business WhatsApp number: 2348120842962
 */

import type {
  IWhatsAppService,
  WhatsAppOrderPayload,
} from '@/types/services';
import type {
  CateringEnquiry,
  CustomParfaitQuote,
  Order,
  OrderStatus,
} from '@/types/domain';

const WHATSAPP_NUMBER = '2348120842962';
const fmt = (n: number) => `₦${n.toLocaleString()}`;

function buildWaUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const whatsAppService: IWhatsAppService = {
  buildOrderMessage(payload: WhatsAppOrderPayload): string {
    const itemsText = payload.items
      .map((item) => {
        const opts = item.options ? ` (${item.options})` : '';
        return `• ${item.name}${opts} × ${item.quantity} — ${fmt(item.line_total)}`;
      })
      .join('\n');

    const timingLine =
      payload.delivery_timing === 'asap'
        ? '⏱️ *Delivery:* ASAP'
        : `📅 *Delivery Date:* ${payload.scheduled_date}\n🕒 *Delivery Time:* ${payload.scheduled_time}`;

    const couponLine =
      payload.coupon_code && payload.discount_amount > 0
        ? `\n🎟️ *Coupon:* ${payload.coupon_code} (–${fmt(payload.discount_amount)})`
        : '';

    const message = `🛍️ *NEW ORDER — SITI FRUITIES*
Ref: ${payload.order_reference}

👤 *Customer:* ${payload.customer_name}
📍 *Delivery Area:* ${payload.delivery_zone}
🏠 *Address:* ${payload.delivery_address}
${timingLine}

*ORDER ITEMS:*
${itemsText}

💰 *Subtotal:* ${fmt(payload.subtotal)}${couponLine}
🚚 *Delivery Fee:* ${payload.delivery_fee === 0 ? 'FREE' : fmt(payload.delivery_fee)}
💳 *TOTAL: ${fmt(payload.total)}*
${payload.order_notes ? `\n📝 *Notes:* ${payload.order_notes}` : ''}
_Sent from sitifruities.com_`;

    return buildWaUrl(message);
  },

  buildCateringEnquiryMessage(
    enquiry: Omit<CateringEnquiry, 'id' | 'created_at'>,
  ): string {
    const interests =
      enquiry.menu_interests.length > 0
        ? enquiry.menu_interests.join(', ')
        : 'Not specified';

    const message = `🍽️ *CATERING / EVENT ENQUIRY — SITI FRUITIES*

👤 *Name:* ${enquiry.customer_name}
📞 *Phone:* ${enquiry.customer_phone}${enquiry.customer_email ? `\n📧 *Email:* ${enquiry.customer_email}` : ''}

🎉 *Event Type:* ${enquiry.event_type}
👥 *Guest Count:* ${enquiry.guest_count}
📅 *Event Date:* ${enquiry.event_date || 'TBC'}

🥗 *Menu Interests:* ${interests}
${enquiry.event_details ? `\n📋 *Details:*\n${enquiry.event_details}` : ''}
_Sent from sitifruities.com_`;

    return buildWaUrl(message);
  },

  buildCustomParfaitMessage(
    quote: Omit<CustomParfaitQuote, 'id' | 'created_at'>,
  ): string {
    const fruits =
      quote.fruits.length > 0 ? quote.fruits.join(', ') : 'None';
    const toppings =
      quote.toppings.length > 0 ? quote.toppings.join(', ') : 'None';

    const message = `Hello SITI FRUITIES, I'd like to get a quote for a Custom Exotic Parfait.

Size: ${quote.size_label} — ${quote.size}
Yogurt: ${quote.yogurt_type} Greek Yogurt
Fruits: ${fruits}
Toppings: ${toppings}${quote.quantity > 1 ? `\nQuantity: ${quote.quantity}` : ''}

Please confirm the price and availability.`;

    return buildWaUrl(message);
  },

  buildStatusUpdateMessage(order: Order, newStatus: OrderStatus): string {
    const statusText: Record<OrderStatus, string> = {
      pending_payment: 'Pending Payment',
      confirmed: '✅ Confirmed',
      preparing: '👨‍🍳 Being Prepared',
      ready: '✅ Ready for Delivery',
      out_for_delivery: '🚚 Out for Delivery',
      delivered: '✅ Delivered',
      cancelled: '❌ Cancelled',
    };

    const ref = order.order_number || order.id.slice(0, 8).toUpperCase();
    const message = `Hello ${order.customer_name}! 👋

An update on your SITI FRUITIES order (Ref: ${ref}):

Status: *${statusText[newStatus]}*

Total Paid: ${fmt(order.total)}

Thank you for ordering with SITI FRUITIES! 🌿`;

    return buildWaUrl(message);
  },
};
