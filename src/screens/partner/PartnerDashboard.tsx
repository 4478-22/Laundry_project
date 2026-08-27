import { useNavigate } from "react-router-dom";
import { Package, Clock, CircleCheck as CheckCircle2, DollarSign, Star, ChevronRight, ArrowUpRight, Store } from "lucide-react";
import { StatCard } from "../../components/common/SectionHeader";
import { useAppStore } from "../../store/appStore";
import { StatusBadge } from "../../components/common/StatusBadge";
import { clsx } from "clsx";

// Partner dashboard — business overview with stats, revenue, recent orders.
export function PartnerDashboard() {
  const navigate = useNavigate();
  const bookings = useAppStore((s) => s.bookings);
  const incoming = useAppStore((s) => s.incomingOrders);
  const isAcceptingOrders = useAppStore((s) => s.isAcceptingOrders);
  const setAcceptingOrders = useAppStore((s) => s.setAcceptingOrders);

  const pending = incoming.length + bookings.filter((b) => b.status !== "Completed" && b.status !== "Booking Confirmed").length;

  // Weekly revenue bar chart (dummy data).
  const weekData = [40, 65, 120, 85, 150, 180, 210];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxRev = Math.max(...weekData);

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary-700 to-primary-800 px-5 pt-12 pb-6 text-white rounded-b-4xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium">CleanPro Laundry</p>
            <h1 className="font-display text-2xl font-extrabold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-3 py-1.5">
            <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
            <span className="font-bold">4.8</span>
          </div>
        </div>
      </div>

      {/* Accepting Orders toggle */}
      <div className="px-5 mt-5">
        <div className="card p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={clsx(
                "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors",
                isAcceptingOrders ? "bg-secondary-50 text-secondary-600" : "bg-neutral-100 text-neutral-400",
              )}>
                <Store className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display font-bold text-neutral-900">Accepting Orders</p>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {isAcceptingOrders
                    ? "Customers can currently place bookings."
                    : "Your business is currently not accepting new bookings."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAcceptingOrders(!isAcceptingOrders)}
              role="switch"
              aria-checked={isAcceptingOrders}
              aria-label="Toggle accepting orders"
              className={clsx(
                "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
                isAcceptingOrders ? "bg-secondary-500" : "bg-neutral-300",
              )}
            >
              <span
                className={clsx(
                  "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                  isAcceptingOrders ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-3">
        <StatCard label="Today's Orders" value={12} icon={<Package className="h-4 w-4" />} accent="primary" />
        <StatCard label="Pending Orders" value={pending} icon={<Clock className="h-4 w-4" />} accent="warning" />
        <StatCard label="Completed Orders" value={35} icon={<CheckCircle2 className="h-4 w-4" />} accent="secondary" />
        <StatCard label="Revenue" value="₵850" icon={<DollarSign className="h-4 w-4" />} accent="accent" />
      </div>

      {/* Revenue chart */}
      <div className="px-5 mt-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 font-medium">This week's revenue</p>
              <p className="font-display text-2xl font-extrabold text-neutral-900">₵850</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-50 px-2.5 py-1 text-xs font-bold text-secondary-700">
              <ArrowUpRight className="h-3.5 w-3.5" /> +12%
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-2 h-28">
            {weekData.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-400 transition-all"
                    style={{ height: `${(v / maxRev) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-400 font-medium">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incoming orders preview */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-neutral-900">Incoming Orders</h2>
          <button
            onClick={() => navigate("/partner/orders")}
            className="inline-flex items-center text-sm font-semibold text-primary-600"
          >
            See all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        {incoming.slice(0, 2).map((o) => (
          <div key={o.id} className="card p-4 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <Package className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">{o.customerName}</p>
                  <p className="text-sm text-neutral-500">{o.service.name} · {o.quantity}{o.service.unit}</p>
                </div>
              </div>
              <StatusBadge status={o.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <div className="px-5 mt-6">
        <button
          onClick={() => navigate("/partner/orders")}
          className="btn-primary w-full"
        >
          Manage Orders
        </button>
      </div>
    </div>
  );
}
