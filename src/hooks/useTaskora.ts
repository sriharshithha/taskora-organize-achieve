import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Category, Preferences, Task } from "@/types/task";
import { DEFAULT_PREFERENCES } from "@/types/task";
import { STORAGE_KEYS, clearAllStorage, loadJSON, saveJSON } from "@/lib/storage";
import { DEFAULT_CATEGORIES, createSeedTasks } from "@/data/seed";
import { createId } from "@/lib/tasks";

export type NewTaskInput = Omit<
  Task,
  "id" | "createdAt" | "order" | "completed" | "completedAt" | "demo"
>;

export function useTaskora() {
  const [hydrated, setHydrated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const warned = useRef(false);

  // Load once on the client (SSR-safe).
  useEffect(() => {
    const seeded = loadJSON<boolean>(STORAGE_KEYS.seeded, false);
    const storedTasks = loadJSON<Task[] | null>(STORAGE_KEYS.tasks, null);
    setTasks(seeded && storedTasks ? storedTasks : createSeedTasks());
    setCategories(loadJSON<Category[]>(STORAGE_KEYS.categories, DEFAULT_CATEGORIES));
    setPreferences({
      ...DEFAULT_PREFERENCES,
      ...loadJSON<Partial<Preferences>>(STORAGE_KEYS.preferences, {}),
    });
    setHydrated(true);
  }, []);

  const persist = useCallback((key: string, value: unknown) => {
    const ok = saveJSON(key, value);
    if (!ok && !warned.current) {
      warned.current = true;
      toast.error("Couldn't save locally", {
        description: "Your browser blocked storage, so changes may not persist.",
      });
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(STORAGE_KEYS.tasks, tasks);
    persist(STORAGE_KEYS.seeded, true);
  }, [tasks, hydrated, persist]);

  useEffect(() => {
    if (!hydrated) return;
    persist(STORAGE_KEYS.categories, categories);
  }, [categories, hydrated, persist]);

  useEffect(() => {
    if (!hydrated) return;
    persist(STORAGE_KEYS.preferences, preferences);
  }, [preferences, hydrated, persist]);

  const addTask = useCallback((input: NewTaskInput) => {
    const task: Task = {
      ...input,
      id: createId(),
      createdAt: new Date().toISOString(),
      completed: false,
      order: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
    toast.success("Task added", { description: task.title });
    return task;
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>, silent = false) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    if (!silent) toast.success("Task updated");
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t,
      ),
    );
  }, []);

  const toggleImportant = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, important: !t.important } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    let removed: Task | undefined;
    setTasks((prev) => {
      removed = prev.find((t) => t.id === id);
      return prev.filter((t) => t.id !== id);
    });
    toast("Task deleted", {
      description: removed?.title,
      action: {
        label: "Undo",
        onClick: () => {
          if (removed) setTasks((prev) => (prev.some((t) => t.id === id) ? prev : [removed!, ...prev]));
        },
      },
    });
  }, []);

  const reorderTasks = useCallback((orderedIds: string[]) => {
    setTasks((prev) =>
      prev.map((t) => {
        const idx = orderedIds.indexOf(t.id);
        return idx === -1 ? t : { ...t, order: idx };
      }),
    );
  }, []);

  const addCategory = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) {
      toast.error("Category name can't be empty");
      return false;
    }
    let created = false;
    setCategories((prev) => {
      if (prev.some((c) => c.name.toLowerCase() === clean.toLowerCase())) {
        toast.error("That category already exists");
        return prev;
      }
      created = true;
      const accents = ["blue", "purple", "green", "yellow", "pink", "gray"] as const;
      return [
        ...prev,
        { id: createId(), name: clean, accent: accents[prev.length % accents.length]! },
      ];
    });
    return created;
  }, []);

  const removeCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category removed");
  }, []);

  const clearCompleted = useCallback(() => {
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => !t.completed));
    toast("Completed tasks cleared", {
      action: { label: "Undo", onClick: () => setTasks(snapshot) },
    });
  }, [tasks]);

  const clearAllData = useCallback(() => {
    clearAllStorage();
    setTasks([]);
    setCategories(DEFAULT_CATEGORIES);
    setPreferences(DEFAULT_PREFERENCES);
    toast.success("All local data cleared");
  }, []);

  const updatePreferences = useCallback(
    (patch: Partial<Preferences>) => setPreferences((prev) => ({ ...prev, ...patch })),
    [],
  );

  return {
    hydrated,
    tasks,
    categories,
    preferences,
    addTask,
    updateTask,
    toggleComplete,
    toggleImportant,
    deleteTask,
    reorderTasks,
    addCategory,
    removeCategory,
    clearCompleted,
    clearAllData,
    updatePreferences,
  };
}

export type TaskoraStore = ReturnType<typeof useTaskora>;
