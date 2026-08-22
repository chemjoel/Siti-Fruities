/**
 * SITI FRUITIES — Core Domain Types
 *
 * These types represent the full future data model that will be backed by
 * Supabase once Phase 3B begins. They are intentionally complete so that:
 *
 *  1. Frontend components can be written against stable interfaces now.
 *  2. The Supabase schema can be derived directly from these types.
 *  3. Nothing needs to be re-typed when the backend is connected.
 *
 * CONVENTION
 * ----------
 * Types ending in `Row` mirror Supabase table rows exactly.
 * Types without `Row` are richer domain objects used by the UI layer.
 *
 * The current site uses LOCAL DATA that already conforms to the
 * `Product`, `ProductOption`, and `ProductOptionChoice` shapes —
 * so connecting Supabase later requires only swapping the data source,
 * not rewriting components.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

export type CategorySlug =
  | 'fruits'
  | 'greek-yogurt-parfaits'
  | 'smoothies'
  | 'cold-pressed-juices'
  | 'sandwiches-savoury'
  | 'milk-tea-drinks'
  | 'treat-boxes'
  | 'fruit-hampers'
  | 'combos'
  | 'catering-events';

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single selectable choice within a product option.
 * `price_modifier` is applied on top of the product's base_price.
 * A null/undefined modifier means the choice has no price change.
 */
export interface ProductOptionChoice {
  value: string;
  price_modifier?: number;
}

/**
 * A named dimension of variation for a product (e.g. "Size", "Yogurt Type").
 * A product can have zero or more options.
 */
export interface ProductOption {
  name: string;
  choices: ProductOptionChoice[];
}

/**
 * Product types drive special-case UI behaviour.
 *
 * standard      — normal add-to-cart product with fixed or option-based pricing
 * quote-only    — cannot be carted; uses WhatsApp "Get a Quote" flow (Custom Parfait)
 * enquiry-only  — cannot be carted; uses WhatsApp enquiry flow (Catering/Events)
 * bundle        — fixed-price collection of other products (Treat Boxes, Hampers, Combos)
 */
export type ProductType = 'standard' | 'quote-only' | 'enquiry-only' | 'bundle';

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string | null;       // Free-text, e.g. "Greek Yogurt, Apple, Grapes…"
  base_price: number;               // In Naira. 0 for quote-only products.
  image_url: string | null;
  product_type: ProductType;
  is_available: boolean;            // Toggled by admin; shows "Unavailable" UI when false
  is_featured: boolean;             // Appears on homepage featured section
  featured_order: number | null;    // Sort order within homepage featured
  display_order: number;            // Sort order within its category page
  options: ProductOption[];         // Empty array if no variants
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DELIVERY ZONES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Intentionally minimal. Each zone has a name and a fee.
 * The admin creates/edits zones from the dashboard.
 * At checkout: customer selects zone → fee is shown → enters specific address.
 */
export interface DeliveryZone {
  id: string;
  name: string;         // e.g. "Ile-Ife Campus", "Mayfair", "Ijimoba"
  delivery_fee: number; // In Naira
  display_order: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COUPONS
// ─────────────────────────────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'fixed_amount';

export interface Coupon {
  id: string;
  code: string;                      // e.g. "SITI10", "WELCOME500"
  discount_type: DiscountType;
  discount_value: number;            // e.g. 10 (for 10%) or 500 (for ₦500 off)
  is_active: boolean;
  expires_at: string | null;         // ISO timestamp; null = never expires
  minimum_order_amount: number | null; // null = no minimum
  usage_limit: number | null;        // null = unlimited
  used_count: number;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMOTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Promotional banners shown directly below the Hero section on the homepage.
 * Admin uploads a flyer image and writes a title/description.
 */
export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  flyer_url: string;                 // Supabase Storage URL once connected
  cta_label: string | null;         // e.g. "Shop Now", "Order Today"
  cta_link: string | null;          // Route or external URL
  is_active: boolean;
  display_order: number;
  starts_at: string | null;         // null = show immediately when active
  ends_at: string | null;           // null = no expiry
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// USER PROFILES & AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin';

/**
 * Extends Supabase auth.users with app-specific profile data.
 * Created automatically on first sign-in via a Supabase trigger.
 */
export interface UserProfile {
  id: string;               // Matches auth.users.id (UUID)
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVED ADDRESSES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A customer can store multiple addresses against their account.
 * No rigid type labels (Home/Work etc.) — just a free text label.
 * Guest customers do not have saved addresses.
 */
export interface SavedAddress {
  id: string;
  user_id: string;
  label: string | null;         // e.g. "My House", "Office"
  delivery_zone_id: string;
  address_detail: string;       // Full street address and landmarks
  is_default: boolean;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending_payment'    // Order submitted; awaiting Paystack confirmation
  | 'confirmed'          // Payment verified; order accepted
  | 'preparing'          // Being made
  | 'ready'              // Ready for pickup/delivery
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export type DeliveryTiming = 'asap' | 'scheduled';

/**
 * A snapshot of a single product at the moment the order was placed.
 * Prices stored here never change even if the product price is later updated.
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;               // Snapshot of name at order time
  unit_price: number;                 // Snapshot of price at order time
  quantity: number;
  selected_options: { name: string; value: string }[];  // Snapshot of selections
  line_total: number;                 // unit_price × quantity
}

export interface Order {
  id: string;                         // UUID (internal database primary key, never exposed to customer)
  order_number: string;               // Human-readable reference (e.g. SF-20260822-7A3D) shown to customer and admin
  user_id: string | null;             // null for guest orders
  // Customer info (stored as snapshot for both guests and registered users)
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  // Delivery
  delivery_zone_id: string;
  delivery_zone_name: string;         // Snapshot
  delivery_fee: number;               // Snapshot of fee at order time
  delivery_address: string;
  delivery_timing: DeliveryTiming;
  scheduled_date: string | null;      // ISO date; null if ASAP
  scheduled_time: string | null;      // HH:MM; null if ASAP
  // Pricing
  subtotal: number;
  coupon_id: string | null;
  coupon_code: string | null;         // Snapshot
  discount_amount: number;
  total: number;
  // Payment
  payment_status: PaymentStatus;
  paystack_reference: string | null;
  // Order
  order_status: OrderStatus;
  order_notes: string | null;
  items: OrderItem[];
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CATERING ENQUIRIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submitted when a customer fills out the Catering & Events form.
 * Not a normal order — leads to a WhatsApp conversation.
 * Stored for admin reference.
 */
export interface CateringEnquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  event_type: string;
  guest_count: string;
  event_date: string | null;
  menu_interests: string[];       // Multi-select from the existing MENU_INTERESTS list
  event_details: string | null;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM PARFAIT QUOTE REQUESTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submitted when a customer uses the Custom Exotic Parfait builder.
 * Generates a WhatsApp message. Can optionally be stored for admin records.
 */
export interface CustomParfaitQuote {
  id: string;
  customer_name: string | null;       // Optional; customer may not provide
  customer_phone: string | null;
  size: string;                       // e.g. "500ml", "1L"
  size_label: string;                 // e.g. "Medium", "Ay Bowl"
  yogurt_type: 'Sweetened' | 'Unsweetened';
  fruits: string[];                   // Selected fruit add-ins
  toppings: string[];                 // Selected toppings
  quantity: number;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CART (client-only — not persisted to Supabase)
// ─────────────────────────────────────────────────────────────────────────────

export type { CartItem, CartItemOption } from '@/context/CartContext';
