import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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
  login: (password: string) => boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEYS.auth) === "true";
  });

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

  const setAnnouncement = useCallback((a: Announcement) => {
    setAnnouncementState(a);
  }, []);

  const addDoctor = useCallback((d: Omit<Doctor, "id">) => {
    const newDoc: Doctor = { ...d, id: makeId("doc") };
    setDoctorsState((prev) => [...prev, newDoc]);
    return newDoc;
  }, []);

  const updateDoctor = useCallback((id: string, patch: Partial<Doctor>) => {
    setDoctorsState((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d))
    );
  }, []);

  const deleteDoctor = useCallback((id: string) => {
    setDoctorsState((prev) => prev.filter((d) => d.id !== id));
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
      return created;
    },
    []
  );

  const updateAppointment = useCallback((id: string, patch: Partial<Appointment>) => {
    setAppointmentsState((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
      )
    );
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setAppointmentsState((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const appendAppointmentHistory = useCallback(
    (id: string, entry: AppointmentHistoryEntry) => {
      setAppointmentsState((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                history: [...a.history, entry],
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );
    },
    []
  );

  const setNotificationSettings = useCallback((s: NotificationSettings) => {
    setNotificationSettingsState(s);
  }, []);

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEYS.auth, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
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
