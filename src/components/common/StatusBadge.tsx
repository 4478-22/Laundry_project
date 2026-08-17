import { clsx } from "clsx";
import type { OrderStatus } from "../../models";

// Maps an order status to its colour treatment, shared by tracking and
// partner order management screens.
export const statusStyles: Record<OrderStatus, { dot: string; text: string; bg: string }> = {
  "Booking Confirmed": { dot: "bg-primary-500", text: "text-primary-700", bg: "bg-primary-50" },
  "Laundry Accepted": { dot: "bg-primary-500", text: "text-primary-700", bg: "bg-primary-50" },
  "Pickup Scheduled": { dot: "bg-accent-500", text: "text-accent-700", bg: "bg-accent-50" },
  Washing: { dot: "bg-accent-500", text: "text-accent-700", bg: "bg-accent-50" },
  Ready: { dot: "bg-secondary-500", text: "text-secondary-700", bg: "bg-secondary-50" },
  Completed: { dot: "bg-secondary-500", text: "text-secondary-700", bg: "bg-secondary-50" },
};

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = statusStyles[status];
  return (
    <span className={clsx("chip", s.bg, s.text, className)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  );
}
