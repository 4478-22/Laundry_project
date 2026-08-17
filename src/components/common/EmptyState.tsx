import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="card mt-5 flex flex-col items-center px-6 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400">
        {icon}
      </div>
      <p className="mt-5 font-display text-lg font-bold text-neutral-900">{title}</p>
      <p className="mt-1 max-w-[16rem] text-sm text-neutral-500">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
