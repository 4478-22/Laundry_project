import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { orderTimeline } from "../../data";
import type { OrderStatus } from "../../models";
import { clsx } from "clsx";

// Order management — laundry owner updates the order status through the
// timeline. Each advance button moves the order to the next stage.
export function OrderManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookings = useAppStore((s) => s.bookings);
  const incoming = useAppStore((s) => s.incomingOrders);
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus);

  const order = [...bookings, ...incoming].find((b) => b.id === id);

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6">
        <p className="text-neutral-500">Order not found.</p>
        <button onClick={() => navigate("/partner/orders")} className="btn-primary">Back to orders</button>
      </div>
    );
  }

  const currentIndex = orderTimeline.indexOf(order.status);
  const nextStatus = currentIndex >= 0 && currentIndex < orderTimeline.length - 1
    ? orderTimeline[currentIndex + 1]
    : null;
  const isCompleted = order.status === "Completed";

  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-neutral-50/95 backdrop-blur border-b border-neutral-100 px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/partner/orders")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card border border-neutral-100 active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Order #{order.id}</p>
            <h1 className="font-display text-base font-bold text-neutral-900">Manage Order</h1>
          </div>
        </div>
      </div>

      {/* Student + service summary */}
      <div className="px-5 pt-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-neutral-900">{order.studentName}</p>
              <p className="text-sm text-neutral-500">{order.service.name} · {order.quantity}{order.service.unit}</p>
            </div>
            <span className="font-display text-xl font-extrabold text-primary-700">₵{order.total}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Mini label="Pickup" value={order.pickupOption} />
            <Mini label="Schedule" value={order.scheduledFor} />
            <Mini label="Service" value={order.service.name} />
            <Mini label="Duration" value={order.service.duration} />
          </div>
        </div>
      </div>

      {/* Status timeline */}
      <div className="px-5 pt-6">
        <h2 className="font-display text-lg font-bold text-neutral-900">Status Timeline</h2>
        <div className="mt-4 space-y-1">
          {orderTimeline.map((status, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            const pending = i > currentIndex;
            return (
              <div key={status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                      done && "bg-secondary-500 text-white",
                      active && "bg-primary-600 text-white",
                      pending && "bg-neutral-200 text-neutral-400",
                    )}
                  >
                    {done ? <Check className="h-5 w-5" strokeWidth={3} /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  {i < orderTimeline.length - 1 && (
                    <div className={clsx("w-0.5 flex-1 min-h-[2rem] rounded-full", done ? "bg-secondary-400" : "bg-neutral-200")} />
                  )}
                </div>
                <div className={clsx("pb-5 pt-1.5", pending && "opacity-50")}>
                  <p className={clsx("font-display font-bold", done ? "text-neutral-700" : active ? "text-primary-700" : "text-neutral-400")}>
                    {status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action */}
      <div className="px-5 mt-4">
        {isCompleted ? (
          <div className="card flex items-center gap-3 p-4 bg-secondary-50">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-500 text-white">
              <Check className="h-5 w-5" strokeWidth={3} />
            </span>
            <div>
              <p className="font-display font-bold text-secondary-800">Order completed</p>
              <p className="text-sm text-secondary-700">This order has been delivered.</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => nextStatus && updateOrderStatus(order.id, nextStatus as OrderStatus)}
            className="btn-primary w-full"
          >
            {actionLabel(nextStatus)}
          </button>
        )}
      </div>
    </div>
  );
}

function actionLabel(next: OrderStatus | null): string {
  switch (next) {
    case "Laundry Accepted": return "Accept Order";
    case "Pickup Scheduled": return "Schedule Pickup";
    case "Washing": return "Start Washing";
    case "Ready": return "Mark as Ready";
    case "Completed": return "Mark as Completed";
    default: return "Update Status";
  }
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-2.5">
      <p className="text-xs text-neutral-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-neutral-800 mt-0.5">{value}</p>
    </div>
  );
}
