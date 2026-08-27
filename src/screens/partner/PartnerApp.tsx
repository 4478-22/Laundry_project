import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "../../components/navigation/BottomNav";
import { PartnerDashboard } from "./PartnerDashboard";
import { IncomingOrders } from "./IncomingOrders";
import { OrderManagement } from "./OrderManagement";
import { PartnerServices } from "./PartnerServices";
import { PartnerProfile } from "./PartnerProfile";
import { Wallet } from "./Wallet";
import { PartnerAnalytics } from "./PartnerAnalytics";
import { BusinessSettings } from "../shared/BusinessSettings";
import { useAppStore } from "../../store/appStore";

// Partner app shell — mirrors StudentApp structure with partner routes.
export function PartnerApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useAppStore((s) => s.notifications.filter((n) => n.unread && n.forMode === "partner").length);

  const segment = location.pathname.replace("/partner/", "").split("/")[0];
  const activeTab = ["dashboard", "orders", "services", "profile"].includes(segment)
    ? segment
    : "dashboard";

  const hideNav = ["manage", "wallet", "analytics", "settings"].includes(segment);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <div className="flex-1 pb-24">
        <Routes>
          <Route index element={<PartnerDashboard />} />
          <Route path="orders" element={<IncomingOrders />} />
          <Route path="services" element={<PartnerServices />} />
          <Route path="profile" element={<PartnerProfile />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="analytics" element={<PartnerAnalytics />} />
          <Route path="settings" element={<BusinessSettings />} />
          <Route path="manage/:id" element={<OrderManagement />} />
        </Routes>
      </div>
      {!hideNav && (
        <BottomNav
          mode="partner"
          active={activeTab}
          unreadCount={unreadCount}
          onChange={(k) => navigate(k === "dashboard" ? "/partner" : `/partner/${k}`)}
        />
      )}
    </div>
  );
}
