import { clsx } from "clsx";
import { Home, CalendarClock, Bell, User, LayoutDashboard, Package, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

// Bottom navigation bar. Two configs — student and partner — matching the
// requested tab sets.

export interface NavTab {
  key: string;
  label: string;
  icon: ReactNode;
}

const studentTabs: NavTab[] = [
  { key: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
  { key: "bookings", label: "Bookings", icon: <CalendarClock className="h-5 w-5" /> },
  { key: "notifications", label: "Alerts", icon: <Bell className="h-5 w-5" /> },
  { key: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
];

const partnerTabs: NavTab[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { key: "orders", label: "Orders", icon: <Package className="h-5 w-5" /> },
  { key: "services", label: "Services", icon: <Sparkles className="h-5 w-5" /> },
  { key: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
];

interface BottomNavProps {
  mode: "student" | "partner";
  active: string;
  onChange: (key: string) => void;
}

export function BottomNav({ mode, active, onChange }: BottomNavProps) {
  const tabs = mode === "student" ? studentTabs : partnerTabs;
  return (
    <nav className="sticky bottom-0 z-30 border-t border-neutral-100 bg-white/95 backdrop-blur-md px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className="relative flex flex-1 flex-col items-center gap-1 py-1.5 active:scale-95 transition-transform"
            >
              <span
                className={clsx(
                  "flex h-9 w-12 items-center justify-center rounded-2xl transition-all",
                  isActive ? "bg-primary-50 text-primary-600" : "text-neutral-400",
                )}
              >
                {tab.icon}
              </span>
              <span
                className={clsx(
                  "text-[11px] font-semibold transition-colors",
                  isActive ? "text-primary-600" : "text-neutral-400",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
