import { Advisory } from "@/components/disclaimer";
import { Polaroid } from "@/components/polaroid";
import { Stamp } from "@/components/stamp";
import { cityLabel, formatWhen, money, priceLabel } from "@/lib/format";
import type { Showing } from "@/lib/types";

export function BriefDocument({
  showing,
  printId,
}: {
  showing: Showing;
  printId?: string;
}) {
  const brief = showing.brief;
  if (!brief) {
    return (
      <p className="text-muted">No brief yet. Run the agent from evidence.</p>
    );
  }

  return (
    <article
      id={printId}
      className="print-brief relative overflow-hidden rounded-xl bg-paper p-6 shadow-[var(--shadow-paper)] md:p-10"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Field brief · {cityLabel(showing.city)} · {formatWhen(brief.generatedAt)}
          </p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">{showing.address}</h1>
          <p className="text-ink-soft">{showing.neighborhood}</p>
          <p className="mt-1 font-mono text-sm tabular-nums">
            {priceLabel(showing.price, showing.priceKind, showing.currency)} · {showing.beds} bd / {showing.baths} ba
          </p>
        </div>
        <Stamp verdict={brief.verdict} className="text-base" />
      </div>

      {brief.weaker ? (
        <p className="mb-4 rounded-md bg-paper-dark px-3 py-2 font-mono text-xs text-ink-soft">
          Notes-only brief — labeled weaker. Photos would tighten the range.
        </p>
      ) : null}

      <p className="max-w-3xl text-lg leading-relaxed">{brief.verdictSentences}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Stat label="Confidence" value={`${brief.confidence}%`} />
        <Stat label="Walk-away" value={brief.walkAwayRange} />
        <Stat label="Best case" value={brief.bestCaseRange} />
      </div>
      <p className="mt-2 text-sm text-muted">{brief.confidenceWhy}</p>
      {brief.dollarAsk ? (
        <p className="mt-3 font-mono text-sm text-copper">Ask range: {brief.dollarAsk}</p>
      ) : null}

      <h2 className="mt-10 font-display text-2xl">Discrepancies</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              <th className="py-2 pr-3">Claim</th>
              <th className="py-2 pr-3">Evidence</th>
              <th className="py-2 pr-3">Severity</th>
              <th className="py-2">$ impact</th>
            </tr>
          </thead>
          <tbody>
            {brief.discrepancies.map((d) => (
              <tr key={d.claim} className="border-t border-rule align-top">
                <td className="py-3 pr-3 font-medium">{d.claim}</td>
                <td className="py-3 pr-3 text-ink-soft">{d.evidence}</td>
                <td className="py-3 pr-3 font-mono uppercase text-xs">{d.severity}</td>
                <td className="py-3 font-mono text-xs">{d.dollarImpact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {brief.photoPairs.length ? (
        <>
          <h2 className="mt-10 font-display text-2xl">Listing vs visit</h2>
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            {brief.photoPairs.map((p) => (
              <div key={p.callout} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {p.listingSrc ? (
                    <Polaroid src={p.listingSrc} alt={p.listingLabel} caption={p.listingLabel} rotate={-1.5} />
                  ) : (
                    <div className="bg-paper-dark p-4 text-sm text-muted">No listing still</div>
                  )}
                  {p.visitSrc ? (
                    <Polaroid src={p.visitSrc} alt={p.visitLabel} caption={p.visitLabel} rotate={2} />
                  ) : (
                    <div className="bg-paper-dark p-4 text-sm text-muted">No visit still</div>
                  )}
                </div>
                <p className="text-sm text-ink-soft">{p.callout}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <h2 className="mt-10 font-display text-2xl">Dealbreakers</h2>
      <ul className="mt-3 space-y-2">
        {brief.dealbreakerResults.map((d) => (
          <li key={d.id} className="flex flex-wrap items-baseline gap-2 text-sm">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{d.result}</span>
            <span className="font-medium">{d.label}</span>
            <span className="text-ink-soft">— {d.note}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-2xl">City heuristics</h2>
      <ul className="mt-3 space-y-2">
        {brief.cityFlags.map((f) => (
          <li key={f.flag} className="text-sm">
            <span className="font-medium">{f.flag}.</span>{" "}
            <span className="text-ink-soft">{f.heuristic}</span>
          </li>
        ))}
      </ul>

      {brief.missingShots.length ? (
        <>
          <h2 className="mt-10 font-display text-2xl">Shots still missing</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            {brief.missingShots.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="mt-10">
        <Advisory />
        <p className="mt-2 text-xs text-muted">
          Budget on file: {showing.budget ? money(showing.budget, showing.currency) : "—"}. ShowingKit is a field notebook, not a certificate.
        </p>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper-dark px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 font-display text-lg leading-snug">{value}</p>
    </div>
  );
}
