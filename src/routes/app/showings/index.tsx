import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FieldStill } from "@/components/polaroid";
import { Stamp } from "@/components/stamp";
import { buttonVariants, pillClass } from "@/components/ui/kit";
import { formatDay, priceLabel } from "@/lib/format";
import { useKit } from "@/lib/store";
import type { Verdict } from "@/lib/types";

export const Route = createFileRoute("/app/showings/")({ component: Library });

type Filter = "ALL" | Verdict | "UPCOMING";

function Library() {
  const showings = useKit((s) => s.showings);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [sort, setSort] = useState<"date" | "risk">("date");

  const list = useMemo(() => {
    let rows = showings.filter((s) => `${s.address} ${s.neighborhood}`.toLowerCase().includes(q.toLowerCase()));
    if (filter === "UPCOMING") rows = rows.filter((s) => !s.brief);
    else if (filter !== "ALL") rows = rows.filter((s) => s.brief?.verdict === filter);
    rows = [...rows].sort((a, b) => {
      if (sort === "risk") {
        const rank = (v?: Verdict) => (v === "WALK" ? 3 : v === "NEGOTIATE" ? 2 : v === "OFFER" ? 1 : 0);
        return rank(b.brief?.verdict) - rank(a.brief?.verdict);
      }
      return (b.scheduledAt ?? b.createdAt).localeCompare(a.scheduledAt ?? a.createdAt);
    });
    return rows;
  }, [showings, q, filter, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-copper">Library</p>
          <h1 className="font-display text-4xl">Showings</h1>
        </div>
        <Link to="/app/showings/new" className={buttonVariants()}>
          New showing
        </Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search address"
          className="h-11 min-w-[180px] flex-1 rounded-md bg-paper-dark px-3"
        />
        {(["ALL", "WALK", "NEGOTIATE", "OFFER", "UPCOMING"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={pillClass(filter === f, "h-11 px-3 font-mono text-[11px] uppercase tracking-wider")}
          >
            {f}
          </button>
        ))}
        <button
          type="button"
          className={pillClass(sort === "risk", "h-11 px-3 text-sm")}
          onClick={() => setSort((s) => (s === "date" ? "risk" : "date"))}
        >
          Sort: {sort}
        </button>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {list.map((s) => (
          <Link
            key={s.id}
            to="/app/showings/$id"
            params={{ id: s.id }}
            className="flex gap-4 rounded-xl bg-paper-dark p-4 no-underline transition-colors duration-150 hover:bg-paper-deep"
          >
            {s.listingPhotos[0] ? (
              <FieldStill src={s.listingPhotos[0].src} alt={s.address} />
            ) : null}
            <div>
              <Stamp verdict={s.brief?.verdict ?? "UPCOMING"} className="text-[10px]" />
              <p className="mt-2 font-display text-xl">{s.address}</p>
              <p className="text-sm text-ink-soft">{formatDay(s.scheduledAt ?? s.createdAt)}</p>
              <p className="font-mono text-xs tabular-nums">
                {priceLabel(s.price, s.priceKind, s.currency)}
                {s.brief?.dollarAsk ? ` · ${s.brief.dollarAsk}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
