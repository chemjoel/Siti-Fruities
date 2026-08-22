/**
 * SITI FRUITIES — Service Layer Contracts
 *
 * These interfaces define what any data source (local static data, Supabase,
 * or anything else) must implement to feed the frontend.
 *
 * CURRENT STATE (Phase 3A):
 *   All service implementations return local/static data.
 *   The frontend already works using this static data.
 *
 * PHASE 3B (Supabase):
 *   Replace the local implementations with Supabase client calls.
 *   No component code changes required — only the service implementations swap.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * IMPORTANT RULES
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Never import Supabase client in this file — this is the interface layer.
 *  2. Never import React in this file — services are framework-agnostic.
 *  3. All methods return Promises so implementations can be async from the start.
 *  4. Services should throw/reject on error; callers handle the error boundary.
 */

import type {
  Product,
  Category,
  DeliveryZone,
  Coupon,
  Promotion,
  Order,
  OrderItem,
  CateringEnquiry,
  CustomParfaitQuote,
  UserProfile,
  SavedAddress,
  OrderStatus,
} from './domain';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export interface IProductService {
  /**
   * Fetch all active products for a given category slug.
   * Returns products ordered by their display_order.
   */
  getProductsByCategory(categorySlug: string): Promise<Product[]>;

  /**
   * Fetch a single product by its ID.
   */
  getProductById(id: string): Promise<Product | null>;

  /**
   * Fetch all featured products for the homepage, ordered by featured_order.
   */
  getFeaturedProducts(): Promise<Product[]>;

  /**
   * Fetch all categories, ordered by display_order.
   */
  getCategories(): Promise<Category[]>;

  /**
   * Check current availability of multiple products by their IDs.
   * Used at checkout to catch availability changes after cart was built.
   * Returns a map of product_id → is_available.
   */
  checkAvailability(productIds: string[]): Promise<Record<string, boolean>>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DELIVERY SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export interface IDeliveryService {
  /**
   * Fetch all delivery zones, ordered by display_order.
   */
  getDeliveryZones(): Promise<DeliveryZone[]>;
}

// ─────────────────────────────────────────────────────────────────────────────
// COUPON SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export interface ICouponService {
  /**
   * Validate a coupon code and return the coupon if valid.
   * Returns null if the code is invalid, expired, or inactive.
   *
   * IMPORTANT: In production this must be server-side validated (Supabase RPC
   * or Edge Function) — never trust frontend-only coupon calculations for the
   * order total sent to payment.
   */
  validateCoupon(code: string, orderSubtotal: number): Promise<Coupon | null>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMOTION SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export interface IPromotionService {
  /**
   * Fetch all currently active promotions to show below the Hero section.
   * Returns only promotions where is_active = true and within start/end dates.
   */
  getActivePromotions(): Promise<Promotion[]>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_zone_id: string;
  delivery_fee: number;
  delivery_address: string;
  delivery_timing: 'asap' | 'scheduled';
  scheduled_date: string | null;
  scheduled_time: string | null;
  subtotal: number;
  coupon_id: string | null;
  coupon_code: string | null;
  discount_amount: number;
  total: number;
  order_notes: string | null;
  items: Omit<OrderItem, 'id' | 'order_id'>[];
}

export interface IOrderService {
  /**
   * Create a new order and return it with its generated ID.
   * The order starts in `pending_payment` status.
   *
   * In Phase 3B this will use a Supabase transaction/RPC to ensure
   * the order and its items are created atomically.
   */
  createOrder(payload: CreateOrderPayload): Promise<Order>;

  /**
   * Fetch a single order by its ID.
   * Enforces user_id match for customer-facing requests (RLS handles this in Supabase).
   */
  getOrderById(orderId: string): Promise<Order | null>;

  /**
   * Fetch all orders for a registered user, newest first.
   */
  getOrdersByUser(userId: string): Promise<Order[]>;

  /**
   * Update order status (admin only in production via service role key).
   */
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;

  /**
   * Store the Paystack payment reference after the customer is redirected
   * to Paystack. Called before the payment is confirmed.
   */
  attachPaymentReference(orderId: string, reference: string): Promise<void>;

  /**
   * Confirm payment after server-side Paystack verification.
   * Moves order from `pending_payment` → `confirmed`.
   * This must only be called from a trusted server context (Supabase Edge Function).
   */
  confirmPayment(orderId: string, paystackReference: string): Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER ACCOUNT SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export interface ICustomerService {
  /**
   * Fetch the profile for a given user ID.
   */
  getProfile(userId: string): Promise<UserProfile | null>;

  /**
   * Update mutable profile fields (name, phone).
   */
  updateProfile(userId: string, updates: Partial<Pick<UserProfile, 'full_name' | 'phone'>>): Promise<void>;

  /**
   * Fetch all saved addresses for a user.
   */
  getSavedAddresses(userId: string): Promise<SavedAddress[]>;

  /**
   * Save a new delivery address for a user.
   */
  addSavedAddress(userId: string, address: Omit<SavedAddress, 'id' | 'user_id' | 'created_at'>): Promise<SavedAddress>;

  /**
   * Remove a saved address.
   */
  deleteSavedAddress(addressId: string): Promise<void>;

  /**
   * Set a saved address as the default for a user.
   * Clears the existing default first.
   */
  setDefaultAddress(userId: string, addressId: string): Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ENQUIRY SERVICE (Catering & Custom Parfait)
// ─────────────────────────────────────────────────────────────────────────────

export interface IEnquiryService {
  /**
   * Store a catering/events enquiry for admin reference.
   * Separate from the WhatsApp message which is always sent regardless.
   */
  submitCateringEnquiry(enquiry: Omit<CateringEnquiry, 'id' | 'created_at'>): Promise<CateringEnquiry>;

  /**
   * Optionally store a custom parfait quote request for admin reference.
   */
  submitCustomParfaitQuote(quote: Omit<CustomParfaitQuote, 'id' | 'created_at'>): Promise<CustomParfaitQuote>;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP MESSAGE BUILDER (pure utility — no data source dependency)
// ─────────────────────────────────────────────────────────────────────────────

export interface WhatsAppOrderPayload {
  order_reference: string;
  customer_name: string;
  items: { name: string; options: string; quantity: number; unit_price: number; line_total: number }[];
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  total: number;
  delivery_zone: string;
  delivery_address: string;
  delivery_timing: 'asap' | 'scheduled';
  scheduled_date: string | null;
  scheduled_time: string | null;
  order_notes: string | null;
  coupon_code: string | null;
}

export interface IWhatsAppService {
  /**
   * Build the WhatsApp URL for a completed order.
   * Returns the full wa.me URL with a pre-filled message.
   */
  buildOrderMessage(payload: WhatsAppOrderPayload): string;

  /**
   * Build the WhatsApp URL for a catering enquiry.
   */
  buildCateringEnquiryMessage(enquiry: Omit<CateringEnquiry, 'id' | 'created_at'>): string;

  /**
   * Build the WhatsApp URL for a custom parfait quote.
   */
  buildCustomParfaitMessage(quote: Omit<CustomParfaitQuote, 'id' | 'created_at'>): string;

  /**
   * Build the WhatsApp URL for an order status update notification.
   * Called by admin when they click "Notify Customer".
   */
  buildStatusUpdateMessage(order: Order, newStatus: OrderStatus): string;
}
