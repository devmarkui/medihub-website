/**
 * Thin client for the MEDIHUB PHP backend (see /public/api/*.php).
 *
 * Every call is wrapped so a missing/unreachable backend (e.g. during local
 * `vite dev`, where there is no PHP) fails softly — the app then falls back to
 * its localStorage cache instead of crashing.
 */
import type {
  Announcement,
  Appointment,
  Doctor,
  NotificationSettings,
} from "@/contexts/AdminDataContext";

const API_BASE = "/api";
const TOKEN_KEY = "medihub:admin-token";

export const setApiToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
};

export const clearApiToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

/** Whether we currently hold a session token (used to gate "authenticated"). */
export const getApiToken = () => getToken();

const adminHeaders = () => ({
  "Content-Type": "application/json",
  "X-Admin-Token": getToken(),
});

export const api = {
  /** Exchange the admin password for a session token. Returns the token,
   *  null when the password is wrong, or "unreachable" when there is no
   *  backend (so the caller can decide on a dev fallback). */
  async login(password: string): Promise<string | null | "unreachable"> {
    try {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) return null;
      if (!res.ok) return "unreachable";
      const data = await res.json();
      return typeof data?.token === "string" ? data.token : null;
    } catch {
      return "unreachable";
    }
  },

  async getAnnouncement(): Promise<Announcement | null> {
    try {
      const res = await fetch(`${API_BASE}/announcement.php`, { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as Announcement;
    } catch {
      return null;
    }
  },

  async saveAnnouncement(a: Announcement): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/announcement.php`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(a),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getAppointments(): Promise<Appointment[] | null> {
    try {
      const res = await fetch(`${API_BASE}/appointments.php`, {
        headers: adminHeaders(),
        cache: "no-store",
      });
      if (!res.ok) return null;
      return (await res.json()) as Appointment[];
    } catch {
      return null;
    }
  },

  async createAppointment(a: Appointment): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/appointments.php?action=create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /** Send the full updated appointment as the patch (string keys overwrite). */
  async updateAppointment(id: string, full: Appointment): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/appointments.php?action=update`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ id, patch: full }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteAppointment(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/appointments.php?action=delete`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ id }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /** Returns the saved doctors, or null if none saved yet (use defaults). */
  async getDoctors(): Promise<Doctor[] | null> {
    try {
      const res = await fetch(`${API_BASE}/doctors.php`, { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) ? (data as Doctor[]) : null;
    } catch {
      return null;
    }
  },

  async saveDoctors(doctors: Doctor[]): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/doctors.php`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ doctors }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getSettings(): Promise<NotificationSettings | null> {
    try {
      const res = await fetch(`${API_BASE}/settings.php`, {
        headers: adminHeaders(),
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data && typeof data === "object" ? (data as NotificationSettings) : null;
    } catch {
      return null;
    }
  },

  async saveSettings(s: NotificationSettings): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/settings.php`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(s),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
