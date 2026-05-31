/**
 * MEDIHUB WhatsApp notification service.
 *
 * All booking notifications flow through WhatsApp using MEDIHUB's number
 * (+94112267777). Two delivery modes are supported, switchable from the
 * admin notification settings:
 *
 *   • deeplink (default) — opens https://wa.me/<phone>?text=<message>
 *     in a new tab/app. The patient/admin taps Send to deliver the
 *     message. No backend required, works on web and mobile.
 *
 *   • cloud-api (production) — POSTs the payload to your webhook, which
 *     forwards to the WhatsApp Business Cloud API using MEDIHUB's
 *     business phone number ID. Real automated delivery.
 *
 *   • disabled — no WhatsApp delivery, only the in-app admin panel
 *     reflects status changes.
 */

import type {
  Appointment,
  AppointmentStatus,
  NotificationSettings,
} from "@/contexts/AdminDataContext";

export type WhatsAppKind =
  | "admin-new-booking"
  | "patient-status-update"
  | "test";

export interface WhatsAppResult {
  ok: boolean;
  /** Number of messages actually delivered (cloud-api mode) or opened
   *  in the composer (deeplink mode). */
  delivered: number;
  /** Number of messages skipped (e.g. invalid phone, disabled mode). */
  skipped: number;
  failed: number;
  mode: NotificationSettings["mode"];
  detail: string;
}

interface SendArgs {
  to: string[];
  message: string;
  kind: WhatsAppKind;
  settings: NotificationSettings;
  /** When true, the deeplink mode opens the WhatsApp composer. When
   *  false the call only records intent (used when, for example, you
   *  want a confirmation step before opening). */
  openComposer?: boolean;
}

/** Default country code prepended when callers enter a local Sri Lankan
 *  number (one that starts with 0 after stripping formatting). */
const DEFAULT_COUNTRY_CODE = "94";

/**
 * Convert any phone formatting into the digits-only form WhatsApp's
 * wa.me URLs expect. Handles:
 *   • spaces, dashes, parentheses → stripped
 *   • leading "+"  → dropped
 *   • leading "00" → dropped (international dial-out prefix)
 *   • leading "0"  → replaced with country code (Sri Lankan local format
 *                     like "0771234567" or "0112267777" needs "94" prepended,
 *                     otherwise wa.me responds with "This link couldn't
 *                     be opened.")
 */
const toWaDigits = (raw: string) => {
  const stripped = raw
    .replace(/[\s\-()]+/g, "")
    .replace(/^\+/, "")
    .replace(/^00/, "");
  if (stripped.startsWith("0")) {
    return DEFAULT_COUNTRY_CODE + stripped.slice(1);
  }
  return stripped;
};

const isValidPhone = (raw: string) => /^\d{7,15}$/.test(toWaDigits(raw));

const openWindow = (url: string) => {
  if (typeof window === "undefined") return;
  // _blank so it doesn't replace the admin tab on desktop, and the
  // mobile OS naturally routes wa.me to the WhatsApp app.
  window.open(url, "_blank", "noopener,noreferrer");
};

export const buildWaLink = (phone: string, message: string) => {
  const digits = toWaDigits(phone);
  const body = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${body}`;
};

export const sendWhatsApp = async ({
  to,
  message,
  kind,
  settings,
  openComposer = true,
}: SendArgs): Promise<WhatsAppResult> => {
  const recipients = Array.from(
    new Set(to.map(toWaDigits).filter(isValidPhone))
  );

  if (recipients.length === 0) {
    return {
      ok: false,
      delivered: 0,
      skipped: 0,
      failed: 0,
      mode: settings.mode,
      detail: "No valid WhatsApp number was provided.",
    };
  }

  if (settings.mode === "disabled") {
    console.info("[wa:disabled] skipped", { kind, recipients, message });
    return {
      ok: true,
      delivered: 0,
      skipped: recipients.length,
      failed: 0,
      mode: "disabled",
      detail:
        "WhatsApp delivery is disabled in admin settings — message was recorded but not sent.",
    };
  }

  if (settings.mode === "cloud-api") {
    if (!settings.webhookUrl) {
      console.warn("[wa:cloud-api] no webhookUrl configured");
      return {
        ok: false,
        delivered: 0,
        skipped: 0,
        failed: recipients.length,
        mode: "cloud-api",
        detail:
          "Cloud API mode is selected but no webhook URL is configured. Add one in Notification Settings.",
      };
    }

    let delivered = 0;
    let failed = 0;
    await Promise.all(
      recipients.map(async (phone) => {
        try {
          const res = await fetch(settings.webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: phone,
              from: toWaDigits(settings.medihubNumber),
              message,
              kind,
              senderName: settings.senderName || "MEDIHUB",
              timestamp: new Date().toISOString(),
            }),
          });
          if (res.ok) delivered += 1;
          else failed += 1;
        } catch (err) {
          console.error("[wa:cloud-api] failed", { phone, err });
          failed += 1;
        }
      })
    );

    return {
      ok: failed === 0,
      delivered,
      skipped: 0,
      failed,
      mode: "cloud-api",
      detail:
        failed === 0
          ? `Sent ${delivered} WhatsApp message${delivered === 1 ? "" : "s"} via Cloud API.`
          : `Sent ${delivered}/${recipients.length}. ${failed} failed — check webhook logs.`,
    };
  }

  // mode === "deeplink"
  if (!openComposer) {
    return {
      ok: true,
      delivered: 0,
      skipped: 0,
      failed: 0,
      mode: "deeplink",
      detail: `Deep-link composer ready for ${recipients.join(", ")}.`,
    };
  }

  recipients.forEach((phone) => openWindow(buildWaLink(phone, message)));
  return {
    ok: true,
    delivered: recipients.length,
    skipped: 0,
    failed: 0,
    mode: "deeplink",
    detail: `Opened WhatsApp for ${recipients[0]}${recipients.length > 1 ? ` (+${recipients.length - 1} more)` : ""}.`,
  };
};

// ── Message templates ──────────────────────────────────────────────────────

const formatDateTime = (date?: string, time?: string) => {
  if (!date) return "";
  const d = new Date(`${date}T${time || "00:00"}`);
  if (Number.isNaN(d.getTime())) return time ? `${date} ${time}` : date;
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  let out = d.toLocaleDateString(undefined, opts);
  if (time) out += ` at ${time}`;
  return out;
};

export const buildAdminNotificationMessage = (a: Appointment) => {
  const when = formatDateTime(a.preferredDate, a.preferredTime);
  return [
    `*MEDIHUB · New ${a.mode === "migration" ? "Migration" : "Consultation"} booking*`,
    ``,
    `• Name: ${a.name}`,
    `• Phone: ${a.phone}`,
    a.email ? `• Email: ${a.email}` : null,
    a.service ? `• Service: ${a.service}` : null,
    a.destination ? `• Destination: ${a.destination}` : null,
    when ? `• Preferred: ${when}` : null,
    a.notes ? `• Notes: ${a.notes}` : null,
    ``,
    `Reference: ${a.id.toUpperCase()}`,
    `Please confirm via the admin panel.`,
  ]
    .filter(Boolean)
    .join("\n");
};

export const buildPatientStatusMessage = (
  a: Appointment,
  status: AppointmentStatus,
  options?: {
    reason?: string;
    rescheduledTo?: { date: string; time?: string };
  }
) => {
  const greeting = `Hello ${a.name.split(" ")[0] || ""},`.trim();
  const service = a.service || "your appointment";
  const original = formatDateTime(a.preferredDate, a.preferredTime);

  switch (status) {
    case "confirmed": {
      const when = formatDateTime(
        a.scheduledDate || a.preferredDate,
        a.scheduledTime || a.preferredTime
      );
      return [
        greeting,
        ``,
        `Your *MEDIHUB* booking for *${service}* is *CONFIRMED*${when ? ` on ${when}` : ""}.`,
        options?.reason ? `Note: ${options.reason}` : null,
        ``,
        `Need to change? Reply here or call 011 226 7777.`,
        `— MEDIHUB Migration Health Hub`,
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "rescheduled": {
      const when = formatDateTime(
        options?.rescheduledTo?.date || a.scheduledDate,
        options?.rescheduledTo?.time || a.scheduledTime
      );
      return [
        greeting,
        ``,
        `Your *MEDIHUB* booking for *${service}* has been *RESCHEDULED*.`,
        when ? `New time: *${when}*` : null,
        original ? `(Originally: ${original})` : null,
        options?.reason ? `Reason: ${options.reason}` : null,
        ``,
        `Reply here or call 011 226 7777 if this doesn't work.`,
        `— MEDIHUB`,
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "rejected": {
      return [
        greeting,
        ``,
        `Unfortunately we are unable to confirm your *MEDIHUB* booking for *${service}*${original ? ` on ${original}` : ""}.`,
        options?.reason ? `Reason: ${options.reason}` : null,
        ``,
        `Please reply or call 011 226 7777 so we can help find another option.`,
        `— MEDIHUB`,
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "completed": {
      return [
        greeting,
        ``,
        `Thank you for visiting *MEDIHUB* for ${service}. We hope you had a great experience.`,
        `For any follow-up, reply here or call 011 226 7777.`,
        `— MEDIHUB`,
      ].join("\n");
    }
    case "cancelled": {
      return [
        greeting,
        ``,
        `Your *MEDIHUB* booking for ${service} has been *cancelled*.`,
        options?.reason ? `Reason: ${options.reason}` : null,
        `Call 011 226 7777 to rebook.`,
        `— MEDIHUB`,
      ]
        .filter(Boolean)
        .join("\n");
    }
    default:
      return [
        greeting,
        ``,
        `Update on your *MEDIHUB* booking for ${service}.`,
        options?.reason ? options.reason : null,
        `— MEDIHUB`,
      ]
        .filter(Boolean)
        .join("\n");
  }
};

export const buildTestMessage = (senderName: string) =>
  `*${senderName || "MEDIHUB"}* test message. If you can read this on WhatsApp, your notification setup is working correctly.`;
