import { useState } from "react";
import { Search, X, Package } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { adminStudents } from "../../data";
import { clsx } from "clsx";

export function AdminCustomers() {
  const bookings = useAppStore((s) => s.bookings);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = adminStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = adminStudents.find((s) => s.id === selectedId);
  const customerOrders = selected ? bookings.filter((b) => b.studentName === selected.name) : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Customers</h1>
        <p className="text-sm text-neutral-500">Manage student accounts and activity.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input-field pl-10"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map((s) => (
              <tr
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={s.avatarUrl} alt={s.name} className="h-7 w-7 rounded-full object-cover" />
                    <span className="font-semibold text-neutral-900">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">{s.email}</td>
                <td className="px-4 py-3 text-neutral-600">{s.orderCount}</td>
                <td className="px-4 py-3">
                  <span className={clsx("chip text-xs",
                    s.accountStatus === "Active" ? "bg-secondary-50 text-secondary-700" : "bg-error-50 text-error-700")}>
                    {s.accountStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{s.dateJoined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className="card w-full p-3 text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3">
              <img src={s.avatarUrl} alt={s.name} className="h-9 w-9 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-900 truncate">{s.name}</p>
                <p className="text-xs text-neutral-500 truncate">{s.email}</p>
              </div>
              <span className={clsx("chip text-xs",
                s.accountStatus === "Active" ? "bg-secondary-50 text-secondary-700" : "bg-error-50 text-error-700")}>
                {s.accountStatus}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedId(null)} />
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-neutral-900">Customer Profile</h2>
              <button onClick={() => setSelectedId(null)} className="text-neutral-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <img src={selected.avatarUrl} alt={selected.name} className="h-14 w-14 rounded-2xl object-cover" />
                <div>
                  <p className="font-display text-lg font-bold text-neutral-900">{selected.name}</p>
                  <p className="text-sm text-neutral-500">{selected.email}</p>
                  <p className="text-xs text-neutral-400">{selected.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-neutral-50 p-3 text-center">
                  <p className="font-display text-xl font-extrabold text-neutral-900">{selected.orderCount}</p>
                  <p className="text-xs text-neutral-500">Orders</p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3 text-center">
                  <p className="font-display text-xl font-extrabold text-neutral-900">{selected.dateJoined}</p>
                  <p className="text-xs text-neutral-500">Joined</p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3 text-center">
                  <p className={clsx("font-display text-sm font-extrabold",
                    selected.accountStatus === "Active" ? "text-secondary-600" : "text-error-600")}>
                    {selected.accountStatus}
                  </p>
                  <p className="text-xs text-neutral-500">Account</p>
                </div>
              </div>

              {/* Order history */}
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700">Order History</p>
                {customerOrders.length > 0 ? (
                  <div className="space-y-2">
                    {customerOrders.slice(0, 5).map((o) => (
                      <div key={o.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{o.id}</p>
                          <p className="text-xs text-neutral-500">{o.laundryName} · {o.service.name}</p>
                        </div>
                        <span className="text-xs font-semibold text-neutral-600">{o.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-3 text-neutral-400">
                    <Package className="h-4 w-4" />
                    <p className="text-sm">No orders found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
