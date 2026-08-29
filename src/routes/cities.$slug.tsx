import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Advisory } from "@/components/disclaimer";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";
import { buttonVariants } from "@/components/ui/kit";
import { CITY_PLAYBOOKS } from "@/lib/cities";
import type { CitySlug } from "@/lib/types";

export const Route = createFileRoute("/cities/$slug")({
  component: CityPage,
});

function CityPage() {
  const { slug } = Route.useParams();
  const city = CITY_PLAYBOOKS[slug as CitySlug];
  if (!city) throw notFound();

  return (
    <PublicLayout>
      <PageHero
        kicker="City playbook"
        title={city.name}
        lede={city.fingerprint}
        action={
          <Link to="/app/showings/new" search={{ city: city.slug }} className={buttonVariants()}>
            Start a showing in {city.shortName}
          </Link>
        }
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 md:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl">Legal bedroom notes</h2>
          <p className="mt-3 text-ink-soft">{city.legalBedroom}</p>
          <h2 className="mt-8 font-display text-2xl">Egress</h2>
          <p className="mt-3 text-ink-soft">{city.egress}</p>
          <h2 className="mt-8 font-display text-2xl">Patterns</h2>
          <p className="mt-3 text-ink-soft">{city.patterns}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl">Top 8 shots</h2>
          <ol className="mt-4 space-y-4">
            {city.topShots.map((s, i) => (
              <li key={s.title}>
                <p className="font-mono text-[11px] text-copper">{String(i + 1).padStart(2, "0")}</p>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-ink-soft">{s.why}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <section className="border-t border-rule bg-paper-dark">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-2xl">Red-flag phrases</h2>
          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            {city.redFlags.map((r) => (
              <div key={r.phrase} className="rounded-lg bg-paper p-4">
                <dt className="font-mono text-sm text-copper">“{r.phrase}”</dt>
                <dd className="mt-2 text-sm text-ink-soft">{r.means}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <Advisory />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
