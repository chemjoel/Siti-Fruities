import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { authService } from '@/services/auth.service';
import { productService } from '@/services/product.service';
import { deliveryService } from '@/services/delivery.service';
import { orderService } from '@/services/order.service';
import { whatsAppService } from '@/services/whatsapp.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product, Category, DeliveryZone, Coupon, Promotion, Order, OrderStatus, CateringEnquiry, CustomParfaitQuote } from '@/types/domain';
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
  Check,
  X,
  Search,
  DollarSign,
  TrendingUp,
  PackageCheck,
  AlertTriangle,
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

const formatPrice = (price: number) => `₦${Number(price).toLocaleString()}`;

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

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState(1000);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(3000);

  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [newPromoFlyer, setNewPromoFlyer] = useState('/assets/IMG_8455_parfait_bowls.jpg');
  const [newPromoCtaLabel, setNewPromoCtaLabel] = useState('Order Now');
  const [newPromoCtaLink, setNewPromoCtaLink] = useState('/greek-yogurt-parfaits');

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

  // Product Actions
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
    if (!editingProduct?.name || !editingProduct?.slug) return;

    const payload: Partial<Product> = {
      ...editingProduct,
      base_price: Number(editingProduct.base_price || 0),
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
        category_id: editingProduct.category_id || categories[0]?.id || '1',
        name: editingProduct.name,
        slug: editingProduct.slug,
        description: editingProduct.description || '',
        ingredients: editingProduct.ingredients || null,
        base_price: Number(editingProduct.base_price || 0),
        image_url: editingProduct.image_url || '/assets/IMG_8455_parfait_bowls.jpg',
        product_type: editingProduct.product_type || 'standard',
        is_available: editingProduct.is_available !== false,
        is_featured: editingProduct.is_featured || false,
        featured_order: editingProduct.featured_order || null,
        display_order: Number(editingProduct.display_order || products.length + 1),
        options: editingProduct.options || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProducts((prev) => [...prev, newProd]);
      if (isSupabaseConfigured()) {
        await supabase.from('products').insert(newProd);
      }
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Order Actions
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

  // Delivery Zone Actions
  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;

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
    setIsZoneModalOpen(false);
    setNewZoneName('');
    setNewZoneFee(1000);
  };

  // Coupon Actions
  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

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
    setIsCouponModalOpen(false);
    setNewCouponCode('');
  };

  const toggleCouponActive = async (coupon: Coupon) => {
    const next = !coupon.is_active;
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, is_active: next } : c)));
    if (isSupabaseConfigured()) {
      await supabase.from('coupons').update({ is_active: next }).eq('id', coupon.id);
    }
  };

  // Promotion Actions
  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoTitle.trim()) return;

    const newPromo: Promotion = {
      id: crypto.randomUUID(),
      title: newPromoTitle.trim(),
      description: newPromoDesc.trim() || null,
      flyer_url: newPromoFlyer.trim(),
      cta_label: newPromoCtaLabel.trim(),
      cta_link: newPromoCtaLink.trim(),
      is_active: true,
      display_order: promotions.length + 1,
      starts_at: null,
      ends_at: null,
      created_at: new Date().toISOString(),
    };

    setPromotions((prev) => [...prev, newPromo]);
    if (isSupabaseConfigured()) {
      await supabase.from('promotions').insert(newPromo);
    }
    setIsPromoModalOpen(false);
    setNewPromoTitle('');
    setNewPromoDesc('');
  };

  const togglePromoActive = async (promo: Promotion) => {
    const next = !promo.is_active;
    setPromotions((prev) => prev.map((p) => (p.id === promo.id ? { ...p, is_active: next } : p)));
    if (isSupabaseConfigured()) {
      await supabase.from('promotions').update({ is_active: next }).eq('id', promo.id);
    }
  };

  // KPI Calculations
  const totalRevenue = orders.filter((o) => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.order_status === 'pending_payment' || o.order_status === 'confirmed' || o.order_status === 'preparing').length;

  return (
    <div className="min-h-[100dvh] bg-muted/20 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-serif font-black text-lg">
            S
          </div>
          <div>
            <h1 className="font-bold font-serif text-lg leading-tight text-foreground">SITI FRUITIES Admin</h1>
            <span className="text-xs text-muted-foreground">Store Operations & Management</span>
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

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-card border-r border-border p-4 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
              activeTab === 'overview' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
              activeTab === 'orders' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4" />
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
              activeTab === 'products' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
              activeTab === 'delivery' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Delivery Zones</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
              activeTab === 'coupons' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
              activeTab === 'promotions' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Promotions</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
              activeTab === 'enquiries' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Catering & Quotes</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
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
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Order Management</h2>
                  <p className="text-sm text-muted-foreground">Manage and track customer order delivery progression</p>
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
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Products Catalogue</h2>
                  <p className="text-sm text-muted-foreground">Manage menu items, prices, availability, and featured ordering</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      slug: '',
                      base_price: 3000,
                      is_available: true,
                      is_featured: false,
                      category_id: categories[0]?.id || '1',
                      options: [],
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="rounded-2xl gap-2 font-bold shadow-xs"
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
                        <th className="pb-3">Base Price</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Featured</th>
                        <th className="pb-3">Availability</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-muted/30">
                          <td className="py-3 flex items-center gap-3">
                            <img
                              src={product.image_url || '/assets/IMG_8455_parfait_bowls.jpg'}
                              alt={product.name}
                              className="w-10 h-10 rounded-xl object-cover bg-muted shrink-0"
                            />
                            <div>
                              <span className="font-bold text-foreground block">{product.name}</span>
                              <span className="text-[11px] text-muted-foreground line-clamp-1">{product.description}</span>
                            </div>
                          </td>
                          <td className="py-3 font-bold text-foreground">{formatPrice(product.base_price)}</td>
                          <td className="py-3">
                            <span className="bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded-full text-[10px]">
                              {product.product_type}
                            </span>
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
                              onClick={() => {
                                setEditingProduct(product);
                                setIsProductModalOpen(true);
                              }}
                              className="h-8 rounded-xl text-xs gap-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  <h2 className="text-2xl font-serif font-black text-foreground">Delivery Zones & Fees</h2>
                  <p className="text-sm text-muted-foreground">Admin-controlled pricing per delivery zone (No hardcoded threshold)</p>
                </div>
                <Button onClick={() => setIsZoneModalOpen(true)} className="rounded-2xl gap-2 font-bold shadow-xs">
                  <Plus className="w-4 h-4" />
                  Add Zone
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {zones.map((zone) => (
                  <div key={zone.id} className="bg-card p-5 rounded-3xl border border-border shadow-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-foreground block">{zone.name}</span>
                      <span className="text-xs text-primary font-black mt-1 block">
                        {zone.delivery_fee === 0 ? 'FREE (₦0)' : formatPrice(zone.delivery_fee)}
                      </span>
                    </div>
                    <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                      Pos: {zone.display_order}
                    </span>
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
                <Button onClick={() => setIsCouponModalOpen(true)} className="rounded-2xl gap-2 font-bold shadow-xs">
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
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-black text-foreground">Homepage Promotional Banners</h2>
                  <p className="text-sm text-muted-foreground">Appears directly below the Hero section on the homepage</p>
                </div>
                <Button onClick={() => setIsPromoModalOpen(true)} className="rounded-2xl gap-2 font-bold shadow-xs">
                  <Plus className="w-4 h-4" />
                  Add Promotion
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {promotions.map((p) => (
                  <div key={p.id} className="bg-card p-5 rounded-3xl border border-border shadow-xs flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-base text-foreground leading-tight">{p.title}</h3>
                        <button
                          onClick={() => togglePromoActive(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                      <div className="text-[11px] text-primary font-bold mt-2">CTA: {p.cta_label} → {p.cta_link}</div>
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
          PRODUCT EDIT/ADD MODAL
         ========================================================================= */}
      {isProductModalOpen && (
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <DialogContent className="sm:max-w-[540px] p-6 rounded-3xl bg-card border-border max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif font-bold text-foreground">
                {editingProduct?.id ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveProduct} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Product Name *</Label>
                <Input
                  required
                  value={editingProduct?.name || ''}
                  onChange={(e) => setEditingProduct((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Avocado Toast"
                  className="rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Slug (Unique) *</Label>
                  <Input
                    required
                    value={editingProduct?.slug || ''}
                    onChange={(e) => setEditingProduct((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="e.g. avocado-toast"
                    className="rounded-xl bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Base Price (₦) *</Label>
                  <Input
                    type="number"
                    required
                    value={editingProduct?.base_price ?? 3000}
                    onChange={(e) => setEditingProduct((p) => ({ ...p, base_price: Number(e.target.value) }))}
                    className="rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Description</Label>
                <Textarea
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Delicious ingredients and preparation details..."
                  className="rounded-xl bg-white resize-none h-18"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Image URL</Label>
                <Input
                  value={editingProduct?.image_url || ''}
                  onChange={(e) => setEditingProduct((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="/assets/IMG_8455_parfait_bowls.jpg"
                  className="rounded-xl bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsProductModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold px-6">
                  Save Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* =========================================================================
          ADD DELIVERY ZONE MODAL
         ========================================================================= */}
      {isZoneModalOpen && (
        <Dialog open={isZoneModalOpen} onOpenChange={setIsZoneModalOpen}>
          <DialogContent className="sm:max-w-[420px] p-6 rounded-3xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-serif font-bold text-foreground">Add Delivery Zone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddZone} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Zone / Area Name *</Label>
                <Input
                  required
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  placeholder="e.g. Parakin Estate"
                  className="rounded-xl bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Delivery Fee (₦) * (0 = Free)</Label>
                <Input
                  type="number"
                  required
                  value={newZoneFee}
                  onChange={(e) => setNewZoneFee(Number(e.target.value))}
                  className="rounded-xl bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsZoneModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">
                  Save Zone
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* =========================================================================
          ADD COUPON MODAL
         ========================================================================= */}
      {isCouponModalOpen && (
        <Dialog open={isCouponModalOpen} onOpenChange={setIsCouponModalOpen}>
          <DialogContent className="sm:max-w-[440px] p-6 rounded-3xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-serif font-bold text-foreground">Create Coupon Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCoupon} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Coupon Code *</Label>
                <Input
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FRESH20"
                  className="rounded-xl bg-white uppercase font-mono"
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
                    className="rounded-xl bg-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Min. Order Amount (₦)</Label>
                <Input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="rounded-xl bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCouponModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">
                  Save Coupon
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* =========================================================================
          ADD PROMOTION MODAL
         ========================================================================= */}
      {isPromoModalOpen && (
        <Dialog open={isPromoModalOpen} onOpenChange={setIsPromoModalOpen}>
          <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-serif font-bold text-foreground">Add Homepage Promotion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPromo} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Title *</Label>
                <Input
                  required
                  value={newPromoTitle}
                  onChange={(e) => setNewPromoTitle(e.target.value)}
                  placeholder="e.g. Parfait Friday Deal"
                  className="rounded-xl bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Description</Label>
                <Input
                  value={newPromoDesc}
                  onChange={(e) => setNewPromoDesc(e.target.value)}
                  placeholder="Special weekend combo discount..."
                  className="rounded-xl bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Button Label</Label>
                  <Input
                    value={newPromoCtaLabel}
                    onChange={(e) => setNewPromoCtaLabel(e.target.value)}
                    placeholder="Order Now"
                    className="rounded-xl bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Link Route</Label>
                  <Input
                    value={newPromoCtaLink}
                    onChange={(e) => setNewPromoCtaLink(e.target.value)}
                    placeholder="/greek-yogurt-parfaits"
                    className="rounded-xl bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsPromoModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">
                  Save Promotion
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
