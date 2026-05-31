import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  Clock,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  AlertCircle,
  Trash2,
  History,
  RefreshCw,
  Send,
  Search,
  PlaneTakeoff,
  Stethoscope,
  Inbox,
  Sparkles,
} from "lucide-react";
import {
  useAdminData,
  type Appointment,
  type AppointmentStatus,
} from "@/contexts/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { buildPatientStatusMessage, sendWhatsApp } from "@/lib/whatsapp";

type FilterKey = "all" | AppointmentStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "rescheduled", label: "Rescheduled" },
  { key: "rejected", label: "Rejected" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const statusStyles: Record<AppointmentStatus, { bg: string; text: string; dot: string; label: string }> = {
  pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
  confirmed: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", label: "Confirmed" },
  rescheduled: { bg: "bg-sky-50 border-sky-200", text: "text-sky-700", dot: "bg-sky-500", label: "Rescheduled" },
  rejected: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", dot: "bg-rose-500", label: "Rejected" },
  completed: { bg: "bg-slate-100 border-slate-200", text: "text-slate-700", dot: "bg-slate-500", label: "Completed" },
  cancelled: { bg: "bg-slate-100 border-slate-200", text: "text-slate-500", dot: "bg-slate-400", label: "Cancelled" },
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOnly = (date?: string, time?: string) => {
  if (!date) return "—";
  const d = new Date(`${date}T${time || "00:00"}`);
  if (Number.isNaN(d.getTime())) return time ? `${date} ${time}` : date;
  return [
    d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time ? `at ${time}` : null,
  ]
    .filter(Boolean)
    .join(" ");
};

type ActionMode =
  | { kind: "confirm"; appointment: Appointment }
  | { kind: "reschedule"; appointment: Appointment }
  | { kind: "reject"; appointment: Appointment }
  | { kind: "complete"; appointment: Appointment };

export const AdminAppointments = () => {
  const {
    appointments,
    updateAppointment,
    deleteAppointment,
    appendAppointmentHistory,
    notificationSettings,
  } = useAdminData();

  const [filter, setFilter] = useState<FilterKey>("pending");
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<ActionMode | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Appointment | null>(null);

  const counts = useMemo(() => {
    const out: Record<FilterKey, number> = {
      all: appointments.length,
      pending: 0,
      confirmed: 0,
      rescheduled: 0,
      rejected: 0,
      completed: 0,
      cancelled: 0,
    };
    appointments.forEach((a) => {
      out[a.status] = (out[a.status] ?? 0) + 1;
    });
    return out;
  }, [appointments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments
      .filter((a) => (filter === "all" ? true : a.status === filter))
      .filter((a) => {
        if (!q) return true;
        return (
          a.name.toLowerCase().includes(q) ||
          a.phone.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.service.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [appointments, filter, query]);

  // ── Action handlers ──────────────────────────────────────────────────────
  const applyStatusChange = async (
    appointment: Appointment,
    nextStatus: AppointmentStatus,
    opts: {
      scheduledDate?: string;
      scheduledTime?: string;
      adminNote?: string;
      reason?: string;
    } = {}
  ) => {
    // Update appointment record
    updateAppointment(appointment.id, {
      status: nextStatus,
      scheduledDate: opts.scheduledDate ?? appointment.scheduledDate,
      scheduledTime: opts.scheduledTime ?? appointment.scheduledTime,
      adminNote: opts.adminNote,
    });

    // Build patient WhatsApp message
    const message = buildPatientStatusMessage(
      {
        ...appointment,
        scheduledDate: opts.scheduledDate ?? appointment.scheduledDate,
        scheduledTime: opts.scheduledTime ?? appointment.scheduledTime,
      },
      nextStatus,
      {
        reason: opts.reason,
        rescheduledTo:
          nextStatus === "rescheduled" && opts.scheduledDate
            ? { date: opts.scheduledDate, time: opts.scheduledTime }
            : undefined,
      }
    );

    let notifiedUser = false;
    if (notificationSettings.notifyPatient) {
      const result = await sendWhatsApp({
        to: [appointment.phone],
        message,
        kind: "patient-status-update",
        settings: notificationSettings,
        openComposer: true,
      });
      notifiedUser = result.delivered > 0;
      if (result.mode === "deeplink") {
        toast.success("Opening WhatsApp to message the patient", {
          description: result.detail,
        });
      } else if (result.mode === "cloud-api") {
        if (result.delivered > 0) toast.success(`WhatsApp sent · ${appointment.name}`);
        else toast.error(`WhatsApp failed — ${result.detail}`);
      } else if (result.mode === "disabled") {
        toast.info("WhatsApp disabled — patient was not notified.");
      }
    } else {
      toast.info("Patient notifications are off in Notification Settings.");
    }

    appendAppointmentHistory(appointment.id, {
      at: new Date().toISOString(),
      status: nextStatus,
      message:
        opts.adminNote ||
        opts.reason ||
        defaultHistoryMessage(nextStatus, opts.scheduledDate, opts.scheduledTime),
      notifiedUser,
    });

    setAction(null);
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Appointments
          </h1>
          <p className="text-slate-600 mt-1.5 text-sm">
            Every booking request submitted through the website. Confirm, reschedule, or reject — the patient is notified on WhatsApp automatically.
          </p>
        </div>
        {counts.pending > 0 && (
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-bold text-amber-700">
              {counts.pending} pending {counts.pending === 1 ? "request" : "requests"}
            </span>
          </div>
        )}
      </div>

      {/* Filter + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const count = counts[f.key] ?? 0;
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                  active
                    ? "bg-slate-900 text-white shadow"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search name, phone, service…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 bg-white"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <AppointmentRow
              key={a.id}
              appointment={a}
              onAction={(kind) => setAction({ kind, appointment: a } as ActionMode)}
              onDelete={() => setPendingDelete(a)}
            />
          ))}
        </div>
      )}

      {/* Action dialogs */}
      <ConfirmDialog
        action={action?.kind === "confirm" ? action : null}
        notifyEnabled={notificationSettings.notifyPatient && notificationSettings.mode !== "disabled"}
        onCancel={() => setAction(null)}
        onSubmit={(opts) =>
          action?.kind === "confirm" &&
          applyStatusChange(action.appointment, "confirmed", opts)
        }
      />
      <RescheduleDialog
        action={action?.kind === "reschedule" ? action : null}
        notifyEnabled={notificationSettings.notifyPatient && notificationSettings.mode !== "disabled"}
        onCancel={() => setAction(null)}
        onSubmit={(opts) =>
          action?.kind === "reschedule" &&
          applyStatusChange(action.appointment, "rescheduled", opts)
        }
      />
      <RejectDialog
        action={action?.kind === "reject" ? action : null}
        notifyEnabled={notificationSettings.notifyPatient && notificationSettings.mode !== "disabled"}
        onCancel={() => setAction(null)}
        onSubmit={(opts) =>
          action?.kind === "reject" &&
          applyStatusChange(action.appointment, "rejected", opts)
        }
      />
      <CompleteDialog
        action={action?.kind === "complete" ? action : null}
        onCancel={() => setAction(null)}
        onSubmit={(opts) =>
          action?.kind === "complete" &&
          applyStatusChange(action.appointment, "completed", opts)
        }
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this appointment record?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} · {pendingDelete?.phone} · {pendingDelete?.service || "no service"}
              <br />
              This permanently removes the request from the admin console. The patient is <strong>not</strong> notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) {
                  deleteAppointment(pendingDelete.id);
                  toast.success("Appointment deleted");
                }
                setPendingDelete(null);
              }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ── Components ──────────────────────────────────────────────────────────────

const EmptyState = ({ filter }: { filter: FilterKey }) => (
  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-4">
      <Inbox className="w-6 h-6 text-slate-400" />
    </div>
    <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">
      {filter === "all" ? "No appointment requests yet" : `No ${filter} appointments`}
    </h3>
    <p className="text-sm text-slate-500 max-w-sm mx-auto">
      Requests submitted through the public booking form will appear here in real time.
    </p>
  </div>
);

const AppointmentRow = ({
  appointment,
  onAction,
  onDelete,
}: {
  appointment: Appointment;
  onAction: (kind: ActionMode["kind"]) => void;
  onDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const status = statusStyles[appointment.status];
  const ModeIcon = appointment.mode === "migration" ? PlaneTakeoff : Stethoscope;
  const isActive = appointment.status === "pending" || appointment.status === "confirmed" || appointment.status === "rescheduled";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        {/* Left rail: status + mode */}
        <div
          className={cn(
            "lg:w-56 p-4 lg:p-5 flex flex-row lg:flex-col gap-3 lg:gap-2 justify-between border-b lg:border-b-0 lg:border-r",
            status.bg
          )}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("w-2 h-2 rounded-full", status.dot)} />
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", status.text)}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ModeIcon className="w-4 h-4 text-slate-500" />
              {appointment.mode === "migration" ? "Migration Health" : "Consultation"}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
              {appointment.id}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 lg:mt-auto">
            <div>Received</div>
            <div className="font-semibold text-slate-700">{formatDateTime(appointment.createdAt)}</div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-4 lg:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-heading text-lg font-extrabold text-slate-900">
                {appointment.name}
              </h3>
              <p className="text-sm text-slate-600">{appointment.service || "Service not specified"}</p>
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <History className="w-3.5 h-3.5" />
              {open ? "Hide" : "Details"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <a href={`tel:${appointment.phone}`} className="hover:text-primary">
                {appointment.phone}
              </a>
            </div>
            {appointment.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${appointment.email}`} className="hover:text-primary truncate">
                  {appointment.email}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {appointment.status === "confirmed" || appointment.status === "rescheduled"
                  ? `Scheduled: ${formatDateOnly(appointment.scheduledDate, appointment.scheduledTime)}`
                  : `Preferred: ${formatDateOnly(appointment.preferredDate, appointment.preferredTime)}`}
              </span>
            </div>
            {appointment.destination && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{appointment.destination}</span>
              </div>
            )}
          </div>

          {appointment.notes && (
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
              <div className="font-bold uppercase tracking-wider text-slate-500 mb-1 text-[10px]">
                Patient note
              </div>
              {appointment.notes}
            </div>
          )}

          {appointment.adminNote && (
            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
              <div className="font-bold uppercase tracking-wider text-blue-600 mb-1 text-[10px]">
                Admin note
              </div>
              {appointment.adminNote}
            </div>
          )}

          {open && appointment.history.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">
                Activity
              </div>
              <ul className="space-y-2">
                {appointment.history
                  .slice()
                  .reverse()
                  .map((h, i) => {
                    const s = statusStyles[h.status];
                    return (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className={cn("mt-1 w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />
                        <div className="flex-1">
                          <div>
                            <span className={cn("font-bold", s.text)}>{s.label}</span>
                            <span className="text-slate-500"> · {formatDateTime(h.at)}</span>
                            {h.notifiedUser && (
                              <span className="ml-1.5 text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                                <Send className="w-3 h-3" /> WhatsApp
                              </span>
                            )}
                          </div>
                          <div className="text-slate-600">{h.message}</div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {isActive && appointment.status !== "confirmed" && (
              <Button
                size="sm"
                onClick={() => onAction("confirm")}
                className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Accept
              </Button>
            )}
            {isActive && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("reschedule")}
                className="gap-1.5 border-sky-300 text-sky-700 hover:bg-sky-50"
              >
                <RefreshCw className="w-4 h-4" />
                Reschedule
              </Button>
            )}
            {isActive && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("reject")}
                className="gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            )}
            {(appointment.status === "confirmed" || appointment.status === "rescheduled") && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("complete")}
                className="gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Mark Completed
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="ml-auto text-slate-500 hover:text-rose-600 gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

// ── Action dialogs ──────────────────────────────────────────────────────────

const ConfirmDialog = ({
  action,
  notifyEnabled,
  onCancel,
  onSubmit,
}: {
  action: { kind: "confirm"; appointment: Appointment } | null;
  notifyEnabled: boolean;
  onCancel: () => void;
  onSubmit: (opts: { scheduledDate: string; scheduledTime?: string; adminNote?: string }) => void;
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (action) {
      setDate(action.appointment.scheduledDate || action.appointment.preferredDate || "");
      setTime(action.appointment.scheduledTime || action.appointment.preferredTime || "");
      setNote("");
    }
  }, [action]);

  if (!action) return null;

  const a = action.appointment;
  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Confirm appointment
          </DialogTitle>
          <DialogDescription>
            Confirm {a.name}'s booking for <strong>{a.service || "their service"}</strong>. The patient receives a WhatsApp confirmation from MEDIHUB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="confirm-date">Confirmed date</Label>
              <Input
                id="confirm-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirm-time">Time (optional)</Label>
              <Input
                id="confirm-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="confirm-note">Note for the patient (optional)</Label>
            <Textarea
              id="confirm-note"
              placeholder="e.g. Please bring your passport copy and prior medical reports."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <NotifyHint enabled={notifyEnabled} action="confirmation" />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSubmit({
                scheduledDate: date,
                scheduledTime: time || undefined,
                adminNote: note || undefined,
              })
            }
            disabled={!date}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Confirm &amp; notify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RescheduleDialog = ({
  action,
  notifyEnabled,
  onCancel,
  onSubmit,
}: {
  action: { kind: "reschedule"; appointment: Appointment } | null;
  notifyEnabled: boolean;
  onCancel: () => void;
  onSubmit: (opts: { scheduledDate: string; scheduledTime?: string; adminNote?: string; reason?: string }) => void;
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (action) {
      setDate(action.appointment.preferredDate || "");
      setTime(action.appointment.preferredTime || "");
      setReason("");
    }
  }, [action]);

  if (!action) return null;
  const a = action.appointment;

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-sky-600" />
            Reschedule appointment
          </DialogTitle>
          <DialogDescription>
            Pick a new time for {a.name}. The patient receives a WhatsApp message from MEDIHUB with the updated slot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
            <div className="text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Patient's preferred time
            </div>
            <div className="text-slate-700 font-medium">
              {formatDateOnly(a.preferredDate, a.preferredTime)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="resched-date">New date</Label>
              <Input
                id="resched-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="resched-time">New time</Label>
              <Input
                id="resched-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="resched-reason">Reason for the patient (optional)</Label>
            <Textarea
              id="resched-reason"
              placeholder="e.g. Doctor unavailable on that day; please come on the new date."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          <NotifyHint enabled={notifyEnabled} action="reschedule" />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSubmit({
                scheduledDate: date,
                scheduledTime: time || undefined,
                reason: reason || undefined,
                adminNote: reason || undefined,
              })
            }
            disabled={!date}
            className="bg-sky-600 hover:bg-sky-700"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Reschedule &amp; notify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RejectDialog = ({
  action,
  notifyEnabled,
  onCancel,
  onSubmit,
}: {
  action: { kind: "reject"; appointment: Appointment } | null;
  notifyEnabled: boolean;
  onCancel: () => void;
  onSubmit: (opts: { reason?: string; adminNote?: string }) => void;
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (action) setReason("");
  }, [action]);

  if (!action) return null;
  const a = action.appointment;

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-700">
            <XCircle className="w-5 h-5" />
            Reject appointment
          </DialogTitle>
          <DialogDescription>
            Let {a.name} know we can't accommodate this booking. They'll receive a WhatsApp message with your reason.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              placeholder="e.g. Service unavailable this week; please call us for an alternative."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          <NotifyHint enabled={notifyEnabled} action="rejection" />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSubmit({
                reason: reason || undefined,
                adminNote: reason || undefined,
              })
            }
            className="bg-rose-600 hover:bg-rose-700"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject &amp; notify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CompleteDialog = ({
  action,
  onCancel,
  onSubmit,
}: {
  action: { kind: "complete"; appointment: Appointment } | null;
  onCancel: () => void;
  onSubmit: (opts: { adminNote?: string }) => void;
}) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (action) setNote("");
  }, [action]);

  if (!action) return null;
  const a = action.appointment;

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mark appointment as completed</DialogTitle>
          <DialogDescription>
            Closes the loop for {a.name}'s booking. A thank-you WhatsApp message is sent if patient notifications are enabled.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="complete-note">Internal note (optional)</Label>
            <Textarea
              id="complete-note"
              placeholder="e.g. Visit completed at 10:30am, follow-up scheduled."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSubmit({ adminNote: note || undefined })}>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Mark completed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const NotifyHint = ({ enabled, action }: { enabled: boolean; action: string }) => {
  if (!enabled) {
    return (
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          Patient WhatsApp notifications are off. The {action} will be saved but the patient won't receive a WhatsApp message — enable it in <strong>WhatsApp Notifications</strong>.
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
      <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div>
        A WhatsApp message will be sent to the patient using MEDIHUB's number.
      </div>
    </div>
  );
};

const defaultHistoryMessage = (
  status: AppointmentStatus,
  scheduledDate?: string,
  scheduledTime?: string
) => {
  switch (status) {
    case "confirmed":
      return `Confirmed for ${formatDateOnly(scheduledDate, scheduledTime)}.`;
    case "rescheduled":
      return `Rescheduled to ${formatDateOnly(scheduledDate, scheduledTime)}.`;
    case "rejected":
      return "Booking rejected.";
    case "completed":
      return "Marked as completed.";
    case "cancelled":
      return "Booking cancelled.";
    default:
      return "Status updated.";
  }
};

export default AdminAppointments;
