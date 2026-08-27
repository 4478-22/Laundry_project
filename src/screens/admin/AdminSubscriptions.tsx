import { adminSubscriptions } from "../../data";
import { clsx } from "clsx";

const planConfig: Record<string, { bg: string; text: string }> = {
  Free: { bg: "bg-neutral-100", text: "text-neutral-600" },
  Growth: { bg: "bg-primary-50", text: "text-primary-700" },
  Premium: { bg: "bg-accent-50", text: "text-accent-700" },
};

const statusConfig: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-secondary-50", text: "text-secondary-700" },
  "Past Due": { bg: "bg-warning-50", text: "text-warning-700" },
  Cancelled: { bg: "bg-error-50", text: "text-error-700" },
};

export function AdminSubscriptions() {
  const free = adminSubscriptions.filter((s) => s.plan === "Free").length;
  const growth = adminSubscriptions.filter((s) => s.plan === "Growth").length;
  const premium = adminSubscriptions.filter((s) => s.plan === "Premium").length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Subscriptions</h1>
        <p className="text-sm text-neutral-500">Partner subscription plans and status.</p>
      </div>

      {/* Plan summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="font-display text-2xl font-extrabold text-neutral-900">{free}</p>
          <p className="text-xs font-medium text-neutral-500">Free</p>
        </div>
        <div className="card p-4 text-center">
          <p className="font-display text-2xl font-extrabold text-primary-700">{growth}</p>
          <p className="text-xs font-medium text-primary-600">Growth</p>
        </div>
        <div className="card p-4 text-center">
          <p className="font-display text-2xl font-extrabold text-accent-700">{premium}</p>
          <p className="text-xs font-medium text-accent-600">Premium</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-400">
            <tr>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date Started</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {adminSubscriptions.map((s) => (
              <tr key={s.partnerId} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-neutral-900">{s.partnerName}</td>
                <td className="px-4 py-3">
                  <span className={clsx("chip text-xs", planConfig[s.plan].bg, planConfig[s.plan].text)}>
                    {s.plan}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={clsx("chip text-xs", statusConfig[s.status].bg, statusConfig[s.status].text)}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{s.dateStarted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {adminSubscriptions.map((s) => (
          <div key={s.partnerId} className="card p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">{s.partnerName}</p>
              <span className={clsx("chip text-xs", planConfig[s.plan].bg, planConfig[s.plan].text)}>
                {s.plan}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className={clsx("chip text-xs", statusConfig[s.status].bg, statusConfig[s.status].text)}>
                {s.status}
              </span>
              <span className="text-xs text-neutral-400">{s.dateStarted}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
