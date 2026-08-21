import { useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import type { Category, Density, Preferences, Priority, ThemeMode } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: Preferences;
  categories: Category[];
  onChange: (patch: Partial<Preferences>) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
}

const THEMES: { key: ThemeMode; label: string; icon: typeof Sun }[] = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
];

export function SettingsPanel({
  open,
  onOpenChange,
  preferences,
  categories,
  onChange,
  onClearCompleted,
  onClearAll,
}: SettingsPanelProps) {
  const [confirm, setConfirm] = useState<null | "completed" | "all">(null);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Settings</DialogTitle>
            <DialogDescription>
              Preferences are saved on this device. Taskora never sends your data anywhere.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((t) => {
                  const active = preferences.theme === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onChange({ theme: t.key })}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <t.icon className="size-4" aria-hidden="true" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pref-priority">Default priority</Label>
                <Select
                  value={preferences.defaultPriority}
                  onValueChange={(v) => onChange({ defaultPriority: v as Priority })}
                >
                  <SelectTrigger id="pref-priority" className="h-10 rounded-xl">
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
                <Label htmlFor="pref-category">Default category</Label>
                <Select
                  value={preferences.defaultCategory}
                  onValueChange={(v) => onChange({ defaultCategory: v })}
                >
                  <SelectTrigger id="pref-category" className="h-10 rounded-xl">
                    <SelectValue />
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

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pref-density">Task density</Label>
                <Select
                  value={preferences.density}
                  onValueChange={(v) => onChange({ density: v as Density })}
                >
                  <SelectTrigger id="pref-density" className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <h3 className="text-sm font-semibold">Data</h3>
              <p className="text-xs text-muted-foreground">
                These actions affect only this browser. Clearing all data cannot be undone.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setConfirm("completed")}
                >
                  Clear completed
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-xl"
                  onClick={() => setConfirm("all")}
                >
                  Clear all data
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "all" ? "Clear all Taskora data?" : "Clear completed tasks?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "all"
                ? "Every task, category and preference stored in this browser will be removed."
                : "Completed tasks will be removed. You can undo this right after."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl"
              onClick={() => {
                if (confirm === "all") onClearAll();
                else onClearCompleted();
                setConfirm(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
