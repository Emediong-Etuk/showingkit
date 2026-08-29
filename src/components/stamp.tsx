import { cn } from "@/lib/utils";
import type { Verdict } from "@/lib/types";

export function Stamp({
  verdict,
  className,
}: {
  verdict?: Verdict | "UPCOMING" | null;
  className?: string;
}) {
  const v = verdict ?? "UPCOMING";
  const tone =
    v === "WALK"
      ? "text-danger"
      : v === "OFFER"
        ? "text-clear"
        : v === "NEGOTIATE"
          ? "text-copper"
          : "text-muted";
  return <span className={cn("stamp", tone, className)}>{v}</span>;
}
