import { useNavigate, useParams } from "react-router-dom";
import { Check, Bell, ChevronLeft } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { orderTimeline } from "../../data";
import { clsx } from "clsx";

// Order tracking screen — vertical timeline showing the order's progress,
// plus notification cards for status updates.
export function OrderTracking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const booking = useAppStore((s) => s.bookings.find((b) => b.id === bookingId));

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6">
        <p className="text-neutral-500">Order not found.</p>
        <button onClick={() => navigate("/customer")} className="btn-primary">Home</button>
      </div>
    );
  }

  const currentIndex = orderTimeline.indexOf(booking.status);

  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-neutral-50/95 backdrop-blur border-b border-neutral-100 px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/customer/bookings")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card border border-neutral-100 active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Order #{booking.id}</p>
            <h1 className="font-display text-base font-bold text-neutral-900">Track Order</h1>
          </div>
        </div>
      </div>

      {/* Order summary strip */}
      <div className="px-5 pt-5">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-neutral-900">{booking.laundryName}</p>
              <p className="text-sm text-neutral-500">{booking.service.name} · {booking.quantity}{booking.service.unit}</p>
            </div>
            <span className="font-display text-lg font-extrabold text-primary-700">₵{booking.total}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pt-6">
        <h2 className="font-display text-lg font-bold text-neutral-900">Order Status</h2>
        <div className="mt-4 space-y-1">
          {orderTimeline.map((status, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            const pending = i > currentIndex;
            return (
              <div key={status} className="flex gap-4">
                {/* Line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                      done && "bg-secondary-500 text-white",
                      active && "bg-accent-500 text-white animate-pulse-soft",
                      pending && "bg-neutral-200 text-neutral-400",
                    )}
                  >
                    {done ? (
                      <Check className="h-5 w-5" strokeWidth={3} />
                    ) : active ? (
                      <span className="h-3 w-3 rounded-full bg-white" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-neutral-400" />
                    )}
                  </div>
                  {i < orderTimeline.length - 1 && (
                    <div
                      className={clsx(
                        "w-0.5 flex-1 min-h-[2.5rem] rounded-full",
                        done ? "bg-secondary-400" : "bg-neutral-200",
                      )}
                    />
                  )}
                </div>
                {/* Label */}
                <div className={clsx("pb-6 pt-1.5", pending && "opacity-50")}>
                  <p
                    className={clsx(
                      "font-display font-bold",
                      done && "text-neutral-700",
                      active && "text-accent-700",
                      pending && "text-neutral-400",
                    )}
                  >
                    {status}
                  </p>
                  {active && (
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {activeLabel(status)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification cards */}
      <div className="px-5 pt-2">
        <h2 className="font-display text-lg font-bold text-neutral-900">Updates</h2>
        <div className="mt-3 space-y-3">
          <NotifCard
            title="Your laundry is being washed"
            body="CleanPro Laundry has started washing your clothes. You'll be notified when ready."
            time="15 min ago"
            tone="accent"
          />
          <NotifCard
            title="Pickup scheduled"
            body="Your laundry will be picked up tomorrow at 10AM."
            time="1 hour ago"
            tone="primary"
          />
          <NotifCard
            title="Booking confirmed"
            body={`Booking #${booking.id} confirmed with ${booking.laundryName}.`}
            time="2 hours ago"
            tone="secondary"
          />
        </div>
      </div>
    </div>
  );
}

function activeLabel(status: string): string {
  switch (status) {
    case "Washing":
      return "Your clothes are being washed right now.";
    case "Ready":
      return "Your laundry is ready for pickup/delivery.";
    case "Completed":
      return "Order complete. Enjoy your fresh clothes!";
    default:
      return "In progress…";
  }
}

const toneMap = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-600",
  accent: "bg-accent-50 text-accent-600",
} as const;

function NotifCard({
  title,
  body,
  time,
  tone,
}: {
  title: string;
  body: string;
  time: string;
  tone: keyof typeof toneMap;
}) {
  return (
    <div className="card p-4">
      <div className="flex gap-3">
        <span className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl", toneMap[tone])}>
          <Bell className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-neutral-900 text-sm">{title}</p>
            <span className="text-xs text-neutral-400 shrink-0">{time}</span>
          </div>
          <p className="mt-1 text-sm text-neutral-500 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
