import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAppStore } from "./store/appStore";
import { SplashScreen } from "./screens/shared/SplashScreen";
import { OnboardingScreen } from "./screens/shared/OnboardingScreen";
import { AuthScreen } from "./screens/shared/AuthScreen";
import { ModeSelectScreen } from "./screens/shared/ModeSelectScreen";
import { StudentApp } from "./screens/student/StudentApp";
import { PartnerApp } from "./screens/partner/PartnerApp";
import { AdminApp } from "./screens/admin/AdminApp";

// Top-level router. Entry flow: splash → onboarding → mode select → auth → app.
// Auth is simulated — any input logs in.

function RootRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthed = useAppStore((s) => s.isAuthed);
  const mode = useAppStore((s) => s.mode);

  // Scroll to top on every navigation for a native-app feel.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<SplashScreen onNext={() => navigate("/onboarding")} />} />
      <Route
        path="/onboarding"
        element={
          <OnboardingScreen
            onGetStarted={() => navigate("/mode")}
            onLogin={() => navigate("/auth/student")}
          />
        }
      />
      <Route
        path="/mode"
        element={
          <ModeSelectScreen
            onSelectStudent={() => navigate("/auth/student")}
            onSelectPartner={() => navigate("/auth/partner")}
            onSelectAdmin={() => navigate("/auth/admin")}
          />
        }
      />
      <Route
        path="/auth/:mode"
        element={<AuthScreen onAuthed={() => navigate(mode === "partner" ? "/partner" : mode === "admin" ? "/admin" : "/student")} />}
      />
      <Route
        path="/student/*"
        element={isAuthed ? <StudentApp /> : <Navigate to="/auth/student" replace />}
      />
      <Route
        path="/partner/*"
        element={isAuthed ? <PartnerApp /> : <Navigate to="/auth/partner" replace />}
      />
      <Route
        path="/admin/*"
        element={isAuthed ? <AdminApp /> : <Navigate to="/auth/admin" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="phone-frame screen-enter">
        <RootRouter />
      </div>
    </BrowserRouter>
  );
}
