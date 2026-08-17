import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { StatusBadge } from "../../components/common/StatusBadge";
import { EmptyState } from "../../components/common/EmptyState";
import { SkeletonList } from "../../components/common/LoadingSkeleton";

// Student bookings tab — list of the student's orders, grouped by active/past.
export function StudentBookings() {
  const navigate = useNavigate();
  const bookings = useAppStore((s) => s.bookings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const active = bookings.filter((b) => b.status !== "Completed");
  const past = bookings.filter((b) => b.status === "Completed");

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

      {active.length > 0 && (
        <div className="mt-2 px-5">
          <h2 className="mb-3 font-display text-sm font-bold text-neutral-700">Active</h2>
          <div className="space-y-3">
            {active.map((b) => (
              <BookingRow key={b.id} booking={b} onClick={() => navigate(`/student/track/${b.id}`)} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-6 px-5">
          <h2 className="mb-3 font-display text-sm font-bold text-neutral-700">Past orders</h2>
          <div className="space-y-3">
            {past.map((b) => (
              <BookingRow key={b.id} booking={b} onClick={() => navigate(`/student/track/${b.id}`)} />
            ))}
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <div className="px-5">
          <EmptyState icon={<Package className="h-6 w-6" />} title="No bookings yet" description="Browse nearby laundries and book your first service." actionLabel="Find Laundries" onAction={() => navigate("/student")} />
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking, onClick }: { booking: import("../../models").Booking; onClick: () => void }) {
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
