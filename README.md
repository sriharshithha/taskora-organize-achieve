# Taskora — Organize today. Achieve tomorrow.

Taskora is a fast, local-first task manager for students and makers. It opens straight into a
dashboard (no marketing page, no login), keeps everything in your browser's `localStorage`, and
never makes a network request for your data.

## Features

- **Dashboard first** — greeting, today's date, global search and a prominent **Add Task** button.
- **Today's Progress card** — completed/total, animated progress bar, stats for completed,
  remaining and high-priority tasks, plus a 🔥 daily streak.
- **This week insights** — tasks completed, completion rate and most active category.
- **Views** — All Tasks, Today, Upcoming, Completed, Important, plus per-category filtering.
- **Search / filter / sort** — instant search across title, description, category and tags;
  filter chips (All, Active, Completed, High Priority, Today); sort by due date, priority,
  recently created or alphabetical. Filter and sort persist.
- **Rich tasks** — title, description, due date, reminder, priority (LOW/MEDIUM/HIGH), category,
  tags, color accent and important flag. Fast flow: title + Enter.
- **Task actions** — complete with a smooth muted strikethrough, star, edit, delete with an
  **Undo** toast, and lightweight optional drag-and-drop reordering.
- **Categories** — Personal, College, Projects, Work, Learning by default; add or remove your own.
- **Settings** — Light/Dark/System theme, default priority, default category, task density,
  clear completed and clear all data (both confirmed before running).
- **Empty states** — tailored copy for every view, plus search.
- **Keyboard shortcuts** — `N` new task, `/` focus search, `Esc` close modal / clear search,
  `Enter` create task. Shortcuts never fire while you're typing.
- **Accessible & responsive** — semantic HTML, ARIA labels, visible focus rings, works from
  1440px down to 375px with a touch-friendly bottom nav on mobile.

Demo tasks are seeded on first run and are clearly recognisable (portfolio website, AI internship
project, Python practice, DBMS notes, and more). Use **Settings → Clear all data** to start fresh.

## Stack

- React 19 + TypeScript
- TanStack Start / TanStack Router (Vite 8)
- Tailwind CSS v4 (CSS-first design tokens in `src/styles.css`)
- shadcn/ui primitives (Radix), Lucide React icons, Sonner toasts
- Framer Motion for small, purposeful interactions

## Project structure

```
src/
  components/taskora/   TaskCard, TaskModal, Sidebar, MobileNav, SearchBar,
                        FilterBar, ProgressCard, InsightsCard, SettingsPanel,
                        EmptyState, Logo
  components/ui/        shadcn primitives
  hooks/                useTaskora (state + persistence), useTheme, useKeyboardShortcuts
  lib/                  storage.ts, date.ts, tasks.ts (filter/sort/stats helpers)
  data/                 seed.ts (demo tasks + default categories), nav.ts
  types/                task.ts
  routes/               __root.tsx, index.tsx (dashboard)
```

## Run locally

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # production build
```

## Deploy

**Vercel** — import the repository, framework preset "Other", build command `npm run build`.
**Netlify** — build command `npm run build`, publish the generated output directory.
No environment variables or backend services are required.

## Future improvements

- Subtasks and checklists
- Recurring tasks and real browser notifications for reminders
- Calendar / week board view
- Export & import JSON backups, optional cloud sync
- Command palette and bulk actions
