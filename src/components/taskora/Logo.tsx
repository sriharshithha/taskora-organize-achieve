interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor">
          <path
            d="M4 12.5 9 17.5 20 6.5"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tight">Taskora</span>
          <span className="mt-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">
            Organize today.
          </span>
        </span>
      )}
    </div>
  );
}
