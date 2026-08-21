import { useEffect } from "react";
import type { ThemeMode } from "@/types/task";

export function useTheme(mode: ThemeMode, enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const root = document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const dark = mode === "dark" || (mode === "system" && mql.matches);
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    };

    apply();
    if (mode !== "system") return;
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [mode, enabled]);
}
