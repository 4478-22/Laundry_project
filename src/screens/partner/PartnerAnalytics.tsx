import { ArrowLeft, ChartBar as BarChart3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PartnerAnalytics() {
  const navigate = useNavigate();
  const revenue = [42, 68, 85, 74, 96, 112, 128];
  const peakDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const max = Math.max(...revenue);

  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      <div className="sticky top-0 z-20 border-b border-neutral-100 bg-neutral-50/95 px-4 pt-12 pb-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card">
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div>
            <p className="text-xs font-medium text-neutral-400">Performance</p>
            <h1 className="font-display text-lg font-bold text-neutral-900">Analytics</h1>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Revenue" value="₵2.4k" tone="primary" />
          <MetricCard label="Bookings" value="84" tone="secondary" />
          <MetricCard label="Services sold" value="152" tone="accent" />
          <MetricCard label="Repeat students" value="38%" tone="warning" />
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-neutral-900">Revenue</p>
              <p className="text-sm text-neutral-500">Weekly trend and student demand.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-secondary-50 px-2.5 py-1 text-sm font-semibold text-secondary-700">
              <TrendingUp className="h-4 w-4" /> +18%
            </div>
          </div>
          <div className="mt-5 flex h-32 items-end justify-between gap-2">
            {revenue.map((value, index) => (
              <div key={peakDays[index]} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end rounded-xl bg-neutral-100 p-1">
                  <div className="w-full rounded-lg bg-gradient-to-t from-primary-600 to-primary-400" style={{ height: `${(value / max) * 100}%` }} />
                </div>
                <span className="text-xs text-neutral-400">{peakDays[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-secondary-600" />
            <div>
              <p className="font-display text-lg font-bold text-neutral-900">Business health</p>
              <p className="text-sm text-neutral-500">Daily KPIs and account health.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <ProgressRow label="Completion rate" value="94%" />
            <ProgressRow label="Average rating" value="4.8/5" />
            <ProgressRow label="Commission earned" value="₵540" />
            <ProgressRow label="Outstanding commission" value="₵360" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "primary" | "secondary" | "accent" | "warning" }) {
  const tones = {
    primary: "bg-primary-50 text-primary-700",
    secondary: "bg-secondary-50 text-secondary-700",
    accent: "bg-accent-50 text-accent-700",
    warning: "bg-warning-50 text-warning-700",
  } as const;
  return <div className={`rounded-2xl p-4 ${tones[tone]}`}><p className="text-sm font-semibold">{label}</p><p className="mt-2 font-display text-2xl font-extrabold">{value}</p></div>;
}

function ProgressRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-neutral-700">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-neutral-100">
        <div className="h-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-400" style={{ width: label.includes("Completion") ? "94%" : label.includes("Average") ? "96%" : label.includes("Commission earned") ? "70%" : "50%" }} />
      </div>
    </div>
  );
}
