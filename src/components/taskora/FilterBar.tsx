import type { FilterKey, SortKey } from "@/types/task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "high", label: "High Priority" },
  { key: "today", label: "Today" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "due", label: "Due date" },
  { key: "priority", label: "Priority" },
  { key: "created", label: "Recently created" },
  { key: "alpha", label: "Alphabetical" },
];

interface FilterBarProps {
  filter: FilterKey;
  onFilterChange: (f: FilterKey) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
}

export function FilterBar({ filter, onFilterChange, sort, onSortChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tasks">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => onFilterChange(f.key)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Sort</span>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortKey)}>
          <SelectTrigger className="h-9 w-[168px] rounded-xl" aria-label="Sort tasks">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.key} value={s.key}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
