import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "../../components/navigation/BottomNav";
import { StudentHome } from "./StudentHome";
import { StudentBookings } from "./StudentBookings";
import { StudentNotifications } from "./StudentNotifications";
import { StudentProfile } from "./StudentProfile";
import { LaundryDetails } from "./LaundryDetails";
import { BookingFlow } from "./BookingFlow";
import { BookingConfirmation } from "./BookingConfirmation";
import { OrderTracking } from "./OrderTracking";
import { SettingsScreen } from "../shared/SettingsScreen";
import { SupportCenter } from "../shared/SupportCenter";
import { useAppStore } from "../../store/appStore";

// Student app shell. Owns nested routes for all student screens and the
// bottom navigation. The active tab is derived from the current path.
export function StudentApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useAppStore((s) => s.notifications.filter((n) => n.unread && n.forMode === "student").length);

  // Derive active tab from the first path segment under /student.
  const segment = location.pathname.replace("/student/", "").split("/")[0];
  const activeTab = ["home", "bookings", "notifications", "profile"].includes(segment)
    ? segment
    : "home";

  // Hide bottom nav on full-screen flows (booking, confirmation, tracking, details, profile settings/help).
  const hideNav = ["laundry", "book", "confirm", "track", "settings", "help"].includes(segment);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <div className="flex-1 pb-24">
        <Routes>
          <Route index element={<StudentHome />} />
          <Route path="bookings" element={<StudentBookings />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<SettingsScreen />} />
          <Route path="help" element={<SupportCenter />} />
          <Route path="laundry/:id" element={<LaundryDetails />} />
          <Route path="book/:laundryId" element={<BookingFlow />} />
          <Route path="confirm/:bookingId" element={<BookingConfirmation />} />
          <Route path="track/:bookingId" element={<OrderTracking />} />
        </Routes>
      </div>
      {!hideNav && (
        <BottomNav
          mode="student"
          active={activeTab}
          unreadCount={unreadCount}
          onChange={(k) => navigate(k === "home" ? "/student" : `/student/${k}`)}
        />
      )}
    </div>
  );
}
