import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type DateFilter = 'today' | '7days' | '30days' | 'month' | 'custom';
type ReportType = 'summary' | 'trends' | 'products' | 'categories' | 'delivery' | 'coupons' | 'statuses';

interface AnalyticsOrder {
  id: string;
  created_at: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  order_status: string;
  total: number;
  discount_amount: number;
  coupon_id: string | null;
  coupon_code: string | null;
  delivery_zone_id: string | null;
  delivery_zone_name: string | null;
  delivery_fee: number;
  delivery_timing: 'asap' | 'scheduled';
}

interface AnalyticsItem {
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface CatalogProduct {
  id: string;
  name: string;
  category_id: string | null;
}

interface CatalogCategory {
  id: string;
  name: string;
}

interface SalesData {
  orders: AnalyticsOrder[];
  items: AnalyticsItem[];
  products: CatalogProduct[];
  categories: CatalogCategory[];
  previousOrders: AnalyticsOrder[];
}

interface DateRange {
  start: Date;
  end: Date;
}

const PAGE_SIZE = 1000;
const ITEM_BATCH_SIZE = 100;
const COLORS = ['#16834a', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4'];

function localDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getRange(filter: DateFilter, customStart: string, customEnd: string): DateRange {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (filter === 'today') return { start, end: now };
  if (filter === '7days') start.setDate(start.getDate() - 6);
  if (filter === '30days') start.setDate(start.getDate() - 29);
  if (filter === 'month') start.setDate(1);
  if (filter === 'custom') {
    const customFrom = new Date(`${customStart}T00:00:00`);
    const customTo = new Date(`${customEnd}T00:00:00`);
    customTo.setDate(customTo.getDate() + 1);
    return { start: customFrom, end: customTo };
  }
  return { start, end: now };
}

function money(value: number) {
  return `₦${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function csvCell(value: string | number) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const content = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function isRevenueOrder(order: AnalyticsOrder) {
  return order.payment_status === 'paid' && order.order_status !== 'cancelled';
}

async function getOrders(range: DateRange): Promise<AnalyticsOrder[]> {
  const results: AnalyticsOrder[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await (supabase
      .from('orders')
      .select('id, created_at, payment_status, order_status, total, discount_amount, coupon_id, coupon_code, delivery_zone_id, delivery_zone_name, delivery_fee, delivery_timing') as any)
      .gte('created_at', range.start.toISOString())
      .lt('created_at', range.end.toISOString())
      .order('created_at', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1) as { data: AnalyticsOrder[] | null; error: { message: string } | null };

    if (error) throw new Error(error.message);
    const page = (data || []) as AnalyticsOrder[];
    results.push(...page);
    if (page.length < PAGE_SIZE) return results;
    offset += PAGE_SIZE;
  }
}

async function getItems(orders: AnalyticsOrder[]): Promise<AnalyticsItem[]> {
  const items: AnalyticsItem[] = [];
  const ids = orders.map((order) => order.id);

  for (let index = 0; index < ids.length; index += ITEM_BATCH_SIZE) {
    const { data, error } = await (supabase
      .from('order_items')
      .select('order_id, product_id, product_name, unit_price, quantity, line_total') as any)
      .in('order_id', ids.slice(index, index + ITEM_BATCH_SIZE)) as { data: AnalyticsItem[] | null; error: { message: string } | null };

    if (error) throw new Error(error.message);
    items.push(...((data || []) as AnalyticsItem[]));
  }

  return items;
}

async function loadSalesData(range: DateRange): Promise<SalesData> {
  const duration = range.end.getTime() - range.start.getTime();
  const previousRange = {
    start: new Date(range.start.getTime() - duration),
    end: range.start,
  };

  const [orders, previousOrders, productResult, categoryResult] = await Promise.all([
    getOrders(range),
    getOrders(previousRange),
    supabase.from('products').select('id, name, category_id'),
    supabase.from('categories').select('id, name'),
  ] as const);

  const typedProducts = (productResult.data || []) as CatalogProduct[];
  const typedCategories = (categoryResult.data || []) as CatalogCategory[];

  if (productResult.error) throw new Error(productResult.error.message);
  if (categoryResult.error) throw new Error(categoryResult.error.message);

  return {
    orders,
    items: await getItems(orders),
    products: typedProducts,
    categories: typedCategories,
    previousOrders,
  };
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-3xl p-5 sm:p-6 space-y-4 min-w-0">
      <h3 className="font-bold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

export default function SalesAnalyticsPage() {
  const today = localDateInput(new Date());
  const [dateFilter, setDateFilter] = useState<DateFilter>('7days');
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd] = useState(today);
  const [reportType, setReportType] = useState<ReportType>('summary');
  const [sales, setSales] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const range = useMemo(() => getRange(dateFilter, customStart, customEnd), [dateFilter, customStart, customEnd]);
  const invalidCustomRange = dateFilter === 'custom' && customStart > customEnd;

  useEffect(() => {
    if (!isSupabaseConfigured() || invalidCustomRange) {
      setSales(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setSales(null);

    loadSalesData(range)
      .then((data) => {
        if (!cancelled) setSales(data);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : 'Sales analytics could not be loaded.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [range, invalidCustomRange, requestVersion]);

  const calculations = useMemo(() => {
    if (!sales) return null;

    const paidOrders = sales.orders.filter(isRevenueOrder);
    const previousPaidOrders = sales.previousOrders.filter(isRevenueOrder);
    const productTotals = new Map<string, { name: string; quantity: number; revenue: number }>();
    const categoryNames = new Map(sales.categories.map((category) => [category.id, category.name]));
    const categoryTotals = new Map<string, { name: string; quantity: number; revenue: number }>();
    const paidOrderIds = new Set(paidOrders.map((order) => order.id));

    for (const item of sales.items) {
      if (!paidOrderIds.has(item.order_id)) continue;
      const key = item.product_id || item.product_name;
      const product = productTotals.get(key) || { name: item.product_name, quantity: 0, revenue: 0 };
      product.quantity += Number(item.quantity || 0);
      product.revenue += Number(item.line_total || 0);
      productTotals.set(key, product);

      const productEntry = sales.products.find((entry) => entry.id === item.product_id);
      const categoryId = productEntry?.category_id || null;
      const categoryName = categoryId ? categoryNames.get(categoryId) || 'Uncategorized' : 'Uncategorized';
      const category = categoryTotals.get(categoryName) || { name: categoryName, quantity: 0, revenue: 0 };
      category.quantity += Number(item.quantity || 0);
      category.revenue += Number(item.line_total || 0);
      categoryTotals.set(categoryName, category);
    }

    const productRows = Array.from(productTotals.values())
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue || a.name.localeCompare(b.name));

    const categoryRows = Array.from(categoryTotals.values())
      .sort((a, b) => b.revenue - a.revenue || b.quantity - a.quantity);

    const couponTotals = new Map<string, { uses: number; paidOrders: number; discounts: number; revenue: number }>();
    for (const order of sales.orders) {
      if (!order.coupon_id && !order.coupon_code) continue;
      const key = order.coupon_code || 'Coupon (code unavailable)';
      const coupon = couponTotals.get(key) || { uses: 0, paidOrders: 0, discounts: 0, revenue: 0 };
      coupon.uses += 1;
      if (isRevenueOrder(order)) {
        coupon.paidOrders += 1;
        coupon.discounts += Number(order.discount_amount || 0);
        coupon.revenue += Number(order.total || 0);
      }
      couponTotals.set(key, coupon);
    }

    const couponRows = Array.from(couponTotals.entries())
      .map(([code, totals]) => ({ code, ...totals }))
      .sort((a, b) => b.uses - a.uses || b.revenue - a.revenue);

    const zoneTotals = new Map<string, { name: string; orders: number; revenue: number }>();
    const dailyTotals = new Map<string, { date: string; revenue: number; paidOrders: number; allOrders: number }>();
    const statusTotals = new Map<string, number>();
    const paymentTotals = new Map<string, number>([['Paid', 0], ['Pending payment', 0], ['Refunded', 0]]);

    let discounts = 0;
    let delivered = 0;
    let pendingPayment = 0;
    let cancelled = 0;
    let scheduled = 0;
    let asap = 0;

    for (const order of sales.orders) {
      statusTotals.set(order.order_status, (statusTotals.get(order.order_status) || 0) + 1);
      if (order.payment_status === 'paid') paymentTotals.set('Paid', (paymentTotals.get('Paid') || 0) + 1);
      else if (order.payment_status === 'refunded') paymentTotals.set('Refunded', (paymentTotals.get('Refunded') || 0) + 1);
      else paymentTotals.set('Pending payment', (paymentTotals.get('Pending payment') || 0) + 1);

      if (order.order_status === 'delivered') delivered += 1;
      if (order.payment_status === 'pending') pendingPayment += 1;
      if (order.order_status === 'cancelled') cancelled += 1;
      if (order.delivery_timing === 'scheduled') scheduled += 1;
      else asap += 1;

      if (isRevenueOrder(order)) {
        discounts += Number(order.discount_amount || 0);
        const zoneName = order.delivery_zone_name || 'Zone unavailable';
        const zone = zoneTotals.get(zoneName) || { name: zoneName, orders: 0, revenue: 0 };
        zone.orders += 1;
        zone.revenue += Number(order.total || 0);
        zoneTotals.set(zoneName, zone);
      }

      const dateKey = localDateInput(new Date(order.created_at));
      const dailyEntry = dailyTotals.get(dateKey) || { date: dateKey, revenue: 0, paidOrders: 0, allOrders: 0 };
      dailyEntry.allOrders += 1;
      if (isRevenueOrder(order)) {
        dailyEntry.revenue += Number(order.total || 0);
        dailyEntry.paidOrders += 1;
      }
      dailyTotals.set(dateKey, dailyEntry);
    }

    const dayCursor = new Date(range.start);
    dayCursor.setHours(0, 0, 0, 0);
    while (dayCursor < range.end) {
      const dateKey = localDateInput(dayCursor);
      if (!dailyTotals.has(dateKey)) {
        dailyTotals.set(dateKey, { date: dateKey, revenue: 0, paidOrders: 0, allOrders: 0 });
      }
      dayCursor.setDate(dayCursor.getDate() + 1);
    }

    const paidRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const previousRevenue = previousPaidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const trends = Array.from(dailyTotals.values()).sort((a, b) => a.date.localeCompare(b.date));
    const statusRows = Array.from(statusTotals, ([name, value]) => ({ name, value }));
    const paymentRows = Array.from(paymentTotals, ([name, value]) => ({ name, value }));
    const zoneRows = Array.from(zoneTotals.values()).sort((a, b) => b.revenue - a.revenue);

    return {
      paidOrders,
      paidRevenue,
      previousPaidOrders,
      previousRevenue,
      averageOrderValue: paidOrders.length ? paidRevenue / paidOrders.length : 0,
      discounts,
      delivered,
      pendingPayment,
      cancelled,
      scheduled,
      asap,
      trends,
      statusRows,
      paymentRows,
      productRows,
      categoryRows,
      couponRows,
      zoneRows,
    };
  }, [sales, range]);

  const comparison = (current: number, previous: number, formatter: (value: number) => string) => {
    if (previous === 0) return current === 0 ? 'No change' : 'No previous-period baseline';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}% vs previous period (${formatter(previous)})`;
  };

  const exportReport = () => {
    if (!sales || !calculations) return;
    const rangeLabel = `${localDateInput(range.start)}-to-${localDateInput(new Date(range.end.getTime() - 1))}`;
    let headers: string[] = ['Metric', 'Value'];
    let rows: (string | number)[][] = [];

    switch (reportType) {
      case 'trends':
        headers = ['Date', 'Paid revenue', 'Paid orders', 'All orders'];
        rows = calculations.trends.map((row) => [row.date, row.revenue, row.paidOrders, row.allOrders]);
        break;
      case 'products':
        headers = ['Product', 'Units sold', 'Revenue'];
        rows = calculations.productRows.map((row) => [row.name, row.quantity, row.revenue]);
        break;
      case 'categories':
        headers = ['Category', 'Units sold', 'Revenue'];
        rows = calculations.categoryRows.map((row) => [row.name, row.quantity, row.revenue]);
        break;
      case 'delivery':
        headers = ['Delivery zone', 'Paid orders', 'Revenue'];
        rows = calculations.zoneRows.map((row) => [row.name, row.orders, row.revenue]);
        break;
      case 'coupons':
        headers = ['Coupon', 'Usage count', 'Paid orders', 'Discounts', 'Revenue'];
        rows = calculations.couponRows.map((row) => [row.code, row.uses, row.paidOrders, row.discounts, row.revenue]);
        break;
      case 'statuses':
        headers = ['Order status', 'Orders'];
        rows = calculations.statusRows.map((row) => [row.name, row.value]);
        break;
      default:
        rows = [
          ['Paid revenue', calculations.paidRevenue],
          ['Paid orders', calculations.paidOrders.length],
          ['Average paid order value', calculations.averageOrderValue],
          ['Delivered orders', calculations.delivered],
          ['Pending-payment orders', calculations.pendingPayment],
          ['Cancelled orders', calculations.cancelled],
          ['Paid-order discounts', calculations.discounts],
        ];
    }

    downloadCsv(`siti-fruities-sales-${reportType}-${rangeLabel}.csv`, headers, rows);
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Connect the configured Supabase project and sign in as an admin to view sales analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-serif font-black text-foreground">Sales Analytics</h2>
          <p className="text-sm text-muted-foreground">Read-only order, product, delivery, and coupon performance.</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          {([
            ['today', 'Today'],
            ['7days', 'Last 7 days'],
            ['30days', 'Last 30 days'],
            ['month', 'This month'],
          ] as [Exclude<DateFilter, 'custom'>, string][]).map(([filter, label]) => (
            <Button
              key={filter}
              size="sm"
              variant={dateFilter === filter ? 'default' : 'outline'}
              onClick={() => setDateFilter(filter)}
              aria-pressed={dateFilter === filter}
            >
              {label}
            </Button>
          ))}
          <Button
            size="sm"
            variant={dateFilter === 'custom' ? 'default' : 'outline'}
            onClick={() => setDateFilter('custom')}
            aria-pressed={dateFilter === 'custom'}
          >
            Custom range
          </Button>
          {dateFilter === 'custom' && (
            <>
              <label className="grid gap-1 text-xs text-muted-foreground">
                From
                <Input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} />
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                To
                <Input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} />
              </label>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRequestVersion((version) => version + 1)}
            disabled={loading}
            aria-label="Refresh sales analytics"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/70 p-4 text-sm text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">
        <p>
          Date trends use <strong>order creation time</strong>: the schema has no payment timestamp, so these are not payment-date trends.
          Revenue includes orders currently marked paid and excludes pending, refunded, and cancelled orders.
        </p>
        <p>
          Refund records contain no refund amount or timestamp. Refund totals and net-of-refund revenue cannot be calculated reliably.
          Category mapping uses the product&apos;s current category because category is not snapshotted on order items.
        </p>
      </div>

      {invalidCustomRange && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          The custom range start date must be on or before its end date.
        </p>
      )}

      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <span>Sales analytics could not be loaded: {error}</span>
          <Button size="sm" variant="outline" onClick={() => setRequestVersion((version) => version + 1)}>
            Try again
          </Button>
        </div>
      )}

      {loading && <p className="text-sm text-muted-foreground">Loading sales data…</p>}

      {sales && calculations && !loading && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {localDateInput(range.start)} through {localDateInput(new Date(range.end.getTime() - 1))}
              {' · '}comparisons use the immediately preceding period of equal duration.
            </p>
            <div className="flex gap-2">
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger className="w-48" aria-label="CSV report to export">
                  <SelectValue placeholder="Select report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Sales summary</SelectItem>
                  <SelectItem value="trends">Daily trends</SelectItem>
                  <SelectItem value="products">Product performance</SelectItem>
                  <SelectItem value="categories">Category performance</SelectItem>
                  <SelectItem value="delivery">Delivery zones</SelectItem>
                  <SelectItem value="coupons">Coupon performance</SelectItem>
                  <SelectItem value="statuses">Order statuses</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={exportReport} disabled={loading}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Paid revenue',
                value: money(calculations.paidRevenue),
                compare: comparison(calculations.paidRevenue, calculations.previousRevenue, money),
              },
              {
                label: 'Paid orders',
                value: calculations.paidOrders.length.toLocaleString(),
                compare: comparison(calculations.paidOrders.length, calculations.previousPaidOrders.length, (value) => value.toLocaleString()),
              },
              {
                label: 'Average order value',
                value: money(calculations.averageOrderValue),
                compare: comparison(
                  calculations.averageOrderValue,
                  calculations.previousPaidOrders.length ? calculations.previousRevenue / calculations.previousPaidOrders.length : 0,
                  money,
                ),
              },
              { label: 'Delivered orders', value: calculations.delivered.toLocaleString(), compare: 'Current order status' },
              { label: 'Pending-payment orders', value: calculations.pendingPayment.toLocaleString(), compare: 'Current payment status' },
              { label: 'Cancelled orders', value: calculations.cancelled.toLocaleString(), compare: 'Current order status' },
              { label: 'Paid-order discounts', value: money(calculations.discounts), compare: 'Snapshot discount amounts' },
              { label: 'Refund totals', value: 'Unavailable', compare: 'No reliable refund amount records' },
            ].map((card) => (
              <div key={card.label} className="rounded-3xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase text-muted-foreground">{card.label}</p>
                <p className="mt-2 text-2xl font-black text-foreground">{card.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{card.compare}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Revenue over time">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={calculations.trends} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => money(Number(value))} />
                  <Line type="monotone" dataKey="revenue" name="Paid revenue" stroke="#16834a" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Order volume over time">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={calculations.trends} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="paidOrders" name="Paid orders" fill="#16834a" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="allOrders" name="All orders" fill="#93c5fd" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Order status distribution">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={calculations.statusRows} dataKey="value" nameKey="name" outerRadius={96} label>
                    {calculations.statusRows.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Paid versus unpaid orders">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={calculations.paymentRows} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Orders" radius={[5, 5, 0, 0]}>
                    {calculations.paymentRows.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Top-selling products by quantity">
              {calculations.productRows.length ? (
                <div className="max-h-96 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="py-2">Product</th>
                        <th className="py-2 text-right">Units</th>
                        <th className="py-2 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.productRows.map((row) => (
                        <tr key={row.name} className="border-b last:border-0">
                          <td className="py-2 pr-3">{row.name}</td>
                          <td className="py-2 text-right">{row.quantity}</td>
                          <td className="py-2 text-right">{money(row.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No paid product-item sales in this period.</p>
              )}
            </Panel>

            <Panel title="Category sales performance">
              {calculations.categoryRows.length ? (
                <div className="space-y-3">
                  {calculations.categoryRows.map((row) => (
                    <div key={row.name} className="flex items-center justify-between gap-3 border-b border-border pb-2 text-sm last:border-0">
                      <span className="truncate">{row.name} <span className="text-muted-foreground">({row.quantity} units)</span></span>
                      <strong>{money(row.revenue)}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No category sales in this range.</p>
              )}
            </Panel>

            <Panel title="Orders and revenue by delivery zone">
              {calculations.zoneRows.length ? (
                <div className="space-y-3">
                  {calculations.zoneRows.map((row) => (
                    <div key={row.name} className="flex items-center justify-between gap-3 border-b border-border pb-2 text-sm last:border-0">
                      <span className="truncate">{row.name} <span className="text-muted-foreground">({row.orders} paid orders)</span></span>
                      <strong>{money(row.revenue)}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No paid-zone revenue in this range.</p>
              )}
              <p className="text-xs text-muted-foreground">The schema does not distinguish delivery from in-store pickup with a dedicated field.</p>
            </Panel>

            <Panel title="ASAP versus scheduled orders">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">ASAP</p>
                  <p className="text-2xl font-bold">{calculations.asap}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{calculations.scheduled}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Average order-to-delivery time is unavailable because there is no reliable delivery completion timestamp.</p>
            </Panel>

            <Panel title="Coupon performance">
              {calculations.couponRows.length ? (
                <div className="max-h-80 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="py-2">Coupon</th>
                        <th className="py-2 text-right">Uses</th>
                        <th className="py-2 text-right">Paid discount</th>
                        <th className="py-2 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.couponRows.map((row) => (
                        <tr key={row.code} className="border-b last:border-0">
                          <td className="py-2 pr-2">{row.code}</td>
                          <td className="py-2 text-right">{row.uses}</td>
                          <td className="py-2 text-right">{money(row.discounts)}</td>
                          <td className="py-2 text-right">{money(row.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No coupon usage in this range.</p>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
