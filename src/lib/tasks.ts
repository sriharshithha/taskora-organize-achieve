import type { Accent, FilterKey, SortKey, Task, ViewKey } from "@/types/task";
import { addDaysISO, todayISO } from "@/lib/date";

export const accentClasses: Record<Accent, { dot: string; chip: string; bar: string }> = {
  blue: {
    dot: "bg-accent-blue",
    chip: "bg-accent-blue/12 text-accent-blue",
    bar: "bg-accent-blue",
  },
  purple: {
    dot: "bg-accent-purple",
    chip: "bg-accent-purple/12 text-accent-purple",
    bar: "bg-accent-purple",
  },
  green: {
    dot: "bg-accent-green",
    chip: "bg-accent-green/12 text-accent-green",
    bar: "bg-accent-green",
  },
  yellow: {
    dot: "bg-accent-yellow",
    chip: "bg-accent-yellow/15 text-accent-yellow",
    bar: "bg-accent-yellow",
  },
  pink: {
    dot: "bg-accent-pink",
    chip: "bg-accent-pink/12 text-accent-pink",
    bar: "bg-accent-pink",
  },
  gray: {
    dot: "bg-accent-gray",
    chip: "bg-accent-gray/15 text-accent-gray",
    bar: "bg-accent-gray",
  },
};

export function matchesSearch(task: Task, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    task.title.toLowerCase().includes(q) ||
    (task.description ?? "").toLowerCase().includes(q) ||
    task.category.toLowerCase().includes(q) ||
    task.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function matchesView(task: Task, view: ViewKey, category?: string): boolean {
  if (category && task.category !== category) return false;
  switch (view) {
    case "today":
      return !task.completed && !!task.dueDate && task.dueDate <= todayISO();
    case "upcoming":
      return !task.completed && !!task.dueDate && task.dueDate > todayISO();
    case "completed":
      return task.completed;
    case "important":
      return task.important;
    default:
      return true;
  }
}

export function matchesFilter(task: Task, filter: FilterKey): boolean {
  switch (filter) {
    case "active":
      return !task.completed;
    case "completed":
      return task.completed;
    case "high":
      return task.priority === "HIGH";
    case "today":
      return task.dueDate === todayISO();
    default:
      return true;
  }
}

const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;

export function sortTasks(tasks: Task[], sort: SortKey): Task[] {
  const list = [...tasks];
  switch (sort) {
    case "priority":
      return list.sort(
        (a, b) => priorityRank[a.priority] - priorityRank[b.priority] || a.order - b.order,
      );
    case "created":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "alpha":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "due":
    default:
      return list.sort((a, b) => {
        if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate)
          return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        return a.order - b.order;
      });
  }
}

export function computeStats(tasks: Task[]) {
  const today = todayISO();
  const todays = tasks.filter((t) => t.dueDate === today);
  const todayCompleted = todays.filter((t) => t.completed).length;
  return {
    todayTotal: todays.length,
    todayCompleted,
    completed: tasks.filter((t) => t.completed).length,
    remaining: tasks.filter((t) => !t.completed).length,
    highPriority: tasks.filter((t) => !t.completed && t.priority === "HIGH").length,
  };
}

export function computeWeekInsights(tasks: Task[]) {
  const weekStart = addDaysISO(-6);
  const inWeek = tasks.filter(
    (t) => t.completedAt && t.completedAt.slice(0, 10) >= weekStart && t.completed,
  );
  const touched = tasks.filter((t) => (t.dueDate ?? t.createdAt.slice(0, 10)) >= weekStart);
  const counts = new Map<string, number>();
  touched.forEach((t) => counts.set(t.category, (counts.get(t.category) ?? 0) + 1));
  const mostActive = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const rate = touched.length ? Math.round((inWeek.length / touched.length) * 100) : 0;
  return { completed: inWeek.length, rate, mostActive };
}

export function computeStreak(tasks: Task[]): number {
  const days = new Set(
    tasks.filter((t) => t.completed && t.completedAt).map((t) => t.completedAt!.slice(0, 10)),
  );
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const day = addDaysISO(-i);
    if (days.has(day)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export function createId(): string {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
