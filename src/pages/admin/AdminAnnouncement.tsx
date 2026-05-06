import { useEffect, useState } from "react";
import { Save, Eye, Megaphone, AlertTriangle, Radio } from "lucide-react";
import {
  useAdminData,
  type Announcement,
  type AnnouncementType,
} from "@/contexts/AdminDataContext";
import { BannerCore } from "@/components/AnnouncementBanner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TYPE_OPTIONS: {
  value: AnnouncementType;
  label: string;
  description: string;
  classes: string;
}[] = [
  { value: "info", label: "Info", description: "General update", classes: "border-cyan-300 bg-cyan-50 text-cyan-700" },
  { value: "success", label: "Success", description: "Positive news", classes: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  { value: "warning", label: "Warning", description: "Heads-up notice", classes: "border-amber-300 bg-amber-50 text-amber-700" },
  { value: "alert", label: "Alert", description: "Urgent attention", classes: "border-rose-300 bg-rose-50 text-rose-700" },
];

export const AdminAnnouncement = () => {
  const { announcement, setAnnouncement } = useAdminData();
  const [draft, setDraft] = useState<Announcement>(announcement);
  const [dirty, setDirty] = useState(false);

  // Keep draft in sync when underlying data changes externally (cross-tab).
  useEffect(() => {
    if (!dirty) setDraft(announcement);
  }, [announcement, dirty]);

  const update = <K extends keyof Announcement>(key: K, value: Announcement[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    setAnnouncement(draft);
    setDirty(false);
    toast.success(
      draft.active ? "Announcement is now live" : "Announcement saved"
    );
  };

  const handleReset = () => {
    setDraft(announcement);
    setDirty(false);
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-wrap items-end gap-4 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Hero Announcement
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Manage Announcement
          </h1>
          <p className="text-slate-600 mt-1.5 max-w-2xl">
            Display a short banner at the top of the homepage hero — for daily
            activity, urgent alerts or campaign messaging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={!dirty}
            className="text-slate-600"
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!dirty}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6">
        {/* ── Form ────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
          {/* Active toggle — visually loud so it's never missed */}
          <div
            className={cn(
              "flex items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-colors",
              draft.active
                ? "border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50"
                : "border-slate-200 bg-slate-50"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  draft.active
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : "bg-slate-200 text-slate-500"
                )}
              >
                <Radio className={cn("w-5 h-5", draft.active && "animate-pulse")} />
              </div>
              <div>
                <div className="font-heading font-extrabold text-slate-900 text-base">
                  Show on website {draft.active && <span className="text-emerald-600">— LIVE</span>}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 max-w-prose">
                  Toggle this on to publish the banner to the homepage hero. Off = no banner shown to visitors.
                </p>
              </div>
            </div>
            <Switch
              checked={draft.active}
              onCheckedChange={(v) => update("active", v)}
              className="data-[state=checked]:bg-emerald-500 scale-125"
            />
          </div>

          {/* Inline warning when there's a message but the banner is off */}
          {!draft.active && draft.message.trim().length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>Banner is off.</strong> You've written a message, but
                Show on website is toggled off — visitors won't see anything.
                Turn the toggle above on, then click Save.
              </div>
            </div>
          )}

          {/* Type selector */}
          <div className="space-y-2.5">
            <Label className="text-xs uppercase tracking-widest font-bold text-slate-500">
              Type
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => update("type", opt.value)}
                  className={cn(
                    "rounded-xl border-2 px-3 py-3 text-left transition-all",
                    draft.type === opt.value
                      ? opt.classes + " shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                  )}
                >
                  <div className="font-bold text-sm">{opt.label}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-slate-500">
              Message
            </Label>
            <Textarea
              id="message"
              value={draft.message}
              onChange={(e) => update("message", e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="e.g. Free travel-health screenings every Saturday this month — walk in or call us."
              className="resize-none"
            />
            <div className="text-[11px] text-slate-500 text-right">
              {draft.message.length}/200
            </div>
          </div>

          {/* CTA */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkLabel" className="text-xs uppercase tracking-widest font-bold text-slate-500">
                CTA label <span className="text-slate-400 font-normal normal-case">(optional)</span>
              </Label>
              <Input
                id="linkLabel"
                value={draft.linkLabel ?? ""}
                onChange={(e) => update("linkLabel", e.target.value)}
                placeholder="Learn more"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link" className="text-xs uppercase tracking-widest font-bold text-slate-500">
                CTA URL <span className="text-slate-400 font-normal normal-case">(optional)</span>
              </Label>
              <Input
                id="link"
                value={draft.link ?? ""}
                onChange={(e) => update("link", e.target.value)}
                placeholder="/services or https://…"
              />
            </div>
          </div>
        </div>

        {/* ── Preview ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-4 relative">
            <Eye className="w-4 h-4 text-emerald-300" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
              Live preview
            </span>
          </div>

          <p className="text-sm text-white/70 mb-5 relative">
            How the banner will look on the public site:
          </p>

          <div className="relative">
            {draft.message.trim() ? (
              <BannerCore announcement={draft} />
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-center text-white/50 text-sm">
                Write a message to see the preview.
              </div>
            )}
            {!draft.active && draft.message.trim() && (
              <p className="text-[11px] text-amber-200 mt-3 text-center">
                Preview only — toggle <strong>Show on website</strong> to publish.
              </p>
            )}
          </div>

          {dirty && (
            <p className="text-[11px] text-amber-200 mt-5 relative">
              You have unsaved changes — click Save to publish.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncement;
