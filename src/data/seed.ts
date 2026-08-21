import type { Category, Task } from "@/types/task";
import { addDaysISO, todayISO } from "@/lib/date";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "personal", name: "Personal", accent: "blue" },
  { id: "college", name: "College", accent: "purple" },
  { id: "projects", name: "Projects", accent: "green" },
  { id: "work", name: "Work", accent: "yellow" },
  { id: "learning", name: "Learning", accent: "pink" },
];

type SeedInput = Omit<Task, "id" | "createdAt" | "order" | "demo" | "tags"> & {
  tags?: string[];
};

const seeds: SeedInput[] = [
  {
    title: "Complete portfolio website",
    description: "Polish the projects section and ship the responsive layout.",
    dueDate: todayISO(),
    priority: "HIGH",
    category: "Projects",
    accent: "green",
    important: true,
    completed: false,
    tags: ["portfolio", "design"],
  },
  {
    title: "Prepare AI internship project",
    description: "Draft the problem statement and clean the dataset.",
    dueDate: todayISO(),
    priority: "HIGH",
    category: "Learning",
    accent: "purple",
    important: true,
    completed: false,
    tags: ["ai"],
  },
  {
    title: "Practice Python",
    description: "30 minutes of array and string problems.",
    dueDate: todayISO(),
    priority: "MEDIUM",
    category: "Learning",
    accent: "pink",
    important: false,
    completed: true,
    tags: ["python"],
  },
  {
    title: "Review DBMS notes",
    description: "Normalization, indexing and transactions.",
    dueDate: addDaysISO(1),
    priority: "MEDIUM",
    category: "College",
    accent: "blue",
    important: false,
    completed: false,
    tags: ["dbms", "revision"],
  },
  {
    title: "Complete Python assignment",
    dueDate: addDaysISO(2),
    priority: "HIGH",
    category: "College",
    accent: "purple",
    important: false,
    completed: false,
    tags: ["assignment"],
  },
  {
    title: "Prepare for tomorrow's exam",
    description: "Two revision passes plus a mock paper.",
    dueDate: addDaysISO(1),
    priority: "HIGH",
    category: "College",
    accent: "yellow",
    important: true,
    completed: false,
    tags: ["exam"],
  },
  {
    title: "Finish AI project",
    dueDate: addDaysISO(4),
    priority: "MEDIUM",
    category: "Projects",
    accent: "green",
    important: false,
    completed: false,
    tags: ["ai", "ml"],
  },
  {
    title: "Apply for internship",
    description: "Send three tailored applications.",
    dueDate: addDaysISO(3),
    priority: "LOW",
    category: "Work",
    accent: "gray",
    important: false,
    completed: false,
    tags: ["career"],
  },
];

export function createSeedTasks(): Task[] {
  const now = Date.now();
  return seeds.map((s, i) => ({
    ...s,
    tags: s.tags ?? [],
    id: `demo-${i + 1}`,
    createdAt: new Date(now - (seeds.length - i) * 60000).toISOString(),
    completedAt: s.completed ? new Date(now - 3600_000).toISOString() : undefined,
    order: i,
    demo: true,
  }));
}
