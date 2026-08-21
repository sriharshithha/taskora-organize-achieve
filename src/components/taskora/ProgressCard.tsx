import { AlertTriangle, CheckCircle2, Circle, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressCardProps {
  todayCompleted: number;
  todayTotal: number;
  completed: number;
  remaining: number;
  highPriority: number;
  streak: number;
}

export function ProgressCard({
  todayCompleted,
  todayTotal,
  completed,
  remaining,
  highPriority,
  streak,
}: ProgressCardProps) {
  const pct = todayTotal ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  const stats = [
    { label: "Completed", value: completed, icon: CheckCircle2, tone: "text-accent-green" },
    { label: "Remaining", value: remaining, icon: Circle, tone: "text-accent-blue" },
    { label: "High priority", value: highPriority, icon: AlertTriangle, tone: "text-accent-pink" },
  ];

  return (
    <section className="card-surface p-5" aria-labelledby="today-progress-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="today-progress-heading" className="text-sm font-semibold">
          Today&apos;s Progress
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-yellow/15 px-2.5 py-1 text-xs font-semibold text-accent-yellow">
          <Flame className="size-3.5" aria-hidden="true" />
          {streak} day streak
        </span>
      </div>

      <p className="mt-3 font-display text-2xl font-bold">
        {todayCompleted}
        <span className="text-muted-foreground">/{todayTotal}</span>{" "}
        <span className="text-sm font-medium text-muted-foreground">tasks done</span>
      </p>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Today's completion"
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-secondary/60 p-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <s.icon className={`size-3.5 ${s.tone}`} aria-hidden="true" />
              <span className="truncate">{s.label}</span>
            </dt>
            <dd className="mt-1 font-display text-xl font-bold">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
