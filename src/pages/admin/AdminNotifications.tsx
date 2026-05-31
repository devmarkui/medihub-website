import { useEffect, useState } from "react";
import {
  MessageCircle,
  Phone,
  Webhook,
  Save,
  Send,
  TestTube,
  Shield,
  AlertCircle,
  Info,
  Link2,
} from "lucide-react";
import {
  MEDIHUB_WHATSAPP,
  useAdminData,
  type NotificationMode,
  type NotificationSettings,
} from "@/contexts/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { buildTestMessage, buildWaLink, sendWhatsApp } from "@/lib/whatsapp";

const MODE_OPTIONS: {
  id: NotificationMode;
  title: string;
  description: string;
  icon: typeof Webhook;
}[] = [
  {
    id: "deeplink",
    title: "WhatsApp deep link",
    description:
      "Opens wa.me with the message pre-filled. The user (patient or admin) just taps Send. No backend required — works on web and mobile.",
    icon: Link2,
  },
  {
    id: "cloud-api",
    title: "WhatsApp Cloud API",
    description:
      "Automated delivery through Meta's WhatsApp Business Cloud API. Requires your webhook endpoint that forwards to Meta with your Business credentials.",
    icon: Webhook,
  },
  {
    id: "disabled",
    title: "Disabled",
    description:
      "No WhatsApp message is sent. Bookings and status changes are still recorded inside the admin console.",
    icon: Shield,
  },
];

export const AdminNotifications = () => {
  const { notificationSettings, setNotificationSettings } = useAdminData();
  const [draft, setDraft] = useState<NotificationSettings>(notificationSettings);
  const [dirty, setDirty] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testNumber, setTestNumber] = useState("");

  useEffect(() => {
    if (!dirty) setDraft(notificationSettings);
  }, [notificationSettings, dirty]);

  const update = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    const cleaned: NotificationSettings = {
      ...draft,
      medihubNumber: draft.medihubNumber.trim() || MEDIHUB_WHATSAPP,
      webhookUrl: draft.webhookUrl.trim(),
      senderName: draft.senderName.trim() || "MEDIHUB",
    };
    setNotificationSettings(cleaned);
    setDraft(cleaned);
    setDirty(false);
    toast.success("Notification settings saved");
  };

  const handleReset = () => {
    setDraft(notificationSettings);
    setDirty(false);
  };

  const handleTest = async () => {
    if (!testNumber.trim()) {
      toast.error("Enter a WhatsApp number to receive the test message.");
      return;
    }
    setTesting(true);
    const result = await sendWhatsApp({
      to: [testNumber.trim()],
      message: buildTestMessage(draft.senderName),
      kind: "test",
      settings: draft,
      openComposer: true,
    });
    setTesting(false);
    if (result.mode === "deeplink") {
      toast.success("Opened WhatsApp", { description: result.detail });
    } else if (result.mode === "cloud-api") {
      if (result.delivered > 0) toast.success(result.detail);
      else toast.error(result.detail);
    } else if (result.mode === "disabled") {
      toast.info(result.detail);
    }
  };

  // Live preview of what the admin notification will look like.
  const previewLink = buildWaLink(
    draft.medihubNumber || MEDIHUB_WHATSAPP,
    "MEDIHUB · Sample booking notification\n\n• Name: Test Patient\n• Phone: +94 77 000 0000\n• Service: Consultation\n\nReference: APT-DEMO"
  );

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            WhatsApp Notifications
          </h1>
          <p className="text-slate-600 mt-1.5 text-sm max-w-2xl">
            All booking notifications run through WhatsApp. New requests land on MEDIHUB's WhatsApp, and patients receive confirmations from the same number when you accept, reject, or reschedule.
          </p>
        </div>
        <div className="flex gap-2">
          {dirty && (
            <Button variant="outline" onClick={handleReset}>
              Discard
            </Button>
          )}
          <Button onClick={handleSave} disabled={!dirty} className="gap-1.5">
            <Save className="w-4 h-4" />
            Save changes
          </Button>
        </div>
      </div>

      {/* MEDIHUB number */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          <h2 className="font-heading text-lg font-extrabold text-slate-900">
            MEDIHUB WhatsApp number
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Every notification is sent from and received on this number. New bookings go to this WhatsApp; patient status updates leave from this WhatsApp.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="medihub-number">Primary WhatsApp number</Label>
            <Input
              id="medihub-number"
              type="tel"
              value={draft.medihubNumber}
              onChange={(e) => update("medihubNumber", e.target.value)}
              placeholder={MEDIHUB_WHATSAPP}
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Use the international format. Default: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{MEDIHUB_WHATSAPP}</code>.
            </p>
          </div>
          <div>
            <Label htmlFor="sender-name">Sender label</Label>
            <Input
              id="sender-name"
              value={draft.senderName}
              onChange={(e) => update("senderName", e.target.value)}
              placeholder="MEDIHUB"
              maxLength={32}
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Shown at the top of every message body.
            </p>
          </div>
        </div>

        <a
          href={previewLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Preview the admin notification on WhatsApp →
        </a>
      </section>

      {/* Delivery mode */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" />
          <h2 className="font-heading text-lg font-extrabold text-slate-900">
            Delivery mode
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          How should every notification reach the recipient?
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          {MODE_OPTIONS.map((opt) => {
            const active = draft.mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => update("mode", opt.id)}
                className={cn(
                  "text-left rounded-2xl border p-4 transition-all",
                  active
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center mb-2",
                    active
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  <opt.icon className="w-4 h-4" />
                </div>
                <div className="font-heading font-extrabold text-sm text-slate-900 mb-1">
                  {opt.title}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>

        {draft.mode === "cloud-api" && (
          <div className="space-y-3 pt-2">
            <div>
              <Label htmlFor="webhook">Webhook URL</Label>
              <Input
                id="webhook"
                type="url"
                placeholder="https://your-backend.example.com/whatsapp"
                value={draft.webhookUrl}
                onChange={(e) => update("webhookUrl", e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                MEDIHUB will <code className="bg-slate-100 px-1.5 py-0.5 rounded">POST</code> JSON to this URL:{" "}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded">{`{ to, from, message, kind, senderName, timestamp }`}</code>. Your endpoint forwards to the WhatsApp Cloud API using your Business account.
              </p>
            </div>
            <InfoBanner tone="info">
              Don't have the Cloud API set up yet? Stay on <strong>WhatsApp deep link</strong> — every booking and admin action still opens a pre-filled WhatsApp chat, just tap Send.
            </InfoBanner>
          </div>
        )}

        {draft.mode === "deeplink" && (
          <InfoBanner tone="info">
            When a patient submits a booking, their WhatsApp opens addressed to MEDIHUB with the request pre-filled. When you accept or reschedule, MEDIHUB's WhatsApp opens addressed to the patient with the update pre-filled. One tap to deliver, every time.
          </InfoBanner>
        )}

        {draft.mode === "disabled" && (
          <InfoBanner tone="warn">
            WhatsApp delivery is off. Bookings and admin actions are still recorded — the team will need to call the patient manually.
          </InfoBanner>
        )}
      </section>

      {/* Patient notify toggle */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="font-heading text-lg font-extrabold text-slate-900">
            Patient notifications
          </h2>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <div>
            <Label htmlFor="notify-patient" className="cursor-pointer">
              Send WhatsApp to the patient on status change
            </Label>
            <p className="text-xs text-slate-500 mt-1">
              When this is off, the admin panel still records the action but the patient won't receive a WhatsApp message.
            </p>
          </div>
          <Switch
            id="notify-patient"
            checked={draft.notifyPatient}
            onCheckedChange={(v) => update("notifyPatient", v)}
          />
        </div>
      </section>

      {/* Test message */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TestTube className="w-4 h-4 text-primary" />
          <h2 className="font-heading text-lg font-extrabold text-slate-900">
            Send a test message
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Verify your setup end-to-end. The message is sent using the current draft — save first to make it live across the site.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <Label htmlFor="test-phone">Test WhatsApp number</Label>
            <Input
              id="test-phone"
              type="tel"
              placeholder="+94 77 000 0000"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
            />
          </div>
          <Button onClick={handleTest} disabled={testing} className="gap-1.5">
            <Send className="w-4 h-4" />
            {testing ? "Opening…" : "Send test"}
          </Button>
        </div>
      </section>
    </div>
  );
};

const InfoBanner = ({
  tone,
  children,
}: {
  tone: "info" | "warn";
  children: React.ReactNode;
}) => {
  const styles =
    tone === "info"
      ? "bg-sky-50 border-sky-200 text-sky-800"
      : "bg-amber-50 border-amber-200 text-amber-800";
  const Icon = tone === "info" ? Info : AlertCircle;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed",
        styles
      )}
    >
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div>{children}</div>
    </div>
  );
};

export default AdminNotifications;
