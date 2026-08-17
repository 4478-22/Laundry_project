import { useNavigate } from "react-router-dom";
import { BadgeCheck, MapPin, Clock, LogOut, Settings, ChevronRight, Wallet2, BarChart3 } from "lucide-react";
import { dummyLaundries } from "../../data";
import { RatingStars } from "../../components/common/RatingStars";
import { useAppStore } from "../../store/appStore";

// Partner business profile — business info, services, opening hours, reviews.
export function PartnerProfile() {
  const navigate = useNavigate();
  const laundry = dummyLaundries[0]; // CleanPro Laundry
  const logout = useAppStore((s) => s.logout);
  const services = useAppStore((s) => s.businessSettings.services);

  return (
    <div className="pb-6">
      <div className="relative h-44 w-full overflow-hidden sm:h-56">
        <img src={laundry.imageUrl} alt={laundry.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-[2rem] border border-neutral-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-extrabold text-neutral-900">{laundry.name}</h1>
            {laundry.verified && <BadgeCheck className="h-5 w-5 text-primary-600" />}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-neutral-500">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{laundry.address}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={laundry.rating} size={16} />
            <span className="text-sm font-bold text-neutral-700">{laundry.rating}</span>
            <span className="text-xs text-neutral-400">({laundry.reviewsCount} reviews)</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoTile icon={<Clock className="h-4 w-4" />} label="Open hours" value={laundry.openHours} />
            <InfoTile icon={<MapPin className="h-4 w-4" />} label="Location" value={laundry.location} />
          </div>
        </div>
      </div>

      {/* Services summary */}
      <div className="px-5 mt-6">
        <h2 className="font-display text-sm font-bold text-neutral-700 mb-3">Services & Prices</h2>
        <div className="card divide-y divide-neutral-100">
          {services.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-neutral-900">{s.name}</p>
                  <span className={(s.available ?? true) ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700" : "rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600"}>
                    {(s.available ?? true) ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">{s.duration}</p>
              </div>
              <span className="shrink-0 font-display font-extrabold text-primary-700">₵{s.price}/{s.unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="px-5 mt-6">
        <h2 className="font-display text-sm font-bold text-neutral-700 mb-3">Recent Reviews</h2>
        <div className="space-y-3">
          {laundry.reviews.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center gap-3">
                <img src={r.authorAvatar} alt={r.authorName} className="h-9 w-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 text-sm truncate">{r.authorName}</p>
                  <RatingStars rating={r.rating} size={12} />
                </div>
                <span className="text-xs text-neutral-400">{r.date}</span>
              </div>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mt-6">
        <div className="card divide-y divide-neutral-100">
          <MenuRow onClick={() => navigate("/partner/settings")} icon={<Settings className="h-4 w-4" />} label="Business Settings" />
          <MenuRow onClick={() => navigate("/partner/wallet")} icon={<Wallet2 className="h-4 w-4" />} label="Wallet" />
          <MenuRow onClick={() => navigate("/partner/analytics")} icon={<BarChart3 className="h-4 w-4" />} label="Analytics" />
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex w-full items-center gap-3 p-4 text-left active:bg-error-50 transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-error-50 text-error-600">
              <LogOut className="h-4 w-4" />
            </span>
            <span className="font-semibold text-error-600">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-3">
      <div className="flex items-center gap-1.5 text-neutral-400">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-neutral-800">{value}</p>
    </div>
  );
}

function MenuRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 p-4 text-left active:bg-neutral-50 transition-colors">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">{icon}</span>
      <span className="flex-1 font-semibold text-neutral-700">{label}</span>
      <ChevronRight className="h-5 w-5 text-neutral-300" />
    </button>
  );
}
