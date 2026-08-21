const PREFIX = "taskora:";

export const STORAGE_KEYS = {
  tasks: `${PREFIX}tasks`,
  categories: `${PREFIX}categories`,
  preferences: `${PREFIX}preferences`,
  streak: `${PREFIX}streak`,
  seeded: `${PREFIX}seeded`,
} as const;

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function clearAllStorage() {
  if (typeof window === "undefined") return;
  try {
    Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}
