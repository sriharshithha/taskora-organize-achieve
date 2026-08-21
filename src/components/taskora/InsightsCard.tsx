import { Sparkles } from "lucide-react";

interface InsightsCardProps {
  completed: number;
  rate: number;
  mostActive: string;
}

export function InsightsCard({ completed, rate, mostActive }: InsightsCardProps) {
  const rows = [
    { label: "Tasks completed", value: `${completed}` },
    { label: "Completion rate", value: `${rate}%` },
    { label: "Most active category", value: mostActive },
  ];

  return (
    <section className="card-surface p-5" aria-labelledby="week-insights-heading">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" aria-hidden="true" />
        <h2 id="week-insights-heading" className="text-sm font-semibold">
          This week
        </h2>
      </div>
      <dl className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3">
            <dt className="text-sm text-muted-foreground">{r.label}</dt>
            <dd className="truncate text-sm font-semibold">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-accent-green" style={{ width: `${rate}%` }} />
      </div>
    </section>
  );
}
