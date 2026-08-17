import { useState } from "react";
import { MapPin, CalendarCheck, Activity, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

// 3-slide onboarding carousel. Swipeable via dots + next button,
// with Get Started / Login CTAs on the final slide.
interface OnboardingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

interface Slide {
  icon: ReactNode;
  title: string;
  description: string;
  accent: string;
}

const slides: Slide[] = [
  {
    icon: <MapPin className="h-12 w-12" />,
    title: "Find nearby laundries",
    description: "Discover trusted laundry businesses around UPSA.",
    accent: "from-primary-500 to-primary-700",
  },
  {
    icon: <CalendarCheck className="h-12 w-12" />,
    title: "Book in minutes",
    description: "Choose services, schedule pickup, and relax.",
    accent: "from-secondary-500 to-secondary-700",
  },
  {
    icon: <Activity className="h-12 w-12" />,
    title: "Track your laundry",
    description: "Know exactly when your clothes are ready.",
    accent: "from-accent-500 to-accent-700",
  },
];

export function OnboardingScreen({ onGetStarted, onLogin }: OnboardingScreenProps) {
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <div className="flex items-center justify-end px-5 pt-5">
        {!isLast && (
          <button
            onClick={onLogin}
            className="text-sm font-semibold text-neutral-500 active:scale-95 transition-transform"
          >
            Skip
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div
          key={index}
          className={`flex h-28 w-28 items-center justify-center rounded-4xl bg-gradient-to-br ${slides[index].accent} text-white shadow-2xl animate-scale-in`}
        >
          {slides[index].icon}
        </div>
        <h2 className="mt-10 text-center font-display text-2xl font-extrabold text-neutral-900 animate-slide-up">
          {slides[index].title}
        </h2>
        <p className="mt-3 max-w-xs text-center text-neutral-500 leading-relaxed animate-slide-up">
          {slides[index].description}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 pb-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-7 bg-primary-600" : "w-2 bg-neutral-300"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="px-6 pb-10 pt-4 space-y-3">
        {isLast ? (
          <>
            <button onClick={onGetStarted} className="btn-primary w-full">
              Get Started <ChevronRight className="h-5 w-5" />
            </button>
            <button onClick={onLogin} className="btn-secondary w-full">
              Login
            </button>
          </>
        ) : (
          <button onClick={() => setIndex((i) => i + 1)} className="btn-primary w-full">
            Next <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
