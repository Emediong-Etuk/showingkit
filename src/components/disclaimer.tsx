export function Advisory({ className = "" }: { className?: string }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.12em] text-muted ${className}`}>
      Advisory only — not a licensed inspection, not legal advice.
    </p>
  );
}
