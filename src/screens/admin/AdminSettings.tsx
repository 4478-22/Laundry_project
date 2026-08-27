import { useState } from "react";
import { Save, Bell } from "lucide-react";

export function AdminSettings() {
  const [platformName, setPlatformName] = useState("Laundex");
  const [notifyNewOrders, setNotifyNewOrders] = useState(true);
  const [notifyIssues, setNotifyIssues] = useState(true);
  const [notifyPartnerApps, setNotifyPartnerApps] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Platform Settings</h1>
        <p className="text-sm text-neutral-500">Basic marketplace configuration.</p>
      </div>

      {/* Platform info */}
      <div className="card p-5">
        <h2 className="font-display text-sm font-bold text-neutral-700">Platform Information</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-400">Platform Name</label>
            <input
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-400">Service Categories</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {["Wash & Fold", "Express Laundry", "Ironing", "Dry Cleaning"].map((cat) => (
                <span key={cat} className="chip bg-neutral-100 text-neutral-600">{cat}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-400">Default Currency</label>
            <input value="Ghana Cedis (₵)" disabled className="input-field mt-1 opacity-60" />
          </div>
        </div>
      </div>

      {/* Marketplace settings */}
      <div className="card p-5">
        <h2 className="font-display text-sm font-bold text-neutral-700">Marketplace Settings</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-400">Platform Commission Rate</label>
            <input value="10%" disabled className="input-field mt-1 opacity-60" />
          </div>
          <ToggleRow label="Auto-accept new partners" description="Skip manual review for new partner applications" defaultOn={false} />
          <ToggleRow label="Require partner verification" description="New partners must be verified before going live" defaultOn={true} />
        </div>
      </div>

      {/* Notification settings */}
      <div className="card p-5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-neutral-500" />
          <h2 className="font-display text-sm font-bold text-neutral-700">Notification Settings</h2>
        </div>
        <div className="mt-3 space-y-3">
          <ToggleRow
            label="New order alerts"
            description="Get notified when a new order is placed"
            defaultOn={notifyNewOrders}
            onChange={setNotifyNewOrders}
          />
          <ToggleRow
            label="Issue alerts"
            description="Get notified when a new issue is reported"
            defaultOn={notifyIssues}
            onChange={setNotifyIssues}
          />
          <ToggleRow
            label="Partner application alerts"
            description="Get notified when a partner applies to join"
            defaultOn={notifyPartnerApps}
            onChange={setNotifyPartnerApps}
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary">
          <Save className="h-4 w-4" /> Save Changes
        </button>
        {saved && <span className="text-sm font-semibold text-secondary-600">Settings saved!</span>}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultOn,
  onChange,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-neutral-900">{label}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
      <button
        onClick={() => {
          const next = !on;
          setOn(next);
          onChange?.(next);
        }}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary-600" : "bg-neutral-300"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}
