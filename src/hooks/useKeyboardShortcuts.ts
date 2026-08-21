import { useEffect } from "react";

interface Options {
  onNewTask: () => void;
  onFocusSearch: () => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function useKeyboardShortcuts({ onNewTask, onFocusSearch }: Options) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        onNewTask();
      } else if (e.key === "/") {
        e.preventDefault();
        onFocusSearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNewTask, onFocusSearch]);
}
