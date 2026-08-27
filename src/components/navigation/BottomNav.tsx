import { clsx } from "clsx";
import { Hop as Home, CalendarClock, Bell, User, LayoutDashboard, Package, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

// Bottom navigation bar. Two configs — customer and partner — matching the
// requested tab sets. Constrained to the phone-frame width so it never
// stretches across the full desktop viewport.

export interface NavTab {
  key: string;
  label: string;
  icon: ReactNode;
}

const customerTabs: NavTab[] = [
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
  mode: "customer" | "partner";
  active: string;
  onChange: (key: string) => void;
  unreadCount?: number;
}

export function BottomNav({ mode, active, onChange, unreadCount = 0 }: BottomNavProps) {
  const tabs = mode === "customer" ? customerTabs : partnerTabs;
  return (
    <nav className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 flex justify-center pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-auto w-full max-w-[440px] border-t border-neutral-100 bg-white/95 backdrop-blur-md px-3 py-2 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = tab.key === active;
            const showBadge = tab.key === "notifications" && unreadCount > 0;
            return (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className="group relative flex flex-1 flex-col items-center gap-1 py-1 active:scale-90 transition-transform duration-200"
              >
                <span className="relative">
                  <span
                    className={clsx(
                      "flex h-9 w-12 items-center justify-center rounded-2xl transition-all duration-300",
                      isActive
                        ? "bg-primary-50 text-primary-600 scale-105"
                        : "text-neutral-400 group-active:text-neutral-600",
                    )}
                  >
                    {tab.icon}
                  </span>
                  {showBadge && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
                <span
                  className={clsx(
                    "text-[11px] font-semibold transition-colors duration-300",
                    isActive ? "text-primary-600" : "text-neutral-400 group-active:text-neutral-600",
                  )}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 h-1 w-6 rounded-full bg-primary-500 transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
