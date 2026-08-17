import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, Clock, Truck, Store, Calendar } from "lucide-react";
import { dummyLaundries } from "../../data";
import { useAppStore } from "../../store/appStore";
import type { Booking, PickupOption, Service } from "../../models";
import { clsx } from "clsx";

// 4-step booking flow: service → quantity → pickup → date/time, with a
// live price summary and Confirm Booking CTA.
export function BookingFlow() {
  const { laundryId } = useParams();
  const navigate = useNavigate();
  const laundry = dummyLaundries.find((l) => l.id === laundryId);
  const addBooking = useAppStore((s) => s.addBooking);

  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pickup, setPickup] = useState<PickupOption>("Laundry pickup");
  const [slot, setSlot] = useState("Tomorrow 10AM");

  if (!laundry) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6">
        <p className="text-neutral-500">Laundry not found.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Go back</button>
      </div>
    );
  }

  const total = service ? service.price * quantity : 0;

  const confirm = () => {
    if (!service) return;
    const id = `UPSA${Math.floor(10000 + Math.random() * 89999)}`;
    const platformCommission = Math.round(total * 0.1);
    const booking: Booking = {
      id,
      laundryId: laundry.id,
      laundryName: laundry.name,
      studentName: "Daniel",
      service,
      quantity,
      pickupOption: pickup,
      scheduledFor: slot,
      total,
      status: "Booking Confirmed",
      createdAt: "Just now",
      paymentMethod: "Pay Online",
      platformCommission,
      laundryReceives: total - platformCommission,
      commissionStatus: "Collected",
    };
    addBooking(booking);
    navigate(`/student/confirm/${id}`, { replace: true });
  };

  const steps = ["Service", "Quantity", "Pickup", "Schedule"];

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Header with stepper */}
      <div className="sticky top-0 z-30 bg-neutral-50/95 backdrop-blur border-b border-neutral-100 px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card border border-neutral-100 active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-neutral-400 font-medium">Book · {laundry.name}</p>
            <h1 className="font-display text-base font-bold text-neutral-900">{steps[step]}</h1>
          </div>
        </div>
        {/* Stepper dots */}
        <div className="mt-3 flex items-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={clsx(
                "h-1.5 flex-1 rounded-full transition-all",
                i <= step ? "bg-primary-600" : "bg-neutral-200",
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 py-5">
        {/* Step 1: Service */}
        {step === 0 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-neutral-500">Choose a service to book.</p>
            {laundry.services.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setService(s);
                  setStep(1);
                }}
                className={clsx(
                  "card w-full p-4 text-left transition-all active:scale-[0.99]",
                  service?.id === s.id && "ring-2 ring-primary-500",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-neutral-900">{s.name}</h3>
                    <p className="text-sm text-neutral-500">{s.description}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-neutral-400">
                      <Clock className="h-3.5 w-3.5" /> {s.duration}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-lg font-extrabold text-primary-700">₵{s.price}</p>
                    <p className="text-xs text-neutral-400">per {s.unit}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Quantity */}
        {step === 1 && service && (
          <div className="space-y-5 animate-fade-in">
            <div className="card p-5">
              <h3 className="font-display font-bold text-neutral-900">{service.name}</h3>
              <p className="text-sm text-neutral-500">₵{service.price} per {service.unit}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-sm font-medium text-neutral-500">How much laundry?</p>
              <div className="mt-5 flex items-center justify-center gap-6">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-2xl font-bold text-neutral-700 active:scale-95 transition-transform"
                >
                  −
                </button>
                <div>
                  <span className="font-display text-4xl font-extrabold text-neutral-900">{quantity}</span>
                  <span className="ml-1 text-lg font-semibold text-neutral-400">{service.unit}</span>
                </div>
                <button
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-2xl font-bold text-white active:scale-95 transition-transform"
                >
                  +
                </button>
              </div>
              <p className="mt-5 text-sm text-neutral-500">
                Subtotal: <span className="font-bold text-neutral-900">₵{total}</span>
              </p>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full">Continue</button>
          </div>
        )}

        {/* Step 3: Pickup option */}
        {step === 2 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-neutral-500">How should we handle your laundry?</p>
            {(["Laundry pickup", "Student drops off"] as PickupOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setPickup(opt);
                  setStep(3);
                }}
                className={clsx(
                  "card w-full p-4 text-left transition-all active:scale-[0.99]",
                  pickup === opt && "ring-2 ring-primary-500",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    {opt === "Laundry pickup" ? <Truck className="h-5 w-5" /> : <Store className="h-5 w-5" />}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-neutral-900">{opt}</h3>
                    <p className="text-sm text-neutral-500">
                      {opt === "Laundry pickup"
                        ? "We'll come collect your laundry."
                        : "Drop off at the laundry location."}
                    </p>
                  </div>
                  {pickup === opt && <Check className="h-5 w-5 text-primary-600" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Date & time */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-neutral-500">Choose a date and time slot.</p>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {["Today", "Tomorrow", "Wed 7", "Thu 8"].map((d, i) => (
                <button
                  key={d}
                  onClick={() => setSlot(`${d} 10AM`)}
                  className={clsx(
                    "chip whitespace-nowrap px-4 py-2.5",
                    i === 1 ? "bg-primary-600 text-white" : "bg-white text-neutral-600 border border-neutral-200",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["8AM", "10AM", "12PM", "2PM", "4PM", "6PM"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSlot(`Tomorrow ${t}`)}
                  className={clsx(
                    "rounded-2xl border py-3 text-sm font-semibold transition-all active:scale-95",
                    slot === `Tomorrow ${t}`
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-neutral-200 bg-white text-neutral-600",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="card flex items-center gap-3 p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Calendar className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-neutral-400 font-medium">Selected slot</p>
                <p className="font-semibold text-neutral-900">{slot}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Price summary + CTA */}
      {service && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-neutral-100 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 font-medium">Total</p>
              <p className="font-display text-2xl font-extrabold text-neutral-900">₵{total}</p>
            </div>
            <div className="text-right text-xs text-neutral-500">
              <p>{service.name}</p>
              <p>{quantity}{service.unit} · {pickup}</p>
            </div>
          </div>
          <button
            onClick={confirm}
            disabled={step < 3}
            className="btn-primary w-full disabled:opacity-40"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}
