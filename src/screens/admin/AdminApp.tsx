import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, Store, CircleAlert as AlertCircle, CreditCard, ChartBar as BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { AdminOverview } from "./AdminOverview";
import { AdminOrders } from "./AdminOrders";
import { AdminCustomers } from "./AdminCustomers";
import { AdminPartners } from "./AdminPartners";
import { AdminIssues } from "./AdminIssues";
import { AdminSubscriptions } from "./AdminSubscriptions";
import { AdminReports } from "./AdminReports";
import { AdminSettings } from "./AdminSettings";
import { clsx } from "clsx";

export type AdminSection =
  | "overview"
  | "orders"
  | "customers"
  | "partners"
  | "issues"
  | "subscriptions"
  | "reports"
  | "settings";

const navItems: { key: AdminSection; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
  { key: "orders", label: "Orders", icon: <Package className="h-5 w-5" /> },
  { key: "customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
  { key: "partners", label: "Laundry Partners", icon: <Store className="h-5 w-5" /> },
  { key: "issues", label: "Issues", icon: <AlertCircle className="h-5 w-5" /> },
  { key: "subscriptions", label: "Subscriptions", icon: <CreditCard className="h-5 w-5" /> },
  { key: "reports", label: "Reports", icon: <BarChart3 className="h-5 w-5" /> },
  { key: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

export function AdminApp() {
  const navigate = useNavigate();
  const logout = useAppStore((s) => s.logout);
  const [section, setSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderSection = () => {
    switch (section) {
      case "overview": return <AdminOverview onNavigate={setSection} />;
      case "orders": return <AdminOrders />;
      case "customers": return <AdminCustomers />;
      case "partners": return <AdminPartners />;
      case "issues": return <AdminIssues />;
      case "subscriptions": return <AdminSubscriptions />;
      case "reports": return <AdminReports />;
      case "settings": return <AdminSettings />;
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-neutral-200 bg-white">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-neutral-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6">
              <path d="M24 8c-4.4 0-7.5 2.6-7.5 7.6 0 2.3 1 4.2 2.3 5.6l-2.9 14.1a2.3 2.3 0 0 0 2.3 2.7h11.6a2.3 2.3 0 0 0 2.3-2.7l-2.9-14.1c1.3-1.4 2.3-3.3 2.3-5.6C31.5 10.6 28.4 8 24 8z" fill="currentColor" />
              <circle cx="24" cy="15" r="2.6" fill="#fff" />
            </svg>
          </div>
          <div>
            <p className="font-display text-sm font-extrabold text-neutral-900">Laundex</p>
            <p className="text-[11px] text-neutral-400">Super Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={clsx(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                section === item.key
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-neutral-100">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-error-600 hover:bg-error-50 transition-all">
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
                  <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6">
                    <path d="M24 8c-4.4 0-7.5 2.6-7.5 7.6 0 2.3 1 4.2 2.3 5.6l-2.9 14.1a2.3 2.3 0 0 0 2.3 2.7h11.6a2.3 2.3 0 0 0 2.3-2.7l-2.9-14.1c1.3-1.4 2.3-3.3 2.3-5.6C31.5 10.6 28.4 8 24 8z" fill="currentColor" />
                    <circle cx="24" cy="15" r="2.6" fill="#fff" />
                  </svg>
                </div>
                <div>
                  <p className="font-display text-sm font-extrabold text-neutral-900">Laundex</p>
                  <p className="text-[11px] text-neutral-400">Super Admin</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-neutral-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { setSection(item.key); setSidebarOpen(false); }}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                    section === item.key
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-500 hover:bg-neutral-50",
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-neutral-100">
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-error-600 hover:bg-error-50 transition-all">
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="text-neutral-600">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display font-bold text-neutral-900">
            {navItems.find((n) => n.key === section)?.label}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
