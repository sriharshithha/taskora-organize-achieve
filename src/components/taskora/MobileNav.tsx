import { Settings } from "lucide-react";
import type { ViewKey } from "@/types/task";
import { NAV_ITEMS } from "@/data/nav";

interface MobileNavProps {
  view: ViewKey;
  onViewChange: (view: ViewKey) => void;
  onOpenSettings: () => void;
}

export function MobileNav({ view, onViewChange, onOpenSettings }: MobileNavProps) {
  return (
    <nav
      aria-label="Task views"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-between px-1">
        {NAV_ITEMS.map((item) => {
          const active = view === item.key;
          return (
            <li key={item.key} className="flex-1">
              <button
                type="button"
                onClick={() => onViewChange(item.key)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 w-full flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="size-5" aria-hidden="true" />
                <span className="truncate">{item.label.replace(" Tasks", "")}</span>
              </button>
            </li>
          );
        })}
        <li className="flex-1">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex min-h-14 w-full flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium text-muted-foreground"
          >
            <Settings className="size-5" aria-hidden="true" />
            <span>Settings</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
