import { useState } from "react";
import { Plus, Clock, CreditCard as Edit3, Trash2, X } from "lucide-react";
import { useAppStore } from "../../store/appStore";

const emptyFormState: {
  name: string;
  description: string;
  duration: string;
  price: string;
  unit: "kg" | "item";
} = {
  name: "",
  description: "",
  duration: "",
  price: "",
  unit: "kg",
};

// Partner services tab — list of services the business offers with prices.
export function PartnerServices() {
  const services = useAppStore((s) => s.businessSettings.services);
  const addBusinessService = useAppStore((s) => s.addBusinessService);
  const updateBusinessService = useAppStore((s) => s.updateBusinessService);
  const deleteBusinessService = useAppStore((s) => s.deleteBusinessService);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyFormState);

  const openAddForm = () => {
    setEditingId(null);
    setFormState(emptyFormState);
    setShowForm(true);
  };

  const openEditForm = (service: (typeof services)[number]) => {
    setEditingId(service.id);
    setFormState({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: String(service.price),
      unit: service.unit,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormState(emptyFormState);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formState.name.trim() || !formState.description.trim() || !formState.duration.trim() || !formState.price) {
      return;
    }

    const payload = {
      ...formState,
      name: formState.name.trim(),
      description: formState.description.trim(),
      duration: formState.duration.trim(),
      price: Number(formState.price),
      unit: formState.unit,
    };

    if (editingId) {
      const currentService = services.find((service) => service.id === editingId);
      if (currentService) {
        updateBusinessService({
          ...currentService,
          ...payload,
          available: currentService.available ?? true,
        });
      }
    } else {
      addBusinessService({
        id: `service-${Date.now()}`,
        ...payload,
        available: true,
      });
    }

    closeForm();
  };

  const toggleAvailability = (serviceId: string) => {
    const currentService = services.find((service) => service.id === serviceId);
    if (currentService) {
      updateBusinessService({
        ...currentService,
        available: !(currentService.available ?? true),
      });
    }
  };

  const deleteService = (serviceId: string) => {
    deleteBusinessService(serviceId);
  };

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between px-5 pb-4 pt-12">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900">Services</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage what you offer.</p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white transition-transform active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2 space-y-3 px-5">
        {services.map((s) => (
          <div key={s.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-bold text-neutral-900">{s.name}</h3>
                  <span className={(s.available ?? true) ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700" : "rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600"}>
                    {(s.available ?? true) ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-500">{s.description}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-neutral-400">
                  <Clock className="h-3.5 w-3.5" /> {s.duration}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-lg font-extrabold text-primary-700">₵{s.price}</p>
                <p className="text-xs text-neutral-400">per {s.unit}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openEditForm(s)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-50 px-3 py-2 text-sm font-semibold text-neutral-600 transition-transform active:scale-95"
              >
                <Edit3 className="h-4 w-4" /> Edit
              </button>
              <button
                type="button"
                onClick={() => toggleAvailability(s.id)}
                className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors"
              >
                {(s.available ?? true) ? "Set unavailable" : "Set available"}
              </button>
              <button
                type="button"
                onClick={() => deleteService(s.id)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-error-200 bg-error-50 px-3 py-2 text-sm font-semibold text-error-700"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 px-5">
        <button
          type="button"
          onClick={openAddForm}
          className="card flex w-full items-center justify-center gap-2 border-2 border-dashed border-neutral-200 p-5 font-semibold text-neutral-400 transition-transform active:scale-[0.99]"
        >
          <Plus className="h-5 w-5" /> Add new service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">{editingId ? "Edit service" : "Add service"}</p>
                <h2 className="mt-2 font-display text-xl font-semibold text-neutral-900">{editingId ? "Update service details" : "Create a new service"}</h2>
              </div>
              <button type="button" onClick={closeForm} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700">Service name</label>
                <input
                  value={formState.name}
                  onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                  className="input-field mt-2 w-full"
                  placeholder="Wash & Fold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700">Description</label>
                <textarea
                  value={formState.description}
                  onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                  rows={3}
                  className="input-field mt-2 w-full"
                  placeholder="Fast, reliable laundry service for everyone."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Duration</label>
                  <input
                    value={formState.duration}
                    onChange={(event) => setFormState((current) => ({ ...current, duration: event.target.value }))}
                    className="input-field mt-2 w-full"
                    placeholder="24 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700">Price</label>
                  <input
                    type="number"
                    min="0"
                    value={formState.price}
                    onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))}
                    className="input-field mt-2 w-full"
                    placeholder="20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700">Unit</label>
                <select
                  value={formState.unit}
                  onChange={(event) => setFormState((current) => ({ ...current, unit: event.target.value as "kg" | "item" }))}
                  className="input-field mt-2 w-full"
                >
                  <option value="kg">Per kg</option>
                  <option value="item">Per item</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-secondary flex-1 justify-center">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  {editingId ? "Save changes" : "Add service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
