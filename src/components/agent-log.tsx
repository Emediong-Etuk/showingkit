import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function AgentLog({
  ticks,
  running,
  onDone,
  stepMs = 700,
}: {
  ticks: readonly string[];
  running: boolean;
  onDone?: () => void;
  stepMs?: number;
}) {
  const [n, setN] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!running) {
      setN(0);
      return;
    }
    setN(1);
    let i = 1;
    const id = window.setInterval(() => {
      i += 1;
      if (i > ticks.length) {
        window.clearInterval(id);
        onDoneRef.current?.();
      } else {
        setN(i);
      }
    }, stepMs);
    return () => window.clearInterval(id);
  }, [running, ticks, stepMs]);

  if (!running && n === 0) return null;

  return (
    <ol className="tick-log space-y-2 rounded-lg bg-shell p-5 text-cream">
      {ticks.map((t, i) => {
        const on = i < n;
        const current = i === n - 1 && n < ticks.length;
        return (
          <li
            key={t}
            className={cn(
              "flex items-center gap-3 transition-opacity duration-200",
              on ? "opacity-100" : "opacity-30",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                current ? "bg-copper" : on ? "bg-clear" : "bg-muted",
              )}
            />
            {t}
          </li>
        );
      })}
    </ol>
  );
}
