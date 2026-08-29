import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";
import { GUIDES } from "@/lib/guides";

export const Route = createFileRoute("/guides/")({ component: Guides });

function Guides() {
  return (
    <PublicLayout>
      <PageHero
        kicker="Guides"
        title="Dry field notes. No coach voice."
        lede="How to photograph a unit, how listings lie, what flex usually means, and what this kit is not."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            to="/guides/$slug"
            params={{ slug: g.slug }}
            className="rounded-xl bg-paper-dark p-6 no-underline transition-colors duration-150 hover:bg-paper-deep"
          >
            <p className="font-mono text-[11px] text-muted">{g.minutes} min read</p>
            <h2 className="mt-2 font-display text-2xl">{g.title}</h2>
            <p className="mt-2 text-ink-soft">{g.dek}</p>
          </Link>
        ))}
      </div>
    </PublicLayout>
  );
}
