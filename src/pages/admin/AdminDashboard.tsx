import { Link } from "react-router-dom";
import {
  Megaphone,
  Stethoscope,
  ArrowRight,
  Activity,
  CheckCircle2,
  CircleDashed,
  Award,
} from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { cn } from "@/lib/utils";

export const AdminDashboard = () => {
  const { announcement, doctors } = useAdminData();
  const featuredCount = doctors.filter((d) => d.featured).length;

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Announcement"
          value={announcement.active ? "Live" : "Off"}
          tone={announcement.active ? "live" : "off"}
          icon={announcement.active ? CheckCircle2 : CircleDashed}
          hint={
            announcement.active && announcement.message
              ? announcement.message
              : "No announcement is currently shown on the hero."
          }
        />
        <MetricCard
          label="Doctors"
          value={doctors.length.toString()}
          tone="neutral"
          icon={Stethoscope}
          hint={`${doctors.length} active profile${doctors.length === 1 ? "" : "s"} on the website.`}
        />
        <MetricCard
          label="Featured"
          value={featuredCount.toString()}
          tone="neutral"
          icon={Award}
          hint={
            featuredCount > 0
              ? "Highlighted in the doctors hero card."
              : "No doctor is currently featured."
          }
        />
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
          Quick actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
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

      {/* Activity */}
      <section>
        <h2 className="font-heading text-lg font-bold text-slate-900 mb-4">
          Activity feed
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
              title={`${doctors.length} doctor profile${doctors.length === 1 ? "" : "s"} live`}
              subtitle={
                doctors.length > 0
                  ? doctors.slice(0, 3).map((d) => d.name).join(", ") +
                    (doctors.length > 3 ? `, +${doctors.length - 3} more` : "")
                  : "Add your first doctor profile to populate the website."
              }
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
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Activity;
  tone: "live" | "off" | "neutral";
}) => (
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

const ActionCard = ({
  to,
  icon: Icon,
  title,
  description,
  accent,
}: {
  to: string;
  icon: typeof Megaphone;
  title: string;
  description: string;
  accent: string;
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
