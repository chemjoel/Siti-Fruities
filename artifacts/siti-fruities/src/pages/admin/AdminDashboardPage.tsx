import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { authService } from '@/services/auth.service';
import { productService } from '@/services/product.service';
import { deliveryService } from '@/services/delivery.service';
import { orderService } from '@/services/order.service';
import { whatsAppService } from '@/services/whatsapp.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product, Category, DeliveryZone, Coupon, Promotion, Order, OrderStatus, CateringEnquiry, CustomParfaitQuote, ProductOption } from '@/types/domain';
import ImageUpload from '@/components/admin/ImageUpload';
import ProductOptionsBuilder from '@/components/admin/ProductOptionsBuilder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ClipboardList,
  Truck,
  Tag,
  Megaphone,
  MessageSquareQuote,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  DollarSign,
  PackageCheck,
  Layers,
  Download,
  Menu,
  X,
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

const formatPrice = (price: number) => `₦${Number(price).toLocaleString()}`;

const generateProductSlug = (name: string, existingProducts: Product[], currentProductId?: string): string => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!base) return '';

  const otherSlugs = new Set(
    existingProducts
      .filter((p) => p.id !== currentProductId && p.slug)
      .map((p) => p.slug.toLowerCase().trim())
  );

  if (!otherSlugs.has(base)) {
    return base;
  }

  let counter = 2;
  while (otherSlugs.has(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
};

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'delivery' | 'coupons' | 'promotions' | 'enquiries'>('overview');
  const [loading, setLoading] = useState(true);

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [cateringEnquiries, setCateringEnquiries] = useState<CateringEnquiry[]>([]);
  const [parfaitQuotes, setParfaitQuotes] = useState<CustomParfaitQuote[]>([]);

  // Modals & Forms State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);
  const [isSlugOverridden, setIsSlugOverridden] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isUploadingCategoryImage, setIsUploadingCategoryImage] = useState(false);

  // Zone Modal State
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Partial<DeliveryZone> | null>(null);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState(1000);

  // Zone Delete Confirm
  const [zoneToDelete, setZoneToDelete] = useState<DeliveryZone | null>(null);

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(3000);

  // Coupon Delete Confirm
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Promotion Modal State
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Partial<Promotion> | null>(null);
  const [isUploadingPromoFlyer, setIsUploadingPromoFlyer] = useState(false);

  // Load all dashboard data
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Categories & Products
      const cats = await productService.getCategories();
      setCategories(cats);

      let prods: Product[] = [];
      if (isSupabaseConfigured()) {
        const { data } = await supabase.from<Product>('products').select('*').order('display_order', { ascending: true });
        prods = data || [];
      }
      if (prods.length === 0) {
        prods = await productService.getFeaturedProducts();
      }
      setProducts(prods);

      // 2. Delivery Zones
      const z = await deliveryService.getDeliveryZones();
      setZones(z);

      // 3. Orders
      let ords: Order[] = [];
      if (isSupabaseConfigured()) {
        const { data: oList } = await supabase.from<Order>('orders').select('*').order('created_at', { ascending: false });
        if (oList) {
          const { data: itemsList } = await supabase.from('order_items').select('*');
          ords = oList.map((o) => ({
            ...o,
            items: (itemsList || []).filter((i: any) => i.order_id === o.id),
          }));
        }
      }
      if (ords.length === 0) {
        try {
          ords = JSON.parse(localStorage.getItem('siti_fruities_local_orders') || '[]');
        } catch {
          ords = [];
        }
      }
      setOrders(ords);

      // 4. Coupons
      if (isSupabaseConfigured()) {
        const { data: cList } = await supabase.from<Coupon>('coupons').select('*').order('created_at', { ascending: false });
        setCoupons(cList || []);
      } else {
        setCoupons([
          { id: '1', code: 'SITI10', discount_type: 'percentage', discount_value: 10, is_active: true, minimum_order_amount: 5000, usage_limit: 500, used_count: 3, expires_at: null, created_at: new Date().toISOString() },
          { id: '2', code: 'WELCOME500', discount_type: 'fixed_amount', discount_value: 500, is_active: true, minimum_order_amount: 3000, usage_limit: 1000, used_count: 12, expires_at: null, created_at: new Date().toISOString() },
        ]);
      }

      // 5. Promotions
      if (isSupabaseConfigured()) {
        const { data: pList } = await supabase.from<Promotion>('promotions').select('*').order('display_order', { ascending: true });
        setPromotions(pList || []);
      } else {
        setPromotions([
          { id: '1', title: 'Fresh Parfait Day Special', description: 'Experience our signature VVIP & VIP Exotic Parfaits', flyer_url: '/assets/IMG_8455_parfait_bowls.jpg', cta_label: 'Order Signature Parfait', cta_link: '/greek-yogurt-parfaits', is_active: true, display_order: 1, starts_at: null, ends_at: null, created_at: new Date().toISOString() },
        ]);
      }

      // 6. Enquiries
      if (isSupabaseConfigured()) {
        const { data: catEnq } = await supabase.from<CateringEnquiry>('catering_enquiries').select('*').order('created_at', { ascending: false });
        setCateringEnquiries(catEnq || []);

        const { data: pqList } = await supabase.from<CustomParfaitQuote>('custom_parfait_quotes').select('*').order('created_at', { ascending: false });
        setParfaitQuotes(pqList || []);
      } else {
        try {
          setCateringEnquiries(JSON.parse(localStorage.getItem('siti_fruities_local_catering') || '[]'));
          setParfaitQuotes(JSON.parse(localStorage.getItem('siti_fruities_local_parfait_quotes') || '[]'));
        } catch {}
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Verify Admin Auth on mount
  useEffect(() => {
    authService.isAdmin().then((isAdmin) => {
      if (!isAdmin) {
        setLocation('/admin/login');
      } else {
        loadData();
      }
    });
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    setLocation('/admin/login');
  };

  // ==========================================
  // Category Actions
  // ==========================================
  const toggleCategoryActive = async (category: Category) => {
    const next = !category.is_active;
    setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, is_active: next } : c)));
    if (isSupabaseConfigured()) {
      await supabase.from('categories').update({ is_active: next }).eq('id', category.id);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.slug) return;

    const payload: Partial<Category> = {
      name: editingCategory.name.trim(),
      slug: editingCategory.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') as any,
      description: editingCategory.description?.trim() || '',
      image_url: editingCategory.image_url || null,
      display_order: Number(editingCategory.display_order || categories.length + 1),
      is_active: editingCategory.is_active !== false,
    };

    if (editingCategory.id) {
      // Update
      setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? ({ ...c, ...payload } as Category) : c)));
      if (isSupabaseConfigured()) {
        await supabase.from('categories').update(payload).eq('id', editingCategory.id);
      }
    } else {
      // Create
      const newCat: Category = {
        id: crypto.randomUUID(),
        slug: payload.slug as any,
        name: payload.name!,
        description: payload.description!,
        image_url: payload.image_url || null,
        display_order: payload.display_order!,
        is_active: payload.is_active!,
      };
      setCategories((prev) => [...prev, newCat]);
      if (isSupabaseConfigured()) {
        await supabase.from('categories').insert(newCat);
      }
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (category: Category) => {
    const assignedCount = products.filter((p) => p.category_id === category.id).length;
    if (assignedCount > 0) {
      alert(`Cannot delete category "${category.name}" because ${assignedCount} product(s) are currently assigned to it. Please reassign those products or deactivate this category instead.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete category "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    setCategories((prev) => prev.filter((c) => c.id !== category.id));
    if (isSupabaseConfigured()) {
      await supabase.from('categories').delete().eq('id', category.id);
    }
  };

  // ==========================================
  // Product Actions
  // ==========================================
  const openAddProduct = () => {
    setEditingProduct({
      name: '',
      slug: '',
      base_price: 3000,
      is_available: true,
      is_featured: false,
      category_id: categories[0]?.id || '1',
      options: [],
      product_type: 'standard',
    });
    setIsSlugOverridden(false);
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    const autoSlug = generateProductSlug(product.name, products, product.id);
    setIsSlugOverridden(Boolean(product.slug && product.slug !== autoSlug));
    setIsProductModalOpen(true);
  };

  const toggleProductAvailability = async (product: Product) => {
    const nextState = !product.is_available;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, is_available: nextState } : p)));

    if (isSupabaseConfigured()) {
      await supabase.from('products').update({ is_available: nextState }).eq('id', product.id);
    }
  };

  const toggleProductFeatured = async (product: Product) => {
    const nextFeatured = !product.is_featured;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, is_featured: nextFeatured } : p)));

    if (isSupabaseConfigured()) {
      await supabase.from('products').update({ is_featured: nextFeatured }).eq('id', product.id);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.name.trim()) return;

    // Determine final valid slug (override if provided, otherwise auto-generate uniquely)
    const finalSlug = (
      editingProduct.slug && editingProduct.slug.trim()
        ? editingProduct.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
        : generateProductSlug(editingProduct.name, products, editingProduct.id)
    ) || `product-${Date.now().toString(36)}`;

    // Clean and sanitize options to ensure valid structure
    const cleanedOptions: ProductOption[] = (editingProduct.options || [])
      .filter((opt) => opt.name && opt.name.trim() !== '')
      .map((opt) => ({
        name: opt.name.trim(),
        choices: (opt.choices || [])
          .filter((c) => c.value && c.value.trim() !== '')
          .map((c) => ({
            value: c.value.trim(),
            price_modifier: c.price_modifier !== undefined && !isNaN(Number(c.price_modifier)) && Number(c.price_modifier) !== 0 ? Number(c.price_modifier) : undefined,
          })),
      }))
      .filter((opt) => opt.choices.length > 0);

    const payload: Partial<Product> = {
      category_id: editingProduct.category_id || categories[0]?.id || '1',
      name: editingProduct.name.trim(),
      slug: finalSlug,
      description: editingProduct.description?.trim() || '',
      ingredients: editingProduct.ingredients?.trim() || null,
      base_price: Number(editingProduct.base_price || 0),
      image_url: editingProduct.image_url || '/assets/IMG_8455_parfait_bowls.jpg',
      product_type: editingProduct.product_type || 'standard',
      is_available: editingProduct.is_available !== false,
      is_featured: editingProduct.is_featured || false,
      featured_order: editingProduct.is_featured ? (editingProduct.featured_order || 1) : null,
      display_order: Number(editingProduct.display_order || products.length + 1),
      options: cleanedOptions,
    };

    if (editingProduct.id) {
      // Update
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...payload } as Product) : p)));
      if (isSupabaseConfigured()) {
        await supabase.from('products').update(payload).eq('id', editingProduct.id);
      }
    } else {
      // Create
      const newProd: Product = {
        id: crypto.randomUUID(),
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Product;

      setProducts((prev) => [...prev, newProd]);
      if (isSupabaseConfigured()) {
        await supabase.from('products').insert(newProd);
      }
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    setIsSlugOverridden(false);
  };

  // ==========================================
  // Order Actions
  // ==========================================
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, order_status: newStatus } : null));
    }
    await orderService.updateOrderStatus(orderId, newStatus);
  };

  const handleNotifyCustomerWhatsApp = (order: Order) => {
    const waUrl = whatsAppService.buildStatusUpdateMessage(order, order.order_status);
    window.open(waUrl, '_blank');
  };

  // ==========================================
  // Delivery Zone Actions
  // ==========================================
  const openAddZone = () => {
    setEditingZone({ name: '', delivery_fee: 1000, display_order: zones.length + 1 });
    setNewZoneName('');
    setNewZoneFee(1000);
    setIsZoneModalOpen(true);
  };

  const openEditZone = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setNewZoneName(zone.name);
    setNewZoneFee(zone.delivery_fee);
    setIsZoneModalOpen(true);
  };

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;

    if (editingZone?.id) {
      // Update existing
      const updated = { ...editingZone, name: newZoneName.trim(), delivery_fee: Number(newZoneFee) };
      setZones((prev) => prev.map((z) => (z.id === editingZone.id ? { ...z, name: updated.name!, delivery_fee: updated.delivery_fee! } : z)));
      if (isSupabaseConfigured()) {
        await supabase.from('delivery_zones').update({ name: updated.name, delivery_fee: updated.delivery_fee }).eq('id', editingZone.id);
      }
    } else {
      // Create new
      const newZone: DeliveryZone = {
        id: crypto.randomUUID(),
        name: newZoneName.trim(),
        delivery_fee: Number(newZoneFee),
        display_order: zones.length + 1,
      };
      setZones((prev) => [...prev, newZone]);
      if (isSupabaseConfigured()) {
        await supabase.from('delivery_zones').insert(newZone);
      }
    }
    setIsZoneModalOpen(false);
    setEditingZone(null);
    setNewZoneName('');
    setNewZoneFee(1000);
  };

  const handleDeleteZone = async (zone: DeliveryZone) => {
    setZones((prev) => prev.filter((z) => z.id !== zone.id));
    if (isSupabaseConfigured()) {
      await supabase.from('delivery_zones').delete().eq('id', zone.id);
    }
    setZoneToDelete(null);
  };

  // ==========================================
  // Coupon Actions
  // ==========================================
  const openAddCoupon = () => {
    setEditingCoupon({ code: '', discount_type: 'percentage', discount_value: 10, is_active: true, minimum_order_amount: 3000, usage_limit: 500, used_count: 0, expires_at: null });
    setNewCouponCode('');
    setNewCouponType('percentage');
    setNewCouponValue(10);
    setNewCouponMin(3000);
    setIsCouponModalOpen(true);
  };

  const openEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setNewCouponCode(coupon.code);
    setNewCouponType(coupon.discount_type);
    setNewCouponValue(coupon.discount_value);
    setNewCouponMin(coupon.minimum_order_amount ?? 0);
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    if (editingCoupon?.id) {
      // Update existing
      const payload: Partial<Coupon> = {
        code: newCouponCode.trim().toUpperCase(),
        discount_type: newCouponType,
        discount_value: Number(newCouponValue),
        minimum_order_amount: Number(newCouponMin) || null,
        is_active: editingCoupon.is_active !== false,
      };
      setCoupons((prev) => prev.map((c) => (c.id === editingCoupon.id ? { ...c, ...payload } as Coupon : c)));
      if (isSupabaseConfigured()) {
        await supabase.from('coupons').update(payload).eq('id', editingCoupon.id);
      }
    } else {
      // Create new
      const newCoupon: Coupon = {
        id: crypto.randomUUID(),
        code: newCouponCode.trim().toUpperCase(),
        discount_type: newCouponType,
        discount_value: Number(newCouponValue),
        is_active: true,
        expires_at: null,
        minimum_order_amount: Number(newCouponMin) || null,
        usage_limit: 500,
        used_count: 0,
        created_at: new Date().toISOString(),
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      if (isSupabaseConfigured()) {
        await supabase.from('coupons').insert(newCoupon);
      }
    }
    setIsCouponModalOpen(false);
    setEditingCoupon(null);
    setNewCouponCode('');
  };

  const handleDeleteCoupon = async (coupon: Coupon) => {
    setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
    if (isSupabaseConfigured()) {
      await supabase.from('coupons').delete().eq('id', coupon.id);
    }
    setCouponToDelete(null);
  };

  const toggleCouponActive = async (coupon: Coupon) => {
    const next = !coupon.is_active;
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, is_active: next } : c)));
    if (isSupabaseConfigured()) {
      await supabase.from('coupons').update({ is_active: next }).eq('id', coupon.id);
    }
  };

  // ==========================================
  // Order Export (CSV + lightweight print-PDF)
  // ==========================================
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const header = ['Order Number', 'Date', 'Customer Name', 'Customer Phone', 'Delivery Zone', 'Delivery Address', 'Timing', 'Subtotal', 'Discount', 'Delivery Fee', 'Total', 'Payment Status', 'Order Status', 'Coupon Code', 'Paystack Ref', 'Items'];
    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleString(),
      o.customer_name,
      o.customer_phone,
      o.delivery_zone_name,
      `"${(o.delivery_address || '').replace(/"/g, '""')}"`,
      o.delivery_timing === 'asap' ? 'ASAP' : `Scheduled: ${o.scheduled_date} ${o.scheduled_time}`,
      o.subtotal,
      o.discount_amount,
      o.delivery_fee,
      o.total,
      o.payment_status,
      o.order_status,
      o.coupon_code || '',
      o.paystack_reference || '',
      `"${(o.items || []).map((i) => `${i.product_name} x${i.quantity}`).join('; ')}"`,
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siti-fruities-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    if (orders.length === 0) return;
    const rows = orders.map((o) => `
      <tr>
        <td>${o.order_number}</td>
        <td>${new Date(o.created_at).toLocaleDateString()}</td>
        <td>${o.customer_name}<br/><small>${o.customer_phone}</small></td>
        <td>${o.delivery_zone_name}</td>
        <td style="text-align:right">₦${Number(o.total).toLocaleString()}</td>
        <td>${o.payment_status.toUpperCase()}</td>
        <td>${o.order_status.replace(/_/g, ' ').toUpperCase()}</td>
      </tr>`).join('');
    const html = `<!DOCTYPE html><html><head><title>SITI FRUITIES Orders</title>
      <style>body{font-family:sans-serif;font-size:12px;padding:20px}
      h1{font-size:18px;margin-bottom:4px}p{margin:0 0 12px;color:#666}
      table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}
      th{background:#f5f5f5;font-weight:bold;font-size:10px;text-transform:uppercase}
      tr:nth-child(even){background:#fafafa}</style></head>
      <body><h1>SITI FRUITIES — Orders Report</h1>
      <p>Exported: ${new Date().toLocaleString()} · Total orders: ${orders.length}</p>
      <table><thead><tr><th>Order #</th><th>Date</th><th>Customer</th><th>Zone</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody></table></body></html>`;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 400);
    }
  };

  // ==========================================
  // Promotion Actions
  // ==========================================
  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo?.title?.trim()) return;

    const payload: Partial<Promotion> = {
      title: editingPromo.title.trim(),
      description: editingPromo.description?.trim() || null,
      flyer_url: editingPromo.flyer_url?.trim() || '/assets/IMG_8455_parfait_bowls.jpg',
      cta_label: editingPromo.cta_label?.trim() || 'Order Now',
      cta_link: editingPromo.cta_link?.trim() || '/greek-yogurt-parfaits',
      is_active: editingPromo.is_active !== false,
      display_order: Number(editingPromo.display_order || promotions.length + 1),
    };

    if (editingPromo.id) {
      // Update
      setPromotions((prev) => prev.map((p) => (p.id === editingPromo.id ? ({ ...p, ...payload } as Promotion) : p)));
      if (isSupabaseConfigured()) {
        await supabase.from('promotions').update(payload).eq('id', editingPromo.id);
      }
    } else {
      // Create
      const newPromo: Promotion = {
        id: crypto.randomUUID(),
        ...payload,
        starts_at: null,
        ends_at: null,
        created_at: new Date().toISOString(),
      } as Promotion;

      setPromotions((prev) => [...prev, newPromo]);
      if (isSupabaseConfigured()) {
        await supabase.from('promotions').insert(newPromo);
      }
    }

    setIsPromoModalOpen(false);
    setEditingPromo(null);
  };

  const togglePromoActive = async (promo: Promotion) => {
    const next = !promo.is_active;
    setPromotions((prev) => prev.map((p) => (p.id === promo.id ? { ...p, is_active: next } : p)));
    if (isSupabaseConfigured()) {
      await supabase.from('promotions').update({ is_active: next }).eq('id', promo.id);
    }
  };

  const handleDeletePromo = async (promo: Promotion) => {
    if (!confirm(`Are you sure you want to remove promotion "${promo.title}"?`)) {
      return;
    }
    setPromotions((prev) => prev.filter((p) => p.id !== promo.id));
    if (isSupabaseConfigured()) {
      await supabase.from('promotions').delete().eq('id', promo.id);
    }
  };

  // KPI Calculations
  const totalRevenue = orders.filter((o) => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.order_status === 'pending_payment' || o.order_status === 'confirmed' || o.order_status === 'preparing').length;
  // Total enquiries (catering + parfait quotes) — shown as badge since there is no read/unread status field
  const enquiryCount = cateringEnquiries.length + parfaitQuotes.length;

  return (
    <div className="min-h-[100dvh] bg-muted/20 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-serif font-black text-lg">
            S
          </div>
          <div>
            <h1 className="font-bold font-serif text-lg leading-tight text-foreground">SITI FRUITIES Admin</h1>
            <span className="text-xs text-muted-foreground">Store Operations &amp; Management</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => window.open('/', '_blank')}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted px-3 py-2 rounded-xl transition-colors"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleSignOut}
            className="rounded-xl h-9 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* =========================================================================
          MOBILE NAV DRAWER — shown only on <md screens, slides in from left
         ========================================================================= */}
      {isMobileNavOpen && (
        <>
          {/* Backdrop — tap outside to close */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileNavOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-serif font-black text-base">
                  S
                </div>
                <span className="font-bold font-serif text-sm text-foreground leading-tight">SITI FRUITIES Admin</span>
              </div>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {(
                [
                  { tab: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
                  { tab: 'orders', label: 'Orders', icon: <ClipboardList className="w-4 h-4 shrink-0" />, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
                  { tab: 'products', label: 'Products', icon: <ShoppingBag className="w-4 h-4 shrink-0" /> },
                  { tab: 'categories', label: 'Categories', icon: <FolderTree className="w-4 h-4 shrink-0" /> },
                  { tab: 'delivery', label: 'Delivery Zones', icon: <Truck className="w-4 h-4 shrink-0" /> },
                  { tab: 'coupons', label: 'Coupons', icon: <Tag className="w-4 h-4 shrink-0" /> },
                  { tab: 'promotions', label: 'Promotions', icon: <Megaphone className="w-4 h-4 shrink-0" /> },
                  { tab: 'enquiries', label: 'Catering & Quotes', icon: <MessageSquareQuote className="w-4 h-4 shrink-0" />, badge: enquiryCount > 0 ? enquiryCount : null },
                ] as { tab: typeof activeTab; label: string; icon: React.ReactNode; badge?: number | null }[]
              ).map(({ tab, label, icon, badge }) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setIsMobileNavOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
                    activeTab === tab ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {icon}
                    <span>{label}</span>
                  </div>
                  {badge != null && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Main Body */}
      <div className="flex-1 flex flex-row">
        {/* Sidebar Nav — desktop only (md+) */}
        <aside className="hidden md:flex md:w-64 bg-card border-r border-border p-4 flex-col gap-1.5 shrink-0 shadow-2xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'overview' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'orders' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>Orders</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'orders' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'products' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'categories' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FolderTree className="w-4 h-4 shrink-0" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'delivery' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span>Delivery Zones</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'coupons' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Tag className="w-4 h-4 shrink-0" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'promotions' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Promotions</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'enquiries' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquareQuote className="w-4 h-4 shrink-0" />
              <span>Catering &amp; Quotes</span>
            </div>
            {enquiryCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'enquiries' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                {enquiryCount}
              </span>
            )}
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto min-w-0">
          {/* =========================================================================
              TAB: OVERVIEW
             ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-black text-foreground">Dashboard Overview</h2>
                <p className="text-sm text-muted-foreground">Welcome back. Here is your current business summary.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card p-5 rounded-3xl border border-border shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Paid Revenue</span>
                    <span className="text-2xl font-black text-foreground block">{formatPrice(totalRevenue)}</span>
                  </div>
                </div>

                <div className="bg-card p-5 rounded-3xl border border-border shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Active Orders</span>
                    <span className="text-2xl font-black text-foreground block">{pendingOrdersCount}</span>
                  </div>
                </div>

                <div className="bg-card p-5 rounded-3xl border border-border shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Total Orders</span>
                    <span className="text-2xl font-black text-foreground block">{orders.length}</span>
                  </div>
                </div>

                <div className="bg-card p-5 rounded-3xl border border-border shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Products Online</span>
                    <span className="text-2xl font-black text-foreground block">
                      {products.filter((p) => p.is_available).length} / {products.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Product Availability Toggle Table */}
              <div className="bg-card rounded-3xl border border-border p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-foreground">Quick Availability Switch</h3>
                    <p className="text-xs text-muted-foreground">Toggle availability on and off in real time</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab('products')} className="rounded-xl text-xs">
                    Manage Products
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.slice(0, 9).map((product) => (
                    <div key={product.id} className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3">
                      <div className="truncate">
                        <span className="font-bold text-xs text-foreground block truncate">{product.name}</span>
                        <span className="text-[11px] text-muted-foreground">{formatPrice(product.base_price)}</span>
                      </div>
                      <button
                        onClick={() => toggleProductAvailability(product)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                          product.is_available
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                        }`}
                      >
                        {product.is_available ? 'Available' : 'Unavailable'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="bg-card rounded-3xl border border-border p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-foreground">Recent Orders</h3>
                    <p className="text-xs text-muted-foreground">Latest customer checkout transactions</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab('orders')} className="rounded-xl text-xs">
                    View All Orders
                  </Button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No orders placed yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                          <th className="pb-3">Order Ref</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Area</th>
                          <th className="pb-3">Total</th>
                          <th className="pb-3">Payment</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-muted/30">
                            <td className="py-3 font-mono font-bold text-primary">{order.order_number}</td>
                            <td className="py-3 font-semibold text-foreground">{order.customer_name}</td>
                            <td className="py-3 text-muted-foreground">{order.delivery_zone_name}</td>
                            <td className="py-3 font-bold text-foreground">{formatPrice(order.total)}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  order.payment_status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : order.payment_status === 'refunded'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {order.payment_status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full text-[10px]">
                                {order.order_status.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)} className="h-7 text-xs rounded-lg">
                                Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: ORDERS
             ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Order Management</h2>
                  <p className="text-sm text-muted-foreground">Manage and track customer order delivery progression</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportCSV}
                    disabled={orders.length === 0}
                    className="rounded-xl text-xs gap-1.5 font-bold"
                    title={orders.length === 0 ? 'No orders to export' : 'Export all orders as CSV'}
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePrintPDF}
                    disabled={orders.length === 0}
                    className="rounded-xl text-xs gap-1.5 font-bold"
                    title={orders.length === 0 ? 'No orders to export' : 'Print / Save as PDF'}
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </Button>
                </div>
              </div>

              <div className="bg-card rounded-3xl border border-border p-6 shadow-xs">
                {orders.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-12">No orders recorded.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                          <th className="pb-3">Order Number</th>
                          <th className="pb-3">Customer & Phone</th>
                          <th className="pb-3">Delivery Zone</th>
                          <th className="pb-3">Timing</th>
                          <th className="pb-3">Total</th>
                          <th className="pb-3">Payment</th>
                          <th className="pb-3">Order Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-muted/30">
                            <td className="py-4 font-mono font-bold text-primary">{order.order_number}</td>
                            <td className="py-4">
                              <span className="font-bold text-foreground block">{order.customer_name}</span>
                              <span className="text-muted-foreground text-[11px]">{order.customer_phone}</span>
                            </td>
                            <td className="py-4 text-muted-foreground">{order.delivery_zone_name}</td>
                            <td className="py-4">
                              <span className="font-semibold block">{order.delivery_timing === 'asap' ? '⚡ ASAP' : '📅 Scheduled'}</span>
                              {order.delivery_timing === 'scheduled' && (
                                <span className="text-[11px] text-muted-foreground">
                                  {order.scheduled_date} ({order.scheduled_time})
                                </span>
                              )}
                            </td>
                            <td className="py-4 font-black text-foreground">{formatPrice(order.total)}</td>
                            <td className="py-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  order.payment_status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {order.payment_status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4">
                              <select
                                value={order.order_status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="bg-white border border-input rounded-xl px-2.5 py-1 text-xs font-bold text-primary focus:ring-1 focus:ring-primary shadow-2xs"
                              >
                                <option value="pending_payment">Pending Payment</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-4 text-right space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleNotifyCustomerWhatsApp(order)}
                                className="h-8 rounded-xl text-xs gap-1 text-[#25D366] hover:bg-[#25D366]/10"
                              >
                                <SiWhatsapp className="w-3.5 h-3.5" />
                                Notify
                              </Button>
                              <Button size="sm" onClick={() => setSelectedOrder(order)} className="h-8 rounded-xl text-xs">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: PRODUCTS
             ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Products Catalogue</h2>
                  <p className="text-sm text-muted-foreground">Manage menu items, prices, photo uploads, variants, and featured ordering</p>
                </div>
                <Button
                  onClick={openAddProduct}
                  className="rounded-2xl gap-2 font-bold shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>

              <div className="bg-card rounded-3xl border border-border p-6 shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Base Price</th>
                        <th className="pb-3">Options</th>
                        <th className="pb-3">Featured</th>
                        <th className="pb-3">Availability</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((product) => {
                        const cat = categories.find((c) => c.id === product.category_id);
                        return (
                          <tr key={product.id} className="hover:bg-muted/30">
                            <td className="py-3 flex items-center gap-3">
                              <img
                                src={product.image_url || '/assets/IMG_8455_parfait_bowls.jpg'}
                                alt={product.name}
                                className="w-11 h-11 rounded-xl object-cover bg-muted shrink-0 border border-border"
                              />
                              <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                                <span className="font-bold text-foreground block truncate">{product.name}</span>
                                <span className="text-[11px] text-muted-foreground line-clamp-1">{product.description}</span>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded-lg text-[10px]">
                                {cat ? cat.name : 'General'}
                              </span>
                            </td>
                            <td className="py-3 font-bold text-foreground">{formatPrice(product.base_price)}</td>
                            <td className="py-3">
                              {product.options && product.options.length > 0 ? (
                                <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 w-fit">
                                  <Layers className="w-3 h-3" />
                                  {product.options.length} Group{product.options.length === 1 ? '' : 's'}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-[11px]">None</span>
                              )}
                            </td>
                            <td className="py-3">
                              <button
                                onClick={() => toggleProductFeatured(product)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  product.is_featured ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {product.is_featured ? `★ Featured (${product.featured_order || '-'})` : 'No'}
                              </button>
                            </td>
                            <td className="py-3">
                              <button
                                onClick={() => toggleProductAvailability(product)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                  product.is_available
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                    : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                                }`}
                              >
                                {product.is_available ? 'Available' : 'Unavailable'}
                              </button>
                            </td>
                            <td className="py-3 text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditProduct(product)}
                                className="h-8 rounded-xl text-xs gap-1"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: CATEGORIES (NEW SECTION)
             ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Category Management</h2>
                  <p className="text-sm text-muted-foreground">Manage product categories, display ordering, and storefront visibility</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingCategory({
                      name: '',
                      slug: '' as any,
                      description: '',
                      image_url: null,
                      display_order: categories.length + 1,
                      is_active: true,
                    });
                    setIsCategoryModalOpen(true);
                  }}
                  className="rounded-2xl gap-2 font-bold shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const assignedCount = products.filter((p) => p.category_id === category.id).length;
                  return (
                    <div key={category.id} className="bg-card p-5 rounded-3xl border border-border shadow-xs flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-12 h-12 rounded-2xl object-cover bg-muted shrink-0 border border-border"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                                <FolderTree className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-base text-foreground leading-tight">{category.name}</h3>
                              <span className="font-mono text-[11px] text-muted-foreground">/{category.slug}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleCategoryActive(category)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                              category.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {category.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </button>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {category.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
                          {assignedCount} Product{assignedCount === 1 ? '' : 's'} · Pos: {category.display_order}
                        </span>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCategory(category);
                              setIsCategoryModalOpen(true);
                            }}
                            className="h-8 rounded-xl text-xs gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCategory(category)}
                            className="h-8 rounded-xl text-xs text-destructive hover:bg-destructive/10"
                            title={assignedCount > 0 ? 'Cannot delete category with active products' : 'Delete category'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: DELIVERY ZONES
             ========================================================================= */}
          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Delivery Zones &amp; Fees</h2>
                  <p className="text-sm text-muted-foreground">Admin-controlled pricing per delivery zone (No hardcoded threshold)</p>
                </div>
                <Button onClick={openAddZone} className="rounded-2xl gap-2 font-bold shadow-xs">
                  <Plus className="w-4 h-4" />
                  Add Zone
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {zones.map((zone) => (
                  <div key={zone.id} className="bg-card p-5 rounded-3xl border border-border shadow-xs flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-foreground block">{zone.name}</span>
                        <span className="text-xs text-primary font-black mt-1 block">
                          {zone.delivery_fee === 0 ? 'FREE (₦0)' : formatPrice(zone.delivery_fee)}
                        </span>
                      </div>
                      <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-1 rounded-full shrink-0">
                        Pos: {zone.display_order}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 pt-2 border-t border-border">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditZone(zone)}
                        className="h-8 rounded-xl text-xs gap-1 flex-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setZoneToDelete(zone)}
                        className="h-8 rounded-xl text-xs text-destructive hover:bg-destructive/10 flex-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: COUPONS
             ========================================================================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Coupon Codes</h2>
                  <p className="text-sm text-muted-foreground">Manage discounts and promotional checkout coupons</p>
                </div>
                <Button onClick={openAddCoupon} className="rounded-2xl gap-2 font-bold shadow-xs">
                  <Plus className="w-4 h-4" />
                  Create Coupon
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-card p-5 rounded-3xl border border-border shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-black text-lg text-primary tracking-wider block">{c.code}</span>
                        <span className="text-xs text-muted-foreground font-semibold">
                          {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `–${formatPrice(c.discount_value)}`}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleCouponActive(c)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {c.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </div>

                    <div className="text-[11px] text-muted-foreground space-y-1 pt-2 border-t border-border">
                      <div>Min Order: {c.minimum_order_amount ? formatPrice(c.minimum_order_amount) : 'None'}</div>
                      <div>
                        Used: {c.used_count} / {c.usage_limit || '∞'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 pt-1 border-t border-border">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditCoupon(c)}
                        className="h-8 rounded-xl text-xs gap-1 flex-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCouponToDelete(c)}
                        className="h-8 rounded-xl text-xs text-destructive hover:bg-destructive/10 flex-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: PROMOTIONS
             ========================================================================= */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Homepage Promotional Banners</h2>
                  <p className="text-sm text-muted-foreground">Appears directly below the Hero section on the homepage</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingPromo({
                      title: '',
                      description: '',
                      flyer_url: '/assets/IMG_8455_parfait_bowls.jpg',
                      cta_label: 'Order Now',
                      cta_link: '/greek-yogurt-parfaits',
                      is_active: true,
                      display_order: promotions.length + 1,
                    });
                    setIsPromoModalOpen(true);
                  }}
                  className="rounded-2xl gap-2 font-bold shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Promotion
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {promotions.map((p) => (
                  <div key={p.id} className="bg-card p-5 rounded-3xl border border-border shadow-xs flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.flyer_url}
                            alt={p.title}
                            className="w-14 h-14 rounded-2xl object-cover bg-muted shrink-0 border border-border"
                          />
                          <div>
                            <h3 className="font-bold text-base text-foreground leading-tight">{p.title}</h3>
                            <span className="text-[11px] text-primary font-semibold block mt-0.5">
                              {p.cta_label} → {p.cta_link}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => togglePromoActive(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                            p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
                        Pos: {p.display_order}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingPromo(p);
                            setIsPromoModalOpen(true);
                          }}
                          className="h-8 rounded-xl text-xs gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePromo(p)}
                          className="h-8 rounded-xl text-xs text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: ENQUIRIES
             ========================================================================= */}
          {activeTab === 'enquiries' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-black text-foreground">Catering & Custom Quotes</h2>
                <p className="text-sm text-muted-foreground">Logged customer enquiries from Catering and Custom Parfait builders</p>
              </div>

              {/* Catering Enquiries */}
              <div className="bg-card rounded-3xl border border-border p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-foreground">Catering & Event Submissions</h3>
                {cateringEnquiries.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">No catering enquiries submitted yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Phone</th>
                          <th className="pb-3">Event Type</th>
                          <th className="pb-3">Guests</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Interests</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {cateringEnquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-muted/30">
                            <td className="py-3 font-bold text-foreground">{enq.customer_name}</td>
                            <td className="py-3 font-mono">{enq.customer_phone}</td>
                            <td className="py-3">{enq.event_type}</td>
                            <td className="py-3">{enq.guest_count}</td>
                            <td className="py-3">{enq.event_date || 'TBC'}</td>
                            <td className="py-3 text-muted-foreground">{(enq.menu_interests || []).join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Custom Parfait Quotes */}
              <div className="bg-card rounded-3xl border border-border p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-foreground">Custom Parfait Quote Requests</h3>
                {parfaitQuotes.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">No custom quote requests logged yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                          <th className="pb-3">Size</th>
                          <th className="pb-3">Yogurt</th>
                          <th className="pb-3">Fruits</th>
                          <th className="pb-3">Toppings</th>
                          <th className="pb-3">Qty</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {parfaitQuotes.map((q) => (
                          <tr key={q.id} className="hover:bg-muted/30">
                            <td className="py-3 font-bold text-foreground">{q.size_label} ({q.size})</td>
                            <td className="py-3">{q.yogurt_type}</td>
                            <td className="py-3 text-muted-foreground">{(q.fruits || []).join(', ') || 'None'}</td>
                            <td className="py-3 text-muted-foreground">{(q.toppings || []).join(', ') || 'None'}</td>
                            <td className="py-3 font-bold">{q.quantity}</td>
                            <td className="py-3 text-muted-foreground">{new Date(q.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          ORDER DETAILS MODAL
         ========================================================================= */}
      {selectedOrder && (
        <Dialog open={Boolean(selectedOrder)} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[560px] p-0 rounded-3xl border-border bg-card flex flex-col max-h-[90dvh]">
            <div className="bg-primary/5 p-6 border-b border-border rounded-t-3xl shrink-0">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-serif font-black text-foreground font-mono">
                    {selectedOrder.order_number}
                  </DialogTitle>
                  <span className="bg-primary text-white font-bold text-xs px-3 py-1 rounded-full">
                    {selectedOrder.order_status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <DialogDescription>Customer Order Details & Items Snapshot</DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1 min-h-0">
              {/* Customer Info */}
              <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-2">
                <div className="font-bold text-sm text-foreground">{selectedOrder.customer_name}</div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Phone:</span>
                  <span className="font-mono text-foreground">{selectedOrder.customer_phone}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Zone:</span>
                  <span className="text-foreground">{selectedOrder.delivery_zone_name}</span>
                </div>
                <div className="text-muted-foreground">
                  <span>Address: </span>
                  <span className="text-foreground font-medium">{selectedOrder.delivery_address}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Timing:</span>
                  <span className="text-foreground font-bold">
                    {selectedOrder.delivery_timing === 'asap'
                      ? '⚡ ASAP'
                      : `📅 ${selectedOrder.scheduled_date} (${selectedOrder.scheduled_time})`}
                  </span>
                </div>
                {selectedOrder.order_notes && (
                  <div className="pt-2 border-t border-border text-muted-foreground">
                    <span className="font-bold text-foreground">Notes: </span>
                    {selectedOrder.order_notes}
                  </div>
                )}
              </div>

              {/* Items List Snapshot */}
              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-muted-foreground block text-[10px]">
                  Snapshotted Order Items
                </span>
                <div className="divide-y divide-border border rounded-2xl p-3 bg-card">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between">
                      <div>
                        <span className="font-bold text-foreground block">{item.product_name} × {item.quantity}</span>
                        {item.selected_options.length > 0 && (
                          <span className="text-muted-foreground text-[11px] block">
                            {item.selected_options.map((o) => o.value).join(' · ')}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-foreground">{formatPrice(item.line_total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 space-y-1 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({selectedOrder.coupon_code}):</span>
                    <span>–{formatPrice(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee:</span>
                  <span>{selectedOrder.delivery_fee === 0 ? 'FREE' : formatPrice(selectedOrder.delivery_fee)}</span>
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex justify-between text-sm font-black text-primary">
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border-t border-border flex justify-between items-center gap-3 shrink-0">
              <Button
                variant="outline"
                onClick={() => handleNotifyCustomerWhatsApp(selectedOrder)}
                className="rounded-xl text-[#25D366] hover:bg-[#25D366]/10 gap-1.5 font-bold"
              >
                <SiWhatsapp className="w-4 h-4" />
                Notify on WhatsApp
              </Button>
              <Button onClick={() => setSelectedOrder(null)} className="rounded-xl font-bold px-6">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* =========================================================================
          PRODUCT EDIT/ADD MODAL (WITH IMAGE UPLOAD & OPTIONS BUILDER)
         ========================================================================= */}
      {isProductModalOpen && (
        <Dialog
          open={isProductModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsProductModalOpen(false);
              setEditingProduct(null);
              setIsSlugOverridden(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-[640px] p-6 rounded-3xl bg-card border-border max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif font-bold text-foreground">
                {editingProduct?.id ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>Configure menu details, pricing, cover image, and customization options.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveProduct} className="space-y-5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold">Product Name *</Label>
                  <Input
                    required
                    value={editingProduct?.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      setEditingProduct((p) => {
                        if (!p) return null;
                        const nextSlug = isSlugOverridden
                          ? (p.slug || '')
                          : generateProductSlug(name, products, p.id);
                        return {
                          ...p,
                          name,
                          slug: nextSlug,
                        };
                      });
                    }}
                    placeholder="e.g. VVIP Exotic Parfait"
                    className="rounded-xl bg-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Category *</Label>
                  <select
                    required
                    value={editingProduct?.category_id || categories[0]?.id || ''}
                    onChange={(e) => setEditingProduct((p) => ({ ...p, category_id: e.target.value }))}
                    className="w-full h-10 rounded-xl bg-white border border-input px-3 text-xs font-medium focus:ring-1 focus:ring-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Product Type</Label>
                  <select
                    value={editingProduct?.product_type || 'standard'}
                    onChange={(e) => setEditingProduct((p) => ({ ...p, product_type: e.target.value as any }))}
                    className="w-full h-10 rounded-xl bg-white border border-input px-3 text-xs font-medium"
                  >
                    <option value="standard">Standard (Cartable)</option>
                    <option value="bundle">Bundle / Treat Box</option>
                    <option value="quote-only">Quote Only (Custom Parfait)</option>
                    <option value="enquiry-only">Enquiry Only (Catering)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Base Price (₦) *</Label>
                  <Input
                    type="number"
                    required
                    value={editingProduct?.base_price ?? 3000}
                    onChange={(e) => setEditingProduct((p) => ({ ...p, base_price: Number(e.target.value) }))}
                    className="rounded-xl bg-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold">Slug (Unique identifier)</Label>
                    {isSlugOverridden && editingProduct?.name && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSlugOverridden(false);
                          setEditingProduct((p) => (p ? { ...p, slug: generateProductSlug(p.name || '', products, p.id) } : null));
                        }}
                        className="text-[10px] text-primary hover:underline font-semibold"
                      >
                        Reset to Auto
                      </button>
                    )}
                  </div>
                  <Input
                    value={editingProduct?.slug || ''}
                    onChange={(e) => {
                      setIsSlugOverridden(true);
                      setEditingProduct((p) => (p ? { ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') } : null));
                    }}
                    placeholder="Auto-generated from name..."
                    className="rounded-xl bg-muted/40 font-mono text-xs text-muted-foreground focus:text-foreground"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {isSlugOverridden ? 'Manual override. Unique identifier for URLs.' : 'Automatically generated from product name.'}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Description</Label>
                <Textarea
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Luscious layers of fresh Greek yogurt, cashew nuts, and fruits..."
                  className="rounded-xl bg-white resize-none h-16 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Ingredients (Optional)</Label>
                <Input
                  value={editingProduct?.ingredients || ''}
                  onChange={(e) => setEditingProduct((p) => ({ ...p, ingredients: e.target.value }))}
                  placeholder="e.g. Greek Yogurt, Apple, Coconut, Grapes, Granola, Cashew nuts"
                  className="rounded-xl bg-white text-xs"
                />
              </div>

              {/* Product Cover Image Upload via Supabase Storage */}
              <ImageUpload
                bucket="product-images"
                value={editingProduct?.image_url}
                onChange={(url) => setEditingProduct((p) => ({ ...p, image_url: url }))}
                label="Product Image"
                helperText="Upload a crisp photo of this menu item (under 5MB)"
                onUploadingChange={setIsUploadingProductImage}
              />

              {/* Visual Nested Product Options Builder */}
              <ProductOptionsBuilder
                options={editingProduct?.options || []}
                onChange={(opts) => setEditingProduct((p) => ({ ...p, options: opts }))}
              />

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="prod_is_available"
                    checked={editingProduct?.is_available !== false}
                    onChange={(e) => setEditingProduct((p) => ({ ...p, is_available: e.target.checked }))}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                  />
                  <Label htmlFor="prod_is_available" className="text-xs font-bold cursor-pointer">
                    Available in Store
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="prod_is_featured"
                    checked={editingProduct?.is_featured || false}
                    onChange={(e) => setEditingProduct((p) => ({ ...p, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                  />
                  <Label htmlFor="prod_is_featured" className="text-xs font-bold cursor-pointer">
                    Feature on Homepage
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                    setIsSlugOverridden(false);
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploadingProductImage} className="rounded-xl font-bold px-6">
                  {isUploadingProductImage ? 'Uploading Image...' : 'Save Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* =========================================================================
          CATEGORY ADD / EDIT MODAL (NEW)
         ========================================================================= */}
      {isCategoryModalOpen && (
        <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
          <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl bg-card border-border max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif font-bold text-foreground">
                {editingCategory?.id ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
              <DialogDescription>Create or modify category name, slug, and storefront banner.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Category Name *</Label>
                <Input
                  required
                  value={editingCategory?.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditingCategory((c) => ({
                      ...c,
                      name,
                      slug: (c?.slug && c?.id) ? c.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') as any,
                    }));
                  }}
                  placeholder="e.g. Parfaits & Bowls"
                  className="rounded-xl bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Slug (URL identifier) *</Label>
                  <Input
                    required
                    value={editingCategory?.slug || ''}
                    onChange={(e) => setEditingCategory((c) => ({ ...c, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') as any }))}
                    placeholder="e.g. parfaits-bowls"
                    className="rounded-xl bg-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Display Order</Label>
                  <Input
                    type="number"
                    value={editingCategory?.display_order ?? categories.length + 1}
                    onChange={(e) => setEditingCategory((c) => ({ ...c, display_order: Number(e.target.value) }))}
                    className="rounded-xl bg-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Description</Label>
                <Textarea
                  value={editingCategory?.description || ''}
                  onChange={(e) => setEditingCategory((c) => ({ ...c, description: e.target.value }))}
                  placeholder="Short overview of what is in this category..."
                  className="rounded-xl bg-white resize-none h-16 text-xs"
                />
              </div>

              <ImageUpload
                bucket="product-images"
                value={editingCategory?.image_url}
                onChange={(url) => setEditingCategory((c) => ({ ...c, image_url: url }))}
                label="Category Banner / Cover Image"
                helperText="Recommended: 4:3 or 16:9 banner image under 5MB"
                onUploadingChange={setIsUploadingCategoryImage}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat_is_active"
                  checked={editingCategory?.is_active !== false}
                  onChange={(e) => setEditingCategory((c) => ({ ...c, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                />
                <Label htmlFor="cat_is_active" className="text-xs font-bold cursor-pointer">
                  Active (Visible on Storefront)
                </Label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setIsCategoryModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploadingCategoryImage} className="rounded-xl font-bold px-6">
                  {isUploadingCategoryImage ? 'Uploading Image...' : 'Save Category'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* =========================================================================
          ADD / EDIT DELIVERY ZONE MODAL
         ========================================================================= */}
      {isZoneModalOpen && (
        <Dialog open={isZoneModalOpen} onOpenChange={(open) => { if (!open) { setIsZoneModalOpen(false); setEditingZone(null); } }}>
          <DialogContent className="sm:max-w-[420px] p-6 rounded-3xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-serif font-bold text-foreground">
                {editingZone?.id ? 'Edit Delivery Zone' : 'Add Delivery Zone'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveZone} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Zone / Area Name *</Label>
                <Input
                  required
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  placeholder="e.g. Parakin Estate"
                  className="rounded-xl bg-white text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Delivery Fee (₦) * (0 = Free)</Label>
                <Input
                  type="number"
                  required
                  value={newZoneFee}
                  onChange={(e) => setNewZoneFee(Number(e.target.value))}
                  className="rounded-xl bg-white text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => { setIsZoneModalOpen(false); setEditingZone(null); }} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">
                  {editingZone?.id ? 'Update Zone' : 'Save Zone'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Zone Delete Confirmation */}
      {zoneToDelete && (
        <Dialog open={Boolean(zoneToDelete)} onOpenChange={(open) => !open && setZoneToDelete(null)}>
          <DialogContent className="sm:max-w-[380px] p-6 rounded-3xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-serif font-bold text-foreground">Delete Delivery Zone?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{zoneToDelete.name}</strong>? This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setZoneToDelete(null)} className="rounded-xl">Cancel</Button>
              <Button
                onClick={() => handleDeleteZone(zoneToDelete)}
                className="rounded-xl font-bold bg-destructive text-white hover:bg-destructive/90"
              >
                Delete Zone
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* =========================================================================
          ADD / EDIT COUPON MODAL
         ========================================================================= */}
      {isCouponModalOpen && (
        <Dialog open={isCouponModalOpen} onOpenChange={(open) => { if (!open) { setIsCouponModalOpen(false); setEditingCoupon(null); } }}>
          <DialogContent className="sm:max-w-[440px] p-6 rounded-3xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-serif font-bold text-foreground">
                {editingCoupon?.id ? 'Edit Coupon Code' : 'Create Coupon Code'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveCoupon} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Coupon Code *</Label>
                <Input
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FRESH20"
                  className="rounded-xl bg-white uppercase font-mono text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Type</Label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full h-10 rounded-xl bg-white border border-input px-3 text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed (₦)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Value ({newCouponType === 'percentage' ? '%' : '₦'})</Label>
                  <Input
                    type="number"
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="rounded-xl bg-white text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Min. Order Amount (₦)</Label>
                <Input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="rounded-xl bg-white text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => { setIsCouponModalOpen(false); setEditingCoupon(null); }} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">
                  {editingCoupon?.id ? 'Update Coupon' : 'Save Coupon'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Coupon Delete Confirmation */}
      {couponToDelete && (
        <Dialog open={Boolean(couponToDelete)} onOpenChange={(open) => !open && setCouponToDelete(null)}>
          <DialogContent className="sm:max-w-[380px] p-6 rounded-3xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-serif font-bold text-foreground">Delete Coupon?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete coupon <strong className="font-mono">{couponToDelete.code}</strong>? This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setCouponToDelete(null)} className="rounded-xl">Cancel</Button>
              <Button
                onClick={() => handleDeleteCoupon(couponToDelete)}
                className="rounded-xl font-bold bg-destructive text-white hover:bg-destructive/90"
              >
                Delete Coupon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* =========================================================================
          PROMOTION ADD / EDIT MODAL
         ========================================================================= */}
      {isPromoModalOpen && (
        <Dialog open={isPromoModalOpen} onOpenChange={setIsPromoModalOpen}>
          <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl bg-card border-border max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-serif font-bold text-foreground">
                {editingPromo?.id ? 'Edit Homepage Promotion' : 'Add Homepage Promotion'}
              </DialogTitle>
              <DialogDescription>Upload a flyer and configure the headline and call-to-action.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSavePromo} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Title *</Label>
                <Input
                  required
                  value={editingPromo?.title || ''}
                  onChange={(e) => setEditingPromo((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Parfait Friday Deal"
                  className="rounded-xl bg-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Description</Label>
                <Input
                  value={editingPromo?.description || ''}
                  onChange={(e) => setEditingPromo((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Special weekend combo discount..."
                  className="rounded-xl bg-white text-xs"
                />
              </div>

              {/* Promo Flyer Image Upload */}
              <ImageUpload
                bucket="promo-flyers"
                value={editingPromo?.flyer_url}
                onChange={(url) => setEditingPromo((p) => ({ ...p, flyer_url: url }))}
                label="Promotional Flyer Image"
                helperText="Upload banner flyer for the homepage (under 5MB)"
                onUploadingChange={setIsUploadingPromoFlyer}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Button Label</Label>
                  <Input
                    value={editingPromo?.cta_label || ''}
                    onChange={(e) => setEditingPromo((p) => ({ ...p, cta_label: e.target.value }))}
                    placeholder="Order Now"
                    className="rounded-xl bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Link Route</Label>
                  <Input
                    value={editingPromo?.cta_link || ''}
                    onChange={(e) => setEditingPromo((p) => ({ ...p, cta_link: e.target.value }))}
                    placeholder="/greek-yogurt-parfaits"
                    className="rounded-xl bg-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsPromoModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploadingPromoFlyer} className="rounded-xl font-bold">
                  {isUploadingPromoFlyer ? 'Uploading Flyer...' : 'Save Promotion'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
