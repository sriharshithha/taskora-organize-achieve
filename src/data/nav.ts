import { CalendarClock, CheckCheck, ListTodo, Star, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ViewKey } from "@/types/task";

export interface NavItem {
  key: ViewKey;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "all", label: "All Tasks", icon: ListTodo },
  { key: "today", label: "Today", icon: Sun },
  { key: "upcoming", label: "Upcoming", icon: CalendarClock },
  { key: "completed", label: "Completed", icon: CheckCheck },
  { key: "important", label: "Important", icon: Star },
];
