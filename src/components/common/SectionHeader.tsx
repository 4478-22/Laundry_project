import { clsx } from "clsx";
import type { ReactNode } from "react";

// Lightweight section header used across list sections.
interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({ title, action, onAction, className }: SectionHeaderProps) {
  return (
    <div className={clsx("flex items-center justify-between px-1", className)}>
      <h2 className="font-display text-lg font-bold text-neutral-900">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="text-sm font-semibold text-primary-600 active:scale-95 transition-transform"
        >
          {action}
        </button>
      )}
    </div>
  );
}

// Small label/value stat block used on the partner dashboard.
interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  accent?: "primary" | "secondary" | "accent" | "warning" | "error";
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-600",
  accent: "bg-accent-50 text-accent-600",
  warning: "bg-warning-50 text-warning-600",
  error: "bg-error-50 text-error-600",
};

export function StatCard({ label, value, icon, accent = "primary" }: StatCardProps) {
  return (
    <div className="card p-4 flex flex-col gap-1.5 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        {icon && (
          <span className={clsx("flex h-8 w-8 items-center justify-center rounded-xl", accentMap[accent])}>
            {icon}
          </span>
        )}
      </div>
      <span className="font-display text-2xl font-bold text-neutral-900">{value}</span>
    </div>
  );
}
