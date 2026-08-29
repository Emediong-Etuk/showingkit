import { Link } from "@tanstack/react-router";
import { pillClass } from "@/components/ui/kit";
import { Stamp } from "@/components/stamp";
import type { Showing } from "@/lib/types";

const STEPS = [
  { key: "listing", to: "", label: "Listing" },
  { key: "script", to: "/script", label: "Script" },
  { key: "evidence", to: "/evidence", label: "Evidence" },
  { key: "brief", to: "/brief", label: "Brief" },
  { key: "texts", to: "/texts", label: "Texts" },
] as const;

export function ShowingHeader({ showing }: { showing: Showing }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{showing.neighborhood}</p>
        <h1 className="font-display text-3xl">{showing.address}</h1>
      </div>
      <Stamp verdict={showing.brief?.verdict ?? (showing.status === "listing" || showing.status === "script" ? "UPCOMING" : null)} />
    </div>
  );
}

export function ShowingNav({ id, current }: { id: string; current: string }) {
  return (
    <nav className="no-print mb-6 flex gap-1 overflow-x-auto pb-1">
      {STEPS.map((s) => {
        const to = s.to ? `/app/showings/${id}${s.to}` : `/app/showings/${id}`;
        const on = current === s.key;
        return (
          <Link
            key={s.key}
            to={to}
            className={pillClass(on, "shrink-0 px-3 py-2 font-mono text-[11px] uppercase tracking-wider")}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
