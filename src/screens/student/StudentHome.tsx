import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Bell, SlidersHorizontal, Sparkles, Truck, X, Clock3 } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { dummyLaundries } from "../../data";
import { LaundryCard } from "../../components/cards/LaundryCard";
import { SectionHeader } from "../../components/common/SectionHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { SkeletonList } from "../../components/common/LoadingSkeleton";

type FilterServiceType = "Any" | "Wash & Fold" | "Express Laundry" | "Ironing" | "Dry Cleaning";
type SortOption = "recommended" | "nearest" | "highest-rated" | "lowest-price" | "fastest-service";

// Student home dashboard — Uber/Airbnb-style marketplace landing.
export function StudentHome() {
  const navigate = useNavigate();
  const student = useAppStore((s) => s.student);
  const savedIds = useAppStore((s) => s.savedLaundryIds);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [pickupOnly, setPickupOnly] = useState(false);
  const [expressOnly, setExpressOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [serviceType, setServiceType] = useState<FilterServiceType>("Any");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: Array<{ id: string; type: "business" | "location" | "service"; label: string; value: string }> = [];

    dummyLaundries.forEach((laundry) => {
      if (laundry.name.toLowerCase().includes(q)) {
        matches.push({ id: `business-${laundry.id}`, type: "business", label: laundry.name, value: laundry.id });
      }
      if (laundry.location.toLowerCase().includes(q)) {
        matches.push({ id: `location-${laundry.location}`, type: "location", label: laundry.location, value: laundry.location });
      }
      laundry.services.forEach((service) => {
        if (service.name.toLowerCase().includes(q)) {
          matches.push({ id: `service-${service.id}`, type: "service", label: service.name, value: service.name });
        }
      });
    });

    const uniqueMatches = matches.filter((match, index, self) => self.findIndex((item) => item.id === match.id) === index);
    return uniqueMatches.slice(0, 6);
  }, [query]);

  const filteredLaundries = useMemo(() => {
    const result = dummyLaundries.filter((laundry) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [laundry.name, laundry.address, laundry.location, ...laundry.services.map((service) => service.name)].some((value) =>
          value.toLowerCase().includes(q),
        );
      const matchesCategory =
        activeCategory === "All" ||
        (activeCategory === "Wash & Fold" && laundry.services.some((service) => service.name === "Wash & Fold")) ||
        (activeCategory === "Express" && laundry.expressService) ||
        (activeCategory === "Ironing" && laundry.services.some((service) => service.name === "Ironing")) ||
        (activeCategory === "Dry Clean" && laundry.services.some((service) => service.name === "Dry Cleaning"));
      const matchesServiceType = serviceType === "Any" || laundry.services.some((service) => service.name === serviceType);
      const matchesPickup = !pickupOnly || laundry.pickupAvailable;
      const matchesExpress = !expressOnly || laundry.expressService;
      const matchesRating = laundry.rating >= minRating;
      const matchesDistance = maxDistance === null || laundry.distanceMinutes <= maxDistance;
      const matchesOpenNow = !openNowOnly || isOpenNow(laundry.openHours);
      return matchesQuery && matchesCategory && matchesServiceType && matchesPickup && matchesExpress && matchesRating && matchesDistance && matchesOpenNow;
    });

    const withPrice = result.map((laundry) => ({
      laundry,
      cheapestPrice: Math.min(...laundry.services.map((service) => service.price)),
    }));

    withPrice.sort((a, b) => {
      switch (sortBy) {
        case "nearest":
          return a.laundry.distanceMinutes - b.laundry.distanceMinutes;
        case "highest-rated":
          return b.laundry.rating - a.laundry.rating;
        case "lowest-price":
          return a.cheapestPrice - b.cheapestPrice;
        case "fastest-service":
          return parseCompletionHours(a.laundry.estimatedCompletion) - parseCompletionHours(b.laundry.estimatedCompletion);
        case "recommended":
        default:
          return b.laundry.rating - a.laundry.rating || a.laundry.distanceMinutes - b.laundry.distanceMinutes;
      }
    });

    return withPrice.map((item) => item.laundry);
  }, [activeCategory, expressOnly, maxDistance, minRating, openNowOnly, pickupOnly, query, serviceType, sortBy]);

  const savedLaundries = dummyLaundries.filter((l) => savedIds.includes(l.id));

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setPickupOnly(false);
    setExpressOnly(false);
    setMinRating(0);
    setMaxDistance(null);
    setServiceType("Any");
    setOpenNowOnly(false);
    setSortBy("recommended");
    setShowFilters(false);
  };

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (query.trim()) chips.push(query.trim());
    if (activeCategory !== "All") chips.push(activeCategory);
    if (minRating > 0) chips.push(`${minRating.toFixed(1)}+ ★`);
    if (maxDistance) chips.push(`${maxDistance} min`);
    if (serviceType !== "Any") chips.push(serviceType);
    if (pickupOnly) chips.push("Pickup");
    if (expressOnly) chips.push("Express");
    if (openNowOnly) chips.push("Open now");
    return chips;
  }, [activeCategory, expressOnly, maxDistance, minRating, openNowOnly, pickupOnly, query, serviceType]);

  return (
    <div className="pb-6">
      <div className="rounded-b-4xl bg-gradient-to-b from-primary-600 to-primary-700 px-5 pb-6 pt-12 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-100">Hello, {student.name} 👋</p>
            <div className="mt-1 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary-100" />
              <span className="text-sm font-semibold">Near you</span>
            </div>
          </div>
          <button onClick={() => navigate("/student/notifications")} className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition-transform active:scale-95" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent-400 ring-2 ring-primary-700" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full rounded-2xl border-0 bg-white py-3.5 pl-11 pr-10 text-neutral-900 placeholder:text-neutral-400 shadow-card outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="Search laundries near you"
            />
            {query && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-100" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => {
                      if (suggestion.type === "business") {
                        navigate(`/student/laundry/${suggestion.value}`);
                        return;
                      }
                      setQuery(suggestion.value);
                      setShowSuggestions(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    <span className="flex items-center gap-2">
                      {suggestion.type === "business" ? <Sparkles className="h-4 w-4 text-primary-600" /> : suggestion.type === "location" ? <MapPin className="h-4 w-4 text-secondary-600" /> : <Clock3 className="h-4 w-4 text-accent-600" />}
                      <span>{suggestion.label}</span>
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">{suggestion.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={() => setShowFilters(true)} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition-transform active:scale-95" aria-label="Filters">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <span key={chip} className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white/90">
                {chip}
              </span>
            ))}
            <button type="button" onClick={clearFilters} className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white/90">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Express promo banner */}
      <div className="px-5 mt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-400 to-accent-500 p-4 shadow-card">
          <div className="relative z-10 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/25 backdrop-blur">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-white">Express service in 6 hours</p>
              <p className="text-xs text-white/85 mt-0.5">Need it fast? Get priority turnaround.</p>
            </div>
            <button
              onClick={() => setActiveCategory("Express")}
              className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-accent-600 active:scale-95 transition-transform"
            >
              Explore
            </button>
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-8 h-16 w-16 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {categories.map((category) => (
          <button key={category} onClick={() => setActiveCategory(category)} className={`chip whitespace-nowrap ${activeCategory === category ? "bg-primary-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"}`}>
            {category}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2 px-5">
        <button onClick={() => setPickupOnly((value) => !value)} className={`chip ${pickupOnly ? "bg-secondary-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"}`}><Truck className="h-3.5 w-3.5" /> Pickup available</button>
        <button onClick={() => setExpressOnly((value) => !value)} className={`chip ${expressOnly ? "bg-accent-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"}`}><Sparkles className="h-3.5 w-3.5" /> Express service</button>
      </div>

      <div className="mt-6 space-y-3 px-5">
        <SectionHeader title="Nearby Laundries" action={`${filteredLaundries.length} results`} />
        {loading ? <SkeletonList count={3} /> : filteredLaundries.length > 0 ? (
          <div className="space-y-4">
            {filteredLaundries.map((laundry) => (
              <LaundryCard key={laundry.id} laundry={laundry} onViewDetails={() => navigate(`/student/laundry/${laundry.id}`)} />
            ))}
          </div>
        ) : (
          <EmptyState icon={<Search className="h-6 w-6" />} title="No matching laundries" description="Try a broader search or clear some filters to reveal more options." actionLabel="Reset filters" onAction={() => { clearSearch(); clearFilters(); }} />
        )}
      </div>

      {savedLaundries.length > 0 && (
        <div className="mt-8 space-y-3 px-5">
          <SectionHeader title="Saved Laundries" />
          <div className="space-y-4">
            {savedLaundries.map((laundry) => (
              <LaundryCard key={laundry.id} laundry={laundry} onViewDetails={() => navigate(`/student/laundry/${laundry.id}`)} />
            ))}
          </div>
        </div>
      )}

      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">Filters</p>
                <h2 className="mt-2 font-display text-xl font-semibold text-neutral-900">Refine your search</h2>
              </div>
              <button type="button" onClick={() => setShowFilters(false)} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-semibold text-neutral-700">Minimum rating</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[0, 4.5, 4.7, 4.8].map((value) => (
                    <button key={value} type="button" onClick={() => setMinRating(value)} className={`rounded-2xl px-3 py-2 text-sm font-semibold ${minRating === value ? "bg-primary-600 text-white" : "border border-neutral-200 bg-neutral-50 text-neutral-700"}`}>
                      {value === 0 ? "Any" : `${value}+ ★`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-neutral-700">Maximum distance</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[null, 5, 10, 15].map((value) => (
                    <button key={value ?? "any"} type="button" onClick={() => setMaxDistance(value)} className={`rounded-2xl px-3 py-2 text-sm font-semibold ${maxDistance === value ? "bg-primary-600 text-white" : "border border-neutral-200 bg-neutral-50 text-neutral-700"}`}>
                      {value === null ? "Any" : `${value} mins`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-neutral-700">Service type</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["Any", "Wash & Fold", "Express Laundry", "Ironing", "Dry Cleaning"] as FilterServiceType[]).map((value) => (
                    <button key={value} type="button" onClick={() => setServiceType(value)} className={`rounded-2xl px-3 py-2 text-sm font-semibold ${serviceType === value ? "bg-primary-600 text-white" : "border border-neutral-200 bg-neutral-50 text-neutral-700"}`}>
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-neutral-700">Other options</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setPickupOnly((value) => !value)} className={`chip ${pickupOnly ? "bg-secondary-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"}`}><Truck className="h-3.5 w-3.5" /> Pickup</button>
                  <button type="button" onClick={() => setExpressOnly((value) => !value)} className={`chip ${expressOnly ? "bg-accent-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"}`}><Sparkles className="h-3.5 w-3.5" /> Express</button>
                  <button type="button" onClick={() => setOpenNowOnly((value) => !value)} className={`chip ${openNowOnly ? "bg-primary-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"}`}><Clock3 className="h-3.5 w-3.5" /> Open now</button>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-neutral-700">Sort by</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {[
                    { value: "recommended", label: "Recommended" },
                    { value: "nearest", label: "Nearest" },
                    { value: "highest-rated", label: "Highest rated" },
                    { value: "lowest-price", label: "Lowest price" },
                    { value: "fastest-service", label: "Fastest service" },
                  ].map((option) => (
                    <button key={option.value} type="button" onClick={() => setSortBy(option.value as SortOption)} className={`rounded-2xl border px-3 py-2 text-left text-sm font-semibold ${sortBy === option.value ? "border-primary-600 bg-primary-50 text-primary-700" : "border-neutral-200 bg-white text-neutral-700"}`}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button type="button" onClick={clearFilters} className="btn-secondary flex-1 justify-center">Clear all</button>
              <button type="button" onClick={() => setShowFilters(false)} className="btn-primary flex-1 justify-center">Apply filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const categories = ["All", "Wash & Fold", "Express", "Ironing", "Dry Clean"];

function parseCompletionHours(value: string) {
  const match = value.match(/(\d+)/);
  if (!match) return 999;
  return Number(match[1]);
}

function isOpenNow(openHours: string) {
  const now = new Date();
  const startMatch = openHours.match(/(\d{1,2})(am|pm)/i);
  const endMatch = openHours.match(/(\d{1,2})(am|pm)\s*$/i);
  if (!startMatch || !endMatch) return true;

  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHours * 60 + currentMinutes;

  const toMinutes = (value: string, meridiem: string) => {
    const hour = Number(value);
    const base = meridiem.toLowerCase() === "pm" && hour !== 12 ? hour + 12 : hour;
    return base * 60;
  };

  const start = toMinutes(startMatch[1], startMatch[2]);
  const end = toMinutes(endMatch[1], endMatch[2]);
  return currentTime >= start && currentTime <= end;
}
