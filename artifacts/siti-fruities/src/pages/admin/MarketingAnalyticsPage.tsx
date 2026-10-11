import { useEffect, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type DateFilter = 'today' | '7days' | '30days';

interface Ranking {
  label: string;
  count: number;
}

interface UtmRanking {
  source: string;
  medium: string;
  campaign: string;
  count: number;
}

interface MarketingAnalyticsSummary {
  page_views: number;
  unique_visitors: number;
  product_views: number;
  add_to_cart: number;
  checkout_starts: number;
  estimated_engagement_seconds_per_view: number;
  paid_purchases: number;
  paid_revenue: number;
  top_pages: Ranking[];
  traffic_sources: Ranking[];
  referrers: Ranking[];
  utm_campaigns: UtmRanking[];
  product_rankings: Ranking[];
}

const dateFilters: { id: DateFilter; label: string; days: number }[] = [
  { id: 'today', label: 'Today', days: 1 },
  { id: '7days', label: 'Last 7 days', days: 7 },
  { id: '30days', label: 'Last 30 days', days: 30 },
];

function getDateRange(days: number) {
  const to = new Date();
  const from = new Date(to);
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() - days + 1);
  return { from: from.toISOString(), to: to.toISOString() };
}

function formatCount(value: number) {
  return Number(value || 0).toLocaleString();
}

function formatDuration(seconds: number) {
  const value = Number(seconds || 0);
  if (value < 60) return `${Math.round(value)} sec`;
  return `${Math.floor(value / 60)} min ${Math.round(value % 60)} sec`;
}

function RankingList({ title, rows, emptyLabel }: { title: string; rows: Ranking[]; emptyLabel: string }) {
  const maximum = Math.max(...rows.map((row) => Number(row.count)), 1);

  return (
    <section className="bg-card border border-border rounded-3xl p-5 sm:p-6">
      <h3 className="font-bold text-foreground mb-4">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.label} className="space-y-1.5">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-foreground truncate" title={row.label}>{row.label}</span>
                <span className="font-semibold tabular-nums">{formatCount(row.count)}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(4, (Number(row.count) / maximum) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function MarketingAnalyticsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('7days');
  const [summary, setSummary] = useState<MarketingAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let cancelled = false;
    const filter = dateFilters.find((item) => item.id === dateFilter) || dateFilters[1];
    const range = getDateRange(filter.days);
    setLoading(true);
    setError(null);
    setSummary(null);

    supabase.rpc<MarketingAnalyticsSummary>('get_marketing_analytics', {
      p_from: range.from,
      p_to: range.to,
    }).then(({ data, error: requestError }) => {
      if (cancelled) return;
      if (requestError) {
        setError('Analytics are unavailable. Apply the analytics SQL setup and deploy the ingestion function, then try again.');
        setSummary(null);
      } else {
        setSummary(data);
      }
    }).catch(() => {
      if (!cancelled) {
        setError('Analytics could not be loaded. Please try again.');
        setSummary(null);
      }
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [dateFilter, requestVersion]);

  const conversionRate = summary && summary.checkout_starts > 0
    ? (summary.paid_purchases / summary.checkout_starts) * 100
    : null;
  const metricCards = summary ? [
    { label: 'Page views', value: formatCount(summary.page_views) },
    { label: 'Estimated unique visitors', value: formatCount(summary.unique_visitors) },
    { label: 'Average engagement estimate', value: formatDuration(summary.estimated_engagement_seconds_per_view) },
    { label: 'Product-card view estimates', value: formatCount(summary.product_views) },
    { label: 'Add to cart', value: formatCount(summary.add_to_cart) },
    { label: 'Checkout starts', value: formatCount(summary.checkout_starts) },
    { label: 'Paid purchases', value: formatCount(summary.paid_purchases) },
    { label: 'Paid revenue', value: `₦${Number(summary.paid_revenue).toLocaleString()}` },
    { label: 'Paid-order / checkout-start ratio', value: conversionRate === null ? '—' : `${conversionRate.toFixed(1)}%` },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-black text-foreground">Marketing Analytics</h2>
          <p className="text-sm text-muted-foreground">First-party website activity and verified sales summary.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dateFilters.map((filter) => (
            <Button
              key={filter.id}
              size="sm"
              variant={dateFilter === filter.id ? 'default' : 'outline'}
              onClick={() => setDateFilter(filter.id)}
              aria-pressed={dateFilter === filter.id}
            >
              {filter.label}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRequestVersion((version) => version + 1)}
            disabled={loading}
            aria-label="Refresh analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {!isSupabaseConfigured() ? (
        <div className="bg-card border border-border rounded-3xl p-6 text-sm text-muted-foreground">
          Connect the configured Supabase project and complete the analytics setup to view first-party metrics.
        </div>
      ) : error ? (
        <div role="alert" className="bg-card border border-destructive/30 rounded-3xl p-6 text-sm text-destructive">
          {error}
        </div>
      ) : loading && !summary ? (
        <div className="bg-card border border-border rounded-3xl p-6 text-sm text-muted-foreground">
          Loading marketing analytics…
        </div>
      ) : summary ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {metricCards.map((metric) => (
              <div key={metric.label} className="bg-card border border-border rounded-3xl p-5">
                <span className="text-xs font-bold text-muted-foreground uppercase">{metric.label}</span>
                <span className="mt-2 block text-2xl font-black text-foreground tabular-nums">{metric.value}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Product views are estimated when at least half a product card is visible. Engagement is estimated from active,
            visible-page intervals. Paid orders and revenue come from Supabase orders marked paid, grouped by order creation
            date because the order schema does not store a payment-confirmed timestamp. The paid-order / checkout-start
            figure is a period ratio, not user-level checkout attribution. Unique visitors are approximate and depend on browser storage.
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <RankingList title="Most-viewed pages" rows={summary.top_pages || []} emptyLabel="No page views in this period." />
            <RankingList title="Traffic sources" rows={summary.traffic_sources || []} emptyLabel="No traffic source data in this period." />
            <RankingList title="Referrers" rows={summary.referrers || []} emptyLabel="No referrer data in this period." />
            <RankingList title="Product views (product ID)" rows={summary.product_rankings || []} emptyLabel="No product views in this period." />
          </div>

          <section className="bg-card border border-border rounded-3xl p-5 sm:p-6">
            <h3 className="font-bold text-foreground mb-4">UTM campaign attribution</h3>
            {(summary.utm_campaigns || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No UTM-tagged visits in this period.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-xs uppercase text-muted-foreground border-b border-border">
                      <th className="py-2 pr-4">Source</th>
                      <th className="py-2 pr-4">Medium</th>
                      <th className="py-2 pr-4">Campaign</th>
                      <th className="py-2 text-right">Page views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.utm_campaigns.map((campaign) => (
                      <tr key={`${campaign.source}:${campaign.medium}:${campaign.campaign}`} className="border-b border-border last:border-0">
                        <td className="py-3 pr-4">{campaign.source}</td>
                        <td className="py-3 pr-4">{campaign.medium}</td>
                        <td className="py-3 pr-4">{campaign.campaign}</td>
                        <td className="py-3 text-right tabular-nums">{formatCount(campaign.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-8 text-center">
          <BarChart3 className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-bold text-foreground">No analytics data available</h3>
          <p className="text-sm text-muted-foreground mt-1">Tracked activity and paid orders will appear here for the selected period.</p>
        </div>
      )}
    </div>
  );
}
