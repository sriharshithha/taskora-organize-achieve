import { CalendarDays, Bell, GripVertical, Pencil, Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Density, Task } from "@/types/task";
import { accentClasses } from "@/lib/tasks";
import { formatDue, isOverdue } from "@/lib/date";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskCardProps {
  task: Task;
  density: Density;
  onToggle: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (id: string) => void;
  onDragOver?: (id: string) => void;
  onDrop?: () => void;
}

const priorityStyles: Record<Task["priority"], string> = {
  HIGH: "text-accent-pink",
  MEDIUM: "text-accent-yellow",
  LOW: "text-muted-foreground",
};

export function TaskCard({
  task,
  density,
  onToggle,
  onToggleImportant,
  onEdit,
  onDelete,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: TaskCardProps) {
  const accent = accentClasses[task.accent];
  const due = formatDue(task.dueDate);
  const overdue = !task.completed && isOverdue(task.dueDate);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      draggable={draggable}
      onDragStart={() => onDragStart?.(task.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(task.id);
      }}
      onDrop={() => onDrop?.()}
      className={`group card-surface relative flex gap-3 overflow-hidden transition-shadow hover:shadow-lift ${
        density === "compact" ? "p-3" : "p-4"
      } ${task.completed ? "opacity-70" : ""}`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${accent.bar}`} aria-hidden="true" />

      {draggable && (
        <span
          className="mt-1 hidden cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block"
          aria-hidden="true"
        >
          <GripVertical className="size-4" />
        </span>
      )}

      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={task.completed ? `Mark ${task.title} as active` : `Complete ${task.title}`}
        className="mt-0.5 size-5 shrink-0 rounded-md"
      />

      <button
        type="button"
        onClick={() => onEdit(task)}
        className="min-w-0 flex-1 text-left"
        aria-label={`Open details for ${task.title}`}
      >
        <span
          className={`block truncate text-sm font-semibold transition-all duration-300 ${
            task.completed ? "text-muted-foreground line-through" : ""
          }`}
        >
          {task.title}
        </span>
        {task.description && density !== "compact" && (
          <span className="mt-1 line-clamp-2 block text-xs text-muted-foreground">
            {task.description}
          </span>
        )}
        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px]">
          <span className={`rounded-full px-2 py-0.5 font-medium ${accent.chip}`}>
            {task.category}
          </span>
          {due && (
            <span
              className={`inline-flex items-center gap-1 ${
                overdue ? "font-medium text-destructive" : "text-muted-foreground"
              }`}
            >
              <CalendarDays className="size-3" aria-hidden="true" />
              {due}
            </span>
          )}
          {task.reminder && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Bell className="size-3" aria-hidden="true" />
              {task.reminder}
            </span>
          )}
          <span className={`font-medium ${priorityStyles[task.priority]}`}>{task.priority}</span>
          {task.tags.map((tag) => (
            <span key={tag} className="text-muted-foreground">
              #{tag}
            </span>
          ))}
        </span>
      </button>

      <div className="flex shrink-0 items-start gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onToggleImportant(task.id)}
          aria-label={task.important ? `Unmark ${task.title} important` : `Mark ${task.title} important`}
          aria-pressed={task.important}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-accent-yellow"
        >
          <Star
            className={`size-4 ${task.important ? "fill-accent-yellow text-accent-yellow" : ""}`}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </motion.li>
  );
}
