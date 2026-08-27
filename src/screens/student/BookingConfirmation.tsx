import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import { useAppStore } from "../../store/appStore";

// Success confirmation screen with an animated check, booking ID, and
// a summary of what was booked. CTA navigates to order tracking.
export function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const booking = useAppStore((s) => s.bookings.find((b) => b.id === bookingId));
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6">
        <p className="text-neutral-500">Booking not found.</p>
        <button onClick={() => navigate("/customer")} className="btn-primary">Home</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 px-6 pt-16 pb-10">
      {/* Animated success */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary-100">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full bg-secondary-500 text-white transition-all duration-500 ${
              show ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <Check className="h-9 w-9" strokeWidth={3} />
          </div>
        </div>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-neutral-900">Booking Confirmed!</h1>
        <p className="mt-1.5 text-neutral-500">Your laundry is being prepared.</p>
        <div className="mt-3 inline-flex items-center rounded-full bg-primary-50 px-4 py-1.5">
          <span className="text-sm font-bold text-primary-700">Booking ID: #{booking.id}</span>
        </div>
      </div>

      {/* Summary card */}
      <div className="mt-8 card p-5 space-y-4">
        <Row label="Laundry" value={booking.laundryName} />
        <Row label="Service" value={booking.service.name} />
        <Row label="Quantity" value={`${booking.quantity} ${booking.service.unit}`} />
        <Row label="Pickup" value={booking.pickupOption} />
        <Row label="Scheduled" value={booking.scheduledFor} />
        <div className="h-px bg-neutral-100" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-500">Total paid</span>
          <span className="font-display text-xl font-extrabold text-primary-700">₵{booking.total}</span>
        </div>
      </div>

      <div className="mt-auto space-y-3 pt-8">
        <button
          onClick={() => navigate(`/customer/track/${booking.id}`, { replace: true })}
          className="btn-primary w-full"
        >
          Track Order
        </button>
        <button
          onClick={() => navigate("/customer")}
          className="btn-secondary w-full"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-neutral-500">{label}</span>
      <span className="text-sm font-semibold text-neutral-900">{value}</span>
    </div>
  );
}
