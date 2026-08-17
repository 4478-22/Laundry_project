import { ArrowLeft, MessageCircleQuestion, PhoneCall, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SupportCenter() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      <div className="sticky top-0 z-20 border-b border-neutral-100 bg-neutral-50/95 px-4 pt-12 pb-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card">
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div>
            <p className="text-xs font-medium text-neutral-400">Support</p>
            <h1 className="font-display text-lg font-bold text-neutral-900">Help Center</h1>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"><MessageCircleQuestion className="h-5 w-5" /></div>
            <div>
              <p className="font-semibold text-neutral-900">How do I book an order?</p>
              <p className="text-sm text-neutral-500">Pick a laundry, choose your service, and confirm the pickup slot.</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600"><PhoneCall className="h-5 w-5" /></div>
            <div>
              <p className="font-semibold text-neutral-900">Live support</p>
              <p className="text-sm text-neutral-500">Call +233 24 000 1234 for urgent issues or delivery questions.</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-50 text-accent-600"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <p className="font-semibold text-neutral-900">Safety standards</p>
              <p className="text-sm text-neutral-500">Every partner is verified and every order is tracked in real time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
