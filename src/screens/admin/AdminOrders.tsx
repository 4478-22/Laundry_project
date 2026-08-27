import { useState } from "react";
import { Search, X, Clock } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { StatusBadge } from "../../components/common/StatusBadge";
import type { Booking } from "../../models";

export function AdminOrders() {
  const bookings = useAppStore((s) => s.bookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.studentName.toLowerCase().includes(search.toLowerCase()) ||
      b.laundryName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", "Booking Confirmed", "Laundry Accepted", "Pickup Scheduled", "Washing", "Ready", "Completed"];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Orders</h1>
        <p className="text-sm text-neutral-500">All marketplace orders and their status.</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer, or laundry..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field sm:w-48"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>
          ))}
        </select>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-400">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Laundry</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.slice(0, 30).map((b) => (
              <tr
                key={b.id}
                onClick={() => setSelected(b)}
                className="cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-neutral-900">{b.id}</td>
                <td className="px-4 py-3 text-neutral-600">{b.studentName}</td>
                <td className="px-4 py-3 text-neutral-600">{b.laundryName}</td>
                <td className="px-4 py-3 text-neutral-600">{b.service.name}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3 text-neutral-500">{b.createdAt}</td>
                <td className="px-4 py-3 font-semibold text-neutral-900">₵{b.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-2">
        {filtered.slice(0, 30).map((b) => (
          <button
            key={b.id}
            onClick={() => setSelected(b)}
            className="card w-full p-3 text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-neutral-900">{b.id}</span>
              <StatusBadge status={b.status} />
            </div>
            <p className="mt-1 text-xs text-neutral-500">{b.studentName} · {b.laundryName}</p>
            <p className="text-xs text-neutral-500">{b.service.name} · ₵{b.total} · {b.createdAt}</p>
          </button>
        ))}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-neutral-900">Order {selected.id}</h2>
              <button onClick={() => setSelected(null)} className="text-neutral-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-3">
                <DetailRow label="Customer" value={selected.studentName} />
                <DetailRow label="Laundry" value={selected.laundryName} />
                <DetailRow label="Service" value={selected.service.name} />
                <DetailRow label="Quantity" value={`${selected.quantity} ${selected.service.unit}`} />
                <DetailRow label="Pickup" value={selected.pickupOption} />
                <DetailRow label="Scheduled" value={selected.scheduledFor} />
                <DetailRow label="Payment" value={selected.paymentMethod} />
                <DetailRow label="Total" value={`₵${selected.total}`} />
                <DetailRow label="Commission" value={`₵${selected.platformCommission}`} />
                <DetailRow label="Laundry receives" value={`₵${selected.laundryReceives}`} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-700">Status</span>
                <StatusBadge status={selected.status} />
              </div>

              {/* Timeline */}
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700">Order Timeline</p>
                <div className="space-y-2">
                  {[
                    { label: "Booking Created", time: selected.bookingCreatedAt, display: selected.createdAt },
                    { label: "Pickup Scheduled", time: selected.pickupScheduledAt },
                    { label: "Processing Started", time: selected.processingStartedAt },
                    { label: "Ready", time: selected.readyAt },
                    { label: "Completed", time: selected.completedAt },
                  ].filter((t) => t.time || t.display).map((t) => (
                    <div key={t.label} className="flex items-center gap-2 text-sm">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      <span className="text-neutral-600">{t.label}</span>
                      <span className="ml-auto text-xs text-neutral-400">{t.display ?? new Date(t.time!).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-neutral-400">{label}</p>
      <p className="text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
