import { clsx } from "clsx";

export interface LoadOption {
  kg: number;
  label: string;
  description: string;
  fillPercent: number;
}

export const KG_LOAD_OPTIONS: LoadOption[] = [
  { kg: 3, label: "Small load", description: "A few daily outfits or a light basket", fillPercent: 30 },
  { kg: 5, label: "Medium load", description: "Good for a typical basket of clothes", fillPercent: 50 },
  { kg: 7, label: "Large load", description: "A full basket — bedding and towels too", fillPercent: 70 },
  { kg: 10, label: "Extra large load", description: "An overflowing basket or two loads", fillPercent: 95 },
];

interface LaundryBasketProps {
  fillPercent: number;
  selected: boolean;
  size?: number;
  className?: string;
}

export function LaundryBasket({ fillPercent, selected, size = 64, className }: LaundryBasketProps) {
  const fillHeight = (fillPercent / 100) * 38;
  const yTop = 46 - fillHeight;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={clsx("transition-transform duration-300", className)}
    >
      {/* Basket body */}
      <path
        d="M14 22 L50 22 L46 54 Q46 56 44 56 L20 56 Q18 56 18 54 Z"
        className={clsx(
          "transition-colors duration-300",
          selected ? "fill-primary-50" : "fill-neutral-50",
        )}
        stroke={selected ? "#1a80f5" : "#cbd5e1"}
        strokeWidth="1.5"
      />
      {/* Basket rim */}
      <rect
        x="12"
        y="18"
        width="40"
        height="6"
        rx="2"
        className={clsx(
          "transition-colors duration-300",
          selected ? "fill-primary-100" : "fill-neutral-100",
        )}
        stroke={selected ? "#1a80f5" : "#cbd5e1"}
        strokeWidth="1.5"
      />
      {/* Weave lines */}
      <line x1="22" y1="28" x2="22" y2="52" stroke={selected ? "#8ed8ff" : "#e2e8f0"} strokeWidth="1" />
      <line x1="32" y1="28" x2="32" y2="52" stroke={selected ? "#8ed8ff" : "#e2e8f0"} strokeWidth="1" />
      <line x1="42" y1="28" x2="42" y2="52" stroke={selected ? "#8ed8ff" : "#e2e8f0"} strokeWidth="1" />
      <line x1="18" y1="38" x2="46" y2="38" stroke={selected ? "#8ed8ff" : "#e2e8f0"} strokeWidth="1" />
      {/* Clothes fill */}
      <path
        d={`M18 ${yTop} L46 ${yTop} L44 54 Q44 55 43 55 L21 55 Q20 55 20 54 Z`}
        className={clsx(
          "transition-all duration-500 ease-out",
          selected ? "fill-primary-400" : "fill-neutral-300",
        )}
      />
      {/* Clothes bumps on top */}
      {fillPercent >= 50 && (
        <circle cx="26" cy={yTop} r="4" className={clsx("transition-all duration-500", selected ? "fill-primary-400" : "fill-neutral-300")} />
      )}
      {fillPercent >= 70 && (
        <circle cx="36" cy={yTop - 1} r="4.5" className={clsx("transition-all duration-500", selected ? "fill-primary-500" : "fill-neutral-400")} />
      )}
      {fillPercent >= 90 && (
        <circle cx="31" cy={yTop - 4} r="4" className={clsx("transition-all duration-500", selected ? "fill-primary-500" : "fill-neutral-400")} />
      )}
    </svg>
  );
}

interface BasketOptionCardProps {
  option: LoadOption;
  selected: boolean;
  pricePerKg: number;
  onSelect: () => void;
}

export function BasketOptionCard({ option, selected, pricePerKg, onSelect }: BasketOptionCardProps) {
  return (
    <button
      onClick={onSelect}
      className={clsx(
        "card w-full p-4 text-left transition-all duration-200 active:scale-[0.98]",
        selected
          ? "ring-2 ring-primary-500 bg-primary-50/40"
          : "hover:shadow-card-hover",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300",
            selected ? "bg-primary-50" : "bg-neutral-50",
          )}
        >
          <LaundryBasket fillPercent={option.fillPercent} selected={selected} size={56} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-extrabold text-neutral-900">{option.kg} kg</span>
            <span className="text-sm font-semibold text-neutral-500">{option.label}</span>
          </div>
          <p className="mt-0.5 text-sm text-neutral-500">{option.description}</p>
          <p className="mt-1.5 text-sm font-bold text-primary-700">
            ₵{option.kg * pricePerKg}
          </p>
        </div>
        <div
          className={clsx(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
            selected
              ? "border-primary-600 bg-primary-600"
              : "border-neutral-300",
          )}
        >
          {selected && (
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-white">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
