export type Priority = "LOW" | "MEDIUM" | "HIGH";

export const ACCENTS = ["blue", "purple", "green", "yellow", "pink", "gray"] as const;
export type Accent = (typeof ACCENTS)[number];

export interface Task {
  id: string;
  title: string;
  description?: string | undefined;
  dueDate?: string | undefined; // ISO date (yyyy-MM-dd)
  reminder?: string | undefined; // HH:mm
  priority: Priority;
  category: string;
  tags: string[];
  accent: Accent;
  important: boolean;
  completed: boolean;
  completedAt?: string | undefined;
  createdAt: string;
  order: number;
  demo?: boolean | undefined;
}

export interface Category {
  id: string;
  name: string;
  accent: Accent;
}

export type ViewKey = "all" | "today" | "upcoming" | "completed" | "important";
export type FilterKey = "all" | "active" | "completed" | "high" | "today";
export type SortKey = "due" | "priority" | "created" | "alpha";
export type ThemeMode = "light" | "dark" | "system";
export type Density = "comfortable" | "compact";

export interface Preferences {
  theme: ThemeMode;
  sort: SortKey;
  filter: FilterKey;
  defaultPriority: Priority;
  defaultCategory: string;
  density: Density;
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: "system",
  sort: "due",
  filter: "all",
  defaultPriority: "MEDIUM",
  defaultCategory: "Personal",
  density: "comfortable",
};
