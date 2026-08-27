import { clsx } from "clsx";

export const MAX_KG = 15;

export function getLoadLabel(kg: number): { label: string; description: string } {
  if (kg <= 3) return { label: "Small load", description: "A few daily outfits or a light basket" };
  if (kg <= 6) return { label: "Medium load", description: "Good for a typical basket of clothes" };
  if (kg <= 9) return { label: "Large load", description: "A full basket — bedding and towels too" };
  return { label: "Extra large load", description: "An overflowing basket or two loads" };
}

interface LaundryBasketProps {
  fillPercent: number;
  size?: number;
  className?: string;
}

export function LaundryBasket({ fillPercent, size = 160, className }: LaundryBasketProps) {
  const clamped = Math.max(0, Math.min(100, fillPercent));
  const fillHeight = (clamped / 100) * 40;
  const yTop = 50 - fillHeight;
  const hasBumps = clamped > 35;
  const bumpCount = clamped > 80 ? 4 : clamped > 55 ? 3 : clamped > 35 ? 2 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={clsx("transition-all duration-500 ease-out", className)}
    >
      {/* Handle */}
      <path
        d="M28 22 Q50 6 72 22"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Basket rim — oval at top */}
      <ellipse
        cx="50"
        cy="22"
        rx="28"
        ry="5"
        fill="#e2e8f0"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* Basket body — trapezoid with rounded bottom */}
      <path
        d="M22 22 L78 22 L72 78 Q72 82 68 82 L32 82 Q28 82 28 78 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* Inner shadow at rim */}
      <ellipse
        cx="50"
        cy="22"
        rx="25"
        ry="3.5"
        fill="#e2e8f0"
        opacity="0.6"
      />

      {/* Weave pattern — vertical */}
      <line x1="32" y1="26" x2="31" y2="78" stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1="42" y1="26" x2="41" y2="78" stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1="50" y1="26" x2="50" y2="78" stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1="58" y1="26" x2="59" y2="78" stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1="68" y1="26" x2="69" y2="78" stroke="#e2e8f0" strokeWidth="1.2" />

      {/* Weave pattern — horizontal */}
      <line x1="26" y1="36" x2="74" y2="36" stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1="27" y1="48" x2="73" y2="48" stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1="28" y1="60" x2="72" y2="60" stroke="#e2e8f0" strokeWidth="1.2" />
      <line x1="29" y1="72" x2="71" y2="72" stroke="#e2e8f0" strokeWidth="1.2" />

      {/* Clothes fill — clipped to basket interior */}
      <defs>
        <clipPath id="basket-clip">
          <path d="M24 24 L76 24 L71 77 Q71 80 67 80 L33 80 Q29 80 29 77 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#basket-clip)">
        {/* Main clothes mass */}
        <path
          d={`M24 ${yTop} L76 ${yTop} L72 82 L28 82 Z`}
          className="fill-primary-400 transition-all duration-500 ease-out"
        />

        {/* Clothes bumps on top — appear as fill increases */}
        {hasBumps && bumpCount >= 1 && (
          <circle
            cx="38"
            cy={yTop}
            r="7"
            className="fill-primary-400 transition-all duration-500 ease-out"
          />
        )}
        {hasBumps && bumpCount >= 2 && (
          <circle
            cx="58"
            cy={yTop - 2}
            r="8"
            className="fill-primary-500 transition-all duration-500 ease-out"
          />
        )}
        {hasBumps && bumpCount >= 3 && (
          <circle
            cx="48"
            cy={yTop - 6}
            r="7"
            className="fill-primary-500 transition-all duration-500 ease-out"
          />
        )}
        {hasBumps && bumpCount >= 4 && (
          <circle
            cx="66"
            cy={yTop - 4}
            r="6"
            className="fill-primary-600 transition-all duration-500 ease-out"
          />
        )}

        {/* Texture dots on clothes */}
        <circle cx="35" cy={yTop + 12} r="1.5" fill="#8ed8ff" opacity="0.5" />
        <circle cx="55" cy={yTop + 18} r="1.5" fill="#8ed8ff" opacity="0.5" />
        <circle cx="45" cy={yTop + 26} r="1.5" fill="#8ed8ff" opacity="0.5" />
        <circle cx="62" cy={yTop + 10} r="1.5" fill="#8ed8ff" opacity="0.5" />
      </g>

      {/* Rim highlight */}
      <ellipse
        cx="50"
        cy="20.5"
        rx="26"
        ry="3"
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="1"
        opacity="0.7"
      />
    </svg>
  );
}
