import { useCallback, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  CheckCheck,
  ListTodo,
  Menu,
  Plus,
  SearchX,
  Star,
  Sun,
} from "lucide-react";

import type { Task, ViewKey } from "@/types/task";
import { useTaskora } from "@/hooks/useTaskora";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import {
  computeStats,
  computeStreak,
  computeWeekInsights,
  matchesFilter,
  matchesSearch,
  matchesView,
  sortTasks,
} from "@/lib/tasks";
import { formatLongDate, greeting } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/taskora/Sidebar";
import { MobileNav } from "@/components/taskora/MobileNav";
import { SearchBar } from "@/components/taskora/SearchBar";
import { FilterBar } from "@/components/taskora/FilterBar";
import { ProgressCard } from "@/components/taskora/ProgressCard";
import { InsightsCard } from "@/components/taskora/InsightsCard";
import { TaskCard } from "@/components/taskora/TaskCard";
import { TaskModal } from "@/components/taskora/TaskModal";
import { SettingsPanel } from "@/components/taskora/SettingsPanel";
import { EmptyState } from "@/components/taskora/EmptyState";
import { Logo } from "@/components/taskora/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Taskora Dashboard — Organize today. Achieve tomorrow." },
      {
        name: "description",
        content:
          "Plan your day with Taskora: tasks, categories, priorities, streaks and weekly insights — all stored locally in your browser.",
      },
      { property: "og:title", content: "Taskora — Organize today. Achieve tomorrow." },
      {
        property: "og:description",
        content:
          "A fast, local-first task dashboard for students and makers, with progress tracking and weekly insights.",
      },
    ],
  }),
  component: Dashboard,
});

const VIEW_TITLES: Record<ViewKey, string> = {
  all: "All Tasks",
  today: "Today",
  upcoming: "Upcoming",
  completed: "Completed",
  important: "Important",
};

function Dashboard() {
  const store = useTaskora();
  const { preferences, tasks, categories } = store;
  useTheme(preferences.theme, store.hydrated);

  const [view, setView] = useState<ViewKey>("all");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | undefined>(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dragId = useRef<string | null>(null);
  const overId = useRef<string | null>(null);

  const openNewTask = useCallback(() => {
    setEditing(undefined);
    setModalOpen(true);
  }, []);

  useKeyboardShortcuts({
    onNewTask: openNewTask,
    onFocusSearch: () => searchRef.current?.focus(),
  });

  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const insights = useMemo(() => computeWeekInsights(tasks), [tasks]);
  const streak = useMemo(() => computeStreak(tasks), [tasks]);

  const counts = useMemo(
    () =>
      ({
        all: tasks.length,
        today: tasks.filter((t) => matchesView(t, "today")).length,
        upcoming: tasks.filter((t) => matchesView(t, "upcoming")).length,
        completed: tasks.filter((t) => matchesView(t, "completed")).length,
        important: tasks.filter((t) => matchesView(t, "important")).length,
      }) as Record<ViewKey, number>,
    [tasks],
  );

  const visible = useMemo(() => {
    const filtered = tasks.filter(
      (t) =>
        matchesView(t, view, category) &&
        matchesFilter(t, preferences.filter) &&
        matchesSearch(t, query),
    );
    return sortTasks(filtered, preferences.sort);
  }, [tasks, view, category, preferences.filter, preferences.sort, query]);

  const handleDrop = () => {
    const from = dragId.current;
    const to = overId.current;
    dragId.current = null;
    overId.current = null;
    if (!from || !to || from === to) return;
    const ids = visible.map((t) => t.id);
    const fromIdx = ids.indexOf(from);
    const toIdx = ids.indexOf(to);
    if (fromIdx === -1 || toIdx === -1) return;
    ids.splice(toIdx, 0, ids.splice(fromIdx, 1)[0]!);
    store.reorderTasks(ids);
  };

  const emptyState = () => {
    if (query.trim())
      return (
        <EmptyState
          icon={SearchX}
          title="No matches"
          message={`Nothing matches “${query.trim()}”. Try another keyword, or create it as a task.`}
          actionLabel="Add task"
          onAction={openNewTask}
        />
      );
    switch (view) {
      case "today":
        return (
          <EmptyState
            icon={Sun}
            title="Today is clear"
            message="No tasks due today. Add one to keep your streak alive."
            actionLabel="Add today's task"
            onAction={openNewTask}
          />
        );
      case "upcoming":
        return (
          <EmptyState
            icon={CalendarClock}
            title="Nothing scheduled"
            message="Plan ahead — future tasks with a due date show up here."
            actionLabel="Schedule a task"
            onAction={openNewTask}
          />
        );
      case "completed":
        return (
          <EmptyState
            icon={CheckCheck}
            title="No completed tasks yet"
            message="Finished tasks land here so you can see your progress."
          />
        );
      case "important":
        return (
          <EmptyState
            icon={Star}
            title="Nothing starred"
            message="Star a task to keep your most important work in one place."
          />
        );
      default:
        return (
          <EmptyState
            icon={ListTodo}
            title="Your board is empty"
            message="Add your first task and Taskora will track your progress from there."
            actionLabel="Add your first task"
            onAction={openNewTask}
          />
        );
    }
  };

  const sidebar = (
    <Sidebar
      view={view}
      onViewChange={(v) => {
        setView(v);
        setMenuOpen(false);
      }}
      categories={categories}
      activeCategory={category}
      onCategoryChange={setCategory}
      counts={counts}
      onOpenSettings={() => {
        setSettingsOpen(true);
        setMenuOpen(false);
      }}
      onAddCategory={store.addCategory}
      onRemoveCategory={store.removeCategory}
    />
  );

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="sticky top-0 hidden h-dvh w-[264px] shrink-0 border-r border-border bg-surface lg:block">
          {sidebar}
        </aside>

        <main id="main" className="min-w-0 flex-1 pb-24 lg:pb-10">
          <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 rounded-xl lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="size-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <SheetTitle className="sr-only">Taskora menu</SheetTitle>
                  {sidebar}
                </SheetContent>
              </Sheet>

              <Logo className="lg:hidden" showWordmark={false} />

              <div className="hidden min-w-0 flex-1 sm:block">
                <SearchBar ref={searchRef} value={query} onChange={setQuery} />
              </div>

              <Button className="ml-auto shrink-0 rounded-xl" onClick={openNewTask}>
                <Plus className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Add Task</span>
                <span className="sr-only sm:hidden">Add Task</span>
              </Button>
            </div>
            <div className="mt-3 sm:hidden">
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </header>

          <div className="space-y-6 px-4 py-6 sm:px-6">
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">
                {greeting()}, let&apos;s get things done
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{formatLongDate()}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProgressCard
                  todayCompleted={stats.todayCompleted}
                  todayTotal={stats.todayTotal}
                  completed={stats.completed}
                  remaining={stats.remaining}
                  highPriority={stats.highPriority}
                  streak={streak}
                />
              </div>
              <InsightsCard
                completed={insights.completed}
                rate={insights.rate}
                mostActive={insights.mostActive}
              />
            </div>

            <FilterBar
              filter={preferences.filter}
              onFilterChange={(f) => store.updatePreferences({ filter: f })}
              sort={preferences.sort}
              onSortChange={(s) => store.updatePreferences({ sort: s })}
            />

            <section aria-labelledby="task-list-heading" className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 id="task-list-heading" className="text-sm font-semibold">
                  {category ?? VIEW_TITLES[view]}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {visible.length} {visible.length === 1 ? "task" : "tasks"}
                  </span>
                </h2>
                <span className="hidden text-xs text-muted-foreground sm:block">
                  Press <kbd className="rounded bg-muted px-1.5 py-0.5">N</kbd> for a new task,{" "}
                  <kbd className="rounded bg-muted px-1.5 py-0.5">/</kbd> to search
                </span>
              </div>

              {visible.length === 0 ? (
                emptyState()
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {visible.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        density={preferences.density}
                        onToggle={store.toggleComplete}
                        onToggleImportant={store.toggleImportant}
                        onEdit={(t) => {
                          setEditing(t);
                          setModalOpen(true);
                        }}
                        onDelete={store.deleteTask}
                        draggable
                        onDragStart={(id) => (dragId.current = id)}
                        onDragOver={(id) => (overId.current = id)}
                        onDrop={handleDrop}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </section>
          </div>
        </main>
      </div>

      <MobileNav
        view={view}
        onViewChange={(v) => {
          setView(v);
          setCategory(undefined);
        }}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={editing}
        categories={categories}
        preferences={preferences}
        onCreate={store.addTask}
        onUpdate={store.updateTask}
      />

      <SettingsPanel
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        preferences={preferences}
        categories={categories}
        onChange={store.updatePreferences}
        onClearCompleted={store.clearCompleted}
        onClearAll={store.clearAllData}
      />
    </div>
  );
}
