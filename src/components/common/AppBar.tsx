import { clsx } from "clsx";
import type { ReactNode } from "react";

// App shell top bar with optional back button and title.
interface AppBarProps {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  transparent?: boolean;
  className?: string;
}

export function AppBar({ title, onBack, right, transparent, className }: AppBarProps) {
  return (
    <div
      className={clsx(
        "sticky top-0 z-30 flex items-center gap-3 px-4 py-3",
        transparent ? "bg-transparent" : "bg-neutral-50/90 backdrop-blur-md border-b border-neutral-100",
        className,
      )}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card border border-neutral-100 active:scale-95 transition-transform"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {title && (
        <h1 className="flex-1 truncate font-display text-lg font-bold text-neutral-900">{title}</h1>
      )}
      {!title && <div className="flex-1" />}
      {right}
    </div>
  );
}
