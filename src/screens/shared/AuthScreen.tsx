import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "../../store/appStore";

// Simple auth screen. Toggles between Login and Create Account.
// Field set adapts slightly: partner uses business phone; student uses phone + email.
// Auth is simulated — any submit logs in.
interface AuthScreenProps {
  onAuthed: () => void;
}

export function AuthScreen({ onAuthed }: AuthScreenProps) {
  const { mode } = useParams();
  const navigate = useNavigate();
  const isPartner = mode === "partner";
  const login = useAppStore((s) => s.login);
  const setMode = useAppStore((s) => s.setMode);

  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const submit = () => {
    setMode(isPartner ? "partner" : "student");
    login();
    onAuthed();
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 px-6 pt-14 pb-10">
      <button
        onClick={() => navigate("/mode")}
        className="self-start text-sm font-semibold text-neutral-500 active:scale-95 transition-transform"
      >
        ← Back
      </button>

      <div className="mt-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
          <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9">
            <path d="M24 8c-4.4 0-7.5 2.6-7.5 7.6 0 2.3 1 4.2 2.3 5.6l-2.9 14.1a2.3 2.3 0 0 0 2.3 2.7h11.6a2.3 2.3 0 0 0 2.3-2.7l-2.9-14.1c1.3-1.4 2.3-3.3 2.3-5.6C31.5 10.6 28.4 8 24 8z" fill="currentColor" />
            <circle cx="24" cy="15" r="2.6" fill="#fff" />
          </svg>
        </div>
        <h1 className="mt-5 font-display text-2xl font-extrabold text-neutral-900">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1.5 text-neutral-500">
          {isPartner
            ? "Sign in to your laundry business dashboard."
            : "Sign in to manage your laundry bookings."}
        </p>
      </div>

      <div className="mt-8 space-y-3.5">
        <Field icon={<Phone className="h-5 w-5" />} label={isPartner ? "Business phone" : "Phone number"}>
          <input
            className="input-field pl-11"
            placeholder="+233 24 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
          />
        </Field>

        {!isPartner && (
          <Field icon={<Mail className="h-5 w-5" />} label="Email">
            <input
              className="input-field pl-11"
              placeholder="you@upsa.edu.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
            />
          </Field>
        )}

        <Field icon={<Lock className="h-5 w-5" />} label="Password">
          <input
            className="input-field pl-11 pr-11"
            placeholder="••••••••"
            type={showPw ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </Field>
      </div>

      {isLogin && (
        <button className="mt-3 self-end text-sm font-semibold text-primary-600 active:scale-95 transition-transform">
          Forgot password?
        </button>
      )}

      <div className="mt-auto space-y-3 pt-8">
        <button onClick={submit} className="btn-primary w-full">
          {isLogin ? "Login" : "Create account"}
        </button>
        <p className="text-center text-sm text-neutral-500">
          {isLogin ? "New to LaundryHub?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin((v) => !v)}
            className="font-semibold text-primary-600"
          >
            {isLogin ? "Create account" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-neutral-700">{label}</span>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</span>
        {children}
      </div>
    </label>
  );
}
