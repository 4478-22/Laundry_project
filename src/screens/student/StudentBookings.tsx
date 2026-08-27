import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight, Clock, Check, Sparkles } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { StatusBadge } from "../../components/common/StatusBadge";
import { EmptyState } from "../../components/common/EmptyState";
import { SkeletonList } from "../../components/common/LoadingSkeleton";
import { clsx } from "clsx";
import type { Booking } from "../../models";

type FilterTab = "all" | "active" | "ready" | "completed";

// Customer bookings tab — list of the customer's orders, grouped by active/past.
export function StudentBookings() {
  const navigate = useNavigate();
  const bookings = useAppStore((s) => s.bookings);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const active = bookings.filter((b) => b.status !== "Completed");
  const past = bookings.filter((b) => b.status === "Completed");
  const ready = bookings.filter((b) => b.status === "Ready");

  const counts: Record<FilterTab, number> = {
    all: bookings.length,
    active: active.length,
    ready: ready.length,
    completed: past.length,
  };

  const filtered = (() => {
    switch (filter) {
      case "active":
        return active;
      case "ready":
        return ready;
      case "completed":
        return past;
      default:
        return bookings;
    }
  })();

  if (loading) {
    return (
      <div className="pb-6">
        <div className="px-5 pt-12 pb-4">
          <h1 className="font-display text-2xl font-extrabold text-neutral-900">My Bookings</h1>
          <p className="mt-1 text-sm text-neutral-500">Loading your latest laundry activity…</p>
        </div>
        <div className="px-5"><SkeletonList count={4} /></div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">My Bookings</h1>
        <p className="mt-1 text-sm text-neutral-500">Track and manage your laundry orders.</p>
      </div>

      {/* Filter tabs */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-2">
        {([
          { key: "all" as const, label: "All" },
          { key: "active" as const, label: "Active" },
          { key: "ready" as const, label: "Ready" },
          { key: "completed" as const, label: "Completed" },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={clsx(
              "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all active:scale-95",
              filter === tab.key
                ? "bg-primary-600 text-white shadow-card"
                : "border border-neutral-200 bg-white text-neutral-600",
            )}
          >
            {tab.label}
            <span
              className={clsx(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold",
                filter === tab.key ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500",
              )}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Ready highlight banner */}
      {filter === "all" && ready.length > 0 && (
        <div className="px-5 mt-3">
          <button
            onClick={() => setFilter("ready")}
            className="flex w-full items-center gap-3 rounded-2xl bg-secondary-50 border border-secondary-200 p-3.5 active:scale-[0.99] transition-transform"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-500 text-white">
              <Check className="h-5 w-5" strokeWidth={3} />
            </span>
            <div className="flex-1 text-left">
              <p className="font-display text-sm font-bold text-secondary-800">
                {ready.length} order{ready.length > 1 ? "s" : ""} ready for pickup
              </p>
              <p className="text-xs text-secondary-600 mt-0.5">Tap to view and track</p>
            </div>
            <ChevronRight className="h-5 w-5 text-secondary-500" />
          </button>
        </div>
      )}

      {/* Filtered results */}
      {filter === "all" ? (
        <>
          {active.length > 0 && (
            <div className="mt-5 px-5">
              <h2 className="mb-3 font-display text-sm font-bold text-neutral-700">Active</h2>
              <div className="space-y-3">
                {active.map((b) => (
                  <BookingRow key={b.id} booking={b} onClick={() => navigate(`/customer/track/${b.id}`)} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-6 px-5">
              <h2 className="mb-3 font-display text-sm font-bold text-neutral-700">Past orders</h2>
              <div className="space-y-3">
                {past.map((b) => (
                  <BookingRow key={b.id} booking={b} onClick={() => navigate(`/customer/track/${b.id}`)} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-4 px-5 space-y-3">
          {filtered.map((b) => (
            <BookingRow key={b.id} booking={b} onClick={() => navigate(`/customer/track/${b.id}`)} />
          ))}
        </div>
      )}

      {bookings.length === 0 && (
        <div className="px-5">
          <EmptyState icon={<Package className="h-6 w-6" />} title="No bookings yet" description="Browse nearby laundries and book your first service." actionLabel="Find Laundries" onAction={() => navigate("/customer")} />
        </div>
      )}

      {filter !== "all" && filtered.length === 0 && bookings.length > 0 && (
        <div className="px-5 mt-8">
          <EmptyState
            icon={filter === "ready" ? <Sparkles className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
            title={`No ${filter} orders`}
            description={filter === "ready" ? "Orders will appear here when they're ready for pickup." : "You'll see completed orders here once you have some."}
          />
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking, onClick }: { booking: Booking; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card w-full p-4 text-left transition-all active:scale-[0.99]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display font-bold text-neutral-900 truncate">{booking.laundryName}</p>
          <p className="text-sm text-neutral-500">{booking.service.name} · {booking.quantity}{booking.service.unit}</p>
        </div>
        <span className="font-display font-extrabold text-primary-700 shrink-0">₵{booking.total}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={booking.status} />
        <span className="inline-flex items-center text-sm font-semibold text-primary-600">
          Track <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
