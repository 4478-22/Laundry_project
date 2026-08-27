import { useState } from "react";
import { Search, X, Star, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, UserCheck, Ban, Eye } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { adminPartners, pendingPartners } from "../../data";
import type { AdminPartner, PartnerAccountStatus } from "../../models";
import { clsx } from "clsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

const statusConfig: Record<PartnerAccountStatus, { bg: string; text: string }> = {
  Active: { bg: "bg-secondary-50", text: "text-secondary-700" },
  Suspended: { bg: "bg-error-50", text: "text-error-700" },
  "Review Required": { bg: "bg-warning-50", text: "text-warning-700" },
};

export function AdminPartners() {
  const bookings = useAppStore((s) => s.bookings);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [partners, setPartners] = useState<AdminPartner[]>(adminPartners);
  const [pending, setPending] = useState(pendingPartners);
  const [tab, setTab] = useState<"all" | "pending">("all");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  const filtered = partners.filter(
    (p) =>
      p.businessName.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = partners.find((p) => p.id === selectedId);
  const partnerOrders = selected ? bookings.filter((b) => b.laundryId === selected.id) : [];

  const updateStatus = (id: string, status: PartnerAccountStatus) => {
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, accountStatus: status } : p)));
  };

  const approvePending = (id: string) => {
    const pp = pending.find((p) => p.id === id);
    if (!pp) return;
    setPartners((prev) => [
      {
        id: pp.id.replace("pp-", "l-"),
        businessName: pp.businessName,
        location: pp.location,
        address: pp.location,
        rating: 0,
        reviewsCount: 0,
        ordersCompleted: 0,
        avgProcessingTime: "—",
        acceptingOrders: false,
        subscriptionPlan: "Free",
        accountStatus: "Active",
        dateJoined: "Just now",
        imageUrl: "https://images.pexels.com/photos/6193248/pexels-photo-6193248.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
        services: pp.services,
      },
      ...prev,
    ]);
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  const rejectPending = (id: string) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
    setRejectTarget(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Laundry Partners</h1>
        <p className="text-sm text-neutral-500">Manage businesses, approvals, and performance.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("all")}
          className={clsx("rounded-full px-4 py-2 text-sm font-semibold transition-all",
            tab === "all" ? "bg-primary-600 text-white" : "border border-neutral-200 bg-white text-neutral-600")}
        >
          All Partners ({partners.length})
        </button>
        <button
          onClick={() => setTab("pending")}
          className={clsx("flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all",
            tab === "pending" ? "bg-primary-600 text-white" : "border border-neutral-200 bg-white text-neutral-600")}
        >
          Pending ({pending.length})
        </button>
      </div>

      {tab === "pending" ? (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <div className="card p-6 text-center text-neutral-400">
              <CheckCircle2 className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">No pending partner applications.</p>
            </div>
          ) : (
            pending.map((pp) => (
              <div key={pp.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-neutral-900">{pp.businessName}</h3>
                    <p className="text-sm text-neutral-500">{pp.ownerName} · {pp.location}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{pp.phone} · {pp.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {pp.services.map((s) => (
                        <span key={s.id} className="chip bg-neutral-100 text-neutral-600">{s.name}</span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-neutral-400">Applied {pp.appliedAt}</p>
                  </div>
                  <span className="chip bg-warning-50 text-warning-700 shrink-0">Pending Review</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => approvePending(pp.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white active:scale-95 transition-transform"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => setRejectTarget(pp.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-error-50 px-4 py-2 text-sm font-semibold text-error-600 active:scale-95 transition-transform"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location..."
              className="input-field pl-10"
            />
          </div>

          {/* Desktop table */}
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Avg Time</th>
                  <th className="px-4 py-3">Accepting</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className="cursor-pointer hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={p.imageUrl} alt={p.businessName} className="h-7 w-7 rounded-lg object-cover" />
                        <span className="font-semibold text-neutral-900">{p.businessName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{p.location}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
                        {p.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{p.ordersCompleted}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.avgProcessingTime}</td>
                    <td className="px-4 py-3">
                      {p.acceptingOrders
                        ? <span className="chip bg-secondary-50 text-secondary-700">Yes</span>
                        : <span className="chip bg-neutral-100 text-neutral-500">No</span>}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{p.subscriptionPlan}</td>
                    <td className="px-4 py-3">
                      <span className={clsx("chip text-xs", statusConfig[p.accountStatus].bg, statusConfig[p.accountStatus].text)}>
                        {p.accountStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="card w-full p-3 text-left active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl} alt={p.businessName} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{p.businessName}</p>
                    <p className="text-xs text-neutral-500">{p.location} · ⭐ {p.rating} · {p.ordersCompleted} orders</p>
                  </div>
                  <span className={clsx("chip text-xs shrink-0", statusConfig[p.accountStatus].bg, statusConfig[p.accountStatus].text)}>
                    {p.accountStatus}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Partner detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedId(null)} />
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-neutral-900">Partner Profile</h2>
              <button onClick={() => setSelectedId(null)} className="text-neutral-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <img src={selected.imageUrl} alt={selected.businessName} className="h-14 w-14 rounded-2xl object-cover" />
                <div>
                  <p className="font-display text-lg font-bold text-neutral-900">{selected.businessName}</p>
                  <p className="text-sm text-neutral-500">{selected.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoTile icon={<Star className="h-4 w-4" />} label="Rating" value={`⭐ ${selected.rating} (${selected.reviewsCount})`} />
                <InfoTile icon={<Clock className="h-4 w-4" />} label="Avg Processing" value={selected.avgProcessingTime} />
                <InfoTile icon={<CheckCircle2 className="h-4 w-4" />} label="Orders Done" value={String(selected.ordersCompleted)} />
                <InfoTile icon={<AlertCircle className="h-4 w-4" />} label="Accepting" value={selected.acceptingOrders ? "Yes" : "No"} />
              </div>

              {/* Services */}
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700">Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.services.map((s) => (
                    <span key={s.id} className="chip bg-neutral-100 text-neutral-600">{s.name} · ₵{s.price}/{s.unit}</span>
                  ))}
                </div>
              </div>

              {/* Subscription */}
              <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5">
                <span className="text-sm font-semibold text-neutral-700">Subscription</span>
                <span className="text-sm font-bold text-primary-700">{selected.subscriptionPlan}</span>
              </div>

              {/* Recent orders */}
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700">Recent Orders</p>
                {partnerOrders.length > 0 ? (
                  <div className="space-y-2">
                    {partnerOrders.slice(0, 4).map((o) => (
                      <div key={o.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{o.id} · {o.studentName}</p>
                          <p className="text-xs text-neutral-500">{o.service.name} · ₵{o.total}</p>
                        </div>
                        <span className="text-xs font-semibold text-neutral-600">{o.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">No orders yet.</p>
                )}
              </div>

              {/* Management actions */}
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700">Account Management</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(selected.id, "Active")}
                    className={clsx("flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95",
                      selected.accountStatus === "Active" ? "bg-secondary-600 text-white" : "bg-secondary-50 text-secondary-700")}
                  >
                    <UserCheck className="h-4 w-4" /> Active
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "Suspended")}
                    className={clsx("flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95",
                      selected.accountStatus === "Suspended" ? "bg-error-600 text-white" : "bg-error-50 text-error-600")}
                  >
                    <Ban className="h-4 w-4" /> Suspend
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "Review Required")}
                    className={clsx("flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95",
                      selected.accountStatus === "Review Required" ? "bg-warning-500 text-white" : "bg-warning-50 text-warning-700")}
                  >
                    <Eye className="h-4 w-4" /> Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={rejectTarget !== null}
        title="Reject partner application?"
        message="This application will be permanently removed from the pending list. The applicant will need to reapply."
        confirmLabel="Reject"
        onConfirm={() => rejectTarget && rejectPending(rejectTarget)}
        onCancel={() => setRejectTarget(null)}
      />
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3">
      <div className="flex items-center gap-1.5 text-neutral-400">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
