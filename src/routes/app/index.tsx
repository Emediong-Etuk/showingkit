import { createFileRoute, Link } from "@tanstack/react-router";
import { Stamp } from "@/components/stamp";
import { buttonVariants } from "@/components/ui/kit";
import { cityLabel, formatWhen, priceLabel } from "@/lib/format";
import { useKit } from "@/lib/store";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function Dashboard() {
  const showings = useKit((s) => s.showings);
  const user = useKit((s) => s.user);
  const upcoming = [...showings]
    .filter((s) => !s.brief)
    .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""))[0];
  const lastThree = showings.filter((s) => s.brief).slice(0, 3);
  const skipped = showings.flatMap((s) => s.shots.filter((sh) => sh.skipped).map((sh) => ({ s, sh })));
  const unsent = showings.flatMap((s) => s.texts.filter((t) => !t.copiedAt && !t.sentAt).map((t) => ({ s, t })));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-copper">Dashboard</p>
          <h1 className="font-display text-4xl">Field board</h1>
        </div>
        <Link to="/app/showings/new" className={buttonVariants()}>
          New showing
        </Link>
      </div>

      {upcoming ? (
        <section className="mt-8 rounded-xl bg-paper-dark p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Next showing</p>
          <h2 className="mt-1 font-display text-3xl">{upcoming.address}</h2>
          <p className="text-ink-soft">
            {upcoming.neighborhood} · {formatWhen(upcoming.scheduledAt)} · {upcoming.minutes} min
          </p>
          <p className="mt-2 font-mono text-sm tabular-nums">
            Time budget {upcoming.minutes} minutes · {upcoming.shots.filter((x) => !x.checked).length} shots remaining
          </p>
          <Link
            to="/app/showings/$id/script"
            params={{ id: upcoming.id }}
            className={buttonVariants({ className: "mt-4" })}
          >
            Open script
          </Link>
        </section>
      ) : (
        <p className="mt-8 text-ink-soft">No upcoming showing. File one.</p>
      )}

      <section className="mt-10">
        <h2 className="font-display text-2xl">Last briefs</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {lastThree.map((s) => (
            <Link key={s.id} to="/app/showings/$id/brief" params={{ id: s.id }} className="rounded-lg bg-paper-dark p-4 no-underline transition-colors duration-150 hover:bg-paper-deep">
              <Stamp verdict={s.brief?.verdict} className="text-[10px]" />
              <p className="mt-2 font-display text-xl">{s.address}</p>
              <p className="font-mono text-xs">{s.brief?.dollarAsk ?? priceLabel(s.price, s.priceKind, s.currency)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-paper-dark p-5">
          <h2 className="font-display text-2xl">Open loops</h2>
          <p className="mt-3 text-sm text-ink-soft">Skipped shots: {skipped.length || "none"}</p>
          {skipped.slice(0, 3).map(({ s, sh }) => (
            <p key={sh.id} className="mt-1 text-sm">
              {s.address} — {sh.title}
            </p>
          ))}
          <p className="mt-4 text-sm text-ink-soft">Unsent texts: {unsent.length || "none"}</p>
          {unsent.slice(0, 3).map(({ s, t }) => (
            <p key={t.id} className="mt-1 text-sm">
              {s.address} — {t.title}
            </p>
          ))}
        </div>
        <div className="rounded-xl bg-ink p-5 text-paper">
          <p className="font-mono text-[11px] uppercase tracking-wider text-copper">City risk of the week</p>
          <h2 className="mt-2 font-display text-2xl">
            {user ? cityLabel(user.defaultCity) : "NYC"}: listing tokens
          </h2>
          <p className="mt-3 text-sm text-paper/80">
            Flex, garden level, recently updated. Photograph the window and the kick. Heuristic, not a ruling.
          </p>
          <Link to="/cities/$slug" params={{ slug: "nyc" }} className={buttonVariants({ size: "sm", className: "mt-4" })}>
            Open playbook
          </Link>
        </div>
      </section>
    </div>
  );
}
