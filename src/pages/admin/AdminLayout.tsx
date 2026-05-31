import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Stethoscope,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  CalendarClock,
  MessageCircle,
} from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end: boolean;
  /** Optional value to surface as a pill (e.g. pending count). */
  badge?: number;
};

export const AdminLayout = () => {
  const { logout, appointments } = useAdminData();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingCount = useMemo(
    () => appointments.filter((a) => a.status === "pending").length,
    [appointments]
  );

  const navItems: NavItem[] = useMemo(
    () => [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
      {
        to: "/admin/appointments",
        label: "Appointments",
        icon: CalendarClock,
        end: false,
        badge: pendingCount,
      },
      { to: "/admin/announcement", label: "Announcement", icon: Megaphone, end: false },
      { to: "/admin/doctors", label: "Doctors", icon: Stethoscope, end: false },
      { to: "/admin/notifications", label: "WhatsApp", icon: MessageCircle, end: false },
    ],
    [pendingCount]
  );

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ── Sidebar (desktop) ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-200 bg-white">
        <SidebarContents
          navItems={navItems}
          onLogout={handleLogout}
          onNavigate={() => {}}
        />
      </aside>

      {/* ── Mobile sidebar drawer ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col">
            <SidebarContents
              navItems={navItems}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── Main column ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-700"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-heading text-base sm:text-lg font-bold text-slate-900">
              Admin Console
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-primary"
            >
              <a href="/" target="_blank" rel="noreferrer" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View site</span>
              </a>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// ── Sidebar inner contents ─────────────────────────────────────────────────
const SidebarContents = ({
  navItems,
  onLogout,
  onNavigate,
}: {
  navItems: NavItem[];
  onLogout: () => void;
  onNavigate: () => void;
}) => (
  <>
    {/* Brand */}
    <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-slate-200">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-md shadow-primary/30">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-heading font-extrabold text-slate-900 leading-tight text-sm">
            MEDIHUB
          </div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            Admin
          </div>
        </div>
      </div>
      <button
        onClick={onNavigate}
        className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
        aria-label="Close menu"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    {/* Nav */}
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-700"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                  {item.badge}
                </span>
              ) : isActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              ) : null}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {/* Footer */}
    <div className="p-3 border-t border-slate-200">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  </>
);

export default AdminLayout;
