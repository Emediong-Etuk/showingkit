import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  to = "/",
  tone = "ink",
}: {
  className?: string;
  to?: string;
  tone?: "ink" | "paper";
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-2 no-underline",
        tone === "paper" ? "text-cream" : "text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className="relative grid size-8 place-items-center rounded-[4px] bg-copper text-cream"
      >
        <span className="font-mono text-[10px] font-semibold tracking-wider">SK</span>
      </span>
      <span className="font-display text-xl tracking-tight">ShowingKit</span>
    </Link>
  );
}
