import { useNavigate } from "react-router-dom";
import { Check, Clock, Truck, Store, ChevronRight } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { StatusBadge } from "../../components/common/StatusBadge";

// Incoming orders tab — new bookings awaiting acceptance.
export function IncomingOrders() {
  const navigate = useNavigate();
  const incoming = useAppStore((s) => s.incomingOrders);
  const acceptOrder = useAppStore((s) => s.acceptOrder);

  return (
    <div className="pb-6">
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Incoming Orders</h1>
        <p className="mt-1 text-neutral-500 text-sm">{incoming.length} new bookings awaiting your response.</p>
      </div>

      {incoming.length > 0 ? (
        <div className="px-5 mt-2 space-y-4">
          {incoming.map((o) => (
            <div key={o.id} className="card overflow-hidden">
              {/* New booking ribbon */}
              <div className="flex items-center justify-between bg-primary-50 px-4 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700">
                  <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse-soft" />
                  New Booking
                </span>
                <span className="text-xs text-neutral-400">{o.createdAt}</span>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-neutral-900">{o.customerName}</p>
                    <p className="text-sm text-neutral-500">Booking #{o.id}</p>
                  </div>
                  <span className="font-display text-lg font-extrabold text-primary-700">₵{o.total}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Detail label="Service" value={o.service.name} />
                  <Detail label="Weight" value={`${o.quantity} ${o.service.unit}`} />
                  <Detail label="Pickup" value={o.pickupOption} icon={o.pickupOption === "Laundry pickup" ? <Truck className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />} />
                  <Detail label="Schedule" value={o.scheduledFor} icon={<Clock className="h-3.5 w-3.5" />} />
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={o.status} />
                </div>

                {/* Accept */}
                <button
                  onClick={() => {
                    acceptOrder(o.id);
                    navigate(`/partner/manage/${o.id}`);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary-600 py-3.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary-700 hover:shadow-md active:scale-[0.98]"
                >
                  <Check className="h-5 w-5" strokeWidth={2.5} /> Accept Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 mt-20 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-4xl bg-neutral-100 text-neutral-300">
            <Check className="h-10 w-10" />
          </div>
          <p className="mt-5 font-display text-lg font-bold text-neutral-900">All caught up!</p>
          <p className="mt-1 text-sm text-neutral-500 max-w-[16rem]">
            No new bookings right now. New orders will appear here.
          </p>
        </div>
      )}

      {/* Accepted orders → manage */}
      <AcceptedOrdersSection />
    </div>
  );
}

function AcceptedOrdersSection() {
  const navigate = useNavigate();
  const bookings = useAppStore((s) => s.bookings);
  const accepted = bookings.filter((b) => b.status !== "Completed");

  if (accepted.length === 0) return null;

  return (
    <div className="px-5 mt-8">
      <h2 className="font-display text-sm font-bold text-neutral-700 mb-3">In Progress</h2>
      <div className="space-y-3">
        {accepted.map((o) => (
          <button
            key={o.id}
            onClick={() => navigate(`/partner/manage/${o.id}`)}
            className="card w-full p-4 text-left flex items-center justify-between active:scale-[0.99] transition-transform"
          >
            <div>
              <p className="font-semibold text-neutral-900">{o.customerName} · #{o.id}</p>
              <p className="text-sm text-neutral-500">{o.service.name} · ₵{o.total}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={o.status} />
              <ChevronRight className="h-5 w-5 text-neutral-300" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-2.5">
      <p className="text-xs text-neutral-400 font-medium flex items-center gap-1">{icon}{label}</p>
      <p className="text-sm font-semibold text-neutral-800 mt-0.5">{value}</p>
    </div>
  );
}
