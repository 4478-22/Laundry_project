import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone, Mail, GraduationCap, Home, Gift, Heart, ChevronRight, LogOut, Settings, HelpCircle,
} from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { dummyLaundries } from "../../data";
import { SkeletonProfile } from "../../components/common/LoadingSkeleton";

// Student profile tab — personal info, stats, saved laundries, rewards, menu.
export function StudentProfile() {
  const navigate = useNavigate();
  const student = useAppStore((s) => s.student);
  const bookings = useAppStore((s) => s.bookings);
  const savedIds = useAppStore((s) => s.savedLaundryIds);
  const logout = useAppStore((s) => s.logout);
  const expireStudentPoints = useAppStore((s) => s.expireStudentPoints);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const savedLaundries = dummyLaundries.filter((l) => savedIds.includes(l.id));
  const completedOrders = bookings.filter((b) => b.status === "Completed").length;

  useEffect(() => {
    expireStudentPoints();
  }, [expireStudentPoints]);

  const rewardExpiryWindow = 90;
  const lastCompletedAt = student.lastCompletedBookingAt ? new Date(student.lastCompletedBookingAt) : null;
  const daysSinceLastCompleted = lastCompletedAt
    ? Math.floor((Date.now() - lastCompletedAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const isExpired = lastCompletedAt ? daysSinceLastCompleted >= rewardExpiryWindow : false;
  const daysUntilExpiry = lastCompletedAt ? Math.max(0, rewardExpiryWindow - daysSinceLastCompleted) : null;
  const displayPoints = isExpired ? 0 : student.rewardsPoints;
  const rewardsStatusMessage = isExpired
    ? "Your Laundry Points expired because your account was inactive for 90 days."
    : lastCompletedAt
      ? `Points expire in ${daysUntilExpiry} days. Complete a booking to keep them active.`
      : "Complete a booking to keep your points active.";
  const rewardsStatusClass = isExpired ? "text-secondary-100" : "text-white/85";

  if (loading) {
    return <SkeletonProfile />;
  }

  return (
    <div className="pb-6">
      <div className="rounded-b-4xl bg-gradient-to-b from-primary-600 to-primary-700 px-5 pb-8 pt-12 text-white">
        <div className="flex items-center gap-4">
          <img src={student.avatarUrl} alt={student.name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/30" />
          <div>
            <h1 className="font-display text-xl font-extrabold">{student.name}</h1>
            <p className="text-sm text-primary-100">{student.email}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat value={bookings.length} label="Orders" />
          <Stat value={savedLaundries.length} label="Saved" />
          <Stat value={displayPoints} label="Points" />
        </div>
      </div>

      <div className="mt-6 px-5">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 bg-gradient-to-r from-accent-500 to-accent-600 p-4 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20"><Gift className="h-6 w-6" /></span>
            <div>
              <p className="font-display font-bold">LaundryHub Rewards</p>
              <p className="text-sm text-white/80">{displayPoints} points · ₵{Math.floor(displayPoints / 10)} off next order</p>
            </div>
          </div>
          <div className="p-4">
            <p className={`text-sm ${rewardsStatusClass}`}>{rewardsStatusMessage}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="rounded-2xl bg-neutral-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Referral code</p>
              <p className="mt-1 font-display text-lg font-bold text-neutral-900">LAUNDRY{student.rewardsPoints}</p>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Completed orders</p>
              <p className="mt-1 font-display text-lg font-bold text-neutral-900">{completedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 px-5">
        <h2 className="mb-3 font-display text-sm font-bold text-neutral-700">Personal Information</h2>
        <div className="card divide-y divide-neutral-100">
          <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={student.phone} />
          <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={student.email} />
          <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="University" value={student.university} />
          <InfoRow icon={<Home className="h-4 w-4" />} label="Hostel" value={student.hostel} />
        </div>
      </div>

      <div className="mt-6 px-5">
        <h2 className="mb-3 font-display text-sm font-bold text-neutral-700">Saved Laundries</h2>
        {savedLaundries.length > 0 ? (
          <div className="space-y-3">
            {savedLaundries.map((l) => (
              <button key={l.id} onClick={() => navigate(`/student/laundry/${l.id}`)} className="card flex w-full items-center gap-3 p-3 text-left transition-transform active:scale-[0.99]">
                <img src={l.imageUrl} alt={l.name} className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-neutral-900">{l.name}</p>
                  <p className="truncate text-sm text-neutral-500">{l.address}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-300" />
              </button>
            ))}
          </div>
        ) : (
          <div className="card flex items-center gap-3 p-5 text-neutral-500">
            <Heart className="h-5 w-5" />
            <p className="text-sm">No saved laundries yet.</p>
          </div>
        )}
      </div>

      <div className="mt-6 px-5">
        <div className="card divide-y divide-neutral-100">
          <MenuRow onClick={() => navigate("/student/settings")} icon={<Settings className="h-4 w-4" />} label="Settings" />
          <MenuRow onClick={() => navigate("/student/help")} icon={<HelpCircle className="h-4 w-4" />} label="Help & Support" />
          <button onClick={() => { logout(); navigate("/"); }} className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-error-50">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-error-50 text-error-600"><LogOut className="h-4 w-4" /></span>
            <span className="font-semibold text-error-600">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white/15 px-2 py-3 text-center backdrop-blur">
      <p className="font-display text-xl font-extrabold">{value}</p>
      <p className="text-xs text-primary-100">{label}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-600">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-neutral-400">{label}</p>
        <p className="truncate text-sm font-semibold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}

function MenuRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-neutral-50">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">{icon}</span>
      <span className="flex-1 font-semibold text-neutral-700">{label}</span>
      <ChevronRight className="h-5 w-5 text-neutral-300" />
    </button>
  );
}
