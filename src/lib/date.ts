export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDaysISO(days: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return todayISO(d);
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function isValidISODate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = parseISO(iso);
  return !Number.isNaN(d.getTime());
}

export function formatLongDate(d: Date = new Date()): string {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatDue(iso?: string): string | undefined {
  if (!iso) return undefined;
  const today = todayISO();
  if (iso === today) return "Today";
  if (iso === addDaysISO(1)) return "Tomorrow";
  if (iso === addDaysISO(-1)) return "Yesterday";
  return parseISO(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function isOverdue(iso?: string): boolean {
  if (!iso) return false;
  return iso < todayISO();
}

export function startOfWeekISO(from: Date = new Date()): string {
  const d = new Date(from);
  const diff = (d.getDay() + 6) % 7; // Monday start
  d.setDate(d.getDate() - diff);
  return todayISO(d);
}

export function greeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
