import { User, Store } from "lucide-react";
import { useAppStore } from "../../store/appStore";

// Mode selection — choose Customer or Laundry Partner before authenticating.
interface ModeSelectScreenProps {
  onSelectCustomer: () => void;
  onSelectPartner: () => void;
}

export function ModeSelectScreen({ onSelectCustomer, onSelectPartner }: ModeSelectScreenProps) {
  const setMode = useAppStore((s) => s.setMode);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 px-6 pt-16 pb-10">
      <div className="flex items-center gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white">
          <svg viewBox="0 0 48 48" fill="none" className="h-7 w-7">
            <path d="M24 8c-4.4 0-7.5 2.6-7.5 7.6 0 2.3 1 4.2 2.3 5.6l-2.9 14.1a2.3 2.3 0 0 0 2.3 2.7h11.6a2.3 2.3 0 0 0 2.3-2.7l-2.9-14.1c1.3-1.4 2.3-3.3 2.3-5.6C31.5 10.6 28.4 8 24 8z" fill="currentColor" />
            <circle cx="24" cy="15" r="2.6" fill="#fff" />
          </svg>
        </div>
        <span className="font-display text-xl font-extrabold text-neutral-900">Laundex</span>
      </div>

      <h1 className="mt-12 font-display text-2xl font-extrabold text-neutral-900">
        How would you like to continue?
      </h1>
      <p className="mt-2 text-neutral-500">Choose an account type to get started.</p>

      <div className="mt-8 space-y-4">
        <button
          onClick={() => {
            setMode("customer");
            onSelectCustomer();
          }}
          className="card w-full p-5 text-left transition-all hover:shadow-card-hover active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <User className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-neutral-900">I'm a Customer</h3>
              <p className="text-sm text-neutral-500">Find laundries, book & track orders.</p>
            </div>
            <Chevron />
          </div>
        </button>

        <button
          onClick={() => {
            setMode("partner");
            onSelectPartner();
          }}
          className="card w-full p-5 text-left transition-all hover:shadow-card-hover active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600">
              <Store className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-neutral-900">I'm a Laundry Partner</h3>
              <p className="text-sm text-neutral-500">Manage orders & grow your business.</p>
            </div>
            <Chevron />
          </div>
        </button>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
