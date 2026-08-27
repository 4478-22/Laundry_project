import { useState } from "react";
import { Search, X, Package, Store, User } from "lucide-react";
import { adminIssues } from "../../data";
import { useAppStore } from "../../store/appStore";
import type { AdminIssue, IssueStatus } from "../../models";
import { clsx } from "clsx";

const statusConfig: Record<IssueStatus, { bg: string; text: string }> = {
  Open: { bg: "bg-error-50", text: "text-error-700" },
  Investigating: { bg: "bg-warning-50", text: "text-warning-700" },
  Resolved: { bg: "bg-secondary-50", text: "text-secondary-700" },
};

const issueTypeIcon = (type: string) => {
  if (type.includes("Pickup") || type.includes("Missing")) return <Package className="h-4 w-4" />;
  if (type.includes("Partner")) return <Store className="h-4 w-4" />;
  if (type.includes("Customer")) return <User className="h-4 w-4" />;
  return <Package className="h-4 w-4" />;
};

export function AdminIssues() {
  const bookings = useAppStore((s) => s.bookings);
  const [issues, setIssues] = useState<AdminIssue[]>(adminIssues);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  const filtered = issues.filter((i) => {
    const matchesSearch =
      i.type.toLowerCase().includes(search.toLowerCase()) ||
      i.reporter.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selected = issues.find((i) => i.id === selectedId);
  const relatedOrder = selected?.orderId ? bookings.find((b) => b.id === selected.orderId) : undefined;

  const changeStatus = (id: string, status: IssueStatus) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const addNote = (id: string) => {
    if (!noteInput.trim()) return;
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, internalNote: noteInput } : i)));
    setNoteInput("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Issues & Support</h1>
        <p className="text-sm text-neutral-500">Track and resolve reported problems.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by type or reporter..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field sm:w-44"
        >
          <option value="all">All statuses</option>
          <option value="Open">Open</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-400">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Reporter</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Laundry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reported</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map((i) => (
              <tr
                key={i.id}
                onClick={() => setSelectedId(i.id)}
                className="cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-neutral-900">{i.type}</td>
                <td className="px-4 py-3 text-neutral-600">{i.reporter}</td>
                <td className="px-4 py-3 text-neutral-600">{i.orderId ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{i.laundryName ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={clsx("chip text-xs", statusConfig[i.status].bg, statusConfig[i.status].text)}>
                    {i.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{i.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {filtered.map((i) => (
          <button
            key={i.id}
            onClick={() => setSelectedId(i.id)}
            className="card w-full p-3 text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {issueTypeIcon(i.type)}
                <span className="text-sm font-semibold text-neutral-900">{i.type}</span>
              </div>
              <span className={clsx("chip text-xs", statusConfig[i.status].bg, statusConfig[i.status].text)}>
                {i.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">{i.reporter} · {i.createdAt}</p>
          </button>
        ))}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedId(null)} />
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-neutral-900">Issue Details</h2>
              <button onClick={() => setSelectedId(null)} className="text-neutral-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className={clsx("chip", statusConfig[selected.status].bg, statusConfig[selected.status].text)}>
                  {selected.status}
                </span>
                <span className="text-xs text-neutral-400">Reported {selected.createdAt}</span>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-400">Type</p>
                <p className="text-sm font-semibold text-neutral-900">{selected.type}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-400">Reporter</p>
                <p className="text-sm font-semibold text-neutral-900">{selected.reporter} ({selected.reporterRole})</p>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-400">Description</p>
                <p className="text-sm text-neutral-600">{selected.description}</p>
              </div>

              {selected.orderId && (
                <div className="rounded-xl bg-neutral-50 p-3">
                  <p className="text-xs font-medium text-neutral-400">Related Order</p>
                  <p className="text-sm font-semibold text-neutral-900">{selected.orderId}</p>
                  {relatedOrder && (
                    <p className="text-xs text-neutral-500">{relatedOrder.laundryName} · {relatedOrder.service.name} · ₵{relatedOrder.total}</p>
                  )}
                </div>
              )}

              {selected.laundryName && (
                <div>
                  <p className="text-xs font-medium text-neutral-400">Laundry</p>
                  <p className="text-sm font-semibold text-neutral-900">{selected.laundryName}</p>
                </div>
              )}

              {/* Internal note */}
              <div>
                <p className="mb-1.5 text-sm font-semibold text-neutral-700">Internal Note</p>
                {selected.internalNote && (
                  <div className="mb-2 rounded-xl bg-accent-50 px-3 py-2 text-sm text-neutral-700">
                    {selected.internalNote}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add an internal note..."
                    className="input-field flex-1"
                  />
                  <button onClick={() => addNote(selected.id)} className="btn-primary px-4">Save</button>
                </div>
              </div>

              {/* Status actions */}
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-700">Change Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["Open", "Investigating", "Resolved"] as IssueStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => changeStatus(selected.id, s)}
                      className={clsx("rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95",
                        selected.status === s
                          ? clsx(statusConfig[s].bg, statusConfig[s].text, "ring-2 ring-current")
                          : "bg-neutral-100 text-neutral-600")}
                    >
                      {s}
                    </button>
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
