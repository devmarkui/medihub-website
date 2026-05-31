import { Link } from "react-router-dom";
import { useMemo } from "react";
import {
  Megaphone,
  Stethoscope,
  ArrowRight,
  Activity,
  CheckCircle2,
  CircleDashed,
  Award,
  CalendarClock,
  AlertCircle,
  MessageCircle,
  Clock,
} from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { cn } from "@/lib/utils";

export const AdminDashboard = () => {
  const { announcement, doctors, appointments, notificationSettings } = useAdminData();
  const featuredCount = doctors.filter((d) => d.featured).length;

  const aptCounts = useMemo(() => {
    const counts = {
      total: appointments.length,
      pending: 0,
      confirmed: 0,
      rescheduled: 0,
      rejected: 0,
      completed: 0,
    };
    appointments.forEach((a) => {
      if (a.status in counts) {
        (counts as Record<string, number>)[a.status] += 1;
      }
    });
    return counts;
  }, [appointments]);

  const recentAppointments = useMemo(
    () =>
      appointments
        .slice()
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 4),
    [appointments]
  );

  const notifyLabel =
    notificationSettings.mode === "cloud-api"
      ? "Cloud API"
      : notificationSettings.mode === "deeplink"
        ? "Deep link"
        : "Disabled";

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-slate-600 mt-1.5">
          Quick overview of what's live on the public website right now.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Pending requests"
          value={aptCounts.pending.toString()}
          tone={aptCounts.pending > 0 ? "live" : "neutral"}
          icon={aptCounts.pending > 0 ? AlertCircle : CheckCircle2}
          hint={
            aptCounts.pending > 0
              ? `${aptCounts.pending} booking${aptCounts.pending === 1 ? "" : "s"} waiting for your response.`
              : "All booking requests handled — nice work."
          }
          link="/admin/appointments"
        />
        <MetricCard
          label="Confirmed"
          value={(aptCounts.confirmed + aptCounts.rescheduled).toString()}
          tone="neutral"
          icon={CalendarClock}
          hint="Confirmed or rescheduled appointments on the books."
          link="/admin/appointments"
        />
        <MetricCard
          label="Announcement"
          value={announcement.active ? "Live" : "Off"}
          tone={announcement.active ? "live" : "off"}
          icon={announcement.active ? CheckCircle2 : CircleDashed}
          hint={
            announcement.active && announcement.message
              ? announcement.message
              : "No announcement is currently shown."
          }
          link="/admin/announcement"
        />
        <MetricCard
          label="WhatsApp delivery"
          value={notifyLabel}
          tone={
            notificationSettings.mode === "cloud-api"
              ? "live"
              : notificationSettings.mode === "disabled"
                ? "off"
                : "neutral"
          }
          icon={MessageCircle}
          hint={
            notificationSettings.mode === "cloud-api"
              ? "Notifications send automatically through the Cloud API webhook."
              : notificationSettings.mode === "deeplink"
                ? "Admin acts open a pre-filled WhatsApp chat — tap Send to deliver."
                : "WhatsApp notifications are turned off."
          }
          link="/admin/notifications"
        />
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
          Quick actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <ActionCard
            to="/admin/appointments"
            icon={CalendarClock}
            title="Manage Appointments"
            description="Review every booking request, accept, reject, or reschedule — patient is notified on WhatsApp automatically."
            accent="from-primary to-emerald-500"
            badge={aptCounts.pending > 0 ? `${aptCounts.pending} pending` : undefined}
          />
          <ActionCard
            to="/admin/notifications"
            icon={MessageCircle}
            title="WhatsApp Notifications"
            description="Configure MEDIHUB's WhatsApp number and how booking notifications are delivered."
            accent="from-emerald-500 to-teal-600"
          />
          <ActionCard
            to="/admin/announcement"
            icon={Megaphone}
            title="Manage Announcement"
            description="Update or schedule the alert/banner shown at the top of the hero section."
            accent="from-cyan-500 to-blue-500"
          />
          <ActionCard
            to="/admin/doctors"
            icon={Stethoscope}
            title="Manage Doctors"
            description="Add, edit or remove the consultants shown on the public Meet our Doctors section."
            accent="from-emerald-500 to-teal-500"
          />
        </div>
      </section>

      {/* Recent appointments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Recent booking requests
          </h2>
          <Link
            to="/admin/appointments"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {recentAppointments.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No booking requests yet. They'll show up here the moment someone submits the form.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentAppointments.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      a.status === "pending"
                        ? "bg-amber-50 text-amber-600"
                        : a.status === "confirmed" || a.status === "rescheduled"
                          ? "bg-emerald-50 text-emerald-600"
                          : a.status === "rejected"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-slate-900 truncate">{a.name}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 truncate">
                        {a.service || (a.mode === "migration" ? "Migration" : "Consultation")}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {a.phone} · {new Date(a.createdAt).toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                      a.status === "pending" && "bg-amber-100 text-amber-700",
                      a.status === "confirmed" && "bg-emerald-100 text-emerald-700",
                      a.status === "rescheduled" && "bg-sky-100 text-sky-700",
                      a.status === "rejected" && "bg-rose-100 text-rose-700",
                      a.status === "completed" && "bg-slate-200 text-slate-700",
                      a.status === "cancelled" && "bg-slate-100 text-slate-500"
                    )}
                  >
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Site activity */}
      <section>
        <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
          Site activity
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            <ActivityRow
              icon={Activity}
              title={`Announcement is currently ${announcement.active ? "live" : "off"}`}
              subtitle={
                announcement.active && announcement.message
                  ? `"${announcement.message.slice(0, 80)}${announcement.message.length > 80 ? "…" : ""}"`
                  : "No announcement is being displayed to visitors."
              }
            />
            <ActivityRow
              icon={Stethoscope}
              title={`${doctors.length} doctor profile${doctors.length === 1 ? "" : "s"} live · ${featuredCount} featured`}
              subtitle={
                doctors.length > 0
                  ? doctors.slice(0, 3).map((d) => d.name).join(", ") +
                    (doctors.length > 3 ? `, +${doctors.length - 3} more` : "")
                  : "Add your first doctor profile to populate the website."
              }
            />
            <ActivityRow
              icon={Award}
              title={`${aptCounts.total} total appointment record${aptCounts.total === 1 ? "" : "s"}`}
              subtitle={`${aptCounts.confirmed} confirmed · ${aptCounts.rescheduled} rescheduled · ${aptCounts.rejected} rejected · ${aptCounts.completed} completed.`}
            />
          </ul>
        </div>
      </section>
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  link,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Activity;
  tone: "live" | "off" | "neutral";
  link?: string;
}) => {
  const body = (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4 mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <span
          className={cn(
            "rounded-lg p-2",
            tone === "live" && "bg-emerald-100 text-emerald-600",
            tone === "off" && "bg-slate-100 text-slate-400",
            tone === "neutral" && "bg-primary/10 text-primary"
          )}
        >
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div
        className={cn(
          "font-heading text-3xl font-extrabold leading-tight",
          tone === "live" ? "text-emerald-600" : "text-slate-900"
        )}
      >
        {value}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">{hint}</p>
    </div>
  );

  return link ? <Link to={link}>{body}</Link> : body;
};

const ActionCard = ({
  to,
  icon: Icon,
  title,
  description,
  accent,
  badge,
}: {
  to: string;
  icon: typeof Megaphone;
  title: string;
  description: string;
  accent: string;
  badge?: string;
}) => (
  <Link
    to={to}
    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30"
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className={cn(
          "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md text-white",
          accent
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-heading text-lg font-extrabold text-slate-900">{title}</h3>
      {badge && (
        <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
          {badge}
        </span>
      )}
    </div>
    <p className="text-sm text-slate-600 leading-relaxed pr-8">{description}</p>
    <ArrowRight className="absolute top-6 right-6 w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </Link>
);

const ActivityRow = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Activity;
  title: string;
  subtitle: string;
}) => (
  <li className="flex items-start gap-4 px-5 py-4">
    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-slate-900 text-sm">{title}</div>
      <div className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</div>
    </div>
  </li>
);

export default AdminDashboard;
