import { Star, BadgeCheck, MapPin, Clock } from "lucide-react";
import { clsx } from "clsx";
import type { Laundry } from "../../models";
import { RatingStars } from "../common/RatingStars";

// The marketplace laundry card shown on the customer home screen.
// Mirrors an Airbnb-style listing card.

interface LaundryCardProps {
  laundry: Laundry;
  onViewDetails: () => void;
}

export function LaundryCard({ laundry, onViewDetails }: LaundryCardProps) {
  return (
    <button
      onClick={onViewDetails}
      className="card w-full overflow-hidden text-left transition-all hover:shadow-card-hover active:scale-[0.99] animate-slide-up"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={laundry.imageUrl}
          alt={laundry.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {laundry.verified && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary-700 shadow-card backdrop-blur">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-neutral-900/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          <Clock className="h-3.5 w-3.5" />
          {laundry.estimatedCompletion}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold text-neutral-900 truncate">
              {laundry.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1 text-sm text-neutral-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{laundry.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-secondary-50 px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-secondary-500 text-secondary-500" />
            <span className="text-sm font-bold text-secondary-700">{laundry.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars rating={laundry.rating} />
          <span className="text-xs text-neutral-400">({laundry.reviewsCount} reviews)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {laundry.services.slice(0, 2).map((s) => (
              <span
                key={s.id}
                className={clsx("chip bg-primary-50 text-primary-700")}
              >
                {s.name}
              </span>
            ))}
            {laundry.services.length > 2 && (
              <span className="chip bg-neutral-100 text-neutral-500">
                +{laundry.services.length - 2}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-neutral-700">
            {laundry.distanceMinutes} min away
          </span>
        </div>

        <span className="block w-full rounded-2xl bg-primary-50 py-2.5 text-center text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100">
          View Details
        </span>
      </div>
    </button>
  );
}
