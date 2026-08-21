import { useState } from "react";
import { Plus, Settings, Tag, Trash2 } from "lucide-react";
import type { Category, ViewKey } from "@/types/task";
import { NAV_ITEMS } from "@/data/nav";
import { accentClasses } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "./Logo";

interface SidebarProps {
  view: ViewKey;
  onViewChange: (view: ViewKey) => void;
  categories: Category[];
  activeCategory?: string | undefined;
  onCategoryChange: (name?: string) => void;
  counts: Record<ViewKey, number>;
  onOpenSettings: () => void;
  onAddCategory: (name: string) => boolean;
  onRemoveCategory: (id: string) => void;
}

export function Sidebar({
  view,
  onViewChange,
  categories,
  activeCategory,
  onCategoryChange,
  counts,
  onOpenSettings,
  onAddCategory,
  onRemoveCategory,
}: SidebarProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const submit = () => {
    if (onAddCategory(name)) {
      setName("");
      setAdding(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <Logo className="px-2 pt-2" />

      <nav aria-label="Task views" className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = view === item.key && !activeCategory;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onViewChange(item.key);
                onCategoryChange(undefined);
              }}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-left">{item.label}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{counts[item.key]}</span>
            </button>
          );
        })}
      </nav>

      <div>
        <div className="flex items-center justify-between px-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </h2>
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            aria-label="Add category"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>

        {adding && (
          <div className="mt-2 flex gap-2 px-1">
            <Input
              value={name}
              autoFocus
              placeholder="New category"
              aria-label="New category name"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") setAdding(false);
              }}
              className="h-9 rounded-lg"
            />
            <Button size="sm" className="h-9 rounded-lg" onClick={submit}>
              Add
            </Button>
          </div>
        )}

        <ul className="mt-2 space-y-1">
          {categories.map((c) => {
            const active = activeCategory === c.name;
            return (
              <li key={c.id} className="group flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    onViewChange("all");
                    onCategoryChange(active ? undefined : c.name);
                  }}
                  aria-pressed={active}
                  className={`flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-primary-soft font-medium text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span
                    className={`size-2.5 rounded-full ${accentClasses[c.accent].dot}`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{c.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveCategory(c.id)}
                  aria-label={`Remove category ${c.name}`}
                  className="ml-1 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
          {categories.length === 0 && (
            <li className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <Tag className="size-3.5" aria-hidden="true" /> No categories yet
            </li>
          )}
        </ul>
      </div>

      <div className="mt-auto">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Settings className="size-4" aria-hidden="true" />
          Settings
        </button>
        <p className="px-3 pt-3 text-[11px] text-muted-foreground">
          Organize today. Achieve tomorrow.
        </p>
      </div>
    </div>
  );
}
