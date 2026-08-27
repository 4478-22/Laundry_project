import { Users, Store, Package, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, CreditCard, TrendingUp } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { adminPartners, adminStudents, adminIssues, adminSubscriptions } from "../../data";
import type { AdminSection } from "./AdminApp";
import { clsx } from "clsx";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tint: string;
}

function StatCard({ icon, label, value, tint }: StatCardProps) {
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

export function AdminOverview({ onNavigate }: { onNavigate: (s: AdminSection) => void }) {
  const bookings = useAppStore((s) => s.bookings);
  const activeOrders = bookings.filter((b) => b.status !== "Completed" && b.status !== "Ready").length;
  const completedOrders = bookings.filter((b) => b.status === "Completed").length;
  const openIssues = adminIssues.filter((i) => i.status !== "Resolved").length;
  const activeSubs = adminSubscriptions.filter((s) => s.status === "Active").length;

  const recentOrders = bookings.slice(0, 5);
  const recentPartners = adminPartners.slice(0, 3);
  const recentIssues = adminIssues.slice(0, 3);
  const recentStudents = adminStudents.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Overview</h1>
        <p className="text-sm text-neutral-500">A snapshot of the Laundex marketplace.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={<Users className="h-5 w-5 text-primary-600" />} label="Total Customers" value={adminStudents.length} tint="bg-primary-50" />
        <StatCard icon={<Store className="h-5 w-5 text-secondary-600" />} label="Laundry Partners" value={adminPartners.length} tint="bg-secondary-50" />
        <StatCard icon={<Package className="h-5 w-5 text-accent-600" />} label="Active Orders" value={activeOrders} tint="bg-accent-50" />
        <StatCard icon={<CheckCircle2 className="h-5 w-5 text-secondary-600" />} label="Completed Orders" value={completedOrders} tint="bg-secondary-50" />
        <StatCard icon={<AlertCircle className="h-5 w-5 text-error-600" />} label="Open Issues" value={openIssues} tint="bg-error-50" />
        <StatCard icon={<CreditCard className="h-5 w-5 text-primary-600" />} label="Active Subscriptions" value={activeSubs} tint="bg-primary-50" />
      </div>

      {/* Recent activity columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-neutral-700">Recent Orders</h2>
            <button onClick={() => onNavigate("orders")} className="text-xs font-semibold text-primary-600">View all</button>
          </div>
          <div className="mt-3 space-y-2">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{o.id} · {o.studentName}</p>
                  <p className="text-xs text-neutral-500 truncate">{o.laundryName} · {o.service.name}</p>
                </div>
                <span className="text-xs font-semibold text-neutral-600 shrink-0">{o.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Partners */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-neutral-700">Recently Registered Partners</h2>
            <button onClick={() => onNavigate("partners")} className="text-xs font-semibold text-primary-600">View all</button>
          </div>
          <div className="mt-3 space-y-2">
            {recentPartners.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5">
                <img src={p.imageUrl} alt={p.businessName} className="h-8 w-8 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{p.businessName}</p>
                  <p className="text-xs text-neutral-500">{p.location} · {p.dateJoined}</p>
                </div>
                <span className={clsx("chip text-xs", p.accountStatus === "Active" ? "bg-secondary-50 text-secondary-700" : "bg-warning-50 text-warning-700")}>
                  {p.accountStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Issues */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-neutral-700">Recent Issues</h2>
            <button onClick={() => onNavigate("issues")} className="text-xs font-semibold text-primary-600">View all</button>
          </div>
          <div className="mt-3 space-y-2">
            {recentIssues.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{i.type}</p>
                  <p className="text-xs text-neutral-500 truncate">{i.reporter} · {i.createdAt}</p>
                </div>
                <span className={clsx("chip text-xs shrink-0",
                  i.status === "Open" ? "bg-error-50 text-error-700" :
                  i.status === "Investigating" ? "bg-warning-50 text-warning-700" :
                  "bg-secondary-50 text-secondary-700")}>
                  {i.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-neutral-700">Recently Registered Customers</h2>
            <button onClick={() => onNavigate("customers")} className="text-xs font-semibold text-primary-600">View all</button>
          </div>
          <div className="mt-3 space-y-2">
            {recentStudents.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5">
                <img src={s.avatarUrl} alt={s.name} className="h-8 w-8 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{s.name}</p>
                  <p className="text-xs text-neutral-500">{s.orderCount} orders · {s.dateJoined}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-neutral-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
