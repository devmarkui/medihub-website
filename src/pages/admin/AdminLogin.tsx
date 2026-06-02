import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type LocationState = { from?: string };

export const AdminLogin = () => {
  const { isAuthenticated, login } = useAdminData();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? "/admin";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    // Tiny artificial delay so the spinner is visible — feels intentional.
    await new Promise((r) => setTimeout(r, 350));
    const ok = await login(password);
    setBusy(false);
    if (ok) {
      toast.success("Welcome back, Admin");
      navigate(from, { replace: true });
    } else {
      toast.error("Incorrect password");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-900">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[160px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] p-8 sm:p-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/40 blur-xl rounded-2xl" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/30">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-white leading-tight">
                MEDIHUB Admin
              </h1>
              <p className="text-xs text-white/60 uppercase tracking-widest font-semibold mt-0.5">
                Secure Console
              </p>
            </div>
          </div>

          <p className="text-white/70 mb-8 leading-relaxed text-sm">
            Sign in to manage announcements, doctors and clinical content shown
            on the public website.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80 text-xs uppercase tracking-widest font-semibold">
                Admin Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter your admin password"
                  className="pl-10 pr-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white/90 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={busy || password.length === 0}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/30"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[11px] text-white/50 leading-relaxed">
              <strong className="text-white/70">Secure console.</strong>{" "}
              Announcements and bookings sync to the MEDIHUB server so they're
              visible across every device. Set your password in{" "}
              <code className="text-white/70">api/config.php</code>.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            ← Back to website
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
