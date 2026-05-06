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

interface AdminDataContextValue {
  // Announcement
  announcement: Announcement;
  setAnnouncement: (a: Announcement) => void;
  // Doctors
  doctors: Doctor[];
  addDoctor: (d: Omit<Doctor, "id">) => Doctor;
  updateDoctor: (id: string, patch: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
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
  doctors: "medihub:doctors",
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
    photo:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80",
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
    photo:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    bio: "Twenty years of frontline care, with deep expertise in travel medicine, vaccinations and chronic condition management for migrant workers.",
    qualifications: "MBBS, MRCP (UK), Diploma in Travel Medicine",
    yearsExperience: 20,
    languages: ["English", "Sinhala"],
  },
  {
    id: "doc-rathnayake",
    name: "Dr. Niluka Rathnayake",
    specialty: "Family Physician",
    photo:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80",
    bio: "Family medicine consultant focused on women's health, paediatric care and inbound migrant health screenings.",
    qualifications: "MBBS, MD (Family Medicine)",
    yearsExperience: 12,
    languages: ["English", "Sinhala", "Tamil"],
  },
  {
    id: "doc-jayasinghe",
    name: "Dr. Saman Jayasinghe",
    specialty: "Pulmonologist",
    photo:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80",
    bio: "Consultant pulmonologist managing respiratory health, TB screening and pre-employment chest assessments for international workforces.",
    qualifications: "MBBS, MD (Respiratory Medicine), FCCP",
    yearsExperience: 18,
    languages: ["English", "Sinhala"],
  },
];

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

// ── Context ────────────────────────────────────────────────────────────────
const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [announcement, setAnnouncementState] = useState<Announcement>(() =>
    readJSON(STORAGE_KEYS.announcement, defaultAnnouncement)
  );
  const [doctors, setDoctorsState] = useState<Doctor[]>(() =>
    readJSON(STORAGE_KEYS.doctors, defaultDoctors)
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEYS.auth) === "true";
  });

  // Persist on change
  useEffect(() => writeJSON(STORAGE_KEYS.announcement, announcement), [announcement]);
  useEffect(() => writeJSON(STORAGE_KEYS.doctors, doctors), [doctors]);

  // Cross-tab sync — public site picks up admin edits without a refresh.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === STORAGE_KEYS.announcement && e.newValue) {
        try {
          setAnnouncementState(JSON.parse(e.newValue));
        } catch {
          /* ignore parse errors */
        }
      }
      if (e.key === STORAGE_KEYS.doctors && e.newValue) {
        try {
          setDoctorsState(JSON.parse(e.newValue));
        } catch {
          /* ignore parse errors */
        }
      }
      if (e.key === STORAGE_KEYS.auth) {
        setIsAuthenticated(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAnnouncement = useCallback((a: Announcement) => {
    setAnnouncementState(a);
  }, []);

  const addDoctor = useCallback((d: Omit<Doctor, "id">) => {
    const newDoc: Doctor = {
      ...d,
      id: `doc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    };
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
