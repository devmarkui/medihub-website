import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A generated initials avatar used when a doctor has no photo. Keeps the
 * cards looking intentional (brand-coloured initials) instead of broken/blank.
 */
export function initialsAvatar(name: string) {
  const seed = encodeURIComponent(name || "MEDIHUB");
  return `https://api.dicebear.com/8.x/initials/svg?seed=${seed}&backgroundColor=42BEAD&textColor=ffffff`;
}

/** A doctor's photo, falling back to a generated initials avatar. */
export function doctorPhoto(d: { photo?: string; name: string }) {
  return d.photo && d.photo.trim() ? d.photo : initialsAvatar(d.name);
}
