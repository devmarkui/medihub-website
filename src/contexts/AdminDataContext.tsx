import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, setApiToken, clearApiToken, getApiToken } from "@/lib/api";
import { toast } from "sonner";

/**
 * AdminDataContext — single source of truth for admin-managed content.
 *
 * Persistence is currently localStorage (frontend-only prototype). For
 * production, replace the read/write helpers below with a real backend
 * (Supabase, Firebase, your-own-API). The rest of the app reads from
 * this context and stays untouched.
 */

// ── Types ──────────────────────────────────────────────────────────────────
export type AnnouncementType = "info" | "success" | "warning" | "alert";

export interface Announcement {
  active: boolean;
  type: AnnouncementType;
  message: string;
  link?: string;
  linkLabel?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string; // URL or data: URI
  bio: string;
  qualifications: string;
  yearsExperience: number;
  languages: string[];
  email?: string;
  phone?: string;
  featured?: boolean;
}

// ── Appointment types ──────────────────────────────────────────────────────
export type AppointmentMode = "consultation" | "migration";
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rescheduled"
  | "rejected"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  /** ISO timestamp the request was created. */
  createdAt: string;
  /** ISO timestamp of the last admin action. */
  updatedAt: string;
  mode: AppointmentMode;
  /** Patient details captured on the booking form. */
  name: string;
  phone: string;
  email: string;
  service: string;
  destination?: string;
  /** Preferred (initial) date — yyyy-mm-dd. */
  preferredDate: string;
  /** Preferred time — HH:mm (consultation only). */
  preferredTime: string;
  notes: string;
  status: AppointmentStatus;
  /** Final confirmed date once admin acts. May differ from preferredDate. */
  scheduledDate?: string;
  scheduledTime?: string;
  /** Optional admin note attached to the latest status change. */
  adminNote?: string;
  /** Audit log of admin actions. */
  history: AppointmentHistoryEntry[];
}

export interface AppointmentHistoryEntry {
  at: string;
  status: AppointmentStatus;
  message: string;
  notifiedUser: boolean;
}

// ── WhatsApp / notification settings ───────────────────────────────────────
export type NotificationMode = "disabled" | "cloud-api" | "deeplink";

export interface NotificationSettings {
  /** How notifications are actually delivered. */
  mode: NotificationMode;
  /** MEDIHUB's primary WhatsApp number — used for sending and receiving. */
  medihubNumber: string;
  /** POST endpoint that forwards payloads to the WhatsApp Business Cloud API. */
  webhookUrl: string;
  /** Whether to also send status-update messages to the patient. */
  notifyPatient: boolean;
  /** Display name used at the top of every message ("MEDIHUB"). */
  senderName: string;
}

interface AdminDataContextValue {
  // Announcement
  announcement: Announcement;
  setAnnouncement: (a: Announcement) => void;
  // Doctors
  doctors: Doctor[];
  addDoctor: (d: Omit<Doctor, "id">) => Doctor;
  updateDoctor: (id: string, patch: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  // Appointments
  appointments: Appointment[];
  addAppointment: (
    a: Omit<Appointment, "id" | "createdAt" | "updatedAt" | "status" | "history">
  ) => Appointment;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  appendAppointmentHistory: (id: string, entry: AppointmentHistoryEntry) => void;
  // Notifications (WhatsApp)
  notificationSettings: NotificationSettings;
  setNotificationSettings: (s: NotificationSettings) => void;
  // Auth
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  // Reset
  resetAllData: () => void;
}

// ── Constants ──────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  announcement: "medihub:announcement",
  doctors: "medihub:doctors:v3",
  appointments: "medihub:appointments:v1",
  notificationSettings: "medihub:notification-settings:v1",
  auth: "medihub:admin-auth",
} as const;

/**
 * NOTE: hardcoded for the prototype. Replace with proper auth (Supabase,
 * NextAuth, Auth0, etc.) when wiring to a real backend.
 */
const ADMIN_PASSWORD = "medihub2024";

const defaultAnnouncement: Announcement = {
  active: false,
  type: "info",
  message: "",
  link: "",
  linkLabel: "",
};

const defaultDoctors: Doctor[] = [
  {
    id: "doc-perera",
    name: "Dr. Anjali Perera",
    specialty: "Migration Health Specialist",
    photo: "/doctor-female.svg",
    bio: "Leads MEDIHUB's migration medicine programme — visa medicals, fitness-to-fly assessments and pre-departure care for outbound workers.",
    qualifications: "MBBS, MD (Public Health), FRCP (UK)",
    yearsExperience: 15,
    languages: ["English", "Sinhala", "Tamil"],
    featured: true,
  },
  {
    id: "doc-wickramasinghe",
    name: "Dr. Ranjith Wickramasinghe",
    specialty: "General Medicine & Travel Medicine",
    photo: "/doctor-male.svg",
    bio: "Twenty years of frontline care, with deep expertise in travel medicine, vaccinations and chronic condition management for migrant workers.",
    qualifications: "MBBS, MRCP (UK), Diploma in Travel Medicine",
    yearsExperience: 20,
    languages: ["English", "Sinhala"],
  },
  {
    id: "doc-rathnayake",
    name: "Dr. Niluka Rathnayake",
    specialty: "Family Physician",
    photo: "/doctor-female.svg",
    bio: "Family medicine consultant focused on women's health, paediatric care and inbound migrant health screenings.",
    qualifications: "MBBS, MD (Family Medicine)",
    yearsExperience: 12,
    languages: ["English", "Sinhala", "Tamil"],
  },
  {
    id: "doc-jayasinghe",
    name: "Dr. Saman Jayasinghe",
    specialty: "Pulmonologist",
    photo: "/doctor-male.svg",
    bio: "Consultant pulmonologist managing respiratory health, TB screening and pre-employment chest assessments for international workforces.",
    qualifications: "MBBS, MD (Respiratory Medicine), FCCP",
    yearsExperience: 18,
    languages: ["English", "Sinhala"],
  },
];

/**
 * MEDIHUB's primary WhatsApp number. All booking notifications are sent
 * to this number and all patient status-updates are sent from it.
 */
export const MEDIHUB_WHATSAPP = "+94112267777";

/**
 * MEDIHUB's WhatsApp business line. New website bookings are sent here so
 * the team receives the request as a WhatsApp message on submit.
 */
export const MEDIHUB_BOOKING_WHATSAPP = "+94743936193";

const defaultNotificationSettings: NotificationSettings = {
  mode: "deeplink",
  medihubNumber: MEDIHUB_WHATSAPP,
  webhookUrl: "",
  notifyPatient: true,
  senderName: "MEDIHUB",
};

// ── Helpers ────────────────────────────────────────────────────────────────
const readJSON = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Quota exceeded (e.g., too many large base64 photos)
    console.error("[AdminData] localStorage write failed:", err);
  }
};

const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

// ── Context ────────────────────────────────────────────────────────────────
const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [announcement, setAnnouncementState] = useState<Announcement>(() =>
    readJSON(STORAGE_KEYS.announcement, defaultAnnouncement)
  );
  const [doctors, setDoctorsState] = useState<Doctor[]>(() =>
    readJSON(STORAGE_KEYS.doctors, defaultDoctors)
  );
  const [appointments, setAppointmentsState] = useState<Appointment[]>(() =>
    readJSON(STORAGE_KEYS.appointments, [] as Appointment[])
  );
  const [notificationSettings, setNotificationSettingsState] =
    useState<NotificationSettings>(() =>
      readJSON(STORAGE_KEYS.notificationSettings, defaultNotificationSettings)
    );
  // Authenticated only when BOTH the auth flag AND a session token are present.
  // This forces a fresh login (to obtain a token) for any old session that was
  // signed in before the backend existed — otherwise admin saves would 401.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem(STORAGE_KEYS.auth) === "true" && !!getApiToken()
    );
  });

  // Latest appointments + doctors, readable synchronously inside callbacks (so
  // we can push the full, up-to-date list to the backend without stale closures).
  const appointmentsRef = useRef<Appointment[]>(appointments);
  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);
  const doctorsRef = useRef<Doctor[]>(doctors);
  useEffect(() => {
    doctorsRef.current = doctors;
  }, [doctors]);

  // Persist on change
  useEffect(() => writeJSON(STORAGE_KEYS.announcement, announcement), [announcement]);
  useEffect(() => writeJSON(STORAGE_KEYS.doctors, doctors), [doctors]);
  useEffect(() => writeJSON(STORAGE_KEYS.appointments, appointments), [appointments]);
  useEffect(
    () => writeJSON(STORAGE_KEYS.notificationSettings, notificationSettings),
    [notificationSettings]
  );

  // Cross-tab sync — public site picks up admin edits without a refresh.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      try {
        if (e.key === STORAGE_KEYS.announcement && e.newValue) {
          setAnnouncementState(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.doctors && e.newValue) {
          setDoctorsState(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.appointments && e.newValue) {
          setAppointmentsState(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.notificationSettings && e.newValue) {
          setNotificationSettingsState(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.auth) {
          setIsAuthenticated(e.newValue === "true");
        }
      } catch {
        /* ignore parse errors */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Pull the live announcement + doctors from the backend so EVERY visitor
  // (any device) sees what the admin published — not just the browser it was
  // set in. Doctors returns null until the admin first saves, in which case
  // we keep the built-in defaults.
  useEffect(() => {
    let cancelled = false;
    api.getAnnouncement().then((a) => {
      if (!cancelled && a) setAnnouncementState(a);
    });
    api.getDoctors().then((list) => {
      if (!cancelled && list) setDoctorsState(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // When signed in, keep the appointments list in sync with the server so
  // bookings made on any device show up here. Refresh on focus + on a timer.
  const refreshAppointments = useCallback(async () => {
    const list = await api.getAppointments();
    if (list) setAppointmentsState(list);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshAppointments();
    const id = window.setInterval(refreshAppointments, 20000);
    const onFocus = () => refreshAppointments();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [isAuthenticated, refreshAppointments]);

  // Pull admin notification settings once signed in (admin-only endpoint).
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    api.getSettings().then((s) => {
      if (!cancelled && s) setNotificationSettingsState(s);
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Surface a clear error when a write doesn't reach the server, instead of
  // failing silently (the usual cause is an expired/missing login token).
  const reportSaved = (ok: boolean, what: string) => {
    if (!ok) {
      toast.error(`Couldn't save ${what} to the server`, {
        description: "You may have been signed out — sign in again and retry.",
      });
    }
  };

  const setAnnouncement = useCallback((a: Announcement) => {
    setAnnouncementState(a);
    // Publish to the backend so it's visible site-wide.
    api.saveAnnouncement(a).then((ok) => reportSaved(ok, "the announcement"));
  }, []);

  const addDoctor = useCallback((d: Omit<Doctor, "id">) => {
    const newDoc: Doctor = { ...d, id: makeId("doc") };
    const next = [...doctorsRef.current, newDoc];
    setDoctorsState(next);
    api.saveDoctors(next).then((ok) => reportSaved(ok, "doctors"));
    return newDoc;
  }, []);

  const updateDoctor = useCallback((id: string, patch: Partial<Doctor>) => {
    const next = doctorsRef.current.map((d) =>
      d.id === id ? { ...d, ...patch } : d
    );
    setDoctorsState(next);
    api.saveDoctors(next).then((ok) => reportSaved(ok, "doctors"));
  }, []);

  const deleteDoctor = useCallback((id: string) => {
    const next = doctorsRef.current.filter((d) => d.id !== id);
    setDoctorsState(next);
    api.saveDoctors(next).then((ok) => reportSaved(ok, "doctors"));
  }, []);

  const addAppointment = useCallback(
    (
      a: Omit<Appointment, "id" | "createdAt" | "updatedAt" | "status" | "history">
    ) => {
      const now = new Date().toISOString();
      const created: Appointment = {
        ...a,
        id: makeId("apt"),
        createdAt: now,
        updatedAt: now,
        status: "pending",
        history: [
          {
            at: now,
            status: "pending",
            message: "Booking request received from website.",
            notifiedUser: false,
          },
        ],
      };
      setAppointmentsState((prev) => [created, ...prev]);
      // Send the booking to the backend so it reaches the admin panel on any
      // device. Fire-and-forget — the WhatsApp notification is the primary
      // delivery path, this just makes it appear in the dashboard too.
      api.createAppointment(created);
      return created;
    },
    []
  );

  const updateAppointment = useCallback((id: string, patch: Partial<Appointment>) => {
    const current = appointmentsRef.current.find((a) => a.id === id);
    if (!current) return;
    const updated: Appointment = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    setAppointmentsState((prev) => prev.map((a) => (a.id === id ? updated : a)));
    api.updateAppointment(id, updated).then((ok) => reportSaved(ok, "the appointment"));
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setAppointmentsState((prev) => prev.filter((a) => a.id !== id));
    api.deleteAppointment(id);
  }, []);

  const appendAppointmentHistory = useCallback(
    (id: string, entry: AppointmentHistoryEntry) => {
      const current = appointmentsRef.current.find((a) => a.id === id);
      if (!current) return;
      const updated: Appointment = {
        ...current,
        history: [...current.history, entry],
        updatedAt: new Date().toISOString(),
      };
      setAppointmentsState((prev) => prev.map((a) => (a.id === id ? updated : a)));
      api.updateAppointment(id, updated).then((ok) => reportSaved(ok, "the appointment"));
    },
    []
  );

  const setNotificationSettings = useCallback((s: NotificationSettings) => {
    setNotificationSettingsState(s);
    api.saveSettings(s).then((ok) => reportSaved(ok, "notification settings"));
  }, []);

  const login = useCallback(async (password: string) => {
    // Primary path: validate against the backend, which returns a session
    // token used to authorize admin reads/writes.
    const result = await api.login(password);

    if (typeof result === "string") {
      // Got a token — real backend login succeeded.
      setApiToken(result);
      localStorage.setItem(STORAGE_KEYS.auth, "true");
      setIsAuthenticated(true);
      return true;
    }

    if (result === null) {
      // Backend reachable but rejected the password.
      return false;
    }

    // result === "unreachable" — no backend (e.g. local `vite dev`). Fall back
    // to the local password check so development/offline use still works.
    if (password === ADMIN_PASSWORD) {
      // Sentinel token so a reload still counts as authenticated offline.
      setApiToken("local-dev-fallback");
      localStorage.setItem(STORAGE_KEYS.auth, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    clearApiToken();
    localStorage.removeItem(STORAGE_KEYS.auth);
    setIsAuthenticated(false);
  }, []);

  const resetAllData = useCallback(() => {
    setAnnouncementState(defaultAnnouncement);
    setDoctorsState(defaultDoctors);
    setAppointmentsState([]);
    setNotificationSettingsState(defaultNotificationSettings);
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        announcement,
        setAnnouncement,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        appendAppointmentHistory,
        notificationSettings,
        setNotificationSettings,
        isAuthenticated,
        login,
        logout,
        resetAllData,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within <AdminDataProvider>");
  return ctx;
};
