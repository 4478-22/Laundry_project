import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, MapPin, Clock, Star, Heart, ChevronLeft } from "lucide-react";
import { dummyLaundries } from "../../data";
import { RatingStars } from "../../components/common/RatingStars";
import { useAppStore } from "../../store/appStore";
import { clsx } from "clsx";

// Laundry details page — hero image, business info, services list, reviews.
export function LaundryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const laundry = dummyLaundries.find((l) => l.id === id);
  const savedIds = useAppStore((s) => s.savedLaundryIds);

  if (!laundry) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-neutral-500">This laundry could not be found.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Go back</button>
      </div>
    );
  }

  const isSaved = savedIds.includes(laundry.id);

  return (
    <div className="min-h-screen bg-neutral-50 pb-28">
      <div className="relative h-56 w-full overflow-hidden sm:h-64">
        <img src={laundry.imageUrl} alt={laundry.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-12 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-card transition-transform active:scale-95"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5 text-neutral-800" />
        </button>
        <button
          onClick={() => useAppStore.getState().toggleSaved(laundry.id)}
          className="absolute right-4 top-12 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-card transition-transform active:scale-95"
          aria-label="Save"
        >
          <Heart className={clsx("h-5 w-5", isSaved ? "fill-error-500 text-error-500" : "text-neutral-700")} />
        </button>
      </div>

      <div className="rounded-t-[2rem] bg-neutral-50 px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-extrabold text-neutral-900 truncate">{laundry.name}</h1>
              {laundry.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-primary-600" />}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{laundry.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-secondary-50 px-2.5 py-1.5">
            <Star className="h-4 w-4 fill-secondary-500 text-secondary-500" />
            <span className="font-bold text-secondary-700">{laundry.rating}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <RatingStars rating={laundry.rating} size={16} />
          <span className="text-xs text-neutral-400">{laundry.reviewsCount} reviews</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoTile icon={<Clock className="h-4 w-4" />} label="Open hours" value={laundry.openHours} />
          <InfoTile icon={<MapPin className="h-4 w-4" />} label="Distance" value={`${laundry.distanceMinutes} min away`} />
        </div>

        {/* Services */}
        <h2 className="mt-7 font-display text-lg font-bold text-neutral-900">Services & Prices</h2>
        <div className="mt-3 space-y-3">
          {laundry.services.map((s) => (
            <div key={s.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-neutral-900">{s.name}</h3>
                  <p className="mt-0.5 text-sm text-neutral-500">{s.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {s.duration}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-lg font-extrabold text-primary-700">
                    ₵{s.price}
                  </p>
                  <p className="text-xs text-neutral-400">per {s.unit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <h2 className="mt-7 font-display text-lg font-bold text-neutral-900">Reviews</h2>
        <div className="mt-3 space-y-3">
          {laundry.reviews.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center gap-3">
                <img src={r.authorAvatar} alt={r.authorName} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">{r.authorName}</p>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={r.rating} size={12} />
                    <span className="text-xs text-neutral-400">{r.date}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white/95 backdrop-blur border-t border-neutral-100 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => navigate(`/student/book/${laundry.id}`)}
          className="btn-primary w-full"
        >
          Book Service
        </button>
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-3.5">
      <div className="flex items-center gap-1.5 text-neutral-400">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-neutral-800">{value}</p>
    </div>
  );
}
