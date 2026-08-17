import { useEffect, useState } from "react";

// Animated splash screen. Shows the logo + tagline, then a progress bar
// fills before navigating onward. Pure CSS animation, no heavy assets.
interface SplashScreenProps {
  onNext: () => void;
}

export function SplashScreen({ onNext }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const dur = 2200;
    let raf = 0;
    const tick = () => {
      const p = Math.min(100, ((Date.now() - start) / dur) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(onNext, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onNext]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-primary-600 via-primary-700 to-primary-900 px-6 text-white">
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-400/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-secondary-400/20 blur-3xl" />

      <div className="relative flex flex-col items-center animate-fade-in">
        <div className="flex h-24 w-24 items-center justify-center rounded-4xl bg-white shadow-2xl animate-scale-in">
          <LogoMark className="h-14 w-14 text-primary-600" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">LaundryHub</h1>
        <p className="mt-2 text-center text-primary-100 text-sm font-medium max-w-[16rem]">
          Trusted laundry services around your campus
        </p>
      </div>

      <div className="absolute bottom-12 left-0 right-0 px-12">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-center text-xs text-primary-100/80">Getting things fresh…</p>
      </div>
    </div>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <path
        d="M24 8c-4.4 0-7.5 2.6-7.5 7.6 0 2.3 1 4.2 2.3 5.6l-2.9 14.1a2.3 2.3 0 0 0 2.3 2.7h11.6a2.3 2.3 0 0 0 2.3-2.7l-2.9-14.1c1.3-1.4 2.3-3.3 2.3-5.6C31.5 10.6 28.4 8 24 8z"
        fill="currentColor"
      />
      <circle cx="24" cy="15" r="2.6" fill="#fff" />
    </svg>
  );
}
