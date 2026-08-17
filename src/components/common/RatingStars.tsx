import { Star } from "lucide-react";
import { clsx } from "clsx";

// Reusable star rating display. Renders full/half/empty stars.
interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

export function RatingStars({ rating, size = 14, className }: RatingStarsProps) {
  return (
    <div className={clsx("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-neutral-200" />
            {fill > 0 && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} className="fill-accent-400 text-accent-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
