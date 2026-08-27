import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Camera, Clock3, DollarSign, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import type { BusinessSettings, Service } from "../../models";
import { SkeletonProfile } from "../../components/common/LoadingSkeleton";

export function BusinessSettings() {
  const navigate = useNavigate();
  const settings = useAppStore((s) => s.businessSettings);
  const setBusinessSettings = useAppStore((s) => s.setBusinessSettings);
  const addBusinessService = useAppStore((s) => s.addBusinessService);
  const updateBusinessService = useAppStore((s) => s.updateBusinessService);
  const deleteBusinessService = useAppStore((s) => s.deleteBusinessService);
  const [draft, setDraft] = useState<BusinessSettings>(settings);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const serviceDraft = useMemo<Service>(() => editingService ?? {
    id: `service-${Date.now()}`,
    name: "",
    price: 0,
    unit: "kg",
    duration: "24 hours",
    description: "",
  }, [editingService]);

  const save = () => {
    setBusinessSettings(draft);
    navigate("/partner/profile");
  };

  const discard = () => {
    setDraft(settings);
    setEditingService(null);
  };

  const saveService = () => {
    if (!serviceDraft.name.trim()) return;
    if (editingService) {
      updateBusinessService(serviceDraft);
    } else {
      addBusinessService(serviceDraft);
    }
    setEditingService(null);
  };

  if (isLoading) {
    return <SkeletonProfile />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="sticky top-0 z-20 border-b border-neutral-100 bg-neutral-50/95 px-4 pt-12 pb-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card">
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div>
            <p className="text-xs font-medium text-neutral-400">Partner workspace</p>
            <h1 className="font-display text-lg font-bold text-neutral-900">Business Settings</h1>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-4 text-white">
            <div>
              <p className="font-display text-lg font-bold">Business Information</p>
              <p className="text-sm text-primary-100">Keep your details current for students and investors.</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Camera className="h-5 w-5" />
            </span>
          </div>
          <div className="space-y-3 p-4">
            <Field label="Business Name" value={draft.businessName} onChange={(v) => setDraft({ ...draft, businessName: v })} />
            <Field label="Owner Name" value={draft.ownerName} onChange={(v) => setDraft({ ...draft, ownerName: v })} />
            <Field label="Phone" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} />
            <Field label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
            <Field label="Business Address" value={draft.address} onChange={(v) => setDraft({ ...draft, address: v })} />
            <Field label="GPS Location" value={draft.gpsLocation} onChange={(v) => setDraft({ ...draft, gpsLocation: v })} />
            <label className="block text-sm font-semibold text-neutral-700">
              <span className="mb-2 block">Description</span>
              <textarea
                rows={3}
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                className="input-field min-h-[90px]"
              />
            </label>
          </div>
        </section>

        <section className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-neutral-900">Business Hours</p>
              <p className="text-sm text-neutral-500">Set your weekly schedule and holiday mode.</p>
            </div>
            <label className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-2 text-sm font-semibold text-neutral-700">
              <input
                type="checkbox"
                checked={draft.holidayMode}
                onChange={(event) => setDraft({ ...draft, holidayMode: event.target.checked })}
                className="h-4 w-4 rounded border-neutral-300"
              />
              Holiday mode
            </label>
          </div>
          <div className="mt-4 space-y-2">
            {draft.hours.map((hour) => (
              <div key={hour.day} className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 px-3 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Clock3 className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm font-semibold text-neutral-700">{hour.day}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={hour.open}
                    onChange={(event) => updateHour(draft, setDraft, hour.day, "open", event.target.value)}
                    className="w-16 rounded-xl border border-neutral-200 px-2 py-2 text-sm"
                  />
                  <span className="text-neutral-400">-</span>
                  <input
                    value={hour.close}
                    onChange={(event) => updateHour(draft, setDraft, hour.day, "close", event.target.value)}
                    className="w-16 rounded-xl border border-neutral-200 px-2 py-2 text-sm"
                  />
                  <label className="text-xs font-semibold text-neutral-500">
                    <input
                      type="checkbox"
                      checked={hour.closed}
                      onChange={(event) => updateHour(draft, setDraft, hour.day, "closed", event.target.checked)}
                      className="mr-1"
                    />
                    Closed
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-neutral-900">Services Management</p>
              <p className="text-sm text-neutral-500">Create service bundles and adjust pricing.</p>
            </div>
            <button onClick={() => setEditingService(null)} className="btn-ghost">
              <Plus className="h-4 w-4" /> New
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {draft.services.map((service) => (
              <div key={service.id} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-neutral-900">{service.name}</p>
                    <p className="text-sm text-neutral-500">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-primary-700">₵{service.price}</p>
                    <p className="text-xs text-neutral-400">per {service.unit}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditingService(service)} className="btn-secondary flex-1">Edit</button>
                  <button onClick={() => deleteBusinessService(service.id)} className="rounded-2xl bg-error-50 p-2.5 text-error-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-neutral-900">{editingService ? "Edit service" : "Add service"}</p>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Local demo</span>
            </div>
            <div className="mt-3 space-y-3">
              <Field label="Service Name" value={serviceDraft.name} onChange={(value) => setEditingService({ ...serviceDraft, name: value })} />
              <Field label="Description" value={serviceDraft.description} onChange={(value) => setEditingService({ ...serviceDraft, description: value })} />
              <Field label="Price" value={String(serviceDraft.price)} onChange={(value) => setEditingService({ ...serviceDraft, price: Number(value) || 0 })} />
              <div className="flex gap-2">
                <button onClick={() => setEditingService({ ...serviceDraft, unit: "kg" })} className="btn-secondary flex-1">kg</button>
                <button onClick={() => setEditingService({ ...serviceDraft, unit: "item" })} className="btn-secondary flex-1">item</button>
              </div>
              <button onClick={saveService} className="btn-primary w-full">{editingService ? "Update Service" : "Add Service"}</button>
            </div>
          </div>
        </section>

        <section className="card p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-display text-lg font-bold text-neutral-900">Pricing Settings</p>
              <p className="text-sm text-neutral-500">Create clear add-on pricing for pickups and extras.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <Field label="Pickup Fee" value={String(draft.pricing.pickupFee)} onChange={(value) => setDraft({ ...draft, pricing: { ...draft.pricing, pickupFee: Number(value) || 0 } })} />
            <Field label="Express Fee" value={String(draft.pricing.expressFee)} onChange={(value) => setDraft({ ...draft, pricing: { ...draft.pricing, expressFee: Number(value) || 0 } })} />
            <Field label="Ironing Fee" value={String(draft.pricing.ironingFee)} onChange={(value) => setDraft({ ...draft, pricing: { ...draft.pricing, ironingFee: Number(value) || 0 } })} />
            <Field label="Large Items" value={String(draft.pricing.largeItems)} onChange={(value) => setDraft({ ...draft, pricing: { ...draft.pricing, largeItems: Number(value) || 0 } })} />
          </div>
        </section>

        <section className="card p-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-secondary-600" />
            <div>
              <p className="font-display text-lg font-bold text-neutral-900">Media</p>
              <p className="text-sm text-neutral-500">Visual assets for your business profile.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            <img src={draft.profileImage} alt="Business profile" className="h-28 w-full rounded-2xl object-cover" />
            <img src={draft.coverImage} alt="Business cover" className="h-28 w-full rounded-2xl object-cover" />
          </div>
        </section>

        <div className="flex gap-3">
          <button onClick={discard} className="btn-secondary flex-1">Discard Changes</button>
          <button onClick={save} className="btn-primary flex-1">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-semibold text-neutral-700">
      <span className="mb-2 block">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="input-field" />
    </label>
  );
}

function updateHour(
  draft: BusinessSettings,
  setDraft: (value: BusinessSettings) => void,
  day: string,
  field: "open" | "close" | "closed",
  value: string | boolean,
) {
  setDraft({
    ...draft,
    hours: draft.hours.map((hour) =>
      hour.day === day
        ? { ...hour, [field]: value }
        : hour,
    ),
  });
}
