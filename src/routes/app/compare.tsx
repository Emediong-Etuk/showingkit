import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Stamp } from "@/components/stamp";
import { buttonVariants } from "@/components/ui/kit";
import { priceLabel } from "@/lib/format";
import { useKit } from "@/lib/store";

export const Route = createFileRoute("/app/compare")({ component: Compare });

function Compare() {
  const showings = useKit((s) => s.showings);
  const briefed = showings.filter((s) => s.brief);
  const [a, setA] = useState(briefed[0]?.id ?? "");
  const [b, setB] = useState(briefed[1]?.id ?? "");
  const left = showings.find((s) => s.id === a);
  const right = showings.find((s) => s.id === b);

  if (briefed.length < 2) {
    return (
      <div>
        <h1 className="font-display text-4xl">Compare</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Need two stamped briefs. The demo board has Troutman, Easterly, and Balham — open them, then come back.
        </p>
        <Link to="/app/showings" className={buttonVariants({ className: "mt-4" })}>
          Showings
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Compare</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <select className="h-11 rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep" value={a} onChange={(e) => setA(e.target.value)}>
          {briefed.map((s) => (
            <option key={s.id} value={s.id}>
              {s.address}
            </option>
          ))}
        </select>
        <select className="h-11 rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep" value={b} onChange={(e) => setB(e.target.value)}>
          {briefed.map((s) => (
            <option key={s.id} value={s.id}>
              {s.address}
            </option>
          ))}
        </select>
      </div>
      {left?.brief && right?.brief ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[left, right].map((s) => (
            <article key={s.id} className="rounded-xl bg-paper-dark p-5">
              <Stamp verdict={s.brief?.verdict} />
              <h2 className="mt-3 font-display text-2xl">{s.address}</h2>
              <p className="font-mono text-sm">{priceLabel(s.price, s.priceKind, s.currency)}</p>
              <p className="mt-2 text-sm text-copper">{s.brief?.dollarAsk}</p>
              <h3 className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">Top risks</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
                {s.brief?.discrepancies.slice(0, 5).map((d) => (
                  <li key={d.claim}>{d.claim}</li>
                ))}
              </ul>
              <h3 className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">Dealbreakers missed</h3>
              <ul className="mt-2 text-sm">
                {s.brief?.dealbreakerResults
                  .filter((d) => d.result === "fail")
                  .map((d) => (
                    <li key={d.id}>{d.label}</li>
                  ))}
              </ul>
            </article>
          ))}
        </div>
      ) : null}
      {left?.brief && right?.brief ? (
        <p className="mt-6 text-sm text-ink-soft">
          Quiet: {left.evidence.noise <= right.evidence.noise ? left.address : right.address} wins the noise slider.
          Legal bedroom:{" "}
          {left.brief.dealbreakerResults.find((d) => d.id === "db-legal-bed")?.result === "fail"
            ? right.address
            : left.address}{" "}
          is the safer stamp if one failed. Light is not instrumented — use the stills.
        </p>
      ) : null}
    </div>
  );
}
