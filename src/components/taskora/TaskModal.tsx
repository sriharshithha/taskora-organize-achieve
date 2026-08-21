import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Accent, Category, Preferences, Priority, Task } from "@/types/task";
import { ACCENTS } from "@/types/task";
import { accentClasses } from "@/lib/tasks";
import { isValidISODate } from "@/lib/date";
import type { NewTaskInput } from "@/hooks/useTaskora";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | undefined;
  categories: Category[];
  preferences: Preferences;
  onCreate: (input: NewTaskInput) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
}

interface FormState {
  title: string;
  description: string;
  dueDate: string;
  reminder: string;
  priority: Priority;
  category: string;
  tags: string;
  accent: Accent;
  important: boolean;
}

export function TaskModal({
  open,
  onOpenChange,
  task,
  categories,
  preferences,
  onCreate,
  onUpdate,
}: TaskModalProps) {
  const initial = useMemo<FormState>(
    () => ({
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: task?.dueDate ?? "",
      reminder: task?.reminder ?? "",
      priority: task?.priority ?? preferences.defaultPriority,
      category: task?.category ?? preferences.defaultCategory,
      tags: task?.tags.join(", ") ?? "",
      accent: task?.accent ?? "blue",
      important: task?.important ?? false,
    }),
    [task, preferences],
  );

  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const submitting = useRef(false);

  useEffect(() => {
    if (open) {
      setForm(initial);
      setError(null);
      setShowDetails(Boolean(task));
      submitting.current = false;
    }
  }, [open, initial, task]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = () => {
    if (submitting.current) return; // duplicate-action protection
    const title = form.title.trim();
    if (!title) {
      setError("Give your task a title so you can find it later.");
      return;
    }
    if (form.dueDate && !isValidISODate(form.dueDate)) {
      setError("That due date doesn't look right. Try picking one from the calendar.");
      return;
    }
    submitting.current = true;

    const payload: NewTaskInput = {
      title,
      description: form.description.trim() || undefined,
      dueDate: form.dueDate || undefined,
      reminder: form.reminder || undefined,
      priority: form.priority,
      category: form.category || preferences.defaultCategory,
      tags: form.tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean),
      accent: form.accent,
      important: form.important,
    };

    if (task) onUpdate(task.id, payload);
    else onCreate(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update the details and save." : "Type a title and press Enter to add it fast."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              autoFocus
              value={form.title}
              placeholder="e.g. Review DBMS notes"
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                set("title", e.target.value);
                if (error) setError(null);
              }}
              className="h-11 rounded-xl"
            />
            {error && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {error}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            aria-expanded={showDetails}
            className="flex items-center gap-1.5 text-xs font-medium text-primary"
          >
            <ChevronDown
              className={`size-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
            {showDetails ? "Hide details" : "Add details"}
          </button>

          {showDetails && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="task-desc">Description</Label>
                <Textarea
                  id="task-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="task-due">Due date</Label>
                  <Input
                    id="task-due"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => set("dueDate", e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="task-reminder">Reminder</Label>
                  <Input
                    id="task-reminder"
                    type="time"
                    value={form.reminder}
                    onChange={(e) => set("reminder", e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v) => set("priority", v as Priority)}
                  >
                    <SelectTrigger id="task-priority" className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">LOW</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                      <SelectItem value="HIGH">HIGH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="task-category">Category</Label>
                  <Select value={form.category} onValueChange={(v) => set("category", v)}>
                    <SelectTrigger id="task-category" className="h-10 rounded-xl">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="task-tags">Tags</Label>
                <Input
                  id="task-tags"
                  value={form.tags}
                  placeholder="python, revision"
                  onChange={(e) => set("tags", e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-medium">Color accent</legend>
                <div className="flex gap-2">
                  {ACCENTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => set("accent", a)}
                      aria-label={`${a} accent`}
                      aria-pressed={form.accent === a}
                      className={`size-7 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110 ${
                        accentClasses[a].dot
                      } ${form.accent === a ? "ring-2 ring-ring" : ""}`}
                    />
                  ))}
                </div>
              </fieldset>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.important}
                  onChange={(e) => set("important", e.target.checked)}
                  className="size-4 rounded border-border accent-primary"
                />
                Mark as important
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl">
              {task ? "Save changes" : "Add task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
