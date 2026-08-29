import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";
import { buttonVariants } from "@/components/ui/kit";
import { CITY_LIST } from "@/lib/cities";

export const Route = createFileRoute("/cities/")({ component: Cities });

function Cities() {
  return (
    <PublicLayout>
      <PageHero
        kicker="Cities"
        title="Five playbooks. Same clipboard."
        lede="Risk fingerprints, not travel copy. Heuristics, labeled as such — not legal advice."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">
        {CITY_LIST.map((c) => (
          <Link
            key={c.slug}
            to="/cities/$slug"
            params={{ slug: c.slug }}
            className="rounded-xl bg-paper-dark p-6 no-underline transition-colors duration-150 hover:bg-paper-deep"
          >
            <p className="font-mono text-[11px] uppercase tracking-wider text-copper">{c.shortName}</p>
            <h2 className="mt-1 font-display text-3xl">{c.name}</h2>
            <p className="mt-3 text-ink-soft">{c.fingerprint}</p>
          </Link>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Link to="/signup" className={buttonVariants()}>
          Start a showing
        </Link>
      </div>
    </PublicLayout>
  );
}
