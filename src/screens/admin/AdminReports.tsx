import { Star, Clock, TrendingUp, Award, Zap } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { adminPartners } from "../../data";
import { clsx } from "clsx";

export function AdminReports() {
  const bookings = useAppStore((s) => s.bookings);
  const totalOrders = bookings.length;
  const completedOrders = bookings.filter((b) => b.status === "Completed").length;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  // Partner performance
  const partnerStats = adminPartners
    .map((p) => ({
      ...p,
      orderCount: bookings.filter((b) => b.laundryId === p.id || b.laundryName === p.businessName).length,
    }))
    .sort((a, b) => b.ordersCompleted - a.ordersCompleted);

  const mostActive = [...partnerStats].sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);
  const highestRated = [...adminPartners].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const fastest = [...adminPartners]
    .filter((p) => p.avgProcessingTime !== "—")
    .sort((a, b) => {
      const parseTime = (t: string) => {
        const h = parseInt(t.match(/(\d+)h/)?.[1] ?? "0");
        const m = parseInt(t.match(/(\d+)m/)?.[1] ?? "0");
        return h * 60 + m;
      };
      return parseTime(a.avgProcessingTime) - parseTime(b.avgProcessingTime);
    })
    .slice(0, 5);

  // Best overall = highest rating + fast processing
  const bestOverall = [...adminPartners]
    .filter((p) => p.avgProcessingTime !== "—")
    .sort((a, b) => {
      const score = (p: typeof a) => p.rating * 100 - parseInt(p.avgProcessingTime.match(/(\d+)h/)?.[1] ?? "0") * 10;
      return score(b) - score(a);
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Reports & Performance</h1>
        <p className="text-sm text-neutral-500">Marketplace performance at a glance.</p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Total Orders" value={totalOrders} icon={<TrendingUp className="h-5 w-5 text-primary-600" />} tint="bg-primary-50" />
        <MetricCard label="Completed Orders" value={completedOrders} icon={<TrendingUp className="h-5 w-5 text-secondary-600" />} tint="bg-secondary-50" />
        <MetricCard label="Completion Rate" value={`${completionRate}%`} icon={<Award className="h-5 w-5 text-accent-600" />} tint="bg-accent-50" />
        <MetricCard label="Active Partners" value={adminPartners.filter((p) => p.accountStatus === "Active").length} icon={<Zap className="h-5 w-5 text-primary-600" />} tint="bg-primary-50" />
      </div>

      {/* Performance lists */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Most active */}
        <div className="card p-4">
          <h2 className="font-display text-sm font-bold text-neutral-700">Most Active Laundries</h2>
          <div className="mt-3 space-y-2">
            {mostActive.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5">
                <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  i === 0 ? "bg-accent-500 text-white" : "bg-neutral-200 text-neutral-600")}>
                  {i + 1}
                </span>
                <img src={p.imageUrl} alt={p.businessName} className="h-7 w-7 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{p.businessName}</p>
                  <p className="text-xs text-neutral-500">{p.orderCount} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest rated */}
        <div className="card p-4">
          <h2 className="font-display text-sm font-bold text-neutral-700">Highest Rated Laundries</h2>
          <div className="mt-3 space-y-2">
            {highestRated.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5">
                <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  i === 0 ? "bg-accent-500 text-white" : "bg-neutral-200 text-neutral-600")}>
                  {i + 1}
                </span>
                <img src={p.imageUrl} alt={p.businessName} className="h-7 w-7 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{p.businessName}</p>
                  <p className="text-xs text-neutral-500">{p.reviewsCount} reviews</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-accent-700">
                  <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
                  {p.rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fastest */}
        <div className="card p-4">
          <h2 className="font-display text-sm font-bold text-neutral-700">Fastest Laundries</h2>
          <div className="mt-3 space-y-2">
            {fastest.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5">
                <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  i === 0 ? "bg-secondary-500 text-white" : "bg-neutral-200 text-neutral-600")}>
                  {i + 1}
                </span>
                <img src={p.imageUrl} alt={p.businessName} className="h-7 w-7 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{p.businessName}</p>
                  <p className="text-xs text-neutral-500">{p.location}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary-700">
                  <Clock className="h-3.5 w-3.5" />
                  {p.avgProcessingTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Best overall */}
        <div className="card p-4">
          <h2 className="font-display text-sm font-bold text-neutral-700">Best Overall (Rating + Speed)</h2>
          <div className="mt-3 space-y-2">
            {bestOverall.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5">
                <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  i === 0 ? "bg-primary-600 text-white" : "bg-neutral-200 text-neutral-600")}>
                  {i + 1}
                </span>
                <img src={p.imageUrl} alt={p.businessName} className="h-7 w-7 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{p.businessName}</p>
                  <p className="text-xs text-neutral-500">⭐ {p.rating} · {p.avgProcessingTime}</p>
                </div>
                <span className="chip bg-primary-50 text-primary-700 text-xs">Best</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, tint }: { label: string; value: number | string; icon: React.ReactNode; tint: string }) {
  return (
    <div className="card p-4">
      <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl", tint)}>
        {icon}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold text-neutral-900">{value}</p>
      <p className="text-xs font-medium text-neutral-500">{label}</p>
    </div>
  );
}
