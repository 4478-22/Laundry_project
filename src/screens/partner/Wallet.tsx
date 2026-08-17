import { useEffect, useState } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle2, CreditCard, Landmark, Wallet2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import { SkeletonList } from "../../components/common/LoadingSkeleton";

export function Wallet() {
  const navigate = useNavigate();
  const wallet = useAppStore((s) => s.partnerWallet);
  const topUpWallet = useAppStore((s) => s.topUpWallet);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const handleTopUp = (provider: string) => {
    topUpWallet(55, provider);
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 1800);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      <div className="sticky top-0 z-20 border-b border-neutral-100 bg-neutral-50/95 px-4 pt-12 pb-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card">
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div>
            <p className="text-xs font-medium text-neutral-400">Partner wallet</p>
            <h1 className="font-display text-lg font-bold text-neutral-900">Wallet</h1>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        {wallet.outstandingCommission > 100 && (
          <div className="rounded-2xl border border-warning-200 bg-warning-50 p-3 text-sm font-semibold text-warning-700">
            <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Outstanding commission is above ₵100. Keep an eye on your balance.</div>
          </div>
        )}
        {wallet.outstandingCommission > 300 && (
          <div className="rounded-2xl border border-error-200 bg-error-50 p-3 text-sm font-semibold text-error-700">
            <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Please settle your outstanding commission balance to continue receiving new bookings.</div>
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-4 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-100">Current wallet balance</p>
                <p className="font-display text-3xl font-extrabold">₵{wallet.walletBalance}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Wallet2 className="h-6 w-6" /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            <SummaryCard label="Outstanding commission" value={`₵${wallet.outstandingCommission}`} accent="warning" />
            <SummaryCard label="Available payout" value={`₵${wallet.availablePayout}`} accent="secondary" />
            <SummaryCard label="Commission rate" value={`${wallet.commissionRate}%`} accent="accent" />
            <SummaryCard label="Weekly earnings" value={`₵${wallet.weeklyEarnings}`} accent="primary" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-display text-lg font-bold text-neutral-900">Wallet top-up</p>
              <p className="text-sm text-neutral-500">Simulate a fast mobile-money top-up.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {providers.map((provider) => (
              <button key={provider.name} onClick={() => handleTopUp(provider.name)} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm font-semibold text-neutral-700 active:scale-95">
                {provider.name}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-secondary-50 px-3 py-2 text-sm font-semibold text-secondary-700">
            {success ? <CheckCircle2 className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
            {success ? "Top-up completed successfully" : "Simulate a payment from your preferred provider"}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-neutral-900">Recent transactions</p>
              <p className="text-sm text-neutral-500">A live ledger for partner commissions and payouts.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {loading ? <SkeletonList count={4} /> : wallet.transactions.slice(0, 6).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-3">
                <div>
                  <p className="font-semibold text-neutral-900">{tx.type}</p>
                  <p className="text-sm text-neutral-500">{tx.description}</p>
                </div>
                <div className="text-right">
                  <p className={`font-display font-bold ${tx.type === "Outstanding Commission" ? "text-warning-600" : "text-primary-700"}`}>₵{tx.amount}</p>
                  <p className="text-xs text-neutral-400">{tx.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: string; accent: "primary" | "secondary" | "accent" | "warning" }) {
  const accents = {
    primary: "bg-primary-50 text-primary-700",
    secondary: "bg-secondary-50 text-secondary-700",
    accent: "bg-accent-50 text-accent-700",
    warning: "bg-warning-50 text-warning-700",
  } as const;
  return (
    <div className={`rounded-2xl px-3 py-3 ${accents[accent]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </div>
  );
}

const providers = [
  { name: "MTN MoMo" },
  { name: "Telecel Cash" },
  { name: "AirtelTigo Money" },
];
