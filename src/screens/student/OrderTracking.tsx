import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Bell, ChevronLeft, Clock, Sparkles, X } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { studentTimeline } from "../../data";
import { toStudentStage } from "../../models";
import type { StudentStage } from "../../models";
import { clsx } from "clsx";

// Order tracking screen — simplified 3-stage timeline the student sees:
// Booking Confirmed → Pickup Scheduled → Ready.
// A live timer counts how long the order has been in progress and stops
// automatically when the order reaches "Ready". A celebratory banner
// alerts the student the moment it's ready.
export function OrderTracking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const booking = useAppStore((s) => s.bookings.find((b) => b.id === bookingId));
  const notifications = useAppStore((s) => s.notifications);

  const currentStage = booking ? toStudentStage(booking.status) : null;
  const isReady = currentStage === "Ready";

  // Live elapsed timer
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // "Just became ready" detection — fires the alert once per visit
  const [showReadyAlert, setShowReadyAlert] = useState(false);
  const prevStageRef = useRef<StudentStage | null>(null);

  useEffect(() => {
    if (!booking) return;

    const startTime = booking.bookingCreatedAt
      ? new Date(booking.bookingCreatedAt).getTime()
      : Date.now();
    const endTime = booking.readyAt ? new Date(booking.readyAt).getTime() : null;

    // If already ready, freeze the timer — no ticking
    if (isReady) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (endTime) {
        setElapsed(Math.max(0, Math.floor((endTime - startTime) / 1000)));
      }
      return;
    }

    // Otherwise tick every second
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsed(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    intervalRef.current = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [booking?.bookingCreatedAt, booking?.readyAt, isReady]);

  // Detect transition into "Ready" while on this screen
  useEffect(() => {
    if (!currentStage) return;
    if (prevStageRef.current !== null && prevStageRef.current !== "Ready" && currentStage === "Ready") {
      setShowReadyAlert(true);
    }
    prevStageRef.current = currentStage;
  }, [currentStage]);

  // Auto-dismiss the ready alert after 8 seconds
  useEffect(() => {
    if (!showReadyAlert) return;
    const t = setTimeout(() => setShowReadyAlert(false), 8000);
    return () => clearTimeout(t);
  }, [showReadyAlert]);

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6">
        <p className="text-neutral-500">Order not found.</p>
        <button onClick={() => navigate("/student/bookings")} className="btn-primary">Home</button>
      </div>
    );
  }

  const currentIndex = studentTimeline.indexOf(currentStage!);

  // Gather real notification cards for this booking
  const bookingNotifs = notifications.filter(
    (n) => n.body.includes(booking.id) || n.title.toLowerCase().includes("ready"),
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      {/* Ready alert banner */}
      {showReadyAlert && (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-14 animate-slide-up">
          <div className="flex items-start gap-3 rounded-2xl bg-secondary-500 p-4 shadow-card-hover">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-white">Your laundry is ready!</p>
              <p className="text-sm text-white/90 mt-0.5">
                Order #{booking.id} from {booking.laundryName} is ready for pickup/delivery.
              </p>
            </div>
            <button
              onClick={() => setShowReadyAlert(false)}
              className="shrink-0 text-white/80 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-neutral-50/95 backdrop-blur border-b border-neutral-100 px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/student/bookings")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card border border-neutral-100 active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Order #{booking.id}</p>
            <h1 className="font-display text-base font-bold text-neutral-900">Track Order</h1>
          </div>
        </div>
      </div>

      {/* Order summary strip */}
      <div className="px-5 pt-5">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-neutral-900">{booking.laundryName}</p>
              <p className="text-sm text-neutral-500">{booking.service.name} · {booking.quantity}{booking.service.unit}</p>
            </div>
            <span className="font-display text-lg font-extrabold text-primary-700">₵{booking.total}</span>
          </div>
        </div>
      </div>

      {/* Live timer card */}
      <div className="px-5 pt-4">
        <div
          className={clsx(
            "card flex items-center gap-3 p-4 transition-all",
            isReady ? "bg-secondary-50" : "bg-white",
          )}
        >
          <span
            className={clsx(
              "flex h-11 w-11 items-center justify-center rounded-2xl transition-all",
              isReady
                ? "bg-secondary-500 text-white animate-ready-burst"
                : "bg-accent-50 text-accent-600",
            )}
          >
            {isReady ? <Check className="h-5 w-5" strokeWidth={3} /> : <Clock className="h-5 w-5" />}
          </span>
          <div className="flex-1">
            <p className="text-xs text-neutral-400 font-medium">
              {isReady ? "Completed in" : "Time in progress"}
            </p>
            <p className="font-display text-2xl font-extrabold text-neutral-900 tabular-nums">
              {formatDuration(elapsed)}
            </p>
          </div>
          {!isReady && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-accent-600">
              <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse-soft" />
              Live
            </span>
          )}
          {isReady && (
            <span className="text-sm font-semibold text-secondary-600">Done</span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pt-6">
        <h2 className="font-display text-lg font-bold text-neutral-900">Order Status</h2>
        <div className="mt-4 space-y-1">
          {studentTimeline.map((stage, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            const pending = i > currentIndex;
            return (
              <div key={stage} className="flex gap-4">
                {/* Line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                      done && "bg-secondary-500 text-white",
                      active && !isReady && "bg-accent-500 text-white animate-pulse-soft",
                      active && isReady && "bg-secondary-500 text-white animate-ready-burst",
                      pending && "bg-neutral-200 text-neutral-400",
                    )}
                  >
                    {done || (active && isReady) ? (
                      <Check className="h-5 w-5" strokeWidth={3} />
                    ) : active ? (
                      <span className="h-3 w-3 rounded-full bg-white" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-neutral-400" />
                    )}
                  </div>
                  {i < studentTimeline.length - 1 && (
                    <div
                      className={clsx(
                        "w-0.5 flex-1 min-h-[2.5rem] rounded-full transition-all",
                        done ? "bg-secondary-400" : "bg-neutral-200",
                      )}
                    />
                  )}
                </div>
                {/* Label */}
                <div className={clsx("pb-6 pt-1.5", pending && "opacity-50")}>
                  <p
                    className={clsx(
                      "font-display font-bold",
                      done && "text-neutral-700",
                      active && !isReady && "text-accent-700",
                      active && isReady && "text-secondary-700",
                      pending && "text-neutral-400",
                    )}
                  >
                    {stage}
                  </p>
                  {active && (
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {activeLabel(stage, isReady)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification cards */}
      <div className="px-5 pt-2">
        <h2 className="font-display text-lg font-bold text-neutral-900">Updates</h2>
        <div className="mt-3 space-y-3">
          {bookingNotifs.length > 0 ? (
            bookingNotifs.map((n) => (
              <NotifCard key={n.id} title={n.title} body={n.body} time={n.time} tone={n.tone} />
            ))
          ) : (
            <>
              <NotifCard
                title="Pickup scheduled"
                body="Your laundry will be picked up at the scheduled time."
                time="1 hour ago"
                tone="primary"
              />
              <NotifCard
                title="Booking confirmed"
                body={`Booking #${booking.id} confirmed with ${booking.laundryName}.`}
                time="2 hours ago"
                tone="secondary"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function activeLabel(stage: StudentStage, isReady: boolean): string {
  switch (stage) {
    case "Booking Confirmed":
      return "Your booking has been confirmed.";
    case "Pickup Scheduled":
      return "Your laundry pickup has been scheduled.";
    case "Ready":
      return isReady
        ? "Your laundry is ready for pickup/delivery."
        : "Waiting for laundry to be ready...";
  }
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  }
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

const toneMap = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-600",
  accent: "bg-accent-50 text-accent-600",
  warning: "bg-warning-50 text-warning-600",
  error: "bg-error-50 text-error-600",
} as const;

function NotifCard({
  title,
  body,
  time,
  tone,
}: {
  title: string;
  body: string;
  time: string;
  tone: keyof typeof toneMap;
}) {
  return (
    <div className="card p-4">
      <div className="flex gap-3">
        <span className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl", toneMap[tone])}>
          <Bell className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-neutral-900 text-sm">{title}</p>
            <span className="text-xs text-neutral-400 shrink-0">{time}</span>
          </div>
          <p className="mt-1 text-sm text-neutral-500 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
